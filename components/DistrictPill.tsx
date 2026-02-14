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

  const handleClick = async () => {
    const csv = zips.join(",");
    try {
      await navigator.clipboard.writeText(csv);
      setJustCopied(true);
      onCopied(`Copied! (${zips.length} ZIPs from ${name})`);
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
      setTimeout(() => setJustCopied(false), 1500);
    }
  };

  return (
    <button
      onClick={handleClick}
      title={`${name} — ${zips.length} ZIPs (click to copy)`}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
        justCopied
          ? "bg-green-500 text-white scale-95"
          : "bg-white border border-blue-200 text-blue-700 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm"
      }`}
    >
      {justCopied ? "✓" : number}
    </button>
  );
}
