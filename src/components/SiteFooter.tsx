import Image from "next/image";
import Link from "next/link";
import { SHOW_MEMORIAL_BOOK } from "@/lib/book";
import { site } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <p className="footer-name">{site.name} · Forever in our hearts</p>
        <div className="footer-links">
          {SHOW_MEMORIAL_BOOK && <Link href="/memorial-book">Memorial Book</Link>}
          <Link href="/music">Her Music</Link>
          <a href={site.foreverMissedUrl} target="_blank" rel="noopener">
            ForeverMissed <span aria-hidden="true">↗</span>
            <span className="visually-hidden">(opens in a new tab)</span>
          </a>
          <a className="powered" href={site.donationPoweredBy.url} target="_blank" rel="noopener">
            Donations powered by{" "}
            <Image src="/chango-logo.svg" alt={site.donationPoweredBy.label} width={65} height={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
