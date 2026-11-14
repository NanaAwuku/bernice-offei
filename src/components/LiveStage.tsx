"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { watchStream, type YTPlayer } from "@/lib/youtube-player";
import { LIVESTREAM, previewEmbed } from "@/lib/livestream";
import { pauseIcon, playIcon } from "./icons";

// Home hero backdrop while the funeral is streaming: a muted, chrome-less preview
// of the stream. It is shown only once YouTube reports it is actually playing;
// until then (or if YouTube refuses it, e.g. on a network that restricts
// YouTube) the stage stays dark, with a quiet "connecting" indicator that
// steps aside after a while (no photo). The preview is decorative (inert); "Watch
// Live" and the picture itself open the stream on YouTube in a new tab. Pause
// freezes it on the current frame; visitors who prefer reduced motion get it
// paused from the start. If playback reaches the end it starts again, so the
// video is always there.
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const motionAllowed = () => !matchMedia(REDUCED_MOTION).matches;
const noSubscribe = () => () => {};

export default function LiveStage() {
  // The player is created only in the browser, after hydration.
  const hydrated = useSyncExternalStore(noSubscribe, () => true, () => false);
  const autoplay = useSyncExternalStore(subscribeMotion, motionAllowed, () => false);
  const [choice, setChoice] = useState<boolean | null>(null); // the visitor's pause/play, if any
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false); // YouTube can't show it here
  const [waited, setWaited] = useState(false); // stop showing "connecting" after a while
  const frameRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const playing = choice ?? autoplay;

  useEffect(() => {
    const frame = frameRef.current;
    if (!hydrated || !frame) return;
    const reveal = () => setReady(true);
    const timers = [setTimeout(() => setWaited(true), 15000)];
    const stop = watchStream(frame, {
      onPlayer: (p) => (playerRef.current = p),
      onPlaying: reveal,
      // Not autoplaying (reduced motion): show YouTube's still of the stream.
      onReady: () => !motionAllowed() && timers.push(setTimeout(reveal, 800)),
      onError: () => {
        setFailed(true);
        setReady(false);
      },
      onNoApi: () => timers.push(setTimeout(reveal, 4000)), // can't tell: assume it plays
      onEnded: () => playerRef.current?.playVideo?.(),
    });
    return () => {
      stop();
      timers.forEach(clearTimeout);
    };
  }, [hydrated]);

  function toggle() {
    const player = playerRef.current;
    if (playing) player?.pauseVideo?.();
    else player?.playVideo?.();
    setChoice(!playing);
  }

  return (
    <div className={["live-stage", ready && "is-ready", (failed || waited) && "is-quiet"].filter(Boolean).join(" ")}>
      {hydrated && !failed && (
        <div className="live-frame" inert>
          <iframe
            ref={frameRef}
            // Fixed at first render: changing it would reload the player.
            src={previewEmbed(autoplay)}
            title="Muted preview of the livestream"
            tabIndex={-1}
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}
      {/* Clicking the picture opens the stream too; "Watch Live" is the accessible route. */}
      <a className="live-stage-open" href={LIVESTREAM.url} target="_blank" rel="noopener" tabIndex={-1} aria-hidden="true">
        <span className="live-loading">
          <span className="live-spinner" />
          Connecting to the livestream
        </span>
        <span className="play-badge">{playIcon}</span>
      </a>
      <div className="live-stage-bar">
        <span className="live-pill is-live">
          <span className="live-dot" aria-hidden="true" />
          Live
        </span>
        <span className="live-stage-note" aria-hidden="true">
          {failed ? "Watch on YouTube" : !ready ? "Connecting…" : playing ? "Muted preview" : "Preview paused"}
        </span>
        <button
          type="button"
          className="live-stage-toggle"
          hidden={failed || !hydrated}
          aria-label={playing ? "Pause the background preview" : "Play the background preview"}
          onClick={toggle}
        >
          {playing ? pauseIcon : playIcon}
        </button>
      </div>
    </div>
  );
}
