import { PRODUCTS } from "./products.js";
import { addToCart } from "./cart-store.js";
import { renderHeader, updateCartBadge, escapeHtml } from "./ui.js";

function formatGBP(value) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);
}

function pickMeta(id) {
  // deterministic “retail-like” metadata per id
  const n = parseInt(String(id).replace(/\D/g, ""), 10) || 1;
  const rating = (4.2 + (n % 7) * 0.1);                 // 4.2–4.8
  const reviews = 60 + (n * 37) % 940;                  // 60–999
  const badge = (n % 3 === 0) ? "Best seller" : (n % 3 === 1 ? "Limited deal" : "Top rated");
  const ship = (n % 2 === 0) ? "Free delivery" : "Click & collect";
  return { rating: rating.toFixed(1), reviews, badge, ship };
}

function stars(r) {
  const x = Math.round(Number(r) * 2) / 2;
  const full = Math.floor(x);
  const half = (x - full) === 0.5;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(Math.max(0, 5 - full - (half ? 1 : 0)));
}

function getGrid() {
  return document.getElementById("productGrid") || document.getElementById("productList");
}

function renderProducts(list) {
  const grid = getGrid();
  if (!grid) return;

  grid.innerHTML = list.map(p => {
    const m = pickMeta(p.id);
    const imgAlt = p.alt || p.name;

    return `
      <article class="card" role="listitem">
        <div class="card-media">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(imgAlt)}" loading="lazy">
          <span class="badge-chip">${escapeHtml(m.badge)}</span>
          <span class="badge-chip alt">${escapeHtml(m.ship)}</span>
        </div>

        <div class="card-body">
          <h2><a href="product.html?id=${encodeURIComponent(p.id)}">${escapeHtml(p.name)}</a></h2>

          <div class="rating">
            <span class="stars" aria-label="Rated ${escapeHtml(m.rating)} out of 5">${escapeHtml(stars(m.rating))}</span>
            <span class="reviews">(${escapeHtml(m.reviews)})</span>
          </div>

          <p class="muted">${escapeHtml(p.description)}</p>

          <div class="price-row">
            <div class="price">${formatGBP(p.price)}</div>
          </div>

          <div class="actions">
            <button class="btn btn-primary" type="button" data-add="${escapeHtml(p.id)}">
              <span aria-hidden="true">🛒</span> Add to cart
            </button>
            <a class="btn" href="product.html?id=${encodeURIComponent(p.id)}">View details</a>
          </div>
        </div>
      </article>
    `;
  }).join("");

  grid.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => {
      addToCart(btn.dataset.add, 1);
      updateCartBadge(true);
    });
  });
}

function applyFilters() {
  const q = (document.getElementById("search")?.value || "").trim().toLowerCase();
  const sort = document.getElementById("sort")?.value || "featured";

  let list = PRODUCTS.slice();

  if (q) {
    list = list.filter(p =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      (p.details || "").toLowerCase().includes(q)
    );
  }

  if (sort === "price-asc") list.sort((a,b) => a.price - b.price);
  if (sort === "price-desc") list.sort((a,b) => b.price - a.price);
  if (sort === "name-asc") list.sort((a,b) => (a.name||"").localeCompare(b.name||""));

  renderProducts(list);
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader("products");
  updateCartBadge(false);

  const search = document.getElementById("search");
  const sort = document.getElementById("sort");

  if (search) search.addEventListener("input", applyFilters);
  if (sort) sort.addEventListener("change", applyFilters);

  applyFilters();
});
