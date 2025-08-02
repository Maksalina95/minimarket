import { fetchSheetData } from "./config.js";
import { setProductData, setProductIndex } from "./productPage.js";
import { loadPage } from "./app.js";

export async function showFilteredProducts(container, category, subcategory) {
  const data = await fetchSheetData();

  const filtered = data.filter(item =>
    item["категория"] === category &&
    item["подкатегория"] === subcategory
  );

  container.innerHTML = `
    <h2>${subcategory}</h2>
    <div id="products" class="products-grid"></div>
    <button id="back">← Назад</button>
  `;

  const list = document.getElementById("products");

  filtered.forEach((item, index) => {
    if (!item["изображение"]) return;

    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${item["изображение"]}" alt="${item["название"]}">
      <h3>${item["название"]}</h3>
      <p>${item["описание"] || ""}</p>
      <strong>${item["цена"]} ₽</strong>
    `;

    card.addEventListener("click", () => {
      setProductData(filtered);           // сохраняем список
      setProductIndex(index);             // сохраняем индекс
      loadPage("product", index);         // загружаем карточку
    });

    list.appendChild(card);
  });

  document.getElementById("back").addEventListener("click", () => {
    history.back();
  });
}
