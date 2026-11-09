"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SHOW_MEMORIAL_BOOK } from "@/lib/book";
import { site } from "@/lib/site";

type Section = "home" | "book" | "music" | "donate";

const links: { key: Section; href: string; label: string }[] = [
  { key: "home", href: "/", label: "Home" },
  ...(SHOW_MEMORIAL_BOOK ? [{ key: "book" as const, href: "/memorial-book", label: "Memorial Book" }] : []),
  { key: "music", href: "/music", label: "Her Music" },
];

function sectionFor(pathname: string): Section | undefined {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/memorial-book")) return "book";
  if (pathname.startsWith("/music")) return "music";
  if (pathname === "/donate") return "donate";
}

export default function SiteHeader() {
  const current = sectionFor(usePathname());
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // The menu only exists on phones; close it if the window grows past that.
  useEffect(() => {
    const wide = matchMedia("(min-width: 721px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link className="wordmark" href="/">
          {site.shortName}
        </Link>
        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav
          id="site-nav"
          className={open ? "nav open" : "nav"}
          aria-label="Main"
          onClick={(e) => (e.target as Element).closest("a") && setOpen(false)}
        >
          {links.map((l) => (
            <Link key={l.key} href={l.href} aria-current={current === l.key ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
          <a href={site.foreverMissedUrl} target="_blank" rel="noopener">
            Tributes <span aria-hidden="true" className="ext">↗</span>
            <span className="visually-hidden">(ForeverMissed, opens in a new tab)</span>
          </a>
          {/* Opens the Donate panel (DonateDialog); /donate without JavaScript. */}
          <a className="button" href="/donate" data-donate aria-current={current === "donate" ? "page" : undefined}>
            Donate
          </a>
        </nav>
      </div>
    </header>
  );
}
