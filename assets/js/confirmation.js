import { renderHeader, setMainFocus, escapeHtml } from "./ui.js";
import { getLastOrder, formatGBP } from "./cart-store.js";

renderHeader();
setMainFocus();

const details = document.getElementById("confirmDetails");
const order = getLastOrder();

if (!order) {
  details.innerHTML = `
    <p>No recent order found.</p>
    <p><a class="btn" href="index.html">Go to products</a></p>
  `;
} else {
  details.innerHTML = `
    <p>Order reference: ${escapeHtml(order.id)}</p>
    <p>Paid at: ${escapeHtml(new Date(order.paidAt).toLocaleString("en-GB"))}</p>

    <h3>Items</h3>
    <ul>
      ${order.lines.map(l => `<li>${escapeHtml(l.name)} × ${l.qty} = ${formatGBP(l.lineTotal)}</li>`).join("")}
    </ul>
    <p class="price">Total: ${formatGBP(order.total)}</p>

    <h3>Shipping</h3>
    <p>${escapeHtml(order.shipping?.name || "")}</p>
    <p>${escapeHtml(order.shipping?.address || "")}, ${escapeHtml(order.shipping?.city || "")}, ${escapeHtml(order.shipping?.postcode || "")}</p>
  `;
}
