"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import d from "@/content/donations.json";
import { CHECKOUT_URL, canEmbedCheckout } from "@/lib/checkout";
import { announceMediaStart } from "@/lib/media";
import DonationOptions from "./DonationOptions";
import { backIcon, closeIcon } from "./icons";

// Donate panel. Any link with [data-donate] opens it on the ways to give
// (DonationOptions). "Give online" then shows the hosted Chango / Transflow
// checkout inside the same dialog.
// - No JavaScript: the Donate links go to /donate, a full page with the same options.
// - ?donate in the URL opens the panel on arrival (links already shared keep working).
// - The checkout can only be framed on the hosts in DONATION_EMBED_HOSTS; elsewhere
//   "Give online" opens it in a new tab (the link's default).
// - When a payment finishes, the checkout sends its frame to the success or failure
//   URL configured in the backend (e.g. /thank-you). Our CSP (next.config.ts) only
//   lets the frame show the checkout, so that navigation is blocked and reported
//   here; we send the whole tab to exactly that URL. The panel stays up, showing
//   "Redirecting…", so the page underneath never flashes before the new one loads.
export default function DonateDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [view, setView] = useState<"options" | "checkout">("options");
  const [frameKey, setFrameKey] = useState(0); // a fresh checkout frame each time
  const [loaded, setLoaded] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const showOptions = useCallback(() => {
    flushSync(() => {
      setView("options");
      setRedirecting(false);
    });
  }, []);

  const showCheckout = useCallback(() => {
    announceMediaStart("donation"); // pause any music player
    flushSync(() => {
      setLoaded(false);
      setRedirecting(false);
      setFrameKey((k) => k + 1);
      setView("checkout");
    });
    backRef.current?.focus();
  }, []);

  const open = useCallback(
    (trigger: HTMLElement | null, startWith: "options" | "checkout" = "options") => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      openerRef.current = trigger ?? (document.activeElement as HTMLElement | null);
      showOptions();
      if (!dialog.open) dialog.showModal();
      document.body.style.overflow = "hidden";
      if (optionsRef.current) optionsRef.current.scrollTop = 0;
      if (startWith === "checkout") showCheckout();
      else closeRef.current?.focus();
    },
    [showOptions, showCheckout],
  );

  const close = useCallback(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
  }, []);

  // Donate links and "Give online" anywhere on the page (including the /donate page).
  useEffect(() => {
    const modified = (e: MouseEvent) => e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0;
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || modified(e)) return;
      const target = e.target as Element;
      const online = target.closest<HTMLElement>("[data-give-online]");
      if (online) {
        if (!canEmbedCheckout(location.hostname)) return; // new tab (the link's default)
        e.preventDefault();
        if (dialogRef.current?.contains(online)) showCheckout();
        else open(online, "checkout");
        return;
      }
      // Donate links open the options panel (except on /donate, which already shows them).
      const link = target.closest<HTMLElement>("[data-donate]");
      if (!link || document.querySelector("[data-donate-page]")) return;
      e.preventDefault();
      open(link);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open, showCheckout]);

  // ?donate (e.g. a shared link) opens the panel on arrival; drop the parameter so
  // a refresh doesn't reopen it.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("donate") || document.querySelector("[data-donate-page]")) return;
    const frame = requestAnimationFrame(() => {
      url.searchParams.delete("donate");
      window.history.replaceState(window.history.state, "", url);
      open(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  // Back/forward cache: never restore an open checkout.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => e.persisted && close();
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [close]);

  // While the checkout shows: follow a blocked frame navigation with the whole tab.
  useEffect(() => {
    if (view !== "checkout") return;
    function onViolation(e: SecurityPolicyViolationEvent) {
      if (!dialogRef.current?.open || !e.effectiveDirective.startsWith("frame-src")) return;
      setRedirecting(true);
      // Browsers report the full URL for this site, but only the origin for others.
      window.location.assign(/^https?:\/\//.test(e.blockedURI) ? e.blockedURI : window.location.href);
    }
    document.addEventListener("securitypolicyviolation", onViolation);
    return () => document.removeEventListener("securitypolicyviolation", onViolation);
  }, [view]);

  const checkout = view === "checkout";

  return (
    <dialog
      ref={dialogRef}
      className={checkout ? "donate-dialog is-checkout" : "donate-dialog"}
      aria-labelledby="donate-dialog-title"
      onClose={() => {
        showOptions();
        document.body.style.overflow = "";
        openerRef.current?.focus();
      }}
      onClick={(e) => e.target === dialogRef.current && close()}
    >
      <button ref={closeRef} type="button" className="icon-close" aria-label="Close" onClick={close}>
        {closeIcon}
      </button>

      <div ref={optionsRef} className="donate-options" hidden={checkout}>
        <h2 id="donate-dialog-title">Give in memory of Bernice</h2>
        <p className="donate-intro">{d.intro}</p>
        <DonationOptions />
      </div>

      <div className="donate-checkout" hidden={!checkout}>
        <button
          ref={backRef}
          type="button"
          className="icon-back"
          aria-label="Back to all ways to give"
          onClick={() => {
            showOptions();
            dialogRef.current?.querySelector<HTMLElement>("[data-give-online]")?.focus();
          }}
        >
          {backIcon}
        </button>
        <div className="donate-status" hidden={loaded}>
          Loading secure checkout…
        </div>
        <div className="donate-frame">
          {checkout && (
            <iframe
              key={frameKey}
              src={CHECKOUT_URL}
              title="Donation checkout"
              allow="payment"
              onLoad={() => setLoaded(true)}
            />
          )}
        </div>
        {/* After the frame so it covers the blocked frame while the tab navigates. */}
        <div className="donate-status" hidden={!redirecting}>
          <span className="spinner" aria-hidden="true" />
          Redirecting…
        </div>
      </div>
    </dialog>
  );
}
