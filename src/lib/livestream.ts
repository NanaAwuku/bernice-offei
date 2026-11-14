import { site } from "./site";

// The funeral livestream (src/content/site.json → livestream). With status "live"
// the home hero shows the stream until the broadcast ends, then returns to the
// portrait (see live-state.ts and livestream-status.ts). "off" removes it.
const config = site.livestream;

export const LIVESTREAM = {
  title: config.title,
  youtubeId: config.youtubeId,
  url: config.url,
  enabled: config.status === "live",
  cta: "Watch Live",
};

// enablejsapi lets the YouTube IFrame API report when the broadcast ends.
const base = `https://www.youtube-nocookie.com/embed/${config.youtubeId}`;

/** Silent, chrome-less background preview for the hero (autoplay=0 for reduced motion). */
export const previewEmbed = (autoplay: boolean) =>
  `${base}?autoplay=${autoplay ? 1 : 0}&mute=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&rel=0&playsinline=1&enablejsapi=1`;
