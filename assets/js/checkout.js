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
