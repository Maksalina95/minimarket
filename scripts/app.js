import { baseUrl } from './config.js';

// Загружаем данные из таблицы
async function fetchData() {
  const response = await fetch(baseUrl);
  const data = await response.json();
  return data;
}

// Загружаем последние товары на главную
export async function loadMain() {
  const container = document.getElementById('content');
  container.innerHTML = '<p>Загрузка товаров...</p>';

  try {
    const data = await fetchData();

    const reversed = [...data].reverse(); // показываем последние товары
    const items = reversed
      .filter(item => item.фото) // только с фото
      .map(item => `
        <div class="product">
          <img src="${item.фото}" alt="${item.название}" width="200" />
          <h3>${item.название}</h3>
          <p>${item.цена} ₽</p>
        </div>
      `)
      .join('');

    container.innerHTML = `<div class="products">${items}</div>`;
  } catch (error) {
    container.innerHTML = `<p>Ошибка загрузки: ${error.message}</p>`;
  }
}

// Загрузка категорий (пока просто выводим список уникальных)
export async function loadCatalog() {
  const container = document.getElementById('content');
  container.innerHTML = '<p>Загрузка категорий...</p>';

  try {
    const data = await fetchData();
    const categories = [...new Set(data.map(item => item.категория).filter(Boolean))];

    const list = categories
      .map(cat => `<div class="category">${cat}</div>`)
      .join('');

    container.innerHTML = `<h2>Категории</h2>${list}`;
  } catch (error) {
    container.innerHTML = `<p>Ошибка загрузки: ${error.message}</p>`;
  }
}
