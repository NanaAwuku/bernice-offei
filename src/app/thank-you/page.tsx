import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import portrait from "../../../public/images/portrait.jpg";

export const metadata: Metadata = {
  title: "Thank You — Bernice Ofeibea Offei",
  description: "Thank you for your kind support in memory of Bernice Ofeibea Offei.",
  // Post-donation page: keep it out of search results.
  robots: { index: false, follow: true },
};

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
    <div className="flex items-center justify-center gap-4 text-plum-muted/70">
      <span className="h-px w-14 bg-current opacity-50" />
      <Sprig className="h-7 w-11" />
      <span className="h-px w-14 bg-current opacity-50" />
    </div>
  );
}

export default function ThankYou() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-linear-to-b from-lavender-soft via-background to-lavender text-plum">
      <header className="bg-white/60 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl justify-center px-4 py-4 sm:justify-start">
          <Link href="/" className="text-center">
            <span className="block font-serif text-2xl tracking-[0.15em] uppercase">Bernice Offei</span>
            <span className="block text-[10px] tracking-[0.35em] text-plum-muted uppercase">
              A life well lived
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-12 text-center sm:py-16">
        <div className="mx-auto max-w-2xl">
          <Divider />
          <h1 className="mt-6 font-serif text-4xl leading-tight font-medium text-balance sm:text-6xl">
            Thank You for Your Kind Support
          </h1>

          <div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-lavender">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-9 w-9" aria-hidden="true">
              <path d="M12 20s-7-4.4-9.2-9A4.8 4.8 0 0 1 12 6.2 4.8 4.8 0 0 1 21.2 11C19 15.6 12 20 12 20Z" />
            </svg>
          </div>

          <p className="mt-8 font-serif text-2xl sm:text-3xl">
            Your donation has been received successfully.
          </p>
          <p className="mx-auto mt-6 max-w-xl font-serif text-lg leading-relaxed text-plum-muted sm:text-xl">
            Your kindness and support mean a great deal to the family. Thank you for remembering
            Bernice and for standing with us as we celebrate her life, faith and legacy.
          </p>
        </div>

        <section className="mx-auto mt-14 grid max-w-4xl items-center gap-10 sm:mt-20 md:grid-cols-2">
          <figure className="order-2 md:order-1">
            <blockquote className="font-serif text-3xl leading-snug italic sm:text-4xl">
              &ldquo;Remember your Creator while you have breath.&rdquo;
            </blockquote>
            <div className="mx-auto mt-6 h-px w-12 bg-plum-muted/40" />
            <figcaption className="mt-4 text-xs tracking-[0.3em] text-plum-muted uppercase">
              Bernice Offei
              <span className="mt-1 block">&ldquo;Life is Short&rdquo;</span>
            </figcaption>
          </figure>

          <div className="order-1 mx-auto h-64 w-64 overflow-hidden rounded-full border-4 border-white shadow-xl ring-1 ring-lavender sm:h-72 sm:w-72 md:order-2">
            <Image
              src={portrait}
              alt="Bernice Ofeibea Offei"
              placeholder="blur"
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <Link
          href="https://www.forevermissed.com/bernice-offei/about"
          className="mt-14 inline-flex items-center gap-3 rounded-full bg-plum px-10 py-4 text-sm font-medium tracking-[0.2em] text-white uppercase shadow-md transition hover:bg-plum/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"
        >
          Return to memorial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </main>

      <footer className="bg-lavender py-6 text-center text-plum-muted">
        <Divider />
        <p className="mt-2 text-xs tracking-[0.35em] uppercase">Forever in our hearts</p>
      </footer>
    </div>
  );
}
