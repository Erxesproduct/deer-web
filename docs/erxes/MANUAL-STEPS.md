# DEER brand: erxes manual steps

Owner of every step below: **Terbish**, with the shop for credentials and decisions.

These steps happen in the erxes 3.0 admin (and at QPay / ebarimt.mn), not in code. The website reads the results
through the environment variables in `.env.example`. Never commit their values; set them in
**Vercel → deer-web → Settings → Environment Variables** and redeploy.

There is no erxes instance for this shop yet ("erxes 3.0: NOT SET"). Create the workspace first.

> **Security warning.** The public Zochil shop API for deer.mn returns the shop's **Pocket credentials** (client id,
> client secret, terminal id, invoice type), a **Facebook page token** and other keys to anyone who opens the site, plus
> the bank account used for QPay payouts. They were removed from the scraped data, never copied into this repository
> and never used. Ask the shop to **rotate the Pocket credentials** and the **Facebook page token**, and ask Zochil to
> stop exposing them.

| Task | Website | erxes / external (manual) |
| --- | --- | --- |
| [1.1] Products, categories, prices | done: 220 products, 1,042 variants (sizes, colours), 9 types, 24 sub-types, MNT prices, colour photos | import the CSVs (1.1) |
| [1.2] QPay | done: QPay invoice + status check through the erxes payment plugin | **blocked**: QPay merchant credentials, erxes payment method (1.2) |
| [1.3] eBarimt | done: person / company choice, registry number validated | **blocked**: PosAPI registration, TIN; receipts are issued by erxes (1.3) |
| [1.4] Delivery, fees, statuses | done: Төвийн бүс 10,000₮ (free over 200,000₮), Алслагдсан бүс 15,000₮ (free over 300,000₮), next day 8–24 h, status list | delivery products, pipeline stages; **countryside** (1.4) |
| [1.5] Full journey test | validation verified (`npm run test:order`, 35 checks) | **blocked**: a real order needs the env vars and 1.2 / 1.3 (1.5) |

---

## 1.1 Products, categories, prices

Source: deer.mn (Zochil shop 2866), read 2026-11-20: **220 enabled products**, **1,042 variants** (194 products have
sizes or colours), MNT prices 11,400₮–790,000₮, product and colour photos, the shop's logo, «Winter Dream» banner,
«Gua Sar» campaign photo, FAQ, about text, two branches. Facebook page: DEER brand.

- Types follow what the shop sells: **Бэлгийн карт** (4), **Малгай, ороолт** (28), **Монгол хувцас** (45), **Гадуур
  хувцас** (20), **Багц, хослол** (7), **Даашинз** (11), **Өмд, юбка** (34), **Хантааз, майк** (15), **Цамц,
  свитер** (56). They come from the shop's own Zochil categories, sub-types from its sub-categories, then from the name.
