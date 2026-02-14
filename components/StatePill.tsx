"use client";

interface StatePillProps {
  name: string;
  abbreviation: string;
  onClick: () => void;
}

export default function StatePill({
  name,
  abbreviation,
  onClick,
}: StatePillProps) {
  const handleClick = () => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "state_click", {
        state_name: name,
        state_abbreviation: abbreviation,
      });
    }
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="group flex flex-col items-center justify-center gap-1 w-full h-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-200 cursor-pointer"
    >
      <img
        src={`/flags/${abbreviation}.svg`}
        alt=""
        className="rounded-sm"
        style={{ width: "var(--pill-icon-size, 20px)", height: "var(--pill-icon-size, 20px)" }}
      />
      <span
        className="font-semibold text-slate-700 group-hover:text-blue-700 transition-colors duration-200 text-center leading-tight"
        style={{ fontSize: "var(--pill-font-size, 12px)" }}
      >
        {name}
      </span>
    </button>
  );
}
