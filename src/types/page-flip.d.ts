// page-flip ships no type declarations; only the parts the reader uses.
declare module "page-flip/dist/js/page-flip.module.js" {
  export class PageFlip {
    constructor(element: HTMLElement, settings: Record<string, unknown>);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    on(event: string, callback: (e: { data: unknown }) => void): this;
    getCurrentPageIndex(): number;
    getOrientation(): "portrait" | "landscape";
    getBoundsRect(): { pageWidth: number; width: number; height: number };
    getRender(): object;
    turnToPage(index: number): void;
    flipNext(): void;
    flipPrev(): void;
    update(): void;
    destroy(): void;
  }
}
