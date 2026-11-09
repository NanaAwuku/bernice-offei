import content from "../content/site.json";

// Accepts "example.com" or "https://example.com"; blank values are ignored.
function toUrl(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
}

// Names, dates and links live in src/content/site.json. The live domain can be
// overridden per environment with NEXT_PUBLIC_SITE_URL so shared links resolve.
export const site = {
  ...content,
  url:
    toUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    toUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    content.siteUrl,
};
