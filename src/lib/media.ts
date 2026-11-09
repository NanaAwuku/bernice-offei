// Tiny coordination bus so only one player sounds at a time.
// Every player calls announceMediaStart(id) when it starts and listens with
// onOtherMediaStart(id, stop) to stop itself when something else starts.
const EVENT = "memorial:media-start";

export function announceMediaStart(id: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: id }));
}

/** Returns an unsubscribe function. */
export function onOtherMediaStart(id: string, stop: () => void) {
  const listener = (e: Event) => {
    if ((e as CustomEvent<string>).detail !== id) stop();
  };
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

export function youtubeEmbed(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;
}
export function youtubePlaylistEmbed(playlistUrl: string) {
  const list = new URL(playlistUrl).searchParams.get("list");
  return `https://www.youtube-nocookie.com/embed/videoseries?list=${list}&rel=0&playsinline=1`;
}
export function spotifyEmbed(albumId: string) {
  return `https://open.spotify.com/embed/album/${albumId}?utm_source=generator&theme=0`;
}
