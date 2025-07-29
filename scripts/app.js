// --- Логика PWA: показ кнопки "Установить" ---
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.getElementById('installBtn');
  if (installBtn) {
    installBtn.style.display = 'block';

    installBtn.addEventListener('click', async () => {
      installBtn.style.display = 'none';
      deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Пользователь выбрал: ${outcome}`);
      deferredPrompt = null;
    });
  }
});

import { showHome } from "./home.js";
import { showCatalog } from "./catalog.js";
import { showProductPage } from "./productPage.js";
import { setupSearchGlobal } from "./search.js";

const content = document.getElementById("content");
const navLinks = document.querySelectorAll("nav a");
const registerSection = document.getElementById('registerSection');
const mainApp = document.getElementById('mainApp');
const profilePage = document.getElementById('profilePage');
const welcomeUser = document.getElementById('welcomeUser');
const profileName = document.getElementById('profileName');
const profilePhone = document.getElementById('profilePhone');

function setActive(page) {
  navLinks.forEach(link => link.classList.remove("active"));
  const activeLink = document.querySelector(`nav a[data-page="${page}"]`);
  if (activeLink) activeLink.classList.add("active");
}

async function loadPage(page, data = null, skipHistory = false) {
  setActive(page);

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

  // Скрыть личный кабинет
  profilePage.style.display = 'none';
  welcomeUser.style.display = 'none';

  if (page === "home") {
    await showHome(content);
  } else if (page === "catalog") {
    await showCatalog(content);
  } else if (page === "product") {
    await showProductPage(content, data);
  } else if (page === "profile") {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      profileName.textContent = 'Вы вошли как: ' + user.name;
      profilePhone.textContent = 'Ваш номер: ' + user.phone;
      profilePage.style.display = 'block';
    }
  } else {
    content.innerHTML = "<h2>Добро пожаловать!</h2>";
  }
}

function showMainApp() {
  registerSection.style.display = 'none';
  mainApp.style.display = 'block';
  loadPage("home");
}

function showWelcome(name) {
  welcomeUser.textContent = `Здравствуйте, ${name}!`;
  welcomeUser.style.display = 'block';
}

// --- Запуск при загрузке ---
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.name && user.phone) {
    showMainApp();
    showWelcome(user.name);
  } else {
    registerSection.style.display = 'block';
  }

  document.getElementById("register-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    if (name && phone) {
      localStorage.setItem("user", JSON.stringify({ name, phone }));
      showMainApp();
      showWelcome(name);
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("user");
    location.reload();
  });

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      loadPage(page);
    });
  });

  setupSearchGlobal();
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
