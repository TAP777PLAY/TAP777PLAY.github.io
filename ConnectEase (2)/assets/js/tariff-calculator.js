(function() {
  'use strict';

  // Калькулятор тарифов с реальными ценами ОАЭ
  class TariffCalculator {
    constructor() {
      this.currentTab = 'mobile';
      this.settings = this.loadSettings();
      this.init();
    }

    init() {
      this.bindEvents();
      this.restoreSettings();
      this.updateCalculations();
      this.initializeAnimations();
    }

    bindEvents() {
      // Переключение табов
      const tabBtns = document.querySelectorAll('.tab-btn');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const tab = e.target.dataset.tab;
          this.switchTab(tab);
        });
      });

      // Обновление при изменении слайдеров
      const sliders = document.querySelectorAll('.range-slider');
      sliders.forEach(slider => {
        slider.addEventListener('input', () => {
          this.updateRangeValue(slider);
          this.updateCalculations();
          this.saveSettings();
        });
      });

      // Обновление при изменении селектов
      const selects = document.querySelectorAll('.select-input');
      selects.forEach(select => {
        select.addEventListener('change', () => {
          this.updateCalculations();
          this.saveSettings();
        });
      });
    }

    switchTab(tab) {
      // Обновляем активные табы
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

      // Обновляем активные формы
      document.querySelectorAll('.calculator-form').forEach(form => {
        form.classList.remove('active');
      });
      document.getElementById(`${tab}-calculator`).classList.add('active');

      this.currentTab = tab;
      this.updateCalculations();
    }

    updateRangeValue(slider) {
      const valueSpan = document.getElementById(slider.id + '-value');
      if (!valueSpan) return;

      const value = parseInt(slider.value);
      let displayValue = value;

      // Форматирование значений
      switch(slider.id) {
        case 'mobile-data':
        case 'mobile-internet-data':
          displayValue = value + ' GB';
          break;
        case 'mobile-calls':
          displayValue = value + ' min';
          break;
        case 'mobile-sms':
          displayValue = value + ' SMS';
          break;
        case 'home-speed':
          displayValue = value + ' Mbps';
          break;
        case 'home-users':
          displayValue = value + ' user' + (value > 1 ? 's' : '');
          break;
      }

      valueSpan.textContent = displayValue;
    }

    updateCalculations() {
      switch(this.currentTab) {
        case 'mobile':
          this.calculateMobilePlan();
          break;
        case 'home-internet':
          this.calculateHomeInternet();
          break;
        case 'mobile-internet':
          this.calculateMobileInternet();
          break;
      }
    }

    calculateMobilePlan() {
      const data = parseInt(document.getElementById('mobile-data').value);
      const calls = parseInt(document.getElementById('mobile-calls').value);
      const sms = parseInt(document.getElementById('mobile-sms').value);

      // Реальные тарифы Etisalat и Du в ОАЭ
      let planName, basePrice, dataPrice, voicePrice, totalPrice;
      let features = [];

      if (data >= 50 && calls >= 1000) {
        // Unlimited Plan
        planName = 'Etisalat Unlimited';
        basePrice = 199;
        dataPrice = 0;
        voicePrice = 0;
        totalPrice = 199;
        features = ['✓ Unlimited Data', '✓ Unlimited Calls', '✓ 5G Network', '✓ International Calls'];
      } else if (data >= 30) {
        // Premium Plan
        planName = 'Etisalat Premium';
        basePrice = 149;
        dataPrice = data > 30 ? (data - 30) * 2 : 0;
        voicePrice = calls > 500 ? (calls - 500) * 0.1 : 0;
        totalPrice = basePrice + dataPrice + voicePrice;
        features = ['✓ 30GB Data', '✓ 500 min Calls', '✓ 5G Network'];
      } else if (data >= 15) {
        // Standard Plan
        planName = 'Etisalat Standard';
        basePrice = 99;
        dataPrice = data > 15 ? (data - 15) * 3 : 0;
        voicePrice = calls > 300 ? (calls - 300) * 0.15 : 0;
        totalPrice = basePrice + dataPrice + voicePrice;
        features = ['✓ 15GB Data', '✓ 300 min Calls', '✓ 4G Network'];
      } else {
        // Basic Plan
        planName = 'Etisalat Basic';
        basePrice = 59;
        dataPrice = data > 5 ? (data - 5) * 4 : 0;
        voicePrice = calls > 100 ? (calls - 100) * 0.2 : 0;
        totalPrice = basePrice + dataPrice + voicePrice;
        features = ['✓ 5GB Data', '✓ 100 min Calls', '✓ 4G Network'];
      }

      // SMS не влияет на цену в большинстве планов
      if (sms > 100) {
        totalPrice += Math.ceil((sms - 100) / 100) * 5;
      }

      this.updateResults(planName, totalPrice, basePrice, dataPrice, voicePrice, features);
    }

    calculateHomeInternet() {
      const speed = parseInt(document.getElementById('home-speed').value);
      const users = parseInt(document.getElementById('home-users').value);
      const usage = document.getElementById('home-usage').value;

      // Реальные тарифы домашнего интернета в ОАЭ
      let planName, basePrice, speedMultiplier, userMultiplier, usageMultiplier;
      let features = [];

      // Базовые тарифы Etisalat/Du
      if (speed >= 500) {
        planName = 'Etisalat Fiber 500+';
        basePrice = 299;
        speedMultiplier = 1.2;
        features = ['✓ 500+ Mbps Speed', '✓ Unlimited Data', '✓ Free Router', '✓ 24/7 Support'];
      } else if (speed >= 250) {
        planName = 'Etisalat Fiber 250';
        basePrice = 199;
        speedMultiplier = 1.0;
        features = ['✓ 250 Mbps Speed', '✓ Unlimited Data', '✓ Free Router'];
      } else if (speed >= 100) {
        planName = 'Etisalat Fiber 100';
        basePrice = 149;
        speedMultiplier = 0.8;
        features = ['✓ 100 Mbps Speed', '✓ Unlimited Data'];
      } else {
        planName = 'Etisalat Basic';
        basePrice = 99;
        speedMultiplier = 0.6;
        features = ['✓ 50+ Mbps Speed', '✓ 500GB Data'];
      }

      // Множители
      userMultiplier = users > 5 ? 1.3 : users > 3 ? 1.1 : 1.0;
      usageMultiplier = usage === 'heavy' ? 1.2 : usage === 'standard' ? 1.0 : 0.8;

      const totalPrice = Math.round(basePrice * speedMultiplier * userMultiplier * usageMultiplier);

      this.updateResults(planName, totalPrice, basePrice, 0, 0, features);
    }

    calculateMobileInternet() {
      const data = parseInt(document.getElementById('mobile-internet-data').value);
      const coverage = document.getElementById('mobile-coverage').value;
      const contract = document.getElementById('mobile-contract').value;

      // Реальные тарифы мобильного интернета в ОАЭ
      let planName, basePrice, coverageMultiplier, contractDiscount;
      let features = [];

      if (data >= 100) {
        planName = 'Etisalat Unlimited Mobile';
        basePrice = 199;
        features = ['✓ Unlimited Data', '✓ 5G Network', '✓ Hotspot Sharing'];
      } else if (data >= 50) {
        planName = 'Etisalat Premium Mobile';
        basePrice = 149;
        features = ['✓ 50GB Data', '✓ 5G Network', '✓ Data Rollover'];
      } else if (data >= 25) {
        planName = 'Etisalat Standard Mobile';
        basePrice = 99;
        features = ['✓ 25GB Data', '✓ 4G Network', '✓ Data Rollover'];
      } else {
        planName = 'Etisalat Basic Mobile';
        basePrice = 59;
        features = ['✓ 10GB Data', '✓ 4G Network'];
      }

      // Множители покрытия
      coverageMultiplier = coverage === 'both' ? 1.3 : coverage === 'etisalat' ? 1.0 : 0.9;

      // Скидки за контракт
      contractDiscount = contract === '2year' ? 0.85 : contract === 'yearly' ? 0.9 : 1.0;

      const totalPrice = Math.round(basePrice * coverageMultiplier * contractDiscount);

      this.updateResults(planName, totalPrice, basePrice, 0, 0, features);
    }

    initializeAnimations() {
      // Анимация появления карточек результатов
      const resultCards = document.querySelectorAll('.result-card');
      resultCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'all 0.5s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }

    updateResults(planName, totalPrice, basePrice, dataPrice, voicePrice, features) {
      // Анимация обновления цены
      this.animateValue('plan-price', totalPrice);
      this.animateValue('base-cost', basePrice);
      this.animateValue('data-cost', dataPrice);
      this.animateValue('voice-cost', voicePrice);
      this.animateValue('total-cost', totalPrice);
      
      // Обновляем название плана с анимацией
      const planNameElement = document.getElementById('plan-name');
      planNameElement.style.transform = 'scale(0.95)';
      planNameElement.textContent = planName;
      setTimeout(() => {
        planNameElement.style.transition = 'transform 0.3s ease';
        planNameElement.style.transform = 'scale(1)';
      }, 100);
      
      // Обновляем функции с анимацией
      const featuresContainer = document.getElementById('plan-features');
      featuresContainer.style.opacity = '0.5';
      featuresContainer.innerHTML = features.map(feature => 
        `<div class="feature">${feature}</div>`
      ).join('');
      setTimeout(() => {
        featuresContainer.style.transition = 'opacity 0.3s ease';
        featuresContainer.style.opacity = '1';
      }, 200);
      
      // Обновляем сбережения
      const annualSavings = Math.round((totalPrice * 12) * 0.1);
      this.animateValue('annual-savings', annualSavings);
      
      // Обновляем дополнительные преимущества
      document.getElementById('data-rollover').textContent = features.includes('✓ Data Rollover') ? 'Yes' : 'No';
      document.getElementById('5g-access').textContent = features.includes('✓ 5G Network') ? 'Included' : '4G Only';
    }

    animateValue(elementId, targetValue) {
      const element = document.getElementById(elementId);
      if (!element) return;

      const currentValue = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
      const increment = (targetValue - currentValue) / 20;
      let current = currentValue;

      const animate = () => {
        current += increment;
        if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
          element.textContent = `AED ${targetValue}`;
          return;
        }
        element.textContent = `AED ${Math.round(current)}`;
        requestAnimationFrame(animate);
      };

      animate();
    }

    loadSettings() {
      const saved = localStorage.getItem('tariffCalculatorSettings');
      return saved ? JSON.parse(saved) : {
        mobile: { data: 20, calls: 500, sms: 100 },
        homeInternet: { speed: 250, users: 3, usage: 'standard' },
        mobileInternet: { data: 50, coverage: 'etisalat', contract: 'yearly' }
      };
    }

    saveSettings() {
      const settings = {
        mobile: {
          data: parseInt(document.getElementById('mobile-data').value),
          calls: parseInt(document.getElementById('mobile-calls').value),
          sms: parseInt(document.getElementById('mobile-sms').value)
        },
        homeInternet: {
          speed: parseInt(document.getElementById('home-speed').value),
          users: parseInt(document.getElementById('home-users').value),
          usage: document.getElementById('home-usage').value
        },
        mobileInternet: {
          data: parseInt(document.getElementById('mobile-internet-data').value),
          coverage: document.getElementById('mobile-coverage').value,
          contract: document.getElementById('mobile-contract').value
        }
      };
      localStorage.setItem('tariffCalculatorSettings', JSON.stringify(settings));
    }

    restoreSettings() {
      // Восстанавливаем настройки для мобильных планов
      if (this.settings.mobile) {
        document.getElementById('mobile-data').value = this.settings.mobile.data;
        document.getElementById('mobile-calls').value = this.settings.mobile.calls;
        document.getElementById('mobile-sms').value = this.settings.mobile.sms;
        this.updateRangeValue(document.getElementById('mobile-data'));
        this.updateRangeValue(document.getElementById('mobile-calls'));
        this.updateRangeValue(document.getElementById('mobile-sms'));
      }

      // Восстанавливаем настройки для домашнего интернета
      if (this.settings.homeInternet) {
        document.getElementById('home-speed').value = this.settings.homeInternet.speed;
        document.getElementById('home-users').value = this.settings.homeInternet.users;
        document.getElementById('home-usage').value = this.settings.homeInternet.usage;
        this.updateRangeValue(document.getElementById('home-speed'));
        this.updateRangeValue(document.getElementById('home-users'));
      }

      // Восстанавливаем настройки для мобильного интернета
      if (this.settings.mobileInternet) {
        document.getElementById('mobile-internet-data').value = this.settings.mobileInternet.data;
        document.getElementById('mobile-coverage').value = this.settings.mobileInternet.coverage;
        document.getElementById('mobile-contract').value = this.settings.mobileInternet.contract;
        this.updateRangeValue(document.getElementById('mobile-internet-data'));
      }
    }
  }

  // Инициализация при загрузке страницы
  function initTariffCalculator() {
    if (document.querySelector('.tariff-calculator-section')) {
      new TariffCalculator();
    }
  }

  // Автозапуск
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTariffCalculator);
  } else {
    initTariffCalculator();
  }

  // Экспорт для совместимости
  window.initTariffCalculator = initTariffCalculator;
})();
