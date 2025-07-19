import { baseUrl } from './config.js';

async function loadProducts() {
  const container = document.getElementById('products');
  if (!container) return;

  try {
    const res = await fetch(baseUrl);
    const data = await res.json();

    container.innerHTML = ''; // Очищаем перед подгрузкой

    data.forEach(item => {
      // Если нет изображения — не показываем товар
      if (!item.изображение) return;

      const card = document.createElement('div');
      card.className = 'product-card';

      card.innerHTML = `
        <img src="${item.изображение}" alt="${item.название}" />
        <h3>${item.название || ''}</h3>
        <p>${item.описание || ''}</p>
        <strong>${item.цена ? item.цена + ' ₽' : ''}</strong>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error('Ошибка при загрузке товаров:', err);
    container.innerHTML = '<p>Не удалось загрузить товары. Попробуйте позже.</p>';
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);
