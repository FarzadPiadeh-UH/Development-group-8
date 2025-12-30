import { cartCount, getCart } from "./cart-store.js";

/**
 * ui.js
 * Manages global UI components, header rendering, 
 * and user display preferences (Text Size).
 */

const PREF_KEY = "ui_prefs_v1";

/**
 * Loads user preferences from localStorage.
 */
function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY)) || { bigText: false };
  } catch {
    return { bigText: false };
  }
}

/**
 * Saves user preferences to localStorage.
 */
function savePrefs(prefs) {
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}

/**
 * Applies visual classes to the document based on preferences.
 */
function applyPrefs(prefs) {
  document.documentElement.classList.toggle("big-text", !!prefs.bigText);
}

/**
 * Renders the site header dynamically across all pages.
 * Includes icons for Products and Cart navigation.
 */
export function renderHeader(active = "") {
  const prefs = loadPrefs();
  applyPrefs(prefs);

  const el = document.getElementById("siteHeader");
  if (!el) return;

  el.innerHTML = `
    <div class="header-nav">
      <div class="container nav-row" role="navigation" aria-label="Utility">
        <div class="nav-links">
          <a href="index.html">Home</a>
          <a href="checkout.html">Checkout</a>
          <a href="payment.html">Payment</a>
        </div>

        <div class="display-controls" aria-label="Display options">
          <button type="button" class="control-btn" id="toggleText" aria-pressed="${prefs.bigText ? "true" : "false"}">
            Text size
          </button>
        </div>
      </div>
    </div>

    <div class="container header-top">
      <div class="brand">
        <a href="index.html">
          <div class="brand-name">Accessible Shop</div>
          <div class="brand-tag">inclusive, configurable, consistent</div>
        </a>
      </div>

      <nav class="header-actions" aria-label="Primary">
        <a href="index.html" class="pill" ${active === "products" ? 'aria-current="page"' : ""}>
          <span aria-hidden="true">🏷️</span> Products
        </a>
        <a href="cart.html" class="pill" ${active === "cart" ? 'aria-current="page"' : ""}>
          <span aria-hidden="true">🛒</span> Cart <span id="cartCount" class="badge">(0)</span>
        </a>
      </nav>
    </div>

    <div class="sr-only" id="cartLive" aria-live="polite"></div>
    <div class="sr-only" id="uiLive" aria-live="polite"></div>
  `;

  const toggleText = document.getElementById("toggleText");
  const uiLive = document.getElementById("uiLive");

  if (toggleText) {
    toggleText.addEventListener("click", () => {
      const p = loadPrefs();
      p.bigText = !p.bigText;
      savePrefs(p);
      applyPrefs(p);
      
      // Update ARIA state and announce change to screen readers
      toggleText.setAttribute("aria-pressed", p.bigText ? "true" : "false");
      if (uiLive) uiLive.textContent = p.bigText ? "Large text enabled." : "Large text disabled.";
    });
  }

  updateCartBadge(false);
}

/**
 * Updates the cart count badge in the header.
 * @param {boolean} announce - If true, triggers a screen reader announcement.
 */
export function updateCartBadge(announce = true) {
  const cart = getCart();
  const count = cartCount(cart);

  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = `(${count})`;

  const live = document.getElementById("cartLive");
  if (live && announce) {
    live.textContent = `Cart updated. ${count} item${count === 1 ? "" : "s"} in cart.`;
  }
}

/**
 * Moves focus to the main content area, useful for keyboard navigation.
 */
export function setMainFocus() {
  const main = document.getElementById("main");
  if (main) main.focus();
}

/**
 * Escapes HTML characters to prevent XSS.
 */
export function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
