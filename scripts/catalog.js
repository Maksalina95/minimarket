import { fetchSheetData } from "./config.js";
import { showFilteredProducts } from "./filtered.js";
import { loadPage } from "./app.js";

export async function showCatalog(container) {
  container.innerHTML = "<h2>Категории</h2><div id='categories'></div>";
  const data = await fetchSheetData();
  const list = document.getElementById("categories");

  const searchContainer = document.querySelector(".search-container");
  if (searchContainer) {
    searchContainer.style.display = "flex";
  }

  const categories = [...new Set(
    data
      .map(item => item["категория"]?.trim())
      .filter(Boolean)
  )];

  list.innerHTML = "";

  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = category;

    btn.addEventListener("click", () => {
  showCategoryPage(container, { category }); // ✅ напрямую
  history.pushState({ page: "category", data: { category } }, "", `#category-${category}`);
});

    list.appendChild(btn);
  });
}

export function showCategoryPage(container, { category }) {
  fetchSheetData().then(data => {
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
      history.back(); // Назад к Каталог
    });
  });
}
