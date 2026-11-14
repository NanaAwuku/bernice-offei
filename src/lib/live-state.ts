"use client";

import { useSyncExternalStore } from "react";
import { LIVESTREAM } from "./livestream";

// Browser-side "the broadcast has ended" flag, shared by the hero, the header and
// the player. Set when a YouTube player on the page reports the end (see
// watchStream). Remembered on this device for a while so a reload goes straight
// back to the portrait hero instead of flashing the live one.
const KEY = `memorial:livestream-ended:${LIVESTREAM.youtubeId}`;
const REMEMBER_MS = 12 * 60 * 60 * 1000;

let ended: boolean | undefined;
const listeners = new Set<() => void>();

function read() {
  if (ended === undefined) {
    try {
      const at = Number(localStorage.getItem(KEY));
      ended = at > 0 && Date.now() - at < REMEMBER_MS;
    } catch {
      ended = false;
    }
  }
  return ended;
}

export function markLiveEnded() {
  if (read()) return;
  ended = true;
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** True once the broadcast is known to have ended (always false on the server). */
export function useLiveEnded() {
  return useSyncExternalStore(subscribe, read, () => false);
}

// --- YouTube IFrame Player API ------------------------------------------------

export type YTPlayer = { getVideoData?: () => { isLive?: boolean }; playVideo?: () => void; pauseVideo?: () => void };
type YTNamespace = {
  Player: new (
    el: HTMLIFrameElement,
    opts: { events: { onReady?: () => void; onError?: () => void; onStateChange: (e: { data: number }) => void } },
  ) => YTPlayer;
  PlayerState: { ENDED: number; PLAYING: number };
};
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let api: Promise<YTNamespace> | undefined;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  api ??= new Promise<YTNamespace>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT!);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      api = undefined;
      reject(new Error("YouTube IFrame API failed to load"));
    };
    document.head.appendChild(script);
  });
  return api;
}

type StreamEvents = {
  onPlayer?: (player: YTPlayer) => void;
  /** The player is set up (not necessarily playing). */
  onReady?: () => void;
  /** Frames are actually playing: safe to show the player. */
  onPlaying?: () => void;
  /** The player can't show the video (blocked, restricted, removed…). */
  onError?: () => void;
  /** The IFrame API itself couldn't load, so nothing will be reported. */
  onNoApi?: () => void;
  onEnded: () => void;
};

/**
 * Follow an embedded livestream player (its src must include enablejsapi=1).
 * Calls onEnded when the broadcast finishes, or when the video turns out to be a
 * recording rather than a live broadcast. Returns a cleanup function.
 */
export function watchStream(iframe: HTMLIFrameElement, events: StreamEvents) {
  let active = true;
  const when =
    <A extends unknown[]>(fn?: (...args: A) => void) =>
    (...args: A) => {
      if (active) fn?.(...args);
    };
  loadYouTubeApi()
    .then((YT) => {
      if (!active) return;
      const player: YTPlayer = new YT.Player(iframe, {
        events: {
          onReady: when(events.onReady),
          onError: when(events.onError),
          onStateChange: when(({ data }: { data: number }) => {
            if (data === YT.PlayerState.ENDED) events.onEnded();
            else if (data === YT.PlayerState.PLAYING) {
              if (player.getVideoData?.().isLive === false) events.onEnded();
              else events.onPlaying?.();
            }
          }),
        },
      });
      events.onPlayer?.(player);
    })
    // Without the API the stream still plays; it just can't report anything.
    .catch(when(events.onNoApi));
  return () => {
    active = false;
  };
}
