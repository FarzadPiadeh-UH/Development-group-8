import { cartCount, getCart } from "./cart-store.js";

const PREF_KEY = "ui_prefs_v1";

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY)) || { bigText: false, highContrast: false };
  } catch {
    return { bigText: false, highContrast: false };
  }
}

function savePrefs(prefs) {
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}

function applyPrefs(prefs) {
  document.documentElement.classList.toggle("big-text", !!prefs.bigText);
  document.documentElement.classList.toggle("hc", !!prefs.highContrast);
}

export function renderHeader(active = "") {
  const prefs = loadPrefs();
  applyPrefs(prefs);

  const el = document.getElementById("siteHeader");
  if (!el) return;

  el.innerHTML = `
    <div class="utility-bar">
      <div class="container utility-inner" role="navigation" aria-label="Utility">
        <div class="utility-links">
          <a href="index.html">Home</a>
          <a href="checkout.html">Checkout</a>
          <a href="payment.html">Payment</a>
        </div>

        <div class="utility-controls" aria-label="Display options">
          <button type="button" class="control-btn" id="toggleText" aria-pressed="${prefs.bigText ? "true" : "false"}">
            Text size
          </button>
          <button type="button" class="control-btn" id="toggleContrast" aria-pressed="${prefs.highContrast ? "true" : "false"}">
            High contrast
          </button>
        </div>
      </div>
    </div>

    <div class="container header-inner">
      <div class="brand">
        <a href="index.html">
          <div class="brand-name">Accessible Shop</div>
          <div class="brand-tag">inclusive, configurable, consistent</div>
        </a>
      </div>

      <nav class="nav" aria-label="Primary">
        <a href="index.html" ${active === "products" ? 'aria-current="page"' : ""}>Products</a>
        <a href="cart.html" class="cart-pill" ${active === "cart" ? 'aria-current="page"' : ""}>
          Cart <span id="cartCount">(0)</span>
        </a>
      </nav>
    </div>

    <div class="sr-only" id="cartLive" aria-live="polite"></div>
    <div class="sr-only" id="uiLive" aria-live="polite"></div>
  `;

  const toggleText = document.getElementById("toggleText");
  const toggleContrast = document.getElementById("toggleContrast");
  const uiLive = document.getElementById("uiLive");

  if (toggleText) {
    toggleText.addEventListener("click", () => {
      const p = loadPrefs();
      p.bigText = !p.bigText;
      savePrefs(p);
      applyPrefs(p);
      toggleText.setAttribute("aria-pressed", p.bigText ? "true" : "false");
      if (uiLive) uiLive.textContent = p.bigText ? "Large text enabled." : "Large text disabled.";
    });
  }

  if (toggleContrast) {
    toggleContrast.addEventListener("click", () => {
      const p = loadPrefs();
      p.highContrast = !p.highContrast;
      savePrefs(p);
      applyPrefs(p);
      toggleContrast.setAttribute("aria-pressed", p.highContrast ? "true" : "false");
      if (uiLive) uiLive.textContent = p.highContrast ? "High contrast enabled." : "High contrast disabled.";
    });
  }

  updateCartBadge(false);
}

export function updateCartBadge(announce = true) {
  const cart = getCart();
  const count = cartCount(cart);

  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = `(${count})`;

  const live = document.getElementById("cartLive");
  if (live && announce) live.textContent = `Cart updated. ${count} item${count === 1 ? "" : "s"} in cart.`;
}

export function setMainFocus() {
  const main = document.getElementById("main");
  if (main) main.focus();
}

export function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
