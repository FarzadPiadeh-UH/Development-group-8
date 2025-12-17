import { renderHeader, updateCartBadge, setMainFocus, escapeHtml } from "./ui.js";
import { getCartLines, updateQty, removeItem, formatGBP } from "./cart-store.js";

renderHeader("cart");
setMainFocus();

const emptyEl = document.getElementById("cartEmpty");
const contentEl = document.getElementById("cartContent");
const tbody = document.getElementById("cartTbody");
const totalEl = document.getElementById("cartTotal");
const toCheckout = document.getElementById("toCheckout");

function render() {
  const { lines, total } = getCartLines();

  if (lines.length === 0) {
    emptyEl.hidden = false;
    contentEl.hidden = true;
    updateCartBadge();
    return;
  }

  emptyEl.hidden = true;
  contentEl.hidden = false;

  tbody.innerHTML = lines.map((l) => {
    const id = l.product.id;
    const price = formatGBP(l.product.price);
    const subtotal = formatGBP(l.lineTotal);

    return `
      <tr data-id="${escapeHtml(id)}">
        <td>
          <a href="product.html?id=${encodeURIComponent(id)}">${escapeHtml(l.product.name)}</a>
        </td>
        <td class="num">${price}</td>
        <td>
          <label class="sr-only" for="qty-${escapeHtml(id)}">Quantity for ${escapeHtml(l.product.name)}</label>
          <input id="qty-${escapeHtml(id)}" type="number" min="1" step="1" value="${l.quantity}" class="qty-input" />
        </td>
        <td class="num">${subtotal}</td>
        <td>
          <button class="btn" type="button" data-remove="1">Remove</button>
        </td>
      </tr>
    `;
  }).join("");

  totalEl.textContent = formatGBP(total);
  updateCartBadge();
}

tbody.addEventListener("input", (e) => {
  const row = e.target.closest("tr[data-id]");
  if (!row) return;

  const id = row.getAttribute("data-id");
  if (e.target.matches("input[type='number']")) {
    updateQty(id, e.target.value);
    render();
  }
});

tbody.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-remove]");
  if (!btn) return;

  const row = btn.closest("tr[data-id]");
  if (!row) return;

  const id = row.getAttribute("data-id");
  removeItem(id);
  render();
});

toCheckout.addEventListener("click", (e) => {
  const { lines } = getCartLines();
  if (lines.length === 0) {
    e.preventDefault();
  }
});

render();
