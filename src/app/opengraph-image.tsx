import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "In loving memory of Bernice Ofeibea Offei, 1963 – 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [portrait, serif, serifItalic, sans] = await Promise.all([
    readFile(join(process.cwd(), "public/images/portrait.jpg"), "base64"),
    readFile(join(process.cwd(), "src/assets/cormorant-500.woff")),
    readFile(join(process.cwd(), "src/assets/cormorant-500-italic.woff")),
    readFile(join(process.cwd(), "src/assets/inter-400.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 90px",
          gap: 70,
          background: "#faf7f2",
          border: "14px solid #efe7db",
          color: "#2b2420",
        }}
      >
        <img
          src={`data:image/jpeg;base64,${portrait}`}
          alt=""
          width={380}
          height={380}
          style={{
            borderRadius: 9999,
            objectFit: "cover",
            border: "10px solid #ffffff",
            boxShadow: "0 12px 40px rgba(60, 40, 20, 0.18)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div
            style={{
              fontFamily: "Inter",
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#6f625a",
            }}
          >
            In loving memory of
          </div>
          <div style={{ fontFamily: "Cormorant", fontSize: 84, lineHeight: 1.05, marginTop: 18 }}>
            Bernice Ofeibea Offei
          </div>
          <div style={{ fontFamily: "Cormorant", fontSize: 44, color: "#8a6a4a", marginTop: 14 }}>
            1963 – 2026
          </div>
          <div style={{ width: 70, height: 2, background: "#8a6a4a", margin: "30px 0" }} />
          <div
            style={{
              fontFamily: "Cormorant",
              fontStyle: "italic",
              fontSize: 32,
              lineHeight: 1.35,
              color: "#6f625a",
            }}
          >
            Sister, mother, wife — forever in our hearts.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: serif, style: "normal", weight: 500 },
        { name: "Cormorant", data: serifItalic, style: "italic", weight: 500 },
        { name: "Inter", data: sans, style: "normal", weight: 400 },
      ],
    },
  );
}
