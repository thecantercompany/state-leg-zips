"use client";

import { useState } from "react";

interface DistrictPillProps {
  number: string;
  name: string;
  zips: string[];
  onCopied: (message: string) => void;
}

export default function DistrictPill({
  number,
  name,
  zips,
  onCopied,
}: DistrictPillProps) {
  const [justCopied, setJustCopied] = useState(false);

  const trackCopy = () => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "zip_copy", {
        district_name: name,
        zip_count: zips.length,
      });
    }
  };

  const handleClick = async () => {
    const csv = zips.join(",");
    try {
      await navigator.clipboard.writeText(csv);
      setJustCopied(true);
      onCopied(`Copied! (${zips.length} ZIPs from ${name})`);
      trackCopy();
      setTimeout(() => setJustCopied(false), 1500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = csv;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setJustCopied(true);
      onCopied(`Copied! (${zips.length} ZIPs from ${name})`);
      trackCopy();
      setTimeout(() => setJustCopied(false), 1500);
    }
  };

  return (
    <button
      onClick={handleClick}
      title={`${name} — ${zips.length} ZIPs (click to copy)`}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
        justCopied
          ? "bg-emerald-500 text-white scale-95 shadow-md ring-2 ring-emerald-300"
          : "bg-white border border-slate-200 text-slate-700 shadow-sm hover:shadow-md hover:border-blue-400 hover:text-blue-700 hover:-translate-y-px active:translate-y-0 active:shadow-none"
      }`}
    >
      {justCopied ? (
        <span className="animate-pulse-check inline-block">✓</span>
      ) : (
        number
      )}
    </button>
  );
}
