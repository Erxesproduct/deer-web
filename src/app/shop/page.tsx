import type { Metadata } from "next";
import Link from "next/link";
import { Snowflake } from "@/components/brand";
import { CloseIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { available, byPopularity, discount, fromPrice, GENDER, getType, onSale, popular, types } from "@/lib/catalog";

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const PER_PAGE = 48;
const SORTS = [
  { id: "", name: "Эрэлттэй" },
  { id: "new", name: "Шинэ" },
  { id: "low", name: "Үнэ ↑" },
  { id: "high", name: "Үнэ ↓" },
];

const heading = (f: { t: string; w: string; ny: string; knit: string; new: string; sale: string; q: string }) => {
  const t = getType(f.t);
  if (f.ny) return { title: "Шинэ жилийн цуглуулга", line: "Winter Dream: ноолуур малгай, ороолт, сүлжмэл, бэлгийн карт. Хамгийн шинэ нь эхэндээ." };
  if (t) return { title: f.w ? `${GENDER[f.w]}: ${t.name.toLowerCase()}` : t.name, line: t.line };
  if (f.w) return { title: `${GENDER[f.w]} хувцас`, line: "Сүлжмэл, монгол хувцас, гадуур хувцас, малгай" };
  if (f.knit) return { title: "Сүлжмэл", line: "Ноос, ноолуур утсаар сүлжсэн свитер, кардиган, юбка, даашинз" };
  if (f.new) return { title: "Шинэ бүтээгдэхүүн", line: "Дэлгүүрийн «Шинэ бүтээгдэхүүн» ангилал" };
  if (f.sale) return { title: "Хямдрал", line: "Хямдралтай бараа буцаагдахгүй тул сонголтоо зөв хийнэ үү." };
  if (f.q) return { title: `«${f.q}»`, line: "Хайлтын үр дүн" };
  return { title: "Бүх бараа", line: "Монгол хувцас, сүлжмэл, гадуур хувцас, малгай, бэлгийн карт" };
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const f = { t: one(sp.t), w: one(sp.w), ny: one(sp.ny), knit: one(sp.knit), new: one(sp.new), sale: one(sp.sale), q: one(sp.q) };
  const h = heading(f);
  const q = new URLSearchParams(Object.entries({ t: f.t, w: f.w, ny: f.ny, knit: f.knit }).filter(([, v]) => v) as [string, string][]).toString();
  return { title: h.title, description: h.line, alternates: { canonical: q ? `/shop?${q}` : "/shop" } };
}

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").replace(/[.\-/]/g, " ").replace(/\s+/g, " ").trim();

export default async function Shop({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const f = { t: one(sp.t), s: one(sp.s), w: one(sp.w), ny: one(sp.ny), knit: one(sp.knit), new: one(sp.new), sale: one(sp.sale), in: one(sp.in), q: one(sp.q).slice(0, 60), sort: one(sp.sort), page: one(sp.page) };
  const type = getType(f.t);

  let list = popular.filter((p) => {
    if (type && p.type !== type.id) return false;
    if (f.s && p.sub !== f.s) return false;
    if (f.w && !p.gender.includes(f.w)) return false;
    if (f.ny && !p.ny) return false;
    if (f.knit && !p.knit) return false;
    if (f.new && !p.isNew) return false;
    if (f.sale && !(onSale(p) && available(p))) return false;
    if (f.in && !available(p)) return false;
    if (f.q) {
      const hay = norm(`${p.title} ${p.sub ?? ""} ${getType(p.type)?.name} ${p.options.flatMap((o) => o.values).join(" ")}`);
      if (!norm(f.q).split(" ").every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  const byAvail = (a: (typeof list)[number], b: (typeof list)[number]) => Number(available(b)) - Number(available(a));
  list =
    f.sort === "new" || (f.ny && !f.sort)
      ? [...list].sort((a, b) => byAvail(a, b) || b.createdAt.localeCompare(a.createdAt) || b.id - a.id)
      : f.sort === "low"
        ? [...list].sort((a, b) => byAvail(a, b) || fromPrice(a) - fromPrice(b))
        : f.sort === "high"
          ? [...list].sort((a, b) => byAvail(a, b) || fromPrice(b) - fromPrice(a))
          : [...list].sort((a, b) => byPopularity(a, b) || discount(b) - discount(a));

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number.parseInt(f.page, 10) || 1));
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const href = (patch: Partial<typeof f>) => {
    const next = { ...f, page: "", ...patch };
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) q.set(k, v);
    const s = q.toString();
    return s ? `/shop?${s}` : "/shop";
  };
  const active = [f.s, f.w, f.ny, f.knit, f.new, f.sale, f.in, f.q].some(Boolean);
  const h = heading(f);
  const dark = !!f.ny;

  return (
    <div className="pb-16">
      <section className={`relative overflow-hidden ${dark ? "night text-snow" : "paper"}`}>
        {dark && <div className="snow absolute inset-0" aria-hidden />}
        <Snowflake className={`twinkle absolute top-6 right-[10%] h-10 w-10 ${dark ? "text-gold" : "text-line"}`} />
        <div className="wrap relative pt-9 pb-9 md:pt-14 md:pb-12">
          <p className={`kicker ${dark ? "text-gold" : ""}`}>{list.length} бараа</p>
          <h1 className={`mt-3 text-[40px] md:text-[64px] ${dark ? "" : "text-ink"}`}>{h.title}</h1>
          <p className={`mt-2 max-w-2xl text-[16px] ${dark ? "text-snow/80" : "text-ink-2"}`}>{h.line}</p>
        </div>
      </section>

      <div className="wrap">
        <div className="-mx-4 border-b border-line bg-snow px-4 py-3 md:mx-0 md:mt-5 md:rounded-[22px] md:border md:px-4">
          <Scroller small label="Төрөл" as="nav" className="no-scrollbar flex min-w-0 max-w-full gap-2 overflow-x-auto">
            <Link href={href({ t: "", s: "" })} className="chip" aria-current={!type ? "true" : undefined}>
              Бүгд
            </Link>
            {types.map((g) => (
              <Link key={g.id} href={href({ t: g.id, s: "" })} className="chip" aria-current={type?.id === g.id ? "true" : undefined}>
                {g.name} <span className="text-[12px] opacity-60">{g.count}</span>
              </Link>
            ))}
          </Scroller>

          <Scroller small label="Шүүлтүүр" className="no-scrollbar mt-2.5 flex min-w-0 max-w-full items-center gap-1.5 overflow-x-auto">
            {Object.entries(GENDER).map(([id, name]) => (
              <Link key={id} href={href({ w: f.w === id ? "" : id })} className="chip min-h-9 px-3.5 text-[13.5px]" aria-current={f.w === id ? "true" : undefined}>
                {name}
              </Link>
            ))}
            <span className="mx-1 h-6 w-px shrink-0 bg-line" aria-hidden />
            <Link href={href({ ny: f.ny ? "" : "1" })} className="chip min-h-9 px-3.5 text-[13.5px]" aria-current={f.ny ? "true" : undefined}>
              <Snowflake className="h-3.5 w-3.5" /> Шинэ жил
            </Link>
            <Link href={href({ knit: f.knit ? "" : "1" })} className="chip min-h-9 px-3.5 text-[13.5px]" aria-current={f.knit ? "true" : undefined}>
              Сүлжмэл
            </Link>
            <Link href={href({ new: f.new ? "" : "1" })} className="chip min-h-9 px-3.5 text-[13.5px]" aria-current={f.new ? "true" : undefined}>
              Шинэ
            </Link>
            <Link href={href({ sale: f.sale ? "" : "1" })} className="chip min-h-9 px-3.5 text-[13.5px]" aria-current={f.sale ? "true" : undefined}>
              % Хямдрал
            </Link>
            <Link href={href({ in: f.in ? "" : "1" })} className="chip min-h-9 px-3.5 text-[13.5px]" aria-current={f.in ? "true" : undefined}>
              Бэлэн байгаа
            </Link>
          </Scroller>

          {type && type.subs.length > 1 && (
            <Scroller small label="Дэд төрөл" className="no-scrollbar mt-2 flex min-w-0 max-w-full items-center gap-1.5 overflow-x-auto">
              {type.subs.map((s) => (
                <Link key={s.name} href={href({ s: f.s === s.name ? "" : s.name })} className="chip min-h-9 px-3.5 text-[13.5px]" aria-current={f.s === s.name ? "true" : undefined}>
                  {s.name}
                </Link>
              ))}
            </Scroller>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {f.q && (
              <Link href={href({ q: "" })} className="tag gap-1 bg-paper py-1.5 text-[13.5px] text-ink">
                «{f.q}» <CloseIcon size={13} />
              </Link>
            )}
            {active && (
              <Link href={href({ s: "", w: "", ny: "", knit: "", new: "", sale: "", in: "", q: "" })} className="text-[14px] font-semibold text-berry hover:underline">
                Шүүлтүүр арилгах
              </Link>
            )}
          </div>
          <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full bg-paper p-1" role="group" aria-label="Эрэмбэ">
            {SORTS.map((s) => (
              <Link key={s.id} href={href({ sort: s.id })} aria-current={(f.sort || (f.ny ? "new" : "")) === s.id ? "true" : undefined} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13.5px] font-semibold ${(f.sort || (f.ny ? "new" : "")) === s.id ? "bg-snow shadow-sm" : "text-ink-2"}`}>
                {s.name}
              </Link>
            ))}
          </div>
        </div>

        {shown.length ? (
          <>
            <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
              {shown.map((p, i) => (
                <ProductCard key={p.id} p={p} priority={i < 4} />
              ))}
            </div>
            {pages > 1 && (
              <nav aria-label="Хуудас" className="mt-12 flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <Link key={n} href={href({ page: n === 1 ? "" : String(n) })} aria-current={n === page ? "page" : undefined} className={`grid h-11 min-w-11 place-items-center rounded-full px-3 font-bold tabular-nums ${n === page ? "bg-wine text-snow" : "bg-snow ring-1 ring-line hover:ring-ink"}`}>
                    {n}
                  </Link>
                ))}
              </nav>
            )}
          </>
        ) : (
          <div className="card mx-auto mt-10 max-w-lg p-10 text-center">
            <Snowflake className="mx-auto h-11 w-11 text-gold" />
            <p className="display mt-5 text-[28px]">Энэ сонголтоор бараа олдсонгүй</p>
            <p className="mt-2 text-ink-2">Шүүлтүүрээ багасгаад үзээрэй, эсвэл 7014-1889 дугаарт залгаарай.</p>
            <Link href="/shop" className="btn btn-wine mt-6">
              Бүх бараа
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
