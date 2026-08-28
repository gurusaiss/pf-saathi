import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#FAF9F6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", color: "#C79A2E", fontSize: 28, fontWeight: 700, letterSpacing: 2 }}>
          PF SAATHI
        </div>
        <div
          style={{
            display: "flex",
            color: "#1B2A63",
            fontSize: 56,
            fontWeight: 800,
            marginTop: 20,
            lineHeight: 1.2,
            maxWidth: 900,
          }}
        >
          Understand your PF. Find what&apos;s wrong. Know what to do next.
        </div>
        <div style={{ display: "flex", color: "#6B6A66", fontSize: 26, marginTop: 30 }}>
          A citizen-first layer over India&apos;s EPFO
        </div>
      </div>
    ),
    size
  );
}
