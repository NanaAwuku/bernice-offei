import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preload } from "react-dom";
import BookReader from "@/components/BookReader";
import { SHOW_MEMORIAL_BOOK } from "@/lib/book";
import book from "@/content/book.json";
import { pageMetadata } from "@/lib/metadata";

// Full-window reader (the "open in new window" option). No site chrome.
export const metadata: Metadata = pageMetadata({
  title: "Memorial Book Reader",
  path: "/memorial-book/reader",
  description: "Full-window reader for the memorial book of Bernice Ofeibea Offei.",
});

export default function ReaderPage() {
  if (!SHOW_MEMORIAL_BOOK) notFound(); // hidden for now (src/lib/book.ts)
  preload("/book/pages/page-001-700.webp", { as: "image" });
  return (
    <main id="main">
      <h1 className="visually-hidden">The Memorial Book of Bernice Ofeibea Offei</h1>
      <BookReader standalone pageCount={book.pageCount} pageWidth={book.pageWidth} pageHeight={book.pageHeight} />
    </main>
  );
}
