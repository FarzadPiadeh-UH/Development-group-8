import { cartCount, getCart } from "./cart-store.js";

const PREF_KEY = "ui_prefs_v3";

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY)) || { bigText: false };
  } catch {
    return { bigText: false };
  }
}

function savePrefs(prefs) {
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}

function applyPrefs(prefs) {
  document.documentElement.classList.toggle("big-text", !!prefs.bigText);
}

function syncSearchToPage(value) {
  // if the index page has a search box, keep it in sync
  const pageSearch = document.getElementById("search");
  if (pageSearch) {
    pageSearch.value = value;
    pageSearch.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

export function renderHeader(active = "") {
  const prefs = loadPrefs();
  applyPrefs(prefs);

  const el = document.getElementById("siteHeader");
  if (!el) return;

  el.innerHTML = `
    <div class="container header-top">
      <div class="brand">
        <a href="index.html">
          <div class="brand-name">Accessible Shop</div>
          <div class="brand-tag">clean, professional, AA-friendly</div>
        </a>
      </div>

      <div class="header-search" role="search" aria-label="Site search">
        <div class="search-wrap">
          <label class="sr-only" for="headerSearch">Search products</label>
          <input id="headerSearch" type="search" placeholder="Search products..." autocomplete="off" />
          <button class="search-icon" type="button" id="headerSearchBtn" aria-label="Search">🔍</button>
        </div>
      </div>

      <div class="header-actions" aria-label="Checkout and cart">
        <a class="pill" href="checkout.html">Checkout</a>
        <a class="pill" href="cart.html" ${active === "cart" ? 'aria-current="page"' : ""}>
          Cart <span class="badge" id="cartCount">0</span>
        </a>
      </div>
    </div>

    <div class="header-nav">
      <div class="container nav-row">
        <nav class="nav-links" aria-label="Primary">
          <a href="index.html" ${active === "products" ? 'aria-current="page"' : ""}>Products</a>
          <a href="payment.html" ${active === "payment" ? 'aria-current="page"' : ""}>Payment</a>
          <a href="confirmation.html" ${active === "confirmation" ? 'aria-current="page"' : ""}>Confirmation</a>
        </nav>

        <div class="display-controls" aria-label="Display options">
          <button type="button" class="control-btn" id="toggleText" aria-pressed="${prefs.bigText ? "true" : "false"}">
            Text size
          </button>
        </div>
      </div>
    </div>

    <div class="sr-only" id="cartLive" aria-live="polite"></div>
  `;

  const headerSearch = document.getElementById("headerSearch");
  const headerSearchBtn = document.getElementById("headerSearchBtn");

  if (headerSearch) {
    // preload header search from page search if it exists
    const pageSearch = document.getElementById("search");
    if (pageSearch && pageSearch.value) headerSearch.value = pageSearch.value;

    headerSearch.addEventListener("input", (e) => syncSearchToPage(e.target.value));
    headerSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter") syncSearchToPage(headerSearch.value);
    });
  }
  if (headerSearchBtn) {
    headerSearchBtn.addEventListener("click", () => syncSearchToPage(headerSearch ? headerSearch.value : ""));
  }

  const toggleText = document.getElementById("toggleText");
  if (toggleText) {
    toggleText.addEventListener("click", () => {
      const p = loadPrefs();
      p.bigText = !p.bigText;
      savePrefs(p);
      applyPrefs(p);
      toggleText.setAttribute("aria-pressed", p.bigText ? "true" : "false");
    });
  }

  updateCartBadge(false);
}

export function updateCartBadge(announce = true) {
  const count = cartCount(getCart());

  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = String(count);

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
