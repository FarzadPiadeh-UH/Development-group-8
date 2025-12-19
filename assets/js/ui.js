import { cartCount, getCart } from "./cart-store.js";

const PREF_KEY = "ui_prefs_v2";

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
          <div class="brand-tag">fast, clean, AA-friendly</div>
        </a>
      </div>

      <div class="header-search" role="search" aria-label="Site search">
        <div class="search-wrap">
          <label class="sr-only" for="headerSearch">Search products</label>
          <input id="headerSearch" type="search" placeholder="Search products..." autocomplete="off" />
          <button class="search-icon" type="button" id="headerSearchBtn" aria-label="Search">
            🔍
          </button>
        </div>
      </div>

      <div class="header-actions" aria-label="Account and cart">
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
          <a href="product.html?id=p1">Featured</a>
          <a href="payment.html">Payment</a>
          <a href="confirmation.html">Confirmation</a>
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
