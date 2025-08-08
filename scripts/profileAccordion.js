import { showTerms } from './terms.js';
import { showAddress } from './address.js';
import { showDelivery } from './delivery.js';
import { showContacts } from './contacts.js';
import { showCash } from './cash.js';
import { showConditions } from './conditions.js';


export function showProfileAccordion(container, user) {
  container.innerHTML = `
    <div class="breadcrumbs">
      <span id="crumb-home">Личный кабинет</span>
      <span id="crumb-section" style="display:none;"> → <span id="section-name"></span></span>
    </div>

    <h2>Вы вошли как ${user.name}</h2>
    <p>Ваш номер: ${user.phone}</p>

    <div class="accordion">
      <div class="accordion-item">
        <button class="accordion-header" data-section="Условия">📜 Условия</button>
        <div class="accordion-content"></div>
      </div>
      <div class="accordion-item">
        <button class="accordion-header" data-section="Адрес">📍 Адрес</button>
        <div class="accordion-content"></div>
      </div>
      <div class="accordion-item">
        <button class="accordion-header" data-section="Доставка">🚚 Доставка</button>
        <div class="accordion-content"></div>
      </div>
      <div class="accordion-item">
        <button class="accordion-header" data-section="Контакты">📱 Контакты</button>
        <div class="accordion-content"></div>
      </div>
    </div>
    <div class="accordion-item">
  <button class="accordion-header" data-section="Котёл-это..">💳 Котёл-это</button>
  <div class="accordion-content"></div>
</div>
<div class="accordion-item">
  <button class="accordion-header" data-section="Заказ наличными">📄 Заказ наличными</button>
  <div class="accordion-content"></div>
</div>

    <button id="logoutBtn" class="logout-button">Выйти</button>
  `;

  const headers = container.querySelectorAll(".accordion-header");
  const crumbSection = document.getElementById("crumb-section");
  const sectionName = document.getElementById("section-name");

  // Сопоставление заголовка с функцией вывода текста
  const sectionMap = {
  "Условия": showTerms,
  "Адрес": showAddress,
  "Доставка": showDelivery,
  "Контакты": showContacts,
  "Котёл-это..": showCash,
  "Заказ наличными": showConditions,
};

  headers.forEach(header => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      const isOpen = content.style.display === "block";

      // Скрываем все блоки
      container.querySelectorAll(".accordion-content").forEach(c => {
        c.style.display = "none";
        c.innerHTML = "";
      });

      if (!isOpen) {
        content.style.display = "block";
        sectionName.textContent = header.dataset.section;
        crumbSection.style.display = "inline";

        // Вызываем функцию с контейнером
        const func = sectionMap[header.dataset.section];
        if (func) {
          func(content);
        } else {
          content.innerHTML = "<p>Здесь текст ещё не добавлен</p>";
        }
      } else {
        crumbSection.style.display = "none";
        content.innerHTML = "";
      }
    });
  });

  // Кнопка Выйти
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      location.reload();
    });
  }
}
