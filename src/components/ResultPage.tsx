import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import portrait from "../../public/images/portrait.jpg";

export const MEMORIAL_URL = "https://www.forevermissed.com/bernice-offei/about";

function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M6 30c14-2 30-8 50-22" />
      <path d="M20 26c-2-6 1-11 6-13-1 6-3 10-6 13Z" />
      <path d="M32 21c-1-6 3-10 8-11-2 6-4 9-8 11Z" />
      <path d="M44 14c0-5 4-8 9-8-2 5-5 7-9 8Z" />
      <circle cx="16" cy="33" r="3" />
      <circle cx="30" cy="30" r="3" />
    </svg>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-4 text-plum-muted/70 lg:justify-start">
      <span className="h-px w-14 bg-current opacity-50" />
      <Sprig className="h-7 w-11" />
      <span className="h-px w-14 bg-current opacity-50" />
    </div>
  );
}

const buttonBase =
  "inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-sm font-medium tracking-[0.2em] uppercase transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum tiny:py-3";

export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={`${buttonBase} bg-plum text-white shadow-md hover:bg-plum/90`}>
      {children}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

export function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={`${buttonBase} text-plum ring-1 ring-plum/30 hover:bg-white/60`}>
      {children}
    </Link>
  );
}

// Post-donation result page (thank-you / payment failed), sized to fit in one
// screen with no scrolling: two columns from lg up, and a compact single column
// on phones (see the short/tiny variants in globals.css).
export default function ResultPage({
  icon,
  title,
  lead,
  children,
  actions,
  hideQuoteOnTinyScreens = false,
}: {
  icon: ReactNode;
  title: string;
  lead: string;
  children: ReactNode;
  actions: ReactNode;
  /** Drop the portrait + quote on very small phones to keep everything on one screen. */
  hideQuoteOnTinyScreens?: boolean;
}) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-linear-to-b from-lavender-soft via-background to-lavender text-plum">
      <main className="flex flex-1 items-center justify-center px-4 py-6 text-center sm:py-8 short:py-4">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-6 short:gap-4 tiny:gap-3 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div className="lg:text-left">
            <Divider />
            <h1 className="mt-3 tiny:mt-1 font-serif text-4xl leading-tight font-medium text-balance sm:text-5xl lg:text-6xl short:text-4xl lg:short:text-5xl tiny:text-3xl">
              {title}
            </h1>

            <div className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-full bg-lavender sm:h-16 sm:w-16 short:mt-3 short:h-12 short:w-12 tiny:hidden lg:mx-0 [&>svg]:h-7 [&>svg]:w-7 short:[&>svg]:h-6 short:[&>svg]:w-6">
              {icon}
            </div>

            <p className="mt-4 font-serif text-xl sm:text-2xl short:mt-3 tiny:text-lg">{lead}</p>
            <div className="mx-auto mt-2 max-w-xl font-serif text-base leading-relaxed text-plum-muted sm:mt-3 sm:text-lg short:leading-snug tiny:text-[15px] lg:mx-0">
              {children}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 short:mt-4 tiny:mt-3 lg:justify-start">
              {actions}
            </div>
          </div>

          {/* Phones: small portrait beside the quote. lg: large portrait above it. */}
          <figure className={`${hideQuoteOnTinyScreens ? "tiny:hidden " : ""}mx-auto flex max-w-md items-center gap-4 text-left lg:max-w-none lg:flex-col lg:gap-6 lg:text-center`}>
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-xl ring-1 ring-lavender sm:h-28 sm:w-28 tiny:h-20 tiny:w-20 lg:h-72 lg:w-72 lg:short:h-60 lg:short:w-60">
              <Image
                src={portrait}
                alt="Bernice Ofeibea Offei"
                placeholder="blur"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <blockquote className="font-serif text-xl leading-snug italic sm:text-2xl lg:text-3xl lg:short:text-2xl">
                &ldquo;Remember your Creator while you have breath.&rdquo;
              </blockquote>
              <figcaption className="mt-2 text-[10px] tracking-[0.3em] text-plum-muted uppercase sm:text-xs lg:mt-3">
                Bernice Offei &middot; &ldquo;Life is Short&rdquo;
              </figcaption>
            </div>
          </figure>
        </div>
      </main>

      <footer className="bg-lavender py-3 text-center text-[10px] tracking-[0.35em] text-plum-muted uppercase sm:text-xs">
        Forever in our hearts
      </footer>
    </div>
  );
}
