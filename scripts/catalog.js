// scripts/catalog.js
import { fetchSheetData } from "./config.js";
import { showFilteredProducts } from "./filtered.js";

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
      showSubcategories(container, data, cat);
    });

    list.appendChild(btn);
  });
}

function showSubcategories(container, data, category) {
  container.innerHTML = `<h2>${category}</h2><div id='subcategories'></div><button id="back">← Назад</button>`;
  const list = document.getElementById("subcategories");

  const subcats = [...new Set(
    data
      .filter(item => item["категория"] === category)
      .map(item => item["подкатегория"])
      .filter(Boolean)
  )];

  subcats.forEach(sub => {
    const btn = document.createElement("button");
    btn.className = "subcategory-btn";
    btn.textContent = sub;

    btn.addEventListener("click", () => {
      showFilteredProducts(container, category, sub);
    });

    list.appendChild(btn);
  });

  document.getElementById("back").addEventListener("click", () => {
    showCatalog(container); // ← вернуться к списку категорий
  });
}
