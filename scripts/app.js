// scripts/app.js

// --- Логика PWA: показ кнопки "Установить" ---
let deferredPrompt;

// Слушаем событие beforeinstallprompt, чтобы показать кнопку "Установить"
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Отменяем автоматический показ баннера
  deferredPrompt = e; // Сохраняем событие для вызова позже

  const installBtn = document.getElementById('installBtn');
  if (installBtn) {
    installBtn.style.display = 'block'; // Показываем кнопку

    // Обработчик клика по кнопке
    installBtn.addEventListener('click', async () => {
      installBtn.style.display = 'none'; // Скрываем кнопку после клика

      // Показываем системный диалог установки
      deferredPrompt.prompt();

      // Ждём выбора пользователя
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Пользователь выбрал: ${outcome}`);

      deferredPrompt = null; // Сбрасываем сохранённое событие
    });
  }
});


// --- Основной код SPA ---

import { showHome } from "./home.js";
import { showCatalog } from "./catalog.js";
import { setupSearchGlobal } from "./search.js";

const content = document.getElementById("content");
const navLinks = document.querySelectorAll("nav a");

// Функция переключения активной вкладки
function setActive(page) {
  navLinks.forEach(link => link.classList.remove("active"));
  document.querySelector(`nav a[data-page="${page}"]`).classList.add("active");
}

// Загрузка страницы и показ/скрытие поиска
async function loadPage(page) {
  setActive(page);

  const searchContainer = document.querySelector(".search-container");
  if (page === "home" || page === "catalog") {
    searchContainer.style.display = "flex";
  } else {
    searchContainer.style.display = "none";
  }

  if (page === "home") {
    await showHome(content);
  } else if (page === "catalog") {
    await showCatalog(content);
  }
}

// Навешиваем обработчики на ссылки меню
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const page = link.getAttribute("data-page");
    loadPage(page);
  });
});

// Загружаем главную страницу при старте
loadPage("home");

// Инициализация поиска: кнопка и подсказки
setupSearchGlobal();
