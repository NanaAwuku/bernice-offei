import Image from "next/image";
import { site } from "@/lib/site";

// Fills its (relatively positioned) parent. Remote URLs skip the image optimizer so
// they work without listing every host in next.config.ts.
export default function Portrait({ preload = false }: { preload?: boolean }) {
  return (
    <Image
      src={site.portrait}
      alt={`Portrait of ${site.name}`}
      fill
      sizes="320px"
      preload={preload}
      unoptimized={/^https?:\/\//.test(site.portrait)}
      className="object-cover"
    />
  );
}
