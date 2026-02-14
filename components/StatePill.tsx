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
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-200 cursor-pointer"
    >
      <img
        src={`/flags/${abbreviation}.svg`}
        alt=""
        className="w-5 h-5 rounded-sm"
      />
      <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 transition-colors duration-200">
        {name}
      </span>
    </button>
  );
}
