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

  const hasVariants = Array.isArray(p.variants) && p.variants.length >= 1;
  const initialVariant = hasVariants ? p.variants[0] : null;

  const mainImgSrc = hasVariants ? initialVariant.image : p.image;
  const mainImgAlt = hasVariants ? initialVariant.alt : p.alt;

  wrap.innerHTML = `
    <article class="panel">
      <div class="detail-grid">
        <div>
          <img id="mainImg" src="${mainImgSrc}" alt="${escapeHtml(mainImgAlt)}" class="detail-img" />

          ${
            hasVariants
              ? `
            <div class="thumbs" aria-label="Product images">
              ${p.variants
                .map(
                  (v, idx) => `
                <button type="button" class="thumb" data-variant="${idx}" aria-pressed="${idx === 0 ? "true" : "false"}">
                  <img src="${v.image}" alt="${escapeHtml(v.alt)}" />
                  <span class="sr-only">${escapeHtml(v.color)}</span>
                </button>
              `
                )
                .join("")}
            </div>

            <fieldset class="variant-field">
              <legend>Choose colour</legend>
              <div class="variant-options">
                ${p.variants
                  .map(
                    (v, idx) => `
                  <div class="variant-item">
                    <input type="radio" name="colour" id="colour-${idx}" value="${escapeHtml(v.color)}" data-variant="${idx}" ${
                      idx === 0 ? "checked" : ""
                    } />
                    <label for="colour-${idx}">${escapeHtml(v.color)}</label>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </fieldset>
          `
              : ""
          }
        </div>

        <div>
          <h1>${escapeHtml(p.name)}</h1>
          <p class="muted">${escapeHtml(p.description)}</p>
          <p>${escapeHtml(p.details || "")}</p>
          <p class="price">£${p.price.toFixed(2)}</p>

          <button class="btn btn-primary" type="button" id="addBtn">
            <span aria-hidden="true">🛒</span> Add to cart
          </button>

          <p class="hint" id="addHint">Adding updates the cart immediately.</p>
          <p><a href="cart.html">Go to cart</a></p>
        </div>
      </div>
    </article>
  `;

  // Variant/image switching (only for products with variants)
  if (hasVariants) {
    const mainImg = document.getElementById("mainImg");
    const thumbButtons = Array.from(document.querySelectorAll(".thumbs .thumb"));
    const radios = Array.from(document.querySelectorAll('input[name="colour"]'));

    function setVariant(idx) {
      const v = p.variants[idx];
      if (!v) return;

      mainImg.src = v.image;
      mainImg.alt = v.alt;

      thumbButtons.forEach((b, i) => b.setAttribute("aria-pressed", i === idx ? "true" : "false"));
      radios.forEach((r) => {
        if (Number(r.dataset.variant) === idx) r.checked = true;
      });
    }

    thumbButtons.forEach((btn) => {
      btn.addEventListener("click", () => setVariant(Number(btn.dataset.variant)));
    });

    radios.forEach((r) => {
      r.addEventListener("change", () => setVariant(Number(r.dataset.variant)));
    });
  }

  document.getElementById("addBtn").addEventListener("click", () => {
    addToCart(p.id, 1);
    updateCartBadge(true);
  });
}
