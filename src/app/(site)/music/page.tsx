import type { Metadata } from "next";
import FeaturedRecording from "@/components/FeaturedRecording";
import ListeningPanel from "@/components/ListeningPanel";
import ReleaseCard from "@/components/ReleaseCard";
import discography from "@/content/discography.json";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Her Music",
  path: "/music",
  description: "Listen to the music of Bernice Offei: songs of faith, comfort and hope, on Spotify and YouTube.",
});

const albums = discography.releases.filter((r) => r.type === "album");
const singles = discography.releases.filter((r) => r.type === "single");
const panelReleases = discography.releases.map(({ id, title, spotifyId, spotifyUrl, youtubePlaylistUrl }) => ({
  id,
  title,
  spotifyId,
  spotifyUrl,
  youtubePlaylistUrl,
}));

export default function MusicPage() {
  const f = discography.featured;
  return (
    <>
      <section className="music-intro" aria-labelledby="music-title">
        <div className="wrap">
          <p className="eyebrow">The music of Bernice Offei</p>
          <h1 id="music-title">Her voice lives on.</h1>
          <p className="lead">
            Songs of faith, comfort and hope.
            <br />A voice to return to, through every season of life.
          </p>
          <nav className="section-jumps" aria-label="On this page">
            <a href="#featured">
              Featured song <span aria-hidden="true">↓</span>
            </a>
            <a href="#albums">
              Albums <span aria-hidden="true">↓</span>
            </a>
            <a href="#singles">
              Singles <span aria-hidden="true">↓</span>
            </a>
          </nav>
        </div>
      </section>

      <section id="featured" className="featured-song" aria-labelledby="featured-title">
        <div className="wrap featured-inner">
          <div className="featured-copy">
            <p className="eyebrow">A song to remember</p>
            <h2 id="featured-title">{f.title}</h2>
            <p>Listen again to Bernice’s voice, and the message she shared through her music.</p>
            <a href={f.youtubeUrl} target="_blank" rel="noopener">
              Watch on YouTube <span aria-hidden="true">↗</span>
              <span className="visually-hidden">(opens in a new tab)</span>
            </a>
          </div>
          <div className="feature-media">
            <FeaturedRecording showCaption={false} sizes="(max-width: 720px) 90vw, 520px" />
          </div>
        </div>
      </section>

      <div className="light">
        <section id="albums" className="wrap catalog-section" aria-labelledby="albums-title">
          <div className="catalog-heading">
            <h2 id="albums-title">The albums</h2>
            <p>Choose an album and listen here on Spotify or YouTube.</p>
          </div>
          <div className="release-grid">
            {albums.map((r) => (
              <ReleaseCard key={r.id} release={r} />
            ))}
          </div>
        </section>

        <section id="singles" className="wrap catalog-section singles" aria-labelledby="singles-title">
          <div className="catalog-heading">
            <h2 id="singles-title">The singles</h2>
          </div>
          <div className="release-grid">
            {singles.map((r) => (
              <ReleaseCard key={r.id} release={r} />
            ))}
          </div>
        </section>

        <section className="music-ending" aria-label="Closing words">
          <div className="wrap">
            <p>Her songs remain with us.</p>
          </div>
        </section>
      </div>

      <ListeningPanel releases={panelReleases} />
    </>
  );
}