- **Women / men** come from the shop's «Эмэгтэй» / «Эрэгтэй» category trees. **Knit** from its «Сүлжмэл» tree.
  **New Year** (54): gift cards, New Year words in the name (Christmas, Winter dream, party, sequin, hats and scarves…), products added
  2025-11-14 to 2025-12-31 (last New Year's collection) and this autumn's cashmere. **Lunar New Year**: Mongolian
  clothing. **Couple sets**: the shop's «Хос» category. Nothing is guessed beyond that.
- Sale prices: 105 products have a Zochil «before» price. The current Zochil campaign is «BLACK FRIDAY» (open question 6).
- Stock: Zochil counts stock per product (variants share it); 784 variants have a count, 66 are at 0 (sold out).
- Old Zochil URLs (`/products/<category>/<id>`, categories, `/about`, `/faq`, posts…) redirect to the new pages.

Steps:

1. Run `npm run export:erxes` (already run; files in `docs/erxes/`).
2. **Products & Services → Categories → Import**: `deer-categories.csv` (DR → types → sub-types → DR-DELIVERY).
3. **Products & Services → Import**: `deer-products.csv`. One row per variant, code `DR-<productId>` or
   `DR-<productId>-<variantId>` (the same id the website sends with every order line), unit price and price before
   sale in MNT, gender, knit / cashmere / New Year / Lunar New Year flags, options (Өнгө, Хэмжээ).
4. Spot-check 10 products (price, size, colour) against deer.mn.
5. Gift cards (100,000₮–250,000₮) are sold as products. How they are redeemed (online code or in store) is open
   question 5; until then the card is handed over at the branch.

## 1.2 Payment (QPay)

Zochil rule: 100% payment confirms the order, then it is delivered. Zochil has QPay (qpay2, Khan) on, but its checkout
status is not enabled. The website:

- records the order in erxes first, then creates a QPay invoice with the erxes payment plugin (`generateInvoiceUrl`,
  public). The customer pays on the erxes payment page and returns to `/order/<reference>`, which asks `invoicesCheck`
  every 5 s.
- never asks for money for an order staff cannot see. Pocket and MonPay are not offered (exposed credentials must be
  rotated first, and they are not part of this brief).

Steps:

1. Get the shop's own QPay merchant credentials (`client_id`, `client_secret`, `invoice_code`) (open question 3).
2. **Settings → Payments → Add → QPay (v2)**: enter them. Make a 100₮ test invoice in erxes.
3. Copy the payment method's `_id` into Vercel as `ERXES_PAYMENT_IDS`.
4. **Not yet tested** against a real QPay merchant. Do not call payments working until step 2 and 1.5 pass.

## 1.3 eBarimt

The website never makes a receipt. The checkout asks «Хувь хүн» or «Байгууллага» (7-digit registry number, checked on
the server) and writes it on the order. The receipt is issued in erxes by staff after payment. (Today the shop's FAQ
asks customers to send a payment screenshot in page chat to get an eBarimt; with erxes this is no longer needed.)

1. Collect from the shop: Цаст Согоот ХХК TIN, district code, VAT status, product classification codes (clothing,
   knitwear, hats, gift cards: a gift card is usually not a sale until it is redeemed; ask the accountant).
2. Register for **PosAPI 3.0** (ebarimt.mn) and install the PosAPI service.
3. **Settings → eBarimt**: PosAPI URL, TIN, district code, VAT switches; assign it to the website pipeline.
4. For every paid order: issue the receipt once (goods + delivery fee) and send the lottery number.

## 1.4 Delivery zones, fees and order statuses

Website (done), from the two Zochil delivery options, delivery rule, terms and FAQ:

| Zochil | Website |
| --- | --- |
| «Төвийн бүс» **10,000₮**, limit 200,000₮: west 1-р хороолол, east Офицер, north Баянбүрд, south Зайсан | 10,000₮; **free when the goods come to more than 200,000₮** (exactly 200,000₮ still pays) |
| «Алслагдсан бүс» **15,000₮**, limit 300,000₮: Яармаг, Ботаник, Таван шар, Орбит, 5 буудал, Хайлааст, Дарь эх | 15,000₮; free over 300,000₮ |
| Delivery rule: next day after confirmation, 8–24 h, by a delivery company, no timed delivery | shown in the ticker, hero, home, every product page, checkout, /info and the order note |
| Terms + FAQ: no returns on sale items; full-price items exchanged within 24 h at a branch, tags on, no stains or smells | required checkbox at checkout; /info; product page (sale items get a warning) |
| Countryside switch on, no option or fee | not offered online; call 7014-1889 first (open question 1) |

The customer picks the zone at checkout; the server checks it and computes the fee itself.

erxes:

1. Import `docs/erxes/deer-delivery.csv`: `DR-DELIVERY-CENTER` 10,000₮ and `DR-DELIVERY-FAR` 15,000₮.
2. **Sales → Boards → «Онлайн захиалга» → pipeline «Вэбсайт»**, stages (as on the website):
   Төлбөр хүлээгдэж байна → Баталгаажсан → Бэлэг шиг савлаж байна → Хүргэлтэд гарсан → Хүргэгдсэн, plus Цуцлагдсан.
3. **Frontline → Forms → (order form) → Settings**: create a sales card in «Төлбөр хүлээгдэж байна» for every
   submission. Staff move it to «Баталгаажсан» when the QPay invoice shows paid. The order text carries the zone.
