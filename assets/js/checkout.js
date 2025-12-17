import { renderHeader, setMainFocus, escapeHtml } from "./ui.js";
import { getCartLines, formatGBP, saveCheckoutDetails, getCheckoutDetails } from "./cart-store.js";

renderHeader();
setMainFocus();

const emptyEl = document.getElementById("checkoutEmpty");
const contentEl = document.getElementById("checkoutContent");

const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

const next1 = document.getElementById("next1");
const next2 = document.getElementById("next2");
const back2 = document.getElementById("back2");
const back3 = document.getElementById("back3");

const shipSame = document.getElementById("shipSame");

const errorSummary = document.getElementById("errorSummary");
const orderSummary = document.getElementById("orderSummary");
const billingSummary = document.getElementById("billingSummary");
const shippingSummary = document.getElementById("shippingSummary");

const form = document.getElementById("checkoutForm");

function showStep(n) {
  step1.hidden = n !== 1;
  step2.hidden = n !== 2;
  step3.hidden = n !== 3;

  errorSummary.hidden = true;
  errorSummary.innerHTML = "";

  const panel = n === 1 ? step1 : n === 2 ? step2 : step3;
  const first = panel.querySelector("input, a, button");
  if (first) first.focus();
}

function setFieldError(input, message) {
  const err = document.getElementById(`err-${input.id}`);
  if (!err) return;

  input.setAttribute("aria-invalid", "true");
  input.setAttribute("aria-describedby", err.id);
  err.textContent = message;
  err.hidden = false;
}

function clearFieldError(input) {
  const err = document.getElementById(`err-${input.id}`);
  if (!err) return;

  input.removeAttribute("aria-invalid");
  input.removeAttribute("aria-describedby");
  err.textContent = "";
  err.hidden = true;
}

function validateStep(inputs) {
  let ok = true;
  const messages = [];

  for (const input of inputs) {
    clearFieldError(input);
    const val = String(input.value || "").trim();

    if (input.hasAttribute("required") && !val) {
      ok = false;
      const msg = "This field is required.";
      setFieldError(input, msg);
      messages.push(`${input.previousElementSibling?.textContent || "Field"}: ${msg}`);
      continue;
    }

    if (input.type === "email" && val) {
      const good = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (!good) {
        ok = false;
        const msg = "Enter a valid email address.";
        setFieldError(input, msg);
        messages.push(`Email: ${msg}`);
      }
    }

    if (input.id.endsWith("Phone") && val) {
      const good = /^[0-9+\s()-]{7,}$/.test(val);
      if (!good) {
        ok = false;
        const msg = "Enter a valid phone number.";
        setFieldError(input, msg);
        messages.push(`Phone: ${msg}`);
      }
    }
  }

  if (!ok) {
    errorSummary.hidden = false;
    errorSummary.innerHTML = `<p>Please fix the following:</p><ul>${messages.map(m => `<li>${escapeHtml(m)}</li>`).join("")}</ul>`;
    const firstInvalid = inputs.find(i => i.getAttribute("aria-invalid") === "true");
    if (firstInvalid) firstInvalid.focus();
  }

  return ok;
}

function getVal(id) {
  return String(document.getElementById(id).value || "").trim();
}

function readDetails() {
  return {
    billing: {
      name: getVal("billName"),
      email: getVal("billEmail"),
      phone: getVal("billPhone"),
      address: getVal("billAddress"),
      city: getVal("billCity"),
      postcode: getVal("billPostcode")
    },
    shipping: {
      name: getVal("shipName"),
      address: getVal("shipAddress"),
      city: getVal("shipCity"),
      postcode: getVal("shipPostcode")
    }
  };
}

function renderReview() {
  const { lines, total } = getCartLines();
  const details = readDetails();
  saveCheckoutDetails(details);

  orderSummary.innerHTML = `
    <ul>
      ${lines.map(l => `<li>${escapeHtml(l.product.name)} × ${l.quantity} = ${formatGBP(l.lineTotal)}</li>`).join("")}
    </ul>
    <p class="price">Total: ${formatGBP(total)}</p>
  `;

  billingSummary.innerHTML = `
    <p>${escapeHtml(details.billing.name)}</p>
    <p>${escapeHtml(details.billing.email)}</p>
    <p>${escapeHtml(details.billing.phone)}</p>
    <p>${escapeHtml(details.billing.address)}, ${escapeHtml(details.billing.city)}, ${escapeHtml(details.billing.postcode)}</p>
  `;

  shippingSummary.innerHTML = `
    <p>${escapeHtml(details.shipping.name)}</p>
    <p>${escapeHtml(details.shipping.address)}, ${escapeHtml(details.shipping.city)}, ${escapeHtml(details.shipping.postcode)}</p>
  `;
}

const { lines } = getCartLines();
if (lines.length === 0) {
  emptyEl.hidden = false;
  contentEl.hidden = true;
} else {
  emptyEl.hidden = true;
  contentEl.hidden = false;

  const saved = getCheckoutDetails();
  if (saved) {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ""; };

    set("billName", saved.billing?.name);
    set("billEmail", saved.billing?.email);
    set("billPhone", saved.billing?.phone);
    set("billAddress", saved.billing?.address);
    set("billCity", saved.billing?.city);
    set("billPostcode", saved.billing?.postcode);

    set("shipName", saved.shipping?.name);
    set("shipAddress", saved.shipping?.address);
    set("shipCity", saved.shipping?.city);
    set("shipPostcode", saved.shipping?.postcode);
  }

  showStep(1);
}

shipSame.addEventListener("change", () => {
  if (!shipSame.checked) return;

  document.getElementById("shipName").value = getVal("billName");
  document.getElementById("shipAddress").value = getVal("billAddress");
  document.getElementById("shipCity").value = getVal("billCity");
  document.getElementById("shipPostcode").value = getVal("billPostcode");
});

next1.addEventListener("click", () => {
  const inputs = [...step1.querySelectorAll("input")].filter(i => i.type !== "checkbox");
  if (!validateStep(inputs)) return;

  saveCheckoutDetails(readDetails());
  showStep(2);
});

back2.addEventListener("click", () => showStep(1));

next2.addEventListener("click", () => {
  const inputs = [...step2.querySelectorAll("input")].filter(i => i.type !== "checkbox");
  if (!validateStep(inputs)) return;

  saveCheckoutDetails(readDetails());
  renderReview();
  showStep(3);
});

back3.addEventListener("click", () => showStep(2));

form.addEventListener("input", (e) => {
  const input = e.target.closest("input");
  if (!input || input.type === "checkbox") return;
  clearFieldError(input);
});
