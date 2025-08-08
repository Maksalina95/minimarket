// --- Импорты модулей (должны быть в начале файла) ---
import { showHome } from "./home.js";
import { showCatalog, showCategoryPage } from "./catalog.js"; // ✅ Добавлено showCategoryPage
import { showProductPage } from "./productPage.js";
import { setupSearchGlobal } from "./search.js";
import { showFilteredProducts } from "./filtered.js"; // 👈 ДОБАВИТЬ
import { showFavoritesPage } from './favorites.js';
import { showProfile } from './profilePage.js';
import { showConditions } from './conditions.js';
import { showTerms } from './terms.js';
import { showAddress } from './address.js';
import { showCash } from './cash.js';
import { showContacts } from './contacts.js';
import { showDelivery } from './delivery.js';


// --- Логика PWA: кнопка установки ---
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.getElementById('installBtn');
  if (installBtn) {
    installBtn.style.display = 'inline-block';
    installBtn.addEventListener('click', async () => {
      installBtn.style.display = 'none';
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
console.log(`Пользователь выбрал: ${outcome}`);      deferredPrompt = null;
    });
  }
});


// --- DOM элементы ---
const content = document.getElementById("content");
const navLinks = document.querySelectorAll("nav a");
const registerSection = document.getElementById('registerSection');
const mainApp = document.getElementById('mainApp');
const profilePage = document.getElementById('profilePage');
const welcomeUser = document.getElementById('welcomeUser');
const profileName = document.getElementById('profileName');
const profilePhone = document.getElementById('profilePhone');
const slider = document.querySelector(".slider");


// --- Навигация ---
function setActive(page) {
  navLinks.forEach(link => link.classList.remove("active"));
  const activeLink = document.querySelector(`nav a[data-page="${page}"]`);
  if (activeLink) activeLink.classList.add("active");
}

export async function loadPage(page, data = null, skipHistory = false) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.phone) {
    try {
      const response = await fetch('/api/check-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone })
      });
      const result = await response.json();
      if (result.blocked) {
        alert("Ваш аккаунт заблокирован. Выход выполнен.");
        localStorage.removeItem("user");
        location.reload();
        return;
      }
    } catch (error) {
      console.error("Ошибка проверки блокировки:", error);
      alert("Не удалось проверить статус блокировки. Повторите позже.");
      return;
    }
  }
  
  // Скрываем личный кабинет
profilePage.style.display = 'none';
// Показываем основной контент (по умолчанию)
content.style.display = 'block';
// Скрываем приветствие
welcomeUser.style.display = 'none';
  
  setActive(page);
  
  // Показываем/скрываем слайдер
if (slider) {
  if (page === "product") {
    slider.style.display = "none";
  } else {
    slider.style.display = "block";
  }
}

  const searchContainer = document.querySelector(".search-container");
  if (page === "home" || page === "catalog") {
    searchContainer.style.display = "flex";
  } else {
    searchContainer.style.display = "none";
  }

  if (!skipHistory) {
    const url = page === "product" ? `#product-${data}` : `#${page}`;
    history.pushState({ page, data }, "", url);
  }

  profilePage.style.display = 'none';
  welcomeUser.style.display = 'none';

  if (page === "home") {
    await showHome(content);
  } else if (page === "catalog") {
    await showCatalog(content);
  } else if (page === "filtered") {
    await showFilteredProducts(content, data.category, data.subcategory);    
  } else if (page === "product") {
    await showProductPage(content, data);
  } else if (page === "category") {
  await showCategoryPage(content, data);   // ✅ Добавлено
} else if (page === "favorites") {
  await showFavoritesPage(content);
} else if (page === "profile") {
  if (user) {
    profilePage.style.display = 'block';
    content.style.display = 'none';
    showProfile(profilePage, user);
  } else {
    profilePage.style.display = 'none';
    content.style.display = 'block';
    await showHome(content);
    setActive('home');
  }
  return; // важная остановка
} else if (page === "conditions") {
  await showConditions(content);
} else if (page === "terms") {
  await showTerms(content);
} else if (page === "address") {
  await showAddress(content);
} else if (page === "cash") {
  await showCash(content);
} else if (page === "contacts") {
  await showContacts(content);
} else if (page === "delivery") {
    await showDelivery(content);
  }
} // <-- закрываем функцию loadPage

// --- Слайдер ---
// --- Слайдер ---
function initSlider() {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slider .slide');
  if (slides.length === 0) return;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);

      // Управляем видео
      const video = slide.querySelector('video');
      if (video) {
        if (i === index) {
          video.play().catch(() => {});  // пытаемся запустить видео
        } else {
          video.pause();
          video.currentTime = 0;         // сброс видео на начало
        }
      }
    });
  }

  showSlide(currentSlide);

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 5000); // смена каждые 5 секунд
}

// --- Отображение основного интерфейса ---
function showMainApp() {
  registerSection.style.display = 'none';
  mainApp.style.display = 'block';
  loadPage("home");

  // --- Инициализация слайдера при запуске ---
  initSlider();
}

function showWelcome(name) {
  welcomeUser.textContent = `Добро пожаловать, ${name}!`;
  welcomeUser.style.display = 'block';
  setTimeout(() => {
    welcomeUser.style.display = 'none';
  }, 6000);
}

// --- Запуск при загрузке страницы ---
document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.name && user.phone) {
    try {
      const response = await fetch('/api/check-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone })
      });

      const result = await response.json();

      if (result.blocked) {
        alert("Этот аккаунт был заблокирован. Вход невозможен.");
        localStorage.removeItem("user");
        registerSection.style.display = 'block';
        return;
      }

      showMainApp();
      showWelcome(user.name);
    } catch (err) {
      console.error("Ошибка при проверке блокировки:", err);
      alert("Не удалось проверить статус блокировки. Повторите позже.");
      registerSection.style.display = 'block';
    }

  } else {
    registerSection.style.display = 'block';
  }

  // --- Обработка формы регистрации ---
  document.getElementById("register-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (name && phone) {
      fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      })
      .then(response => response.json())
      .then(data => {
        console.log("Ответ от сервера:", data);
        if (data.success) {
          localStorage.setItem("user", JSON.stringify({ name, phone }));

          fetch('/api/check-block', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone })
          })
          .then(res => res.json())
          .then(result => {
            if (result.blocked) {
              alert('Ваш аккаунт заблокирован');
              localStorage.removeItem("user");
              registerSection.style.display = 'block';
            } else {
              showMainApp();
              showWelcome(name);
            }
          })
          .catch(error => {
            console.error("Ошибка при проверке блокировки:", error);
            alert("Ошибка при проверке блокировки. Повторите позже.");
          });

        } else {
          alert("Ошибка регистрации: " + (data.error || "Неизвестная ошибка"));
        }
      });
    }
  });

  // --- Навигация ---
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      loadPage(page);
    });
  });

  setupSearchGlobal();

  // --- История переходов (назад/вперёд) ---
  window.onpopstate = (event) => {
    const state = event.state;
    if (state?.page === 'product') {
      loadPage('product', state.data, true);
    } else if (state?.page) {
      loadPage(state.page, state.data, true);
    } else {
      loadPage("home", null, true);
    }
  };
});
