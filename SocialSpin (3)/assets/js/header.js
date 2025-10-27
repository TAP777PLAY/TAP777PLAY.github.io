// 🎯 Минималистичная шапка в стиле Groovy Gang
// Включает: логотип, центральное меню, поиск, аккордеон слева

(function() {
  'use strict';
  
  function injectHeaderStyles() {
    if (document.getElementById('header-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'header-styles';
    style.textContent = `
      .site-header {
        background: #2f0046;
        padding: 1rem 2rem;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform: translateY(0);
      }

      .site-header.hidden {
        transform: translateY(-100%);
      }

      .site-header.scrolled {
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        backdrop-filter: blur(10px);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1400px;
        margin: 0 auto;
        position: relative;
        padding: 0 80px 0 20px; /* Отступы: справа больше для поиска, слева для отступа от края */
      }

      /* Логотип и название */
      .site-branding {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-shrink: 0;
      }

      .site-logo {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #ff6b35, #f7931e);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        color: white;
        box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
      }

      .site-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        color: #e91616;
        text-shadow: 0 0 15px rgba(255, 105, 180, 0.5);
        font-family: 'Arial', sans-serif;
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
        background: linear-gradient(135deg, #e91616, #e9161680);
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
        background: linear-gradient(135deg, #e91616, #ff6b35);
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
        gap: 2rem;
        align-items: center;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      .nav-link {
        color: #2196f3;
        text-decoration: none;
        font-weight: 600;
        font-size: 1.1rem;
        transition: all 0.3s ease;
        padding: 0.6rem 1.2rem;
        border-radius: 25px;
        position: relative;
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
      }

      .nav-link:hover {
        color: #ff6b35;
        background: rgba(255, 107, 53, 0.15);
        transform: translateY(-3px);
        text-shadow: 0 0 15px rgba(255, 107, 53, 0.8);
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
      }


      /* Поиск */
      .search-container {
        display: flex;
        align-items: center;
        background: white;
        border-radius: 25px;
        padding: 0.5rem 1rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        min-width: 200px;
      }

      .search-container:hover {
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transform: translateY(-1px);
      }

      .search-icon {
        width: 16px;
        height: 16px;
        margin-right: 0.5rem;
        color: #666;
      }

      .search-input {
        border: none;
        outline: none;
        background: transparent;
        font-size: 0.9rem;
        color: #333;
        width: 100%;
      }

      .search-input::placeholder {
        color: #999;
      }

      /* Результаты поиска */
      .search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        max-height: 300px;
        overflow-y: auto;
        z-index: 1001;
        display: none;
        margin-top: 5px;
      }

      .search-results.active {
        display: block;
      }

      .search-result-item {
        padding: 12px 16px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .search-result-item:last-child {
        border-bottom: none;
      }

      .search-result-item:hover {
        background: #f8f9fa;
        transform: translateX(4px);
      }

      .search-result-icon {
        width: 20px;
        height: 20px;
        background: #ff6b35;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        flex-shrink: 0;
      }

      .search-result-content {
        flex: 1;
        min-width: 0;
      }

      .search-result-title {
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .search-result-preview {
        font-size: 0.85rem;
        color: #666;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .search-result-highlight {
        background: #fff3cd;
        padding: 1px 2px;
        border-radius: 2px;
        font-weight: 600;
      }

      /* Стили для разных типов результатов */
      .search-result-item[data-type="page"] .search-result-icon {
        background: #28a745;
      }

      .search-result-item[data-type="navigation"] .search-result-icon {
        background: #17a2b8;
      }

      .search-result-item[data-type="content"] .search-result-icon {
        background: #ff6b35;
      }

      /* Стили для индикатора загрузки */
      .search-result-item .search-result-icon:contains("⏳") {
        background: #6c757d;
        animation: pulse 1.5s ease-in-out infinite;
      }

      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }

      /* Боковое меню */
      .sidebar-toggle {
        position: absolute;
        left: -30px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid #e91616;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #e91616;
        font-size: 18px;
        z-index: 1002;
      }

      .sidebar-toggle:hover {
        background: #e9161620;
        border-color: #e91616;
        transform: translateY(-50%) scale(1.1);
      }

      .sidebar-menu {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        width: 320px;
        background: linear-gradient(135deg, #2f0046, #250038);
        transform: translateX(-100%);
        transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        z-index: 1001;
        padding: 2rem 1.5rem;
        box-shadow: 4px 0 25px rgba(0,0,0,0.6);
        overflow-y: auto;
        backdrop-filter: blur(15px);
        border-right: 1px solid #2196f320;
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
        background: linear-gradient(45deg, transparent 0%, #2196f305 50%, transparent 100%);
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
        padding-bottom: 1rem;
        border-bottom: 2px solid #2196f340;
      }

      .sidebar-title {
        color: #2196f3;
        font-size: 1.3rem;
        font-weight: bold;
        text-shadow: 0 0 15px #2196f360;
        margin: 0;
      }

      .sidebar-close {
        background: none;
        border: none;
        color: #e91616;
        font-size: 24px;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
      }

      .sidebar-close:hover {
        background: #2196f320;
        color: #2196f3;
        transform: scale(1.1);
      }

      .sidebar-links {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }

      .sidebar-link {
        color: #2196f3 !important;
        text-decoration: none !important;
        font-weight: 500;
        font-size: 1rem;
        transition: all 0.3s ease;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        overflow: hidden;
        background: transparent;
        border: none;
        outline: none;
      }

      .sidebar-link:visited {
        color: #2196f3 !important;
        text-decoration: none !important;
      }

      .sidebar-link:focus {
        color: #2196f3 !important;
        text-decoration: none !important;
        outline: none;
      }

      .sidebar-link:hover {
        color: #ff6b35 !important;
        background: rgba(255, 107, 53, 0.1) !important;
        text-decoration: none !important;
        transform: translateY(-2px);
      }

      .sidebar-link.active {
        color: #ff6b35 !important;
        background: rgba(255, 107, 53, 0.2) !important;
        text-decoration: none !important;
      }

      .sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.6);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
      }

      .sidebar-overlay.active {
        opacity: 1;
        visibility: visible;
      }



      @media (max-width: 1024px) {
        .sidebar-toggle {
          left: -25px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  function createHeader() {
    return `<header class="site-header">
      <div class="header-content">
        <!-- Боковое меню слева -->
        <button class="sidebar-toggle" aria-label="Открыть боковое меню">☰</button>
        
        <!-- Название сайта -->
        <div class="site-branding">
          <h1 class="site-title">
            <a href="index.html">SocialSpin</a>
          </h1>
          <a href="index.html" class="home-button" aria-label="На главную">
            <span class="home-icon">🏠</span>
          </a>
        </div>
        
        <!-- Центральное меню (только на десктопе) -->
        <nav class="nav-menu">
          <a href="about.html" class="nav-link">о нас</a><a href="games.html" class="nav-link">игры</a><a href="blackjack.html" class="nav-link">блэкджек</a><a href="poker.html" class="nav-link">покер</a><a href="dice.html" class="nav-link">кости</a><a href="slots.html" class="nav-link">слоты</a><a href="news.html" class="nav-link">новости</a><a href="contact.html" class="nav-link">Контакты</a>
        </nav>
        
        <!-- Поиск -->
        <div class="search-container" style="position: relative;">
          <span class="search-icon">🔍</span>
          <input type="text" class="search-input" placeholder="Search...">
          <div class="search-results" id="search-results"></div>
        </div>
      </div>
      
      <!-- Боковое меню -->
      <div class="sidebar-menu">
        <div class="sidebar-header">
          <h3 class="sidebar-title">SocialSpin</h3>
          <button class="sidebar-close" aria-label="Закрыть меню">×</button>
        </div>
        <div class="sidebar-links">
          <a href="about.html" class="sidebar-link">о нас</a><a href="games.html" class="sidebar-link">игры</a><a href="blackjack.html" class="sidebar-link">блэкджек</a><a href="poker.html" class="sidebar-link">покер</a><a href="dice.html" class="sidebar-link">кости</a><a href="slots.html" class="sidebar-link">слоты</a><a href="news.html" class="sidebar-link">новости</a><a href="reviews.html" class="sidebar-link">отзывы</a><a href="contact.html" class="sidebar-link">Контакты</a>
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
  
  function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.getElementById('search-results');
    let searchTimeout;

    if (searchInput && searchResults) {
      // Поиск при вводе текста
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        // Очищаем предыдущий таймаут
        clearTimeout(searchTimeout);
        
        if (query.length < 2) {
          searchResults.classList.remove('active');
          return;
        }

        // Задержка перед поиском (debounce)
        searchTimeout = setTimeout(() => {
          performSearch(query);
        }, 300);
      });

      // Закрытие результатов при клике вне поиска
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
          searchResults.classList.remove('active');
        }
      });

      // Обработка Enter
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const query = e.target.value.trim();
          if (query) {
            const firstResult = searchResults.querySelector('.search-result-item');
            if (firstResult) {
              firstResult.click();
            }
          }
        }
      });
    }
  }

  function performSearch(query) {
    const searchResults = document.getElementById('search-results');
    const results = [];
    
    // Получаем данные о всех страницах сайта
    const sitePages = getSitePages();
    
    // Поиск по текущей странице
    const currentPageResults = searchCurrentPage(query);
    results.push(...currentPageResults);
    
    // Поиск по навигационным ссылкам
    const navResults = searchNavigation(query);
    results.push(...navResults);
    
    // Поиск по другим страницам
    const otherPagesResults = searchOtherPages(query, sitePages);
    results.push(...otherPagesResults);

    // Удаляем дубликаты
    const uniqueResults = results.filter((result, index, self) => 
      index === self.findIndex(r => r.title === result.title && r.url === result.url)
    );

    // Показываем результаты
    displaySearchResults(uniqueResults, query);
  }

  function getSitePages() {
    // Получаем список всех страниц из навигации
    const pages = [];
    const navLinks = document.querySelectorAll('a[href$=".html"], .nav-link, .sidebar-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || link.href;
      const title = link.textContent.trim();
      if (href && href !== '#' && !href.startsWith('#')) {
        pages.push({
          url: href,
          title: title,
          fileName: href.split('/').pop().replace('.html', '')
        });
      }
    });
    
    // Добавляем главную страницу
    pages.push({
      url: 'index.html',
      title: 'SocialSpin',
      fileName: 'index'
    });
    
    return pages;
  }

  function searchCurrentPage(query) {
    const results = [];
    const searchableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .content-element, .section-content, .card-content');
    
    searchableElements.forEach(element => {
      const text = element.textContent || element.innerText || '';
      const title = element.tagName.match(/^H[1-6]$/) ? text : 
                   element.querySelector('h1, h2, h3, h4, h5, h6')?.textContent || 
                   element.querySelector('.title, .card-title, .section-title')?.textContent || 
                   'SocialSpin';
      
      if (text.toLowerCase().includes(query.toLowerCase())) {
        let sectionId = element.id || 
                       element.closest('[id]')?.id || 
                       element.closest('.content-element')?.id ||
                       'main';
        
        let url = '#';
        if (sectionId && sectionId !== 'main') {
          if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            url = '#' + sectionId;
          } else {
            url = 'index.html#' + sectionId;
          }
        }
        
        const preview = createSearchPreview(text, query);
        
        results.push({
          title: title.substring(0, 60) + (title.length > 60 ? '...' : ''),
          preview: preview,
          url: url,
          sectionId: sectionId,
          pageTitle: 'SocialSpin'
        });
      }
    });
    
    return results;
  }

  function searchOtherPages(query, sitePages) {
    const results = [];
    
    // Получаем предварительно загруженные данные сайта
    const siteData = getSiteSearchData();
    
    sitePages.forEach(page => {
      if (page.url === 'index.html' || page.url === window.location.pathname.split('/').pop()) {
        return; // Пропускаем текущую страницу
      }
      
      // Проверяем, содержит ли название страницы запрос
      if (page.title.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          title: page.title,
          preview: 'Page: ' + page.title,
          url: page.url,
          sectionId: 'page',
          pageTitle: page.title
        });
      }
      
      // Ищем в предварительно загруженных данных страницы
      const pageData = siteData[page.fileName] || siteData[page.url];
      if (pageData) {
        const contentResults = searchInStaticPageData(pageData, query, page);
        results.push(...contentResults);
      }
    });
    
    return results;
  }

  function getSiteSearchData() {
    // Пытаемся получить данные из глобальной переменной или создать их динамически
    if (window.siteSearchData) {
      return window.siteSearchData;
    }
    
    // Создаем данные на основе существующих данных сайта
    const siteData = {};
    
    // Получаем данные из навигации
    const navLinks = document.querySelectorAll('a[href$=".html"], .nav-link, .sidebar-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || link.href;
      const title = link.textContent.trim();
      if (href && href !== '#' && !href.startsWith('#')) {
        const fileName = href.split('/').pop().replace('.html', '');
        siteData[fileName] = {
          title: title,
          content: generatePageContent(title),
          sections: generatePageSections(title)
        };
      }
    });
    
    return siteData;
  }

  function generatePageContent(pageTitle) {
    // Генерируем контент на основе названия страницы
    const contentMap = {
      'about': 'Learn more about our company, team, and mission. We are dedicated to providing excellent service and building lasting relationships with our clients.',
      'services': 'We offer a comprehensive range of services to meet your business needs. From initial consultation to full implementation, we provide end-to-end solutions.',
      'contact': 'Get in touch with us for any questions or inquiries. We are here to help you succeed and provide the support you need.',
      'portfolio': 'View our latest projects and case studies. See what we can accomplish for your business with our expertise and dedication.',
      'blog': 'Stay updated with our latest articles, news, and insights. We share valuable information to help you stay informed and make better decisions.',
      'faq': 'Find answers to frequently asked questions. We have compiled the most common inquiries to help you quickly find the information you need.',
      'privacy': 'Learn about our privacy policy and how we protect your personal information. We are committed to maintaining the highest standards of data security.',
      'terms': 'Review our terms of service and understand the conditions for using our website and services. We believe in transparency and clear communication.'
    };
    
    return contentMap[pageTitle.toLowerCase()] || 'Welcome to ' + pageTitle + '. Explore our content and discover what we have to offer.';
  }

  function generatePageSections(pageTitle) {
    // Генерируем секции на основе названия страницы
    const sectionsMap = {
      'about': [
        { title: 'Our Team', content: 'Meet our experienced team members who are passionate about delivering exceptional results' },
        { title: 'Company History', content: 'Founded in 2020, we have grown to serve thousands of satisfied customers worldwide' },
        { title: 'Our Mission', content: 'Our mission is to provide innovative solutions that help businesses thrive and succeed' },
        { title: 'Values', content: 'We are committed to integrity, excellence, and customer satisfaction in everything we do' }
      ],
      'services': [
        { title: 'Web Development', content: 'Custom websites and web applications built with modern technologies' },
        { title: 'Consulting', content: 'Expert advice and strategic planning to help you achieve your goals' },
        { title: 'Support', content: '24/7 technical support and maintenance to keep your systems running smoothly' },
        { title: 'Training', content: 'Comprehensive training programs to help your team master new technologies' }
      ],
      'contact': [
        { title: 'Phone Support', content: 'Call us at +1-234-567-8900 for immediate assistance' },
        { title: 'Email Contact', content: 'Email us at info@company.com for detailed inquiries' },
        { title: 'Office Address', content: 'Visit us at 123 Main Street, City, State 12345' },
        { title: 'Business Hours', content: 'We are available Monday through Friday, 9 AM to 6 PM' }
      ],
      'portfolio': [
        { title: 'Recent Projects', content: 'Check out our latest work and see the quality we deliver' },
        { title: 'Case Studies', content: 'Detailed analysis of our solutions and their impact on client success' },
        { title: 'Client Testimonials', content: 'What our clients say about working with us' },
        { title: 'Awards', content: 'Recognition and awards we have received for our outstanding work' }
      ],
      'blog': [
        { title: 'Latest Articles', content: 'Read our newest blog posts and stay informed about industry trends' },
        { title: 'Industry News', content: 'Stay updated with the latest developments in our field' },
        { title: 'Company Updates', content: 'News and announcements about our company and services' },
        { title: 'Tips & Guides', content: 'Helpful tips and guides to improve your business processes' }
      ]
    };
    
    return sectionsMap[pageTitle.toLowerCase()] || [
      { title: 'Overview', content: 'Learn more about ' + pageTitle + ' and what we offer' },
      { title: 'Features', content: 'Discover the key features and benefits of ' + pageTitle },
      { title: 'Benefits', content: 'See how ' + pageTitle + ' can help you achieve your goals' }
    ];
  }

  function searchInStaticPageData(pageData, query, page) {
    const results = [];
    const queryLower = query.toLowerCase();
    
    // Поиск в основном контенте страницы
    if (pageData.content && pageData.content.toLowerCase().includes(queryLower)) {
      const preview = createSearchPreview(pageData.content, query);
      results.push({
        title: pageData.title,
        preview: preview,
        url: page.url,
        sectionId: 'content',
        pageTitle: page.title
      });
    }
    
    // Поиск в секциях страницы
    if (pageData.sections) {
      pageData.sections.forEach(section => {
        if (section.title.toLowerCase().includes(queryLower) || 
            section.content.toLowerCase().includes(queryLower)) {
          const preview = createSearchPreview(section.content, query);
          results.push({
            title: section.title,
            preview: preview,
            url: page.url + '#' + section.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            sectionId: 'content',
            pageTitle: page.title
          });
        }
      });
    }
    
    return results;
  }



  function searchNavigation(query) {
    const results = [];
    const navLinks = document.querySelectorAll('a[href$=".html"], .nav-link, .sidebar-link');
    
    navLinks.forEach(link => {
      const text = link.textContent.trim();
      if (text.toLowerCase().includes(query.toLowerCase())) {
        const url = link.href || link.getAttribute('href') || '#';
        results.push({
          title: text,
          preview: 'Navigation link',
          url: url,
          sectionId: 'navigation',
          pageTitle: text
        });
      }
    });
    
    return results;
  }

  function createSearchPreview(text, query) {
    const maxLength = 120;
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    const queryIndex = textLower.indexOf(queryLower);
    
    if (queryIndex === -1) {
      return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
    }
    
    // Находим начало и конец для превью
    const start = Math.max(0, queryIndex - 30);
    const end = Math.min(text.length, queryIndex + query.length + 50);
    let preview = text.substring(start, end);
    
    if (start > 0) preview = '...' + preview;
    if (end < text.length) preview = preview + '...';
    
    // Подсвечиваем найденный текст простым способом
    const previewLower = preview.toLowerCase();
    const matchIndex = previewLower.indexOf(queryLower);
    if (matchIndex !== -1) {
      const beforeMatch = preview.substring(0, matchIndex);
      const match = preview.substring(matchIndex, matchIndex + query.length);
      const afterMatch = preview.substring(matchIndex + query.length);
      preview = beforeMatch + '<span class="search-result-highlight">' + match + '</span>' + afterMatch;
    }
    
    return preview;
  }

  function displaySearchResults(results, query) {
    const searchResults = document.getElementById('search-results');
    
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-result-item">
          <div class="search-result-icon">🔍</div>
          <div class="search-result-content">
            <div class="search-result-title">No results found</div>
            <div class="search-result-preview">Try a different search term</div>
          </div>
        </div>
      `;
    } else {
      searchResults.innerHTML = results.map(result => `
        <div class="search-result-item" data-url="${result.url}" data-type="${result.sectionId}">
          <div class="search-result-icon">${result.sectionId === 'page' ? '📄' : result.sectionId === 'navigation' ? '🔗' : '📝'}</div>
          <div class="search-result-content">
            <div class="search-result-title">${result.title}</div>
            <div class="search-result-preview">${result.preview}</div>
          </div>
        </div>
      `).join('');
      
      // Добавляем обработчики кликов
      searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const url = item.getAttribute('data-url');
          if (url && url !== '#') {
            if (url.startsWith('#')) {
              // Прокрутка к секции на текущей странице
              const targetId = url.substring(1);
              const targetElement = document.getElementById(targetId);
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
              }
            } else if (url.includes('.html')) {
              // Переход на другую страницу
              window.location.href = url;
            } else {
              // Обычная ссылка
              window.location.href = url;
            }
            searchResults.classList.remove('active');
          }
        });
      });
    }
    
    searchResults.classList.add('active');
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
    initSearch();
    initScrollHeader();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  window.initSiteHeader = init;
})();
