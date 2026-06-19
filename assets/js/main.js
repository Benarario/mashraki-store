/* ==========================================================================
   main.js — theme, nav, search, catalog/cart/checkout rendering,
   form validation. Every block is guarded so one file works on all pages.
   Depends on data.js + cart.js.
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   * Site config — single source of truth, read by every page.
   * The empty/null values below are PLACEHOLDERS filled in the launch phase.
   * ------------------------------------------------------------------ */
  window.ELECOM = {
    PAYMENTS_ENABLED: false, // keep false until a real gateway is integrated
    BUSINESS_ID: "",         // TODO: fill in launch phase (ח.פ. / עוסק מורשה)
    SHIPPING_FEE: null,      // TODO: fill in launch phase (₪, number)
    DELIVERY_DAYS: null,     // TODO: fill in launch phase (business days)
    RETURN_DAYS: 14,         // TODO: confirm in launch phase (legal default 14)
    WHATSAPP: "",            // TODO: fill in launch phase (intl digits, e.g. 9725XXXXXXXX)
  };

  /* Payment integration point — STUB ONLY. Do not implement in this phase. */
  function processPayment(/* order */) {
    /* TODO: integrate an Israeli payment gateway — Tranzila / PayPlus / Cardcom.
       Do not implement yet. Wire this up only once PAYMENTS_ENABLED is true and
       BUSINESS_ID is set. Kept here so the future integration point is obvious. */
  }

  const $ = function (s, c) { return (c || document).querySelector(s); };
  const $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Shared UI helpers: stock badge + star rating ---------- */
  const STOCK_LABEL = { in: "במלאי", low: "מלאי אחרון", out: "אזל מהמלאי" };
  function stockBadgeHTML(p) {
    if (!p || !p.stock || !STOCK_LABEL[p.stock]) return "";
    return '<span class="stock-badge stock-badge--' + p.stock + '">' + STOCK_LABEL[p.stock] + "</span>";
  }
  function ratingHTML(p) {
    if (!p || !p.rating || !p.rating.avg) return "";
    const avg = p.rating.avg, full = Math.floor(avg), half = (avg - full) >= 0.5;
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += '<span class="star' + (i <= full ? " is-full" : (i === full + 1 && half ? " is-half" : "")) + '" aria-hidden="true">★</span>';
    }
    return '<span class="rating" title="' + avg + ' מתוך 5">' +
      '<span class="rating__stars">' + stars + "</span>" +
      '<span class="rating__meta">' + avg.toFixed(1) + " (" + p.rating.count + ")</span>" +
      "</span>";
  }

  /* ---------- Theme toggle ---------- */
  function initTheme() {
    const root = document.documentElement;
    if (!root.getAttribute("data-theme")) {
      const pref = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.setAttribute("data-theme", localStorage.getItem("elecom_theme") || pref);
    }
    function label() {
      const dark = root.getAttribute("data-theme") === "dark";
      $$("[data-theme-toggle]").forEach(function (b) {
        b.setAttribute("aria-label", dark ? "מעבר למצב בהיר" : "מעבר למצב כהה");
        b.setAttribute("aria-pressed", String(dark));
      });
    }
    $$("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("elecom_theme", next);
        label();
      });
    });
    label();
  }

  /* ---------- Mobile nav ---------- */
  function initNav() {
    const toggle = $("[data-nav-toggle]");
    const list = $("[data-nav-list]");
    if (!toggle || !list) return;
    toggle.addEventListener("click", function () {
      const open = list.getAttribute("data-open") === "true";
      list.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
    list.addEventListener("click", function (e) {
      if (e.target.closest("a")) { list.removeAttribute("data-open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---------- Search -> products page ---------- */
  function initSearch() {
    $$("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const q = (form.querySelector("input").value || "").trim();
        window.location.href = "products.html" + (q ? "?q=" + encodeURIComponent(q) : "");
      });
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() { $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); }); }

  /* ---------- Toast feedback ---------- */
  let toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      toastEl.style.cssText = "position:fixed;inset-block-end:1.5rem;inset-inline-start:50%;transform:translateX(50%);background:var(--color-success);color:#fff;padding:.7rem 1.2rem;border-radius:8px;box-shadow:var(--shadow-lg);z-index:200;font-weight:600;opacity:0;transition:opacity .2s;pointer-events:none";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.opacity = "1";
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.style.opacity = "0"; }, 1800);
  }

  /* ---------- Product card markup ---------- */
  function cardHTML(p) {
    const tag = p.tag ? '<span class="product-card__tag">' + p.tag + "</span>" : "";
    const href = "product.html?id=" + encodeURIComponent(p.id);
    const rating = ratingHTML(p);
    const stock = stockBadgeHTML(p);
    const soldOut = p.stock === "out";
    return '<article class="product-card" data-category="' + p.category + '">' +
      '<a class="product-card__media" href="' + href + '" aria-label="' + p.name + '">' + tag + window.Cart.mediaHTML(p) + (stock ? '<span class="product-card__stock">' + stock + "</span>" : "") + "</a>" +
      '<div class="product-card__body">' +
        '<span class="product-card__cat">' + CATEGORIES[p.category] + "</span>" +
        '<h3 class="product-card__name"><a href="' + href + '">' + p.name + "</a></h3>" +
        (rating ? '<div class="product-card__rating">' + rating + "</div>" : "") +
        '<p class="product-card__desc">' + p.desc + "</p>" +
        '<div class="product-card__foot">' +
          '<span class="price">' + window.Cart.formatPrice(p.price) + "</span>" +
          (soldOut
            ? '<button class="btn btn--ghost btn--sm" disabled>אזל מהמלאי</button>'
            : '<button class="btn btn--primary btn--sm" data-add="' + p.id + '">הוסף לסל</button>') +
        "</div>" +
      "</div></article>";
  }

  /* ---------- Add-to-cart (delegated, works everywhere) ---------- */
  function initAddToCart() {
    document.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-add]");
      if (!btn) return;
      const p = window.Cart.productById(btn.getAttribute("data-add"));
      window.Cart.add(btn.getAttribute("data-add"), 1);
      toast(p ? "נוסף לסל: " + p.name : "המוצר נוסף לסל");
    });
  }

  /* ---------- Home: featured products ---------- */
  function initFeatured() {
    const host = $("[data-featured]");
    if (!host) return;
    const featured = PRODUCTS.filter(function (p) { return p.tag; }).slice(0, 8);
    host.innerHTML = featured.map(cardHTML).join("");
  }

  /* ---------- Products page: grid + filter + search ---------- */
  function initCatalog() {
    const grid = $("[data-catalog]");
    if (!grid) return;
    const params = new URLSearchParams(window.location.search);
    let activeCat = params.get("cat") || "all";
    let query = (params.get("q") || "").trim().toLowerCase();
    const sub = (params.get("sub") || "").trim();      // deep-link from nav sub-categories
    const brand = (params.get("brand") || "").trim();  // deep-link from a product's brand

    const countEl = $("[data-results]");
    const searchInput = $("[data-catalog-search]");
    if (searchInput && query) searchInput.value = params.get("q");

    /* Show an active deep-link filter (sub or brand) with a clear option. */
    const noticeEl = $("[data-filter-notice]");
    if (noticeEl && (sub || brand)) {
      noticeEl.innerHTML = 'מסננים לפי: <strong>' + (brand || sub) + "</strong> " +
        '<a href="products.html">ניקוי סינון ✕</a>';
      noticeEl.hidden = false;
    }

    function matches(p) {
      const okCat = activeCat === "all" || p.category === activeCat;
      const okSub = !sub || p.sub === sub;
      const okBrand = !brand || p.brand === brand;
      const okQ = !query || (p.name + " " + p.desc + " " + (p.brand || "") + " " + CATEGORIES[p.category]).toLowerCase().indexOf(query) !== -1;
      return okCat && okSub && okBrand && okQ;
    }
    function render() {
      const list = PRODUCTS.filter(matches);
      grid.innerHTML = list.length ? list.map(cardHTML).join("")
        : '<p class="muted text-center">לא נמצאו מוצרים תואמים. נסו חיפוש אחר.</p>';
      if (countEl) countEl.textContent = list.length + " מוצרים";
      $$("[data-cat]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === activeCat));
      });
    }
    $$("[data-cat]").forEach(function (b) {
      b.addEventListener("click", function () { activeCat = b.getAttribute("data-cat"); render(); });
    });
    if (searchInput) {
      searchInput.addEventListener("input", function () { query = searchInput.value.trim().toLowerCase(); render(); });
    }
    render();
  }

  /* ---------- Cart page ---------- */
  function initCartPage() {
    const host = $("[data-cart-page]");
    if (!host) return;
    function render() {
      const items = window.Cart.items();
      const listEl = $("[data-cart-list]");
      const summaryEl = $("[data-cart-summary]");
      if (!items.length) {
        host.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>' +
          '<h2>הסל ריק</h2><p class="muted">עדיין לא הוספתם מוצרים לסל הקניות.</p>' +
          '<a class="btn btn--primary" href="products.html">למעבר לחנות</a></div>';
        return;
      }
      listEl.innerHTML = items.map(function (it) {
        const p = it.product;
        return '<div class="cart-item" data-id="' + p.id + '">' +
          '<div class="cart-item__media">' + window.Cart.mediaHTML(p) + "</div>" +
          '<div class="cart-item__info"><h3>' + p.name + "</h3>" +
            '<span class="muted">' + CATEGORIES[p.category] + "</span><br>" +
            '<span class="price">' + window.Cart.formatPrice(p.price) + "</span></div>" +
          '<div class="cart-item__controls">' +
            '<div class="qty" role="group" aria-label="כמות עבור ' + p.name + '">' +
              '<button type="button" data-dec aria-label="הפחתת כמות">−</button>' +
              '<span data-qty>' + it.qty + "</span>" +
              '<button type="button" data-inc aria-label="הוספת כמות">+</button>' +
            "</div>" +
            '<button type="button" class="link-danger" data-remove>הסרה</button>' +
          "</div></div>";
      }).join("");

      const total = window.Cart.total();
      const shipping = total >= 400 || total === 0 ? 0 : 39;
      summaryEl.innerHTML =
        '<h2>סיכום הזמנה</h2>' +
        '<div class="summary__row"><span>סכום ביניים</span><span>' + window.Cart.formatPrice(total) + "</span></div>" +
        '<div class="summary__row"><span>משלוח</span><span>' + (shipping ? window.Cart.formatPrice(shipping) : "חינם") + "</span></div>" +
        '<div class="summary__row summary__row--total"><span>סה"כ לתשלום</span><span>' + window.Cart.formatPrice(total + shipping) + "</span></div>" +
        '<a class="btn btn--primary btn--block" href="checkout.html" style="margin-top:1rem">המשך לתשלום</a>' +
        (total < 400 ? '<p class="form-note" style="margin-top:.5rem">הוסיפו עוד ' + window.Cart.formatPrice(400 - total) + " וקבלו משלוח חינם!</p>" : "");
    }
    host.addEventListener("click", function (e) {
      const row = e.target.closest("[data-id]");
      if (!row) return;
      const id = row.getAttribute("data-id");
      const cur = window.Cart.get()[id] || 0;
      if (e.target.closest("[data-inc]")) window.Cart.setQty(id, cur + 1);
      else if (e.target.closest("[data-dec]")) window.Cart.setQty(id, cur - 1);
      else if (e.target.closest("[data-remove]")) window.Cart.remove(id);
    });
    window.Cart.onChange(render);
    render();
  }

  /* ---------- Checkout page ---------- */
  function initCheckout() {
    const summary = $("[data-checkout-summary]");
    if (!summary) return;
    function render() {
      const items = window.Cart.items();
      if (!items.length) {
        summary.innerHTML = '<p class="muted">הסל ריק. <a href="products.html">חזרה לחנות</a></p>';
        return;
      }
      const total = window.Cart.total();
      const shipping = total >= 400 ? 0 : 39;
      summary.innerHTML = '<h2>ההזמנה שלי</h2>' +
        items.map(function (it) {
          return '<div class="summary__row"><span>' + it.product.name + " × " + it.qty + "</span><span>" + window.Cart.formatPrice(it.lineTotal) + "</span></div>";
        }).join("") +
        '<div class="summary__row"><span>משלוח</span><span>' + (shipping ? window.Cart.formatPrice(shipping) : "חינם") + "</span></div>" +
        '<div class="summary__row summary__row--total"><span>סה"כ</span><span>' + window.Cart.formatPrice(total + shipping) + "</span></div>";
    }
    window.Cart.onChange(render);
    render();

    /* Payment area — gated behind the feature flag. */
    const payHost = $("[data-payment]");
    if (payHost) {
      if (window.ELECOM.PAYMENTS_ENABLED) {
        payHost.innerHTML =
          '<h2>פרטי תשלום</h2>' +
          '<div class="form-grid"><div class="field"><label for="cc">מספר כרטיס אשראי</label><input id="cc" inputmode="numeric" placeholder="0000 0000 0000 0000"></div>' +
          '<div class="cols-2 form-grid"><div class="field"><label for="exp">תוקף</label><input id="exp" placeholder="MM/YY"></div>' +
          '<div class="field"><label for="cvv">CVV</label><input id="cvv" inputmode="numeric" placeholder="123"></div></div></div>';
      } else {
        payHost.innerHTML =
          '<div class="pay-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>' +
          '<h3>התשלום המקוון יופעל בקרוב</h3>' +
          '<p>כרגע ניתן להשלים את ההזמנה ונציג יחזור אליכם לתיאום תשלום ומשלוח.</p></div>';
      }
    }
  }

  /* ---------- Form validation (contact + checkout details) ---------- */
  function setError(field, msg) {
    const input = field.querySelector("input, textarea, select");
    const err = field.querySelector(".error-msg");
    if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err) err.textContent = msg || "";
    return !msg;
  }
  function initForms() {
    $$("[data-validate]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        let ok = true;
        $$(".field", form).forEach(function (field) {
          const input = field.querySelector("input, textarea, select");
          if (!input || !input.required) return;
          const val = (input.value || "").trim();
          let msg = "";
          if (!val) msg = "שדה חובה";
          else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = "כתובת אימייל לא תקינה";
          else if (input.type === "tel" && !/^[0-9\-+\s]{7,}$/.test(val)) msg = "מספר טלפון לא תקין";
          if (!setError(field, msg)) ok = false;
        });
        /* Privacy policy consent (checkout) */
        const privacyCb = form.querySelector("[data-privacy-check]");
        if (privacyCb && !privacyCb.checked) {
          const pErr = privacyCb.closest(".privacy-check");
          if (pErr) {
            const errEl = pErr.querySelector(".error-msg");
            if (errEl) errEl.textContent = "יש לאשר את תנאי השימוש ומדיניות הפרטיות להמשך";
          }
          ok = false;
        } else if (privacyCb) {
          const pErr = privacyCb.closest(".privacy-check");
          if (pErr) { const errEl = pErr.querySelector(".error-msg"); if (errEl) errEl.textContent = ""; }
        }
        if (!ok) { const bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }

        const success = form.querySelector("[data-success]");
        if (form.hasAttribute("data-checkout-form")) {
          window.Cart.clear();
          if (success) success.textContent = "ההזמנה התקבלה! נחזור אליכם בהקדם לתיאום תשלום ומשלוח. תודה שקניתם באלקום.";
        } else if (success) {
          success.textContent = "הפנייה נשלחה בהצלחה! נחזור אליכם בהקדם.";
        }
        if (success) { success.hidden = false; success.focus(); }
        form.reset();
      });
    });
  }

  /* ---------- Home: hero image carousel ---------- */
  function initHeroCarousel() {
    const car = $(".hero-carousel");
    if (!car) return;
    const imgs = $$("img", car);
    if (imgs.length < 2) { if (imgs[0]) imgs[0].classList.add("is-active"); return; }
    const dotsWrap = $(".hero-carousel__dots", car);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let i = 0, timer = null;
    function show(n) {
      i = (n + imgs.length) % imgs.length;
      imgs.forEach(function (im, idx) { im.classList.toggle("is-active", idx === i); });
      if (dotsWrap) $$("button", dotsWrap).forEach(function (d, idx) { d.setAttribute("aria-current", String(idx === i)); });
    }
    if (dotsWrap) {
      dotsWrap.innerHTML = imgs.map(function (_, idx) {
        return '<button type="button" aria-label="תמונה ' + (idx + 1) + '"' + (idx === 0 ? ' aria-current="true"' : "") + "></button>";
      }).join("");
      $$("button", dotsWrap).forEach(function (d, idx) { d.addEventListener("click", function () { show(idx); restart(); }); });
    }
    function start() { if (!reduce) timer = setInterval(function () { show(i + 1); }, 4000); }
    function restart() { clearInterval(timer); start(); }
    show(0); start();
    car.addEventListener("mouseenter", function () { clearInterval(timer); });
    car.addEventListener("mouseleave", start);
  }

  /* ---------- Home: rolling reviews cube ---------- */
  function initReviewCube() {
    const cube = $(".cube");
    if (!cube || typeof REVIEWS === "undefined") return;
    const order = ["front", "right", "back", "left"];
    const dots = $(".cube-dots");
    const len = REVIEWS.length;
    let step = 0, timer = null;
    function faceByName(n) { return cube.querySelector(".cube__face--" + n); }
    function fill(faceEl, r) {
      if (!faceEl) return;
      faceEl.querySelector("blockquote").textContent = r.text;
      faceEl.querySelector("cite").textContent = r.name;
    }
    function curIndex() { return ((step % len) + len) % len; }
    order.forEach(function (n, idx) { fill(faceByName(n), REVIEWS[idx % len]); });
    if (dots) {
      dots.innerHTML = REVIEWS.map(function (_, idx) {
        return '<button type="button" aria-label="ביקורת ' + (idx + 1) + '"' + (idx === 0 ? ' aria-current="true"' : "") + "></button>";
      }).join("");
      $$("button", dots).forEach(function (d, idx) {
        d.addEventListener("click", function () { go(step + ((idx - curIndex() + len) % len || len)); restart(); });
      });
    }
    function go(s) {
      const faceEl = faceByName(order[((s % 4) + 4) % 4]);
      fill(faceEl, REVIEWS[((s % len) + len) % len]);
      cube.style.transform = "translateZ(-130px) rotateY(" + (-90 * s) + "deg)";
      step = s;
      if (dots) $$("button", dots).forEach(function (d, idx) { d.setAttribute("aria-current", String(idx === curIndex())); });
    }
    function start() { timer = setInterval(function () { go(step + 1); }, 4500); }
    function restart() { clearInterval(timer); start(); }
    $$("[data-cube-prev]").forEach(function (b) { b.addEventListener("click", function () { go(step - 1); restart(); }); });
    $$("[data-cube-next]").forEach(function (b) { b.addEventListener("click", function () { go(step + 1); restart(); }); });
    const scene = $(".cube-scene");
    if (scene) {
      scene.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { go(step - 1); restart(); }
        else if (e.key === "ArrowLeft") { go(step + 1); restart(); }
      });
      scene.addEventListener("mouseenter", function () { clearInterval(timer); });
      scene.addEventListener("mouseleave", start);
    }
    start();
  }

  /* ---------- Category dropdown (mobile click-toggle; desktop uses CSS hover) ---------- */
  function initCategoryMenu() {
    if (typeof CATEGORIES === "undefined") return;
    /* Populate nav dropdown: each category gets its own column with sub-links. */
    $$("[data-cat-dropdown]").forEach(function (dd) {
      dd.innerHTML = Object.keys(CATEGORIES).map(function (key) {
        const icon = (typeof ICONS !== "undefined" && ICONS[key]) ? ICONS[key] : "";
        const subs = (typeof SUBCATEGORIES !== "undefined" && SUBCATEGORIES[key] && SUBCATEGORIES[key].length)
          ? '<ul class="nav-sub-list">' + SUBCATEGORIES[key].map(function (s) {
              return '<li><a href="products.html?cat=' + key + '&sub=' + encodeURIComponent(s) + '">' + s + '</a></li>';
            }).join("") + '</ul>'
          : "";
        return '<div class="nav-cat-col"><a href="products.html?cat=' + key + '" class="nav-cat-link">' +
          icon + "<span>" + CATEGORIES[key] + "</span></a>" + subs + "</div>";
      }).join("");
    });
    /* Mobile: click "כל המוצרים" toggles the dropdown. */
    $$(".has-dropdown").forEach(function (dd) {
      const trigger = dd.querySelector(":scope > a");
      const menu = dd.querySelector(".nav-dropdown");
      if (!trigger || !menu) return;
      trigger.addEventListener("click", function (e) {
        if (window.matchMedia("(max-width: 760px)").matches) {
          e.preventDefault();
          const open = menu.getAttribute("data-open") === "true";
          menu.setAttribute("data-open", String(!open));
          trigger.setAttribute("aria-expanded", String(!open));
        }
      });
    });
    /* Inject subcategory hover menus onto the filter buttons in the product catalog. */
    $$(".filter-bar [data-cat]").forEach(function (btn) {
      if (!btn || !typeof SUBCATEGORIES !== "undefined") return;
      const key = btn.getAttribute("data-cat");
      const subs = (typeof SUBCATEGORIES !== "undefined") ? SUBCATEGORIES[key] : null;
      if (!subs || !subs.length) return;
      const wrap = document.createElement("div");
      wrap.className = "filter-group";
      btn.parentNode.insertBefore(wrap, btn);
      wrap.appendChild(btn);
      const ul = document.createElement("ul");
      ul.className = "cat-subs";
      ul.setAttribute("role", "list");
      ul.innerHTML = subs.map(function (s) {
        return '<li><a href="products.html?cat=' + key + '&sub=' + encodeURIComponent(s) + '">' + s + '</a></li>';
      }).join("");
      wrap.appendChild(ul);
    });
  }

  /* ---------- Account / mock auth ---------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function getUser() { try { return JSON.parse(localStorage.getItem("elecom_user")); } catch (e) { return null; } }
  function setUser(u) { localStorage.setItem("elecom_user", JSON.stringify(u)); }
  function clearUser() { localStorage.removeItem("elecom_user"); }

  function renderAccount() {
    const user = getUser();
    $$("[data-account]").forEach(function (host) {
      if (user) {
        const initial = (user.name || "?").trim().charAt(0) || "?";
        host.innerHTML =
          '<div class="account-menu">' +
            '<button class="icon-btn" type="button" data-account-toggle aria-haspopup="true" aria-expanded="false" aria-label="החשבון שלי">' +
              '<span style="display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:var(--color-primary);color:#fff;font-weight:700">' + initial + '</span>' +
            '</button>' +
            '<div class="account-menu__panel">' +
              '<div class="account-menu__name">שלום, ' + user.name + '</div>' +
              '<div class="muted" style="padding:0 .5rem;font-size:var(--fs-300)">' + (user.email || "") + '</div>' +
              '<button class="btn btn--ghost" type="button" data-logout>התנתקות</button>' +
            '</div>' +
          '</div>';
      } else {
        host.innerHTML =
          '<a class="icon-btn" href="login.html" aria-label="התחברות לחשבון">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>' +
          '</a>';
      }
    });
  }

  function initAuth() {
    renderAccount();

    document.addEventListener("click", function (e) {
      const tog = e.target.closest("[data-account-toggle]");
      if (tog) {
        const p = tog.parentElement.querySelector(".account-menu__panel");
        const open = p.getAttribute("data-open") === "true";
        p.setAttribute("data-open", String(!open));
        tog.setAttribute("aria-expanded", String(!open));
        return;
      }
      if (e.target.closest("[data-logout]")) { clearUser(); window.location.href = "index.html"; return; }
      document.querySelectorAll('.account-menu__panel[data-open="true"]').forEach(function (p) {
        if (!p.closest(".account-menu").contains(e.target)) p.removeAttribute("data-open");
      });
    });

    const lf = $("[data-login-form]");
    if (lf) {
      lf.addEventListener("submit", function (e) {
        e.preventDefault();
        let ok = true;
        $$(".field", lf).forEach(function (field) {
          const input = field.querySelector("input");
          if (!input || !input.required) return;
          const val = (input.value || "").trim();
          let msg = "";
          if (!val) msg = "שדה חובה";
          else if (input.type === "email" && !EMAIL_RE.test(val)) msg = "כתובת אימייל לא תקינה";
          if (!setError(field, msg)) ok = false;
        });
        /* Privacy policy consent */
        const privacyCb = lf.querySelector("[data-privacy-check]");
        if (privacyCb && !privacyCb.checked) {
          const pErr = privacyCb.closest(".privacy-check");
          if (pErr) {
            const errEl = pErr.querySelector(".error-msg");
            if (errEl) errEl.textContent = "יש לאשר את מדיניות הפרטיות להמשך";
          }
          ok = false;
        } else if (privacyCb) {
          const pErr = privacyCb.closest(".privacy-check");
          if (pErr) { const errEl = pErr.querySelector(".error-msg"); if (errEl) errEl.textContent = ""; }
        }
        if (!ok) { const bad = lf.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }
        const email = lf.querySelector('input[type="email"]').value.trim();
        setUser({ name: email.split("@")[0], email: email, provider: "email" });
        window.location.href = "index.html";
      });
    }
    $$("[data-google-login]").forEach(function (b) {
      b.addEventListener("click", function () {
        const privacyCb = document.querySelector("[data-privacy-check]");
        if (privacyCb && !privacyCb.checked) {
          const pErr = privacyCb.closest(".privacy-check");
          if (pErr) {
            const errEl = pErr.querySelector(".error-msg");
            if (errEl) errEl.textContent = "יש לאשר את מדיניות הפרטיות להמשך";
          }
          privacyCb.focus();
          return;
        }
        setUser({ name: "משתמש Google", email: "google.user@gmail.com", provider: "google" });
        window.location.href = "index.html";
      });
    });
  }

  /* ---------- Single product page ---------- */
  function initProductPage() {
    const host = $("[data-product-page]");
    if (!host) return;
    const id = new URLSearchParams(window.location.search).get("id");
    const p = window.Cart.productById(id);

    if (!p) {
      host.innerHTML = '<div class="product-missing"><h1>המוצר לא נמצא</h1>' +
        '<p class="muted">ייתכן שהמוצר הוסר מהמלאי.</p>' +
        '<a class="btn btn--primary" href="products.html">חזרה לחנות</a></div>';
      return;
    }

    document.title = p.name + " — אלקום";
    const catLabel = CATEGORIES[p.category];
    const subBadge = p.sub ? '<span class="pd-badge pd-badge--sub">' + p.sub + "</span>" : "";
    const tag = p.tag ? '<span class="product-card__tag">' + p.tag + "</span>" : "";
    const soldOut = p.stock === "out";

    /* Spec rows: product specs (when present) + identity/availability rows. */
    const specRows = (p.specs && p.specs.length ? p.specs.slice() : []).map(function (s) { return [s.label, s.value]; });
    specRows.push(["מק\"ט", p.id.toUpperCase()]);
    if (p.brand) specRows.unshift(["מותג", p.brand]);

    const brandLink = p.brand
      ? ' · <a class="pd-brand" href="products.html?brand=' + encodeURIComponent(p.brand) + '">עוד מוצרי ' + p.brand + "</a>"
      : "";

    /* Payment-logos + installments strip — VISUAL ONLY, no real processing. */
    const payStrip =
      '<div class="pd-pay" aria-label="אמצעי תשלום">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
        '<span>תשלום מאובטח · עד 12 תשלומים</span>' +
        '<span class="pay-logos"><span>VISA</span><span>MasterCard</span><span>Amex</span><span>Diners</span></span>' +
      "</div>";

    host.innerHTML =
      '<nav class="breadcrumb" aria-label="מיקום"><a href="index.html">בית</a> / ' +
        '<a href="products.html?cat=' + p.category + '">' + catLabel + "</a>" +
        (p.sub ? ' / <a href="products.html?cat=' + p.category + '&sub=' + encodeURIComponent(p.sub) + '">' + p.sub + "</a>" : "") +
        " / <span>" + p.name + "</span></nav>" +
      '<div class="pd-grid">' +
        '<div class="pd-media">' + tag + window.Cart.mediaHTML(p) + "</div>" +
        '<div class="pd-info">' +
          '<div class="pd-badges">' + '<span class="pd-badge">' + catLabel + "</span>" + subBadge + "</div>" +
          "<h1>" + p.name + "</h1>" +
          '<div class="pd-subline">' + ratingHTML(p) + brandLink + "</div>" +
          '<div class="pd-stock">' + stockBadgeHTML(p) + "</div>" +
          '<p class="pd-price">' + window.Cart.formatPrice(p.price) + "</p>" +
          '<p class="pd-desc">' + p.desc + "</p>" +
          '<div class="pd-actions">' +
            (soldOut
              ? '<button class="btn btn--ghost btn--lg" disabled>אזל מהמלאי</button>'
              : '<button class="btn btn--primary btn--lg" data-add="' + p.id + '">הוספה לסל</button>') +
            '<a class="btn btn--ghost btn--lg" href="cart.html">מעבר לסל</a>' +
          "</div>" +
          payStrip +
          '<table class="pd-specs"><caption>מפרט טכני</caption><tbody>' +
            specRows.map(function (r) { return "<tr><th>" + r[0] + "</th><td>" + r[1] + "</td></tr>"; }).join("") +
          "</tbody></table>" +
        "</div>" +
      "</div>";

    /* Reviews block — the product's rating summary + a sample of global reviews. */
    host.appendChild(reviewsSection(p));

    /* Related products from the same sub-category (then category). */
    const related = PRODUCTS.filter(function (x) {
      return x.id !== p.id && (x.sub === p.sub || x.category === p.category);
    }).slice(0, 4);
    if (related.length) {
      const sec = document.createElement("section");
      sec.className = "section--tight";
      sec.innerHTML = '<h2>מוצרים נוספים בקטגוריה</h2><div class="product-grid">' +
        related.map(cardHTML).join("") + "</div>";
      host.appendChild(sec);
    }
  }

  /* Reusable review display: product rating summary + sample of global REVIEWS. */
  function reviewsSection(p) {
    const sec = document.createElement("section");
    sec.className = "section--tight reviews-block";
    const list = (typeof REVIEWS !== "undefined") ? REVIEWS : [];
    const sample = list.slice(0, 3);
    const summary = (p && p.rating)
      ? '<div class="reviews-summary"><span class="reviews-summary__avg">' + p.rating.avg.toFixed(1) + "</span>" +
        '<span class="reviews-summary__stars">' + ratingHTML(p) + "</span>" +
        '<span class="muted">מבוסס על ' + p.rating.count + " חוות דעת</span></div>"
      : "";
    sec.innerHTML = "<h2>חוות דעת לקוחות</h2>" + summary +
      '<div class="reviews-grid">' + sample.map(function (r) {
        return '<figure class="review-card"><blockquote>"' + r.text + '"</blockquote>' +
          "<figcaption>— " + r.name + "</figcaption></figure>";
      }).join("") + "</div>";
    return sec;
  }

  /* ---------- Floating WhatsApp button (hidden until a number is configured) ---------- */
  function initWhatsApp() {
    const num = (window.ELECOM.WHATSAPP || "").replace(/[^\d]/g, "");
    if (!num) return; // no number yet → don't render the button (launch phase fills WHATSAPP)
    const a = document.createElement("a");
    a.className = "whatsapp-fab";
    a.href = "https://wa.me/" + num;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "שיחה בוואטסאפ");
    a.innerHTML = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 3a13 13 0 0 0-11 19.7L3 29l6.5-1.7A13 13 0 1 0 16 3zm0 2.4a10.6 10.6 0 0 1 8.9 16.4 10.6 10.6 0 0 1-13.6 3.9l-.5-.3-3.8 1 1-3.7-.3-.5A10.6 10.6 0 0 1 16 5.4zm-3.8 5.2c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.4 3.6 1.5 3.9c.2.3 2.7 4.3 6.7 5.8 3.3 1.3 4 1 4.7.9.7 0 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5-.4-.2-2.2-1.1-2.6-1.2-.4-.1-.6-.2-.9.2-.3.4-1 1.2-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.4-.7.1-.3 0-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.7-.6-.6-.8-.6h-.7z"/></svg>';
    document.body.appendChild(a);
  }

  /* ---------- Secure-checkout / card-logos trust badge (visual only) ---------- */
  function initCheckoutTrust() {
    const summary = $("[data-checkout-summary]");
    if (!summary) return;
    const badge = document.createElement("div");
    badge.className = "secure-badge";
    badge.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
      '<div><strong>תשלום מאובטח</strong><span class="pay-logos"><span>VISA</span><span>MasterCard</span><span>Amex</span><span>Diners</span></span></div>';
    summary.insertAdjacentElement("afterend", badge);
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); initNav(); initSearch(); initYear(); initAddToCart();
    initFeatured(); initCatalog(); initCartPage(); initCheckout(); initForms();
    initHeroCarousel(); initReviewCube(); initCategoryMenu(); initAuth();
    initProductPage(); initWhatsApp(); initCheckoutTrust();
  });
})();
