"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { announceMediaStart, onOtherMediaStart, spotifyEmbed, youtubePlaylistEmbed } from "@/lib/media";

type Release = { id: string; title: string; spotifyId: string; spotifyUrl: string; youtubePlaylistUrl: string };
type Platform = "spotify" | "youtube";

// One accessible listening panel for every release, opened by any [data-release]
// button. Spotify is the default; switching platform replaces the iframe
// (stopping the previous player) and closing the panel removes it (stopping
// playback). Focus returns to the control that opened the panel.
export default function ListeningPanel({ releases }: { releases: Release[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const spotifyRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [current, setCurrent] = useState<Release | null>(null);
  const [platform, setPlatform] = useState<Platform>("spotify");

  const open = useCallback(
    (id: string, trigger: HTMLElement) => {
      const release = releases.find((r) => r.id === id);
      if (!release) return;
      openerRef.current = trigger;
      announceMediaStart("listening-panel"); // stops the featured video
      flushSync(() => {
        setCurrent(release);
        setPlatform("spotify");
      });
      dialogRef.current?.showModal();
      spotifyRef.current?.focus();
    },
    [releases],
  );

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const trigger = (e.target as Element).closest<HTMLElement>("[data-release]");
      if (trigger) open(trigger.dataset.release!, trigger);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  useEffect(
    () => onOtherMediaStart("listening-panel", () => dialogRef.current?.open && dialogRef.current.close()),
    [],
  );

  const yt = platform === "youtube";
  const name = yt ? "YouTube" : "Spotify";

  return (
    <dialog
      ref={dialogRef}
      className="listen-dialog"
      aria-labelledby="listen-title"
      onClose={() => {
        setCurrent(null);
        openerRef.current?.focus();
      }}
      onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
    >
      <div className="dialog-head">
        <div>
          <p className="eyebrow">Listen to</p>
          <h2 id="listen-title">{current?.title}</h2>
        </div>
        <button type="button" className="dialog-close" aria-label="Close listening panel" onClick={() => dialogRef.current?.close()}>
          Close <span aria-hidden="true">✕</span>
        </button>
      </div>
      <div className="player-platforms" role="group" aria-label="Listening platform">
        <button ref={spotifyRef} type="button" aria-pressed={!yt} onClick={() => setPlatform("spotify")}>
          Spotify
        </button>
        <button type="button" aria-pressed={yt} onClick={() => setPlatform("youtube")}>
          YouTube
        </button>
      </div>
      <div className={yt ? "album-embed youtube-player" : "album-embed"} aria-live="off">
        {current && (
          <iframe
            key={`${current.id}-${platform}`}
            title={`${current.title} — ${yt ? "YouTube playlist" : "Spotify album player"}`}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            src={yt ? youtubePlaylistEmbed(current.youtubePlaylistUrl) : spotifyEmbed(current.spotifyId)}
          />
        )}
      </div>
      <p className="player-note">
        <span>Playback and availability are provided by {name}.</span>{" "}
        <a href={current ? (yt ? current.youtubePlaylistUrl : current.spotifyUrl) : undefined} target="_blank" rel="noopener">
          Open on {name} <span aria-hidden="true">↗</span>
          {current && <span className="visually-hidden">: {current.title} (opens in a new tab)</span>}
        </a>
      </p>
    </dialog>
  );
}
