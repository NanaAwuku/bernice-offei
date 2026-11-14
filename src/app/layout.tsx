import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@/styles/global.css";
import "@/styles/music.css";
import "@/styles/book.css";
import "@/styles/status.css";
import "@/styles/live.css";
import { DEFAULT_DESCRIPTION, HOME_TITLE } from "@/lib/metadata";
import { site } from "@/lib/site";

// Fonts are self-hosted so builds don't depend on reaching Google Fonts.
const serif = localFont({
  variable: "--font-serif",
  adjustFontFallback: "Times New Roman",
  src: [
    { path: "../assets/fonts/cormorant-garamond-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/cormorant-garamond-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../assets/fonts/cormorant-garamond-500-normal.woff2", weight: "500", style: "normal" },
  ],
});

const sans = localFont({
  variable: "--font-sans",
  src: "../assets/fonts/inter-variable.woff2",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: HOME_TITLE,
  description: DEFAULT_DESCRIPTION,
  openGraph: { type: "website", siteName: HOME_TITLE, locale: "en_GB" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#1c1d1b",
};

// If a page of this site loads inside our own donate panel (the checkout's
// post-payment redirect), move the whole tab there before anything renders.
const breakOutOfCheckoutFrame = `try{if(window.top!==window.self&&window.top.location.origin===location.origin){window.top.location.assign(location.href)}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" data-scroll-behavior="smooth" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: breakOutOfCheckoutFrame }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
