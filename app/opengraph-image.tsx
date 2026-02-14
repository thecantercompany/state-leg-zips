import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "State Leg ZIPs - Copy ZIP codes by state legislative district for ad targeting";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const stateAbbrs = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle grid of state abbreviations in background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexWrap: "wrap",
            alignContent: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "40px 60px",
            opacity: 0.08,
          }}
        >
          {stateAbbrs.map((s) => (
            <div
              key={s}
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#1e293b",
                padding: "4px 8px",
              }}
            >
              {s}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            zIndex: 1,
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "18px",
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "38px",
              fontWeight: 800,
              boxShadow: "0 8px 30px rgba(59, 130, 246, 0.3)",
            }}
          >
            SL
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-2px",
              lineHeight: 1.1,
              textAlign: "center",
            }}
          >
            State Leg ZIPs
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "26px",
              color: "#475569",
              textAlign: "center",
              maxWidth: "700px",
              lineHeight: 1.4,
            }}
          >
            Copy ZIP codes by state legislative district for ad targeting
          </div>

          {/* Pill badges */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "8px",
            }}
          >
            {["50 States", "House & Senate", "One-Click Copy"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    fontSize: "18px",
                    fontWeight: 600,
                    padding: "8px 20px",
                    borderRadius: "999px",
                  }}
                >
                  {label}
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "6px",
            background: "linear-gradient(90deg, #3b82f6, #10b981, #3b82f6)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
