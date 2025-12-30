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
    const hasVariants = Array.isArray(p.variants) && p.variants.length >= 2;
    const firstVariant = hasVariants ? p.variants[0] : null;
    const imgSrc = hasVariants ? firstVariant.image : p.image;
    const imgAlt = hasVariants ? (firstVariant.alt || p.alt || p.name) : (p.alt || p.name);

    return `
      <article class="card" role="listitem" ${hasVariants ? `data-variants="1" data-product="${escapeHtml(p.id)}"` : ""}>
        <div class="card-media">
          <img class="card-img" src="${escapeHtml(imgSrc)}" alt="${escapeHtml(imgAlt)}" loading="lazy">
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

          ${hasVariants ? `
            <fieldset class="variant-field" aria-label="Choose colour for ${escapeHtml(p.name)}">
              <legend>Colour</legend>
              <div class="variant-options">
                ${p.variants.map((v, i) => `
                  <label class="variant-item">
                    <input type="radio" name="colour-${escapeHtml(p.id)}" value="${escapeHtml(v.color)}" data-variant-index="${i}" ${i===0 ? "checked" : ""}>
                    <span>${escapeHtml(v.color)}</span>
                  </label>
                `).join("")}
              </div>
            </fieldset>
          ` : ""}

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

  // Variant behaviour (only for products that have variants, currently p1)
  grid.querySelectorAll("[data-variants='1']").forEach(card => {
    const productId = card.getAttribute("data-product");
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product || !Array.isArray(product.variants) || product.variants.length < 2) return;

    const img = card.querySelector(".card-img");
    const radios = card.querySelectorAll("input[type='radio'][data-variant-index]");

    function applyVariant(index) {
      const i = Number(index);
      if (!Number.isFinite(i) || i < 0 || i >= product.variants.length) return;
      const v = product.variants[i];
      if (img) {
        img.src = v.image;
        img.alt = v.alt || product.alt || product.name;
      }      radios.forEach(r => { r.checked = (r.getAttribute("data-variant-index") === String(i)); });
    }

    radios.forEach(r => r.addEventListener("change", () => applyVariant(r.getAttribute("data-variant-index"))));  });
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
