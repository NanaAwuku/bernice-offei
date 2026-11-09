// Memorial book reader behaviour (ported from the Astro site's flipbook.ts).
// The page-turn effect is page-flip (MIT); navigation, zoom, fullscreen, sound,
// deep links (#page/12) and accessibility are ours. initFlipbook returns a
// destroy function so the reader can be torn down on client-side navigation.
import { PageFlip } from "page-flip/dist/js/page-flip.module.js";

const ZOOM_LEVELS = [1, 1.5, 2, 3];
const PRELOAD_BEHIND = 2;
const PRELOAD_AHEAD = 5;

export type BookInfo = { pageCount: number; pageWidth: number; pageHeight: number };

const pad = (n: number) => String(n).padStart(3, "0");

// page-flip moves and finally removes the element it is given, so the pages are
// built here rather than rendered by React.
function buildBook({ pageCount: count, pageWidth: pw, pageHeight: ph }: BookInfo) {
  const book = document.createElement("div");
  book.className = "flipbook";
  book.dataset.flipbook = "";
  for (let n = 1; n <= count; n++) {
    const page = document.createElement("div");
    page.className = "book-page";
    page.dataset.density = n === 1 || n === count ? "hard" : "soft";
    const img = document.createElement("img");
    img.dataset.src = `/book/pages/page-${pad(n)}-700.webp`;
    img.dataset.srcLarge = `/book/pages/page-${pad(n)}-1400.webp`;
    img.alt = `Memorial book, page ${n} of ${count}`;
    img.width = 700;
    img.height = Math.round((700 * ph) / pw);
    img.draggable = false;
    page.append(img);
    book.append(page);
  }
  return book;
}

