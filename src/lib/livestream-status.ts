import { LIVESTREAM } from "./livestream";

// Server components only (reads a private env var). Server-side check that the broadcast hasn't ended, using the official YouTube
// Data API. Optional: it only runs when YOUTUBE_API_KEY is set; otherwise the
// browser detects the end itself (live-state.ts). Cached for 60 seconds, so pages
// that read it are regenerated at most once a minute.
async function broadcastEnded(): Promise<boolean> {
  const key = process.env.YOUTUBE_API_KEY?.trim();
  if (!key) return false;
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.search = new URLSearchParams({ part: "liveStreamingDetails", id: LIVESTREAM.youtubeId, key }).toString();
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return false; // can't tell: keep showing the stream
    const data: { items?: { liveStreamingDetails?: { actualEndTime?: string } }[] } = await res.json();
    if (!data.items?.length) return true; // removed or made private
    return Boolean(data.items[0].liveStreamingDetails?.actualEndTime);
  } catch {
    return false;
  }
}

/** Whether the site should present the livestream right now. */
export async function showLivestream() {
  return LIVESTREAM.enabled && !(await broadcastEnded());
}
