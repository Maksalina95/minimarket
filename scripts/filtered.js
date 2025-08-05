import { fetchSheetData } from "./config.js";
import { setProductData, setProductIndex } from "./productPage.js";
import { loadPage } from "./app.js";
import { isFavorite, toggleFavorite } from "./favorites.js"; // ➕ добавили

export async function showFilteredProducts(container, category, subcategory) {
  const data = await fetchSheetData();

  const filtered = data.filter(item =>
    item["категория"] === category &&
    item["подкатегория"] === subcategory
  );

  container.innerHTML = `
    <h2>${subcategory}</h2>
    <div id="products" class="products-grid"></div>
    <button id="back">← Назад</button>
  `;

  const list = document.getElementById("products");

  filtered.forEach((item, index) => {
    if (!item["изображение"]) return;

    const heartClass = isFavorite(item["id"]) ? "heart active" : "heart";

    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <div class="image-container" style="position:relative;">
        <img src="${item["изображение"]}" alt="${item["название"]}">
        <span class="${heartClass}" data-id="${item["id"]}"
          style="position:absolute; top:8px; right:8px; cursor:pointer; font-size:24px; user-select:none; color:red;">❤</span>
      </div>
      <h3>${item["название"]}</h3>
      <p>${item["описание"] || ""}</p>
      <strong>${item["цена"]} ₽</strong>
    `;

    // Обработка сердечка
    const heart = card.querySelector(".heart");
    heart.addEventListener("click", (e) => {
      e.stopPropagation(); // не открывать карточку при клике на ❤️
      const id = heart.getAttribute("data-id");
      toggleFavorite(id);
      heart.classList.toggle("active");
    });

    // Клик по карточке — открытие товара
    card.addEventListener("click", () => {
      setProductData(filtered);       // сохраняем список
      setProductIndex(index);         // сохраняем индекс
      loadPage("product", index);     // открываем карточку
    });

    list.appendChild(card);
  });

  document.getElementById("back").addEventListener("click", () => {
    history.back();
  });
}
