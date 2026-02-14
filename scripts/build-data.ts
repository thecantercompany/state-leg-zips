import fs from "fs";
import path from "path";
import https from "https";
import { STATE_FIPS } from "../lib/fips";

const SLDL_URL =
  "https://www2.census.gov/geo/docs/maps-data/data/rel2020/cd-sld/tab20_sldl202420_zcta520_natl.txt";
const SLDU_URL =
  "https://www2.census.gov/geo/docs/maps-data/data/rel2020/cd-sld/tab20_sldu202420_zcta520_natl.txt";

const RAW_DIR = path.join(__dirname, "..", "data", "raw");
const OUTPUT_DIR = path.join(__dirname, "..", "public", "data");

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            file.close();
            fs.unlinkSync(dest);
            return download(redirectUrl, dest).then(resolve).catch(reject);
          }
        }
        if (response.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          reject(new Error(`HTTP ${response.statusCode} for ${url}`));
          return;
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        file.close();
        fs.unlinkSync(dest);
        reject(err);
      });
  });
}

interface RawRow {
  stateFips: string;
  districtNum: string;
  zcta: string;
  districtName: string;
}

function parseFile(
  filePath: string,
  chamber: "upper" | "lower"
): RawRow[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.trim().split("\n");

  // First line is the header — find column indices
  const header = lines[0].split("|");

  const geoidCol = header.findIndex((h) =>
    chamber === "lower"
      ? h.startsWith("GEOID_SLDL")
      : h.startsWith("GEOID_SLDU")
  );
  const nameCol = header.findIndex((h) =>
    chamber === "lower"
      ? h.startsWith("NAMELSAD_SLDL")
      : h.startsWith("NAMELSAD_SLDU")
  );
  const zctaCol = header.findIndex((h) => h.startsWith("GEOID_ZCTA5"));

  if (geoidCol === -1 || nameCol === -1 || zctaCol === -1) {
    throw new Error(
      `Could not find required columns in ${filePath}. Header: ${header.join(", ")}`
    );
  }

  const rows: RawRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split("|");
    if (cols.length < Math.max(geoidCol, nameCol, zctaCol) + 1) continue;

    const geoid = cols[geoidCol].trim();
    const name = cols[nameCol].trim();
    const zcta = cols[zctaCol].trim();

    if (!geoid || !zcta || geoid.length < 3) continue;

    // GEOID format: 2-digit state FIPS + district number (variable length)
    const stateFips = geoid.substring(0, 2);
    const districtNum = geoid.substring(2).replace(/^0+/, "") || "0";

    // Skip territories and DC (only keep 50 states)
    if (!STATE_FIPS[stateFips]) continue;

    // Skip "ZZ" districts (unassigned/at-large placeholders with all Z's)
    if (districtNum.match(/^Z+$/i)) continue;

    rows.push({ stateFips, districtNum, zcta, districtName: name });
  }

  return rows;
}

interface DistrictInfo {
  name: string;
  zips: Set<string>;
}

interface StateEntry {
  name: string;
  abbreviation: string;
  upper: Map<string, DistrictInfo>;
  lower: Map<string, DistrictInfo>;
}

