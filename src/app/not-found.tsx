import type { Metadata } from "next";
import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";
import { SHOW_MEMORIAL_BOOK } from "@/lib/book";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: { absolute: `Page not found — ${site.shortName}` } };

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="light tributes status-page">
        <div className="wrap">
          <p className="eyebrow">Page not found</p>
          <h1>This page could not be found</h1>
          <p>
            {SHOW_MEMORIAL_BOOK
              ? "The page may have moved. You can return to Bernice’s memorial, read the memorial book or listen to her music."
              : "The page may have moved. You can return to Bernice’s memorial or listen to her music."}
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
    </SiteChrome>
  );
}
