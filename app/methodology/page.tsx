import Link from "next/link";

export default function Methodology() {
  return (
    <div className="h-screen flex flex-col px-4 py-8 max-w-3xl mx-auto overflow-hidden">
      <div className="shrink-0 mb-8">
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to States
        </Link>
      </div>

      <main className="flex-1 min-h-0 overflow-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Methodology</h1>

        <div className="space-y-6 text-blue-800 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Where the ZIP codes come from
            </h2>
            <p>
              All ZIP code data on this site comes from the{" "}
              <a
                href="https://www.census.gov/geographies/mapping-files/2024/dec/rdo/116-congressional-and-2024-state-legislative-district-background.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                U.S. Census Bureau&apos;s relationship files
              </a>
              , which map ZIP Code Tabulation Areas (ZCTAs) to state legislative
              districts.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              What is a ZCTA?
            </h2>
            <p>
              A ZCTA (ZIP Code Tabulation Area) is the Census Bureau&apos;s
              approximation of a USPS ZIP code delivery area. ZCTAs are built
              from census blocks and are designed to closely match ZIP code
              boundaries. For practical purposes like ad targeting, ZCTAs and ZIP
              codes are interchangeable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              How districts are matched to ZIP codes
            </h2>
            <p>
              The Census Bureau publishes files that show where legislative
              districts and ZCTAs overlap geographically. If any part of a ZIP
              code area falls within a legislative district, that ZIP code is
              included in the district&apos;s list. This means a single ZIP code
              can appear in multiple districts when it straddles a boundary.
            </p>
            <p className="mt-2">
              We intentionally include ZIP codes in all overlapping districts
              rather than assigning each ZIP to only one. This provides better
              reach for ad targeting, since you won&apos;t miss voters who live
              near a district boundary.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Data vintage
            </h2>
            <p>
              The current data uses <strong>2024 state legislative district boundaries</strong>{" "}
              and <strong>2020 ZCTA boundaries</strong>, as published by the
              Census Bureau. District boundaries reflect the latest redistricting
              cycle.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Limitations
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                ZCTAs are approximations of USPS ZIP codes, not exact matches.
                Some ZIP codes used for PO boxes or unique delivery routes may
                not have a corresponding ZCTA.
              </li>
              <li>
                Boundary overlaps mean some ZIP codes appear in multiple
                districts. This is by design for ad targeting but may not be
                appropriate for every use case.
              </li>
              <li>
                Data is as current as the Census Bureau&apos;s latest release.
                If a state redistricts mid-decade, there may be a lag before
                updated data is available.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Source files
            </h2>
            <p>The raw Census Bureau relationship files used:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong>House districts:</strong>{" "}
                <code className="text-xs bg-blue-100 px-1 py-0.5 rounded">
                  tab20_sldl202420_zcta520_natl.txt
                </code>
              </li>
              <li>
                <strong>Senate districts:</strong>{" "}
                <code className="text-xs bg-blue-100 px-1 py-0.5 rounded">
                  tab20_sldu202420_zcta520_natl.txt
                </code>
              </li>
            </ul>
            <p className="mt-2">
              These files are available from the{" "}
              <a
                href="https://www2.census.gov/geo/docs/maps-data/data/rel2020/cd-sld/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                Census Bureau&apos;s geographic relationship files page
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="shrink-0 pt-4 pb-4 text-center">
        <p className="text-xs text-blue-400">
          <Link href="/" className="hover:text-blue-600 underline">
            State Leg ZIPs
          </Link>
        </p>
      </footer>
    </div>
  );
}
