/* ==========================================================================
   Accessibility widget (IS 5568 style)
   Floating button + panel: font scaling, high contrast, grayscale,
   highlight links, readable font, big cursor, reset.
   State persisted in localStorage('elecom_a11y') and applied to <html>.
   Self-injects so every page gets it with no extra markup.
   ========================================================================== */
(function () {
  "use strict";
  const KEY = "elecom_a11y";
  const root = document.documentElement;

  const DEFAULT = { scale: 1, contrast: false, grayscale: false, links: false, readable: false, bigcursor: false };
  function load() {
    try { return Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(KEY)) || {}); }
    catch (e) { return Object.assign({}, DEFAULT); }
  }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

  let state = load();

  function apply() {
    root.style.setProperty("--a11y-scale", state.scale);
    root.classList.toggle("a11y-contrast", state.contrast);
    root.classList.toggle("a11y-grayscale", state.grayscale);
    root.classList.toggle("a11y-links", state.links);
    root.classList.toggle("a11y-readable", state.readable);
    root.classList.toggle("a11y-bigcursor", state.bigcursor);
    refreshButtons();
  }

  const svg = {
    access: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="4" r="1.8" fill="currentColor" stroke="none"/><path d="M10 7v6h5l3.2 5.2"/><path d="M10 10h4.5"/><path d="M15.5 19.2A5.6 5.6 0 1 1 8 12.2"/><circle cx="10" cy="17.4" r="3.4"/></svg>',
    fontUp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 18 8 4h2l5 14h-2l-1.3-4H6.3L5 18H3zm3.9-6h4.2L9 6.2 6.9 12zM18 9h2v3h3v2h-3v3h-2v-3h-3v-2h3V9z"/></svg>',
    fontDown: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 18 8 4h2l5 14h-2l-1.3-4H6.3L5 18H3zm3.9-6h4.2L9 6.2 6.9 12zM15 12h8v2h-8z"/></svg>',
    contrast: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20V2z"/><path fill="none" stroke="currentColor" stroke-width="2" d="M12 2a10 10 0 1 1 0 20"/></svg>',
    gray: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/></svg>',
    links: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
    readable: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 4h14v2H5zM7 9h10v2H7zM5 14h14v2H5zM7 19h10v2H7z"/></svg>',
    cursor: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 3l14 8-6 1.5L16 20l-2.5 1-3-7.5L5 18z"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 12a8 8 0 1 1 2.3 5.6"/><path d="M4 20v-5h5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  };

  /* Build widget DOM */
  const fab = document.createElement("button");
  fab.className = "a11y-fab";
  fab.type = "button";
  fab.setAttribute("aria-haspopup", "dialog");
  fab.setAttribute("aria-expanded", "false");
  fab.setAttribute("aria-label", "תפריט נגישות");
  fab.innerHTML = svg.access;

  const panel = document.createElement("div");
  panel.className = "a11y-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "אפשרויות נגישות");
  panel.setAttribute("aria-modal", "false");
  panel.innerHTML =
    '<h2>נגישות <button type="button" class="icon-btn" data-a11y-close aria-label="סגירת תפריט נגישות">' + svg.close + '</button></h2>' +
    '<div class="a11y-options">' +
      btn("font-up", svg.fontUp, "הגדלת טקסט") +
      btn("font-down", svg.fontDown, "הקטנת טקסט") +
      toggle("contrast", svg.contrast, "ניגודיות גבוהה") +
      toggle("grayscale", svg.gray, "גווני אפור") +
      toggle("links", svg.links, "הדגשת קישורים") +
      toggle("readable", svg.readable, "גופן קריא") +
      toggle("bigcursor", svg.cursor, "סמן גדול") +
    '</div>' +
    '<button type="button" class="btn btn--ghost btn--block a11y-reset" data-a11y="reset">' + svg.reset + ' איפוס הגדרות</button>';

  function btn(action, icon, label) {
    return '<button type="button" class="a11y-opt" data-a11y="' + action + '">' + icon + '<span>' + label + '</span></button>';
  }
  function toggle(action, icon, label) {
    return '<button type="button" class="a11y-opt" data-a11y="' + action + '" aria-pressed="false">' + icon + '<span>' + label + '</span></button>';
  }

  function refreshButtons() {
    panel.querySelectorAll("[data-a11y]").forEach(function (b) {
      const a = b.getAttribute("data-a11y");
      if (state.hasOwnProperty(a)) b.setAttribute("aria-pressed", String(state[a]));
    });
  }

  function open() {
    panel.setAttribute("data-open", "true");
    fab.setAttribute("aria-expanded", "true");
    const first = panel.querySelector("[data-a11y]");
    if (first) first.focus();
    document.addEventListener("keydown", onKey);
  }
  function close() {
    panel.removeAttribute("data-open");
    fab.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onKey);
    fab.focus();
  }
  function onKey(e) { if (e.key === "Escape") close(); }

  fab.addEventListener("click", function () {
    panel.getAttribute("data-open") ? close() : open();
  });

  panel.addEventListener("click", function (e) {
    const closeBtn = e.target.closest("[data-a11y-close]");
    if (closeBtn) { close(); return; }
    const t = e.target.closest("[data-a11y]");
    if (!t) return;
    const action = t.getAttribute("data-a11y");
    switch (action) {
      case "font-up":   state.scale = Math.min(1.5, +(state.scale + 0.1).toFixed(2)); break;
      case "font-down": state.scale = Math.max(0.9, +(state.scale - 0.1).toFixed(2)); break;
      case "reset":     state = Object.assign({}, DEFAULT); break;
      default:          if (state.hasOwnProperty(action)) state[action] = !state[action];
    }
    save(state); apply();
  });

  document.addEventListener("click", function (e) {
    if (panel.getAttribute("data-open") && !panel.contains(e.target) && !fab.contains(e.target)) close();
  });

  document.addEventListener("DOMContentLoaded", function () {
    document.body.appendChild(fab);
    document.body.appendChild(panel);
    apply();
  });

  /* Apply persisted classes ASAP (before DOMContentLoaded) to limit flashing. */
  apply();
})();
