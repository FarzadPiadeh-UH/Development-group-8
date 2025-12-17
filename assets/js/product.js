import { getProductById } from "./products.js";
import { addToCart } from "./cart-store.js";
import { renderHeader, updateCartBadge, escapeHtml, setMainFocus } from "./ui.js";

renderHeader();
setMainFocus();

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const wrap = document.getElementById("productDetails");
const crumbName = document.getElementById("crumbName");

const p = id ? getProductById(id) : null;

if (!p) {
  wrap.innerHTML = `
    <div class="panel">
      <h1>Product not found</h1>
      <p>Return to the product listing and try again.</p>
      <p><a class="btn btn-primary" href="index.html">Back to products</a></p>
    </div>
  `;
} else {
  document.title = `Accessible Shop - ${p.name}`;
  crumbName.textContent = p.name;

  wrap.innerHTML = `
    <article class="panel">
      <div class="detail-grid">
        <div>
          <img src="${p.image}" alt="${escapeHtml(p.alt)}" class="detail-img" />
        </div>
        <div>
          <h1>${escapeHtml(p.name)}</h1>
          <p class="muted">${escapeHtml(p.description)}</p>
          <p>${escapeHtml(p.details || "")}</p>
          <p class="price">£${p.price.toFixed(2)}</p>

          <button class="btn btn-primary" type="button" id="addBtn">Add to cart</button>

          <p class="hint">Adding updates the cart immediately.</p>
          <p><a href="cart.html">Go to cart</a></p>
        </div>
      </div>
    </article>
  `;

  document.getElementById("addBtn").addEventListener("click", () => {
    addToCart(p.id, 1);
    updateCartBadge(true);
  });
}
