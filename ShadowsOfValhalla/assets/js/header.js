// 🎯 Современная стилизованная шапка с адаптивным дизайном
// Включает: логотип, навигацию, поиск, мобильное меню

(function() {
  'use strict';
  
  function injectHeaderStyles() {
    if (document.getElementById('header-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'header-styles';
    style.textContent = `
      /* Основные стили шапки */
      .site-header {
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: 1rem 2rem;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.2);
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform: translateY(0);
      }

      .site-header.hidden {
        transform: translateY(-100%);
      }

      .site-header.scrolled {
        background: linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(26, 26, 26, 0.95) 50%, rgba(10, 10, 10, 0.95) 100%);
        backdrop-filter: blur(30px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1400px;
        margin: 0 auto;
        position: relative;
        padding: 0 2rem;
        gap: 2rem;
        min-height: 80px;
      }

      /* Логотип и название */
      .site-branding {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-shrink: 0;
        z-index: 1001;
        margin-right: 2rem;
        min-width: 200px;
      }

      .site-logo {
        width: 45px;
        height: 45px;
        background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
        color: white;
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4), 0 2px 8px rgba(255, 107, 53, 0.2);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .site-logo::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.6s ease;
      }

      .site-logo:hover::before {
        left: 100%;
      }

      .site-logo:hover {
        transform: scale(1.05) rotate(2deg);
        box-shadow: 0 6px 20px rgba(255, 107, 53, 0.6), 0 3px 12px rgba(255, 107, 53, 0.3);
      }

      .site-title {
        margin: 0;
        font-size: 1.6rem;
        font-weight: 800;
        color: #ffffff;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.5);
        font-family: 'Montserrat', sans-serif;
        letter-spacing: -0.5px;
        transition: all 0.3s ease;
      }

      .site-title a {
        color: inherit;
        text-decoration: none;
        transition: all 0.3s ease;
      }

      .site-title a:hover {
        text-shadow: 0 0 20px rgba(255, 105, 180, 0.8);
        transform: scale(1.05);
      }

      /* Кнопка домик */
      .home-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        margin-left: 1rem;
        background: linear-gradient(135deg, #f0f, #f0f80);
        border-radius: 50%;
        text-decoration: none;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(255, 105, 180, 0.3);
        position: relative;
        overflow: hidden;
      }

      .home-button:hover {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 4px 15px rgba(255, 105, 180, 0.5);
        background: linear-gradient(135deg, #f0f, #ff6b35);
      }

      .home-button:active {
        transform: scale(0.95);
      }

      .home-icon {
        font-size: 20px;
        color: white;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        animation: homeIconPulse 2s infinite;
      }

      .home-button:hover .home-icon {
        animation: homeIconBounce 0.6s ease;
      }

      @keyframes homeIconPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      @keyframes homeIconBounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-3px); }
        60% { transform: translateY(-1px); }
      }

      /* Центральное меню */
      .nav-menu {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        position: absolute;
        right: 2rem;
        top: 50%;
        transform: translateY(-50%);
        flex-wrap: nowrap;
        justify-content: flex-end;
        max-width: 60%;
      }

      .nav-link {
        color: #ffffff;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.95rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 0.7rem 1.3rem;
        border-radius: 25px;
        position: relative;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        font-family: 'Montserrat', sans-serif;
        letter-spacing: 0.3px;
        overflow: hidden;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .nav-link::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 107, 53, 0.05));
        border-radius: 25px;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: -1;
      }

      .nav-link:hover {
        color: #ff6b35;
        background: rgba(255, 107, 53, 0.15);
        transform: translateY(-2px);
        text-shadow: 0 2px 8px rgba(255, 107, 53, 0.8);
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
      }

      .nav-link:hover::before {
        opacity: 1;
      }

      .nav-link.active {
        color: #ff6b35;
        background: rgba(255, 107, 53, 0.2);
        text-shadow: 0 2px 8px rgba(255, 107, 53, 0.8);
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
        transform: translateY(-1px);
      }


      /* Боковое меню */
      .sidebar-toggle {
        position: absolute;
        left: -30px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid #f0f;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #f0f;
        font-size: 18px;
        z-index: 1002;
      }

      .sidebar-toggle:hover {
        background: #f0f20;
        border-color: #f0f;
        transform: translateY(-50%) scale(1.1);
      }

      .sidebar-menu {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        width: 320px;
        background: linear-gradient(135deg, #0a0a0a, #080808);
        transform: translateX(-100%);
        transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        z-index: 1001;
        padding: 2rem 1.5rem;
        box-shadow: 4px 0 25px rgba(0,0,0,0.6);
        overflow-y: auto;
        backdrop-filter: blur(15px);
        border-right: 1px solid #0ff20;
      }

      .sidebar-menu.active {
        transform: translateX(0);
        box-shadow: 8px 0 35px rgba(0,0,0,0.8);
      }

      /* Когда боковое меню активно, сдвигаем название сайта вниз в PC версии */
      @media (min-width: 769px) {
        .site-header.sidebar-active .site-branding {
          transform: translateY(10px);
          transition: transform 0.3s ease;
        }
      }

      .header-content .site-branding {
        transition: transform 0.3s ease;
      }

      .sidebar-menu::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent 0%, #0ff05 50%, transparent 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }

      .sidebar-menu.active::before {
        opacity: 1;
      }

      .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;
        margin-top: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 2px solid rgba(255, 107, 53, 0.3);
        gap: 1rem;
      }

      .sidebar-logo {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
      }

      .sidebar-title {
        color: #ffffff;
        font-size: 1.4rem;
        font-weight: 800;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        margin: 0;
        font-family: 'Montserrat', sans-serif;
        flex: 1;
      }

      .sidebar-close {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #ffffff;
        font-size: 20px;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 8px;
        transition: all 0.3s ease;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
      }

      .sidebar-close:hover {
        background: rgba(255, 107, 53, 0.2);
        color: #ff6b35;
        transform: scale(1.05);
        border-color: rgba(255, 107, 53, 0.3);
      }

      .sidebar-links {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }

      .sidebar-link {
        color: #ffffff !important;
        text-decoration: none !important;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 0.8rem 1.2rem;
        border-radius: 12px;
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        outline: none;
        margin-bottom: 0.5rem;
        backdrop-filter: blur(10px);
        font-family: 'Montserrat', sans-serif;
      }

      .sidebar-link:visited {
        color: #ffffff !important;
        text-decoration: none !important;
      }

      .sidebar-link:focus {
        color: #ffffff !important;
        text-decoration: none !important;
        outline: none;
      }

      .sidebar-link:hover {
        color: #ff6b35 !important;
        background: rgba(255, 107, 53, 0.2) !important;
        text-decoration: none !important;
        transform: translateX(8px) translateY(-2px);
        border-color: rgba(255, 107, 53, 0.3);
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.2);
      }

      .sidebar-link.active {
        color: #ff6b35 !important;
        background: linear-gradient(135deg, rgba(255, 107, 53, 0.3), rgba(255, 107, 53, 0.15)) !important;
        text-decoration: none !important;
        border-color: rgba(255, 107, 53, 0.4);
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
      }

      .sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.7);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(8px);
      }

      .sidebar-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      /* Мобильная версия */
      @media (max-width: 768px) {
        .site-header {
          padding: 0.8rem 1rem;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          background: linear-gradient(135deg, rgba(10, 10, 10, 0.98) 0%, rgba(26, 26, 26, 0.98) 50%, rgba(10, 10, 10, 0.98) 100%);
          backdrop-filter: blur(25px);
        }
        
        .header-content {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          padding: 0 0.5rem;
        }
        
        .site-branding {
          flex: 1;
          min-width: 0;
          gap: 0.5rem;
        }
        
        .site-logo {
          width: 36px;
          height: 36px;
          font-size: 16px;
          border-radius: 8px;
        }
        
        .site-title {
          font-size: 1.2rem;
          font-weight: 700;
        }
        
        /* Скрываем кнопку домик на мобильных */
        .home-button {
          display: none;
        }
        
        .nav-menu {
          display: none;
        }
        
        /* На мобильных устройствах показываем только основные разделы */
        @media (max-width: 1200px) {
          .nav-menu {
            gap: 0.3rem;
            right: 1rem;
            max-width: 50%;
          }
          
          .nav-link {
            font-size: 0.85rem;
            padding: 0.5rem 0.8rem;
          }
        }
        
        @media (max-width: 1000px) {
          .nav-menu {
            display: none;
          }
        }
        
        
        .sidebar-toggle {
          position: static;
          transform: none;
          width: 40px;
          height: 40px;
          font-size: 18px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        .sidebar-toggle:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.05);
        }
        
        .sidebar-menu {
          width: 100vw;
          padding: 2rem 1.5rem;
          background: linear-gradient(135deg, rgba(10, 10, 10, 0.98) 0%, rgba(26, 26, 26, 0.98) 50%, rgba(10, 10, 10, 0.98) 100%);
          backdrop-filter: blur(30px);
        }
        
        .sidebar-header {
          margin-bottom: 2rem;
          margin-top: 0;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        .sidebar-title {
          font-size: 1.3rem;
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .sidebar-link {
          padding: 1rem 1.2rem;
          font-size: 1rem;
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          margin-bottom: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .sidebar-link:hover {
          background: rgba(255, 107, 53, 0.2) !important;
          color: #ff6b35 !important;
          transform: translateX(5px);
          border-color: rgba(255, 107, 53, 0.3);
        }

        /* Мобильный скролл - более чувствительный */
        .site-header.hidden {
          transform: translateY(-100%);
        }

        .site-header.scrolled {
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          backdrop-filter: blur(30px);
        }
      }

      @media (max-width: 480px) {
        .site-header {
          padding: 0.6rem 0.8rem;
        }
        
        .site-logo {
          width: 32px;
          height: 32px;
          font-size: 14px;
        }
        
        .site-title {
          font-size: 1rem;
        }
        
        
        .sidebar-toggle {
          width: 36px;
          height: 36px;
          font-size: 16px;
        }
        
        .sidebar-menu {
          padding: 1.5rem 1rem;
        }
        
        .sidebar-link {
          padding: 0.7rem 1rem;
          font-size: 0.9rem;
        }
      }

      @media (max-width: 1024px) {
        .sidebar-toggle {
          left: -25px;
        }
      }
      
      /* Дополнительные стили для предотвращения наложения */
      @media (min-width: 1200px) {
        .site-branding {
          min-width: 250px;
        }
        
        .nav-menu {
          right: 3rem;
          max-width: 65%;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  function createHeader() {
    return `<header class="site-header">
      <div class="header-content">
        <!-- Мобильное меню -->
        <button class="sidebar-toggle" aria-label="Открыть меню">
          <span class="hamburger-icon">☰</span>
        </button>
        
        <!-- Логотип и название -->
        <div class="site-branding">
          <div class="site-logo">S</div>
          <h1 class="site-title">
            <a href="index.html">ShadowsOfValhalla</a>
          </h1>
        </div>
        
        <!-- Центральное меню (только на десктопе) -->
        <nav class="nav-menu">
          <a href="echoes-of.html" class="nav-link">Echoes</a>
          <a href="runic-strengths.html" class="nav-link">Strengths</a>
          <a href="viking-crafts.html" class="nav-link">Crafts</a>
          <a href="saga-chronicle.html" class="nav-link">Chronicle</a>
          <a href="lorekeepers-notes.html" class="nav-link">Notes</a>
          <a href="voices-of.html" class="nav-link">Voices</a>
          <a href="hall-of.html" class="nav-link">Hall</a>
          <a href="contact.html" class="nav-link">Contact</a>
        </nav>
        
      </div>
      
      <!-- Боковое меню -->
      <div class="sidebar-menu">
        <div class="sidebar-header">
          <div class="sidebar-logo">S</div>
          <h3 class="sidebar-title">ShadowsOfValhalla</h3>
          <button class="sidebar-close" aria-label="Закрыть меню">×</button>
        </div>
        <div class="sidebar-links">
          <a href="index.html" class="sidebar-link">Home</a>
          <a href="echoes-of.html" class="sidebar-link">Echoes</a>
          <a href="runic-strengths.html" class="sidebar-link">Strengths</a>
          <a href="viking-crafts.html" class="sidebar-link">Crafts</a>
          <a href="saga-chronicle.html" class="sidebar-link">Chronicle</a>
          <a href="lorekeepers-notes.html" class="sidebar-link">Notes</a>
          <a href="voices-of.html" class="sidebar-link">Voices</a>
          <a href="hall-of.html" class="sidebar-link">Hall</a>
          <a href="contact.html" class="sidebar-link">Contact</a>
        </div>
      </div>
      
      <!-- Оверлей для бокового меню -->
      <div class="sidebar-overlay"></div>
    </header>`;
  }
  
  function initSidebar() {
    const toggle = document.querySelector('.sidebar-toggle');
    const menu = document.querySelector('.sidebar-menu');
    const overlay = document.querySelector('.sidebar-overlay');
    const close = document.querySelector('.sidebar-close');
    const header = document.querySelector('.site-header');
    
    if (toggle && menu && overlay && header) {
      // Переключение меню (открытие/закрытие)
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (menu.classList.contains('active')) {
          // Закрываем меню
          menu.classList.remove('active');
          overlay.classList.remove('active');
          header.classList.remove('sidebar-active');
          document.body.style.overflow = '';
        } else {
          // Открываем меню
          menu.classList.add('active');
          overlay.classList.add('active');
          header.classList.add('sidebar-active');
          document.body.style.overflow = 'hidden';
        }
      });
      
      // Закрытие через кнопку
      if (close) {
        close.addEventListener('click', () => {
          menu.classList.remove('active');
          overlay.classList.remove('active');
          header.classList.remove('sidebar-active');
          document.body.style.overflow = '';
        });
      }
      
      // Закрытие через оверлей
      overlay.addEventListener('click', () => {
        menu.classList.remove('active');
        overlay.classList.remove('active');
        header.classList.remove('sidebar-active');
        document.body.style.overflow = '';
      });
      
      // Закрытие при клике на ссылку
      const links = document.querySelectorAll('.sidebar-link');
      links.forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('active');
          overlay.classList.remove('active');
          header.classList.remove('sidebar-active');
          document.body.style.overflow = '';
        });
      });
      
      // Закрытие по Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
          menu.classList.remove('active');
          overlay.classList.remove('active');
          header.classList.remove('sidebar-active');
          document.body.style.overflow = '';
        }
      });
    }
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
  
  function init() {
    injectHeaderStyles();
    
    let container = document.getElementById('site-header-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'site-header-container';
      document.body.insertBefore(container, document.body.firstChild);
    }
    
    container.innerHTML = createHeader();
    initSidebar();
    initScrollHeader();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  window.initSiteHeader = init;
})();
