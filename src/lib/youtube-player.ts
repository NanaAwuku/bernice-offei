"use client";

// Thin wrapper around the official YouTube IFrame Player API, used by the home
// hero's background stream (LiveStage) to know when it is really playing, to
// pause/resume it and to restart it if it reaches the end.

export type YTPlayer = { playVideo?: () => void; pauseVideo?: () => void };
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
  /** Playback reached the end. */
  onEnded?: () => void;
};

/** Follow an embedded player (its src must include enablejsapi=1). Returns a cleanup function. */
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
            if (data === YT.PlayerState.PLAYING) events.onPlaying?.();
            else if (data === YT.PlayerState.ENDED) events.onEnded?.();
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
