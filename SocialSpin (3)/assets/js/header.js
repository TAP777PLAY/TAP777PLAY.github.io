// 🎯 Горизонтальный баннер в стиле музыкального сайта
// Темный фон с вертикальными градиентами и светящимися текстовыми элементами

(function() {
  'use strict';
  
  function injectHeaderStyles() {
    if (document.getElementById('header-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'header-styles';
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }

      .site-header {
        background: #0a0a0a;
        padding: 0;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9998;
        box-shadow: 0 2px 15px rgba(0,0,0,0.4);
        transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform: translateY(0);
        height: 100px;
        overflow: visible;
      }

      .site-header.hidden {
        transform: translateY(-100%);
      }

      .site-header.scrolled {
        box-shadow: 0 6px 30px rgba(0,0,0,0.8);
        backdrop-filter: blur(15px);
      }

      .header-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        position: relative;
        padding: 1rem 3rem 0.5rem 3rem;
        background: transparent;
      }

      /* Логотип сайта */
      .site-logo {
        color: #ffffff;
        text-decoration: none;
        font-weight: 700;
        font-size: 1.8rem;
        text-transform: uppercase;
        letter-spacing: 3px;
        margin-bottom: 0.5rem;
        text-shadow: 
          0 0 15px rgba(255, 255, 255, 0.6),
          0 0 25px rgba(255, 255, 255, 0.4),
          0 0 35px rgba(255, 255, 255, 0.3);
        font-family: 'Arial', sans-serif;
        transition: all 0.3s ease;
      }

      .site-logo:hover {
        text-shadow: 
          0 0 20px rgba(255, 255, 255, 0.8),
          0 0 30px rgba(255, 255, 255, 0.6),
          0 0 40px rgba(255, 255, 255, 0.4);
        transform: translateY(-1px);
      }

      /* Баланс в шапке */
      .header-balance {
        position: absolute;
        right: 2rem;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        background: rgba(0, 0, 0, 0.3);
        padding: 0.8rem 1rem;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(5px);
      }

      .header-balance .balance-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 120px;
      }

      .header-balance .balance-label {
        font-size: 0.8rem;
        color: #aaa;
        font-weight: 500;
      }

      .header-balance .balance-value {
        font-size: 1rem;
        color: #4caf50;
        font-weight: 700;
        text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
      }

      .header-balance .balance-value#header-bet {
        color: #ff9800;
        text-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
      }

      /* Горизонтальное меню навигации */
      .nav-menu {
        display: flex;
        gap: 2.5rem;
        align-items: center;
        justify-content: center;
        width: 100%;
      }

      .nav-link {
        color: #ffffff;
        text-decoration: none;
        font-weight: 500;
        font-size: 1.1rem;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        transition: all 0.3s ease;
        padding: 0.8rem 1.2rem;
        position: relative;
        text-shadow: 
          0 0 8px rgba(255, 255, 255, 0.4),
          0 0 16px rgba(255, 255, 255, 0.2),
          0 0 24px rgba(255, 255, 255, 0.1);
        font-family: 'Arial', sans-serif;
        background: transparent;
        border-radius: 4px;
      }

      .nav-link:hover {
        color: #ffffff;
        text-shadow: 
          0 0 12px rgba(255, 255, 255, 0.6),
          0 0 20px rgba(255, 255, 255, 0.4),
          0 0 28px rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
        background: rgba(255, 255, 255, 0.05);
      }

      .nav-link.active {
        color: #ffffff;
        text-shadow: 
          0 0 15px rgba(255, 255, 255, 0.8),
          0 0 25px rgba(255, 255, 255, 0.6),
          0 0 35px rgba(255, 255, 255, 0.4);
        background: rgba(255, 255, 255, 0.08);
        font-weight: 600;
      }




      /* Мобильное меню */
      .mobile-menu-toggle {
        display: none;
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        color: #ffffff;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 10001;
        padding: 0.5rem;
        border-radius: 4px;
        transition: all 0.3s ease;
      }

      .mobile-menu-toggle:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .mobile-menu-toggle span {
        display: block;
        width: 25px;
        height: 3px;
        background: #ffffff;
        margin: 5px 0;
        transition: all 0.3s ease;
        border-radius: 2px;
      }

      .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }

      .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
      }

      .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }

      .mobile-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #0a0a0a;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        z-index: 9999;
        backdrop-filter: blur(10px);
      }

      .mobile-menu.active {
        display: block;
      }

      .mobile-menu .nav-link {
        display: block;
        padding: 1rem 2rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        text-align: left;
        font-size: 1.1rem;
        letter-spacing: 1px;
      }

      .mobile-menu .nav-link:last-child {
        border-bottom: none;
      }

      .mobile-menu .nav-link:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      /* Адаптивные стили */
      @media (max-width: 1200px) {
        .nav-menu {
          gap: 2rem;
        }
        .nav-link {
          font-size: 1rem;
          padding: 0.7rem 1rem;
          letter-spacing: 1px;
        }
        .site-logo {
          font-size: 1.6rem;
          letter-spacing: 2px;
        }
        .header-content {
          padding: 0.5rem 2rem;
        }
        .header-balance {
          right: 1rem;
          padding: 0.6rem 0.8rem;
        }
        .header-balance .balance-item {
          min-width: 100px;
        }
      }

      @media (max-width: 768px) {
        .site-header {
          height: 70px;
        }
        
        .header-content {
          flex-direction: row;
          justify-content: space-between;
        align-items: center;
          padding: 0.5rem 1rem;
        }
        
        .site-logo {
          font-size: 1.4rem;
          letter-spacing: 1.5px;
          margin-bottom: 0;
        position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .nav-menu {
          display: none;
        }
        
        .mobile-menu-toggle {
          display: block;
        }
        
        .header-balance {
          position: static;
          transform: none;
          padding: 0.4rem 0.8rem;
          margin-left: auto;
        }
        
        .header-balance .balance-item {
          min-width: 80px;
        }
        
        .header-balance .balance-label {
          font-size: 0.7rem;
        }
        
        .header-balance .balance-value {
          font-size: 0.9rem;
        }
      }

      @media (max-width: 480px) {
        .site-header {
          height: 65px;
        }
        
        .site-logo {
          font-size: 1.2rem;
          letter-spacing: 1px;
        }
        
        .header-content {
          padding: 0.3rem 0.5rem;
        }
        
        .header-balance {
          padding: 0.3rem 0.6rem;
        }
        
        .header-balance .balance-item {
          min-width: 70px;
        }
        
        .header-balance .balance-label {
          font-size: 0.6rem;
        }
        
        .header-balance .balance-value {
          font-size: 0.8rem;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  function createHeader() {
    return `<header class="site-header">
      <div class="header-content">
        <!-- Мобильное меню (гамбургер) -->
        <button class="mobile-menu-toggle" id="mobile-menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <!-- Логотип сайта -->
        <a href="index.html" class="site-logo">SOCIALSPIN</a>
        
        <!-- Горизонтальное меню навигации -->
        <nav class="nav-menu">
          <a href="index.html#games" class="nav-link">НАШИ ИГРЫ</a>
          <a href="about.html" class="nav-link">О НАС</a>
          <a href="games.html" class="nav-link">О ИГРАХ</a>
          <a href="news.html" class="nav-link">НОВОСТИ</a>
          <a href="reviews.html" class="nav-link">ОТЗЫВЫ</a>
          <a href="contact.html" class="nav-link">КОНТАКТЫ</a>
        </nav>
        
        <!-- Баланс справа -->
        <div class="header-balance">
          <div class="balance-item">
            <span class="balance-label">Баланс</span>
            <span class="balance-value" id="header-balance">5000</span>
        </div>
          <div class="balance-item">
            <span class="balance-label">Ставка</span>
            <span class="balance-value" id="header-bet">50</span>
      </div>
        </div>
      </div>
      
      <!-- Мобильное выпадающее меню -->
      <div class="mobile-menu" id="mobile-menu">
        <a href="index.html#games" class="nav-link">НАШИ ИГРЫ</a>
        <a href="about.html" class="nav-link">О НАС</a>
        <a href="games.html" class="nav-link">О ИГРАХ</a>
        <a href="news.html" class="nav-link">НОВОСТИ</a>
        <a href="reviews.html" class="nav-link">ОТЗЫВЫ</a>
        <a href="contact.html" class="nav-link">КОНТАКТЫ</a>
      </div>
    </header>`;
  }
  
  function initNavigation() {
    // Добавляем активный класс для текущей страницы
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
      
      // Добавляем эффект свечения при наведении
      link.addEventListener('mouseenter', () => {
        link.style.animation = 'glowPulse 0.6s ease-in-out';
      });
      
      link.addEventListener('animationend', () => {
        link.style.animation = '';
        });
      });
      
    // Инициализируем мобильное меню
    initMobileMenu();
  }
  
  function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
      });
      
      // Закрываем меню при клике на ссылку
      const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileToggle.classList.remove('active');
          mobileMenu.classList.remove('active');
        });
      });
      
      // Закрываем меню при клике вне его
      document.addEventListener('click', (e) => {
        if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
          mobileToggle.classList.remove('active');
          mobileMenu.classList.remove('active');
        }
      });
    }
  }
  
  // Глобальные переменные баланса
  let userBalance = 5000;
  let currentBet = 50;
  
  function initBalance() {
    // Загружаем данные из localStorage
    try {
      const savedBalance = localStorage.getItem('socialspin_balance');
      const savedBet = localStorage.getItem('socialspin_bet');
      
      if (savedBalance) {
        const parsedBalance = parseInt(savedBalance);
        if (!isNaN(parsedBalance) && parsedBalance >= 0) {
          userBalance = parsedBalance;
        }
      }
      if (savedBet) {
        const parsedBet = parseInt(savedBet);
        if (!isNaN(parsedBet) && parsedBet >= 0) {
          currentBet = parsedBet;
        }
      }
      
      console.log('Загружен баланс из localStorage:', { balance: userBalance, bet: currentBet });
    } catch(e) {
      console.warn('Не удалось загрузить баланс:', e);
    }
    
    // Обновляем отображение в шапке
    updateHeaderBalance();
    
    // Создаем глобальный объект для управления балансом
    window.HeaderBalance = {
      getBalance: () => userBalance,
      setBalance: (amount) => {
        userBalance = Math.max(0, amount);
        saveBalance();
        updateHeaderBalance();
        updateAllGames();
      },
      addBalance: (amount) => {
        userBalance += amount;
        saveBalance();
        updateHeaderBalance();
        updateAllGames();
      },
      subtractBalance: (amount) => {
        userBalance = Math.max(0, userBalance - amount);
        saveBalance();
        updateHeaderBalance();
        updateAllGames();
      },
      getBet: () => currentBet,
      setBet: (amount) => {
        currentBet = Math.max(10, Math.min(amount, userBalance));
        saveBalance();
        updateHeaderBalance();
        updateAllGames();
      }
    };
  }
  
  function saveBalance() {
    try {
      localStorage.setItem('socialspin_balance', userBalance.toString());
      localStorage.setItem('socialspin_bet', currentBet.toString());
      console.log('Баланс сохранен в localStorage:', { balance: userBalance, bet: currentBet });
    } catch(e) {
      console.warn('Не удалось сохранить баланс:', e);
    }
  }
  
  function updateHeaderBalance() {
    const balanceEl = document.getElementById('header-balance');
    const betEl = document.getElementById('header-bet');
    
    if (balanceEl) balanceEl.textContent = userBalance;
    if (betEl) betEl.textContent = currentBet;
  }
  
  function updateAllGames() {
    // Обновляем отображение во всех играх
    const gameBalanceElements = document.querySelectorAll('#balance, #sideBalance');
    const gameBetElements = document.querySelectorAll('#bet, #sideBet');
    
    gameBalanceElements.forEach(el => {
      if (el) el.textContent = userBalance;
    });
    
    gameBetElements.forEach(el => {
      if (el) el.textContent = currentBet;
    });
  }
  
  function addGlowAnimation() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glowPulse {
        0% { 
          text-shadow: 
            0 0 8px rgba(255, 255, 255, 0.4),
            0 0 16px rgba(255, 255, 255, 0.2),
            0 0 24px rgba(255, 255, 255, 0.1);
        }
        50% { 
          text-shadow: 
            0 0 12px rgba(255, 255, 255, 0.6),
            0 0 20px rgba(255, 255, 255, 0.4),
            0 0 28px rgba(255, 255, 255, 0.2);
        }
        100% { 
          text-shadow: 
            0 0 8px rgba(255, 255, 255, 0.4),
            0 0 16px rgba(255, 255, 255, 0.2),
            0 0 24px rgba(255, 255, 255, 0.1);
        }
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    injectHeaderStyles();
    addGlowAnimation();
    
    // Проверяем, не игровая ли это страница
    const isGamePage = window.location.pathname.includes('blackjack') ||
                      window.location.pathname.includes('poker') ||
                      window.location.pathname.includes('dice') ||
                      window.location.pathname.includes('slots') ||
                      window.location.pathname.includes('roulette');
    
    if (!isGamePage) {
      // Создаем шапку только на не-игровых страницах
      let container = document.getElementById('site-header-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'site-header-container';
        document.body.insertBefore(container, document.body.firstChild);
      }
      
      container.innerHTML = createHeader();
      initNavigation();
      initScrollHeader();
    }
    
    // Инициализируем баланс на всех страницах
    initBalance();
  }
  

  function initScrollHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    let isMobile = window.innerWidth <= 768;

    function updateHeader() {
      const currentScrollY = window.scrollY;
      
      // Обновляем состояние скролла
      if (currentScrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Разная логика для мобильных и десктопных устройств
      if (isMobile) {
        // Мобильная версия - более чувствительная
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
          // Скроллим вниз - скрываем шапку
          header.classList.add('hidden');
        } else if (currentScrollY < lastScrollY || currentScrollY < 100) {
          // Скроллим вверх или в начале страницы - показываем шапку
          header.classList.remove('hidden');
        }
      } else {
        // Десктопная версия - менее чувствительная
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          // Скроллим вниз - скрываем шапку
          header.classList.add('hidden');
        } else {
          // Скроллим вверх - показываем шапку
          header.classList.remove('hidden');
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }

    function handleResize() {
      isMobile = window.innerWidth <= 768;
    }

    // Обработчики событий
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Обработка touch-событий для мобильных устройств
    if ('ontouchstart' in window) {
      let touchStartY = 0;
      let touchEndY = 0;

      document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].clientY;
        const touchDiff = touchStartY - touchEndY;
        
        // Быстрый свайп вниз - скрываем шапку
        if (touchDiff < -50 && window.scrollY > 100) {
          header.classList.add('hidden');
        }
        // Быстрый свайп вверх - показываем шапку
        else if (touchDiff > 50) {
          header.classList.remove('hidden');
        }
      }, { passive: true });
    }
  }
  
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  window.initSiteHeader = init;
})();
