// node scripts/export-erxes.mjs → docs/erxes/deer-{categories,products,delivery}.csv
// Files for erxes Products & Services import (Settings → Import). Every row comes from src/data/catalog.json.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const c = JSON.parse(readFileSync(path.join(root, "src/data/catalog.json"), "utf8"));
const out = path.join(root, "docs/erxes");
mkdirSync(out, { recursive: true });

const cell = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (rows) => "﻿" + rows.map((r) => r.map(cell).join(",")).join("\n") + "\n";
const code = (id) => `DR-${id.toUpperCase()}`;

// categories: DR → the nine product types → their sub-types, plus delivery.
// Gender, knit, New Year and Lunar New Year are product properties (columns), not categories.
const cats = [["code", "name", "parent code"], ["DR", "DEER brand", ""]];
for (const t of c.types) {
  cats.push([code(t.id), t.name, "DR"]);
  for (const [i, s] of t.subs.entries()) cats.push([`${code(t.id)}-${i + 1}`, s.name, code(t.id)]);
}
cats.push(["DR-DELIVERY", "Хүргэлт", "DR"]);
writeFileSync(path.join(out, "deer-categories.csv"), csv(cats));

const GENDER = { w: "Эмэгтэй", m: "Эрэгтэй" };
const subCode = (p) => {
  const t = c.types.find((x) => x.id === p.type);
  const i = (t?.subs ?? []).findIndex((s) => s.name === p.sub);
  return i >= 0 ? `${code(p.type)}-${i + 1}` : code(p.type);
};
const yes = (b) => (b ? "yes" : "");
const rows = [["code", "name", "category code", "type", "unit price", "price before sale", "gender", "knit", "cashmere", "new year", "lunar new year", "options", "stock (Zochil)", "zochil product id", "image (website path)"]];
for (const p of c.products)
  for (const v of p.variants)
    rows.push([
      `DR-${v.id}`,
      [p.title, v.label].filter(Boolean).join(" · ").slice(0, 200),
      subCode(p),
      "product",
      v.price,
      v.compareAt ?? "",
      p.gender.map((g) => GENDER[g] ?? g).join("; "),
      yes(p.knit),
      yes(p.cashmere),
      yes(p.ny),
      yes(p.lunar),
      Object.entries(v.opts ?? {}).map(([k, x]) => `${k}=${x}`).join("; "),
      v.stock ?? "",
      p.id,
      p.images[0]?.src ?? "",
    ]);
writeFileSync(path.join(out, "deer-products.csv"), csv(rows));

// the shop's two Zochil delivery options, word for word
const ZONE_CODE = { 3016: "DR-DELIVERY-CENTER", 474: "DR-DELIVERY-FAR" };
const delivery = [["code", "name", "category code", "type", "unit price", "source"]];
for (const z of c.shop.zones) delivery.push([ZONE_CODE[z.id] ?? `DR-DELIVERY-${z.id}`, `Хүргэлт: ${z.title} (${z.description})`, "DR-DELIVERY", "service", z.price, `Zochil delivery option ${z.id}; free when the goods come to more than ${z.freeOver}₮.`]);
writeFileSync(path.join(out, "deer-delivery.csv"), csv(delivery));
console.log(`categories ${cats.length - 1}, products ${rows.length - 1}, delivery ${delivery.length - 1}`);
