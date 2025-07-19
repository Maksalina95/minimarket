// scripts/catalog.js
import { fetchSheetData } from "./config.js";

export async function showCatalog(container) {
  container.innerHTML = "<h2>Категории</h2><div id='categories'></div>";
  const data = await fetchSheetData();
  const list = document.getElementById("categories");

  const categories = [...new Set(data.map(item => item["категория"]).filter(Boolean))];

  categories.forEach(cat => {
    const block = document.createElement("div");
    block.className = "category";
    block.textContent = cat;
    list.appendChild(block);
  });
}
