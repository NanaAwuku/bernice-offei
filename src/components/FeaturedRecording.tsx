"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import artwork from "@/assets/photos/life-is-short.png";
import discography from "@/content/discography.json";
import { announceMediaStart, onOtherMediaStart, youtubeEmbed } from "@/lib/media";
import { playIcon } from "./icons";

// Featured "Life Is Short" recording: supplied artwork as a poster; the YouTube
// player is created only when the visitor presses play (no autoplay on arrival)
// and removed (stopping playback) when another player starts.
export default function FeaturedRecording({
  showCaption = true,
  sizes = "(max-width: 720px) 90vw, 520px",
}: {
  showCaption?: boolean;
  sizes?: string;
}) {
  const f = discography.featured;
  const id = `recording-${f.youtubeId}`;
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => onOtherMediaStart(id, () => setPlaying(false)), [id]);
  useEffect(() => {
    if (playing) frameRef.current?.focus();
  }, [playing]);

  return (
    <>
      <div className={playing ? "recording-player is-playing" : "recording-player"}>
        {playing ? (
          <iframe
            ref={frameRef}
            src={youtubeEmbed(f.youtubeId)}
            title={`${f.title} — ${f.artist} (YouTube video player)`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            className="poster-button"
            type="button"
            aria-label={`Play ${f.title} by ${f.artist} on this page`}
            onClick={() => {
              announceMediaStart(id);
              setPlaying(true);
            }}
          >
            <Image src={artwork} alt={`${f.title} artwork featuring ${f.artist}`} sizes={sizes} />
            <span className="play-badge">{playIcon}</span>
          </button>
        )}
      </div>
      {showCaption && (
        <div className="recording-caption">
          <div>
            <p className="eyebrow">Featured recording</p>
            <h3>{f.title}</h3>
            <p className="recording-artist">{f.artist}</p>
          </div>
          <a href={f.youtubeUrl} target="_blank" rel="noopener">
            Watch on YouTube <span aria-hidden="true">↗</span>
            <span className="visually-hidden">(opens in a new tab)</span>
          </a>
        </div>
      )}
    </>
  );
}
