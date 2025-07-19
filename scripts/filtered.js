// scripts/filtered.js
import { fetchSheetData } from "./config.js";

export async function showFilteredProducts(container, category) {
  const data = await fetchSheetData();
  const filtered = data.filter(item => item["категория"] === category);

  container.innerHTML = `<h2>${category}</h2><div id="products"></div>`;
  const list = document.getElementById("products");

  filtered.forEach(item => {
    if (!item["фото"]) return;
    const block = document.createElement("div");
    block.className = "product";
    block.innerHTML = `
      <img src="${item["фото"]}" alt="${item["название"]}" />
      <h3>${item["название"]}</h3>
      <p>${item["описание"]}</p>
      <strong>${item["цена"]} ₽</strong>
    `;
    list.appendChild(block);
  });
}
