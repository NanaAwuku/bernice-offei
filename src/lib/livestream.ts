import { site } from "./site";

// The funeral livestream (src/content/site.json → livestream): always shown behind
// the home hero (LiveStage) and linked from the header and "Watch Live".
const config = site.livestream;

// The original portrait hero (her photo, "In loving memory") is kept in the home
// page but hidden. Set to true to show it again instead of the stream.
export const SHOW_PORTRAIT_HERO = false;

export const LIVESTREAM = {
  title: config.title,
  youtubeId: config.youtubeId,
  url: config.url,
  cta: "Watch Live",
};

// enablejsapi lets the YouTube IFrame API report when the broadcast ends.
const base = `https://www.youtube-nocookie.com/embed/${config.youtubeId}`;

/** Silent, chrome-less background preview for the hero (autoplay=0 for reduced motion). */
export const previewEmbed = (autoplay: boolean) =>
  `${base}?autoplay=${autoplay ? 1 : 0}&mute=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&rel=0&playsinline=1&enablejsapi=1`;
