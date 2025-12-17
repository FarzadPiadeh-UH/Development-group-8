import { PRODUCTS } from "./products.js";
import { addToCart } from "./cart-store.js";
import { renderHeader, updateCartBadge, escapeHtml, setMainFocus } from "./ui.js";

renderHeader("products");
setMainFocus();

const grid = document.getElementById("productGrid");

function cardHtml(p) {
  return `
    <article class="card" role="listitem">
      <img src="${p.image}" alt="${escapeHtml(p.alt)}" />
      <div class="card-body">
        <h2><a href="product.html?id=${encodeURIComponent(p.id)}">${escapeHtml(p.name)}</a></h2>
        <p class="muted">${escapeHtml(p.description)}</p>
        <p class="price">£${p.price.toFixed(2)}</p>
        <button class="btn btn-primary" type="button" data-add="${escapeHtml(p.id)}">
          Add to cart
        </button>
      </div>
    </article>
  `;
}

grid.innerHTML = PRODUCTS.map(cardHtml).join("");

grid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;

  const id = btn.getAttribute("data-add");
  addToCart(id, 1);
  updateCartBadge();

  btn.textContent = "Added";
  setTimeout(() => { btn.textContent = "Add to cart"; }, 800);
});
