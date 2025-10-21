// ===== ОСНОВНОЙ JAVASCRIPT "ТАЙНЫ ДРЕВНЕГО ОЛИМПА" =====

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initHeader();
    initNavigation();
    initModals();
    initScrollEffects();
    initCookieConsent();
    initScrollToTop();
    initAnimations();
    initAccordions();
    initOracleRiddle();
});

// ===== ШАПКА И НАВИГАЦИЯ =====
function initHeader() {
    const header = document.getElementById('header');
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    
    // Фиксация шапки при скролле
    const handleScroll = throttle(function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
    
    // Бургер-меню для мобильных
    if (burger && nav) {
        console.log('Инициализация мобильного меню');
        
        burger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Клик по бургер-меню');
            
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('nav-open');
            
            // Предотвращаем скролл при открытом меню
            if (nav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log('Клик по ссылке навигации');
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('nav-open');
                document.body.style.overflow = '';
            });
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('active') && 
                !nav.contains(e.target) && 
                !burger.contains(e.target)) {
                console.log('Закрытие меню по клику вне');
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('nav-open');
                document.body.style.overflow = '';
            }
        });
        
        // Закрытие меню по Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                console.log('Закрытие меню по Escape');
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('nav-open');
                document.body.style.overflow = '';
            }
        });
    } else {
        console.error('Элементы бургер-меню не найдены:', { burger, nav });
    }
}

// ===== НАВИГАЦИЯ =====
function initNavigation() {
    // Подсветка активной страницы
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Плавная прокрутка к якорям
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== МОДАЛЬНЫЕ ОКНА =====
function initModals() {
    // Открытие модальных окон
    const socialBtns = document.querySelectorAll('.social-btn');
    const legalBtns = document.querySelectorAll('.legal-btn');
    
    // Социальные сети
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const socialType = this.getAttribute('data-social');
            openModal('social-modal');
        });
    });
    
    // Правовые документы
    legalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modalType = this.getAttribute('data-modal');
            openModal(modalType + '-modal');
        });
    });
    
    // Закрытие модальных окон
    const closeBtns = document.querySelectorAll('.modal-close');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-close');
            closeModal(modalId);
        });
    });
    
    // Закрытие по клику вне модального окна
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Анимация появления
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== ЭФФЕКТЫ ПРИ СКРОЛЛЕ =====
function initScrollEffects() {
    // Анимация появления элементов
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-animate');
                
                // Специальная анимация для таймлайна
                if (entry.target.classList.contains('timeline-item')) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, 200);
                }
            }
        });
    }, observerOptions);
    
    // Наблюдение за карточками секций
    const sectionCards = document.querySelectorAll('.section-card');
    sectionCards.forEach(card => {
        observer.observe(card);
    });
    
    // Плавное появление при скролле
    const fadeElements = document.querySelectorAll('.fade-in, .slide-in-up');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
    
    // Анимация таймлайна
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        observer.observe(item);
    });
    
    // Анимация аккордеонов богов
    const godAccordions = document.querySelectorAll('.god-accordion');
    godAccordions.forEach(accordion => {
        observer.observe(accordion);
    });
}

// ===== COOKIE СОГЛАСИЕ =====
function initCookieConsent() {
    // Проверяем, было ли уже показано согласие
    if (!localStorage.getItem('cookieConsent')) {
        showCookieConsent();
    }
}

