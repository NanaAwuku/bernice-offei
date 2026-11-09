import site from "../content/site.json";

// The donation checkout link comes only from NEXT_PUBLIC_CHECKOUT_URL, set per
// environment (e.g. the UAT link locally, the live link on Vercel). It is read when
// next.config.ts loads, so `next dev` / `next build` stop here if it is missing.
function checkoutUrl() {
  const value = process.env.NEXT_PUBLIC_CHECKOUT_URL?.trim();
  if (!value) {
    throw new Error("NEXT_PUBLIC_CHECKOUT_URL is not set. Add the donation checkout link to .env.local (see .env.example) or the hosting environment.");
  }
  try {
    return new URL(value).href;
  } catch {
    throw new Error(`NEXT_PUBLIC_CHECKOUT_URL is not a valid URL: "${value}"`);
  }
}

export const CHECKOUT_URL = checkoutUrl();

// The checkout provider only allows itself to be framed on the hosts in its
// frame-ancestors policy (www.berniceoffei.com). Everywhere else "Give online"
// opens the checkout in a new tab. NEXT_PUBLIC_DONATION_EMBED_HOSTS (comma or
// space separated, "*" for any host) overrides site.json, e.g. for a UAT
// checkout that allows localhost.
export const DONATION_EMBED_HOSTS =
  process.env.NEXT_PUBLIC_DONATION_EMBED_HOSTS?.split(/[\s,]+/).filter(Boolean) ??
  site.donationEmbedHosts;

export function canEmbedCheckout(hostname: string) {
  return DONATION_EMBED_HOSTS.includes("*") || DONATION_EMBED_HOSTS.includes(hostname);
}
