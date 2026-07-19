import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — Smashburgers uit de Hoeksche Waard`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          backgroundColor: "rgb(10, 10, 10)",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255, 90, 31, 0.35), transparent 45%)",
          color: "white",
          fontFamily: "ui-sans-serif, system-ui",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgb(255, 90, 31)" }}>
          Smashburgers · Hoeksche Waard
        </div>
        <div style={{ marginTop: 18, fontSize: 96, lineHeight: 0.95, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 800 }}>
          {site.name}
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: "rgb(234, 234, 234)", maxWidth: 900, lineHeight: 1.25 }}>
          Afhalen, bezorgen of catering op aanvraag.
        </div>
      </div>
    ),
    { ...size },
  );
}
