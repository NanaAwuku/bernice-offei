"use client";

import { useEffect, useRef, useState } from "react";
import DonationForm, { type DonationDetails } from "./DonationForm";
import { site } from "@/lib/site";

// The donation form (right column on the home page). Submitting it asks our API to
// create the Chango transaction, and the checkout it returns opens in a modal (full
// screen on phones).
export default function DonateFlow() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  function openCheckout(url: string) {
    setLoaded(false);
    setRedirecting(false);
    setCheckoutUrl(url);
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  }

  // Cleanup runs here rather than only in the dialog's close event, which
  // browsers may deliver late (or not at all) in background tabs.
  function closeCheckout() {
    dialogRef.current?.close();
    setCheckoutUrl(null);
    setRedirecting(false);
    document.body.style.overflow = "";
  }

  async function submit(details: DonationDetails) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.checkoutUrl) {
        setError(data?.error ?? "We couldn't start your donation. Please try again.");
        return;
      }
      openCheckout(data.checkoutUrl);
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Coming back with the Back button can restore this page from the browser's
  // cache exactly as it was left (popup showing "Redirecting…"), so reset it.
  useEffect(() => {
    function onPageShow(e: PageTransitionEvent) {
      if (!e.persisted) return;
      dialogRef.current?.close();
      setCheckoutUrl(null);
      setRedirecting(false);
      setSubmitting(false);
      document.body.style.overflow = "";
    }
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  // When a payment finishes, the checkout redirects its frame to the success or
  // failure URL we sent with the transaction. Our CSP (next.config.ts) only lets the
  // frame show the checkout, so that redirect is blocked and reported here; we
  // send the full tab to exactly that URL. The popup stays up (showing
  // "Redirecting…") so the page underneath never flashes before the new one loads.
  useEffect(() => {
    if (!checkoutUrl) return;
    function onViolation(e: SecurityPolicyViolationEvent) {
      if (!e.effectiveDirective.startsWith("frame-src")) return;
      setRedirecting(true);
      // Browsers report the full URL (path and query) for this site, but only the
      // origin for other sites, so fall back to this page for those.
      const target = /^https?:\/\//.test(e.blockedURI) ? e.blockedURI : window.location.href;
      window.location.assign(target);
    }
    document.addEventListener("securitypolicyviolation", onViolation);
    return () => document.removeEventListener("securitypolicyviolation", onViolation);
  }, [checkoutUrl]);

  return (
    <>
      <DonationForm busy={submitting} error={error} onSubmit={submit} />

      <dialog
        ref={dialogRef}
        aria-label={`Donate in memory of ${site.shortName}`}
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
        // Phones: fill the screen so it doesn't read as a modal. Larger screens: a card.
        className="m-0 h-dvh max-h-none w-dvw max-w-none overflow-hidden bg-white p-0 shadow-2xl sm:m-auto sm:h-[min(795px,calc(100dvh-2rem))] sm:w-[min(420px,calc(100vw-2rem))] sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={closeCheckout}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 cursor-pointer rounded-full bg-white/90 p-2 text-muted shadow-sm ring-1 ring-line transition hover:text-foreground"
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
        {checkoutUrl && (
          <iframe
            src={checkoutUrl}
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