async function main() {
  // Ensure directories exist
  fs.mkdirSync(RAW_DIR, { recursive: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Download files if not cached locally
  const sldlPath = path.join(RAW_DIR, "sldl_zcta.txt");
  const slduPath = path.join(RAW_DIR, "sldu_zcta.txt");

  if (!fs.existsSync(sldlPath)) {
    console.log("Downloading SLDL (House) relationship file...");
    await download(SLDL_URL, sldlPath);
    console.log("  Done.");
  } else {
    console.log("Using cached SLDL file.");
  }

  if (!fs.existsSync(slduPath)) {
    console.log("Downloading SLDU (Senate) relationship file...");
    await download(SLDU_URL, slduPath);
    console.log("  Done.");
  } else {
    console.log("Using cached SLDU file.");
  }

  // Parse both files
  console.log("\nParsing SLDL (House) data...");
  const lowerRows = parseFile(sldlPath, "lower");
  console.log(`  ${lowerRows.length} rows parsed.`);

  console.log("Parsing SLDU (Senate) data...");
  const upperRows = parseFile(slduPath, "upper");
  console.log(`  ${upperRows.length} rows parsed.`);

  // Build state map
  const stateMap = new Map<string, StateEntry>();

  for (const [fips, info] of Object.entries(STATE_FIPS)) {
    stateMap.set(fips, {
      name: info.name,
      abbreviation: info.abbreviation,
      upper: new Map(),
      lower: new Map(),
    });
  }

  // Process lower chamber (House) rows
  for (const row of lowerRows) {
    const state = stateMap.get(row.stateFips);
    if (!state) continue;

    if (!state.lower.has(row.districtNum)) {
      state.lower.set(row.districtNum, {
        name: row.districtName,
        zips: new Set(),
      });
    }
    state.lower.get(row.districtNum)!.zips.add(row.zcta);
  }

  // Process upper chamber (Senate) rows
  for (const row of upperRows) {
    const state = stateMap.get(row.stateFips);
    if (!state) continue;

    if (!state.upper.has(row.districtNum)) {
      state.upper.set(row.districtNum, {
        name: row.districtName,
        zips: new Set(),
      });
    }
    state.upper.get(row.districtNum)!.zips.add(row.zcta);
  }

  // Convert to JSON-serializable structure
  const output: Record<string, unknown> = {
    states: {} as Record<string, unknown>,
    metadata: {
      generatedAt: new Date().toISOString(),
      source: "US Census Bureau 2024 SLD Relationship Files",
      zcta_vintage: "2020",
      legislative_session: "2024",
    },
  };

  const states = output.states as Record<string, unknown>;
  const stateUpdates: Record<string, string> = {};
  const today = new Date().toISOString().split("T")[0];

  let totalUpperDistricts = 0;
  let totalLowerDistricts = 0;
  let totalUniqueZctas = new Set<string>();

  for (const [fips, state] of stateMap) {
    const stateEntry: Record<string, unknown> = {
      name: state.name,
      abbreviation: state.abbreviation,
      chambers: {} as Record<string, unknown>,
    };

    const chambers = stateEntry.chambers as Record<string, unknown>;

    if (state.upper.size > 0) {
      const districts: Record<string, { name: string; zips: string[] }> = {};
      for (const [num, info] of state.upper) {
        const sortedZips = Array.from(info.zips).sort();
        districts[num] = { name: info.name, zips: sortedZips };
        sortedZips.forEach((z) => totalUniqueZctas.add(z));
      }
      chambers.upper = { districts };
      totalUpperDistricts += state.upper.size;
    }

    if (state.lower.size > 0) {
      const districts: Record<string, { name: string; zips: string[] }> = {};
      for (const [num, info] of state.lower) {
        const sortedZips = Array.from(info.zips).sort();
        districts[num] = { name: info.name, zips: sortedZips };
        sortedZips.forEach((z) => totalUniqueZctas.add(z));
      }
      chambers.lower = { districts };
      totalLowerDistricts += state.lower.size;
    }

    states[fips] = stateEntry;
    stateUpdates[state.abbreviation] = today;
  }

  // Write districts.json
  const outputPath = path.join(OUTPUT_DIR, "districts.json");
  fs.writeFileSync(outputPath, JSON.stringify(output));
  const fileSizeMB = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
  console.log(`\nWrote ${outputPath} (${fileSizeMB} MB)`);

  // Write state-updates.json
  const updatesPath = path.join(OUTPUT_DIR, "state-updates.json");
  fs.writeFileSync(updatesPath, JSON.stringify(stateUpdates, null, 2));
  console.log(`Wrote ${updatesPath}`);

  // Summary
  console.log("\n--- Summary ---");
  console.log(`States: ${stateMap.size}`);
  console.log(`Upper (Senate) districts: ${totalUpperDistricts}`);
  console.log(`Lower (House) districts: ${totalLowerDistricts}`);
  console.log(`Unique ZCTAs: ${totalUniqueZctas.size}`);

  // Validate: check for states with no districts
  for (const [fips, state] of stateMap) {
    if (state.upper.size === 0 && state.lower.size === 0) {
      console.warn(`WARNING: ${state.name} (${fips}) has no districts at all`);
    }
    // Nebraska should only have upper (unicameral)
    if (state.abbreviation === "NE" && state.lower.size > 0) {
      console.warn("WARNING: Nebraska has lower chamber data (unexpected)");
    }
    if (state.abbreviation === "NE" && state.upper.size === 0) {
      console.warn("WARNING: Nebraska has no upper chamber data (unexpected)");
    }
  }
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
