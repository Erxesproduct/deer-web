# DEER brand web store

Next.js 16 storefront that replaces the Zochil shop at deer.mn: DEER Mongolia (Цаст Согоот ХХК), national heritage in
modern design, made in its own factory: Mongolian clothing, knitwear, cashmere hats and scarves, outerwear and the
«Winter Dream» New Year collection, with two stores in Ulaanbaatar.

```bash
npm install
npm run dev            # http://localhost:3000
npm run lint && npm run typecheck && npm run build
npm run test:order -- http://localhost:3000   # order API checks (no erxes needed)
npm run export:erxes   # docs/erxes/deer-*.csv for the erxes product import
```

- Catalog: `src/data/catalog.json` (+ `lite.json` for the cart and search), built from Zochil shop 2866 on 2026-11-20.
  Photos in `public/img/<hash>.webp`; the shop's logo, Winter Dream banner and Gua Sar campaign photo in `public/brand/`.
- Business rules (Төвийн бүс 10,000₮ free over 200,000₮, Алслагдсан бүс 15,000₮ free over 300,000₮, next day 8–24 h,
  QPay 100% before confirmation, no returns on sale items, 24 h exchange with tags, FAQ, two branches):
  `src/content/business.ts`.
- Orders go to erxes (form submission → Sales card), QPay through the erxes payment plugin. Until the `ERXES_*`
  variables (`.env.example`) are set, `/api/orders` answers `503 not_configured` and the checkout shows the phone.
- Manual erxes steps and open questions: `docs/erxes/MANUAL-STEPS.md`.

Look «Winter Dream»: the burgundy, ivory and gold of the shop's New Year banner, pine green and berry red, Forum
display headlines (Cyrillic), Manrope body, one Great Vibes script line. Hero: a night sky with falling snow, the DEER
deer drawing itself in gold, a countdown to New Year in Ulaanbaatar time, swaying polaroid photos with gift-tag prices
and a moving knit band. Delivery is everywhere: a ticker, the hero, a section right after the hero, every product page,
checkout zone cards, footer, /info. Pages: home (New Year shelf, gift guide, gift cards, Gua Sar / Mongolian clothing,
couple sets, bestsellers, types, stores), shop (type, sub-type, women / men, New Year, knit, new, sale, in stock,
search, sort, pages), product (colour swatches switch the photo, sizes, pair partner, sale terms, delivery zones, knit
care), instant search, cart / checkout, order status, saved items, info. All animation stops under reduced motion.
