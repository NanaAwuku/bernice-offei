import type { Metadata } from "next";
import { site } from "@/lib/site";
import ResultPage, { MEMORIAL_URL, PrimaryButton } from "@/components/ResultPage";

export const metadata: Metadata = {
  title: `Thank You — ${site.name}`,
  description: `Thank you for your kind support in memory of ${site.name}.`,
  // Post-donation page: keep it out of search results.
  robots: { index: false, follow: true },
};

export default function ThankYou() {
  return (
    <ResultPage
      title={site.thankYou.title}
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M12 20s-7-4.4-9.2-9A4.8 4.8 0 0 1 12 6.2 4.8 4.8 0 0 1 21.2 11C19 15.6 12 20 12 20Z" />
        </svg>
      }
      lead={site.thankYou.lead}
      actions={<PrimaryButton href={MEMORIAL_URL}>Return to memorial</PrimaryButton>}
    >
      <p>{site.thankYou.message}</p>
    </ResultPage>
  );
}
