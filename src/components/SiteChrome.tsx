import type { ReactNode } from "react";
import { showLivestream } from "@/lib/livestream-status";
import DonateDialog from "./DonateDialog";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

// Header, footer, the Donate panel around every page except the full-window reader.
export default async function SiteChrome({ children }: { children: ReactNode }) {
  const live = await showLivestream();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader live={live} />
      <main id="main">{children}</main>
      <SiteFooter />
      <DonateDialog />
    </>
  );
}
