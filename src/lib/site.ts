export const site = {
  name: "Bernice Ofeibea Offei",
  title: "In Loving Memory of Bernice Ofeibea Offei (1963 – 2026)",
  description:
    "Celebrating the life of Bernice Ofeibea Offei — beloved sister, mother, wife and a voice we will never forget. Honour her memory with a donation to support the family.",
  // Set NEXT_PUBLIC_SITE_URL to the live domain so shared links resolve to absolute URLs.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3100"),
};
