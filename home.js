import { initHeader, getProducts, money, escapeHtml } from "./common.js";
const headerReady = initHeader();
(async () => {
  const box = document.getElementById("featured"), settings = await headerReady;
  const hero = document.getElementById("heroVisual");
  if (settings.heroImageUrl) {
    const img = document.createElement("img"); img.src = settings.heroImageUrl; img.alt = "Featured food at the campus cafe";
    img.addEventListener("error", () => { hero.remove(); document.querySelector(".hero").classList.remove("has-visual"); });
    hero.append(img); hero.classList.remove("hidden"); hero.setAttribute("aria-hidden", "false"); document.querySelector(".hero").classList.add("has-visual");
  } else hero.remove();
  try {
    const items = (await getProducts()).filter(p => p.available).slice(0, 4);
    box.innerHTML = items.map(p => `
      <article class="product-card">
        <img loading="lazy" decoding="async" src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.name)}" onerror="this.style.display='none'">
        <div class="product-info">
          <span class="tag">${escapeHtml(p.category)}</span>
          <h3>${escapeHtml(p.name)}</h3>
          <p class="muted">${escapeHtml(p.description)}</p>
          <div class="price-row"><strong>${money(p.price)}</strong><a class="small-btn" href="menu.html">Order</a></div>
        </div>
      </article>`).join("");
  } catch (err) { console.error(err); }
})();