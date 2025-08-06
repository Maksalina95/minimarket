import { fetchSheetData } from "./config.js";
import { loadPage } from "./app.js"; // не забудь импорт, если не было

function getFavoritesKey() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? `favorites_${user.phone}` : null;
}

export function getFavorites() {
  const key = getFavoritesKey();
  if (!key) return [];
  const favs = localStorage.getItem(key);
  return favs ? JSON.parse(favs) : [];
}

export function isFavorite(productId) {
  const favorites = getFavorites();
  return favorites.includes(productId);
}

function saveFavorites(favorites) {
  const key = getFavoritesKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(favorites));
}

export function toggleFavorite(productId) {
  const favorites = getFavorites();
  const index = favorites.indexOf(productId);

  if (index === -1) {
    favorites.push(productId);
  } else {
    favorites.splice(index, 1);
  }

  saveFavorites(favorites);
  updateFavoriteIcon(productId);
}

// Обновление иконки ♥
export function updateFavoriteIcon(productId) {
  const favorites = getFavorites();
  const icon = document.querySelector(`[data-favorite-id="${productId}"]`);
  if (icon) {
    icon.textContent = favorites.includes(productId) ? "♥" : "♡";
  }
}

// Показываем страницу избранного
export async function showFavorites(container) {
  const allData = await fetchSheetData();
  const favorites = getFavorites();

  const favoriteItems = allData.filter(item =>
    favorites.includes(item["id"] || item["ид"])
  );

  container.innerHTML = `
    <h2>Избранное</h2>
    <div class="products-grid">
      ${
        favoriteItems.length > 0
          ? favoriteItems
              .map(item => {
                const id = item["id"] || item["ид"];
                const name = item["name"] || item["название"];
                const image = item["image"] || item["изображение"];
                const price = item["price"] || item["цена"];

                return `
                  <div class="product-card" data-id="${id}">
                    <img src="${image}" alt="${name}" />
                    <h3>${name}</h3>
                    <p>${price} ₽</p>
                    <button data-favorite-id="${id}">
                      ${favorites.includes(id) ? "♥" : "♡"}
                    </button>
                  </div>
                `;
              })
              .join("")
          : "<p>У вас пока нет избранных товаров.</p>"
      }
    </div>
  `;

  // Обработчики кнопок ♥
  container.querySelectorAll("button[data-favorite-id]").forEach(button => {
    const id = button.getAttribute("data-favorite-id");
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(id);
    });
  });

  // Открытие карточки
  container.querySelectorAll(".product-card").forEach(card => {
    const id = card.getAttribute("data-id");
    card.addEventListener("click", () => {
      loadPage("product", id);
    });
  });
}

export { showFavorites as showFavoritesPage };
