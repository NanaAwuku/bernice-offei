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

  function closeCheckout() {
    dialogRef.current?.close();
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
        aria-label="Donate"
        onClose={() => {
          setOpen(false);
          document.body.style.overflow = "";
        }}
        onClick={(e) => {
          // Clicking the backdrop (the dialog element itself) closes it.
          if (e.target === dialogRef.current) closeCheckout();
        }}
        className="m-auto h-[90dvh] w-[min(560px,calc(100vw-2rem))] max-w-none overflow-hidden rounded-2xl bg-surface p-0 shadow-2xl"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <p className="font-serif text-xl text-foreground">Donate in memory of Bernice</p>
            <button
              type="button"
              onClick={closeCheckout}
              aria-label="Close"
              className="rounded-full p-2 text-muted transition hover:bg-background hover:text-foreground"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="relative flex-1">
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
                className="relative h-full w-full border-0"
              />
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
