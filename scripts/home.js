// scripts/home.js
import { fetchSheetData } from "./config.js";

let allProducts = [];

export async function showHome(container) {
  container.innerHTML = `
    <h2>Товары</h2>
    <div id="products"></div>
  `;

  const data = await fetchSheetData();
  allProducts = data;

  renderProducts(data);

  setupSearch();
}

function renderProducts(products) {
  const list = document.getElementById("products");
  list.innerHTML = "";

  products.forEach(item => {
    if (!item["изображение"]) return;
    const block = document.createElement("div");
    block.className = "product";
    block.innerHTML = `
      <img src="${item["изображение"]}" alt="${item["название"]}" />
      <h3>${item["название"]}</h3>
      <p>${item["описание"]}</p>
      <strong>${item["цена"]} ₽</strong>
    `;
    list.appendChild(block);
  });
}

function setupSearch() {
  const input = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearch");
  const suggestions = document.getElementById("suggestions");

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();

    // Показать кнопку очистки
    clearBtn.style.display = query ? "inline" : "none";

    if (!query) {
      suggestions.innerHTML = "";
      renderProducts(allProducts);
      return;
    }

    const filtered = allProducts.filter(item =>
      item["название"]?.toLowerCase().includes(query) ||
      item["описание"]?.toLowerCase().includes(query)
    );

    // Показать подсказки
    suggestions.innerHTML = filtered.slice(0, 5).map(p => `
      <li>${p["название"]}</li>
    `).join("");

    // Перерисовать список товаров
    renderProducts(filtered);
  });

  // Очистка поиска
  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.style.display = "none";
    suggestions.innerHTML = "";
    renderProducts(allProducts);
  });

  // Клик по подсказке
  suggestions.addEventListener("click", e => {
    if (e.target.tagName === "LI") {
      input.value = e.target.textContent;
      suggestions.innerHTML = "";
      const filtered = allProducts.filter(p =>
        p["название"]?.toLowerCase().includes(input.value.toLowerCase())
      );
      renderProducts(filtered);
    }
  });
}
