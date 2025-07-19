// app.js
import { baseUrl } from './config.js';

document.addEventListener("DOMContentLoaded", () => {
  loadProducts(); // Загружаем товары на главную
  loadPage();     // Загружаем страницу по хешу (если есть)
});

window.addEventListener("hashchange", loadPage);

// Загрузка товаров из Google Таблицы
function loadProducts() {
  const container = document.getElementById('main-content');
  container.innerHTML = `<h2 class="title">Новинки</h2><div class="products" id="products"></div>`;

  fetch(baseUrl)
    .then(res => res.json())
    .then(data => {
      const productsEl = document.getElementById('products');
      data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${item.фото}" alt="${item.название}" />
          <h3>${item.название}</h3>
          <p>${item.цена} ₽</p>
        `;
        productsEl.appendChild(card);
      });
    })
    .catch(error => {
      container.innerHTML = `<p>Ошибка загрузки товаров 😢</p>`;
      console.error('Ошибка загрузки:', error);
    });
}

function loadPage() {
  const page = location.hash.slice(1);
  const panel = document.getElementById('slide-panel');
  if (!page) return;

  fetch(`${page}.html`)
    .then(res => res.text())
    .then(html => {
      panel.innerHTML = html;
      panel.classList.add('open');
    })
    .catch(() => {
      panel.innerHTML = '<p>Страница не найдена.</p>';
    });
}

document.getElementById('close-btn').addEventListener('click', () => {
  document.getElementById('slide-panel').classList.remove('open');
});
