"use client";

import { useRef, useState } from "react";

const CHECKOUT_URL = "https://checkoutuat.itcsrvc.com/transflow-checkout/lic";

export default function DonateButton({ className = "" }: { className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  function openCheckout() {
    setLoaded(false);
    setOpen(true);
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  }

  // Cleanup runs here rather than only in the dialog's close event, which
  // browsers may deliver late (or not at all) in background tabs.
  function closeCheckout() {
    dialogRef.current?.close();
    setOpen(false);
    document.body.style.overflow = "";
  }

  return (
    <>
      <button
        type="button"
        onClick={openCheckout}
        className={`inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-sm font-medium tracking-wide text-white uppercase shadow-sm transition hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
      >
        Donate now
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
      </dialog>
    </>
  );
}
