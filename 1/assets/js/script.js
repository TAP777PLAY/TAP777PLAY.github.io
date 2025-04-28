
      document.addEventListener('DOMContentLoaded', function() {
        // Меню-бургер
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
          menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
          });

          // Закрываем меню при клике на ссылку
          const navLinks = navMenu.querySelectorAll('a');
          navLinks.forEach(link => {
            link.addEventListener('click', () => {
              menuToggle.classList.remove('active');
              navMenu.classList.remove('active');
            });
          });

          // Закрываем меню при клике вне меню
          document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
              menuToggle.classList.remove('active');
              navMenu.classList.remove('active');
            }
          });
        }

        // Плавная прокрутка к якорям
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          });
        });

        // Обработчик отправки формы
        window.handleSubmit = function(event) {
          event.preventDefault();
          const form = document.getElementById('contactForm');
          const formData = new FormData(form);
          
          // Здесь можно добавить отправку данных на сервер
          // Например, через fetch или XMLHttpRequest
          
          // Открываем страницу merci.html в новой вкладке
          window.open('merci.html', '_blank');
        };
      });
    