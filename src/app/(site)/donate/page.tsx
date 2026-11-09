import type { Metadata } from "next";
import DonationOptions from "@/components/DonationOptions";
import d from "@/content/donations.json";
import { pageMetadata } from "@/lib/metadata";

// Shareable donation page (WhatsApp, the funeral programme, a QR code at the venue).
// Same content as the Donate panel.
export const metadata: Metadata = pageMetadata({
  title: "Donate",
  path: "/donate",
  description: "Give in memory of Bernice Ofeibea Offei: online, by Mobile Money, short code or bank transfer.",
});

export default function DonatePage() {
  return (
    <section className="donate-page light" aria-labelledby="donate-title" data-donate-page>
      <div className="donate-page-inner">
        <h1 id="donate-title">Give in memory of Bernice</h1>
        <p className="donate-intro">{d.intro}</p>
        <DonationOptions />
      </div>
    </section>
  );
}
