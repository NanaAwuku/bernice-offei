import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "./site";

const DEFAULT_PORTRAIT = "/images/portrait.jpg";

async function read(src: string) {
  const bytes = /^https?:\/\//.test(src)
    ? Buffer.from(await (await fetch(src)).arrayBuffer())
    : await readFile(join(process.cwd(), "public", src));
  const mime = /\.png(\?|$)/i.test(src) ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

// The portrait is a path under /public or a remote URL (see site.portrait). If it
// can't be read (typo, file not deployed, remote down) fall back to the bundled
// portrait so the icons and link preview never break the build.
export async function loadPortrait() {
  try {
    return await read(site.portrait);
  } catch (error) {
    console.warn(`Could not load portrait "${site.portrait}"; using the default.`, error);
    return read(DEFAULT_PORTRAIT);
  }
}