export function initFlipbook(reader: HTMLElement, info: BookInfo): () => void {
  const { pageCount: count, pageWidth: pw, pageHeight: ph } = info;
  const stage = reader.querySelector<HTMLElement>("[data-stage]")!;
  const bookEl = buildBook(info);
  stage.prepend(bookEl);
  const zoomView = reader.querySelector<HTMLElement>("[data-zoom-view]")!;
  const pageInput = reader.querySelector<HTMLInputElement>("[data-page-input]")!;
  const pageLabel = reader.querySelector<HTMLElement>("[data-page-label]")!;
  const zoomLabel = reader.querySelector<HTMLElement>("[data-zoom-label]")!;
  const announcer = reader.querySelector<HTMLElement>("[data-announcer]")!;
  const btn = (a: string) => reader.querySelector<HTMLButtonElement>(`[data-action="${a}"]`)!;
  const imgs = Array.from(bookEl.querySelectorAll<HTMLImageElement>("img"));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Every listener below is removed by destroy().
  const cleanup = new AbortController();
  const { signal } = cleanup;

  let zoomIndex = 0;
  let soundOn = false; // page-turn sound is off by default
  let audio: AudioContext | null = null;

  // --- Lazy page images: load only around the visible spread. -------------
  const load = (i: number) => {
    const img = imgs[i];
    if (img && !img.src) img.src = img.dataset.src!;
  };
  const preload = (index: number) => {
    for (let i = index - PRELOAD_BEHIND; i <= index + PRELOAD_AHEAD; i++) load(i);
  };
  const startIndex = Math.min(count, Math.max(1, readHashPage() ?? 1)) - 1;
  preload(startIndex);

  const pageFlip = new PageFlip(bookEl, {
    width: pw,
    height: ph,
    size: "stretch",
    minWidth: 280,
    maxWidth: 1000,
    minHeight: 380,
    maxHeight: 1414,
    showCover: true,
    usePortrait: true,
    mobileScrollSupport: true,
    maxShadowOpacity: 0.35,
    flippingTime: reduceMotion ? 1 : 700,
    startPage: startIndex,
    autoSize: true,
    showPageCorners: !reduceMotion,
  });
  pageFlip.loadFromHTML(bookEl.querySelectorAll<HTMLElement>(".book-page"));

  // --- Visible pages (1-based) --------------------------------------------
  function visiblePages(): number[] {
    const i = pageFlip.getCurrentPageIndex();
    if (pageFlip.getOrientation() === "portrait") return [i + 1];
    if (i === 0) return [1]; // front cover sits alone
    if (i >= count - 1) return [count];
    return [i + 1, Math.min(i + 2, count)].filter((v, k, a) => a.indexOf(v) === k);
  }

  function updateUi(announce = true) {
    const pages = visiblePages();
    const first = pages[0];
    const last = pages.at(-1)!;
    pageInput.value = String(first);
    pageLabel.textContent = pages.length > 1 ? `–${last} of ${count}` : `of ${count}`;
    btn("prev").disabled = first <= 1;
    btn("next").disabled = last >= count;
    preload(first - 1);
    if (announce) history.replaceState(history.state, "", `#page/${first}`);
    if (announce) announcer.textContent = pages.length > 1 ? `Pages ${first} and ${last} of ${count}` : `Page ${first} of ${count}`;
    if (zoomIndex > 0) renderZoom();
  }

  // --- Centred covers ----------------------------------------------------------
  // In two-page view the closed front cover (right half) and back cover (left
  // half) are slid to the centre, like a closed book. When a page starts to
  // turn, the book slides back so the spread opens out from the middle.
  const block = bookEl.querySelector<HTMLElement>(".stf__block");
  function coverOffset(open = false) {
    if (open || pageFlip.getOrientation() === "portrait") return 0;
    const i = pageFlip.getCurrentPageIndex();
    const half = pageFlip.getBoundsRect().pageWidth / 2;
    if (i === 0) return -half;
    if (i >= count - 1 && count % 2 === 0) return half;
    return 0;
  }
  function centreCover(open = false) {
    if (block) block.style.transform = `translateX(${coverOffset(open)}px)`;
  }

  pageFlip.on("flip", () => { playTurnSound(); updateUi(); centreCover(); });
  pageFlip.on("changeOrientation", () => { updateUi(false); centreCover(); });
  pageFlip.on("init", () => { updateUi(false); centreCover(); });
  pageFlip.on("update", () => centreCover());
  pageFlip.on("changeState", (e) => {
    // Make sure the page being revealed during a drag has its image.
    if (e.data === "user_fold" || e.data === "flipping") { preload(pageFlip.getCurrentPageIndex()); centreCover(true); }
    if (e.data === "read") centreCover();
  });
  updateUi(false);
  centreCover();
  const slideFrame = requestAnimationFrame(() => block?.classList.add("cover-slide"));

  // --- Navigation ------------------------------------------------------------
  const goNext = () => (reduceMotion || zoomIndex > 0 ? turnTo(nextIndex()) : pageFlip.flipNext());
  const goPrev = () => (reduceMotion || zoomIndex > 0 ? turnTo(prevIndex()) : pageFlip.flipPrev());
  function nextIndex() {
    const i = pageFlip.getCurrentPageIndex();
    return pageFlip.getOrientation() === "portrait" ? i + 1 : i === 0 ? 1 : i + 2;
  }
  function prevIndex() {
    const i = pageFlip.getCurrentPageIndex();
    return pageFlip.getOrientation() === "portrait" ? i - 1 : i <= 2 ? 0 : i - 2;
  }
  function turnTo(index: number) {
    const target = Math.max(0, Math.min(count - 1, index));
    preload(target);
    pageFlip.turnToPage(target);
    playTurnSound();
    updateUi();
    centreCover();
  }
  btn("next").addEventListener("click", goNext, { signal });
  btn("prev").addEventListener("click", goPrev, { signal });
  reader.querySelector<HTMLFormElement>("[data-jump]")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const n = Number(pageInput.value);
    if (Number.isFinite(n)) turnTo(n - 1);
  }, { signal });
  pageInput.addEventListener("change", () => {
    const n = Number(pageInput.value);
    if (Number.isFinite(n) && n >= 1 && n <= count) turnTo(n - 1);
  }, { signal });

  document.addEventListener("keydown", (e) => {
    const t = e.target as HTMLElement;
    if (t.closest("input, textarea, select, [contenteditable]") || document.querySelector("dialog[open]")) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (zoomIndex > 0 && t === zoomView && ["ArrowUp", "ArrowDown"].includes(e.key)) return; // let it scroll
    const map: Record<string, () => void> = {
      ArrowRight: goNext, PageDown: goNext, ArrowLeft: goPrev, PageUp: goPrev,
      Home: () => turnTo(0), End: () => turnTo(count - 1),
      "+": () => setZoom(zoomIndex + 1), "=": () => setZoom(zoomIndex + 1), "-": () => setZoom(zoomIndex - 1),
    };
    if (map[e.key]) { e.preventDefault(); map[e.key](); }
  }, { signal });

  // --- Zoom: a scrollable high-resolution view of the visible pages. --------
  function renderZoom() {
    const level = ZOOM_LEVELS[zoomIndex];
    const rect = pageFlip.getBoundsRect();
    const width = Math.round(rect.pageWidth * level);
    const nodes = visiblePages().map((n) => {
      const img = document.createElement("img");
      img.src = imgs[n - 1].dataset.srcLarge!;
      img.alt = imgs[n - 1].alt;
      img.width = width;
      img.height = Math.round((width * ph) / pw);
      img.draggable = false;
      return img;
    });
    const inner = document.createElement("div");
    inner.className = "zoom-pages";
    inner.replaceChildren(...nodes);
    zoomView.replaceChildren(inner);
  }
  function setZoom(next: number) {
    const prev = zoomIndex;
    zoomIndex = Math.max(0, Math.min(ZOOM_LEVELS.length - 1, next));
    if (zoomIndex === prev) return;
    const zoomed = zoomIndex > 0;
    zoomLabel.textContent = `${Math.round(ZOOM_LEVELS[zoomIndex] * 100)}%`;
    btn("zoom-out").disabled = !zoomed;
    btn("zoom-in").disabled = zoomIndex === ZOOM_LEVELS.length - 1;
    reader.classList.toggle("is-zoomed", zoomed);
    zoomView.hidden = !zoomed;
    if (zoomed) {
      const keepCentre = prev > 0 ? relativeCentre() : { x: 0.5, y: 0 };
      renderZoom();
      requestAnimationFrame(() => restoreCentre(keepCentre));
    } else {
      zoomView.replaceChildren();
    }
    announcer.textContent = `Zoom ${Math.round(ZOOM_LEVELS[zoomIndex] * 100)}%`;
  }
  const relativeCentre = () => ({
    x: (zoomView.scrollLeft + zoomView.clientWidth / 2) / Math.max(1, zoomView.scrollWidth),
    y: (zoomView.scrollTop + zoomView.clientHeight / 2) / Math.max(1, zoomView.scrollHeight),
  });
  const restoreCentre = (c: { x: number; y: number }) => {
    zoomView.scrollLeft = c.x * zoomView.scrollWidth - zoomView.clientWidth / 2;
    zoomView.scrollTop = c.y * zoomView.scrollHeight - zoomView.clientHeight / 2;
  };
  btn("zoom-in").addEventListener("click", () => setZoom(zoomIndex + 1), { signal });
  btn("zoom-out").addEventListener("click", () => setZoom(zoomIndex - 1), { signal });
  bookEl.addEventListener("dblclick", () => setZoom(1), { signal });

  // Drag to pan when zoomed (mouse); touch uses native scrolling.
  let drag: { x: number; y: number; l: number; t: number } | null = null;
  zoomView.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    drag = { x: e.clientX, y: e.clientY, l: zoomView.scrollLeft, t: zoomView.scrollTop };
    zoomView.setPointerCapture(e.pointerId);
    zoomView.classList.add("dragging");
  }, { signal });
  zoomView.addEventListener("pointermove", (e) => {
    if (!drag) return;
    zoomView.scrollLeft = drag.l - (e.clientX - drag.x);
    zoomView.scrollTop = drag.t - (e.clientY - drag.y);
  }, { signal });
  const endDrag = () => { drag = null; zoomView.classList.remove("dragging"); };
  zoomView.addEventListener("pointerup", endDrag, { signal });
  zoomView.addEventListener("pointercancel", endDrag, { signal });

  // --- Fullscreen --------------------------------------------------------------
  type WebkitDocument = Document & { webkitFullscreenEnabled?: boolean; webkitFullscreenElement?: Element | null };
  const doc = document as WebkitDocument;
  const fsBtn = btn("fullscreen");
  const canFullscreen = document.fullscreenEnabled || doc.webkitFullscreenEnabled;
  fsBtn.hidden = !canFullscreen; // e.g. iPhone Safari: "open in new window" remains
  fsBtn.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (reader.requestFullscreen) await reader.requestFullscreen();
      else (reader as HTMLElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen?.();
    } catch { /* user agent refused; nothing to do */ }
  }, { signal });
  const onFsChange = () => {
    const on = document.fullscreenElement === reader || doc.webkitFullscreenElement === reader;
    fsBtn.setAttribute("aria-pressed", String(on));
    fsBtn.setAttribute("aria-label", on ? "Exit full screen" : "Full screen");
    fsBtn.innerHTML = on ? fsBtn.dataset.iconOn! : fsBtn.dataset.iconOff!;
    requestAnimationFrame(() => { pageFlip.update(); if (zoomIndex > 0) renderZoom(); });
  };
  document.addEventListener("fullscreenchange", onFsChange, { signal });
  document.addEventListener("webkitfullscreenchange", onFsChange, { signal });

  // --- Page-turn sound (synthesised; no audio file, off by default) ---------
  const soundBtn = btn("sound");
  soundBtn.addEventListener("click", () => {
    soundOn = !soundOn;
    soundBtn.setAttribute("aria-pressed", String(soundOn));
    soundBtn.setAttribute("aria-label", soundOn ? "Page-turn sound on" : "Page-turn sound off");
    soundBtn.innerHTML = soundOn ? soundBtn.dataset.iconOn! : soundBtn.dataset.iconOff!;
    if (soundOn) audio ??= new AudioContext();
  }, { signal });
  soundBtn.setAttribute("aria-label", "Page-turn sound off");
  function playTurnSound() {
    if (!soundOn || !audio) return;
    const length = 0.32;
    const buffer = audio.createBuffer(1, audio.sampleRate * length, audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      data[i] = (Math.random() * 2 - 1) * Math.pow(Math.sin(Math.PI * t), 2) * (1 - t * 0.6);
    }
    const src = audio.createBufferSource();
    src.buffer = buffer;
    const filter = audio.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2400;
    filter.Q.value = 0.7;
    const gain = audio.createGain();
    gain.gain.value = 0.18;
    src.connect(filter).connect(gain).connect(audio.destination);
    src.start();
  }

  // --- Deep links: #page/12 (same form as Heyzine) --------------------------
  window.addEventListener("hashchange", () => {
    const n = readHashPage();
    if (n && !visiblePages().includes(n)) turnTo(n - 1);
  }, { signal });

  // Swipe on touch already handled by page-flip; keep layout in sync on rotate.
  const resize = new ResizeObserver(() => { if (zoomIndex > 0) renderZoom(); });
  resize.observe(stage);

  return () => {
    cleanup.abort();
    resize.disconnect();
    cancelAnimationFrame(slideFrame);
    if (document.fullscreenElement === reader) document.exitFullscreen().catch(() => {});
    void audio?.close();
    pageFlip.destroy(); // also removes bookEl
    // page-flip's requestAnimationFrame loop never stops on its own; make its
    // remaining frames no-ops so a destroyed book costs nothing.
    (pageFlip.getRender() as { render: () => void }).render = () => {};
    zoomView.replaceChildren();
    zoomView.hidden = true;
    reader.classList.remove("is-zoomed");
  };
}

function readHashPage(): number | null {
  const m = location.hash.match(/^#page\/(\d+)/);
  return m ? Number(m[1]) : null;
}
