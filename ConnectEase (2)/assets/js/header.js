// 🆕 Полнофункциональная шапка с сегментированной навигацией
// Этот файл содержит HTML, CSS стили и логику шапки для многостраничного сайта

(function() {
  'use strict';
  
  // Функция для добавления CSS стилей шапки
  function injectHeaderStyles() {
    // Проверяем, не добавлены ли уже стили
    if (document.getElementById('header-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'header-styles';
    style.textContent = `
      /* Базовые стили шапки */
      .site-header {
        background: #1a1a1a;
        padding: 1rem 2rem;
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1400px;
        margin: 0 auto;
        position: relative;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      .header-center {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      .site-title {
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
        color: #ffffff;
        text-decoration: none;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 2px;
      }

      .site-title:hover {
        color: #42a5f5;
      }

      /* Навигационные ссылки */
      .nav-links {
        display: flex;
        gap: 2rem;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .nav-links li {
        margin: 0;
      }

      .nav-link {
        color: #ffffff;
        text-decoration: none;
        font-size: 1rem;
        font-weight: 400;
        transition: color 0.3s ease;
        opacity: 0.8;
      }

      .nav-link:hover {
        color: #42a5f5;
        opacity: 1;
      }

      .nav-link.active {
        color: #42a5f5;
        opacity: 1;
        font-weight: 500;
      }


      /* Гамбургер меню */
      .menu-toggle {
        display: flex;
        flex-direction: column;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        transition: background 0.3s ease;
        z-index: 1001;
      }

      .menu-toggle:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .menu-toggle span {
        width: 25px;
        height: 3px;
        background: #ffffff;
        margin: 3px 0;
        transition: 0.3s;
        border-radius: 2px;
      }

      .menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }

      .menu-toggle.active span:nth-child(2) {
        opacity: 0;
      }

      .menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }

      /* Выпадающее меню */
      .mobile-menu {
        position: fixed;
        top: 0;
        left: -300px;
        width: 300px;
        height: 100vh;
        background: #1a1a1a;
        transition: left 0.3s ease;
        z-index: 1000;
        padding: 5rem 2rem 2rem;
        box-shadow: 2px 0 10px rgba(0,0,0,0.3);
      }

      .mobile-menu.active {
        left: 0;
      }

      .mobile-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .mobile-menu-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .mobile-menu-links {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .mobile-menu-links li {
        margin: 0;
      }

      .mobile-menu-links .nav-link {
        color: #ffffff;
        text-decoration: none;
        font-size: 1.2rem;
        font-weight: 400;
        transition: color 0.3s ease;
        opacity: 0.8;
        display: block;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .mobile-menu-links .nav-link:hover {
        color: #42a5f5;
        opacity: 1;
      }

      .mobile-menu-links .nav-link.active {
        color: #42a5f5;
        opacity: 1;
        font-weight: 500;
      }

      /* Мобильная адаптивность */
      @media (max-width: 1024px) {
        .nav-links {
          gap: 1.5rem;
        }
      }

      @media (max-width: 768px) {
        .site-header {
          padding: 1rem;
        }
        
        .header-left {
          gap: 1rem;
        }
        
        .header-right {
          gap: 1rem;
        }
        
        .nav-links {
          display: none;
        }
        
        .site-title {
          font-size: 1.6rem;
        }
      }

      @media (max-width: 480px) {
        .site-title {
          font-size: 1.4rem;
          letter-spacing: 1px;
        }
        
        .header-left {
          gap: 0.8rem;
        }
        
        .header-right {
          gap: 0.8rem;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Создание HTML шапки
  function createHeader() {
    return `<header class="site-header">
      <div class="header-content">
        <div class="header-left">
          <button class="menu-toggle" aria-label="Открыть меню">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul class="nav-links">
            <li><a href="our-network.html" class="nav-link">About Us</a></li>
            <li><a href="connectivity-plans.html" class="nav-link">Services</a></li>
          </ul>
        </div>
        
        <div class="header-center">
          <a href="index.html" class="site-title">ConnectEase</a>
        </div>
        
        <div class="header-right">
          <ul class="nav-links">
            <li><a href="help-hub.html" class="nav-link">FAQ</a></li>
            <li><a href="contact.html" class="nav-link">Contact us</a></li>
          </ul>
        </div>
      </div>
      
      <!-- Выпадающее меню -->
      <div class="mobile-menu-overlay"></div>
      <div class="mobile-menu">
        <ul class="mobile-menu-links">
          <li><a href="index.html" class="nav-link">Home</a></li>
          <li><a href="our-network.html" class="nav-link">About Us</a></li>
          <li><a href="connectivity-plans.html" class="nav-link">Services</a></li>
          <li><a href="smart-benefits.html" class="nav-link">Benefits</a></li>
          <li><a href="digital-pulse.html" class="nav-link">Updates</a></li>
          <li><a href="help-hub.html" class="nav-link">FAQ</a></li>
          <li><a href="user-voices.html" class="nav-link">Testimonials</a></li>
          <li><a href="contact.html" class="nav-link">Contact us</a></li>
        </ul>
      </div>
    </header>`;
  }
  
  // Функция для инициализации мобильного меню
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu .nav-link');
    
    if (menuToggle && mobileMenu && mobileMenuOverlay) {
      // Открытие/закрытие меню
      menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        
        // Блокируем скролл при открытом меню
        if (mobileMenu.classList.contains('active')) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });
      
      // Закрытие меню при клике на оверлей
      mobileMenuOverlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
      
      // Закрытие меню при клике на ссылку
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
          menuToggle.classList.remove('active');
          mobileMenu.classList.remove('active');
          mobileMenuOverlay.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
      
      // Закрытие меню при нажатии Escape
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
          menuToggle.classList.remove('active');
          mobileMenu.classList.remove('active');
          mobileMenuOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  }

  // Функция для инициализации интерактивности навигации
  function initNavigationInteractions() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Обработка навигационных ссылок
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        // Убираем active со всех ссылок
        navLinks.forEach(l => l.classList.remove('active'));
        // Добавляем active к текущей ссылке
        this.classList.add('active');
      });
    });
  }

  // Функция для определения активной страницы
  function setActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    // Также обновляем активные состояния в выпадающем меню
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu .nav-link');
    mobileMenuLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  // Инициализация шапки
  function init() {
    // Добавляем стили
    injectHeaderStyles();
    
    // Создаем или находим контейнер
    let container = document.getElementById('site-header-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'site-header-container';
      document.body.insertBefore(container, document.body.firstChild);
    }
    
    // Вставляем HTML
    container.innerHTML = createHeader();
    
    // Инициализируем все функции
    initMobileMenu();
    initNavigationInteractions();
    setActivePage();
  }
  
  // Автозапуск
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Экспорт для совместимости
  window.initSiteHeader = init;
  window.initMobileMenu = initMobileMenu;
  window.initNavigationInteractions = initNavigationInteractions;
  window.setActivePage = setActivePage;
})();
