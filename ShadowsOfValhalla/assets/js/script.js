

      // Инициализация React библиотек

      document.addEventListener('DOMContentLoaded', function() {

        console.log('React libraries loaded for multi-page site');

        

        // Глобальные переменные для доступа к библиотекам

        if (typeof React !== 'undefined') window.React = React;

        if (typeof ReactDOM !== 'undefined') window.ReactDOM = ReactDOM;

        if (typeof MaterialUI !== 'undefined') window.MaterialUI = MaterialUI;

        if (typeof FramerMotion !== 'undefined') window.FramerMotion = FramerMotion;

        if (typeof ReactCountUp !== 'undefined') window.ReactCountUp = ReactCountUp;

        if (typeof ReactConfetti !== 'undefined') window.ReactConfetti = ReactConfetti;

        if (typeof QRCodeReact !== 'undefined') window.QRCodeReact = QRCodeReact;

        if (typeof ReactPlayer !== 'undefined') window.ReactPlayer = ReactPlayer;

        if (typeof ReactRatingStarsComponent !== 'undefined') window.ReactRatingStarsComponent = ReactRatingStarsComponent;

        if (typeof ReactTextTransition !== 'undefined') window.ReactTextTransition = ReactTextTransition;

        if (typeof ReactShare !== 'undefined') window.ReactShare = ReactShare;

        if (typeof ReactCopyToClipboard !== 'undefined') window.ReactCopyToClipboard = ReactCopyToClipboard;

        if (typeof ReactColor !== 'undefined') window.ReactColor = ReactColor;

        if (typeof ReactDatepicker !== 'undefined') window.ReactDatepicker = ReactDatepicker;

        if (typeof ReactSelect !== 'undefined') window.ReactSelect = ReactSelect;

        if (typeof ReactScroll !== 'undefined') window.ReactScroll = ReactScroll;

        if (typeof ReactRnd !== 'undefined') window.ReactRnd = ReactRnd;

        if (typeof ReactImageCrop !== 'undefined') window.ReactImageCrop = ReactImageCrop;

        if (typeof ReactMarkdown !== 'undefined') window.ReactMarkdown = ReactMarkdown;

        if (typeof ReactPlotly !== 'undefined') window.ReactPlotly = ReactPlotly;

        if (typeof ReactApexcharts !== 'undefined') window.ReactApexcharts = ReactApexcharts;

        if (typeof ReactChartjs2 !== 'undefined') window.ReactChartjs2 = ReactChartjs2;

        if (typeof Recharts !== 'undefined') window.Recharts = Recharts;

        if (typeof ApexCharts !== 'undefined') window.ApexCharts = ApexCharts;

        if (typeof Chart !== 'undefined') window.Chart = Chart;

        if (typeof Plotly !== 'undefined') window.Plotly = Plotly;

        if (typeof Swiper !== 'undefined') window.Swiper = Swiper;

        if (typeof axios !== 'undefined') window.axios = axios;

        if (typeof dayjs !== 'undefined') window.dayjs = dayjs;

        if (typeof marked !== 'undefined') window.marked = marked;

        if (typeof uuid !== 'undefined') window.uuid = uuid;

        if (typeof browserImageCompression !== 'undefined') window.browserImageCompression = browserImageCompression;

        if (typeof FileSaver !== 'undefined') window.FileSaver = FileSaver;

        if (typeof JSZip !== 'undefined') window.JSZip = JSZip;

        if (typeof Formik !== 'undefined') window.Formik = Formik;

        if (typeof yup !== 'undefined') window.yup = yup;

        if (typeof ReactHookForm !== 'undefined') window.ReactHookForm = ReactHookForm;

        if (typeof HookformResolvers !== 'undefined') window.HookformResolvers = HookformResolvers;

        if (typeof Slate !== 'undefined') window.Slate = Slate;

        if (typeof SlateReact !== 'undefined') window.SlateReact = SlateReact;

        if (typeof SlateHistory !== 'undefined') window.SlateHistory = SlateHistory;

        if (typeof TipTapReact !== 'undefined') window.TipTapReact = TipTapReact;

        if (typeof TipTapStarterKit !== 'undefined') window.TipTapStarterKit = TipTapStarterKit;

        if (typeof TipTapExtensionColor !== 'undefined') window.TipTapExtensionColor = TipTapExtensionColor;

        if (typeof TipTapExtensionHighlight !== 'undefined') window.TipTapExtensionHighlight = TipTapExtensionHighlight;

        if (typeof TipTapExtensionImage !== 'undefined') window.TipTapExtensionImage = TipTapExtensionImage;

        if (typeof TipTapExtensionLink !== 'undefined') window.TipTapExtensionLink = TipTapExtensionLink;

        if (typeof TipTapExtensionTable !== 'undefined') window.TipTapExtensionTable = TipTapExtensionTable;

        if (typeof TipTapExtensionTextAlign !== 'undefined') window.TipTapExtensionTextAlign = TipTapExtensionTextAlign;

        if (typeof TipTapExtensionUnderline !== 'undefined') window.TipTapExtensionUnderline = TipTapExtensionUnderline;

        if (typeof DndKitCore !== 'undefined') window.DndKitCore = DndKitCore;

        if (typeof DndKitSortable !== 'undefined') window.DndKitSortable = DndKitSortable;

        if (typeof DndKitUtilities !== 'undefined') window.DndKitUtilities = DndKitUtilities;

        if (typeof Visx !== 'undefined') window.Visx = Visx;

        if (typeof Victory !== 'undefined') window.Victory = Victory;

        if (typeof Zustand !== 'undefined') window.Zustand = Zustand;

        

        console.log('All React libraries initialized successfully');

      });

      

      document.addEventListener('DOMContentLoaded', function() {

        // Mobile menu toggle

        const menuToggle = document.querySelector('.menu-toggle');

        const navMenu = document.querySelector('.nav-menu');

        

        if (menuToggle && navMenu) {

          menuToggle.addEventListener('click', function() {

            menuToggle.classList.toggle('active');

            navMenu.classList.toggle('active');

          });



          // Close menu when clicking a link

          const navLinks = navMenu.querySelectorAll('a');

          navLinks.forEach(link => {

            link.addEventListener('click', () => {

              menuToggle.classList.remove('active');

              navMenu.classList.remove('active');

            });

          });



          // Close menu when clicking outside

          document.addEventListener('click', (e) => {

            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {

              menuToggle.classList.remove('active');

              navMenu.classList.remove('active');

            }

          });

        }



        // Smooth scroll to anchors

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



        // Form submission handler

        window.handleSubmit = function(event) {

          event.preventDefault();

          const form = document.getElementById('contactForm');

          const formData = new FormData(form);

          

          // Send form data

          fetch('https://formspree.io/f/', {

            method: 'POST',

            body: formData,

            headers: {

              'Accept': 'application/json'

            }

          }).finally(() => {

            // Always redirect to merci.html with parameters

            const thankYouMessage = encodeURIComponent('Thank you for reaching out to Shadows of Valhalla. Your message has been received, and our team will contact you shortly with a detailed response.');

            const closeButtonText = encodeURIComponent('Return to Home');

            window.location.href = `merci.html?message=${thankYouMessage}&closeButtonText=${closeButtonText}`;

          });

        };



        // Cards and images scroll animation

        const animatedEls = document.querySelectorAll('.card, .section-image img, .about-image img');

        const observer = new IntersectionObserver((entries) => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add('animate-on-scroll');

              observer.unobserve(entry.target);

            }

          });

        }, { threshold: 0.15 });

        animatedEls.forEach(el => observer.observe(el));

        

        // Initialize automatic image slideshows

        initImageGalleries();

        

        // Initialize new AI elements
        // initAIElements(); // Функция доступна только в редакторе

        

        // Auto-detect and display current domain

        autoDisplayDomain();

        

        // Also call with delay for reliability

        setTimeout(autoDisplayDomain, 100);

      });

      

      // Function to initialize all image galleries on the page

      function initImageGalleries() {

        const galleries = document.querySelectorAll('.section-gallery');

        

        galleries.forEach(gallery => {

          const images = gallery.querySelectorAll('.gallery-img');

          const dots = gallery.querySelectorAll('.gallery-dot');

          let currentIndex = 0;

          let interval = null;

          

          // If there are less than 2 images, do nothing

          if (images.length < 2) return;

          

          // Function to switch slides

          function showSlide(index) {

                          // Hide all images

            images.forEach(img => img.style.display = 'none');

            

                          // Reset active dots

            dots.forEach(dot => dot.style.backgroundColor = 'rgba(255,255,255,0.5)');

            

                          // Show selected image

            if (images[index]) {

              images[index].style.display = 'block';

            }

            

                          // Update active dot

            if (dots[index]) {

              dots[index].style.backgroundColor = '#ffffff';

            }

            

            currentIndex = index;

          }

          

          // Set handlers for navigation dots

          dots.forEach((dot, index) => {

            dot.addEventListener('click', () => {

              clearInterval(interval); // Stop auto-scroll on manual switch

              showSlide(index);

                              startAutoScroll(); // Restart auto-scroll

            });

          });

          

          // Function to start auto-scroll

          function startAutoScroll() {

                          // Clear previous interval if it exists

            if (interval) {

              clearInterval(interval);

            }

            

                          // Set new interval

            interval = setInterval(() => {

              const nextIndex = (currentIndex + 1) % images.length;

              showSlide(nextIndex);

            }, 3000); // 3 seconds interval between slides

          }

          

          // Add handlers to stop auto-scroll on hover

          gallery.addEventListener('mouseenter', () => {

            clearInterval(interval);

          });

          

          gallery.addEventListener('mouseleave', () => {

            startAutoScroll();

          });

          

          // Start auto-scroll on load

          startAutoScroll();

          

          // Add swipe on mobile devices

          let touchStartX = 0;

          let touchEndX = 0;

          

          gallery.addEventListener('touchstart', e => {

            touchStartX = e.changedTouches[0].screenX;

          }, false);

          

          gallery.addEventListener('touchend', e => {

            touchEndX = e.changedTouches[0].screenX;

            handleSwipe();

          }, false);

          

          function handleSwipe() {

            if (touchEndX < touchStartX) {

              // Swipe left - next slide

              clearInterval(interval);

              showSlide((currentIndex + 1) % images.length);

              startAutoScroll();

            } else if (touchEndX > touchStartX) {

              // Swipe right - previous slide

              clearInterval(interval);

              showSlide((currentIndex - 1 + images.length) % images.length);

              startAutoScroll();

            }

          }

        });

      }

      

      // Function to automatically detect and display current domain

      function autoDisplayDomain() {

        // Get current domain from browser

        const currentDomain = window.location.hostname;

        console.log('Current domain detected:', currentDomain);

        

        // Skip if localhost or IP address

        if (currentDomain === 'localhost' || 

            currentDomain === '127.0.0.1' || 

            currentDomain.includes('192.168.') ||

            currentDomain.includes('10.0.') ||

            /^d+.d+.d+.d+$/.test(currentDomain)) {

          console.log('Skipping domain display for localhost/IP');

          return;

        }

        

        console.log('Auto-displaying domain:', currentDomain);

        

        // Find domain display element in header

        const domainElement = document.querySelector('.domain, .site-domain');

        

        if (domainElement) {

          // Update existing domain element

          domainElement.textContent = currentDomain;

          domainElement.style.display = 'block';

          console.log('Updated header domain element');

        } else {

          // Create new domain element if it doesn't exist

          const sitebranding = document.querySelector('.site-branding');

          if (sitebranding) {

            const domainDiv = document.createElement('div');

            domainDiv.className = 'domain';

            domainDiv.textContent = currentDomain;

            domainDiv.style.cssText = 'color: inherit; opacity: 0.8; font-size: 0.9rem; margin-top: 4px;';

            sitebranding.appendChild(domainDiv);

            console.log('Created new header domain element');

          }

        }

        

        // Update contact domain elements

        const allContactDomainElements = document.querySelectorAll('.contact-domain');

        console.log('Found contact domain elements:', allContactDomainElements.length);

        

        allContactDomainElements.forEach((domainElement, index) => {

          const oldText = domainElement.textContent;

          domainElement.textContent = currentDomain;

          domainElement.style.display = 'block'; // Show the element like in header

          console.log('Updated contact domain element', index + 1, 'from:', oldText, 'to:', currentDomain);

        });

        

        // Update footer domain elements

        const allFooterDomainElements = document.querySelectorAll('.footer-domain');

        console.log('Found footer domain elements:', allFooterDomainElements.length);

        

        allFooterDomainElements.forEach((domainElement, index) => {

          const oldText = domainElement.textContent;

          domainElement.textContent = currentDomain;

          domainElement.style.display = 'block'; // Show the element like in header

          console.log('Updated footer domain element', index + 1, 'from:', oldText, 'to:', currentDomain);

        });

        

        // Update any other domain references on the page

        const domainPlaceholders = document.querySelectorAll('[data-auto-domain]');

        domainPlaceholders.forEach(element => {

          element.textContent = currentDomain;

        });

        

        // Update contact email if it contains placeholder domain

        const emailElements = document.querySelectorAll('a[href*="@"], [data-email]');

        emailElements.forEach(element => {

          const href = element.getAttribute('href') || '';

          const text = element.textContent || '';

          

          if (href.includes('@example.com') || text.includes('@example.com')) {

            const newHref = href.replace('@example.com', `@${currentDomain}`);

            const newText = text.replace('@example.com', `@${currentDomain}`);

            

            if (href !== newHref) element.setAttribute('href', newHref);

            if (text !== newText) element.textContent = newText;

          }

        });

        

        // Initialize content elements

        initContentElements();

      }

      

      // Function to initialize content elements

      function initContentElements() {

        // Initialize animated counters

        const counters = document.querySelectorAll('.counter');

        const counterObserver = new IntersectionObserver((entries) => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              const counter = entry.target;

              const start = parseInt(counter.dataset.start) || 0;

              const end = parseInt(counter.dataset.end) || 100;

              const duration = parseInt(counter.dataset.duration) || 2000;

              

              animateCounter(counter, start, end, duration);

              counterObserver.unobserve(counter);

            }

          });

        }, { threshold: 0.5 });

        

        counters.forEach(counter => counterObserver.observe(counter));

        

        // Initialize typewriter text

        const typewriters = document.querySelectorAll('.typewriter');

        typewriters.forEach(initTypewriter);

        
        // Re-initialize typewriter text after a short delay to catch dynamically loaded content
        setTimeout(() => {
          const newTypewriters = document.querySelectorAll('.typewriter:not([data-initialized])');
          newTypewriters.forEach(element => {
            element.setAttribute('data-initialized', 'true');
            initTypewriter(element);
          });
        }, 100);
        
        // Also initialize counters specifically
        if (window.reinitializeCounters) {
          window.reinitializeCounters();
        }
        
        // Also initialize FAQ functionality
        console.log('🔧 [initContentElements] Initializing FAQ functionality...');
        const faqElements = document.querySelectorAll('.faq-section');
        console.log('🔧 [initContentElements] Found FAQ elements:', faqElements.length);
      }

      

      // Function to animate counters

      function animateCounter(element, start, end, duration) {

        const startTime = performance.now();

        const difference = end - start;

        

        function updateCounter(currentTime) {

          const elapsed = currentTime - startTime;

          const progress = Math.min(elapsed / duration, 1);

          

          // Easing function (ease-out)

          const easeOut = 1 - Math.pow(1 - progress, 3);

          const current = Math.round(start + (difference * easeOut));

          

          element.textContent = current;

          

          if (progress < 1) {

            requestAnimationFrame(updateCounter);

          }

        }

        

        requestAnimationFrame(updateCounter);

      }

      

      // Function to initialize typewriter effect

      function initTypewriter(element) {

        const texts = JSON.parse(element.dataset.texts || '["Default text"]');

        const speed = parseInt(element.dataset.speed) || 150;

        const pauseTime = parseInt(element.dataset.pause) || 2000;

        const repeat = element.dataset.repeat !== 'false';

        

        // Find the text content span

        const textContentSpan = element.querySelector('.typewriter-text-content');

        if (!textContentSpan) {

          console.error('Typewriter text content span not found');

          return;

        }

        

        let textIndex = 0;

        let charIndex = 0;

        let isDeleting = false;

        

        function typeText() {

          const fullText = texts[textIndex];

          let displayText = '';

          

          if (isDeleting) {

            displayText = fullText.substring(0, charIndex - 1);

            charIndex--;

          } else {

            displayText = fullText.substring(0, charIndex + 1);

            charIndex++;

          }

          

          // Update only the text content, cursor stays separate

          textContentSpan.textContent = displayText;

          

          let typeSpeed = speed;

          

          if (isDeleting) {

            typeSpeed = speed / 2;

          }

          

          if (!isDeleting && charIndex === fullText.length) {

            // Finished typing, pause before deleting

            typeSpeed = pauseTime;

            isDeleting = true;

          } else if (isDeleting && charIndex === 0) {

            // Finished deleting, move to next text

            isDeleting = false;

            textIndex = (textIndex + 1) % texts.length;

            

            // If not repeating and we've gone through all texts, stop

            if (!repeat && textIndex === 0) {

              // Show final text and dim cursor

              textContentSpan.textContent = texts[0];

              const cursor = element.querySelector('.typewriter-cursor');

              if (cursor) cursor.style.display = 'none';

              return;

            }

            

            typeSpeed = speed;

          }

          

          setTimeout(typeText, typeSpeed);

        }

        

        // Start the typewriter effect

        typeText();

      }

      
      // Global function to re-initialize typewriter animations
      window.reinitializeTypewriters = function() {
        const typewriters = document.querySelectorAll('.typewriter:not([data-initialized])');
        typewriters.forEach(element => {
          element.setAttribute('data-initialized', 'true');
          initTypewriter(element);
        });
      };
      
      // Global function to re-initialize counter animations
      window.reinitializeCounters = function() {
        const counters = document.querySelectorAll('.counter:not([data-counter-initialized])');
        counters.forEach(counter => {
          counter.setAttribute('data-counter-initialized', 'true');
          
          const start = parseInt(counter.dataset.start) || 0;
          const end = parseInt(counter.dataset.end) || 100;
          const duration = parseInt(counter.dataset.duration) || 2000;
          
          // Create intersection observer for this specific counter
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                // Animate counter
                const startTime = performance.now();
                const difference = end - start;
                
                function updateCounter(currentTime) {
                  const elapsed = currentTime - startTime;
                  const progress = Math.min(elapsed / duration, 1);
                  
                  // Easing function (ease-out)
                  const easeOut = 1 - Math.pow(1 - progress, 3);
                  const current = Math.round(start + (difference * easeOut));
                  
                  counter.textContent = current;
                  
                  if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                  }
                }
                
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
              }
            });
          }, { threshold: 0.3 });
          
          observer.observe(counter);
        });
      };
      
      // Global function to toggle FAQ accordion
      window.toggleFAQ = function(index) {
        console.log('🔧 [toggleFAQ] Called with index:', index);
        
        const answer = document.getElementById('faq-answer-' + index);
        console.log('🔧 [toggleFAQ] Found answer element:', answer);
        
        const container = answer ? answer.parentElement : null;
        const icon = container ? container.querySelector('span') : null;
        console.log('🔧 [toggleFAQ] Found icon:', icon);
        
        if (answer) {
          const isVisible = answer.style.display !== 'none';
          console.log('🔧 [toggleFAQ] Is visible:', isVisible);
          
          answer.style.display = isVisible ? 'none' : 'block';
          
          // Обновляем иконку
          if (icon) {
            icon.textContent = isVisible ? '▼' : '▲';
            console.log('🔧 [toggleFAQ] Updated icon to:', icon.textContent);
          }
        } else {
          console.error('🔧 [toggleFAQ] Answer element not found for index:', index);
        }
      };
      

      // 🔥 ГЛОБАЛЬНЫЕ ФУНКЦИИ для модальных окон карточек

      // Открытие модального окна с полной поддержкой стилей

      window.openCardModal = function(title, content, cardBgColor, cardTitleColor, cardTextColor, colorSettingsJson, cardImageSrc) {
        console.log('🎴 [CARD MODAL] ФУНКЦИЯ openCardModal ВЫЗВАНА!');

        console.log('🎴 [CARD MODAL] Параметры:', { title, content, cardBgColor, cardTitleColor, cardTextColor, colorSettingsJson, cardImageSrc });
        

        // Парсинг настроек стилей

        let colorSettings = {};

        try {

          if (colorSettingsJson && colorSettingsJson !== 'undefined') {

            colorSettings = JSON.parse(colorSettingsJson);

          }

        } catch (error) {

          console.warn('Ошибка парсинга colorSettings:', error);

        }

        

        console.log('🎴 [CARD MODAL] colorSettings:', colorSettings);

        

        // Создание модального окна

        const modal = document.createElement('div');

        modal.id = 'global-card-modal';

        modal.style.cssText = `

          display: none;

          position: fixed;

          z-index: 1000;

          left: 0;

          top: 0;

          width: 100%;

          height: 100%;

          background-color: rgba(0,0,0,0.5);

          backdrop-filter: blur(5px);

        `;

        

        // Создание контента модального окна

        const modalContent = document.createElement('div');

        

        // 🔥 ИСПРАВЛЕНИЕ: Определяем, является ли фон градиентом

        const isGradient = cardBgColor && (cardBgColor.includes('gradient') || cardBgColor.includes('linear-gradient') || cardBgColor.includes('radial-gradient'));

        

        modalContent.style.cssText = `

          position: relative;

          ${isGradient ? 'background: ' + cardBgColor + ';' : 'background-color: ' + (cardBgColor || '#ffffff') + ';'}

          margin: 5% auto;

          padding: 0;

          width: 90%;

          max-width: 800px;

          max-height: 90vh;

          overflow: auto;

          border-radius: ${colorSettings.borderRadius || 16}px;

          box-shadow: ${colorSettings.boxShadow ? '0 8px 32px rgba(0,0,0,0.15)' : '0 8px 32px rgba(0,0,0,0.15)'};

          border: ${colorSettings.borderWidth || 0}px solid ${colorSettings.borderColor || 'transparent'};

        `;

        

        // Создание содержимого

        const contentHTML = `

          <div style="

            padding: ${colorSettings.padding || 24}px;

            text-align: center;

          ">

            ${cardImageSrc && cardImageSrc.trim() && !cardImageSrc.includes('placeholder') ? `
              <div style="
                width: 100%;
                max-width: 400px;
                height: 250px;
                margin: 0 auto 20px auto;
                border-radius: ${(colorSettings.borderRadius || 16) - 4}px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              ">
                <img src="${cardImageSrc}" alt="${title}" style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  transition: transform 0.3s ease;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              </div>
            ` : ''}
            <h2 style="

              color: ${cardTitleColor || '#333333'};

              font-size: ${colorSettings.textFields?.titleFontSize || 28}px;

              margin-bottom: 16px;

              font-weight: bold;

              line-height: 1.3;

            ">${title || 'Заголовок'}</h2>

            <div style="

              color: ${cardTextColor || '#666666'};

              font-size: ${colorSettings.textFields?.textFontSize || 16}px;

              line-height: 1.6;

              text-align: left;

            ">${content || 'Содержимое карточки'}</div>

          </div>

        `;

        

        modalContent.innerHTML = contentHTML;

        modal.appendChild(modalContent);

        document.body.appendChild(modal);

        

        // Показываем модальное окно

        modal.style.display = 'block';

        

        // Анимация появления

        modalContent.style.opacity = '0';

        modalContent.style.transform = 'scale(0.9)';

        modalContent.style.transition = 'all 0.3s ease';

        

        requestAnimationFrame(() => {

          modalContent.style.opacity = '1';

          modalContent.style.transform = 'scale(1)';

          console.log('🎴 [CARD MODAL] Модальное окно успешно открыто!');

        });

        

        // Закрытие по клику вне модального окна

        modal.addEventListener('click', function(e) {

          if (e.target === modal) {

            window.closeCardModal();

          }

        });

        

        // Закрытие по Escape

        const handleEscape = function(e) {

          if (e.key === 'Escape') {

            window.closeCardModal();

            document.removeEventListener('keydown', handleEscape);

          }

        };

        document.addEventListener('keydown', handleEscape);

      };

      

      // Закрытие модального окна с анимацией

      window.closeCardModal = function() {

        console.log('🎴 [CARD MODAL] ФУНКЦИЯ closeCardModal ВЫЗВАНА!');

        

        const modal = document.getElementById('global-card-modal');

        if (modal) {

          const modalContent = modal.querySelector('div');

          if (modalContent) {

            // Анимация исчезновения

            modalContent.style.opacity = '0';

            modalContent.style.transform = 'scale(0.9)';

            

            setTimeout(() => {

              modal.remove();

              console.log('🎴 [CARD MODAL] Модальное окно успешно закрыто!');

            }, 300);

          } else {

            modal.remove();

          }

        }

      };

      

      // Проверка доступности функций

      console.log('🎯 [FUNCTIONS] openCardModal доступна:', typeof window.openCardModal === 'function');

      console.log('🎯 [FUNCTIONS] closeCardModal доступна:', typeof window.closeCardModal === 'function');

      

      // 🔥 WRAPPER ФУНКЦИИ для множественных карточек

      // Создаем wrapper функции для каждого элемента множественных карточек

      window.generateMultipleCardModalWrappers = function() {

        // Находим все элементы множественных карточек

        const multipleCardElements = document.querySelectorAll('.multiple-cards');

        

        multipleCardElements.forEach((element, elementIndex) => {

          const elementId = element.id;

          if (!elementId) return;

          

          const cleanElementId = elementId.replace(/-/g, '_');

          const wrapperFunctionName = `openMultipleCardModal${cleanElementId}`;

          

          // Создаем wrapper функцию для этого элемента

          window[wrapperFunctionName] = function(cardIndex) {

            console.log(`🎴 [WRAPPER] ${wrapperFunctionName} вызвана с индексом:`, cardIndex);

            

            // Находим карточку по индексу

            const cards = element.querySelectorAll('[data-card-index]');

            const targetCard = Array.from(cards).find(card => 

              parseInt(card.getAttribute('data-card-index')) === cardIndex

            );

            

            if (!targetCard) {

              console.error('🎴 [WRAPPER] Карточка не найдена для индекса:', cardIndex);

              return;

            }

            

            // Извлекаем данные из карточки

            const cardTitle = targetCard.querySelector('h3')?.textContent || targetCard.querySelector('h4')?.textContent || 'Заголовок карточки';

            const cardContent = targetCard.querySelector('p')?.textContent || 'Содержимое карточки';

            
            // 🔥 НОВОЕ: Извлекаем изображение из карточки
            let cardImageSrc = '';
            const imageElement = targetCard.querySelector('img');
            if (imageElement) {
              cardImageSrc = imageElement.src || imageElement.getAttribute('src') || '';
              console.log('🎴 [WRAPPER] Найдено изображение:', cardImageSrc);
            } else {
              console.log('🎴 [WRAPPER] Изображение не найдено в карточке');
            }
            

            // Получаем стили карточки

            const computedStyle = window.getComputedStyle(targetCard);

            

            // 🔥 ИСПРАВЛЕНИЕ: Извлекаем градиентный фон, а не только backgroundColor

            let cardBgColor = computedStyle.background || computedStyle.backgroundImage || computedStyle.backgroundColor || '#ffffff';

            

            // Если фон пустой, пытаемся извлечь из inline стилей

            if (!cardBgColor || cardBgColor === 'rgba(0, 0, 0, 0)' || cardBgColor === 'transparent') {

              const inlineStyle = targetCard.getAttribute('style');

              if (inlineStyle) {

                const backgroundMatch = inlineStyle.match(/background[^:]*:s*([^;]+)/);

                if (backgroundMatch) {

                  cardBgColor = backgroundMatch[1].trim();

                }

              }

            }

            

            // Если все еще пустой, используем значение по умолчанию

            if (!cardBgColor || cardBgColor === 'rgba(0, 0, 0, 0)' || cardBgColor === 'transparent') {

              cardBgColor = '#ffffff';

            }

            

            // 🔥 ИСПРАВЛЕНИЕ: Извлекаем цвета заголовка и содержимого из конкретных элементов

            const titleElement = targetCard.querySelector('h3');

            const contentElement = targetCard.querySelector('p');

            

            let cardTitleColor = '#333333';

            let cardContentColor = '#666666';

            

            if (titleElement) {

              const titleStyle = window.getComputedStyle(titleElement);

              cardTitleColor = titleStyle.color || '#333333';

            }

            

            if (contentElement) {

              const contentStyle = window.getComputedStyle(contentElement);

              cardContentColor = contentStyle.color || '#666666';

            }

            

            // Если цвета не найдены, пытаемся извлечь из inline стилей

            if (cardTitleColor === '#333333' || cardContentColor === '#666666') {

              const inlineStyle = targetCard.getAttribute('style');

              if (inlineStyle) {

                // Ищем color в inline стилях

                const colorMatch = inlineStyle.match(/color:s*([^;]+)/);

                if (colorMatch) {

                  const inlineColor = colorMatch[1].trim();

                  if (cardTitleColor === '#333333') cardTitleColor = inlineColor;

                  if (cardContentColor === '#666666') cardContentColor = inlineColor;

                }

              }

            }

            

            // Извлекаем colorSettings из data-атрибута или используем значения по умолчанию

            let colorSettings = {};

            try {

              const colorSettingsData = element.getAttribute('data-color-settings');

              if (colorSettingsData) {

                colorSettings = JSON.parse(colorSettingsData);

              }

            } catch (error) {

              console.warn('Ошибка парсинга colorSettings из data-атрибута:', error);

            }

            

            // Если colorSettings пустые, создаем базовые настройки

            if (Object.keys(colorSettings).length === 0) {

              colorSettings = {

                borderRadius: 16,

                padding: 24,

                borderWidth: 0,

                borderColor: 'transparent',

                boxShadow: true,

                textFields: {

                  titleFontSize: 28,

                  textFontSize: 16

                }

              };

            }

            

            // 🔥 ИСПРАВЛЕНИЕ: Приоритет для цветов из colorSettings

            if (colorSettings.textFields?.cardTitle) {

              cardTitleColor = colorSettings.textFields.cardTitle;

            } else if (colorSettings.textFields?.title) {

              cardTitleColor = colorSettings.textFields.title;

            }

            if (colorSettings.textFields?.cardText) {

              cardContentColor = colorSettings.textFields.cardText;

            } else if (colorSettings.textFields?.text) {

              cardContentColor = colorSettings.textFields.text;

            }

            

            // 🔥 ИСПРАВЛЕНИЕ: Приоритет для фона из colorSettings.cardBackground

            if (colorSettings.cardBackground?.enabled) {

              if (colorSettings.cardBackground.useGradient) {

                const gradientDir = colorSettings.cardBackground.gradientDirection || 'to right';

                const color1 = colorSettings.cardBackground.gradientColor1 || '#ffffff';

                const color2 = colorSettings.cardBackground.gradientColor2 || '#f0f0f0';

                cardBgColor = `linear-gradient(${gradientDir}, ${color1}, ${color2})`;

              } else {

                cardBgColor = colorSettings.cardBackground.solidColor || cardBgColor;

              }

            }

            

            console.log('🎴 [WRAPPER] Извлеченные данные:', {

              cardTitle,

              cardContent,

              cardBgColor,

              cardTitleColor,

              cardContentColor,

              cardImageSrc,
              colorSettings

            });

            

            // Вызываем глобальную функцию openCardModal

            if (typeof window.openCardModal === 'function') {

              window.openCardModal(

                cardTitle,

                cardContent,

                cardBgColor,

                cardTitleColor,

                cardContentColor,

                JSON.stringify(colorSettings),
                cardImageSrc
              );

            } else {

              console.error('🎴 [WRAPPER] openCardModal не найдена!');

            }

          };

          

          console.log(`🎴 [WRAPPER] Создана функция ${wrapperFunctionName}`);

        });

      };

      

      // Вызываем создание wrapper функций после загрузки DOM

      if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', window.generateMultipleCardModalWrappers);

      } else {

        window.generateMultipleCardModalWrappers();

      }

    