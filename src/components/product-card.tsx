import Image from "next/image";
import Link from "next/link";
import { available, cover, discount, fromPrice, getType, second, singleVariant, sizes, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { Snowflake } from "./brand";
import { CardActions } from "./card-actions";

export function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  const img = cover(p);
  const img2 = second(p);
  const out = !available(p);
  const off = discount(p);
  const price = fromPrice(p);
  const was = p.variants.find((v) => v.price === price)?.compareAt ?? null;
  const many = new Set(p.variants.map((v) => v.price)).size > 1;
  const sw = p.colours.filter((c) => c.hex).slice(0, 5);
  const sz = sizes(p);
  return (
    <article className="group relative flex flex-col">
      <Link href={`/p/${p.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-[18px] bg-paper">
        {img && (
          <Image
            src={img.src}
            alt={p.title}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 300px, (min-width: 640px) 33vw, 50vw"
            className={`object-cover transition duration-700 group-hover:scale-[1.04] ${out ? "opacity-55 grayscale-[.6]" : ""} ${img2 ? "group-hover:opacity-0" : ""}`}
          />
        )}
        {img2 && <Image src={img2.src} alt="" fill sizes="(min-width: 1280px) 300px, 50vw" className="object-cover opacity-0 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100" />}
        <span className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {out ? (
            <span className="tag bg-snow text-ink-2">Дууссан</span>
          ) : (
            <>
              {off > 0 && <span className="tag bg-berry text-snow">−{off}%</span>}
              {p.ny && (
                <span className="tag bg-wine text-snow">
                  <Snowflake className="h-3 w-3 text-gold" /> Шинэ жил
                </span>
              )}
              {!p.ny && p.isNew && <span className="tag bg-snow text-ink">Шинэ</span>}
              {p.best >= 0 && p.best < 12 && <span className="tag bg-gold-l text-gold-d">★ Эрэлттэй</span>}
            </>
          )}
        </span>
        {sz.length > 0 && !out && (
          <span className="absolute inset-x-2 bottom-2 hidden translate-y-2 flex-wrap justify-center gap-1 rounded-xl bg-snow/90 px-2 py-1.5 text-[11.5px] font-bold text-ink opacity-0 backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100 md:flex">
            {sz.slice(0, 6).map((s) => (
              <span key={s} className="px-1">
                {s}
              </span>
            ))}
          </span>
        )}
      </Link>
      <CardActions slug={p.slug} variantId={out ? null : singleVariant(p)} title={p.title} />
      <div className="mt-3 px-0.5">
        <p className="flex items-center justify-between gap-2 text-[12px] font-semibold text-ink-3">
          <span className="truncate">{p.sub ?? getType(p.type)?.name}</span>
          {sw.length > 1 && (
            <span className="flex shrink-0 -space-x-1" aria-label={`${p.colours.length} өнгө`}>
              {sw.map((c) => (
                <span key={c.name} title={c.name} className="h-3.5 w-3.5 rounded-full ring-2 ring-ivory" style={{ background: c.hex ?? undefined }} />
              ))}
            </span>
          )}
        </p>
        <Link href={`/p/${p.slug}`} className="mt-1 line-clamp-2 text-[15px] leading-snug font-semibold hover:underline hover:underline-offset-2">
          {p.title}
        </Link>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className={`text-[16px] font-extrabold tabular-nums ${off ? "text-berry" : "text-ink"}`}>
            {formatPrice(price)}
            {many && <span className="ml-1 text-[12px] font-medium text-ink-3">-с</span>}
          </span>
          {was && <s className="text-[13px] text-ink-3 tabular-nums">{formatPrice(was)}</s>}
        </p>
      </div>
    </article>
  );
}
