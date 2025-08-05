// favorites.js

// Получение массива избранных id из localStorage
export function getFavorites() {
  const stored = localStorage.getItem("favorites");
  return stored ? JSON.parse(stored) : [];
}

// Проверка, находится ли товар в избранном
export function isFavorite(id) {
  const favorites = getFavorites();
  return favorites.includes(id);
}

// Переключение состояния избранного: добавить или удалить
export function toggleFavorite(id) {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  if (index === -1) {
    favorites.push(id);
  } else {
    favorites.splice(index, 1);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
