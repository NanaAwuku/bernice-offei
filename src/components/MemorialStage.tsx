import Image from "next/image";
import portrait from "@/assets/photos/bernice-portrait.jpeg";
import { LIVESTREAM } from "@/lib/livestream";
import { playIcon } from "./icons";

// Home hero backdrop now the funeral has taken place: her portrait, where the
// livestream preview (LiveStage) used to play, with the same veil and picture
// link. The live preview is kept; see SHOW_LIVE_PREVIEW.
export default function MemorialStage() {
  return (
    <div className="live-stage is-ready is-photo">
      <div className="live-photo">
        <Image
          src={portrait}
          alt="Bernice Ofeibea Offei smiling"
          fill
          sizes="(max-width: 720px) 100vw, 80vw"
          loading="eager"
          fetchPriority="high"
          placeholder="blur"
        />
      </div>
      {/* Clicking the picture opens the service recording; the gold button is the accessible route. */}
      <a className="live-stage-open" href={LIVESTREAM.url} target="_blank" rel="noopener" tabIndex={-1} aria-hidden="true">
        <span className="play-badge">{playIcon}</span>
      </a>
    </div>
  );
}
