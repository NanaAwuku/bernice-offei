import type { NextConfig } from "next";
import { CHECKOUT_URL } from "./src/lib/checkout";
import site from "./src/content/site.json";

// Frames may only show the donation checkout and the music players. When the
// checkout sends its frame to the merchant redirect URL (e.g. /thank-you), the
// browser blocks it and raises a CSP violation, which the Donate panel uses to
// send the whole tab there instead (see DonateDialog). 3-D Secure runs in a
// frame nested inside the checkout, so it isn't affected.
const FRAME_SOURCES = [
  new URL(CHECKOUT_URL).origin, // from NEXT_PUBLIC_CHECKOUT_URL
  "https://www.youtube-nocookie.com",
  "https://open.spotify.com",
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: `frame-src ${FRAME_SOURCES.join(" ")}` },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/book/pages/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
      {
        source: "/downloads/:path*",
        headers: [
          { key: "Content-Disposition", value: 'attachment; filename="Bernice Ofeibea Offei - Memorial Book.pdf"' },
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },
  async redirects() {
    return [{ source: "/tributes", destination: site.foreverMissedUrl, permanent: false }];
  },
};

export default nextConfig;
