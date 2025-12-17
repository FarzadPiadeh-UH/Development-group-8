import { renderHeader, setMainFocus, escapeHtml } from "./ui.js";
import {
  getCartLines,
  getCheckoutDetails,
  formatGBP,
  saveLastOrder,
  clearCart,
  clearCheckoutDetails
} from "./cart-store.js";

renderHeader();
setMainFocus();

const blocked = document.getElementById("paymentBlocked");
const content = document.getElementById("paymentContent");
const summary = document.getElementById("paymentSummary");

const errSummary = document.getElementById("payErrorSummary");
const form = document.getElementById("paymentForm");

const cardName = document.getElementById("cardName");
const cardNumber = document.getElementById("cardNumber");
const cardExpiry = document.getElementById("cardExpiry");
const cardCvv = document.getElementById("cardCvv");

function setFieldError(input, message) {
  const err = document.getElementById(`err-${input.id}`);
  input.setAttribute("aria-invalid", "true");
  input.setAttribute("aria-describedby", err.id);
  err.textContent = message;
  err.hidden = false;
}

function clearFieldError(input) {
  const err = document.getElementById(`err-${input.id}`);
  input.removeAttribute("aria-invalid");
  input.removeAttribute("aria-describedby");
  err.textContent = "";
  err.hidden = true;
}

function luhnCheck(numStr) {
  const digits = numStr.replace(/\s+/g, "");
  if (!/^\d{12,19}$/.test(digits)) return false;

  let sum = 0;
  let dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

function validExpiry(mmYY) {
  const m = mmYY.trim();
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(m);
  if (!match) return false;

  const mm = Number(match[1]);
  const yy = Number(match[2]);
  if (mm < 1 || mm > 12) return false;

  const now = new Date();
  const year = 2000 + yy;
  const expEnd = new Date(year, mm, 1); // month after expiry
  return expEnd > now;
}

function validate() {
  errSummary.hidden = true;
  errSummary.innerHTML = "";

  const errors = [];
  for (const i of [cardName, cardNumber, cardExpiry, cardCvv]) clearFieldError(i);

  const nameVal = cardName.value.trim();
  if (!nameVal) {
    errors.push("Name on card is required.");
    setFieldError(cardName, "This field is required.");
  }

  const numVal = cardNumber.value.trim();
  if (!numVal) {
    errors.push("Card number is required.");
    setFieldError(cardNumber, "This field is required.");
  } else if (!luhnCheck(numVal)) {
    errors.push("Card number appears invalid.");
    setFieldError(cardNumber, "Enter a valid card number.");
  }

  const expVal = cardExpiry.value.trim();
  if (!expVal) {
    errors.push("Expiry date is required.");
    setFieldError(cardExpiry, "This field is required.");
  } else if (!validExpiry(expVal)) {
    errors.push("Expiry date must be in MM/YY and in the future.");
    setFieldError(cardExpiry, "Enter a valid future expiry (MM/YY).");
  }

  const cvvVal = cardCvv.value.trim();
  if (!cvvVal) {
    errors.push("CVV is required.");
    setFieldError(cardCvv, "This field is required.");
  } else if (!/^\d{3,4}$/.test(cvvVal)) {
    errors.push("CVV must be 3 or 4 digits.");
    setFieldError(cardCvv, "Enter a 3 or 4 digit CVV.");
  }

  if (errors.length) {
    errSummary.hidden = false;
    errSummary.innerHTML = `<p>Please fix the following:</p><ul>${errors.map(e => `<li>${escapeHtml(e)}</li>`).join("")}</ul>`;
    const firstInvalid = [cardName, cardNumber, cardExpiry, cardCvv].find(i => i.getAttribute("aria-invalid") === "true");
    if (firstInvalid) firstInvalid.focus();
    return false;
  }

  return true;
}

const checkout = getCheckoutDetails();
const { lines, total } = getCartLines();

if (!checkout || lines.length === 0) {
  blocked.hidden = false;
  content.hidden = true;
} else {
  blocked.hidden = true;
  content.hidden = false;

  summary.innerHTML = `
    <ul>
      ${lines.map(l => `<li>${escapeHtml(l.product.name)} × ${l.quantity} = ${formatGBP(l.lineTotal)}</li>`).join("")}
    </ul>
    <p class="price">Total: ${formatGBP(total)}</p>
  `;
}

form.addEventListener("input", (e) => {
  const input = e.target.closest("input");
  if (!input) return;
  clearFieldError(input);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate()) return;

  const order = {
    id: "ORD-" + Math.random().toString(16).slice(2, 10).toUpperCase(),
    paidAt: new Date().toISOString(),
    total,
    lines: lines.map(l => ({
      id: l.product.id,
      name: l.product.name,
      qty: l.quantity,
      unitPrice: l.product.price,
      lineTotal: l.lineTotal
    })),
    billing: checkout.billing,
    shipping: checkout.shipping
  };

  saveLastOrder(order);

  clearCart();
  clearCheckoutDetails();

  window.location.href = "confirmation.html";
});
