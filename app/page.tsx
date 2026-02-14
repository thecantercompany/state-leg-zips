"use client";

import { useState, useEffect, useCallback } from "react";
import { DistrictData, StateUpdates } from "@/lib/types";
import StateGrid from "@/components/StateGrid";
import DistrictView from "@/components/DistrictView";
import CopyToast from "@/components/CopyToast";
import Footer from "@/components/Footer";

export default function Home() {
  const [data, setData] = useState<DistrictData | null>(null);
  const [stateUpdates, setStateUpdates] = useState<StateUpdates>({});
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/data/districts.json").then((r) => r.json()),
      fetch("/data/state-updates.json").then((r) => r.json()),
    ])
      .then(([districtData, updates]) => {
        setData(districtData);
        setStateUpdates(updates);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setLoading(false);
      });
  }, []);

  const handleCopied = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  const handleDismissToast = useCallback(() => {
    setToastVisible(false);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-blue-400 text-lg">Loading district data...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">
          Failed to load data. Please refresh.
        </div>
      </div>
    );
  }

  const selectedStateData = selectedState
    ? data.states[selectedState]
    : null;

  return (
    <div className="h-screen flex flex-col px-4 py-8 max-w-6xl mx-auto overflow-hidden">
      <header className="text-center mb-10 shrink-0">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          State Leg ZIPs
        </h1>
        <p className="text-blue-500 text-sm max-w-lg mx-auto">
          Copy ZIP codes by state legislative district. Click a state, then
          click a district to copy its ZIPs to your clipboard.
        </p>
      </header>

      <main className="flex-1 min-h-0 overflow-auto">
        {selectedStateData ? (
          <DistrictView
            state={selectedStateData}
            stateFips={selectedState!}
            stateUpdates={stateUpdates}
            onBack={() => setSelectedState(null)}
            onCopied={handleCopied}
          />
        ) : (
          <StateGrid
            states={data.states}
            onSelectState={setSelectedState}
          />
        )}
      </main>

      <CopyToast
        message={toastMessage}
        visible={toastVisible}
        onDismiss={handleDismissToast}
      />

      <Footer />
    </div>
  );
}
