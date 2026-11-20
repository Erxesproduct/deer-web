import data from "@/data/catalog.json";

/**
 * Business facts from deer.mn (Zochil shop 2866: shop settings, payment and delivery rules, terms of service, the two
 * delivery options, FAQ, about page, branches) and the DEER brand Facebook page, read on 2026-11-20. Nothing here is
 * invented; where the shop's texts leave a gap (countryside, exact zone borders) it is an open question in
 * docs/erxes/MANUAL-STEPS.md.
 */
const shop = data.shop;

/** The shop's FAQ, word for word. */
export const faq = shop.faq as { q: string; a: string }[];

export type Zone = { id: string; name: string; area: string; price: number; freeOver: number };
/** The two Zochil delivery options, in their own words. */
export const ZONES: Zone[] = shop.zones.map((z, i) => ({ id: i === 0 ? "center" : "far", name: z.title, area: z.description, price: z.price, freeOver: z.freeOver }));
export const getZone = (id: string) => ZONES.find((z) => z.id === id);

export const business = {
  name: "DEER",
  /** The Zochil shop name, word for word. */
  title: shop.name,
  /** The logo's wordmark. */
  alias: "DEER Mongolia",
  /** Zochil shop description, word for word. */
  motto: shop.motto,
  domain: "deer.mn",
  phone: { display: "7014-1889", tel: "+97670141889" },
  email: shop.email,
  facebook: shop.facebook,
  instagram: shop.instagram,
  instagramHandle: "@deer_brand",
  /** Zochil address: two branches. */
  branches: [
    { name: "Салбар 1", place: "Гранд Плаза худалдааны төв, 213 тоот", area: "Баянгол дүүрэг, 2-р хороо" },
    { name: "Салбар 2", place: "УИД-ийн урд, The Beatles хөшөөний баруун талд", area: "Улсын их дэлгүүрийн урд" },
  ],
  /** About page: the owner company. */
  company: "Цаст Согоот ХХК",

  /** Zochil checkout method: QPay. */
  payments: [{ id: "qpay", name: "QPay", note: "Аль ч банкны аппаар QR уншуулж төлнө." }],

  rules: {
    /** Zochil payment rule, word for word. */
    payment: shop.paymentRule,
    /** Zochil delivery rule, word for word. */
    delivery: shop.deliveryRule,
    /** Zochil terms of service, word for word. */
    terms: shop.terms,
    time: "Захиалга баталгаажсаны дараа өдөр 8–24 цагийн дотор хүргэнэ (хүргэлтийн компаниар, цаг заахгүй).",
    exchange: "Үндсэн үнээр авсан барааг хүлээн авснаас хойш 24 цагийн дотор салбар дээр солиулж, буцааж болно. Хямдралтай бараа солигдохгүй.",
    tag: "Шошго салгасан, толбо тортог болсон, үнэр шингэсэн бараа солигдохгүй.",
    outside: "Хоёр бүсээс гадуур болон орон нутагт хүргүүлэх бол захиалахаасаа өмнө 7014-1889 дугаараар тохирно уу.",
    ebarimt: "И-баримтыг төлбөр баталгаажсаны дараа erxes-ээс албан ёсоор олгоно. Байгууллагаар авах бол 7 оронтой регистрийн дугаараа бичнэ үү.",
  },
} as const;

export type PaymentId = (typeof business.payments)[number]["id"];
export const paymentOption = (id: PaymentId) => business.payments.find((p) => p.id === id)!;

/** Zochil rule: the zone's fee, free when the goods come to more than that zone's limit. */
export function deliveryFee(subtotal: number, zone: Zone): number {
  return zone.freeOver > 0 && subtotal > zone.freeOver ? 0 : zone.price;
}
export const cheapestZone = ZONES.reduce((a, b) => (b.price < a.price ? b : a));

/** Order statuses staff move an order through (erxes Sales pipeline stages, see MANUAL-STEPS.md). */
export const ORDER_STATUSES = [
  { id: "pending", name: "Төлбөр хүлээгдэж байна", note: "QPay-ээр 100% төлснөөр баталгаажна" },
  { id: "paid", name: "Баталгаажсан", note: "Төлбөр орсон, бараагаа бэлдэж эхэлнэ" },
  { id: "packing", name: "Бэлэг шиг савлаж байна", note: "Шошготой, бүрэн бүтэн савлана" },
  { id: "shipped", name: "Хүргэлтэд гарсан", note: "Дараа өдөр нь 8–24 цагийн дотор" },
  { id: "delivered", name: "Хүргэгдсэн", note: "Үндсэн үнийн барааг 24 цагт солиулж болно" },
  { id: "cancelled", name: "Цуцлагдсан", note: "Төлбөр төлөгдөөгүй эсвэл цуцалсан" },
] as const;
