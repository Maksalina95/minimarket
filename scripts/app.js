import { baseUrl } from './config.js';

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadPage();
});

window.addEventListener("hashchange", loadPage);

async function loadProducts() {
  try {
    const res = await fetch(baseUrl);
    const products = await res.json();

    const container = document.getElementById("product-list");
    container.innerHTML = ""; // очищаем перед загрузкой

    products.forEach(product => {
      if (!product.изображение) return; // пропустить без картинки

      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${product.изображение}" alt="${product.название}" />
        <h3>${product.название}</h3>
        <p class="price">${product.цена} ₽</p>
        <p class="description">${product.описание || ''}</p>
        <p class="brand">${product.бренд || ''}</p>
        <button onclick="openWhatsApp('${product.название}', '${product.цена}')">Заказать</button>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Ошибка при загрузке товаров:", error);
  }
}

function openWhatsApp(name, price) {
  const message = `Здравствуйте! Хочу заказать: ${name} за ${price} ₽`;
  const phone = 'YOUR_PHONE_NUMBER'; // замени на номер
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

function loadPage() {
  const page = location.hash.replace("#", "") || "main";
  fetch(`${page}.html`)
    .then(res => res.text())
    .then(html => {
      document.getElementById("page-content").innerHTML = html;
    });
}
