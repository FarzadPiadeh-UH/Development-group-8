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
      <p><a class="btn" href="index.html">Back to products</a></p>
    </div>
  `;
} else {
  document.title = `Accessible Shop - ${p.name}`;
  crumbName.textContent = p.name;

  wrap.innerHTML = `
    <article class="panel">
      <div class="grid" style="grid-template-columns: 1fr 1fr;">
        <div>
          <img src="${p.image}" alt="${escapeHtml(p.alt)}" style="width:100%;height:auto;border-radius:0.75rem;border:1px solid #c9c9c9;background:#fff;" />
        </div>
        <div>
          <h1>${escapeHtml(p.name)}</h1>
          <p class="muted">${escapeHtml(p.description)}</p>
          <p class="price">£${p.price.toFixed(2)}</p>

          <button class="btn btn-primary" type="button" id="addBtn">Add to cart</button>
          <p class="hint">Adding updates the cart immediately without a page reload.</p>

          <p><a href="index.html">Back to products</a></p>
        </div>
      </div>
    </article>
  `;

  document.getElementById("addBtn").addEventListener("click", () => {
    addToCart(p.id, 1);
    updateCartBadge();
  });
}
