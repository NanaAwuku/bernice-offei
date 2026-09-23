import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/lib/site";

// Fonts are self-hosted so builds don't depend on reaching Google Fonts.
const serif = localFont({
  variable: "--font-serif",
  src: [
    { path: "../assets/fonts/cormorant-garamond-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/cormorant-garamond-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../assets/fonts/cormorant-garamond-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/cormorant-garamond-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../assets/fonts/cormorant-garamond-600-normal.woff2", weight: "600", style: "normal" },
  ],
});

const sans = localFont({
  variable: "--font-sans",
  src: "../assets/fonts/inter-variable.woff2",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_GH",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf7f2",
};

// If a page of this site loads inside our own donate popup (the checkout's
// post-payment redirect), move the whole tab there before anything renders.
const breakOutOfCheckoutFrame = `try{if(window.top!==window.self&&window.top.location.origin===location.origin){window.top.location.assign(location.href)}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: breakOutOfCheckoutFrame }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
