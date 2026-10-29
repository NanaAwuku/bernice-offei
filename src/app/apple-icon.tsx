import { ImageResponse } from "next/og";
import { loadPortrait } from "@/lib/portrait";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon: the portrait from NEXT_PUBLIC_PORTRAIT, cropped to a circle.
export default async function AppleIcon() {
  const portrait = await loadPortrait();
  return new ImageResponse(
    (
      <img
        src={portrait}
        alt=""
        width={180}
        height={180}
        style={{ borderRadius: 9999, objectFit: "cover" }}
      />
    ),
    size,
  );
}
