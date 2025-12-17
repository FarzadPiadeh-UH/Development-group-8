import { cartCount, getCart } from "./cart-store.js";

export function renderHeader(active = "") {
  const el = document.getElementById("siteHeader");
  if (!el) return;

  el.innerHTML = `
    <div class="container header-inner">
      <div class="brand">
        <a href="index.html">
          <div class="brand-name">Accessible Shop</div>
          <div class="brand-tag">HTML5 + CSS + JS demo</div>
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
  `;

  updateCartBadge();
}

export function updateCartBadge() {
  const cart = getCart();
  const count = cartCount(cart);

  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = `(${count})`;

  const live = document.getElementById("cartLive");
  if (live) live.textContent = `Cart updated. ${count} item${count === 1 ? "" : "s"} in cart.`;
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
