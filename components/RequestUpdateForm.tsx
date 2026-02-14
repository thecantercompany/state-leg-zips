"use client";

import { useState } from "react";

interface RequestUpdateFormProps {
  stateName: string;
  stateCode: string;
  onClose: () => void;
}

export default function RequestUpdateForm({
  stateName,
  stateCode,
  onClose,
}: RequestUpdateFormProps) {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/request-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: stateName,
          stateCode,
          email: email || undefined,
          note: note || undefined,
        }),
      });

      if (res.ok) {
        setStatus("sent");
        setTimeout(onClose, 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl text-center">
          <div className="text-green-500 text-3xl mb-2">✓</div>
          <p className="text-blue-900 font-medium">Request sent!</p>
          <p className="text-sm text-blue-400 mt-1">
            We&apos;ll update {stateName} data soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-900">
            Request Update for {stateName}
          </h3>
          <button
            onClick={onClose}
            className="text-blue-400 hover:text-blue-600 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-blue-600 mb-1">
              Your email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm text-blue-600 mb-1">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any details about what you need..."
              rows={2}
              className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === "sending"}
              className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {status === "sending" ? "Sending..." : "Send Request"}
            </button>
          </div>
          {status === "error" && (
            <p className="text-red-500 text-xs text-center">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
