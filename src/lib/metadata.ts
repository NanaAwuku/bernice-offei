import type { Metadata } from "next";
import { SHOW_MEMORIAL_BOOK } from "./book";
import { site } from "./site";

export const HOME_TITLE = `In Loving Memory of ${site.name}`;
// Social preview image (public/og-image.jpg), shared by every page.
const OG_IMAGE = { url: "/og-image.jpg", alt: `In loving memory of ${site.name}` };

export const DEFAULT_DESCRIPTION = SHOW_MEMORIAL_BOOK
  ? "Remembering the life, faith and music of Bernice Ofeibea Offei. Read the memorial book and revisit her music."
  : "Remembering the life, faith and music of Bernice Ofeibea Offei. Revisit her music and share your memories.";

// Per-page title, description, canonical URL and Open Graph tags.
// Titles read "Her Music — Bernice Offei"; the home page uses HOME_TITLE.
export function pageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  noindex = false,
}: {
  title?: string;
  description?: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  const fullTitle = title ? `${title} — ${site.shortName}` : HOME_TITLE;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: HOME_TITLE, title: fullTitle, description, url: path, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image" },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}
