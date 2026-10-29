// Accepts "example.com" or "https://example.com"; blank values are ignored.
function toUrl(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
}

// Blank values fall back to the default.
function text(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

// Every NEXT_PUBLIC_* variable is referenced literally so Next can inline it.
const name = text(process.env.NEXT_PUBLIC_NAME, "Bernice Ofeibea Offei");
const birthYear = text(process.env.NEXT_PUBLIC_BIRTH_YEAR, "1963");
const deathYear = text(process.env.NEXT_PUBLIC_DEATH_YEAR, "2026");

export const site = {
  name,
  // Used in running text, e.g. "Thank you for remembering Bernice".
  shortName: text(process.env.NEXT_PUBLIC_SHORT_NAME, name.split(/\s+/)[0]),
  years: `${birthYear} \u2013 ${deathYear}`,
  title: `In Loving Memory of ${name} (${birthYear} \u2013 ${deathYear})`,
  description: text(
    process.env.NEXT_PUBLIC_DESCRIPTION,
    `Celebrating the life of ${name}. Honour their memory with a donation to support the family.`,
  ),
  quote: text(
    process.env.NEXT_PUBLIC_QUOTE,
    "Let the memory of our sister, mother and wife, Bernice, be with us forever.",
  ),
  // Paragraphs are separated by "||" in the env value.
  sympathy: text(
    process.env.NEXT_PUBLIC_SYMPATHY_MESSAGE,
    "We are grateful for the prayers, messages and memories shared in honour of Bernice. Your love and presence mean so much to the family.||For those who have asked about making a personal donation, the option is available below.",
  )
    .split("||")
    .map((p) => p.trim())
    .filter(Boolean),
  // Short line shown on the link-preview image.
  tagline: text(process.env.NEXT_PUBLIC_TAGLINE, "Sister, mother, wife \u2014 forever in our hearts."),
  // Quote and its source shown on the thank-you / payment-failed pages.
  resultQuote: text(process.env.NEXT_PUBLIC_RESULT_QUOTE, "Remember your Creator while you have breath."),
  resultQuoteSource: text(process.env.NEXT_PUBLIC_RESULT_QUOTE_SOURCE, "Bernice Offei \u00b7 \u201cLife is Short\u201d"),
  memorialUrl: text(
    process.env.NEXT_PUBLIC_MEMORIAL_URL,
    "https://www.forevermissed.com/bernice-offei/about",
  ),
  // A path under /public (e.g. /images/portrait.jpg) or a full https:// URL.
  portrait: text(process.env.NEXT_PUBLIC_PORTRAIT, "/images/portrait.jpg"),
  // Set NEXT_PUBLIC_SITE_URL to the live domain so shared links resolve to absolute URLs.
  url:
    toUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    toUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    "http://localhost:3100",
};
