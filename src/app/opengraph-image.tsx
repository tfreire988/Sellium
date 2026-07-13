import { ImageResponse } from "next/og";

/**
 * Social share card (WhatsApp / LinkedIn / X). Kept to system serif + the
 * brand palette — the goal is a recognisable, readable card, not a pixel copy
 * of the landing.
 */
export const alt = "Sellium — Tu huella de carbono, lista en un día";
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
          justifyContent: "space-between",
          padding: "72px 84px",
          backgroundColor: "#1c2620",
          color: "#f2eee0",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 9999,
              border: "3px solid #B8763A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#B8763A",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 42, fontWeight: 700 }}>Sellium</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.12,
              maxWidth: 950,
            }}
          >
            Tu huella de carbono, lista en un día.
          </div>
          <div style={{ fontSize: 27, color: "#8c9689" }}>
            Factores oficiales MITECO · GHG Protocol · Gratis durante la beta
          </div>
        </div>
      </div>
    ),
    size,
  );
}
