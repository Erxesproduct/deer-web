"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Photo = { src: string; w: number; h: number; thumb: { src: string } };

/**
 * Swipeable 4:5 photo row (native scroll-snap on phones) with dots, thumbnails on larger screens. Choosing a colour
 * (product-buy sends `dr:colour`) shows that colour's own photo first.
 */
export function Gallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [at, setAt] = useState(0);
  const [colour, setColour] = useState<Photo | null>(null);
  const row = useRef<HTMLDivElement>(null);
  const list = colour && !photos.some((p) => p.src === colour.src) ? [colour, ...photos] : photos;
  const go = (i: number) => {
    const el = row.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };
  useEffect(() => {
    const on = (e: Event) => {
      const p = (e as CustomEvent<Photo>).detail;
      setColour(p);
      const i = photos.findIndex((x) => x.src === p.src);
      requestAnimationFrame(() => go(i >= 0 ? i : 0));
    };
    window.addEventListener("dr:colour", on);
    return () => window.removeEventListener("dr:colour", on);
  }, [photos]);
  if (!list.length) return <div className="aspect-[4/5] rounded-[24px] bg-paper" />;
  return (
    <div className={list.length > 1 ? "md:grid md:grid-cols-[76px_1fr] md:gap-4" : ""}>
      <div className="order-2">
        <div
          ref={row}
          onScroll={(e) => {
            const el = e.currentTarget;
            setAt(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
          }}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-[24px] bg-paper"
        >
          {list.map((p, i) => (
            <div key={p.src} className="relative aspect-[4/5] w-full shrink-0 snap-center">
              <Image src={p.src} alt={i === 0 ? title : `${title}: зураг ${i + 1}`} fill priority={i === 0} sizes="(min-width: 1024px) 560px, 100vw" className={`object-cover ${p === colour ? "pop-in" : ""}`} />
            </div>
          ))}
        </div>
        {list.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-hidden>
            {list.map((p, i) => (
              <span key={p.src} className={`h-1.5 rounded-full transition-all ${i === at ? "w-6 bg-wine" : "w-1.5 bg-line"}`} />
            ))}
          </div>
        )}
      </div>
      {list.length > 1 && (
        <div className="order-1 hidden flex-col gap-2.5 md:flex">
          {list.map((p, i) => (
            <button key={p.src} type="button" onClick={() => go(i)} aria-label={`Зураг ${i + 1}`} aria-current={i === at} className={`relative aspect-[4/5] overflow-hidden rounded-xl transition ${i === at ? "ring-2 ring-wine" : "opacity-70 ring-1 ring-line hover:opacity-100"}`}>
              <Image src={p.thumb.src} alt="" fill sizes="76px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
