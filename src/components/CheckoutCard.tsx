"use client";

import { useState } from "react";

const CHECKOUT_URL = "https://checkoutuat.itcsrvc.com/transflow-checkout/lic";

export default function CheckoutCard() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      id="donate"
      className="relative h-[795px] w-full max-w-[420px] scroll-mt-6 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-line"
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
          Loading secure checkout…
        </div>
      )}
      <iframe
        src={CHECKOUT_URL}
        title="Donate in memory of Bernice"
        allow="payment"
        onLoad={() => setLoaded(true)}
        // Pull the frame up to trim the checkout page's blank top padding.
        className="relative -mt-10 block h-[850px] w-full border-0"
      />
    </div>
  );
}
