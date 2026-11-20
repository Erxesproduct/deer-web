import Link from "next/link";
import { business, ZONES } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { Logo, Snowflake } from "./brand";
import { CartButton, HeartsButton, MobileMenu, MobileSearch } from "./header-tools";
import { Search } from "./search";

export const NAV = [
  { href: "/shop?ny=1", label: "Шинэ жил", dot: "bg-berry" },
  { href: "/shop?w=w", label: "Эмэгтэй", dot: "bg-wine" },
  { href: "/shop?w=m", label: "Эрэгтэй", dot: "bg-ink" },
  { href: "/shop?t=national", label: "Монгол хувцас", dot: "bg-gold" },
  { href: "/shop?knit=1", label: "Сүлжмэл", dot: "bg-pine" },
  { href: "/shop?t=acc", label: "Малгай, ороолт", dot: "bg-frost-d" },
  { href: "/shop?t=gift", label: "Бэлгийн карт", dot: "bg-gold" },
];

/** The running line: delivery first (the owner asked not to forget it), then the New Year collection. */
function Ticker() {
  const items = [
    ...ZONES.map((z) => `${z.name}: ${formatPrice(z.price)} · ${formatPrice(z.freeOver)}-өөс дээш үнэгүй`),
    "Маргааш нь 8–24 цагт хүргэнэ",
    "Winter Dream: шинэ жилийн цуглуулга",
    "QPay · И-баримт",
    `${business.branches.length} салбар · ${business.phone.display}`,
  ];
  const row = (hidden: boolean) => (
    <span className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <span key={t} className="flex items-center gap-8 whitespace-nowrap">
          {t}
          <Snowflake className="h-3.5 w-3.5 text-gold" />
        </span>
      ))}
    </span>
  );
  return (
    <div className="night overflow-hidden text-[12.5px] leading-9 font-semibold text-snow">
      <Link href="/info#delivery" className="marquee flex h-9 w-max" aria-label="Хүргэлтийн мэдээлэл">
        {row(false)}
        {row(true)}
      </Link>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40">
      <Ticker />
      <div className="border-b border-line bg-ivory/92 backdrop-blur-md">
        <div className="wrap flex h-[70px] items-center gap-3 md:h-[78px] md:gap-6">
          <MobileMenu items={NAV} />
          <Link href="/" className="shrink-0 pb-2" aria-label="DEER Mongolia: нүүр хуудас">
            <Logo />
          </Link>
          <Search className="mx-auto hidden w-full max-w-[420px] md:block" />
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <MobileSearch />
            <HeartsButton />
            <CartButton />
          </div>
        </div>
        <nav aria-label="Үндсэн цэс" className="hidden border-t border-line/70 lg:block">
          <div className="wrap flex h-12 items-center gap-1">
            <Link href="/shop" className="rounded-full px-3.5 py-1.5 text-[14px] font-bold hover:bg-paper">
              Бүх бараа
            </Link>
            {NAV.map((n, i) => (
              <Link key={n.href} href={n.href} className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[14px] font-semibold transition hover:bg-paper hover:text-ink ${i === 0 ? "text-berry" : "text-ink-2"}`}>
                {i === 0 ? <Snowflake className="h-4 w-4" /> : <span className={`h-2 w-2 rotate-45 ${n.dot}`} aria-hidden />}
                {n.label}
              </Link>
            ))}
            <Link href="/info#delivery" className="ml-auto rounded-full px-3.5 py-1.5 text-[14px] font-bold text-wine hover:bg-paper">
              Хүргэлтийн мэдээлэл
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