function showCookieConsent() {
    // Удаляем существующее модальное окно, если есть
    const existingModal = document.getElementById('cookie-consent-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Создаем модальное окно согласия на куки
    const cookieModal = document.createElement('div');
    cookieModal.className = 'modal cookie-modal';
    cookieModal.id = 'cookie-consent-modal';
    cookieModal.innerHTML = `
        <div class="modal-content cookie-modal-content">
            <div class="modal-header">
<h3>Cookie Consent</h3>
            </div>
            <div class="modal-body">
                <p>This website uses cookies to enhance your experience. Accept?</p>
                <div class="cookie-buttons">
                    <button class="btn btn-primary" onclick="acceptCookies()">Accept</button>
                    <button class="btn btn-secondary" onclick="declineCookies()">Decline</button>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем стили для модального окна куки
    const style = document.createElement('style');
    style.textContent = `
        .cookie-modal {
            display: flex !important;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            overflow: hidden;
        }
        
        .cookie-modal.active {
            opacity: 1;
        }
        
        .cookie-modal-content {
            max-width: 400px;
            width: 90%;
            text-align: center;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        }
        
        .cookie-modal.active .cookie-modal-content {
            transform: scale(1);
        }
        
        .cookie-modal .modal-header {
            border-bottom: none;
            padding-bottom: 0;
        }
        
        .cookie-modal .modal-header h3 {
            margin: 0;
            font-size: 1.5rem;
        }
        
        .cookie-modal .modal-body {
            padding: 20px;
        }
        
        .cookie-modal .modal-body p {
            margin-bottom: 20px;
            font-size: 1.1rem;
            color: var(--color-gray);
        }
        
        .cookie-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
        }
        
        .cookie-buttons .btn {
            min-width: 100px;
        }
        
        @media (max-width: 768px) {
            .cookie-modal-content {
                max-width: 350px;
                width: 95%;
                margin: 20px;
            }
            
            .cookie-modal .modal-header h3 {
                font-size: 1.3rem;
            }
            
            .cookie-modal .modal-body p {
                font-size: 1rem;
            }
            
            .cookie-buttons {
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }
            
            .cookie-buttons .btn {
                width: 100%;
                max-width: 250px;
                padding: 12px 20px;
                font-size: 1rem;
            }
        }
        
        @media (max-width: 480px) {
            .cookie-modal-content {
                max-width: 320px;
                width: 98%;
                margin: 10px;
            }
            
            .cookie-modal .modal-header h3 {
                font-size: 1.2rem;
            }
            
            .cookie-modal .modal-body {
                padding: 15px;
            }
            
            .cookie-modal .modal-body p {
                font-size: 0.95rem;
                margin-bottom: 15px;
            }
            
            .cookie-buttons .btn {
                padding: 10px 15px;
                font-size: 0.95rem;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(cookieModal);
    
    // Показываем модальное окно с анимацией
    setTimeout(() => {
        cookieModal.classList.add('active');
        cookieModal.style.opacity = '1';
        cookieModal.style.display = 'flex';
    }, 100);
    
    // Дополнительная проверка для мобильных устройств
    setTimeout(() => {
        if (!cookieModal.classList.contains('active')) {
            cookieModal.classList.add('active');
            cookieModal.style.opacity = '1';
            cookieModal.style.display = 'flex';
        }
    }, 500);
    
    // Закрытие по клику вне модального окна
    cookieModal.addEventListener('click', function(e) {
        if (e.target === cookieModal) {
            // Не закрываем по клику вне окна для cookie модального окна
            // Пользователь должен сделать выбор
        }
    });
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    hideCookieBanner();
}

function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    hideCookieBanner();
}

function hideCookieBanner() {
    const cookieModal = document.getElementById('cookie-consent-modal');
    if (cookieModal) {
        cookieModal.classList.remove('active');
        cookieModal.style.opacity = '0';
        setTimeout(() => {
            cookieModal.remove();
        }, 300);
    }
}

// ===== КНОПКА "НАВЕРХ" =====
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.setAttribute('aria-label', 'Наверх');
    
    scrollBtn.addEventListener('click', scrollToTop);
    document.body.appendChild(scrollBtn);
    
    // Показываем/скрываем кнопку при скролле
    const handleScroll = throttle(function() {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== АНИМАЦИИ =====
function initAnimations() {
    // Анимация появления элементов при загрузке
    const animatedElements = document.querySelectorAll('.hero-content, .hero-image, .section-card');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ===== АККОРДЕОНЫ =====
function initAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        const content = accordion.querySelector('.accordion-content');
        
        if (header && content) {
            header.addEventListener('click', function() {
                const isActive = accordion.classList.contains('active');
                
                // Закрываем все другие аккордеоны
                accordions.forEach(otherAccordion => {
                    if (otherAccordion !== accordion) {
                        otherAccordion.classList.remove('active');
                        const otherContent = otherAccordion.querySelector('.accordion-content');
                        if (otherContent) {
                            otherContent.classList.remove('active');
                        }
                    }
                });
                
                // Переключаем текущий аккордеон
                if (isActive) {
                    accordion.classList.remove('active');
                    content.classList.remove('active');
                } else {
                    accordion.classList.add('active');
                    content.classList.add('active');
                }
            });
        }
    });
}

// ===== УТИЛИТЫ =====

// Дебаунс для оптимизации производительности
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Троттлинг для событий скролла
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== ОБРАБОТКА ОШИБОК =====
window.addEventListener('error', function(e) {
    console.error('Ошибка JavaScript:', e.error);
});

// ===== ЭКСПОРТ ФУНКЦИЙ ДЛЯ ГЛОБАЛЬНОГО ДОСТУПА =====
window.acceptCookies = acceptCookies;
window.declineCookies = declineCookies;
window.scrollToTop = scrollToTop;

// Функция для тестирования cookie баннера (для разработки)
window.testCookieConsent = function() {
    localStorage.removeItem('cookieConsent');
    showCookieConsent();
};

// Функция для принудительного показа куки на мобильных устройствах
window.forceShowCookies = function() {
    localStorage.removeItem('cookieConsent');
    setTimeout(() => {
        showCookieConsent();
    }, 100);
};

// ===== ДОПОЛНИТЕЛЬНЫЕ АНИМАЦИИ =====
// CSS анимации определены в CSS файлах

// ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ =====
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем класс для анимаций
    document.body.classList.add('loaded');
    
    // Инициализируем все компоненты
    console.log('Тайны Древнего Олимпа - сайт загружен');
});

// ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ =====

// Плавная прокрутка к элементам
function smoothScrollTo(element) {
    if (element) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Проверка поддержки современных функций
function checkModernFeatures() {
    const features = {
        intersectionObserver: 'IntersectionObserver' in window,
        smoothScroll: 'scrollBehavior' in document.documentElement.style,
        backdropFilter: 'backdrop-filter' in document.documentElement.style
    };
    
    console.log('Поддерживаемые функции:', features);
    return features;
}

// Инициализация проверки функций
document.addEventListener('DOMContentLoaded', checkModernFeatures);

// ===== ГОЛОВОЛОМКА ОРАКУЛА =====
function initOracleRiddle() {
    const riddleContent = document.getElementById('riddle-content');
    const riddleResult = document.getElementById('riddle-result');
    
    if (!riddleContent || !riddleResult) {
        console.log('Элементы головоломки не найдены');
        return;
    }
    
    // Данные для головоломки
    const riddleData = {
        questions: [
            {
                question: "Who is the king of all gods in Greek mythology?",
                options: ["Zeus", "Poseidon", "Hades", "Apollo"],
                correct: 0,
                explanation: "Zeus is the king of the gods and ruler of Mount Olympus."
            },
            {
                question: "Which goddess is known for wisdom and warfare?",
                options: ["Aphrodite", "Athena", "Hera", "Artemis"],
                correct: 1,
                explanation: "Athena is the goddess of wisdom, courage, and warfare."
            },
            {
                question: "Who is the god of the sea in Greek mythology?",
                options: ["Zeus", "Poseidon", "Hades", "Apollo"],
                correct: 1,
                explanation: "Poseidon is the god of the sea, earthquakes, and horses."
            },
            {
                question: "Which hero is known for his cunning and the Trojan Horse?",
                options: ["Achilles", "Hercules", "Odysseus", "Perseus"],
                correct: 2,
                explanation: "Odysseus is famous for his cunning and the Trojan Horse strategy."
            },
            {
                question: "Who is the god of the underworld in Greek mythology?",
                options: ["Zeus", "Poseidon", "Hades", "Apollo"],
                correct: 2,
                explanation: "Hades is the god of the underworld and the dead."
            }
        ]
    };
    
    let currentQuestion = 0;
    let score = 0;
    let isAnswered = false;
    
    // Инициализация головоломки
    function initRiddle() {
        currentQuestion = 0;
        score = 0;
        isAnswered = false;
        showQuestion();
        updateProgress();
        riddleContent.style.display = 'block';
        riddleResult.style.display = 'none';
    }
    
    // Показать текущий вопрос
    function showQuestion() {
        const questionData = riddleData.questions[currentQuestion];
        const questionElement = document.getElementById('riddle-question');
        const optionsElement = document.getElementById('riddle-options');
        const feedbackElement = document.getElementById('riddle-feedback');
        
        if (!questionElement || !optionsElement || !feedbackElement) return;
        
        // Обновляем вопрос
        questionElement.innerHTML = `
            <h3>Question ${currentQuestion + 1} of ${riddleData.questions.length}</h3>
            <p>${questionData.question}</p>
        `;
        
        // Обновляем варианты ответов
        optionsElement.innerHTML = '';
        questionData.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.setAttribute('data-answer', index);
            button.addEventListener('click', () => selectAnswer(index));
            optionsElement.appendChild(button);
        });
        
        // Очищаем обратную связь
        feedbackElement.innerHTML = '';
        feedbackElement.className = 'riddle-feedback';
    }
    
    // Обработка выбора ответа
    function selectAnswer(selectedIndex) {
        if (isAnswered) return;
        
        isAnswered = true;
        const questionData = riddleData.questions[currentQuestion];
        const buttons = document.querySelectorAll('.option-btn');
        const feedbackElement = document.getElementById('riddle-feedback');
        
        // Отключаем все кнопки
        buttons.forEach(btn => {
            btn.classList.add('disabled');
            btn.removeEventListener('click', selectAnswer);
        });
        
        // Подсвечиваем правильный и неправильный ответы
        buttons.forEach((btn, index) => {
            if (index === questionData.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && index !== questionData.correct) {
                btn.classList.add('incorrect');
            }
        });
        
        // Показываем обратную связь
        if (selectedIndex === questionData.correct) {
            score++;
            feedbackElement.innerHTML = `
                <div class="feedback-correct">
                    ✓ Correct! ${questionData.explanation}
                </div>
            `;
        } else {
            feedbackElement.innerHTML = `
                <div class="feedback-incorrect">
                    ✗ Incorrect. The correct answer is: ${questionData.options[questionData.correct]}
                </div>
                <div class="feedback-correct" style="margin-top: 10px;">
                    ${questionData.explanation}
                </div>
            `;
        }
        
        // Обновляем прогресс
        updateProgress();
        
        // Переходим к следующему вопросу или показываем результат
        setTimeout(() => {
            if (currentQuestion < riddleData.questions.length - 1) {
                currentQuestion++;
                isAnswered = false;
                showQuestion();
            } else {
                showResult();
            }
        }, 2000);
    }
    
    // Обновление прогресса
    function updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill && progressText) {
            const progress = ((currentQuestion + (isAnswered ? 1 : 0)) / riddleData.questions.length) * 100;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${currentQuestion + (isAnswered ? 1 : 0)}/${riddleData.questions.length}`;
        }
    }
    
    // Показать результат
    function showResult() {
        riddleContent.style.display = 'none';
        riddleResult.style.display = 'block';
        
        const resultIcon = document.getElementById('result-icon');
        const resultTitle = document.getElementById('result-title');
        const resultMessage = document.getElementById('result-message');
        const resultScore = document.getElementById('result-score');
        
        if (score === riddleData.questions.length) {
            resultTitle.textContent = 'Perfect!';
            resultMessage.textContent = 'You have proven yourself worthy of the Oracle\'s wisdom! All answers were correct!';
        } else if (score >= riddleData.questions.length * 0.8) {
            resultTitle.textContent = 'Excellent!';
            resultMessage.textContent = 'You have shown great knowledge of ancient Greek mythology!';
        } else if (score >= riddleData.questions.length * 0.6) {
            resultTitle.textContent = 'Good Job!';
            resultMessage.textContent = 'You have a solid understanding of Greek mythology!';
        } else {
            resultTitle.textContent = 'Keep Learning!';
            resultMessage.textContent = 'Study more about Greek mythology to improve your knowledge!';
        }
        
        resultScore.textContent = `Score: ${score}/${riddleData.questions.length}`;
    }
    
    // Обработчик кнопки "Try Again"
    const restartBtn = document.getElementById('restart-riddle');
    if (restartBtn) {
        restartBtn.addEventListener('click', initRiddle);
    }
    
    // Инициализируем головоломку
    initRiddle();
    
    console.log('Головоломка Оракула инициализирована');
}
