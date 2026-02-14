"use client";

import { useRef, useState, useEffect } from "react";
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

  const containerRef = useRef<HTMLDivElement>(null);
  const [gridStyle, setGridStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const calculate = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      const count = sortedStates.length;
      const gap = 10; // gap-2.5 = 0.625rem ≈ 10px

      // Determine columns based on available width
      // Min pill width ~100px, max ~160px
      const minPillWidth = 100;
      const cols = Math.max(3, Math.min(10, Math.floor((width + gap) / (minPillWidth + gap))));
      const rows = Math.ceil(count / cols);

      // Calculate pill height to fill available vertical space
      const availableHeight = height;
      const totalGapHeight = (rows - 1) * gap;
      const pillHeight = Math.floor((availableHeight - totalGapHeight) / rows);

      // Clamp pill height to reasonable bounds
      const clampedHeight = Math.max(50, Math.min(120, pillHeight));

      // Scale font and icon based on pill height
      // At 50px height → 10px font, 16px icon; at 120px → 16px font, 28px icon
      const t = (clampedHeight - 50) / 70; // 0 to 1
      const fontSize = Math.round(10 + t * 6);
      const iconSize = Math.round(16 + t * 12);

      setGridStyle({
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: `${gap}px`,
        gridAutoRows: `${clampedHeight}px`,
        // Pass sizing info via CSS custom properties
        "--pill-font-size": `${fontSize}px`,
        "--pill-icon-size": `${iconSize}px`,
      } as React.CSSProperties);
    };

    calculate();

    const observer = new ResizeObserver(calculate);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [sortedStates.length]);

  return (
    <div ref={containerRef} className="h-full" style={gridStyle}>
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
