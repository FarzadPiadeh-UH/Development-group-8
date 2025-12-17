import { PRODUCTS } from "./products.js";
import { addToCart } from "./cart-store.js";
import { renderHeader, updateCartBadge, escapeHtml, setMainFocus } from "./ui.js";

renderHeader("products");
setMainFocus();

const grid = document.getElementById("productGrid");
const search = document.getElementById("search");
const sort = document.getElementById("sort");

function priceText(p) {
  return `£${p.price.toFixed(2)}`;
}

function cardHtml(p) {
  return `
    <article class="card" role="listitem">
      <img src="${p.image}" alt="${escapeHtml(p.alt)}" />
      <div class="card-body">
        <h2><a href="product.html?id=${encodeURIComponent(p.id)}">${escapeHtml(p.name)}</a></h2>
        <p class="muted">${escapeHtml(p.description)}</p>
        <p class="price">${priceText(p)}</p>
        <button class="btn btn-primary" type="button" data-add="${escapeHtml(p.id)}">
          Add to cart
        </button>
      </div>
    </article>
  `;
}

function applySort(items, mode) {
  const arr = [...items];
  if (mode === "price-asc") arr.sort((a, b) => a.price - b.price);
  if (mode === "price-desc") arr.sort((a, b) => b.price - a.price);
  if (mode === "name-asc") arr.sort((a, b) => a.name.localeCompare(b.name));
  return arr;
}

function render() {
  const q = (search.value || "").trim().toLowerCase();
  const filtered = PRODUCTS.filter(p => {
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.details || "").toLowerCase().includes(q)
    );
  });

  const sorted = applySort(filtered, sort.value);
  grid.innerHTML = sorted.map(cardHtml).join("");

  if (sorted.length === 0) {
    grid.innerHTML = `<div class="panel" role="status">No products match your search.</div>`;
  }
}

grid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;

  const id = btn.getAttribute("data-add");
  addToCart(id, 1);
  updateCartBadge(true);

  const old = btn.textContent;
  btn.textContent = "Added";
  btn.setAttribute("aria-label", "Added to cart");
  setTimeout(() => {
    btn.textContent = old.trim() ? old : "Add to cart";
    btn.removeAttribute("aria-label");
  }, 900);
});

search.addEventListener("input", render);
sort.addEventListener("change", render);

render();
