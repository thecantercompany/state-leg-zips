"use client";

import { useState } from "react";
import { StateData, StateUpdates } from "@/lib/types";
import DistrictPill from "./DistrictPill";

interface DistrictViewProps {
  state: StateData;
  stateFips: string;
  stateUpdates: StateUpdates;
  onBack: () => void;
  onCopied: (message: string) => void;
}

export default function DistrictView({
  state,
  stateUpdates,
  onBack,
  onCopied,
}: DistrictViewProps) {
  const [updateStatus, setUpdateStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const handleRequestUpdate = async () => {
    setUpdateStatus("sending");
    try {
      const res = await fetch("/api/request-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: state.name,
          stateCode: state.abbreviation,
        }),
      });
      setUpdateStatus(res.ok ? "sent" : "error");
    } catch {
      setUpdateStatus("error");
    }
  };
  const isNebraska = state.abbreviation === "NE";
  const upper = state.chambers.upper;
  const lower = state.chambers.lower;

  const sortedUpperDistricts = upper
    ? Object.entries(upper.districts).sort(
        ([a], [b]) => parseInt(a) - parseInt(b)
      )
    : [];

  const sortedLowerDistricts = lower
    ? Object.entries(lower.districts).sort(
        ([a], [b]) => parseInt(a) - parseInt(b)
      )
    : [];

  const lastUpdated = stateUpdates[state.abbreviation];
  const formattedDate = lastUpdated
    ? new Date(lastUpdated + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-slate-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200 cursor-pointer"
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
          All States
        </button>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          {formattedDate && <span>Updated {formattedDate}</span>}
          <button
            onClick={handleRequestUpdate}
            disabled={updateStatus === "sending" || updateStatus === "sent"}
            className={`cursor-pointer ${
              updateStatus === "sent"
                ? "text-emerald-500"
                : updateStatus === "error"
                  ? "text-red-500 underline"
                  : "hover:underline hover:text-blue-600"
            } ${updateStatus === "sending" ? "opacity-50" : ""}`}
          >
            {updateStatus === "sending"
              ? "Sending..."
              : updateStatus === "sent"
                ? "✓ Requested"
                : updateStatus === "error"
                  ? "Failed — retry?"
                  : "Request Update"}
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-1">{state.name}</h2>
      <p className="text-sm text-slate-400 mb-8">
        Click a district to copy its ZIP codes
      </p>

      {isNebraska ? (
        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
            Legislature
          </h3>
          <div className="flex flex-wrap gap-2">
            {sortedUpperDistricts.map(([num, district]) => (
              <DistrictPill
                key={num}
                number={num}
                name={district.name}
                zips={district.zips}
                onCopied={onCopied}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {lower && sortedLowerDistricts.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                House Districts
                <span className="text-sm font-normal text-slate-400 ml-2">
                  ({sortedLowerDistricts.length})
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {sortedLowerDistricts.map(([num, district]) => (
                  <DistrictPill
                    key={num}
                    number={num}
                    name={district.name}
                    zips={district.zips}
                    onCopied={onCopied}
                  />
                ))}
              </div>
            </div>
          )}
          {upper && sortedUpperDistricts.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                Senate Districts
                <span className="text-sm font-normal text-slate-400 ml-2">
                  ({sortedUpperDistricts.length})
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {sortedUpperDistricts.map(([num, district]) => (
                  <DistrictPill
                    key={num}
                    number={num}
                    name={district.name}
                    zips={district.zips}
                    onCopied={onCopied}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
