"use client";

import { StateData } from "@/lib/types";
import StatePill from "./StatePill";

interface StateGridProps {
  states: Record<string, StateData>;
  onSelectState: (fips: string) => void;
}

export default function StateGrid({
  states,
  onSelectState,
}: StateGridProps) {
  const sortedStates = Object.entries(states).sort(([, a], [, b]) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
      {sortedStates.map(([fips, state]) => (
        <StatePill
          key={fips}
          name={state.name}
          abbreviation={state.abbreviation}
          onClick={() => onSelectState(fips)}
        />
      ))}
    </div>
  );
}
