// scripts/filtered.js
import { fetchSheetData } from "./config.js";

export async function showFilteredProducts(container, category, subcategory) {
  const data = await fetchSheetData();

  const filtered = data.filter(item =>
    item["категория"] === category &&
    item["подкатегория"] === subcategory
  );

  container.innerHTML = `<h2>${subcategory}</h2><div id="products"></div><button id="back">← Назад</button>`;
  const list = document.getElementById("products");

  filtered.forEach(item => {
    if (!item["изображение"]) return;
    const block = document.createElement("div");
    block.className = "product";
    block.innerHTML = `
      <img src="${item["изображение"]}" alt="${item["название"]}" />
      <h3>${item["название"]}</h3>
      <p>${item["описание"]}</p>
      <strong>${item["цена"]} ₽</strong>
    `;
    list.appendChild(block);
  });

  document.getElementById("back").addEventListener("click", () => {
    // Назад к подкатегориям:
    import("./catalog.js").then(mod => mod.showCatalog(container));
  });
}
