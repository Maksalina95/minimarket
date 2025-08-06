import { getFavorites, toggleFavorite } from "./favorites.js";

let products = [];
let currentProductId = null;

export function setProductData(data) {
  products = data;
}

export function setProductId(id) {
  currentProductId = id;
}

export function showProductPage(container) {
  if (!products.length) {
    container.innerHTML = "<p>Товары не загружены.</p>";
    return;
  }

  const product = products.find(p => p.id === currentProductId);
  if (!product) {
    container.innerHTML = `
      <p>Товар не найден.</p>
      <button id="backBtn">← Назад</button>
    `;
    document.getElementById("backBtn").addEventListener("click", () => history.back());
    return;
  }

  const { id, название, изображение, описание, цена } = product;
  const isFav = getFavorites().includes(id);

  container.innerHTML = `
    <div class="product-detail">
      <button id="backBtn">← Назад</button>
      <h2>${название}</h2>
      <img src="${изображение}" alt="${название}" onerror="this.src='placeholder.jpg'" />
      <p><strong>Цена:</strong> ${цена}</p>
      <p><strong>Описание:</strong> ${описание || "Нет описания"}</p>

      <div class="favorite">
        <span id="favoriteIcon" style="font-size: 1.5em; cursor: pointer;">
          ${isFav ? "❤️" : "🤍"}
        </span> В избранное
      </div>
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", () => {
    history.back();
  });

  document.getElementById("favoriteIcon").addEventListener("click", () => {
    toggleFavorite(id);
    showProductPage(container); // перерисовываем для обновления иконки
  });
}
