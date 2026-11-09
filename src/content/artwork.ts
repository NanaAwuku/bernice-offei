import type { StaticImageData } from "next/image";
import byGrace from "@/assets/artwork/by-grace.jpg";
import grateful from "@/assets/artwork/grateful.jpg";
import heavenBound from "@/assets/artwork/heaven-bound.jpg";
import holdOn from "@/assets/artwork/hold-on.jpg";
import life from "@/assets/artwork/life.jpg";
import meKoSo from "@/assets/artwork/me-ko-so.jpg";
import yourWill from "@/assets/artwork/your-will.jpg";

// Release covers, keyed by the `artwork` file name in discography.json.
// Adding a release: put its cover in src/assets/artwork/ (or run `npm run artwork`)
// and add it here.
export const artwork: Record<string, StaticImageData> = {
  "by-grace.jpg": byGrace,
  "grateful.jpg": grateful,
  "heaven-bound.jpg": heavenBound,
  "hold-on.jpg": holdOn,
  "life.jpg": life,
  "me-ko-so.jpg": meKoSo,
  "your-will.jpg": yourWill,
};
