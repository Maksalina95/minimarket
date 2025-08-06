import { fetchSheetData } from "./config.js";
import { loadPage } from "./app.js";

// Главная функция — показ категорий
export async function showCatalog(container) {
  container.innerHTML = "<h2>Категории</h2><div id='categories'></div>";
  const data = await fetchSheetData();

  const list = document.getElementById("categories");

  const categories = [...new Set(
    data.map(item => item["категория"]?.trim()).filter(Boolean)
  )];

  list.innerHTML = "";

  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = category;

    // Вместо history.pushState + showCategoryPage — вызываем loadPage!
    btn.addEventListener("click", () => {
      loadPage("category", { category });
    });

    list.appendChild(btn);
  });
}

// Показ подкатегорий для выбранной категории
export async function showCategoryPage(container, { category }) {
  const data = await fetchSheetData();

  container.innerHTML = `
    <h2>${category}</h2>
    <div id="subcategories"></div>
    <button id="back">← Назад</button>
  `;

  const list = document.getElementById("subcategories");

  const subcats = [...new Set(
    data
      .filter(item => item["категория"]?.trim() === category)
      .map(item => item["подкатегория"]?.trim())
      .filter(Boolean)
  )];

  list.innerHTML = "";

  subcats.forEach(sub => {
    const btn = document.createElement("button");
    btn.className = "subcategory-btn";
    btn.textContent = sub;

    btn.addEventListener("click", () => {
      loadPage("filtered", { category, subcategory: sub });
    });

    list.appendChild(btn);
  });

  document.getElementById("back").addEventListener("click", () => {
    loadPage("catalog");
  });
}
