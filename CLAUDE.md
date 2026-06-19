# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Hebrew/RTL static e-commerce site for **Elecom (אלקום)**, a real Israeli home-electronics retailer. Everything lives in `mashraki store/`. No build step, no framework, no dependencies — plain HTML/CSS/vanilla JS served statically.

## Development

```bash
# Serve locally (run from the project directory)
cd "mashraki store" && python3 -m http.server 8000

# Validate JS syntax (there is no test suite — node --check is the check)
for f in data cart a11y main; do node --check "mashraki store/assets/js/$f.js"; done

# Smoke-test every page responds 200
for f in index products product cart checkout about contact login accessibility privacy; do
  curl -so /dev/null -w "%{http_code}  $f.html\n" "http://localhost:8000/${f}.html"
done
```

There is no linter or test runner. "Passing" means: all 4 JS files pass `node --check`, every page returns 200, and `PRODUCTS.every(p => p.img)` is true.

## Architecture

**Four JS files, loaded in this order on every page:**
1. `data.js` — pure data globals (no IIFE; intentionally global): `CATEGORIES` (7 keys incl. empty `scooters` to match the real 8-cat nav), `SUBCATEGORIES`, `SUBIMAGES` (sub → stock photo), `REVIEWS` (6), `ICONS` (inline category SVGs), `PRODUCTS` (118). Two post-processing IIFEs run at the bottom: `assignProductImages()` sets each `img` (keyword → `SUBIMAGES[sub]` → existing); `enrichProducts()` derives the **optional** fields the UI renders when present — `brand` (from name), `specs[]` ({label,value}), `stock` (`in`/`low`/`out`), `rating` ({avg,count}), and a fuller 2-sentence `desc`. **`specs`/`stock`/`rating` are deterministic PLACEHOLDERS** (seeded by id), not real data — replace at launch.
2. `cart.js` — IIFE exposing `window.Cart` (get/add/setQty/remove/total/`mediaHTML`/`iconHTML`/`productById`/`formatPrice`). Cart persisted in `localStorage('elecom_cart')`; `[data-cart-count]` badges auto-sync via `onChange`.
3. `a11y.js` — IIFE that self-injects the IS 5568 accessibility widget (floating FAB + panel). State in `localStorage('elecom_a11y')`, applied as classes on `<html>`.
4. `main.js` — IIFE with all page init functions, each guarded (`if (!el) return`) so the one file no-ops where a feature is absent. All booted in a single `DOMContentLoaded` listener at the bottom — **add new init calls there**. Feature flag `window.ELECOM = { PAYMENTS_ENABLED: false }` gates the checkout payment form.

**Data-driven pages (no per-product/per-category HTML):**
- `product.html` is a single template; `initProductPage()` reads `?id=<product-id>`, looks it up in `PRODUCTS`, and renders details + related items. Cards link here via `product.html?id=`.
- `products.html` catalog + filters render from `PRODUCTS`; supports `?cat=`, `?sub=`, `?brand=`, and `?q=` query params. A `[data-filter-notice]` element shows active sub/brand deep-links.
- The nav mega-dropdown (`[data-cat-dropdown]`) and the products filter-bar sub-menus are populated at runtime by `initCategoryMenu()` from `CATEGORIES`/`SUBCATEGORIES`/`ICONS`. **Never hand-write category/sub-category links in HTML.**
- `cardHTML()` and `initProductPage()` render `brand` (as a `?brand=` link), `rating` stars, `stock` badge, `specs` table, a visual payment/installments strip, and `reviewsSection()` — all only when the optional fields are present.

**CSS:** single `assets/css/styles.css`, CSS custom properties for theming. Dark mode via `[data-theme="dark"]` on `<html>`; a11y states via `a11y-*` classes on `<html>`. RTL-native throughout using logical properties (`margin-inline`, `inset-inline`, etc.) — avoid `left`/`right`.

**Images:** product photos in `assets/img/products/` are clear Unsplash-licensed stock, one per product type, mapped by sub-category (not exact manufacturer shots — see `data/image-credits.md`). Category banner/logo images (`media_*.png`, `BN_*`) live in `assets/img/` and feed the hero carousel. `mediaHTML()` emits `<img onerror=...>` that falls back to the category SVG icon if a file 404s.

**`data/`** holds the scraped reference data (products, categories, hours, reviews, image credits) — a snapshot fallback if the source site goes down. `products.json` is regenerated from the live `PRODUCTS` array.

**localStorage keys:** `elecom_cart`, `elecom_theme` (`light`/`dark`), `elecom_a11y`, `elecom_user` (mock session `{name,email,provider}`).

**Theme flash prevention:** an inline `<script>` in every `<head>` sets `data-theme` from `elecom_theme`/`prefers-color-scheme` before render.

**Site config & launch hooks:** `window.ELECOM` in `main.js` is the single config object — `PAYMENTS_ENABLED`, `BUSINESS_ID`, `SHIPPING_FEE`, `DELIVERY_DAYS`, `RETURN_DAYS`, `WHATSAPP` — with empty values marked `// TODO: fill in launch phase`. `processPayment()` is a deliberate empty stub (the future Tranzila/PayPlus/Cardcom integration point). `initWhatsApp()` only renders the floating button when `WHATSAPP` is set. `terms.html`/`returns.html`/`shipping.html` are content stubs (h1 + `<!-- TODO -->`); `privacy.html`/`accessibility.html` have real content plus the same TODO marker.

## Conventions

- The shared header/footer is duplicated across all 14 HTML pages (no templating) — when editing nav/footer, apply the change to every page. `[data-account]`, `[data-cat-dropdown]`, `[data-cart-count]`, `[data-payment]`, `[data-privacy-check]` are the hooks every relevant page must keep.
- `body.home` is on `index.html` only (drives `.home .search` sizing).
- Privacy consent: login and checkout forms include a `[data-privacy-check]` checkbox; `initAuth()` and `initForms()` block submit/Google-login until it's checked.
- `PAYMENTS_ENABLED: false` is the single toggle for the payment section — change it in `main.js`, not HTML.
- Adding products: append to `PRODUCTS` in `data.js` with `{id, name, category, sub, price, desc}` (omit `img`/`brand`/`specs`/`stock`/`rating` — the enrichment IIFEs derive them). New sub-categories need a `SUBCATEGORIES` entry, a `SUBIMAGES` photo, and ideally a `SPEC_TEMPLATES` entry in `enrichProducts()`.
- After data changes, regenerate `data/products.json` from `PRODUCTS` (one-off node script).

## Store facts (for content)

- **Founded:** 1968 · **Address:** רחוב סוקולוב 70, הרצליה · **Phone:** 09-9540475 · **Email:** elecom9555@gmail.com
- Hours: ראשון–חמישי 08:30–13:30 & 16:00–19:00, **except** Monday & Friday 08:30–14:00; Shabbat closed.
- Login is a UI mock only (localStorage, no real OAuth/backend). No real payment processing.
- Don't invent products — the catalog mirrors the real elecom.co.il site. The `scooters` category exists in the nav (to match the real 8-category site) but has **0 products** until real ones are added.
