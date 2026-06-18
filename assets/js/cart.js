/* ==========================================================================
   Cart — shared state persisted in localStorage.
   Exposes window.Cart used by main.js, products, cart and checkout pages.
   Depends on data.js (PRODUCTS, ICONS, CATEGORIES).
   ========================================================================== */
(function () {
  "use strict";
  const KEY = "elecom_cart";
  const listeners = [];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function write(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
    listeners.forEach(function (fn) { fn(cart); });
  }

  function productById(id) {
    return (typeof PRODUCTS !== "undefined") ? PRODUCTS.find(function (p) { return p.id === id; }) : null;
  }
  function formatPrice(n) {
    return "₪" + Number(n).toLocaleString("he-IL");
  }
  /* Returns markup for a product image, falling back to the category SVG icon. */
  function mediaHTML(product) {
    if (product && product.img) {
      return '<img src="' + product.img + '" alt="' + product.name +
        '" loading="lazy" onerror="this.outerHTML=window.Cart.iconHTML(\'' + product.category + '\')">';
    }
    return iconHTML(product ? product.category : "");
  }
  function iconHTML(category) {
    return (typeof ICONS !== "undefined" && ICONS[category]) ? ICONS[category]
      : '<svg class="cat-icon-img" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><rect x="10" y="14" width="44" height="36" rx="4"/></svg>';
  }

  const Cart = {
    get: read,
    onChange: function (fn) { listeners.push(fn); },
    count: function () {
      const c = read(); return Object.keys(c).reduce(function (s, k) { return s + c[k]; }, 0);
    },
    items: function () {
      const c = read();
      return Object.keys(c).map(function (id) {
        const p = productById(id);
        if (!p) return null;
        return { product: p, qty: c[id], lineTotal: p.price * c[id] };
      }).filter(Boolean);
    },
    total: function () {
      return this.items().reduce(function (s, it) { return s + it.lineTotal; }, 0);
    },
    add: function (id, qty) {
      const c = read(); c[id] = (c[id] || 0) + (qty || 1); write(c);
    },
    setQty: function (id, qty) {
      const c = read();
      if (qty <= 0) { delete c[id]; } else { c[id] = qty; }
      write(c);
    },
    remove: function (id) { const c = read(); delete c[id]; write(c); },
    clear: function () { write({}); },
    productById: productById,
    formatPrice: formatPrice,
    mediaHTML: mediaHTML,
    iconHTML: iconHTML,
  };

  /* Keep every header cart badge in sync. */
  function syncBadges() {
    const n = Cart.count();
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = n;
      el.hidden = n === 0;
    });
  }
  Cart.onChange(syncBadges);
  document.addEventListener("DOMContentLoaded", syncBadges);

  window.Cart = Cart;
})();
