import { fetchSheetData } from "./config.js";
import { isFavorite, toggleFavorite } from "./favorites.js";
import { setProductData, setProductId } from "./productPage.js"; // исправлено
import { loadPage } from "./app.js";

export async function setupSearchGlobal() {
  const input = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearch");
  const searchBtn = document.getElementById("searchBtn");
  const suggestions = document.getElementById("suggestions");

  let allProducts = await fetchSheetData();

  function renderResults(products) {
    const content = document.getElementById("content");
    content.innerHTML = `
      <h2>Результаты поиска</h2>
      <div id="products" class="products-grid"></div>
    `;
    const list = document.getElementById("products");
    list.innerHTML = "";

    if (products.length === 0) {
      list.innerHTML = "<p>Ничего не найдено</p>";
      return;
    }

    products.forEach((item) => {
      if (!item["изображение"]) return;

      const heartClass = isFavorite(item["id"]) ? "heart active" : "heart";

      const block = document.createElement("div");
      block.className = "product-card";
      block.innerHTML = `
        <div class="image-container" style="position:relative;">
          <img src="${item["изображение"]}" alt="${item["название"]}" />
          <span class="${heartClass}" data-id="${item["id"]}" 
            style="position:absolute; top:8px; right:8px; cursor:pointer; user-select:none; font-size:24px; color:red;">❤</span>
        </div>
        <h3>${item["название"]}</h3>
        <p>${item["описание"]}</p>
        <strong>${item["цена"]} ₽</strong>
        <button class="open-product">Открыть</button>
      `;

      // Открыть товар
      block.querySelector(".open-product").addEventListener("click", () => {
        setProductData(products);    // весь список найденных товаров
        setProductId(item.id);
        loadPage("product", item.id);
      });

      // Сердечко
      const heart = block.querySelector(".heart");
      heart.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = heart.getAttribute("data-id");
        toggleFavorite(id);
        heart.classList.toggle("active");
      });

      list.appendChild(block);
    });
  }

  function search(query) {
    const filtered = allProducts.filter(item =>
      item["название"]?.toLowerCase().includes(query) ||
      item["описание"]?.toLowerCase().includes(query)
    );
    renderResults(filtered);
  }

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    clearBtn.style.display = query ? "inline" : "none";

    if (!query) {
      suggestions.innerHTML = "";
      suggestions.style.display = "none";
      return;
    }

    const filtered = allProducts.filter(item =>
      item["название"]?.toLowerCase().includes(query) ||
      item["описание"]?.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      suggestions.innerHTML = "<li>Ничего не найдено</li>";
    } else {
      suggestions.innerHTML = filtered.slice(0, 5).map(p => `
        <li>${p["название"]}</li>
      `).join("");
    }

    suggestions.style.display = "block";
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.style.display = "none";
    suggestions.innerHTML = "";
    suggestions.style.display = "none";
  });

  suggestions.addEventListener("click", e => {
    if (e.target.tagName === "LI") {
      input.value = e.target.textContent;
      suggestions.innerHTML = "";
      suggestions.style.display = "none";
      search(input.value.toLowerCase());
    }
  });

  searchBtn.addEventListener("click", () => {
    const query = input.value.trim().toLowerCase();
    if (query) {
      suggestions.innerHTML = "";
      suggestions.style.display = "none";
      search(query);
    }
  });

  // Закрытие подсказок при клике вне
  document.addEventListener("click", (e) => {
    if (!suggestions.contains(e.target) && e.target !== input) {
      suggestions.style.display = "none";
    }
  });
}
