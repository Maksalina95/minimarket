import { fetchSheetData } from "./config.js";
import { showFilteredProducts } from "./filtered.js";

export async function showCatalog(container) {
  // Перерисовываем всё с нуля
  container.innerHTML = "<h2>Категории</h2><div id='categories'></div>";

  const data = await fetchSheetData();
  const list = document.getElementById("categories");

  // Показываем поиск (если он есть)
  const searchContainer = document.querySelector(".search-container");
  if (searchContainer) {
    searchContainer.style.display = "flex";
  }

  // Получаем уникальные категории (без пустых и undefined)
  const categories = [...new Set(
    data
      .map(item => item["категория"]?.trim())
      .filter(cat => !!cat)
  )];

  list.innerHTML = ""; // очищаем перед отрисовкой

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
  container.innerHTML = `
    <h2>${category}</h2>
    <div id='subcategories'></div>
    <button id="back">← Назад</button>
  `;
  const list = document.getElementById("subcategories");

  // Получаем подкатегории без дублей и пустых
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
      showFilteredProducts(container, category, sub);
    });

    list.appendChild(btn);
  });

  // Назад в каталог
  document.getElementById("back").addEventListener("click", () => {
    showCatalog(container);
  });
}
