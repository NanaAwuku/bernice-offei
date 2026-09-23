import Image from "next/image";
import DonateButton from "@/components/DonateButton";
import portrait from "../../public/images/portrait.jpg";
import gallery1 from "../../public/images/gallery-1.jpg";
import gallery2 from "../../public/images/gallery-2.jpg";

const gallery = [
  { src: gallery1, alt: "Bernice singing on stage" },
  { src: gallery2, alt: "Bernice in a colourful African-print outfit" },
  { src: portrait, alt: "Bernice smiling outdoors" },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="px-4 pt-20 pb-16 text-center sm:pt-28">
        <div className="mx-auto max-w-2xl">
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
          <DonateButton className="mt-10" />
        </div>
      </section>

      {/* About */}
      <section className="border-y border-line bg-surface px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-medium">Her life</h2>
          <div className="mx-auto mt-4 h-px w-12 bg-accent" />
          <p className="mt-8 leading-relaxed text-muted">
            Bernice was born on 25 February 1963 and passed away on Saturday,
            12 September 2026, at the age of 63. A beloved sister, mother and wife, she
            touched countless lives through her distinctive voice and her music, and she
            will be remembered forever by her family, friends and all who knew her.
          </p>
          <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs tracking-[0.2em] text-muted uppercase">Born</dt>
              <dd className="mt-1 font-serif text-xl">25 February 1963</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-muted uppercase">Passed away</dt>
              <dd className="mt-1 font-serif text-xl">12 September 2026</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-medium">Cherished moments</h2>
          <div className="mx-auto mt-4 h-px w-12 bg-accent" />
          <div className="mt-10 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-3">
            {gallery.map((photo) => (
              <div
                key={photo.alt}
                className="aspect-square w-full max-w-60 overflow-hidden rounded-xl shadow-md ring-1 ring-line"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  placeholder="blur"
                  sizes="240px"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donate */}
      <section className="border-t border-line bg-surface px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-serif text-3xl font-medium">Honour her memory</h2>
          <div className="mx-auto mt-4 h-px w-12 bg-accent" />
          <p className="mt-8 leading-relaxed text-muted">
            Your kind contribution will support the family during this difficult time.
            Thank you for your love, prayers and generosity.
          </p>
          <DonateButton className="mt-8" />
        </div>
      </section>

      <footer className="px-4 py-8 text-center text-xs text-muted">
        Forever in our hearts &middot; Bernice Ofeibea Offei &middot; 1963 &ndash; 2026
      </footer>
    </main>
  );
}
