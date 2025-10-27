// Age Verification Modal for SocialSpin Casino
(function() {
  'use strict';
  
  // Проверяем, подтвердил ли пользователь возраст
  function hasVerifiedAge() {
    const verified = localStorage.getItem('ageVerified');
    const verificationDate = localStorage.getItem('ageVerificationDate');
    
    if (verified === 'true' && verificationDate) {
      // Проверяем, что подтверждение не старше 365 дней
      const date = new Date(verificationDate);
      const now = new Date();
      const daysDiff = (now - date) / (1000 * 60 * 60 * 24);
      
      return daysDiff < 365;
    }
    
    return false;
  }
  
  // Создаем стили для модального окна
  function injectStyles() {
    if (document.getElementById('age-verification-styles')) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'age-verification-styles';
    style.textContent = `
      #age-verification-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(4, 20, 42, 0.95);
        backdrop-filter: blur(8px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.5s ease-out;
      }
      
      #age-verification-modal.hidden {
        display: none;
      }
      
      .age-modal-content {
        background: linear-gradient(135deg, #04142a 0%, #1a0038 100%);
        border: 2px solid #e91616;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(233, 22, 22, 0.3), 0 0 60px rgba(33, 150, 243, 0.2);
        max-width: 500px;
        width: 90%;
        padding: 40px;
        position: relative;
        animation: slideUp 0.5s ease-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .age-modal-header {
        text-align: center;
        margin-bottom: 24px;
      }
      
      .age-modal-title {
        font-size: 28px;
        font-weight: 700;
        color: #e91616;
        margin-bottom: 12px;
        text-shadow: 0 0 20px rgba(233, 22, 22, 0.5);
        font-family: 'Montserrat', sans-serif;
      }
      
      .age-modal-subtitle {
        font-size: 16px;
        color: #00ffff;
        opacity: 0.9;
        line-height: 1.5;
        font-family: 'Roboto', sans-serif;
      }
      
      .age-modal-body {
        margin-bottom: 24px;
        text-align: left;
      }
      
      .age-modal-text {
        color: #ffffff;
        font-size: 15px;
        line-height: 1.6;
        margin-bottom: 16px;
        font-family: 'Roboto', sans-serif;
      }
      
      .age-modal-warning {
        background: rgba(233, 22, 22, 0.15);
        border-left: 4px solid #e91616;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 20px;
      }
      
      .age-modal-warning-text {
        color: #ffcccc;
        font-size: 14px;
        line-height: 1.5;
        font-weight: 500;
      }
      
      .age-modal-buttons {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
      
      .age-modal-button {
        flex: 1;
        min-width: 140px;
        padding: 14px 24px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Montserrat', sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .age-verify-yes {
        background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
      }
      
      .age-verify-yes:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
        background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
      }
      
      .age-verify-yes:active {
        transform: translateY(0);
      }
      
      .age-verify-no {
        background: transparent;
        color: #ff6b6b;
        border: 2px solid #ff6b6b;
      }
      
      .age-verify-no:hover {
        background: rgba(255, 107, 107, 0.1);
        transform: translateY(-2px);
      }
      
      .age-modal-disclaimer {
        text-align: center;
        margin-top: 16px;
      }
      
      .age-modal-disclaimer-text {
        color: #888;
        font-size: 12px;
        line-height: 1.4;
      }
      
      @media (max-width: 480px) {
        .age-modal-content {
          padding: 24px;
        }
        
        .age-modal-title {
          font-size: 22px;
        }
        
        .age-modal-subtitle {
          font-size: 14px;
        }
        
        .age-modal-buttons {
          flex-direction: column;
        }
        
        .age-modal-button {
          width: 100%;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Создаем HTML модального окна
  function createModal() {
    const modal = document.createElement('div');
    modal.id = 'age-verification-modal';
    
    modal.innerHTML = `
      <div class="age-modal-content">
        <div class="age-modal-header">
          <h2 class="age-modal-title">Подтверждение возраста</h2>
          <p class="age-modal-subtitle">Для доступа к SocialSpin Casino требуется подтверждение возраста</p>
        </div>
        
        <div class="age-modal-body">
          <p class="age-modal-text">
            <strong>Важная информация:</strong> SocialSpin Casino — это платформа виртуального казино, 
            предназначенная исключительно для лиц, достигших возраста 18 лет.
          </p>
          
          <div class="age-modal-warning">
            <p class="age-modal-warning-text">
              Убедитесь, что вы достигли совершеннолетия согласно законодательству вашей страны.
            </p>
          </div>
          
          <p class="age-modal-text">
            Подтвердив свой возраст, вы соглашаетесь с тем, что:
          </p>
          <ul style="color: #00ffff; font-size: 14px; line-height: 1.8; margin-left: 20px;">
            <li>Вам исполнилось 18 лет или больше</li>
            <li>Вы понимаете характер игры</li>
            <li>Игра происходит с виртуальной валютой без реальных ставок</li>
          </ul>
        </div>
        
        <div class="age-modal-buttons">
          <button class="age-modal-button age-verify-yes">Да, мне 18+</button>
          <button class="age-modal-button age-verify-no">Нет, я младше</button>
        </div>
        
        <div class="age-modal-disclaimer">
          <p class="age-modal-disclaimer-text">
            Ответственность за соответствие возрастным требованиям лежит на пользователе
          </p>
        </div>
      </div>
    `;
    
    return modal;
  }
  
  // Инициализация
  function init() {
    // Если возраст уже подтвержден, не показываем модальное окно
    if (hasVerifiedAge()) {
      return;
    }
    
    // Добавляем стили
    injectStyles();
    
    // Создаем модальное окно
    const modal = createModal();
    document.body.appendChild(modal);
    
    // Обработчики кнопок
    const yesButton = modal.querySelector('.age-verify-yes');
    const noButton = modal.querySelector('.age-verify-no');
    
    // Подтверждение возраста
    yesButton.addEventListener('click', function() {
      localStorage.setItem('ageVerified', 'true');
      localStorage.setItem('ageVerificationDate', new Date().toISOString());
      
      // Анимация закрытия
      modal.style.opacity = '0';
      modal.style.transition = 'opacity 0.3s ease-out';
      
      setTimeout(function() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }, 300);
    });
    
    // Отказ (перенаправляем на главную или закрываем сайт)
    noButton.addEventListener('click', function() {
      // Можно перенаправить на Google или показать сообщение
      alert('Извините, SocialSpin Casino предназначен только для лиц старше 18 лет.');
      
      // Опционально: перенаправление на другую страницу
      // window.location.href = 'https://www.google.com';
      
      modal.style.opacity = '0';
      modal.style.transition = 'opacity 0.3s ease-out';
      
      setTimeout(function() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }, 300);
    });
    
    // Блокируем скролл пока модальное окно открыто
    document.body.style.overflow = 'hidden';
    
    // Предотвращаем закрытие модального окна кликом вне его
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        e.stopPropagation();
      }
    });
  }
  
  // Автозапуск
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Экспорт функции для ручного вызова (если нужно)
  window.showAgeVerification = function() {
    localStorage.removeItem('ageVerified');
    localStorage.removeItem('ageVerificationDate');
    
    // Удаляем существующее модальное окно если есть
    const existing = document.getElementById('age-verification-modal');
    if (existing) {
      existing.remove();
    }
    
    // Блокируем скролл
    document.body.style.overflow = 'hidden';
    
    init();
  };
  
  // Функция для очистки и тестирования
  window.clearAgeVerification = function() {
    localStorage.removeItem('ageVerified');
    localStorage.removeItem('ageVerificationDate');
  };
})();

