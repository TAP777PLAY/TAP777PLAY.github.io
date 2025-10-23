// 🎯 Современный стилизованный футер с адаптивным дизайном
// Включает: логотип, навигацию, контакты, социальные сети, мобильную адаптацию

(function() {
  'use strict';
  
  function injectFooterStyles() {
    if (document.getElementById('footer-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'footer-styles';
    style.textContent = `
      /* Основные стили футера */
      .site-footer {
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
        backdrop-filter: blur(20px);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding: 3rem 2rem 1.5rem;
        margin-top: auto;
        position: relative;
        overflow: hidden;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.4), 0 -1px 3px rgba(0,0,0,0.2);
      }

      .site-footer::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #ff6b35, #f7931e, #ff6b35);
        opacity: 0.8;
      }

      .footer-container {
        max-width: 1400px;
        margin: 0 auto;
        position: relative;
        z-index: 2;
      }

      .footer-content {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 3rem;
        margin-bottom: 2.5rem;
        align-items: start;
      }

      /* Logo and company information */
      .footer-branding {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .footer-logo-section {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .footer-logo {
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        font-weight: bold;
        color: white;
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4), 0 2px 8px rgba(255, 107, 53, 0.2);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .footer-logo::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.6s ease;
      }

      .footer-logo:hover::before {
        left: 100%;
      }

      .footer-logo:hover {
        transform: scale(1.05) rotate(2deg);
        box-shadow: 0 6px 20px rgba(255, 107, 53, 0.6), 0 3px 12px rgba(255, 107, 53, 0.3);
      }

      .footer-title {
        margin: 0;
        font-size: 1.8rem;
        font-weight: 800;
        color: #ffffff;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.5);
        font-family: 'Montserrat', sans-serif;
        letter-spacing: -0.5px;
        transition: all 0.3s ease;
      }

      .footer-title:hover {
        text-shadow: 0 0 20px rgba(255, 105, 180, 0.8);
        transform: scale(1.02);
      }

      .footer-description {
        color: rgba(255, 255, 255, 0.8);
        font-size: 1rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        font-family: 'Montserrat', sans-serif;
      }

      .footer-contact-info {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;
        transition: all 0.3s ease;
        padding: 0.3rem 0;
      }

      .contact-item:hover {
        color: #ff6b35;
        transform: translateX(5px);
      }

      .contact-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #ff6b35;
        transition: all 0.3s ease;
      }

      .contact-item:hover .contact-icon {
        transform: scale(1.2);
        color: #f7931e;
      }

      /* Навигационные секции */
      .footer-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .footer-section h4 {
        color: #ffffff;
        margin: 0 0 1.2rem 0;
        font-size: 1.3rem;
        font-weight: 700;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        font-family: 'Montserrat', sans-serif;
        position: relative;
        padding-bottom: 0.5rem;
      }

      .footer-section h4::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 30px;
        height: 2px;
        background: linear-gradient(90deg, #ff6b35, #f7931e);
        border-radius: 1px;
        transition: width 0.3s ease;
      }

      .footer-section h4:hover::after {
        width: 50px;
      }

      .footer-links {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .footer-links li {
        margin: 0;
      }

      .footer-links a {
        color: rgba(255, 255, 255, 0.8) !important;
        text-decoration: none !important;
        font-weight: 500;
        font-size: 0.95rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 0.4rem 0.8rem;
        border-radius: 8px;
        position: relative;
        display: inline-block;
        font-family: 'Montserrat', sans-serif;
        letter-spacing: 0.3px;
        overflow: hidden;
      }

      .footer-links a::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 107, 53, 0.05));
        border-radius: 8px;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: -1;
      }

      .footer-links a:hover {
        color: #ff6b35 !important;
        background: rgba(255, 107, 53, 0.15);
        transform: translateX(5px) translateY(-2px);
        text-shadow: 0 2px 8px rgba(255, 107, 53, 0.8);
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
      }

      .footer-links a:hover::before {
        opacity: 1;
      }


      /* Нижняя часть футера */
      .footer-bottom {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .footer-copyright {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9rem;
        margin: 0;
        font-family: 'Montserrat', sans-serif;
      }

      .footer-legal {
        display: flex;
        gap: 1.5rem;
        align-items: center;
      }

      .footer-legal a {
        color: rgba(255, 255, 255, 0.6) !important;
        text-decoration: none !important;
        font-size: 0.85rem;
        transition: all 0.3s ease;
        padding: 0.3rem 0.6rem;
        border-radius: 4px;
      }

      .footer-legal a:hover {
        color: #ff6b35 !important;
        background: rgba(255, 107, 53, 0.1);
        transform: translateY(-1px);
      }

      /* Мобильная адаптивность */
      @media (max-width: 1024px) {
        .footer-content {
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
        }
        
        .footer-branding {
          grid-column: 1 / -1;
        }
      }

      @media (max-width: 768px) {
        .site-footer {
          padding: 2.5rem 1.5rem 1.5rem;
        }
        
        .footer-content {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        .footer-branding {
          grid-column: 1;
          text-align: center;
        }
        
        .footer-logo-section {
          justify-content: center;
        }
        
        .footer-section {
          text-align: center;
        }
        
        .footer-section h4::after {
          left: 50%;
          transform: translateX(-50%);
        }
        
        .footer-links {
          align-items: center;
        }
        
        .footer-links a {
          text-align: center;
          min-width: 120px;
        }
        
        
        .footer-bottom {
          flex-direction: column;
          text-align: center;
          gap: 1.5rem;
        }
        
        .footer-legal {
          justify-content: center;
          flex-wrap: wrap;
        }
      }

      @media (max-width: 480px) {
        .site-footer {
          padding: 2rem 1rem 1rem;
        }
        
        .footer-logo {
          width: 45px;
          height: 45px;
          font-size: 20px;
        }
        
        .footer-title {
          font-size: 1.5rem;
        }
        
        .footer-description {
          font-size: 0.9rem;
        }
        
        .footer-section h4 {
          font-size: 1.1rem;
        }
        
        .footer-links a {
          font-size: 0.9rem;
          padding: 0.3rem 0.6rem;
        }
        
        
        .footer-copyright {
          font-size: 0.8rem;
        }
        
        .footer-legal a {
          font-size: 0.8rem;
        }
      }

      /* Анимации появления */
      .footer-content > * {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
        transform: translateY(20px);
      }

      .footer-content > *:nth-child(1) { animation-delay: 0.1s; }
      .footer-content > *:nth-child(2) { animation-delay: 0.2s; }
      .footer-content > *:nth-child(3) { animation-delay: 0.3s; }
      .footer-content > *:nth-child(4) { animation-delay: 0.4s; }

      @keyframes fadeInUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Эффект свечения для активных элементов */
      .footer-links a:focus {
        outline: 2px solid #ff6b35;
        outline-offset: 2px;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Создание HTML футера
  function createFooter() {
    return `<footer class="site-footer">
      <div class="footer-container">
        <div class="footer-content">
          <!-- Logo and company information -->
          <div class="footer-branding">
            <div class="footer-logo-section">
              <div class="footer-logo">S</div>
              <h3 class="footer-title">ShadowsOfValhalla</h3>
            </div>
            <p class="footer-description">
              Step into a world of Nordic legends and Viking battles. 
              Discover ancient myths reimagined with modern storytelling and cinematic visuals.
            </p>
            <div class="footer-contact-info">
              <div class="contact-item">
                <div class="contact-icon">📍</div>
                <span>10 Downing Street, Westminster, London, SW1A 2AA, UK</span>
              </div>
              <div class="contact-item">
                <div class="contact-icon">📞</div>
                <span>+44 20 7627 3599</span>
              </div>
              <div class="contact-item">
                <div class="contact-icon">✉️</div>
                <span>manager@shadowsofvalhalla.com</span>
              </div>
            </div>
          </div>
          
          <!-- Navigation -->
          <div class="footer-section">
            <h4>Navigation</h4>
            <ul class="footer-links">
              <li><a href="index.html">Home</a></li>
              <li><a href="echoes-of.html">Echoes of Valhalla</a></li>
              <li><a href="runic-strengths.html">Runic Strengths</a></li>
              <li><a href="viking-crafts.html">Viking Crafts</a></li>
              <li><a href="saga-chronicle.html">Saga Chronicle</a></li>
              <li><a href="lorekeepers-notes.html">Lorekeepers Notes</a></li>
              <li><a href="voices-of.html">Voices of the Ancients</a></li>
              <li><a href="hall-of.html">Hall of Heroes</a></li>
            </ul>
          </div>
          
          <!-- Contact -->
          <div class="footer-section">
            <h4>Contact</h4>
            <ul class="footer-links">
              <li><a href="contact.html">Contact Us</a></li>
              <li><a href="merci.html">Acknowledgments</a></li>
              <li><a href="mailto:manager@shadowsofvalhalla.com">Send Email</a></li>
              <li><a href="tel:+442076273599">Call Us</a></li>
            </ul>
          </div>
          
          <!-- Legal Information -->
          <div class="footer-section">
            <h4>Legal Information</h4>
            <ul class="footer-links">
              <li><a href="privacy-policy.html">Privacy Policy</a></li>
              <li><a href="terms-of-service.html">Terms of Service</a></li>
              <li><a href="cookie-policy.html">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p class="footer-copyright">&copy; 2025 ShadowsOfValhalla. All rights reserved.</p>
          <div class="footer-legal">
            <a href="privacy-policy.html">Privacy</a>
            <a href="terms-of-service.html">Terms</a>
            <a href="cookie-policy.html">Cookies</a>
          </div>
        </div>
      </div>
    </footer>`;
  }
  
  // Инициализация интерактивности
  function initFooterInteractivity() {
    // Анимация появления при скролле
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, observerOptions);

    // Наблюдаем за элементами футера
    const footerElements = document.querySelectorAll('.footer-content > *');
    footerElements.forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });


    // Обработка hover эффектов для контактной информации
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateX(5px)';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateX(0)';
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
    
    // Инициализируем интерактивность
    setTimeout(() => {
      initFooterInteractivity();
    }, 100);
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
