import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Snowflake } from "@/components/brand";
import { Gallery } from "@/components/gallery";
import { ClockIcon, QrIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { ProductBuy } from "@/components/product-buy";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { business, faq, ZONES } from "@/content/business";
import { available, byPopularity, fromPrice, getById, getProduct, getType, GENDER, onSale, pairs, products, sku, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site-url";

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const text = p.lines.find((l) => l.length > 20);
  const description = (text ?? `${p.title}: ${getType(p.type)?.name}, DEER Mongolia`).slice(0, 160);
  return { title: p.title, description, alternates: { canonical: `/p/${p.slug}` }, openGraph: { title: p.title, description, images: p.images[0] ? [{ url: p.images[0].src }] : undefined } };
}

/** The shop's text: «Материал:», «Size …» and short lines become a list. */
function Story({ lines }: { lines: string[] }) {
  return (
    <ul className="space-y-2">
      {lines.map((x) => {
        const m = x.match(/^(материал|орц|хэмжээ|size|өнгө|анхаарах|угаах|арчилгаа)\s*[:-]\s*(.+)$/i);
        return (
          <li key={x} className="flex gap-3 text-[15px] text-ink-2">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
            <span>{m ? <><b className="font-semibold text-ink">{m[1].replace(/^./, (c) => c.toUpperCase())}:</b> {m[2]}</> : x}</span>
          </li>
        );
      })}
    </ul>
  );
}

function related(p: Product) {
  const pool = products.filter((x) => x.id !== p.id && available(x));
  const same = pool.filter((x) => x.type === p.type && x.sub === p.sub && x.gender.some((g) => p.gender.includes(g) || !p.gender.length));
  const type = pool.filter((x) => !same.includes(x) && x.type === p.type);
  const season = pool.filter((x) => !same.includes(x) && !type.includes(x) && ((p.ny && x.ny) || (p.lunar && x.lunar)));
  return [...same.sort(byPopularity), ...type.sort(byPopularity), ...season.sort(byPopularity)].slice(0, 12);
}

const CARE = faq.find((f) => /сүлжмэл/i.test(f.q));

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const rel = related(p);
  const type = getType(p.type);
  const partner = p.pair ? pairs.find((x) => x.name === p.pair)?.ids.map(getById).find((x) => x && x.id !== p.id && x.pair === p.pair && p.pair !== "Хосын сонголт") : undefined;
  const sale = onSale(p);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    brand: { "@type": "Brand", name: "DEER" },
    sku: sku(String(p.id)),
    image: p.images.slice(0, 3).map((i) => absoluteUrl(i.src)),
    description: p.lines.slice(0, 3).join(" "),
    offers: {
      "@type": "Offer",
      priceCurrency: "MNT",
      price: fromPrice(p),
      availability: available(p) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/p/${p.slug}`),
    },
  };
  const counted = p.variants.find((v) => v.stock != null && v.stock > 0)?.stock ?? null;

  return (
    <div className="wrap pt-5 pb-28 md:pt-8 md:pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Зам" className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-ink-3">
        <Link href="/shop" className="hover:text-ink">
          Дэлгүүр
        </Link>
        <span>/</span>
        <Link href={`/shop?t=${p.type}`} className="hover:text-ink">
          {type?.name}
        </Link>
        {p.sub && (
          <>
            <span>/</span>
            <Link href={`/shop?t=${p.type}&s=${encodeURIComponent(p.sub)}`} className="hover:text-ink">
              {p.sub}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div className="lg:sticky lg:top-[170px] lg:self-start">
          <Gallery photos={p.images} title={p.title} />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            {p.ny && (
              <Link href="/shop?ny=1" className="tag bg-wine text-snow">
                <Snowflake className="h-3 w-3 text-gold" /> Шинэ жилийн цуглуулга
              </Link>
            )}
            {p.lunar && (
              <Link href="/shop?t=national" className="tag bg-gold-l text-gold-d">
                Цагаан сар
              </Link>
            )}
            {p.knit && (
              <Link href="/shop?knit=1" className="tag bg-pine-l text-pine">
                Сүлжмэл
              </Link>
            )}
            {p.cashmere && <span className="tag bg-paper text-ink">100% ноолуур</span>}
            {p.gender.map((g) => (
              <Link key={g} href={`/shop?w=${g}`} className="tag bg-snow text-ink-2 ring-1 ring-line">
                {GENDER[g]}
              </Link>
            ))}
            {!available(p) && <span className="tag bg-paper text-ink-2">Дууссан</span>}
            {available(p) && counted != null && counted <= 2 && <span className="tag bg-berry-l text-berry">Цөөхөн үлдсэн</span>}
          </div>
          <h1 className="mt-3 text-[36px] text-ink md:text-[50px]">{p.title}</h1>

          <ProductBuy slug={p.slug} title={p.title} options={p.options} variants={p.variants} colours={p.colours} />

          {sale && <p className="mt-6 rounded-[18px] bg-berry-l px-4 py-3 text-[14px] font-semibold text-berry">{business.rules.terms}</p>}

          {partner && (
            <Link href={`/p/${partner.slug}`} className="group mt-6 flex items-center gap-4 rounded-[20px] bg-gold-l p-3 pr-5 ring-1 ring-gold/40 transition hover:ring-gold">
              <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-paper">{partner.images[0] && <Image src={partner.images[0].thumb.src} alt="" fill sizes="64px" className="object-cover" />}</span>
              <span className="min-w-0">
                <span className="text-[12.5px] font-bold text-gold-d">{p.pair}: хосоороо өмсөөрэй</span>
                <b className="block truncate text-[15.5px] font-semibold">{partner.title}</b>
                <span className="text-[14px] font-bold">{formatPrice(fromPrice(partner))}</span>
              </span>
              <span className="ml-auto text-[20px] text-gold-d transition group-hover:translate-x-1">→</span>
            </Link>
          )}

          {/* delivery: the owner asked not to forget it, so it is right here on every product */}
          <section id="delivery" className="mt-8 overflow-hidden rounded-[22px] bg-snow ring-1 ring-line" aria-labelledby="dl">
            <h2 id="dl" className="flex items-center gap-2.5 border-b border-line px-5 py-3.5 font-sans text-[15px] font-bold tracking-normal">
              <TruckIcon size={19} className="text-berry" /> Хүргэлт
            </h2>
            <ul className="divide-y divide-line">
              {ZONES.map((z) => (
                <li key={z.id} className="flex items-start justify-between gap-4 px-5 py-3.5 text-[14px]">
                  <span>
                    <b className="block text-[15px] font-semibold">{z.name}</b>
                    <span className="text-ink-3">{z.area}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <b className="block font-extrabold">{formatPrice(z.price)}</b>
                    <span className="text-[12.5px] text-pine">{formatPrice(z.freeOver)}-өөс дээш үнэгүй</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-3">
            {[
              { Icon: ClockIcon, t: "Маргааш нь", d: "8–24 цагийн дотор" },
              { Icon: QrIcon, t: "QPay, 100%", d: "И-баримттай" },
              { Icon: ShieldIcon, t: "24 цагт солих", d: "Үндсэн үнийн бараа" },
            ].map(({ Icon, t, d }) => (
              <li key={t} className="flex gap-3 rounded-[18px] bg-paper/70 p-3.5">
                <Icon size={19} className="mt-0.5 shrink-0 text-wine" />
                <span className="text-[13px] text-ink-2">
                  <b className="block text-[14px] font-semibold text-ink">{t}</b>
                  {d}
                </span>
              </li>
            ))}
          </ul>

          {p.lines.length > 0 && (
            <section className="mt-8 border-t border-line pt-7" aria-label="Тайлбар">
              <Story lines={p.lines} />
            </section>
          )}

          {p.knit && CARE && (
            <details className="group mt-6 rounded-[20px] bg-pine-l p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-bold text-pine">
                {CARE.q.replace(/\s*\?\s*$/, "?")}
                <span className="text-[20px] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[14px] whitespace-pre-line text-ink-2">{CARE.a}</p>
            </details>
          )}
          <p className="mt-5 text-[13px] text-ink-3">Код: {sku(String(p.id))}</p>
        </div>
      </div>

      {rel.length > 0 && (
        <section className="mt-20" aria-labelledby="rel">
          <h2 id="rel" className="text-[32px] text-ink md:text-[42px]">
            Үүнтэй хамт
          </h2>
          <Scroller label="Төстэй бараа" className="snap-row no-scrollbar -mx-4 mt-6 px-4 pb-3 md:mx-0 md:px-0">
            {rel.map((x) => (
              <div key={x.id} className="w-[46vw] max-w-[260px] sm:w-[230px]">
                <ProductCard p={x} />
              </div>
            ))}
          </Scroller>
        </section>
      )}
    </div>
  );
}
