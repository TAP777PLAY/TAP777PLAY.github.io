(function() {
  'use strict';

  // Эмулятор скорости интернета
  class InternetSpeedEmulator {
    constructor() {
      this.isRunning = false;
      this.downloadSpeed = 0;
      this.uploadSpeed = 0;
      this.ping = 0;
      
      this.init();
    }

    init() {
      this.bindEvents();
    }

    bindEvents() {
      const testBtn = document.getElementById('speed-test-btn');
      if (testBtn) {
        testBtn.addEventListener('click', () => this.startSpeedTest());
      }
    }

    startSpeedTest() {
      if (this.isRunning) return;

      this.isRunning = true;
      this.updateButtonState(true);
      this.resetValues();
      
      // Симуляция теста скорости
      this.simulateSpeedTest();
    }

    resetValues() {
      this.updateMetric('download-speed', 0);
      this.updateMetric('upload-speed', 0);
      this.updateMetric('ping-value', 0);
      this.updateProgress(0, 'Initializing test...');
    }

    simulateSpeedTest() {
      const steps = [
        { progress: 10, text: 'Testing ping...', duration: 1000 },
        { progress: 30, text: 'Testing download speed...', duration: 2000 },
        { progress: 60, text: 'Testing upload speed...', duration: 2000 },
        { progress: 80, text: 'Calculating results...', duration: 1000 },
        { progress: 100, text: 'Test completed!', duration: 500 }
      ];

      let currentStep = 0;
      const runStep = () => {
        if (currentStep >= steps.length) {
          this.completeTest();
          return;
        }

        const step = steps[currentStep];
        this.updateProgress(step.progress, step.text);

        // Симуляция анимации значений
        if (step.progress === 10) {
          this.animatePing();
        } else if (step.progress === 30) {
          this.animateDownload();
        } else if (step.progress === 60) {
          this.animateUpload();
        }

        setTimeout(() => {
          currentStep++;
          runStep();
        }, step.duration);
      };

      runStep();
    }

    animatePing() {
      const targetPing = this.getRandomPing();
      this.animateValue('ping-value', 0, targetPing, 1000);
    }

    animateDownload() {
      const targetSpeed = this.getRandomDownloadSpeed();
      this.animateValue('download-speed', 0, targetSpeed, 2000);
    }

    animateUpload() {
      const targetSpeed = this.getRandomUploadSpeed();
      this.animateValue('upload-speed', 0, targetSpeed, 2000);
    }

    animateValue(elementId, start, end, duration) {
      const element = document.getElementById(elementId);
      if (!element) return;

      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }

    getRandomPing() {
      // Реалистичные значения пинга для ОАЭ
      const pingValues = [8, 12, 15, 18, 22, 25, 28, 32, 35, 40];
      return pingValues[Math.floor(Math.random() * pingValues.length)];
    }

    getRandomDownloadSpeed() {
      // Реалистичные скорости скачивания для ОАЭ (Mbps)
      const downloadSpeeds = [45, 67, 89, 112, 134, 156, 178, 201, 223, 245, 267, 289, 312, 334, 356];
      return downloadSpeeds[Math.floor(Math.random() * downloadSpeeds.length)];
    }

    getRandomUploadSpeed() {
      // Реалистичные скорости загрузки для ОАЭ (Mbps)
      const uploadSpeeds = [12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96];
      return uploadSpeeds[Math.floor(Math.random() * uploadSpeeds.length)];
    }

    updateMetric(elementId, value) {
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = value;
      }
    }

    updateProgress(percentage, text) {
      const progressFill = document.getElementById('progress-fill');
      const progressText = document.getElementById('progress-text');
      
      if (progressFill) {
        progressFill.style.width = percentage + '%';
      }
      
      if (progressText) {
        progressText.textContent = text;
      }
    }

    updateButtonState(loading) {
      const button = document.getElementById('speed-test-btn');
      if (!button) return;

      if (loading) {
        button.classList.add('loading');
        button.disabled = true;
      } else {
        button.classList.remove('loading');
        button.disabled = false;
      }
    }

    completeTest() {
      this.isRunning = false;
      this.updateButtonState(false);
      
      // Показываем финальные результаты
      setTimeout(() => {
        this.updateProgress(100, 'Speed test completed successfully!');
      }, 500);
    }
  }

  // Инициализация при загрузке страницы
  function initSpeedEmulator() {
    if (document.getElementById('speed-test-btn')) {
      new InternetSpeedEmulator();
    }
  }

  // Автозапуск
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpeedEmulator);
  } else {
    initSpeedEmulator();
  }

  // Экспорт для совместимости
  window.initSpeedEmulator = initSpeedEmulator;
})();
