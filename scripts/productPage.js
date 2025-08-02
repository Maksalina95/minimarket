// Массив товаров и текущий индекс
let productData = [];
let productIndex = 0;

export function setProductData(data) {
productData = data;
}

export function setProductIndex(index) {
productIndex = index;
}

export function getCurrentProduct() {
return productData[productIndex];
}

export function showProductPage(container, index, from) {
const product = productData[index];
productIndex = index;

// Сохраняем в history откуда пришли (например, из подкатегории)
history.pushState({ page: "product", data: { index, from } }, "", "");

container.innerHTML = `
  <div class="product-card">
    <button class="back-button" id="backToPrevious">← Назад</button>
    <img src="${product["изображение"]}" alt="${product["название"]}">
    <h2>${product["название"]}</h2>
    <p class="description">${product["описание"] || ""}</p>
    <div class="price">${product["цена"]} ₽</div>
    <a href="https://wa.me/7XXXXXXXXXX?text=Здравствуйте, меня интересует товар: ${encodeURIComponent(product["название"])}"
      class="whatsapp-btn" target="_blank">
      Заказать в WhatsApp
    </a>
  </div>
`;
document.getElementById("backToPrevious").addEventListener("click", () => {
history.back(); // вернуться на предыдущий экран
});
}
