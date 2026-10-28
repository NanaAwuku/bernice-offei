import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-lavender py-3 text-center text-plum-muted">
      <p className="text-[10px] tracking-[0.35em] uppercase sm:text-xs">Forever in our hearts</p>
      <a
        href="https://changoapp.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] tracking-wide opacity-80 transition hover:opacity-100 sm:text-[11px]"
      >
        Powered by
        <Image src="/images/chango-logo.svg" alt="Chango" width={596} height={148} className="h-3.5 w-auto sm:h-4" />
      </a>
    </footer>
  );
}
