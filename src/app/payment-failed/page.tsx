import type { Metadata } from "next";
import { site } from "@/lib/site";
import ResultPage, { MEMORIAL_URL, PrimaryButton, SecondaryButton } from "@/components/ResultPage";

export const metadata: Metadata = {
  title: `Donation Not Completed — ${site.name}`,
  description: `Your donation in memory of ${site.name} could not be completed.`,
  // Post-donation page: keep it out of search results.
  robots: { index: false, follow: true },
};

export default function PaymentFailed() {
  return (
    <ResultPage
      title={site.paymentFailed.title}
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5v5.5M12 16.5h.01" />
        </svg>
      }
      lead={site.paymentFailed.lead}
      hideQuoteOnTinyScreens
      actions={
        <>
          <PrimaryButton href="/">Try again</PrimaryButton>
          <SecondaryButton href={MEMORIAL_URL}>Return to memorial</SecondaryButton>
        </>
      }
    >
      <p>{site.paymentFailed.message}</p>
    </ResultPage>
  );
}
