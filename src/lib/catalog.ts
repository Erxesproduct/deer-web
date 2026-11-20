import "server-only";

import data from "@/data/catalog.json";

export type Variant = {
  /** "<zochilProductId>" or "<zochilProductId>-<zochilVariantId>". erxes product code DR-<id>. */
  id: string;
  /** option values joined («Black · M»), null for products without options */
  label: string | null;
  opts: Record<string, string>;
  price: number;
  compareAt: number | null;
  /** Zochil stock (per product, shared by its variants); null = not counted (orderable), 0 = sold out */
  stock: number | null;
};
export type Photo = { src: string; w: number; h: number; thumb: { src: string; w: number; h: number } };
export type Option = { title: string; values: string[] };
export type Colour = { name: string; hex: string | null; img: Photo | null };
export type Product = {
  id: number;
  slug: string;
  title: string;
  /** gift | acc | national | outer | sets | dress | bottom | vest | top */
  type: string;
  sub: string | null;
  /** w / m from the shop's ЭМЭГТЭЙ / ЭРЭГТЭЙ trees (unisex = both, accessories may have none) */
  gender: string[];
  knit: boolean;
  cashmere: boolean;
  /** «Winter Dream» New Year: the shop's winter drop, cashmere pieces, gift cards, party pieces */
  ny: boolean;
  /** Lunar New Year (Цагаан сар): national wear */
  lunar: boolean;
  /** the shop's «ХОСЫН СОНГОЛТ» pair name */
  pair: string | null;
  /** the shop's «ШИНЭ БҮТЭЭГДЭХҮҮН» */
  isNew: boolean;
  lines: string[];
  options: Option[];
  colours: Colour[];
  variants: Variant[];
  best: number;
  createdAt: string;
  images: Photo[];
};
export type Type = { id: string; name: string; line: string; count: number; subs: { name: string; count: number }[] };

export const products = data.products as Product[];
export const types = data.types as Type[];
export const pairs = data.pairs as { name: string; ids: number[] }[];
export const shop = data.shop;
export const catalogInfo = { source: data.source, shopId: data.shopId, updatedAt: data.updatedAt };

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byId = new Map(products.map((p) => [p.id, p]));
const byVariant = new Map(products.flatMap((p) => p.variants.map((v) => [v.id, { product: p, variant: v }] as const)));
export const getProduct = (slug: string) => bySlug.get(slug);
export const getById = (id: number) => byId.get(id);
export const getVariant = (id: string) => byVariant.get(id);
export const getType = (id: string) => types.find((g) => g.id === id);
export const sku = (id: string) => `DR-${id}`;

export const soldOut = (v: Pick<Variant, "stock">) => v.stock === 0;
export const available = (p: Product) => p.variants.some((v) => !soldOut(v));
export const fromPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));
export const onSale = (p: Product) => p.variants.some((v) => v.compareAt);
export const discount = (p: Product) => Math.max(0, ...p.variants.map((v) => (v.compareAt ? Math.round((1 - v.price / v.compareAt) * 100) : 0)));
export const singleVariant = (p: Product) => (p.variants.length === 1 && !soldOut(p.variants[0]) ? p.variants[0].id : null);
export const cover = (p: Product) => p.images[0]?.thumb ?? null;
export const second = (p: Product) => p.images[1]?.thumb ?? p.colours.find((c) => c.img && c.img.src !== p.images[0]?.src)?.img?.thumb ?? null;
export const sizes = (p: Product) => p.options.find((o) => o.title === "Хэмжээ")?.values ?? [];
export const GENDER: Record<string, string> = { w: "Эмэгтэй", m: "Эрэгтэй" };

/** In stock first, then the shop's bestseller order, then newest. */
const rank = (p: Product) => (p.best < 0 ? 999 : p.best);
export const byPopularity = (a: Product, b: Product) => Number(available(b)) - Number(available(a)) || rank(a) - rank(b) || Number(b.images.length > 0) - Number(a.images.length > 0) || b.createdAt.localeCompare(a.createdAt) || b.id - a.id;
export const popular = [...products].sort(byPopularity);
export const bestsellers = popular.filter((p) => p.best >= 0 && available(p));
export const newest = [...products].filter(available).sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);
/** New Year: in stock, newest first (this winter's pieces before last year's). */
export const newYear = newest.filter((p) => p.ny);
export const lunar = popular.filter((p) => p.lunar && available(p));

/** One winter colour per type, for tags and chips. */
export const TONE: Record<string, { bg: string; text: string; hex: string }> = {
  gift: { bg: "bg-gold", text: "text-gold-d", hex: "#c9a45c" },
  acc: { bg: "bg-berry", text: "text-berry", hex: "#b3202f" },
  national: { bg: "bg-wine", text: "text-wine", hex: "#5c0f17" },
  outer: { bg: "bg-ink", text: "text-ink", hex: "#161211" },
  sets: { bg: "bg-pine", text: "text-pine", hex: "#1f4a3a" },
  dress: { bg: "bg-berry", text: "text-berry", hex: "#b3202f" },
  bottom: { bg: "bg-frost-d", text: "text-frost-d", hex: "#5d7380" },
  vest: { bg: "bg-pine", text: "text-pine", hex: "#1f4a3a" },
  top: { bg: "bg-wine", text: "text-wine", hex: "#5c0f17" },
};
