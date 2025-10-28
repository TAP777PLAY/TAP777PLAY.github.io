// 💰 Общий компонент баланса для всех игр
// Управляет балансом пользователя и синхронизирует его между играми

(function() {
  'use strict';
  
  // Глобальные переменные баланса
  let userBalance = 5000;
  let currentBet = 50;
  let totalWins = 0;
  
  // Ключи для localStorage
  const STORAGE_KEYS = {
    BALANCE: 'socialspin_balance',
    BET: 'socialspin_bet',
    WINS: 'socialspin_wins'
  };
  
  function injectBalanceStyles() {
    if (document.getElementById('balance-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'balance-styles';
    style.textContent = `
      .balance-widget {
        position: fixed;
        top: 120px;
        right: 20px;
        background: linear-gradient(135deg, #1a0038 0%, #04142a 100%);
        border: 2px solid #2196f3;
        border-radius: 12px;
        padding: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        z-index: 999;
        min-width: 180px;
        backdrop-filter: blur(10px);
      }

      .balance-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(33, 150, 243, 0.3);
      }

      .balance-item:last-child {
        border-bottom: none;
      }

      .balance-label {
        font-size: 0.9rem;
        color: #aaa;
        font-weight: 500;
      }

      .balance-value {
        font-size: 1.2rem;
        color: #00ffff;
        font-weight: 700;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      }

      .balance-value.balance-amount {
        font-size: 1.4rem;
        color: #4caf50;
        text-shadow: 0 0 15px rgba(76, 175, 80, 0.6);
      }

      .balance-value.bet-amount {
        color: #ff9800;
        text-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
      }

      .balance-value.wins-amount {
        color: #e91e63;
        text-shadow: 0 0 10px rgba(233, 30, 99, 0.5);
      }

      /* Адаптивные стили */
      @media (max-width: 768px) {
        .balance-widget {
          top: 110px;
          right: 10px;
          min-width: 160px;
          padding: 0.8rem;
        }

        .balance-label {
          font-size: 0.8rem;
        }

        .balance-value {
          font-size: 1rem;
        }

        .balance-value.balance-amount {
          font-size: 1.2rem;
        }
      }

      @media (max-width: 480px) {
        .balance-widget {
          top: 100px;
          right: 5px;
          min-width: 140px;
          padding: 0.6rem;
        }

        .balance-label {
          font-size: 0.7rem;
        }

        .balance-value {
          font-size: 0.9rem;
        }

        .balance-value.balance-amount {
          font-size: 1.1rem;
        }
      }

      /* Скрытие на игровых страницах */
      .game-page .balance-widget {
        display: none;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  function createBalanceWidget() {
    return `
      <div class="balance-widget" id="balance-widget">
        <div class="balance-item">
          <span class="balance-label">Баланс</span>
          <span class="balance-value balance-amount" id="global-balance">${userBalance}</span>
        </div>
        <div class="balance-item">
          <span class="balance-label">Ставка</span>
          <span class="balance-value bet-amount" id="global-bet">${currentBet}</span>
        </div>
        <div class="balance-item">
          <span class="balance-label">Победы</span>
          <span class="balance-value wins-amount" id="global-wins">${totalWins}</span>
        </div>
      </div>
    `;
  }
  
  // Функции для работы с балансом
  function saveBalance() {
    try {
      localStorage.setItem(STORAGE_KEYS.BALANCE, userBalance.toString());
      localStorage.setItem(STORAGE_KEYS.BET, currentBet.toString());
      localStorage.setItem(STORAGE_KEYS.WINS, totalWins.toString());
      console.log('Баланс сохранен:', { balance: userBalance, bet: currentBet, wins: totalWins });
    } catch(e) {
      console.warn('Не удалось сохранить баланс:', e);
      // Пробуем альтернативный способ сохранения
      try {
        sessionStorage.setItem(STORAGE_KEYS.BALANCE, userBalance.toString());
        sessionStorage.setItem(STORAGE_KEYS.BET, currentBet.toString());
        sessionStorage.setItem(STORAGE_KEYS.WINS, totalWins.toString());
        console.log('Баланс сохранен в sessionStorage');
      } catch(e2) {
        console.error('Не удалось сохранить баланс ни в localStorage, ни в sessionStorage:', e2);
      }
    }
  }
  
  function loadBalance() {
    try {
      const savedBalance = localStorage.getItem(STORAGE_KEYS.BALANCE);
      const savedBet = localStorage.getItem(STORAGE_KEYS.BET);
      const savedWins = localStorage.getItem(STORAGE_KEYS.WINS);
      
      console.log('Загружаем данные из localStorage:', { savedBalance, savedBet, savedWins });
      
      if (savedBalance) {
        userBalance = parseInt(savedBalance);
        console.log('Загружен баланс:', userBalance);
      }
      if (savedBet) {
        currentBet = parseInt(savedBet);
        console.log('Загружена ставка:', currentBet);
      }
      if (savedWins) {
        totalWins = parseInt(savedWins);
        console.log('Загружены победы:', totalWins);
      }
      
      // Если ничего не загружено, пробуем sessionStorage
      if (!savedBalance && !savedBet && !savedWins) {
        console.log('Пробуем загрузить из sessionStorage...');
        const sessionBalance = sessionStorage.getItem(STORAGE_KEYS.BALANCE);
        const sessionBet = sessionStorage.getItem(STORAGE_KEYS.BET);
        const sessionWins = sessionStorage.getItem(STORAGE_KEYS.WINS);
        
        if (sessionBalance) userBalance = parseInt(sessionBalance);
        if (sessionBet) currentBet = parseInt(sessionBet);
        if (sessionWins) totalWins = parseInt(sessionWins);
        
        console.log('Загружено из sessionStorage:', { balance: userBalance, bet: currentBet, wins: totalWins });
      }
      
    } catch(e) {
      console.warn('Не удалось загрузить баланс:', e);
      console.log('Используем значения по умолчанию:', { balance: userBalance, bet: currentBet, wins: totalWins });
    }
  }
  
  function updateBalanceDisplay() {
    const balanceEl = document.getElementById('global-balance');
    const betEl = document.getElementById('global-bet');
    const winsEl = document.getElementById('global-wins');
    
    if (balanceEl) balanceEl.textContent = userBalance;
    if (betEl) betEl.textContent = currentBet;
    if (winsEl) winsEl.textContent = totalWins;
    
    // Обновляем отображение во всех играх
    updateGameDisplays();
  }
  
  function updateGameDisplays() {
    // Обновляем отображение в играх
    const gameBalanceElements = document.querySelectorAll('#balance, #sideBalance');
    const gameBetElements = document.querySelectorAll('#bet, #sideBet');
    const gameWinsElements = document.querySelectorAll('#wins, #sideWins');
    
    gameBalanceElements.forEach(el => {
      if (el) el.textContent = userBalance;
    });
    
    gameBetElements.forEach(el => {
      if (el) el.textContent = currentBet;
    });
    
    gameWinsElements.forEach(el => {
      if (el) el.textContent = totalWins;
    });
  }
  
  // Публичные методы для игр
  window.BalanceManager = {
    // Получить текущий баланс
    getBalance: () => userBalance,
    
    // Установить баланс
    setBalance: (amount) => {
      userBalance = Math.max(0, amount);
      saveBalance();
      updateBalanceDisplay();
    },
    
    // Добавить к балансу
    addBalance: (amount) => {
      userBalance += amount;
      saveBalance();
      updateBalanceDisplay();
    },
    
    // Вычесть из баланса
    subtractBalance: (amount) => {
      userBalance = Math.max(0, userBalance - amount);
      saveBalance();
      updateBalanceDisplay();
    },
    
    // Получить текущую ставку
    getBet: () => currentBet,
    
    // Установить ставку
    setBet: (amount) => {
      currentBet = Math.max(10, Math.min(amount, userBalance));
      saveBalance();
      updateBalanceDisplay();
    },
    
    // Получить количество побед
    getWins: () => totalWins,
    
    // Добавить победу
    addWin: () => {
      totalWins++;
      saveBalance();
      updateBalanceDisplay();
    },
    
    // Сбросить все данные
    reset: () => {
      userBalance = 5000;
      currentBet = 50;
      totalWins = 0;
      saveBalance();
      updateBalanceDisplay();
    },
    
    // Обновить отображение
    updateDisplay: updateBalanceDisplay,
    
    // Обновить отображение в играх
    updateGameDisplays: updateGameDisplays,
    
    // Принудительно сохранить данные
    forceSave: () => {
      saveBalance();
      console.log('Принудительное сохранение выполнено');
    },
    
    // Принудительно загрузить данные
    forceLoad: () => {
      loadBalance();
      updateBalanceDisplay();
      console.log('Принудительная загрузка выполнена');
    },
    
    // Получить текущие данные
    getCurrentData: () => {
      return { balance: userBalance, bet: currentBet, wins: totalWins };
    },
    
    // Проверить localStorage
    checkStorage: () => {
      try {
        const balance = localStorage.getItem(STORAGE_KEYS.BALANCE);
        const bet = localStorage.getItem(STORAGE_KEYS.BET);
        const wins = localStorage.getItem(STORAGE_KEYS.WINS);
        console.log('Данные в localStorage:', { balance, bet, wins });
        return { balance, bet, wins };
      } catch(e) {
        console.error('Ошибка при проверке localStorage:', e);
        return null;
      }
    }
  };
  
  function init() {
    console.log('Инициализация компонента баланса...');
    injectBalanceStyles();
    loadBalance();
    
    // Создаем виджет баланса
    let container = document.getElementById('balance-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'balance-container';
      document.body.appendChild(container);
    }
    
    container.innerHTML = createBalanceWidget();
    updateBalanceDisplay();
    
    // Скрываем виджет на игровых страницах
    const isGamePage = document.body.classList.contains('game-page') || 
                      window.location.pathname.includes('blackjack') ||
                      window.location.pathname.includes('poker') ||
                      window.location.pathname.includes('dice') ||
                      window.location.pathname.includes('slots') ||
                      window.location.pathname.includes('roulette');
    
    if (isGamePage) {
      const widget = document.getElementById('balance-widget');
      if (widget) widget.style.display = 'none';
    }
    
    // Автоматическое сохранение при изменении данных
    setInterval(() => {
      if (window.BalanceManager) {
        window.BalanceManager.forceSave();
      }
    }, 5000); // Сохраняем каждые 5 секунд
    
    // Сохранение при закрытии страницы
    window.addEventListener('beforeunload', () => {
      if (window.BalanceManager) {
        window.BalanceManager.forceSave();
      }
    });
    
    console.log('Компонент баланса инициализирован:', { balance: userBalance, bet: currentBet, wins: totalWins });
  }
  
  // Инициализация
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Экспорт для использования в других скриптах
  window.initBalanceManager = init;
})();
