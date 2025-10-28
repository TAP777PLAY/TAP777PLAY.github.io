// 🆕 Полнофункциональный футер с встроенными стилями
// Этот файл содержит HTML, CSS стили и логику футера для многостраничного сайта

(function() {
  'use strict';
  
  // Функция для добавления CSS стилей футера
  function injectFooterStyles() {
    // Проверяем, не добавлены ли уже стили
    if (document.getElementById('footer-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'footer-styles';
    style.textContent = `
      /* Базовые стили футера */
      .site-footer {
        background: #020e1d;
        color: #ffffff;
        padding: 3rem 2rem 1rem;
        margin-top: auto;
      }

      .footer-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .footer-content {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .footer-info h3,
      .footer-links h4,
      .footer-contact h4 {
        color: #ffffff;
        margin-bottom: 1rem;
        font-size: 1.2rem;
        font-weight: 600;
      }

      .footer-info p {
        color: #ffffff;
        margin-bottom: 0.5rem;
        line-height: 1.6;
      }

      .footer-links ul,
      .footer-contact ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .footer-links li,
      .footer-contact li {
        margin-bottom: 0.5rem;
      }

      .footer-links a,
      .footer-contact a,
      .footer-link {
        color: #ffffff !important;
        text-decoration: none !important;
        transition: opacity 0.3s ease;
        display: inline-block;
        padding: 0.2rem 0;
      }

      .footer-links a:hover,
      .footer-contact a:hover,
      .footer-link:hover {
        opacity: 0.8;
        text-decoration: none !important;
      }

      .footer-bottom {
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        padding-top: 1rem;
        text-align: center;
      }

      .footer-bottom p {
        color: #ffffff;
        font-size: 0.9rem;
        margin: 0;
        opacity: 0.8;
      }

      /* Мобильная адаптивность */
      @media (max-width: 768px) {
        .site-footer {
          padding: 2rem 1rem 1rem;
        }
        
        .footer-content {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        .footer-info h3,
        .footer-links h4,
        .footer-contact h4 {
          font-size: 1.1rem;
        }
      }

      @media (max-width: 480px) {
        .site-footer {
          padding: 1.5rem 1rem 1rem;
        }
        
        .footer-content {
          gap: 1rem;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Создание HTML футера
  function createFooter() {
    return `<footer class="site-footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-info">
            <h3>SocialSpin</h3>
            <p>📍 119435, Москва, Большой Саввинский переулок, дом 12, строение 6</p>
            <p>📞 +7 (495) 427-52-42</p>
            <p>✉️ reception@socialspin.com</p>
          </div>
          
          
            <div class="footer-links">
              <h4>Меню</h4>
              <ul>
                <li><a href="about.html" class="footer-link">о нас</a></li>
                <li><a href="news.html" class="footer-link">новости</a></li>
                <li><a href="reviews.html" class="footer-link">отзывы</a></li>
                <li><a href="contact.html" class="footer-link">контакты</a></li>
              </ul>
            </div>
          
          
          <div class="footer-contact">
            <h4>Правовая информация</h4>
            <ul>
              <li><a href="privacy-policy.html" class="footer-link">Политика конфиденциальности</a></li>
              <li><a href="terms-of-service.html" class="footer-link">Условия использования</a></li>
              <li><a href="cookie-policy.html" class="footer-link">Политика файлов cookie</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 SocialSpin. Все права защищены.</p>
        </div>
      </div>
    </footer>`;
  }
  
  // Инициализация футера
  function init() {
    // Добавляем стили
    injectFooterStyles();
    
    // Создаем или находим контейнер
    let container = document.getElementById('site-footer-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'site-footer-container';
      document.body.appendChild(container);
    }
    
    // Вставляем HTML
    container.innerHTML = createFooter();
  }
  
  // Автозапуск
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Экспорт для совместимости
  window.initSiteFooter = init;
})();
