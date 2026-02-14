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
      className="group flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md transition-all cursor-pointer"
    >
      <span className="font-semibold text-blue-700 group-hover:text-blue-900">
        {abbreviation}
      </span>
      <span className="text-xs text-blue-400 group-hover:text-blue-600">
        {name}
      </span>
    </button>
  );
}
