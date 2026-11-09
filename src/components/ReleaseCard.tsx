import Image from "next/image";
import { artwork } from "@/content/artwork";
import { playIcon } from "./icons";

export type Release = {
  id: string;
  title: string;
  type: string;
  year: number | null;
  artwork: string;
  spotifyUrl: string;
  spotifyId: string;
  youtubePlaylistUrl: string;
};

// The [data-release] buttons open the ListeningPanel.
export default function ReleaseCard({ release: r }: { release: Release }) {
  const art = artwork[r.artwork];
  if (!art) throw new Error(`Missing artwork ${r.artwork} for ${r.title}. Add it to src/content/artwork.ts.`);
  const label = r.year ? String(r.year) : r.type === "single" ? "Single" : "Album";
  return (
    <article className="release" aria-labelledby={`release-${r.id}`}>
      <button className="cover-button" type="button" data-release={r.id} aria-label={`Listen to ${r.title} on this page`} aria-haspopup="dialog">
        <Image
          src={art}
          alt={`${r.title} cover artwork`}
          sizes="(max-width: 720px) 45vw, (max-width: 1200px) 30vw, 373px"
        />
        <span className="cover-play">{playIcon}</span>
      </button>
      <div className="release-heading">
        <h3 id={`release-${r.id}`}>{r.title}</h3>
        <span>{label}</span>
      </div>
      <div className="release-actions">
        <button type="button" data-release={r.id} aria-haspopup="dialog">
          Listen here<span className="visually-hidden"> to {r.title}</span>
        </button>
        <a href={r.spotifyUrl} target="_blank" rel="noopener">
          Spotify <span aria-hidden="true">↗</span>
          <span className="visually-hidden">: {r.title} (opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}
