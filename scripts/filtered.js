import { fetchSheetData } from "./config.js";
import { setProductData, setProductId } from "./productPage.js";
import { loadPage } from "./app.js";
import { toggleFavorite, isFavorite } from "./favorites.js"; // 💡 добавляем

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

    const { id, название, изображение, описание, цена } = item;

    const card = document.createElement("div");
    card.classList.add("product-card");

    const favoriteIcon = isFavorite(id) ? "❤️" : "🤍";

    card.innerHTML = `
      <img src="${изображение}" alt="${название}">
      <h3>${название}</h3>
      <p>${описание || ""}</p>
      <strong>${цена} ₽</strong>
      <button class="favorite-btn" data-id="${id}">${favoriteIcon}</button>
    `;

    // 📌 Открытие товара при клике на саму карточку
    card.addEventListener("click", (e) => {
      // Исключаем клик по "❤️"
      if (e.target.classList.contains("favorite-btn")) return;

      setProductData(filtered);
      setProductId(item.id);
loadPage("product", item.id);
    });

    // 📌 Клик по "❤️"
    const favBtn = card.querySelector(".favorite-btn");
    favBtn.addEventListener("click", () => {
      toggleFavorite(id);
      favBtn.innerText = isFavorite(id) ? "❤️" : "🤍";
    });

    list.appendChild(card);
  });

  document.getElementById("back").addEventListener("click", () => {
    history.back();
  });
}
