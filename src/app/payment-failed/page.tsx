import type { Metadata } from "next";
import ResultPage, { MEMORIAL_URL, PrimaryButton, SecondaryButton } from "@/components/ResultPage";

export const metadata: Metadata = {
  title: "Donation Not Completed — Bernice Ofeibea Offei",
  description: "Your donation in memory of Bernice Ofeibea Offei could not be completed.",
  // Post-donation page: keep it out of search results.
  robots: { index: false, follow: true },
};

export default function PaymentFailed() {
  return (
    <ResultPage
      title="Your Donation Didn’t Go Through"
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5v5.5M12 16.5h.01" />
        </svg>
      }
      lead="We couldn’t complete your payment."
      hideQuoteOnTinyScreens
      actions={
        <>
          {/* ?donate opens the checkout popup on arrival (see DonateButton). */}
          <PrimaryButton href="/?donate">Try again</PrimaryButton>
          <SecondaryButton href={MEMORIAL_URL}>Return to memorial</SecondaryButton>
        </>
      }
    >
      <p>
        This can happen if the payment was cancelled, the connection dropped, or the card or
        mobile money wallet was declined. If you think you were charged, please check with your
        bank or mobile money provider before trying again.
      </p>
    </ResultPage>
  );
}
