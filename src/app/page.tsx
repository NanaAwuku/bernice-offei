import Image from "next/image";
import Portrait from "@/components/Portrait";
import DonateButton from "@/components/DonateButton";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

// Everything, including the donate button, is sized to fit in the first screen:
// side by side from lg up, and a compact single column on phones.
export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <main className="flex flex-1 items-center justify-center px-4 py-6 text-center sm:py-10 short:py-4 lg:text-left">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-5 tiny:gap-3 lg:grid-cols-[auto_1fr] lg:gap-16">
          <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-surface shadow-lg ring-1 ring-line sm:h-44 sm:w-44 short:h-28 short:w-28 tiny:h-20 tiny:w-20 lg:h-80 lg:w-80 lg:short:h-72 lg:short:w-72">
            <Portrait preload />
          </div>

          <div>
            <p className="text-[11px] tracking-[0.3em] text-muted uppercase sm:text-xs">
              In loving memory of
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-tight font-medium sm:text-5xl lg:text-6xl short:text-4xl lg:short:text-5xl tiny:text-3xl">
              {site.name}
            </h1>
            {site.nickname && (
              <p className="mt-1 font-serif text-base text-muted sm:text-lg tiny:text-sm">
                ({site.nickname})
              </p>
            )}
            <p className="mt-1 font-serif text-xl text-accent sm:mt-2 sm:text-2xl">{site.years}</p>
            <p className="mx-auto mt-3 max-w-lg font-serif text-lg leading-snug text-muted italic sm:mt-5 sm:text-xl short:mt-3 tiny:mt-2 tiny:text-base lg:mx-0">
              &ldquo;{site.quote}&rdquo;
            </p>

            <div className="mx-auto mt-4 h-px w-12 bg-accent sm:mt-6 short:mt-4 tiny:mt-3 lg:mx-0" />

            <h2 className="mt-4 font-serif text-2xl font-medium sm:mt-6 sm:text-3xl short:mt-3 short:text-2xl tiny:text-xl">
              Expressions of sympathy
            </h2>
            <div className="mx-auto mt-2 max-w-xl space-y-2 text-[15px] leading-relaxed font-medium text-muted sm:mt-3 sm:space-y-3 sm:text-base short:space-y-2 short:leading-snug tiny:space-y-1 tiny:text-sm lg:mx-0">
              {site.sympathy.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-center gap-6 sm:mt-7 short:mt-4 tiny:mt-3 lg:justify-start">
              <DonateButton className="tiny:py-3" />
              {/* A phone can't scan its own screen, so the QR code is for larger screens. */}
              {site.qrCode && (
                <div className="hidden items-center gap-3 lg:flex">
                  <span className="h-10 w-px bg-line" aria-hidden="true" />
                  <Image
                    src={site.qrCode}
                    alt="QR code to donate"
                    width={96}
                    height={96}
                    unoptimized={/^https?:\/\//.test(site.qrCode)}
                    className="h-24 w-24 rounded-lg bg-white p-1.5 shadow-sm ring-1 ring-line short:h-20 short:w-20"
                  />
                  <p className="max-w-24 text-xs leading-snug text-muted">Scan with your phone to donate</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
