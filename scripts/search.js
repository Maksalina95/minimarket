import { fetchSheetData } from "./config.js";

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
      <div id="products"></div>
    `;
    const list = document.getElementById("products");
    list.innerHTML = "";

    if (products.length === 0) {
      list.innerHTML = "<p>Ничего не найдено</p>";
      return;
    }

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
      return;
    }

    const filtered = allProducts.filter(item =>
      item["название"]?.toLowerCase().includes(query) ||
      item["описание"]?.toLowerCase().includes(query)
    );

    suggestions.innerHTML = filtered.slice(0, 5).map(p => `
      <li>${p["название"]}</li>
    `).join("");
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.style.display = "none";
    suggestions.innerHTML = "";
  });

  suggestions.addEventListener("click", e => {
    if (e.target.tagName === "LI") {
      input.value = e.target.textContent;
      suggestions.innerHTML = "";
      search(input.value.toLowerCase());
    }
  });

  searchBtn.addEventListener("click", () => {
    const query = input.value.trim().toLowerCase();
    if (query) {
      suggestions.innerHTML = "";
      search(query);
    }
  });
}
