// Only the origin of this URL matters now: it is allowed as a frame source (see
// next.config.ts). The checkout page itself comes from the Create Transaction API.
// Blank values fall back to the live Chango checkout.
export const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL?.trim() || "https://checkout.itcsrvc.com";
