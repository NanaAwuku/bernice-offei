// Downloads release artwork listed in src/content/discography.json (artworkSource)
// into src/assets/artwork/ so the site never hotlinks a third-party image CDN.
// Existing files are kept; delete one to re-download it.
import fs from "node:fs"; import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "src/content/discography.json"), "utf8"));
const dir = path.join(root, "src/assets/artwork"); fs.mkdirSync(dir, { recursive: true });
for (const r of data.releases) {
  const file = path.join(dir, r.artwork);
  if (fs.existsSync(file) || !r.artworkSource) continue;
  const res = await fetch(r.artworkSource);
  if (!res.ok) { console.error(`Failed ${r.title}: ${res.status}`); process.exitCode = 1; continue; }
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log(`Saved ${r.artwork}`);
}
