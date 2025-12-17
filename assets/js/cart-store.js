import { PRODUCTS, getProductById } from "./products.js";

const CART_KEY = "cart_v1";
const CHECKOUT_KEY = "checkout_v1";
const LAST_ORDER_KEY = "last_order_v1";

function safeParse(json, fallback) {
  try { return JSON.parse(json); } catch { return fallback; }
}

export function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  const cart = safeParse(raw, {});
  if (!cart || typeof cart !== "object") return {};
  return cart;
}

export function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

export function cartCount(cart = getCart()) {
  return Object.values(cart).reduce((sum, qty) => sum + Number(qty || 0), 0);
}

export function addToCart(productId, qty = 1) {
  const p = getProductById(productId);
  if (!p) return;

  const cart = getCart();
  cart[productId] = (Number(cart[productId] || 0) + Number(qty || 0));
  if (cart[productId] < 1) delete cart[productId];
  setCart(cart);
}

export function updateQty(productId, qty) {
  const cart = getCart();
  const n = Number(qty);
  if (!Number.isFinite(n) || n < 1) {
    delete cart[productId];
  } else {
    cart[productId] = Math.floor(n);
  }
  setCart(cart);
}

export function removeItem(productId) {
  const cart = getCart();
  delete cart[productId];
  setCart(cart);
}

export function getCartLines() {
  const cart = getCart();
  const lines = Object.entries(cart)
    .map(([id, qty]) => {
      const product = getProductById(id);
      if (!product) return null;
      const quantity = Number(qty);
      const lineTotal = quantity * product.price;
      return { product, quantity, lineTotal };
    })
    .filter(Boolean);

  const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  return { lines, total };
}

export function formatGBP(amount) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount);
}

export function saveCheckoutDetails(details) {
  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(details));
}
export function getCheckoutDetails() {
  return safeParse(localStorage.getItem(CHECKOUT_KEY), null);
}
export function clearCheckoutDetails() {
  localStorage.removeItem(CHECKOUT_KEY);
}

export function saveLastOrder(order) {
  localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
}
export function getLastOrder() {
  return safeParse(localStorage.getItem(LAST_ORDER_KEY), null);
}
