import { initHeader, money, escapeHtml, showMsg } from "./common.js";
initHeader();
const draft = JSON.parse(localStorage.getItem("canteenOrderDraft") || "null");
const msg = document.getElementById("paymentMsg");
if (!draft) { document.querySelector(".payment-options").innerHTML = `<div class="empty"><h2>No order details found</h2><a class="btn primary" href="cart.html">Return to cart</a></div>`; }
else document.getElementById("paymentOrder").innerHTML = `<b>${escapeHtml(draft.orderCode)}</b><span>${draft.items.map(i => `${escapeHtml(i.name)} × ${i.qty}`).join(", ")}</span><strong>${money(draft.total)}</strong>`;
if (draft) document.getElementById("continuePayment").onclick = () => {
  if (!draft) return;
  const method = document.querySelector('[name="paymentMethod"]:checked').value;
  draft.paymentMethod = method === "cash" ? "Cash on delivery" : "UPI";
  draft.paymentStatus = method === "cash" ? "Pay on delivery" : "Pending";
  draft.paymentProof = "";
  localStorage.setItem("canteenOrderDraft", JSON.stringify(draft));
  location.href = method === "cash" ? "order-confirmation.html" : "upi-payment.html";
};