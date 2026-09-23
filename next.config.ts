import type { NextConfig } from "next";
import { CHECKOUT_URL } from "./src/lib/checkout";

// The donate popup's iframe may only show the checkout itself. When the checkout
// tries to send the frame to its merchant redirect URL (another site), the browser
// blocks it and raises a CSP violation, which the popup uses to close itself.
// 3-D Secure runs in a frame nested inside the checkout, so it isn't affected.
const CHECKOUT_ORIGINS = [
  ...new Set([
    new URL(CHECKOUT_URL).origin,
    "https://checkoutuat.itcsrvc.com",
    "https://checkout.itcsrvc.com",
  ]),
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: `frame-src ${CHECKOUT_ORIGINS.join(" ")}` },
        ],
      },
    ];
  },
};

export default nextConfig;
