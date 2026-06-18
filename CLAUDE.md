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
1. `data.js` — pure data globals (no IIFE; intentionally global): `CATEGORIES` (6 keys), `SUBCATEGORIES` (per-category Hebrew sub-labels), `SUBIMAGES` (sub-category → stock photo path), `REVIEWS` (6), `ICONS` (inline category SVGs), `PRODUCTS` (118). Ends with an IIFE `assignProductImages()` that sets each product's `img` from keyword overrides → `SUBIMAGES[sub]` → existing img.
2. `cart.js` — IIFE exposing `window.Cart` (get/add/setQty/remove/total/`mediaHTML`/`iconHTML`/`productById`/`formatPrice`). Cart persisted in `localStorage('elecom_cart')`; `[data-cart-count]` badges auto-sync via `onChange`.
3. `a11y.js` — IIFE that self-injects the IS 5568 accessibility widget (floating FAB + panel). State in `localStorage('elecom_a11y')`, applied as classes on `<html>`.
4. `main.js` — IIFE with all page init functions, each guarded (`if (!el) return`) so the one file no-ops where a feature is absent. All booted in a single `DOMContentLoaded` listener at the bottom — **add new init calls there**. Feature flag `window.ELECOM = { PAYMENTS_ENABLED: false }` gates the checkout payment form.

**Data-driven pages (no per-product/per-category HTML):**
- `product.html` is a single template; `initProductPage()` reads `?id=<product-id>`, looks it up in `PRODUCTS`, and renders details + related items. Cards link here via `product.html?id=`.
- `products.html` catalog + filters render from `PRODUCTS`; supports `?cat=` and `?sub=` query params.
- The nav mega-dropdown (`[data-cat-dropdown]`) and the products filter-bar sub-menus are populated at runtime by `initCategoryMenu()` from `CATEGORIES`/`SUBCATEGORIES`/`ICONS`. **Never hand-write category/sub-category links in HTML.**

**CSS:** single `assets/css/styles.css`, CSS custom properties for theming. Dark mode via `[data-theme="dark"]` on `<html>`; a11y states via `a11y-*` classes on `<html>`. RTL-native throughout using logical properties (`margin-inline`, `inset-inline`, etc.) — avoid `left`/`right`.

**Images:** product photos in `assets/img/products/` are clear Unsplash-licensed stock, one per product type, mapped by sub-category (not exact manufacturer shots — see `data/image-credits.md`). Category banner/logo images (`media_*.png`, `BN_*`) live in `assets/img/` and feed the hero carousel. `mediaHTML()` emits `<img onerror=...>` that falls back to the category SVG icon if a file 404s.

**`data/`** holds the scraped reference data (products, categories, hours, reviews, image credits) — a snapshot fallback if the source site goes down. `products.json` is regenerated from the live `PRODUCTS` array.

**localStorage keys:** `elecom_cart`, `elecom_theme` (`light`/`dark`), `elecom_a11y`, `elecom_user` (mock session `{name,email,provider}`).

**Theme flash prevention:** an inline `<script>` in every `<head>` sets `data-theme` from `elecom_theme`/`prefers-color-scheme` before render.

## Conventions

- The shared header/footer is duplicated across all 11 HTML pages (no templating) — when editing nav/footer, apply the change to every page. `[data-account]`, `[data-cat-dropdown]`, `[data-cart-count]` are the JS hooks every page must keep.
- `body.home` is on `index.html` only (drives `.home .search` sizing).
- Privacy consent: login and checkout forms include a `[data-privacy-check]` checkbox; `initAuth()` and `initForms()` block subm/Google-login until it's checked.
- `PAYMENTS_ENABLED: false` is the single toggle for the payment section — change it in `main.js`, not HTML.
- Adding products: append to `PRODUCTS` in `data.js` with `{id, name, category, sub, price, desc}` (omit `img` — `assignProductImages()` assigns one from `sub`). New sub-categories must be added to `SUBCATEGORIES` and given a `SUBIMAGES` entry.

## Store facts (for content)

- **Founded:** 1968 · **Address:** רחוב סוקולוב 70, הרצליה · **Phone:** 09-9540475 · **Email:** elecom9555@gmail.com
- Hours: ראשון–חמישי 08:30–13:30 & 16:00–19:00, **except** Monday & Friday 08:30–14:00; Shabbat closed.
- Login is a UI mock only (localStorage, no real OAuth/backend). No real payment processing.
- Don't invent products/categories — the catalog mirrors the real elecom.co.il site (which is why there is no "scooters" category despite the SVG icon existing).
