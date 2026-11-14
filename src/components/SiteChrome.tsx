import type { ReactNode } from "react";
import DonateDialog from "./DonateDialog";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

// Header, footer and the Donate panel around every page except the full-window reader.
export default function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <DonateDialog />
    </>
  );
}
