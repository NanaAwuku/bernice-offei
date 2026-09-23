// Set NEXT_PUBLIC_CHECKOUT_URL per environment (e.g. the UAT link locally, the live
// link on Vercel). Blank values fall back to the live Bernice checkout.
export const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL?.trim() ||
  "https://checkout.itcsrvc.com/transflow-checkout/bernice-offei";
