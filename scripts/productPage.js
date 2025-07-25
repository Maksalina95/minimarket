import { fetchSheetData } from "./config.js";
import { showFilteredProducts } from "./filtered.js";

// 🧠 Хранилище для текущих товаров и выбранного индекса
let productData = [];
let productIndex = 0;

export function setProductData(data) {
  productData = data;
}

export function setProductIndex(index) {
  productIndex = index;
}

export function getCurrentProduct() {
  return productData[productIndex];
}

// 🏪 Показывает страницу с товарами по категориям
export async function showCatalog(container) {
  container.innerHTML = "<h2>Категории</h2><div id='categories'></div>";
  const data = await fetchSheetData();
  const list = document.getElementById("categories");

  const searchContainer = document.querySelector(".search-container");
  if (searchContainer) {
    searchContainer.style.display = "flex";
  }

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

// 📂 Подкатегории
function showSubcategories(container, data, category) {
  container.innerHTML = `
    <h2>${category}</h2>
    <div id='subcategories'></div>
    <button id="back">← Назад</button>
  `;

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
    showCatalog(container);
  });
}

// 🧾 Страница отдельного товара
export function showProductPage(container, index) {
  const product = productData[index];
  productIndex = index;

  container.innerHTML = `
    <div class="product-card">
      <button class="back-button" id="backToPrevious">Назад</button>
      <img src="${product["изображение"]}" alt="${product["название"]}">
      <h2>${product["название"]}</h2>
      <p class="description">${product["описание"] || ""}</p>
      <div class="price">${product["цена"]} ₽</div>
      <a href="https://wa.me/7XXXXXXXXXX?text=Здравствуйте, меня интересует товар: ${encodeURIComponent(product["название"])}"
         class="whatsapp-btn" target="_blank">
         Заказать в WhatsApp
      </a>
    </div>
  `;

  // 🔙 Назад — просто в историю
  document.getElementById("backToPrevious").addEventListener("click", () => {
    history.back();
  });
}
