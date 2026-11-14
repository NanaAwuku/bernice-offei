import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preload } from "react-dom";
import BookReader from "@/components/BookReader";
import book from "@/content/book.json";
import { PDF_SIZE, PDF_URL, SHOW_MEMORIAL_BOOK } from "@/lib/book";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "The Memorial Book",
  path: "/memorial-book",
  description: "Read the memorial book for Bernice Ofeibea Offei online, or download it as a PDF.",
});

export default function MemorialBookPage() {
  if (!SHOW_MEMORIAL_BOOK) notFound(); // toggle in src/lib/book.ts
  preload("/book/pages/page-001-700.webp", { as: "image" });
  return (
    <>
      <section className="book-intro" aria-labelledby="book-title">
        <div className="wrap book-intro-inner">
          <div>
            <p className="eyebrow">Her life, in these pages</p>
            <h1 id="book-title">The Memorial Book</h1>
            <p>Explore the photographs, stories and memories gathered in her honour.</p>
          </div>
          <div className="actions">
            <a className="button gold" href={PDF_URL} download>
              Download PDF <span aria-hidden="true">↓</span>
              <span className="visually-hidden">({PDF_SIZE})</span>
            </a>
            <a className="text-link" href="/memorial-book/reader" target="_blank" rel="noopener">
              Open reader in a new window <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <BookReader pageCount={book.pageCount} pageWidth={book.pageWidth} pageHeight={book.pageHeight} />

      <section className="book-notes light" aria-label="About the memorial book">
        <div className="wrap book-notes-inner">
          <div>
            <h2>Reading the book</h2>
            <p>
              Turn pages with the arrows, your keyboard or a swipe. Use zoom to read smaller text, or full screen for a
              larger view.
            </p>
            <p>
              The{" "}
              <a href={PDF_URL} download>
                PDF version ({PDF_SIZE})
              </a>{" "}
              keeps the brochure’s text selectable and works with screen readers and print.
            </p>
          </div>
          <div>
            <h2>Tributes</h2>
            <p>The tributes printed in the book remain part of the original publication.</p>
            <p>
              To read more memories or share your own, visit{" "}
              <a href={site.foreverMissedUrl} target="_blank" rel="noopener">
                Bernice’s ForeverMissed memorial <span aria-hidden="true">↗</span>
                <span className="visually-hidden">(opens in a new tab)</span>
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
