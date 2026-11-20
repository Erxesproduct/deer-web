"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { business, cheapestZone, deliveryFee, getZone, ZONES } from "@/content/business";
import { cart, cartSubtotal, maxQty, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { getLiteVariant } from "@/lib/lite";
import { localOrders } from "@/lib/local-orders";
import { DISTRICTS } from "@/lib/orders/places";
import type { OrderErrors } from "@/lib/orders/schema";
import { Snowflake } from "./brand";
import { MinusIcon, PhoneIcon, PlusIcon, QrIcon, TrashIcon, TruckIcon } from "./icons";

const KEY = "dr.checkout-key";
/** One idempotency key per checkout attempt, kept until the order goes through. */
function checkoutKey() {
  try {
    const k = sessionStorage.getItem(KEY);
    if (k) return k;
    const n = crypto.randomUUID();
    sessionStorage.setItem(KEY, n);
    return n;
  } catch {
    return crypto.randomUUID();
  }
}

export function Checkout() {
  const items = useCart();
  const router = useRouter();
  const [receiptType, setReceiptType] = useState<"person" | "company">("person");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<OrderErrors>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const lines = items.flatMap((i) => {
    const v = getLiteVariant(i.id);
    return v ? [{ ...i, v }] : [];
  });
  const [zoneId, setZoneId] = useState("");
  const zone = getZone(zoneId);
  const subtotal = cartSubtotal(items);
  // until a zone is chosen, show the cheaper zone's fee as «from»
  const fee = deliveryFee(subtotal, zone ?? cheapestZone);
  const total = subtotal + fee;

  if (!lines.length)
    return (
      <div className="card mx-auto max-w-xl p-8 text-center md:p-12">
        <Snowflake className="mx-auto h-12 w-12 text-gold" />
        <p className="display mt-6 text-[34px]">Сагс хоосон байна</p>
        <p className="mt-2 text-ink-2">Шинэ жилийн цуглуулга, монгол хувцаснаас сонгоорой.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop?ny=1" className="btn btn-wine">
            Шинэ жилийн цуглуулга
          </Link>
          <Link href="/shop?t=national" className="btn btn-light">
            Монгол хувцас
          </Link>
        </div>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setNotice(null);
    setErrors({});
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: checkoutKey(),
          name: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email"),
          zone: zoneId,
          area: f.get("area"),
          khoroo: Number(f.get("khoroo")),
          address: f.get("address") ?? "",
          payment: "qpay",
          receiptType,
          regNo: f.get("regNo") ?? "",
          note: f.get("note"),
          agree,
          website: f.get("website"),
          items: items.map(({ id, qty }) => ({ id, qty })),
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        localOrders.save({
          reference: json.reference,
          createdAt: new Date().toISOString(),
          subtotal: json.subtotal,
          deliveryFee: json.deliveryFee,
          total: json.total,
          lines: lines.map((l) => ({ name: l.v.n, label: l.v.z, qty: l.qty, total: l.v.p * l.qty })),
          method: "qpay",
          invoiceId: json.payment?.invoiceId ?? null,
          payUrl: json.payment?.url ?? null,
          status: json.payment ? "pending" : null,
        });
        try {
          sessionStorage.removeItem(KEY);
        } catch {}
        cart.clear();
        router.push(`/order/${json.reference}`);
        return;
      }
      if (res.status === 422 && json?.errors) {
        setErrors(json.errors);
        setNotice("Улаанаар тэмдэглэсэн хэсгийг шалгаад дахин дарна уу.");
      } else if (json?.error === "not_configured") {
        setNotice(`Онлайн захиалга одоогоор холбогдоогүй байна. Захиалгаа ${business.phone.display} дугаарт өгнө үү (код ${json.reference}, нийт ${formatPrice(json.total ?? total)}). Таны сагс хадгалагдсан.`);
      } else {
        setNotice(`Захиалга илгээхэд алдаа гарлаа. Дахин оролдох эсвэл ${business.phone.display} дугаарт залгана уу.`);
      }
    } catch {
      setNotice("Интернэт холболтоо шалгаад дахин оролдоно уу.");
    } finally {
      setBusy(false);
    }
  }

  const err = (k: keyof OrderErrors) =>
    errors[k] && (
      <p className="pop-in mt-1.5 text-[14px] font-semibold text-berry" id={`e-${k}`}>
        {errors[k]}
      </p>
    );
  const step = (n: number, t: string) => (
    <h2 className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-wine text-[15px] font-bold text-gold">{n}</span>
      <span className="text-[28px]">{t}</span>
    </h2>
  );

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:gap-10">
      <div className="space-y-6">
        <section aria-label="Сагсны бараа" className="card p-4 md:p-6">
          <ul className="divide-y divide-line">
            {lines.map(({ id, qty, v }) => (
              <li key={id} className="flex gap-4 py-4 first:pt-1 last:pb-1">
                <Link href={`/p/${v.s}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-paper">
                  {v.t && <Image src={v.t} alt="" fill sizes="90px" className="object-cover" />}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link href={`/p/${v.s}`} className="line-clamp-2 leading-snug font-medium hover:underline">
                    {v.n}
                  </Link>
                  <span className="text-[14px] text-ink-2">
                    {v.z ? <b className="font-semibold text-ink">{v.z} · </b> : null}
                    {formatPrice(v.p)}
                  </span>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center rounded-2xl bg-paper">
                      <button type="button" onClick={() => cart.setQty(id, qty - 1)} className="grid h-10 w-10 place-items-center" aria-label="Цөөлөх">
                        <MinusIcon size={15} />
                      </button>
                      <span className="w-6 text-center font-semibold tabular-nums">{qty}</span>
                      <button type="button" onClick={() => cart.setQty(id, qty + 1)} disabled={qty >= maxQty(id)} className="grid h-10 w-10 place-items-center disabled:opacity-30" aria-label="Нэмэх">
                        <PlusIcon size={15} />
                      </button>
                    </div>
                    <span className="display text-[17px] font-bold tabular-nums">{formatPrice(v.p * qty)}</span>
                    <button type="button" onClick={() => cart.setQty(id, 0)} className="grid h-10 w-10 place-items-center rounded-full text-ink-3 hover:bg-berry-l hover:text-berry" aria-label={`${v.n}: хасах`}>
                      <TrashIcon size={17} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5 md:p-7">
          {step(1, "Таны мэдээлэл")}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="label">
              Нэр
              <input name="name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} className="field" />
              {err("name")}
            </label>
            <label className="label">
              Утас
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="99112233" required aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "e-phone" : undefined} className="field" />
              {err("phone")}
            </label>
            <label className="label sm:col-span-2">
              Имэйл <span className="font-normal text-ink-3">(заавал биш)</span>
              <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className="field" />
              {err("email")}
            </label>
          </div>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        </section>

        <section className="card p-5 md:p-7">
          {step(2, "Хаана хүргэх вэ?")}
          <p className="mt-5 text-[15px] font-semibold">Хүргэлтийн бүс</p>
          <div className="mt-2 grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label="Хүргэлтийн бүс" aria-invalid={!!errors.zone}>
            {ZONES.map((z) => {
              const on = zoneId === z.id;
              const free = subtotal > z.freeOver;
              return (
                <button key={z.id} type="button" role="radio" aria-checked={on} onClick={() => setZoneId(z.id)} className={`rounded-[18px] p-4 text-left transition ${on ? "bg-wine text-snow" : `bg-ivory ring-1 hover:ring-ink-3 ${errors.zone ? "ring-berry" : "ring-line"}`}`}>
                  <span className="flex items-baseline justify-between gap-2">
                    <b className="text-[15.5px]">{z.name}</b>
                    <b className={`text-[16px] tabular-nums ${free ? (on ? "text-gold" : "text-pine") : ""}`}>{free ? "Үнэгүй" : formatPrice(z.price)}</b>
                  </span>
                  <span className={`mt-1 block text-[12.5px] leading-snug ${on ? "text-snow/75" : "text-ink-3"}`}>{z.area}</span>
                  <span className={`mt-2 block text-[12px] font-semibold ${on ? "text-gold" : "text-pine"}`}>{formatPrice(z.freeOver)}-өөс дээш үнэгүй</span>
                </button>
              );
            })}
          </div>
          {err("zone")}
          <p className="mt-3 flex gap-2 text-[13.5px] text-ink-2">
            <TruckIcon size={17} className="mt-0.5 shrink-0 text-berry" />
            <span>
              {business.rules.time} {business.rules.outside}
            </span>
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-[1.4fr_1fr]">
            <label className="label">
              Дүүрэг
              <select name="area" required defaultValue="" aria-invalid={!!errors.area} className="field">
                <option value="" disabled>
                  Сонгох
                </option>
                {DISTRICTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              {err("area")}
            </label>
            <label className="label">
              Хороо
              <input name="khoroo" type="number" inputMode="numeric" min={1} max={45} required aria-invalid={!!errors.khoroo} className="field" />
              {err("khoroo")}
            </label>
            <label className="label sm:col-span-2">
              Хаяг
              <textarea name="address" rows={2} required aria-invalid={!!errors.address} placeholder="Байр, орц, давхар, тоот, орцны код" className="field" />
              {err("address")}
            </label>
          </div>
        </section>

        <section className="card p-5 md:p-7">
          {step(3, "Төлбөр, и-баримт")}
          <div className="mt-5 flex items-center gap-3 rounded-[20px] bg-wine p-4 text-snow">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-l text-ink">
              <QrIcon size={22} />
            </span>
            <span>
              <b className="block text-[16px]">QPay</b>
              <span className="text-[13.5px] text-snow/75">{business.payments[0].note} Захиалсны дараа төлбөрийн хуудас нээгдэнэ.</span>
            </span>
          </div>
          <p className="mt-5 text-[15px] font-semibold">И-баримт хэнд авах вэ?</p>
          <div className="mt-2 flex gap-2" role="radiogroup" aria-label="И-баримтын төрөл">
            {(
              [
                ["person", "Хувь хүн"],
                ["company", "Байгууллага"],
              ] as const
            ).map(([id, text]) => (
              <button key={id} type="button" role="radio" aria-checked={receiptType === id} onClick={() => setReceiptType(id)} className="chip">
                {text}
              </button>
            ))}
          </div>
          {receiptType === "company" ? (
            <label className="label mt-4">
              Байгууллагын регистр
              <input name="regNo" inputMode="numeric" maxLength={7} placeholder="1234567" aria-invalid={!!errors.regNo} className="field" />
              {err("regNo")}
            </label>
          ) : (
            <p className="mt-3 text-[14px] text-ink-2">И-баримтыг таны утасны дугаараар бүртгэнэ.</p>
          )}
          <label className="label mt-5">
            Нэмэлт тайлбар <span className="font-normal text-ink-3">(хүргэлтийн цаг, орцны код гэх мэт)</span>
            <textarea name="note" rows={2} className="field" />
          </label>
        </section>
      </div>

      <aside className="lg:sticky lg:top-[132px] lg:self-start">
        <div className="overflow-hidden rounded-[28px] bg-snow p-6 ring-1 ring-line md:p-8">
          <p className="kicker">Төлөх дүн</p>
          <dl className="mt-5 space-y-3 text-[16px]">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-ink-2">Бараа</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-ink-2">Хүргэлт {zone ? `(${zone.name})` : <span className="text-[13px] text-berry">бүсээ сонгоно уу</span>}</dt>
              <dd className="tabular-nums">{fee ? `${zone ? "" : "~"}${formatPrice(fee)}` : "Үнэгүй"}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
              <dt className="font-semibold">Нийт</dt>
              <dd className="display text-[38px] tabular-nums text-wine">{formatPrice(total)}</dd>
            </div>
          </dl>
          <ul className="mt-4 space-y-1.5 text-[13.5px] leading-snug text-ink-2">
            <li>• {business.rules.payment}</li>
            <li>• {business.rules.delivery}</li>
          </ul>
          <label className={`mt-5 flex cursor-pointer gap-3 rounded-[18px] p-3 text-[14.5px] leading-snug ${errors.agree ? "bg-berry-l" : "bg-paper"}`}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} aria-invalid={!!errors.agree} aria-describedby={errors.agree ? "e-agree" : undefined} className="mt-0.5 h-5 w-5 shrink-0 accent-[#5c0f17]" />
            <span>
              <b>Хямдралтай бараа буцаагдахгүй</b>, үндсэн үнийн барааг 24 цагийн дотор шошготой нь салбар дээр солино, цаг заасан хүргэлт байхгүйг зөвшөөрч байна.{" "}
              <Link href="/info#terms" target="_blank" className="font-semibold underline underline-offset-4">
                Нөхцөл
              </Link>
            </span>
          </label>
          {errors.agree && (
            <p id="e-agree" className="pop-in mt-2 text-[14px] font-semibold text-berry">
              {errors.agree}
            </p>
          )}
          {notice && (
            <p role="alert" className="pop-in mt-5 rounded-2xl bg-gold-l px-4 py-3 text-[14.5px]">
              {notice}
            </p>
          )}
          {errors.items && <p className="mt-4 rounded-2xl bg-berry px-4 py-2.5 text-[14.5px] text-snow">{errors.items}</p>}
          <button type="submit" disabled={busy} className="btn btn-wine mt-6 h-14 w-full text-[16px]">
            {busy ? "Илгээж байна…" : "Захиалах, QPay-ээр төлөх"}
          </button>
          <a href={`tel:${business.phone.tel}`} className="mt-5 inline-flex items-center gap-2 text-[14.5px] text-ink-2 hover:text-ink">
            <PhoneIcon size={16} /> Тусламж: {business.phone.display}
          </a>
        </div>
      </aside>
    </form>
  );
}
