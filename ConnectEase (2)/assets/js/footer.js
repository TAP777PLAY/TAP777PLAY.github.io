// 🆕 Современный футер в стиле сегментированной шапки
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
        background: #1a1a1a;
        color: #ffffff;
        padding: 2rem 2rem 1.5rem;
        margin-top: auto;
        position: relative;
        overflow: hidden;
      }

      .site-footer::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #1976d2, #42a5f5, #1976d2);
      }

      .footer-container {
        max-width: 1400px;
        margin: 0 auto;
        position: relative;
        z-index: 2;
      }

      .footer-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 3rem;
        margin-bottom: 1.5rem;
      }

      .footer-menu-columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }

      .footer-brand {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .footer-logo {
        font-size: 1.8rem;
        font-weight: 700;
        color: #ffffff;
        text-decoration: none;
        transition: all 0.3s ease;
        display: inline-block;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .footer-logo:hover {
        color: #42a5f5;
        transform: translateY(-1px);
      }

      .footer-tagline {
        font-size: 0.95rem;
        color: #bdc3c7;
        line-height: 1.5;
        margin-bottom: 0.5rem;
        opacity: 0.9;
      }

      .footer-contact-info {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        color: #ecf0f1;
        font-size: 0.85rem;
        transition: all 0.3s ease;
        padding: 0.3rem 0;
      }

      .contact-item:hover {
        color: #42a5f5;
        transform: translateX(3px);
      }

      .contact-icon {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(66, 165, 245, 0.1);
        border-radius: 50%;
        font-size: 0.8rem;
        color: #42a5f5;
        transition: all 0.3s ease;
      }

      .contact-item:hover .contact-icon {
        background: rgba(66, 165, 245, 0.2);
        transform: scale(1.05);
      }

      .footer-section h4 {
        color: #ffffff;
        margin-bottom: 1rem;
        font-size: 1.1rem;
        font-weight: 600;
        position: relative;
        padding-bottom: 0.3rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .footer-section h4::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 30px;
        height: 2px;
        background: linear-gradient(90deg, #1976d2, #42a5f5);
        border-radius: 1px;
      }

      .footer-menu-toggle {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        user-select: none;
        transition: all 0.3s ease;
      }

      .footer-menu-toggle:hover {
        color: #42a5f5;
      }

      .toggle-icon {
        font-size: 1.2rem;
        font-weight: 300;
        transition: transform 0.3s ease;
      }

      .footer-menu-toggle.active .toggle-icon {
        transform: rotate(45deg);
      }

      .footer-menu-content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
      }

      .footer-menu-content.active {
        max-height: 500px;
      }

      /* Раскрывающиеся меню работают на всех устройствах */

      .footer-links ul,
      .footer-legal ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }

      .footer-links li,
      .footer-legal li {
        margin: 0;
      }

      .footer-links a,
      .footer-legal a,
      .footer-link {
        color: #bdc3c7 !important;
        text-decoration: none !important;
        transition: all 0.3s ease;
        display: inline-block;
        padding: 0.3rem 0;
        font-size: 0.85rem;
        position: relative;
        opacity: 0.8;
      }

      .footer-links a::before,
      .footer-legal a::before,
      .footer-link::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0;
        height: 1px;
        background: linear-gradient(90deg, #1976d2, #42a5f5);
        transition: width 0.3s ease;
      }

      .footer-links a:hover,
      .footer-legal a:hover,
      .footer-link:hover {
        color: #42a5f5 !important;
        opacity: 1;
        transform: translateX(3px);
      }

      .footer-links a:hover::before,
      .footer-legal a:hover::before,
      .footer-link:hover::before {
        width: 100%;
      }

      .footer-bottom {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 1rem;
        text-align: center;
        position: relative;
      }

      .footer-copyright {
        color: #95a5a6;
        font-size: 0.8rem;
        margin: 0;
        opacity: 0.8;
      }

      /* Мобильная адаптивность */
      @media (max-width: 1024px) {
        .footer-content {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        .footer-menu-columns {
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        
        .footer-brand {
          text-align: center;
        }
      }

      @media (max-width: 768px) {
        .site-footer {
          padding: 1.5rem 1rem 1rem;
        }
        
        .footer-content {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        .footer-menu-columns {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        .footer-brand {
          text-align: center;
        }
        
        .footer-section h4 {
          font-size: 1rem;
        }
      }

      @media (max-width: 480px) {
        .site-footer {
          padding: 1rem 1rem 0.8rem;
        }
        
        .footer-content {
          gap: 1rem;
        }
        
        .footer-logo {
          font-size: 1.4rem;
        }
        
        .footer-tagline {
          font-size: 0.85rem;
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
          <div class="footer-brand">
            <a href="index.html" class="footer-logo">ConnectEase</a>
            <p class="footer-tagline">Empowering Your Digital Connection Journey with personalized telecom consultation services in the UAE.</p>
            <div class="footer-contact-info">
              <div class="contact-item">
                <div class="contact-icon">📍</div>
                <span>Sheikh Zayed Road, Business Bay, Dubai, UAE</span>
              </div>
              <div class="contact-item">
                <div class="contact-icon">📞</div>
                <span>+971 4 444 2556</span>
              </div>
              <div class="contact-item">
                <div class="contact-icon">✉️</div>
                <span>director@connectease.com</span>
              </div>
            </div>
          </div>
          
          <div class="footer-menu-columns">
            <div class="footer-section footer-links">
              <h4 class="footer-menu-toggle">Navigation <span class="toggle-icon">+</span></h4>
              <ul class="footer-menu-content">
                <li><a href="index.html" class="footer-link">Home</a></li>
                <li><a href="our-network.html" class="footer-link">About Us</a></li>
                <li><a href="connectivity-plans.html" class="footer-link">Services</a></li>
                <li><a href="smart-benefits.html" class="footer-link">Benefits</a></li>
                <li><a href="digital-pulse.html" class="footer-link">Updates</a></li>
                <li><a href="help-hub.html" class="footer-link">FAQ</a></li>
                <li><a href="user-voices.html" class="footer-link">Testimonials</a></li>
                <li><a href="contact.html" class="footer-link">Contact Us</a></li>
              </ul>
            </div>
            
            <div class="footer-section footer-legal">
              <h4 class="footer-menu-toggle">Legal <span class="toggle-icon">+</span></h4>
              <ul class="footer-menu-content">
                <li><a href="privacy-policy.html" class="footer-link">Privacy Policy</a></li>
                <li><a href="terms-of-service.html" class="footer-link">Terms of Service</a></li>
                <li><a href="cookie-policy.html" class="footer-link">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p class="footer-copyright">&copy; 2025 ConnectEase. All rights reserved.</p>
        </div>
      </div>
    </footer>`;
  }
  
  // Инициализация раскрывающихся меню
  function initFooterMenus() {
    const menuToggles = document.querySelectorAll('.footer-menu-toggle');
    
    menuToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const content = toggle.nextElementSibling;
        const isActive = toggle.classList.contains('active');
        
        // Закрываем все другие меню
        menuToggles.forEach(otherToggle => {
          if (otherToggle !== toggle) {
            otherToggle.classList.remove('active');
            otherToggle.nextElementSibling.classList.remove('active');
          }
        });
        
        // Переключаем текущее меню
        if (isActive) {
          toggle.classList.remove('active');
          content.classList.remove('active');
        } else {
          toggle.classList.add('active');
          content.classList.add('active');
        }
      });
    });
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
    
    // Инициализируем раскрывающиеся меню
    initFooterMenus();
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
