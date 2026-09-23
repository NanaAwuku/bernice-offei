import Image from "next/image";
import CheckoutCard from "@/components/CheckoutCard";
import portrait from "../../public/images/portrait.jpg";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">
        <div className="text-center">
          <div className="mx-auto h-56 w-56 overflow-hidden rounded-full border-4 border-surface shadow-lg ring-1 ring-line sm:h-64 sm:w-64">
            <Image
              src={portrait}
              alt="Portrait of Bernice Ofeibea Offei"
              preload
              placeholder="blur"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-10 text-xs tracking-[0.3em] text-muted uppercase">In loving memory of</p>
          <h1 className="mt-3 font-serif text-5xl leading-tight font-medium sm:text-6xl">
            Bernice Ofeibea Offei
          </h1>
          <p className="mt-3 font-serif text-2xl text-accent">1963 &ndash; 2026</p>
          <p className="mx-auto mt-8 max-w-lg font-serif text-xl leading-relaxed text-muted italic">
            &ldquo;Let the memory of our sister, mother and wife, Bernice, be with us forever.&rdquo;
          </p>
          <a
            href="#donate"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-sm font-medium tracking-wide text-white uppercase shadow-sm transition hover:bg-accent-strong lg:hidden"
          >
            Donate now
          </a>
        </div>

        <div className="flex justify-center">
          <CheckoutCard />
        </div>
      </div>
    </main>
  );
}
