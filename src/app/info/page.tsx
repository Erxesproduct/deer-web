import type { Metadata } from "next";
import { DeerDraw, Snowflake } from "@/components/brand";
import { ChatIcon, ClockIcon, FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, QrIcon, TruckIcon } from "@/components/icons";
import { business, faq, ORDER_STATUSES, ZONES } from "@/content/business";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Хүргэлт, төлбөр, солих",
  description: `${ZONES.map((z) => `${z.name} ${formatPrice(z.price)} (${formatPrice(z.freeOver)}-өөс дээш үнэгүй)`).join(", ")}. Маргааш нь 8–24 цагт. QPay. Үндсэн үнийн барааг 24 цагт солино.`,
  alternates: { canonical: "/info" },
};

export default function InfoPage() {
  return (
    <div className="pb-28 md:pb-16">
      <section className="night relative overflow-hidden text-snow">
        <div className="snow absolute inset-0" aria-hidden />
        <DeerDraw className="absolute top-6 right-[4%] hidden w-56 text-gold/50 md:block" />
        <div className="wrap relative pt-10 pb-12 md:pt-16 md:pb-16">
          <p className="kicker text-gold">Мэдээлэл</p>
          <h1 className="mt-4 max-w-3xl text-[44px] md:text-[68px]">Хүргэлт, төлбөр, солих</h1>
          <p className="mt-4 max-w-2xl text-[16px] text-snow/80">
            {business.alias}: үндэсний өвийг орчин үеийн загвараар. Бүх бүтээгдэхүүнээ өөрсдийн үйлдвэрт урладаг. {business.company}.
          </p>
        </div>
      </section>

      <div className="wrap">
        {/* Delivery: the zones with their fee and free limit, as the shop set them on Zochil */}
        <section id="delivery" className="mt-8 scroll-mt-44" aria-labelledby="dl">
          <h2 id="dl" className="flex items-center gap-3 text-[34px] text-ink md:text-[46px]">
            <TruckIcon size={30} className="text-berry" /> Хүргэлт
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {ZONES.map((z, i) => (
              <div key={z.id} className="relative overflow-hidden rounded-[24px] bg-snow p-6 ring-1 ring-line md:p-7">
                <span className={`absolute inset-x-0 top-0 h-1.5 ${i ? "bg-gold" : "bg-berry"}`} />
                <div className="flex items-start justify-between gap-4">
                  <b className="text-[19px] font-bold">{z.name}</b>
                  <span className="display text-[40px] leading-none text-wine">{formatPrice(z.price)}</span>
                </div>
                <p className="mt-3 text-[14.5px] text-ink-2">{z.area}</p>
                <p className="mt-4 inline-flex rounded-full bg-pine-l px-3 py-1 text-[13.5px] font-bold text-pine">Барааны дүн {formatPrice(z.freeOver)}-өөс давбал үнэгүй</p>
              </div>
            ))}
          </div>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              { Icon: ClockIcon, t: "Хэзээ ирэх вэ?", d: business.rules.time },
              { Icon: TruckIcon, t: "Хэн хүргэх вэ?", d: business.rules.delivery },
              { Icon: PinIcon, t: "Бүсээс гадуур, орон нутаг", d: business.rules.outside },
            ].map(({ Icon, t, d }) => (
              <li key={t} className="flex gap-3 rounded-[20px] bg-paper/70 p-5">
                <Icon size={20} className="mt-0.5 shrink-0 text-wine" />
                <span className="text-[14px] text-ink-2">
                  <b className="mb-1 block text-[15.5px] text-ink">{t}</b>
                  {d}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <section id="payment" className="scroll-mt-44 rounded-[24px] bg-gold-l p-6 md:p-8">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-gold text-wine-d">
              <QrIcon size={22} />
            </span>
            <h2 className="mt-4 text-[30px] text-ink">Төлбөр</h2>
            <ul className="mt-3 space-y-2 text-[15px] text-ink-2">
              {[business.rules.payment, "QPay: аль ч банкны аппаар QR уншуулж төлнө.", business.rules.ebarimt].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-wine" />
                  {t}
                </li>
              ))}
            </ul>
          </section>
          <section id="terms" className="scroll-mt-44 rounded-[24px] bg-berry-l p-6 md:p-8">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-berry text-snow">
              <ChatIcon size={22} />
            </span>
            <h2 className="mt-4 text-[30px] text-ink">Солих, буцаах</h2>
            <ul className="mt-3 space-y-2 text-[15px] text-ink-2">
              {[business.rules.terms, business.rules.exchange, business.rules.tag].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-berry" />
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section id="store" className="pine-night relative mt-6 grid scroll-mt-44 gap-6 overflow-hidden rounded-[28px] p-6 text-snow md:grid-cols-[1.4fr_1fr] md:p-10" aria-labelledby="store-h">
          <Snowflake className="absolute -right-10 -bottom-10 h-52 w-52 text-snow/8" />
          <div className="relative">
            <p className="kicker text-gold">Салбар дэлгүүр</p>
            <h2 id="store-h" className="mt-3 text-[34px] md:text-[46px]">
              Ирж өмсөж үзээрэй
            </h2>
            <div className="mt-5 grid gap-3">
              {business.branches.map((b) => (
                <p key={b.name} className="flex items-start gap-3 text-snow/85">
                  <PinIcon size={19} className="mt-1 shrink-0 text-gold" />
                  <span>
                    <b className="block text-snow">{b.name}</b>
                    {b.place}, {b.area}
                  </span>
                </p>
              ))}
            </div>
            <a href={`tel:${business.phone.tel}`} className="btn btn-gold mt-7">
              <PhoneIcon size={17} /> {business.phone.display}
            </a>
          </div>
          <div className="relative grid content-center gap-3">
            {[
              { href: business.facebook, Icon: FacebookIcon, v: "DEER brand" },
              { href: business.instagram, Icon: InstagramIcon, v: business.instagramHandle },
              { href: `mailto:${business.email}`, Icon: MailIcon, v: business.email },
            ].map(({ href, Icon, v }) => (
              <a key={v} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex min-w-0 items-center gap-3 rounded-[18px] bg-snow/10 p-4 ring-1 ring-snow/15 hover:bg-snow/15">
                <Icon size={20} className="shrink-0 text-gold" />
                <b className="truncate font-semibold">{v}</b>
              </a>
            ))}
          </div>
        </section>

        <section className="card mt-6 p-6 md:p-8" aria-labelledby="flow">
          <h2 id="flow" className="text-[30px] text-ink">
            Захиалгын явц
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ORDER_STATUSES.map((s, i) => (
              <li key={s.id} className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-wine text-[15px] font-bold text-gold">{i + 1}</span>
                <span>
                  <b className="block font-semibold">{s.name}</b>
                  <span className="text-[14px] text-ink-2">{s.note}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section id="faq" className="mt-10 scroll-mt-44" aria-labelledby="faq-h">
          <h2 id="faq-h" className="text-[34px] text-ink md:text-[46px]">
            Түгээмэл асуулт
          </h2>
          <div className="mt-5 grid gap-3">
            {faq.map((x) => (
              <details key={x.q} className="group card p-5 md:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-bold">
                  {x.q.trim()}
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-l text-[20px] text-wine transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[15px] whitespace-pre-line text-ink-2">{x.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
