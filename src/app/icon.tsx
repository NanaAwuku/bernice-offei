import { ImageResponse } from "next/og";
import { loadPortrait } from "@/lib/portrait";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Favicon: the portrait from NEXT_PUBLIC_PORTRAIT, cropped to a circle.
export default async function Icon() {
  const portrait = await loadPortrait();
  return new ImageResponse(
    (
      <img
        src={portrait}
        alt=""
        width={64}
        height={64}
        style={{ borderRadius: 9999, objectFit: "cover" }}
      />
    ),
    size,
  );
}
