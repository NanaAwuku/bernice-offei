// Prepares the memorial book for the website from the final brochure PDF.
//
//   npm run book -- "/path/to/Final Brochure.pdf"
//
// Produces:
//   public/downloads/bernice-ofeibea-offei-memorial-book.pdf  optimised download
//       (photos downsampled to 1800 px max and re-encoded; text, fonts,
//        tagging and language are untouched, so text stays selectable)
//   public/book/pages/page-NNN-{700,1400}.webp  page images for the reader
//   src/content/book.json                          page count, sizes and page text
//
// Re-run whenever the brochure changes. Nothing else needs editing.
import * as mupdf from "mupdf";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const src = process.argv[2];
if (!src || !fs.existsSync(src)) {
  console.error('Usage: npm run book -- "/path/to/brochure.pdf"');
  process.exit(1);
}
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const pagesDir = path.join(root, "public/book/pages");
const downloadPath = path.join(root, "public/downloads/bernice-ofeibea-offei-memorial-book.pdf");
const MAX_SIDE = 1800;
const QUALITY = 80;
const WIDTHS = [700, 1400];

fs.mkdirSync(pagesDir, { recursive: true });
fs.mkdirSync(path.dirname(downloadPath), { recursive: true });
const input = fs.readFileSync(src);

// 1. Page images and text (rendered from the untouched original for best quality).
const doc = mupdf.Document.openDocument(input, "application/pdf");
const count = doc.countPages();
const pages = [];
for (let i = 0; i < count; i++) {
  const page = doc.loadPage(i);
  const [x0, , x1] = page.getBounds();
  const w = x1 - x0;
  const scale = (WIDTHS.at(-1) * 1.25) / w; // supersample, then downscale with lanczos
  const png = page.toPixmap(mupdf.Matrix.scale(scale, scale), mupdf.ColorSpace.DeviceRGB, false, true).asPNG();
  const n = String(i + 1).padStart(3, "0");
  for (const width of WIDTHS) {
    await sharp(Buffer.from(png)).resize({ width, kernel: "lanczos3" })
      .webp({ quality: width > 1000 ? 82 : 78, smartSubsample: true })
      .toFile(path.join(pagesDir, `page-${n}-${width}.webp`));
  }
  const text = page.toStructuredText().asText()
    .replace(/In loving Memory of Mrs\. Bernice Ofeibea Offei\s*\d*\s*/i, "")
    .replace(/[ \t]+/g, " ").replace(/\n{2,}/g, "\n").trim();
  pages.push({ number: i + 1, text });
  process.stdout.write(`\rRendered page ${i + 1}/${count}`);
}
const [, , pw, ph] = doc.loadPage(0).getBounds();
fs.writeFileSync(path.join(root, "src/content/book.json"),
  JSON.stringify({ pageCount: count, pageWidth: Math.round(pw), pageHeight: Math.round(ph), widths: WIDTHS, pages }, null, 1));
console.log("\nPage images and text written.");

// 2. Optimised download.
const pdf = mupdf.PDFDocument.openDocument(input, "application/pdf");
const seen = new Set();
let before = 0, after = 0;
function components(cs) {
  if (cs.isName()) return { DeviceRGB: 3, DeviceGray: 1, DeviceCMYK: 4 }[cs.asName()] ?? 0;
  if (cs.isArray() && cs.get(0).asName() === "ICCBased") return cs.get(1).resolve().get("N").asNumber();
  return 0;
}
async function optimiseImage(ref) {
  const id = ref.asIndirect();
  if (seen.has(id)) return;
  seen.add(id);
  const o = ref.resolve();
  const f = o.get("Filter");
  const filter = f.isArray() ? (f.length === 1 ? f.get(0).asName() : "") : f.isName() ? f.asName() : "";
  const len = o.get("Length").asNumber();
  before += len;
  // Only plain RGB JPEGs are touched; anything unusual is left exactly as supplied.
  if (filter !== "DCTDecode" || components(o.get("ColorSpace").resolve()) !== 3 || !o.get("Decode").isNull()) { after += len; return; }
  const w = o.get("Width").asNumber(), h = o.get("Height").asNumber();
  const scale = Math.min(1, MAX_SIDE / Math.max(w, h));
  const img = sharp(Buffer.from(ref.readRawStream().asUint8Array()));
  if (scale < 1) img.resize(Math.round(w * scale), Math.round(h * scale), { kernel: "lanczos3" });
  const { data, info } = await img.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer({ resolveWithObject: true });
  if (data.length > len * 0.85) { after += len; return; }
  ref.writeRawStream(data);
  o.put("Width", info.width);
  o.put("Height", info.height);
  o.delete("DecodeParms");
  after += data.length;
}
async function walk(resources) {
  if (!resources || resources.isNull()) return;
  const xobjects = resources.get("XObject");
  if (xobjects.isNull()) return;
  const refs = [];
  xobjects.forEach((v) => refs.push(v));
  for (const ref of refs) {
    if (!ref.isIndirect()) continue;
    const obj = ref.resolve();
    const type = obj.get("Subtype").asName();
    if (type === "Image") {
      await optimiseImage(ref);
      if (!obj.get("SMask").isNull()) seen.add(obj.get("SMask").asIndirect());
    } else if (type === "Form" && !seen.has(ref.asIndirect())) {
      seen.add(ref.asIndirect());
      await walk(obj.get("Resources"));
    }
  }
}
for (let p = 0; p < pdf.countPages(); p++) await walk(pdf.findPage(p).get("Resources"));
pdf.setMetaData("info:Title", "In Loving Memory of Mrs. Bernice Ofeibea Offei (1963–2026)");
const catalog = pdf.getTrailer().get("Root");
const prefs = catalog.get("ViewerPreferences").isNull() ? pdf.newDictionary() : catalog.get("ViewerPreferences");
prefs.put("DisplayDocTitle", true);
catalog.put("ViewerPreferences", prefs);
// Note: "garbage" level 1 only. Higher levels (compact/deduplicate) corrupted
// some content streams in mupdf.js 1.28 after objects had been resolved.
fs.writeFileSync(downloadPath, pdf.saveToBuffer("garbage,compress").asUint8Array());
console.log(`Images ${(before / 1e6).toFixed(1)} MB -> ${(after / 1e6).toFixed(1)} MB. Download: ${(fs.statSync(downloadPath).size / 1e6).toFixed(1)} MB`);
