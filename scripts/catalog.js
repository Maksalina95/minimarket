// scripts/catalog.js
import { fetchSheetData } from "./config.js";
import { showFilteredProducts } from "./filtered.js"; // мы добавим этот файл

export async function showCatalog(container) {
  container.innerHTML = "<h2>Категории</h2><div id='categories'></div>";
  const data = await fetchSheetData();
  const list = document.getElementById("categories");

  const categories = [...new Set(data.map(item => item["категория"]).filter(Boolean))];

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = cat;

    btn.addEventListener("click", () => {
      showFilteredProducts(container, cat); // при клике — показать товары этой категории
    });

    list.appendChild(btn);
  });
}
