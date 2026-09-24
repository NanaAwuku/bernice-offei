import type { Metadata } from "next";
import ResultPage, { MEMORIAL_URL, PrimaryButton } from "@/components/ResultPage";

export const metadata: Metadata = {
  title: "Thank You — Bernice Ofeibea Offei",
  description: "Thank you for your kind support in memory of Bernice Ofeibea Offei.",
  // Post-donation page: keep it out of search results.
  robots: { index: false, follow: true },
};

export default function ThankYou() {
  return (
    <ResultPage
      title="Thank You for Your Kind Support"
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M12 20s-7-4.4-9.2-9A4.8 4.8 0 0 1 12 6.2 4.8 4.8 0 0 1 21.2 11C19 15.6 12 20 12 20Z" />
        </svg>
      }
      lead="Your donation has been received successfully."
      actions={<PrimaryButton href={MEMORIAL_URL}>Return to memorial</PrimaryButton>}
    >
      <p>
        Your kindness and support mean a great deal to the family. Thank you for remembering
        Bernice and for standing with us as we celebrate her life, faith and legacy.
      </p>
    </ResultPage>
  );
}
