import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/photos/bernice-portrait.jpeg";
import cover from "@/assets/photos/memorial-book-cover.jpg";
import FeaturedRecording from "@/components/FeaturedRecording";
import { bookIcon, playIcon } from "@/components/icons";
import LiveStage from "@/components/LiveStage";
import { PDF_SIZE, PDF_URL, SHOW_MEMORIAL_BOOK } from "@/lib/book";
import { LIVESTREAM, SHOW_PORTRAIT_HERO } from "@/lib/livestream";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ path: "/" });

export default function Home() {
  const photo = (
    <Image
      className="hero-photo"
      src={portrait}
      alt="Bernice Ofeibea Offei smiling"
      sizes="(max-width: 720px) 100vw, (min-width: 1900px) 1390px, 1220px"
      loading="eager"
      fetchPriority="high"
    />
  );
  const name = (
    <>
      <h1 id="hero-title">
        Bernice
        <br />
        Ofeibea Offei
      </h1>
      <p className="dates">
        <time dateTime="1963-02-25">{site.born}</time> – <time dateTime="2026-09-12">{site.died}</time>
      </p>
    </>
  );

  // Hidden (kept for later): the original portrait hero. See SHOW_PORTRAIT_HERO.
  const portraitHero = (
    <section id="home" className="hero" aria-labelledby="hero-title">
      {photo}
      <div className="wrap">
        <div className="hero-copy">
          <p className="eyebrow">In loving memory</p>
          {name}
          <p className="hero-message">
            A life of faith. A voice of hope.
            <br />
            Forever in our hearts.
          </p>
          <div className="actions">
            {SHOW_MEMORIAL_BOOK && (
              <Link className="button gold" href="/memorial-book">
                Read the Memorial Book
              </Link>
            )}
            {/* Becomes the primary (gold) button when the memorial book is hidden. */}
            <Link className={SHOW_MEMORIAL_BOOK ? "button" : "button gold"} href="/music">
              Listen to Her Music
            </Link>
          </div>
        </div>
      </div>
    </section>
  );

  // The hero: the stream plays behind the copy, with the memorial book beside it.
  const liveHero = (
    <section id="home" className="hero hero-live" aria-labelledby="hero-title">
      <LiveStage />
      <div className="wrap">
        <div className="hero-copy has-book">
          {/* The book's first page (its cover); opens the reader there. */}
          <Link className="book-preview" href="/memorial-book#page/1">
            <span className="book-preview-cover">
              <Image
                src="/book/pages/page-001-700.webp"
                width={700}
                height={990}
                alt=""
                sizes="(max-width: 720px) 110px, (min-width: 1900px) 260px, 220px"
                loading="eager"
              />
            </span>
            <span className="visually-hidden">The Memorial Book: open it at the first page</span>
          </Link>
          {name}
          <p className="hero-message">Join us, wherever you are, as we celebrate her life and lay her to rest.</p>
          <div className="actions live-actions">
            <a className="button gold" href={LIVESTREAM.url} target="_blank" rel="noopener">
              {playIcon}
              {LIVESTREAM.cta}
              <span className="visually-hidden">(YouTube, opens in a new tab)</span>
            </a>
            <Link className="button" href="/memorial-book">
              {bookIcon}
              <span>
                <span className="wide-only">Read the </span>Memorial Book
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      {SHOW_PORTRAIT_HERO ? portraitHero : liveHero}

      <div className="light">
        <section className="wrap intro" aria-labelledby="intro-title">
          <p className="eyebrow">The woman behind the music</p>
          <h2 id="intro-title">Remembering Bernice</h2>
          <p>
            Many knew her through her music. Behind the songs was a woman deeply rooted in faith, devoted to her
            family and generous in friendship.
          </p>
          <p>Here, we remember both the voice that reached so many and the Bernice known and loved by family and friends.</p>
        </section>

        {SHOW_MEMORIAL_BOOK && (
          <section id="memorial-book" className="wrap book" aria-labelledby="book-title">
            <Link className="book-cover-link" href="/memorial-book" aria-label="Open the memorial book">
              <Image
                className="book-image"
                src={cover}
                alt="Cover of the memorial book for Mrs Bernice Ofeibea Offei"
                sizes="(max-width: 720px) 260px, 340px"
              />
            </Link>
            <div className="book-copy">
              <p className="eyebrow">Her life, in these pages</p>
              <h2 id="book-title">The Memorial Book</h2>
              <p>Explore the photographs, stories and memories gathered in her honour.</p>
              <div className="actions">
                <Link className="button gold" href="/memorial-book">
                  Read Online
                </Link>
                <a className="text-link" href={PDF_URL} download>
                  Download PDF <span aria-hidden="true">↓</span>
                  <span className="visually-hidden">({PDF_SIZE})</span>
                </a>
              </div>
            </div>
          </section>
        )}
      </div>

      <section id="her-music" className="music" aria-labelledby="music-title">
        <div className="wrap music-layout">
          <div className="music-copy">
            <p className="eyebrow">The music of Bernice Offei</p>
            <h2 id="music-title">Her voice lives on</h2>
            <p>Return to the songs that brought comfort, faith and hope.</p>
            <Link className="button gold" href="/music">
              Explore Her Music
            </Link>
          </div>
          <article className="recording" aria-label="Featured recording: Life Is Short">
            <FeaturedRecording sizes="(max-width: 720px) 90vw, 440px" />
          </article>
        </div>
      </section>

      <div className="light">
        <section id="tributes" className="tributes" aria-labelledby="tributes-title">
          <div className="wrap">
            <p className="eyebrow">Together, we remember</p>
            <h2 id="tributes-title">Memories shared with love</h2>
            <p>Read the memories shared by family and friends, and add your own on ForeverMissed.</p>
            <a href={site.foreverMissedUrl} target="_blank" rel="noopener">
              Visit ForeverMissed <span aria-hidden="true">↗</span>
              <span className="visually-hidden">: Bernice’s memorial page (opens in a new tab)</span>
            </a>
          </div>
        </section>

        <section id="donations" className="donation-section" aria-labelledby="donations-title">
          <div className="wrap donation-inner">
            <div>
              <h2 id="donations-title">Expressions of sympathy</h2>
              <p>Thank you for your love, prayers and support.</p>
            </div>
            <a className="button" href="/donate" data-donate>
              Make a Donation
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
