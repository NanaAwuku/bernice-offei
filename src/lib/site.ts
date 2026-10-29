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

// Used in running text, e.g. "Thank you for remembering Bernice".
const shortName = text(process.env.NEXT_PUBLIC_SHORT_NAME, name.split(/\s+/)[0]);

export const site = {
  name,
  shortName,
  // Optional; shown in brackets under the name when set.
  nickname: process.env.NEXT_PUBLIC_NICKNAME?.trim() || undefined,
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
  // Optional QR code image (path under /public or https:// URL); desktop only.
  qrCode: process.env.NEXT_PUBLIC_QR_CODE?.trim() || undefined,
  // Short line shown on the link-preview image.
  tagline: text(process.env.NEXT_PUBLIC_TAGLINE, "Sister, mother, wife \u2014 forever in our hearts."),
  // Quote and its source shown on the thank-you / payment-failed pages.
  resultQuote: text(process.env.NEXT_PUBLIC_RESULT_QUOTE, "Remember your Creator while you have breath."),
  resultQuoteSource: text(process.env.NEXT_PUBLIC_RESULT_QUOTE_SOURCE, "Bernice Offei \u00b7 \u201cLife is Short\u201d"),
  // Thank-you page (after a successful payment).
  thankYou: {
    title: text(process.env.NEXT_PUBLIC_THANK_YOU_TITLE, "Thank You for Your Kind Support"),
    lead: text(process.env.NEXT_PUBLIC_THANK_YOU_LEAD, "Your donation has been received successfully."),
    message: text(
      process.env.NEXT_PUBLIC_THANK_YOU_MESSAGE,
      `Your kindness and support mean a great deal to the family. Thank you for remembering ${shortName} and for standing with us as we celebrate a life, faith and legacy.`,
    ),
  },
  // Payment-failed page.
  paymentFailed: {
    title: text(process.env.NEXT_PUBLIC_PAYMENT_FAILED_TITLE, "Your Donation Didn\u2019t Go Through"),
    lead: text(process.env.NEXT_PUBLIC_PAYMENT_FAILED_LEAD, "We couldn\u2019t complete your payment."),
    message: text(
      process.env.NEXT_PUBLIC_PAYMENT_FAILED_MESSAGE,
      "This can happen if the payment was cancelled, the connection dropped, or the card or mobile money wallet was declined. If you think you were charged, please check with your bank or mobile money provider before trying again.",
    ),
  },
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
