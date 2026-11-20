import Image from "next/image";
import Link from "next/link";
import { DeerDraw, KnitBand, Snowflake, Sparkle } from "@/components/brand";
import { Countdown } from "@/components/countdown";
import { ArrowIcon, ClockIcon, PinIcon, TruckIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Scroller } from "@/components/scroller";
import { business, cheapestZone, ZONES } from "@/content/business";
import { available, bestsellers, fromPrice, getById, lunar, newYear, pairs, popular, products, shop, types, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

function Shelf({ id, kicker, title, line, href, items, more = "Бүгдийг үзэх" }: { id: string; kicker: string; title: React.ReactNode; line?: string; href: string; items: Product[]; more?: string }) {
  if (!items.length) return null;
  return (
    <Reveal as="section" className="wrap mt-20 md:mt-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">{kicker}</p>
          <h2 id={id} className="mt-2 text-[34px] text-ink md:text-[50px]">
            {title}
          </h2>
          {line && <p className="mt-2 max-w-xl text-ink-2">{line}</p>}
        </div>
        <Link href={href} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[14.5px] font-bold ring-1 ring-line hover:ring-ink">
          {more} <ArrowIcon size={16} />
        </Link>
      </div>
      <Scroller label={typeof title === "string" ? title : kicker} className="snap-row no-scrollbar -mx-4 mt-7 px-4 pt-1 pb-3 md:mx-0 md:px-0">
        {items.map((p) => (
          <div key={p.id} className="w-[46vw] max-w-[270px] sm:w-[240px]">
            <ProductCard p={p} />
          </div>
        ))}
      </Scroller>
    </Reveal>
  );
}

/** A New Year piece hanging from the garland: a tilted polaroid with a gift tag price that sways. */
function Polaroid({ p, className, tilt, delay, priority = false }: { p: Product; className: string; tilt: number; delay: string; priority?: boolean }) {
  return (
    <Link href={`/p/${p.slug}`} className={`sway group absolute block ${className}`} style={{ ["--r" as string]: `${Math.abs(tilt) / 2 + 1}deg`, animationDelay: delay }} aria-label={`${p.title}, ${formatPrice(fromPrice(p))}`}>
      <span className="mx-auto block h-8 w-px bg-gold/70" aria-hidden />
      <span className="block rounded-[6px] bg-snow p-2 pb-9 shadow-[0_24px_50px_-18px_rgb(0_0_0/0.65)] transition group-hover:scale-[1.03]" style={{ rotate: `${tilt}deg` }}>
        <span className="relative block aspect-[4/5] overflow-hidden rounded-[3px] bg-paper">
          <Image src={p.images[0].thumb.src} alt="" fill priority={priority} sizes="(min-width: 1024px) 200px, 34vw" className="object-cover" />
        </span>
        <span className="absolute inset-x-2 bottom-2 truncate text-center text-[11.5px] font-semibold text-ink-2">{p.title}</span>
      </span>
      <span className="gift-tag absolute -right-4 bottom-4 block bg-berry px-3 pt-6 pb-2 text-center text-snow shadow-lg" style={{ rotate: `${-tilt * 2 + 6}deg` }}>
        <b className="block text-[13px] leading-none font-extrabold whitespace-nowrap">{formatPrice(fromPrice(p))}</b>
      </span>
    </Link>
  );
}

export default function Home() {
  const withPhoto = (p: Product) => p.images.length > 0;
  // hero: this winter's New Year pieces that read well as photos (the Christmas hat, the Winter Dream sweater…)
  const PICKS = [757077, 757732, 986470, 751258, 757706, 1000287];
  const hero = [...PICKS.map(getById).filter((p): p is Product => !!p && available(p) && withPhoto(p)), ...newYear.filter(withPhoto)].filter((p, i, a) => a.indexOf(p) === i).slice(0, 4);
  const gifts = products.filter((p) => p.type === "gift").sort((a, b) => fromPrice(a) - fromPrice(b));
  const ny = newYear.filter((p) => p.type !== "gift" && withPhoto(p)).slice(0, 14);
  const named = pairs.filter((x) => /хос$/.test(x.name)).map((x) => ({ name: x.name, items: x.ids.map(getById).filter((p): p is Product => !!p && withPhoto(p)).slice(0, 2) })).filter((x) => x.items.length === 2);
  const tiles = types.filter((t) => t.id !== "gift").map((t) => ({ ...t, p: popular.find((p) => p.type === t.id && withPhoto(p) && available(p)) })).filter((t) => t.p);
  const best = bestsellers.filter(withPhoto).slice(0, 12);
  const who = [
    { k: "Ээж, эгч, найз бүсгүйдээ", d: "Ноолуур малгай, ороолт, сүлжмэл кардиган", href: "/shop?ny=1&w=w", p: newYear.find((p) => p.gender.includes("w") && p.type === "acc" && withPhoto(p)), tone: "bg-berry" },
    { k: "Аав, ах, найз залуудаа", d: "Ноолуур малгай, сүлжмэл цамц, сөдөн куртка", href: "/shop?ny=1&w=m", p: newYear.find((p) => p.gender.includes("m") && withPhoto(p)), tone: "bg-ink" },
    { k: "Хосоороо", d: "Дэлгүүрийн хосын сонголт", href: "#pairs", p: named[0]?.items[0], tone: "bg-pine" },
    { k: "Сонгож чадахгүй байвал", d: `Бэлгийн карт ${formatPrice(fromPrice(gifts[0] ?? products[0]))}-өөс`, href: "/shop?t=gift", p: undefined, tone: "bg-gold" },
  ];

  return (
    <>
      {/* Hero «Winter Dream»: the shop's own New Year collection, on the banner's wine night */}
      <section className="night relative overflow-hidden text-snow" aria-labelledby="hero">
        <div className="snow absolute inset-0" aria-hidden />
        <Sparkle className="twinkle absolute top-[12%] left-[44%] h-4 w-4 text-gold" />
        <Sparkle className="twinkle absolute top-[70%] left-[6%] h-3 w-3 text-snow [animation-delay:1.1s]" />
        <div className="wrap relative grid gap-4 pt-10 pb-14 md:pt-16 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:pb-20">
          <div className="relative z-10">
            <p className="kicker text-gold">Шинэ жилийн цуглуулга</p>
            <h1 id="hero" className="mt-4 text-[54px] leading-[0.95] tracking-[0.04em] sm:text-[76px] lg:text-[96px]">
              <span className="gold-text shimmer block">WINTER</span>
              <span className="block">DREAM</span>
            </h1>
            <p className="script mt-1 text-[34px] text-gold md:text-[42px]">New year collection</p>
            <p className="mt-5 max-w-md text-[16.5px] text-snow/85">Ноолуур малгай, ороолт, буга хээтэй сүлжмэл, бэлгийн карт: хайртай хүндээ дулаан бэлэг. Өөрсдийн үйлдвэрт урласан.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop?ny=1" className="btn btn-gold">
                Цуглуулга үзэх <ArrowIcon size={17} />
              </Link>
              <Link href="/shop?t=gift" className="btn btn-ghost">
                Бэлгийн карт
              </Link>
            </div>
            <Countdown className="mt-9" />
            <Link href="/info#delivery" className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-snow/10 py-2 pr-4 pl-2 text-[14px] font-semibold ring-1 ring-snow/20 hover:bg-snow/15">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-wine-d">
                <TruckIcon size={16} />
              </span>
              Маргааш нь хүргэнэ · {formatPrice(cheapestZone.price)}-өөс · {formatPrice(cheapestZone.freeOver)}-өөс дээш үнэгүй
            </Link>
          </div>

          {/* the garland: the deer draws itself in gold, New Year pieces hang from a string and sway */}
          <div className="relative mx-auto aspect-[1/1] w-full max-w-[600px] lg:aspect-auto lg:min-h-[600px]">
            <DeerDraw className="absolute top-[6%] left-1/2 w-[86%] -translate-x-1/2 text-gold/80" />
            <svg className="absolute inset-x-0 top-[3%] h-[60px] w-full text-gold/70" viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden>
              <path d="M0 6 Q150 58 300 30 T600 8" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            {[...Array(9)].map((_, i) => (
              <span key={i} aria-hidden className="twinkle absolute h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_3px_rgb(232_196_120/0.7)]" style={{ left: `${6 + i * 11}%`, top: `${[4, 9, 11, 10, 8, 6, 5, 3, 2][i] + 2}%`, animationDelay: `${i * 0.35}s` }} />
            ))}
            {hero[0] && <Polaroid p={hero[0]} priority className="top-[5%] left-[3%] w-[34%]" tilt={-6} delay="0s" />}
            {hero[1] && <Polaroid p={hero[1]} priority className="top-[9%] left-[36%] w-[30%]" tilt={4} delay="-1.4s" />}
            {hero[2] && <Polaroid p={hero[2]} className="top-[5%] right-[2%] w-[30%]" tilt={-3} delay="-2.6s" />}
            {hero[3] && <Polaroid p={hero[3]} className="top-[50%] left-[22%] hidden w-[28%] sm:block" tilt={7} delay="-0.8s" />}
            <Link href="/shop?t=gift" className="float absolute right-[4%] bottom-[6%] w-[42%] max-w-[230px] rounded-[16px] bg-gradient-to-br from-wine-2 to-wine-d p-4 shadow-[0_20px_40px_-14px_rgb(0_0_0/0.7)] ring-1 ring-gold/50" style={{ ["--t" as string]: "-4deg" }}>
              <span className="flex items-center justify-between">
                <span aria-hidden className="deer h-8 w-8 text-gold" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-gold">GIFT CARD</span>
              </span>
              <span className="display mt-4 block text-[24px] leading-none">Бэлгийн карт</span>
              <span className="mt-1 block text-[12.5px] text-snow/70">{gifts.map((g) => formatPrice(fromPrice(g)).replace(",000₮", "k")).join(" · ")}</span>
            </Link>
          </div>
        </div>
        <KnitBand />
      </section>

      {/* Delivery, right after the hero: the owner asked not to forget it */}
      <section id="delivery" className="wrap mt-10 scroll-mt-40 md:mt-14" aria-labelledby="dl-h">
        <Reveal className="grid gap-3 md:grid-cols-[1.1fr_1fr_1fr]">
          <div className="pine-night relative overflow-hidden rounded-[24px] p-6 text-snow">
            <Snowflake className="absolute -right-6 -bottom-6 h-32 w-32 text-snow/10" />
            <p className="kicker text-gold">Хүргэлт</p>
            <h2 id="dl-h" className="mt-3 text-[30px] leading-tight">
              Захиалсны дараа өдөр нь гэрт тань
            </h2>
            <p className="mt-2 flex items-center gap-2 text-[14.5px] text-snow/80">
              <ClockIcon size={17} className="text-gold" /> 8–24 цагийн дотор, хүргэлтийн компаниар
            </p>
          </div>
          {ZONES.map((z, i) => (
            <div key={z.id} className="relative overflow-hidden rounded-[24px] bg-snow p-6 ring-1 ring-line">
              <span className={`absolute top-0 right-0 h-1.5 w-full ${i ? "bg-gold" : "bg-berry"}`} />
              <p className="flex items-center justify-between gap-3">
                <b className="text-[17px] font-bold">{z.name}</b>
                <span className="display text-[34px] leading-none text-wine">{formatPrice(z.price)}</span>
              </p>
              <p className="mt-2 text-[13.5px] text-ink-3">{z.area}</p>
              <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-pine-l px-3 py-1 text-[13px] font-bold text-pine">
                <Sparkle className="h-3 w-3" /> {formatPrice(z.freeOver)}-өөс дээш үнэгүй
              </p>
            </div>
          ))}
        </Reveal>
        <p className="mt-3 text-[13.5px] text-ink-3">
          {business.rules.outside}{" "}
          <Link href="/info#delivery" className="font-semibold text-wine underline underline-offset-4">
            Дэлгэрэнгүй
          </Link>
        </p>
      </section>

      <Shelf
        id="ny"
        kicker="Winter Dream"
        title={
          <>
            Шинэ жилд <span className="text-berry">дулаан</span> бэлэг
          </>
        }
        line="Энэ өвлийн шинэ ноолуур малгай, ороолт, буга хээтэй сүлжмэл: хамгийн шинэ нь эхэндээ"
        href="/shop?ny=1"
        items={ny}
        more="Шинэ жилийн бүх бараа"
      />

      {/* Who is it for: a gift guide in four doors */}
      <section className="wrap mt-20 md:mt-28" aria-labelledby="who">
        <Reveal>
          <p className="kicker">Бэлгийн зөвлөгөө</p>
          <h2 id="who" className="mt-2 text-[34px] text-ink md:text-[50px]">
            Хэнд бэлэглэх вэ?
          </h2>
        </Reveal>
        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {who.map((w, i) => (
            <Reveal key={w.k} delay={i * 90}>
              <Link href={w.href} className={`group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[22px] ${w.tone} p-4 text-snow md:p-5`}>
                {w.p ? (
                  <Image src={w.p.images[0].thumb.src} alt="" fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-95" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center">
                    <span aria-hidden className="deer h-2/3 w-2/3 text-wine/25" />
                  </span>
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <span className="relative">
                  <b className="display block text-[22px] leading-tight md:text-[27px]">{w.k}</b>
                  <span className="mt-1 block text-[13px] text-snow/80">{w.d}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-bold text-gold transition group-hover:gap-2">
                    Үзэх <ArrowIcon size={14} />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gift cards, drawn as cards */}
      {gifts.length > 0 && (
        <Reveal as="section" className="wrap mt-20 md:mt-28">
          <div className="night relative overflow-hidden rounded-[30px] p-6 text-snow md:p-12">
            <div className="snow absolute inset-0 opacity-60" aria-hidden />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-center">
              <div>
                <p className="kicker text-gold">Бэлгийн карт</p>
                <h2 id="gc" className="mt-3 text-[34px] md:text-[48px]">
                  Сонголтыг нь <span className="gold-text">бэлэглээрэй</span>
                </h2>
                <p className="mt-3 max-w-md text-snow/80">Хэмжээ, өнгөө тааруулж чадахгүй бол хүссэн бараагаа өөрөө сонгох боломж олго.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {gifts.map((g, i) => (
                  <Link key={g.id} href={`/p/${g.slug}`} className="group relative aspect-[1.6/1] overflow-hidden rounded-[16px] bg-gradient-to-br from-wine-2 via-wine to-wine-d p-4 ring-1 ring-gold/40 transition hover:-translate-y-1 hover:ring-gold md:p-5" style={{ rotate: `${[-2, 1.5, 1, -1.5][i % 4]}deg` }}>
                    <span aria-hidden className="deer absolute -right-4 -bottom-4 h-28 w-28 text-gold/15 transition group-hover:text-gold/30" />
                    <span className="text-[10px] font-bold tracking-[0.25em] text-gold">DEER · GIFT CARD</span>
                    <span className="display absolute bottom-3 left-4 text-[28px] leading-none md:bottom-4 md:left-5 md:text-[38px]">{formatPrice(fromPrice(g))}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* Lunar New Year: the shop's «Gua Sar» campaign + national wear */}
      <section className="mt-20 md:mt-28" aria-labelledby="lunar">
        <div className="wrap">
          <Reveal className="grid overflow-hidden rounded-[30px] bg-ink text-snow lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative aspect-square lg:aspect-auto">
              <Image src="/brand/gua-sar.webp" alt="DEER Mongolia «Gua Sar» Lunar New Year collection" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            </div>
            <div className="relative p-6 md:p-12">
              <p className="kicker text-gold">Gua Sar · Lunar New Year</p>
              <h2 id="lunar" className="mt-3 text-[36px] md:text-[54px]">
                Цагаан сарын <span className="gold-text">цуглуулга</span>
              </h2>
              <p className="mt-3 max-w-md text-snow/75">Дээл, монгол цамц, хантааз: үндэсний өвийг өнөөгийн хэлбэрээр. Дэлгүүрийн хамгийн эрэлттэй бараа энд.</p>
              <div className="mt-7 grid grid-cols-3 gap-2.5">
                {lunar
                  .filter(withPhoto)
                  .slice(0, 6)
                  .map((p) => (
                    <Link key={p.id} href={`/p/${p.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-[12px] bg-paper">
                      <Image src={p.images[0].thumb.src} alt={p.title} fill sizes="(min-width: 1024px) 180px, 30vw" className="object-cover transition duration-700 group-hover:scale-105" />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6 text-[11.5px] font-semibold">{formatPrice(fromPrice(p))}</span>
                    </Link>
                  ))}
              </div>
              <Link href="/shop?t=national" className="btn btn-gold mt-7">
                Монгол хувцас үзэх <ArrowIcon size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pairs: the shop's «Хосын сонголт» */}
      {named.length > 0 && (
        <section id="pairs" className="wrap mt-20 scroll-mt-40 md:mt-28" aria-labelledby="pairs-h">
          <Reveal>
            <p className="kicker">Хосын сонголт</p>
            <h2 id="pairs-h" className="mt-2 text-[34px] text-ink md:text-[50px]">
              Хосоороо өмсөх загвар
            </h2>
          </Reveal>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {named.map((x, i) => (
              <Reveal key={x.name} delay={i * 90} className="rounded-[24px] bg-snow p-3 ring-1 ring-line">
                <div className="grid grid-cols-2 gap-2">
                  {x.items.map((p) => (
                    <Link key={p.id} href={`/p/${p.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-[16px] bg-paper">
                      <Image src={p.images[0].thumb.src} alt={p.title} fill sizes="(min-width: 768px) 200px, 45vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    </Link>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3 px-2 pt-3 pb-1">
                  <b className="display text-[24px]">{x.name}</b>
                  <span className="text-[14px] font-bold text-ink-2">{formatPrice(x.items.reduce((s, p) => s + fromPrice(p), 0))}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <Shelf id="best" kicker="Дэлгүүрийн жагсаалт" title="Хамгийн эрэлттэй" href="/shop" items={best} />

      {/* Types */}
      <section className="wrap mt-20 md:mt-28" aria-labelledby="types">
        <Reveal>
          <p className="kicker">Ангилал</p>
          <h2 id="types" className="mt-2 text-[34px] text-ink md:text-[50px]">
            Юу хайж байна?
          </h2>
        </Reveal>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
          {tiles.map((t, i) => (
            <Reveal key={t.id} delay={(i % 4) * 70}>
              <Link href={`/shop?t=${t.id}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[20px] bg-paper">
                <Image src={t.p!.images[0].thumb.src} alt="" fill sizes="(min-width: 768px) 300px, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <span className="absolute inset-x-4 bottom-4 text-snow">
                  <b className="display block text-[22px] leading-tight md:text-[26px]">{t.name}</b>
                  <span className="text-[12.5px] text-snow/80">{t.count} бараа</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Brand + branches */}
      <Reveal as="section" className="wrap mt-20 md:mt-28">
        <div className="paper grid gap-8 overflow-hidden rounded-[30px] p-6 ring-1 ring-line md:grid-cols-[auto_1fr] md:items-center md:p-12">
          <DeerDraw className="mx-auto w-40 text-ink md:w-56" />
          <div>
            <p className="kicker">DEER brand</p>
            <h2 className="mt-3 text-[32px] text-ink md:text-[46px]">Үндэсний өвийг орчин үеийн хэлбэрээр</h2>
            <p className="mt-3 max-w-2xl text-ink-2">
              Өөрийнхөөрөө байдаг хүмүүст зориулсан брэнд. Бүх бүтээгдэхүүнээ өөрсдийн үйлдвэрт урлан хийдэг. {business.company}. <span className="italic text-ink-3">«{shop.motto}»</span>
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {business.branches.map((b) => (
                <div key={b.name} className="flex gap-3 rounded-[18px] bg-snow p-4 ring-1 ring-line">
                  <PinIcon size={19} className="mt-0.5 shrink-0 text-berry" />
                  <span className="text-[14px] text-ink-2">
                    <b className="block text-[15px] font-bold text-ink">{b.name}</b>
                    {b.place}
                  </span>
                </div>
              ))}
            </div>
            <a href={`tel:${business.phone.tel}`} className="btn btn-wine mt-6">
              {business.phone.display}
            </a>
          </div>
        </div>
      </Reveal>
    </>
  );
}
