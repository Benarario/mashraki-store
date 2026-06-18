/* ==========================================================================
   main.js — theme, nav, search, catalog/cart/checkout rendering,
   form validation. Every block is guarded so one file works on all pages.
   Depends on data.js + cart.js.
   ========================================================================== */
(function () {
  "use strict";

  /* Toggle to enable the (mock) online payment form later. */
  window.ELECOM = { PAYMENTS_ENABLED: false };

  const $ = function (s, c) { return (c || document).querySelector(s); };
  const $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

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
    return '<article class="product-card" data-category="' + p.category + '">' +
      '<a class="product-card__media" href="' + href + '" aria-label="' + p.name + '">' + tag + window.Cart.mediaHTML(p) + "</a>" +
      '<div class="product-card__body">' +
        '<span class="product-card__cat">' + CATEGORIES[p.category] + "</span>" +
        '<h3 class="product-card__name"><a href="' + href + '">' + p.name + "</a></h3>" +
        '<p class="product-card__desc">' + p.desc + "</p>" +
        '<div class="product-card__foot">' +
          '<span class="price">' + window.Cart.formatPrice(p.price) + "</span>" +
          '<button class="btn btn--primary btn--sm" data-add="' + p.id + '">הוסף לסל</button>' +
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

    const countEl = $("[data-results]");
    const searchInput = $("[data-catalog-search]");
    if (searchInput && query) searchInput.value = params.get("q");

    function matches(p) {
      const okCat = activeCat === "all" || p.category === activeCat;
      const okQ = !query || (p.name + " " + p.desc + " " + CATEGORIES[p.category]).toLowerCase().indexOf(query) !== -1;
      return okCat && okQ;
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

    /* Generic but accurate spec rows derived from the product data. */
    const specs = [
      ["קטגוריה", catLabel],
      p.sub ? ["תת-קטגוריה", p.sub] : null,
      ["מק\"ט", p.id.toUpperCase()],
      ["אחריות", "12 חודשים יבואן רשמי"],
      ["זמינות", "במלאי — איסוף עצמי או משלוח"],
    ].filter(Boolean);

    host.innerHTML =
      '<nav class="breadcrumb" aria-label="מיקום"><a href="index.html">בית</a> / ' +
        '<a href="products.html?cat=' + p.category + '">' + catLabel + "</a> / " +
        "<span>" + p.name + "</span></nav>" +
      '<div class="pd-grid">' +
        '<div class="pd-media">' + tag + window.Cart.mediaHTML(p) + "</div>" +
        '<div class="pd-info">' +
          '<div class="pd-badges">' + '<span class="pd-badge">' + catLabel + "</span>" + subBadge + "</div>" +
          "<h1>" + p.name + "</h1>" +
          '<p class="pd-price">' + window.Cart.formatPrice(p.price) + "</p>" +
          '<p class="pd-desc">' + p.desc + "</p>" +
          '<div class="pd-actions">' +
            '<button class="btn btn--primary btn--lg" data-add="' + p.id + '">הוספה לסל</button>' +
            '<a class="btn btn--ghost btn--lg" href="cart.html">מעבר לסל</a>' +
          "</div>" +
          '<table class="pd-specs"><tbody>' +
            specs.map(function (r) { return "<tr><th>" + r[0] + "</th><td>" + r[1] + "</td></tr>"; }).join("") +
          "</tbody></table>" +
        "</div>" +
      "</div>";

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

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); initNav(); initSearch(); initYear(); initAddToCart();
    initFeatured(); initCatalog(); initCartPage(); initCheckout(); initForms();
    initHeroCarousel(); initReviewCube(); initCategoryMenu(); initAuth();
    initProductPage();
  });
})();
