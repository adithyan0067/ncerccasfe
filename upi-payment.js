import { initHeader, getSettings, money, escapeHtml, showMsg } from "./common.js";
initHeader();
const draft = JSON.parse(localStorage.getItem("canteenOrderDraft") || "null"), msg = document.getElementById("paymentMsg");
if (!draft || draft.paymentMethod !== "UPI") { location.replace(draft ? "payment.html" : "cart.html"); }
else document.getElementById("paymentOrder").innerHTML = `<b>${escapeHtml(draft.orderCode)}</b><span>${draft.items.map(i => `${escapeHtml(i.name)} × ${i.qty}`).join(", ")}</span><strong>${money(draft.total)}</strong>`;
getSettings().then(s => {
  if (s.paymentQrUrl) { const img=document.getElementById("paymentQr"); img.src=s.paymentQrUrl; img.classList.remove("hidden"); document.getElementById("qrPlaceholder").classList.add("hidden"); }
  document.getElementById("upiHint").textContent = s.upiId ? `UPI ID: ${s.upiId}` : "Ask your admin to add the canteen UPI ID and QR code.";
  if (s.upiId && draft) {
    const params = new URLSearchParams({ pa:s.upiId, pn:s.upiName||"Campus Canteen", am:draft.total.toFixed(2), cu:"INR", tr:draft.orderCode, tn:`Order ${draft.orderCode}` });
    document.getElementById("gpayLink").href = `gpay://upi/pay?${params.toString()}`;
    document.getElementById("paytmLink").href = `paytmmp://upi/pay?${params.toString()}`;
    document.getElementById("upiLink").href = `upi://pay?${params.toString()}`;
    ["gpayLink","paytmLink","upiLink"].forEach(id=>document.getElementById(id).onclick=()=>setTimeout(()=>showMsg(msg,"After paying in your UPI app, return here and upload the payment receipt screenshot.","success"),500));
  } else ["gpayLink","paytmLink","upiLink"].forEach(id=>document.getElementById(id).addEventListener("click",e=>{e.preventDefault();showMsg(msg,"The admin needs to add the canteen UPI ID before app payment links can open. You can still scan the QR.","error");}));
}).catch(console.warn);
function compressImage(file) { return new Promise((resolve,reject)=>{const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{const scale=Math.min(1,720/Math.max(img.width,img.height)),canvas=document.createElement("canvas");canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);URL.revokeObjectURL(url);resolve(canvas.toDataURL("image/jpeg",.5));};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("Could not read that image."));};img.src=url;}); }
document.getElementById("proofFile").addEventListener("change",async e=>{const file=e.target.files?.[0];if(!file||!draft)return;if(!file.type.startsWith("image/")){showMsg(msg,"Choose an image file.","error");return;}try{draft.paymentProof=await compressImage(file);document.getElementById("proofName").textContent=`${file.name} · compressed and ready`;const preview=document.getElementById("proofPreview");preview.src=draft.paymentProof;preview.classList.remove("hidden");document.getElementById("paymentPending").checked=false;}catch(err){showMsg(msg,err.message,"error");}});
document.getElementById("paymentPending").addEventListener("change",e=>{if(!draft)return;if(e.target.checked)draft.paymentStatus="Pending";else if(draft.paymentProof)draft.paymentStatus="Proof submitted";});
document.getElementById("continueToReview").onclick=()=>{if(!draft)return;if(!draft.paymentProof){showMsg(msg,"Upload your payment screenshot before continuing. The admin uses it to verify your payment.","error");document.getElementById("proofFile").focus();return;}draft.paymentStatus=document.getElementById("paymentPending").checked?"Pending":(draft.paymentProof?"Proof submitted":"Pending");localStorage.setItem("canteenOrderDraft",JSON.stringify(draft));location.href="order-confirmation.html";};