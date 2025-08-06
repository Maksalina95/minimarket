import { fetchSheetData } from "./config.js";
import { setProductData, setProductId } from "./productPage.js";  // исправлено здесь
import { loadPage } from "./app.js";
import { toggleFavorite, isFavorite } from "./favorites.js";

export async function showHome(container) {
  container.innerHTML = `
    <h2>Товары</h2>
    <div id="products" class="products-grid"></div>
  `;

  const data = await fetchSheetData();
  setProductData(data); // сохраняем данные товаров глобально

  const productsContainer = document.getElementById("products");

  data.forEach((item) => {
    if (!item["изображение"]) return;

    const { id, название, изображение, цена } = item;

    const card = document.createElement("div");
    card.className = "product-card";

    const favIcon = isFavorite(id) ? "❤️" : "🤍";

    card.innerHTML = `
      <img src="${изображение}" alt="${название}" />
      <h3>${название}</h3>
      <p>${цена}</p>
      <button class="fav-btn" data-id="${id}">${favIcon}</button>
    `;

    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("fav-btn")) return;
      setProductId(id);
      loadPage("product", id);
    });

    card.querySelector(".fav-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(id);
      e.target.textContent = isFavorite(id) ? "❤️" : "🤍";
    });

    productsContainer.appendChild(card);
  });
}
