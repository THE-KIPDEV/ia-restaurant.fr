import { ImageResponse } from "next/og";

export const alt = "IA Restaurant — L'IA au service de votre restaurant";
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
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#0a0e14",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 30,
            color: "#00e599",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          ia-restaurant.fr
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 900,
            color: "#ffffff",
            marginTop: "24px",
            lineHeight: 1.05,
          }}
        >
          IA Restaurant
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 38,
            color: "#a9b4c0",
            marginTop: "28px",
            maxWidth: "960px",
            lineHeight: 1.3,
          }}
        >
          L'IA au service de votre restaurant — menus, marges, avis, traduction
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "48px",
            height: "8px",
            width: "240px",
            backgroundColor: "#00e599",
            borderRadius: "4px",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
