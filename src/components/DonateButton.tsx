"use client";

import { useEffect, useRef, useState } from "react";
import { CHECKOUT_URL } from "@/lib/checkout";

export default function DonateButton({ className = "" }: { className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  function openCheckout() {
    setLoaded(false);
    setRedirecting(false);
    setOpen(true);
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  }

  // Cleanup runs here rather than only in the dialog's close event, which
  // browsers may deliver late (or not at all) in background tabs.
  function closeCheckout() {
    dialogRef.current?.close();
    setOpen(false);
    setRedirecting(false);
    document.body.style.overflow = "";
  }

  // Coming back with the Back button can restore this page from the browser's
  // cache exactly as it was left (popup showing "Redirecting…"), so reset it.
  useEffect(() => {
    function onPageShow(e: PageTransitionEvent) {
      if (!e.persisted) return;
      dialogRef.current?.close();
      setOpen(false);
      setRedirecting(false);
      document.body.style.overflow = "";
    }
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  // When a payment finishes, the checkout redirects its frame to the success or
  // failure URL configured in the backend. Our CSP (next.config.ts) only lets the
  // frame show the checkout, so that redirect is blocked and reported here; we
  // send the full tab to exactly that URL. The popup stays up (showing
  // "Redirecting…") so the page underneath never flashes before the new one loads.
  useEffect(() => {
    if (!open) return;
    function onViolation(e: SecurityPolicyViolationEvent) {
      if (!e.effectiveDirective.startsWith("frame-src")) return;
      setRedirecting(true);
      // Browsers report the full URL (path and query) for this site, but only the
      // origin (e.g. https://licfamily.org.gh) for other sites — so point the
      // backend's redirect URLs here when the exact path matters.
      const target = /^https?:\/\//.test(e.blockedURI) ? e.blockedURI : window.location.href;
      window.location.assign(target);
    }
    document.addEventListener("securitypolicyviolation", onViolation);
    return () => document.removeEventListener("securitypolicyviolation", onViolation);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={openCheckout}
        className={`inline-flex items-center justify-center rounded-full bg-accent px-9 py-4 text-lg font-medium text-white shadow-sm transition hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
      >
        Make a donation
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Donate in memory of Bernice"
        onClose={closeCheckout}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            closeCheckout();
          }
        }}
        onClick={(e) => {
          // Clicking the backdrop (the dialog element itself) closes it.
          if (e.target === dialogRef.current) closeCheckout();
        }}
        className="m-auto h-[min(795px,calc(100dvh-2rem))] w-[min(420px,calc(100vw-2rem))] max-h-none max-w-none overflow-hidden rounded-2xl bg-white p-0 shadow-2xl"
      >
        <button
          type="button"
          onClick={closeCheckout}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 text-muted shadow-sm ring-1 ring-line transition hover:text-foreground"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
            Loading secure checkout…
          </div>
        )}
        {open && (
          <iframe
            src={CHECKOUT_URL}
            title="Donation checkout"
            allow="payment"
            onLoad={() => setLoaded(true)}
            // Pull the frame up to trim the checkout page's blank top padding.
            className="relative -mt-10 block h-[calc(100%+2.5rem)] w-full border-0"
          />
        )}
        {redirecting && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white text-sm text-muted">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-accent" />
            Redirecting…
          </div>
        )}
      </dialog>
    </>
  );
}
