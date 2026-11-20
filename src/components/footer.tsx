import Link from "next/link";
import { business, ZONES } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { KnitBand, Logo, Sparkle } from "./brand";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, TruckIcon } from "./icons";

export function Footer() {
  const cards = [
    { href: `tel:${business.phone.tel}`, Icon: PhoneIcon, k: "Утас", v: business.phone.display, tone: "bg-gold text-wine-d" },
    { href: business.facebook, Icon: FacebookIcon, k: "Facebook", v: "DEER brand", tone: "bg-frost text-ink" },
    { href: business.instagram, Icon: InstagramIcon, k: "Instagram", v: business.instagramHandle, tone: "bg-berry text-snow" },
    { href: `mailto:${business.email}`, Icon: MailIcon, k: "Имэйл", v: business.email, tone: "bg-pine text-snow" },
  ];
  return (
    <footer id="contact" className="night relative mt-24 overflow-hidden pb-28 text-snow md:pb-0">
      <KnitBand />
      <div className="snow absolute inset-0 opacity-40" aria-hidden />
      <div className="wrap relative pt-16 pb-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Logo light />
            <p className="display mt-8 max-w-md text-[30px] leading-tight">Үндэсний өв, орчин үеийн хэлбэрээр</p>
            <p className="mt-3 max-w-md text-[15px] text-snow/75">Бүх бүтээгдэхүүнээ өөрсдийн үйлдвэрт урлаж хийдэг монгол брэнд. {business.company}.</p>
            <div className="mt-6 grid gap-3 text-[14.5px] text-snow/85">
              {ZONES.map((z) => (
                <p key={z.id} className="flex items-start gap-3">
                  <TruckIcon size={19} className="mt-0.5 shrink-0 text-gold" />
                  <span>
                    <b className="text-snow">{z.name}</b>: {formatPrice(z.price)}, {formatPrice(z.freeOver)}-өөс дээш үнэгүй
                  </span>
                </p>
              ))}
              {business.branches.map((b) => (
                <p key={b.name} className="flex items-start gap-3">
                  <PinIcon size={19} className="mt-0.5 shrink-0 text-gold" />
                  <span>
                    <b className="text-snow">{b.name}</b>: {b.place}
                  </span>
                </p>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 self-start sm:grid-cols-2">
            {cards.map(({ href, Icon, k, v, tone }) => (
              <a key={k} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex items-center gap-4 rounded-[20px] bg-snow/8 p-4 ring-1 ring-snow/15 backdrop-blur transition hover:-translate-y-1 hover:bg-snow/14">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${tone} transition group-hover:rotate-[-8deg]`}>
                  <Icon size={21} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] text-snow/60">{k}</span>
                  <b className="block truncate text-[15.5px] font-semibold">{v}</b>
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-snow/15 pt-6 text-[14px] text-snow/70">
          <Link href="/shop" className="hover:text-snow">
            Бүх бараа
          </Link>
          <Link href="/shop?ny=1" className="hover:text-snow">
            Шинэ жилийн цуглуулга
          </Link>
          <Link href="/info" className="hover:text-snow">
            Хүргэлт, төлбөр, солих
          </Link>
          <Link href="/info#faq" className="hover:text-snow">
            Түгээмэл асуулт
          </Link>
          <span className="ml-auto flex items-center gap-2 text-snow/55">
            <Sparkle className="h-3.5 w-3.5 text-gold" /> © {new Date().getFullYear()} {business.title}
          </span>
        </div>
      </div>
    </footer>
  );
}
