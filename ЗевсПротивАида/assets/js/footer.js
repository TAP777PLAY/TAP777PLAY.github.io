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
        background: linear-gradient(135deg, #a5a1aa, #afafaf);
        color: #000000;
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
        color: #000000;
        margin-bottom: 1rem;
        font-size: 1.2rem;
        font-weight: 600;
      }

      .footer-info p {
        color: #000000;
        margin-bottom: 0.5rem;
        line-height: 1.6;
      }

      .footer-links ul,
      .footer-contact ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem 1rem;
      }

      .footer-links li,
      .footer-contact li {
        margin-bottom: 0;
      }

      .footer-links a,
      .footer-contact a,
      .footer-link {
        color: #000000 !important;
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
        color: #000000;
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
        
        .footer-links ul,
        .footer-contact ul {
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem 1rem;
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
            <h3>ЗевсПротивАида</h3>
            <p>📍 221B Baker Street, London, NW1 6XE, UK</p>
            <p>📞 +44 20 7156 7099</p>
            <p>✉️ welcome@zevsprotivaida.com</p>
          </div>
          
          
            <div class="footer-links">
              <h4>Menu</h4>
              <ul>
                <li><a href="index.html" class="footer-link">зевспротиваида</a></li>
                <li><a href="olympus.html" class="footer-link">олимп</a></li><li><a href="powerofgods.html" class="footer-link">сила богов</a></li><li><a href="earlyaccess.html" class="footer-link">доступ</a></li><li><a href="chronicles.html" class="footer-link">хроники</a></li><li><a href="oracle.html" class="footer-link">оракул</a></li><li><a href="voices.html" class="footer-link">голоса</a></li><li><a href="myths.html" class="footer-link">мифы</a></li><li><a href="contact.html" class="footer-link">контакты</a></li>
              </ul>
            </div>
          
          
          <div class="footer-contact">
            <h4>Legal Information</h4>
            <ul>
              <li><a href="privacy-policy.html" class="footer-link">Privacy Policy</a></li>
              <li><a href="terms-of-service.html" class="footer-link">Terms of Service</a></li>
              <li><a href="cookie-policy.html" class="footer-link">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 ЗевсПротивАида. All rights reserved.</p>
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
