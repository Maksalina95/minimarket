import { isFavorite, toggleFavorite } from "./favorites.js"; // ➕ Добавили

// Массив товаров и текущий индекс
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

export function showProductPage(container, index, from) {
  const product = productData[index];
  productIndex = index;

  // Сохраняем в history откуда пришли (например, из подкатегории)
  history.pushState({ page: "product", data: { index, from } }, "", "");

  const isFav = isFavorite(product["id"]);
  const heartClass = isFav ? "heart active" : "heart";

  container.innerHTML = `
    <div class="product-card">
      <button class="back-button" id="backToPrevious">← Назад</button>
      <div class="image-container" style="position:relative;">
        <img src="${product["изображение"]}" alt="${product["название"]}">
        <span class="${heartClass}" data-id="${product["id"]}"
          style="position:absolute; top:8px; right:8px; cursor:pointer; font-size:28px; color:red; user-select:none;">❤</span>
      </div>
      <h2>${product["название"]}</h2>
      <p class="description">${product["описание"] || ""}</p>
      <div class="price">${product["цена"]} ₽</div>
      <a href="https://wa.me/7XXXXXXXXXX?text=Здравствуйте, меня интересует товар: ${encodeURIComponent(product["название"])}"
        class="whatsapp-btn" target="_blank">
        Заказать в WhatsApp
      </a>
    </div>
  `;

  // Обработка "Назад"
  document.getElementById("backToPrevious").addEventListener("click", () => {
    history.back();
  });

  // Обработка сердечка
  const heart = container.querySelector(".heart");
  heart.addEventListener("click", (e) => {
    e.stopPropagation();
    const id = heart.getAttribute("data-id");
    toggleFavorite(id);
    heart.classList.toggle("active");
  });
}
