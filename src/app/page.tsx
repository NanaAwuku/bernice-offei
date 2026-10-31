import Image from "next/image";
import Portrait from "@/components/Portrait";
import DonateFlow from "@/components/DonateFlow";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

// Memorial on the left, donation form on the right from lg up; stacked on phones.
export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <main className="flex flex-1 items-center justify-center px-4 py-8 text-center sm:py-10 lg:text-left">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-surface shadow-lg ring-1 ring-line sm:h-40 sm:w-40 lg:mx-0 lg:h-44 lg:w-44 lg:short:h-32 lg:short:w-32">
              <Portrait preload />
            </div>

            <p className="mt-5 text-[11px] tracking-[0.3em] text-muted uppercase sm:text-xs">
              In loving memory of
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-[1.05] font-medium sm:text-5xl lg:text-5xl xl:text-6xl">
              {site.name}
            </h1>
            {site.nickname && (
              <p className="mt-1 font-serif text-base text-muted sm:text-lg">({site.nickname})</p>
            )}
            <p className="mt-1 font-serif text-xl text-accent sm:mt-2 sm:text-2xl">{site.years}</p>
            <p className="mx-auto mt-3 max-w-lg font-serif text-lg leading-snug text-muted italic sm:mt-4 sm:text-xl lg:mx-0">
              &ldquo;{site.quote}&rdquo;
            </p>

            <div className="mx-auto mt-4 h-px w-12 bg-accent sm:mt-5 lg:mx-0" />

            <h2 className="mt-4 font-serif text-2xl font-medium sm:mt-5 sm:text-3xl">
              Expressions of sympathy
            </h2>
            <div className="mx-auto mt-2 max-w-xl space-y-2 text-[15px] leading-relaxed font-normal text-muted sm:text-base lg:mx-0">
              {site.sympathy.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {/* A phone can't scan its own screen, so the QR code is for larger screens. */}
            {site.qrCode && (
              <div className="mt-5 hidden items-center gap-3 lg:flex">
                <Image
                  src={site.qrCode}
                  alt="QR code to donate"
                  width={96}
                  height={96}
                  unoptimized={/^https?:\/\//.test(site.qrCode)}
                  className="h-24 w-24 rounded-lg bg-white p-1.5 shadow-sm ring-1 ring-line short:h-20 short:w-20"
                />
                <p className="max-w-32 text-xs leading-snug text-muted">Scan with your phone to donate</p>
              </div>
            )}
          </div>

          <DonateFlow />
        </div>
      </main>

      <Footer />
    </div>
  );
}
