import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "./site";

// The portrait is a path under /public or a remote URL (see site.portrait).
export async function loadPortrait() {
  const src = site.portrait;
  const bytes = /^https?:\/\//.test(src)
    ? Buffer.from(await (await fetch(src)).arrayBuffer())
    : await readFile(join(process.cwd(), "public", src));
  const mime = /\.png(\?|$)/i.test(src) ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${bytes.toString("base64")}`;
}
