import type { Metadata } from "next";
import Link from "next/link";
import { SHOW_MEMORIAL_BOOK } from "@/lib/book";
import { pageMetadata } from "@/lib/metadata";

// The checkout redirects here after a successful payment.
export const metadata: Metadata = pageMetadata({
  title: "Thank You",
  path: "/thank-you",
  description: "Thank you for your kind support in memory of Bernice Ofeibea Offei.",
  noindex: true,
});

export default function ThankYou() {
  return (
    <section className="light tributes status-page" aria-labelledby="status-title">
      <div className="wrap">
        <p className="eyebrow">With gratitude</p>
        <h1 id="status-title">Thank you for your kind support</h1>
        <p className="lead">Your donation has been received successfully.</p>
        <p>
          Your kindness and support mean a great deal to the family. Thank you for remembering Bernice and for
          standing with us as we celebrate her life, faith and legacy.
        </p>
        <div className="actions">
          <Link className="button gold" href="/">
            Return home
          </Link>
          {SHOW_MEMORIAL_BOOK && (
            <Link className="button" href="/memorial-book">
              Memorial Book
            </Link>
          )}
          <Link className="button" href="/music">
            Her Music
          </Link>
        </div>
      </div>
    </section>
  );
}
