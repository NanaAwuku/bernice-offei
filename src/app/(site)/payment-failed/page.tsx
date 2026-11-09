import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";

// The checkout redirects here when a payment fails or is cancelled.
export const metadata: Metadata = pageMetadata({
  title: "Donation Not Completed",
  path: "/payment-failed",
  description: "Your donation in memory of Bernice Ofeibea Offei could not be completed.",
  noindex: true,
});

export default function PaymentFailed() {
  return (
    <section className="light tributes status-page" aria-labelledby="status-title">
      <div className="wrap">
        <p className="eyebrow">Donation not completed</p>
        <h1 id="status-title">Your donation didn’t go through</h1>
        <p className="lead">We couldn’t complete your payment.</p>
        <p>
          This can happen if the payment was cancelled, the connection dropped, or the card or mobile money wallet
          was declined. If you think you were charged, please check with your bank or mobile money provider before
          trying again.
        </p>
        <div className="actions">
          {/* Reopens the Donate panel here (DonateDialog intercepts [data-donate]).
              A plain link on purpose: without JavaScript, /?donate goes home. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="button gold" href="/?donate" data-donate>
            Try again
          </a>
          <Link className="button" href="/donate">
            Other ways to give
          </Link>
          <Link className="button" href="/">
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}
