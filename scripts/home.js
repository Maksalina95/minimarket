// scripts/home.js
import { fetchSheetData } from "./config.js";

export async function showHome(container) {
  container.innerHTML = "<h2>Товары</h2><div id='products'></div>";
  const data = await fetchSheetData();
  const list = document.getElementById("products");

  data.forEach(item => {
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
