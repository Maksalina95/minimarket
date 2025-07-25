import { fetchSheetData } from "./config.js";  
import { setProductData, setProductIndex } from "./productPage.js";  
import { loadPage } from "./app.js";

export async function showHome(container) {  
  container.innerHTML = `  
    <h2>Товары</h2>  
    <div id="products" class="products-grid"></div>  
  `;  
  
  const data = await fetchSheetData();  
  setProductData(data); // сохраняем все товары  
  renderProducts(data, container);  
}  
  
function renderProducts(products, container) {  
  const list = document.getElementById("products");  
  list.innerHTML = "";  
  
  products.forEach((item, index) => {  
    if (!item["изображение"]) return;  
  
    const block = document.createElement("div");  
    block.className = "product-card";  
    block.innerHTML = `  
      <img src="${item["изображение"]}" alt="${item["название"]}" />  
      <h3>${item["название"]}</h3>  
      <p>${item["описание"] || ""}</p>  
      <strong>${item["цена"]} ₽</strong>  
    `;  
  
    block.addEventListener("click", () => {  
      setProductIndex(index);              // запоминаем индекс  
      loadPage("product", index);          // открываем карточку товара через loadPage  
    });  
  
    list.appendChild(block);  
  });  
}
