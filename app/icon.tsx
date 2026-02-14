import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#3b82f6",
          borderRadius: "6px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "white",
            letterSpacing: "-1px",
          }}
        >
          SL
        </div>
      </div>
    ),
    { ...size }
  );
}
