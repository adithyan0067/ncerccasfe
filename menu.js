import { initHeader, getProducts, getCart, saveCart, updateCartCount, money, escapeHtml } from "./common.js";
initHeader();
const grid=document.getElementById("menuGrid"), category=document.getElementById("category"), favoritesToggle=document.getElementById("favoritesToggle");let products=[],onlyFavorites=false;
function readFavorites(){try{return new Set(JSON.parse(localStorage.getItem("canteenFavorites")||"[]"));}catch{return new Set();}}
let favorites=readFavorites();
function render(){
 const q=document.getElementById("search").value.trim().toLowerCase(),c=category.value,sort=document.getElementById("sort").value;
 let items=products.filter(p=>p.available&&(`${p.name} ${p.category} ${p.description||""}`).toLowerCase().includes(q)&&(c==="All"||p.category===c)&&(!onlyFavorites||favorites.has(p.id)));
 if(sort==="low")items.sort((a,b)=>a.price-b.price);if(sort==="high")items.sort((a,b)=>b.price-a.price);
 grid.innerHTML=items.length?items.map(p=>`<article class="product-card"><div class="product-image-wrap"><img loading="lazy" decoding="async" src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.name)}" onerror="this.style.display='none'"><button type="button" class="favorite-btn" data-favorite="${escapeHtml(p.id)}" aria-label="${favorites.has(p.id)?"Remove":"Save"} ${escapeHtml(p.name)} ${favorites.has(p.id)?"from":"to"} favourites" aria-pressed="${favorites.has(p.id)}">${favorites.has(p.id)?"♥":"♡"}</button></div><div class="product-info"><span class="tag">${escapeHtml(p.category)}</span><h3>${escapeHtml(p.name)}</h3><p class="muted">${escapeHtml(p.description)}</p><small>⏱ ${escapeHtml(p.prepTime)}</small><div class="price-row"><strong>${money(p.price)}</strong><button class="small-btn" data-add="${escapeHtml(p.id)}">Add +</button></div></div></article>`).join(""):`<div class="empty menu-empty"><div>${onlyFavorites?"♡":"🔎"}</div><h2>${onlyFavorites?"No favourites saved yet":"No items found"}</h2><p>${onlyFavorites?"Tap the heart on any food item to save it on this device.":"Try another search or category."}</p>${onlyFavorites?"<button type=\"button\" class=\"small-btn\" data-clear-favorites>Show all food</button>":""}</div>`;
 favoritesToggle.setAttribute("aria-pressed",String(onlyFavorites));favoritesToggle.textContent=onlyFavorites?"♥ Showing favourites":"♡ My favourites";
}
grid.addEventListener("click",e=>{
 const favorite=e.target.closest("[data-favorite]");if(favorite){const id=favorite.dataset.favorite;favorites.has(id)?favorites.delete(id):favorites.add(id);localStorage.setItem("canteenFavorites",JSON.stringify([...favorites]));render();return;}
 if(e.target.closest("[data-clear-favorites]")){onlyFavorites=false;render();return;}
 const btn=e.target.closest("[data-add]");if(!btn)return;const id=btn.dataset.add,cart=getCart(),item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart(cart);updateCartCount();btn.textContent="Added ✓";setTimeout(()=>{if(btn.isConnected)btn.textContent="Add +";},800);
});
favoritesToggle.addEventListener("click",()=>{onlyFavorites=!onlyFavorites;render();});
["search","category","sort"].forEach(id=>document.getElementById(id).addEventListener("input",render));
(async()=>{grid.innerHTML=`<div class="empty"><h2>Loading menu…</h2></div>`;try{products=await getProducts();[...new Set(products.map(p=>p.category))].sort().forEach(c=>{const o=document.createElement("option");o.textContent=c;category.appendChild(o);});render();}catch(err){console.error(err);grid.innerHTML=`<div class="empty"><div>⚠️</div><h2>Could not load the menu</h2><p>Check firebase-config.js and your Firestore rules.</p></div>`;}})();