// Global Finance Insight - Interactive Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initCookieModal();
    initMobileMenu();
    initScrollAnimations();
    initFAQAccordion();
    initAccordion();
    initSmoothScrolling();
    initHeaderScroll();
    initFooterModals();
    initActiveNavigation();
});

// Cookie Modal Functionality
function initCookieModal() {
    const cookieModal = document.getElementById('cookieModal');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');
    
    // Check if cookies were already accepted
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieModal.classList.add('show');
        }, 1000);
    }
    
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieModal.classList.remove('show');
        // Here you can add analytics tracking code
        console.log('Cookies accepted - Analytics enabled');
    });
    
    declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'false');
        cookieModal.classList.remove('show');
        console.log('Cookies declined - Analytics disabled');
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // Add smooth transitions for mobile menu items
    navLinks.forEach((link, index) => {
        link.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Handle section transitions
                if (entry.target.classList.contains('section-transition')) {
                    entry.target.classList.add('visible');
                    
                    // Animate section content with staggered delay
                    const sectionContent = entry.target.querySelectorAll('.section-content');
                    sectionContent.forEach((content, index) => {
                        setTimeout(() => {
                            content.classList.add('animate');
                        }, index * 200);
                    });
                } else {
                    // Handle individual elements
                    entry.target.classList.add('animate');
                    
                    // Add staggered animation for cards
                    if (entry.target.classList.contains('analysis-card') || 
                        entry.target.classList.contains('expert-card')) {
                        const cards = entry.target.parentElement.querySelectorAll('.analysis-card, .expert-card');
                        cards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('animate');
                            }, index * 200);
                        });
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.mission-text, .mission-image, .analysis-card, .expert-card, .section-transition');
    animatedElements.forEach(el => observer.observe(el));
}

// FAQ Accordion Functionality
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    // Show header on page load
    setTimeout(() => {
        header.classList.add('visible');
    }, 100);
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class for styling
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll with smooth animation
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Add intersection observer for header visibility
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                header.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    // Observe a small element at the top of the page
    const topElement = document.createElement('div');
    topElement.style.height = '1px';
    topElement.style.position = 'absolute';
    topElement.style.top = '0';
    topElement.style.left = '0';
    topElement.style.width = '100%';
    document.body.appendChild(topElement);
    headerObserver.observe(topElement);
}

// Utility Functions
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

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Form Validation (for future contact forms)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Search Functionality (for future implementation)
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput) {
        const debouncedSearch = debounce((query) => {
            if (query.length > 2) {
                // Implement search logic here
                console.log('Searching for:', query);
            }
        }, 300);
        
        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }
}

// Analytics Tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        // Implement analytics tracking here
        console.log('Event tracked:', eventName, eventData);
    }
}

// Performance Monitoring
function initPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Track Core Web Vitals
        if ('web-vital' in window) {
            // Implement Core Web Vitals tracking
        }
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Send error to monitoring service
});

// Unhandled Promise Rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Send error to monitoring service
});

// Accessibility Enhancements
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--accent);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark
    const main = document.querySelector('main');
    if (main) {
        main.id = 'main';
    }
}

// Initialize accessibility features
initAccessibility();

// Active Navigation Detection
function initActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Keyboard Navigation for FAQ
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const activeElement = document.activeElement;
        if (activeElement.classList.contains('faq-question')) {
            e.preventDefault();
            activeElement.click();
        }
    }
});

// Print Styles Enhancement
window.addEventListener('beforeprint', () => {
    // Expand all FAQ items for printing
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.classList.add('active');
    });
});

// Service Worker Registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Footer Modals Functionality
function initFooterModals() {
    initSocialModal();
    initPolicyModals();
}

// Social Media Modal
function initSocialModal() {
    const socialModal = document.getElementById('socialModal');
    const socialLinks = document.querySelectorAll('.social-link[data-social]');
    
    if (!socialModal) {
        return; // Exit if modal doesn't exist
    }
    
    const closeBtn = socialModal.querySelector('.close');

    // Open social modal when clicking social links
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const socialPlatform = link.getAttribute('data-social');
            openSocialModal(socialPlatform);
        });
    });

    // Close modal when clicking close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeModal(socialModal);
        });
    }

    // Close modal when clicking outside
    socialModal.addEventListener('click', (e) => {
        if (e.target === socialModal) {
            closeModal(socialModal);
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && socialModal.classList.contains('show')) {
            closeModal(socialModal);
        }
    });
}

function openSocialModal(platform) {
    const socialModal = document.getElementById('socialModal');
    
    if (!socialModal) {
        return;
    }
    
    // Just show the modal with social media info
    socialModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Track event
    trackEvent('social_modal_opened', { platform: platform });
}

function handleSocialSearch(query) {
    // Simulate search functionality
    console.log(`Searching for: ${query}`);
    
    // Here you would typically redirect to the actual social media platform
    // or show search results
    const socialPlatforms = {
        'linkedin': 'https://linkedin.com/search/results/all/?keywords=',
        'twitter': 'https://twitter.com/search?q=',
        'youtube': 'https://youtube.com/results?search_query='
    };
    
    // Find matching platform
    const platform = Object.keys(socialPlatforms).find(p => 
        query.toLowerCase().includes(p)
    );
    
    if (platform) {
        const searchUrl = socialPlatforms[platform] + encodeURIComponent(query);
        window.open(searchUrl, '_blank');
    } else {
        // Default to LinkedIn if no specific platform found
        const searchUrl = socialPlatforms.linkedin + encodeURIComponent(query);
        window.open(searchUrl, '_blank');
    }
    
    // Track search event
    trackEvent('social_search', { query: query, platform: platform || 'default' });
    
    // Close modal after search
    const socialModal = document.getElementById('socialModal');
    closeModal(socialModal);
}

// Policy Modals
function initPolicyModals() {
    const policyModal = document.getElementById('policyModal');
    const policyLinks = document.querySelectorAll('.legal-link[data-policy]');
    const closeBtn = policyModal.querySelector('.close');
    const policyContent = document.getElementById('policyContent');

    // Open policy modal when clicking policy links
    policyLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const policyType = link.getAttribute('data-policy');
            openPolicyModal(policyType);
        });
    });

    // Close modal when clicking close button
    closeBtn.addEventListener('click', () => {
        closeModal(policyModal);
    });

    // Close modal when clicking outside
    policyModal.addEventListener('click', (e) => {
        if (e.target === policyModal) {
            closeModal(policyModal);
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && policyModal.classList.contains('show')) {
            closeModal(policyModal);
        }
    });
}

function openPolicyModal(policyType) {
    const policyModal = document.getElementById('policyModal');
    const policyContent = document.getElementById('policyContent');
    
    // Load policy content
    const content = getPolicyContent(policyType);
    policyContent.innerHTML = content;
    
    policyModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Track event
    trackEvent('policy_modal_opened', { policy: policyType });
}

function getPolicyContent(policyType) {
    const policies = {
        'cookies': {
            title: 'Политика куков',
            content: `
                <h4>Что такое куки?</h4>
                <p>Куки — это небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении веб-сайта. Они помогают нам улучшить работу сайта и предоставлять персонализированный контент.</p>
                
                <h4>Как мы используем куки</h4>
                <ul>
                    <li>Функциональные куки — для обеспечения корректной работы сайта</li>
                    <li>Аналитические куки — для понимания того, как посетители используют наш сайт</li>
                    <li>Маркетинговые куки — для показа релевантной рекламы</li>
                </ul>
                
                <h4>Управление куками</h4>
                <p>Вы можете управлять настройками куков через настройки вашего браузера. Однако отключение некоторых куков может повлиять на функциональность сайта.</p>
                
                <h4>Сторонние сервисы</h4>
                <p>Мы можем использовать сторонние сервисы, такие как Google Analytics, которые также устанавливают свои куки. Эти сервисы имеют свои собственные политики конфиденциальности.</p>
                
                <p><strong>Последнее обновление:</strong> 1 января 2025 года</p>
            `
        },
        'terms': {
            title: 'Условия использования',
            content: `
                <h4>Принятие условий</h4>
                <p>Используя наш веб-сайт, вы соглашаетесь с данными условиями использования. Если вы не согласны с какими-либо условиями, пожалуйста, не используйте наш сайт.</p>
                
                <h4>Использование сайта</h4>
                <ul>
                    <li>Вы можете использовать сайт только в законных целях</li>
                    <li>Запрещается нарушать права интеллектуальной собственности</li>
                    <li>Нельзя использовать сайт для передачи вредоносного контента</li>
                    <li>Запрещается попытки взлома или нарушения безопасности</li>
                </ul>
                
                <h4>Интеллектуальная собственность</h4>
                <p>Весь контент на сайте, включая тексты, изображения, графики и программное обеспечение, защищен авторским правом и принадлежит Global Finance Insight или его лицензиарам.</p>
                
                <h4>Ограничение ответственности</h4>
                <p>Информация на сайте предоставляется "как есть". Мы не гарантируем точность, полноту или актуальность информации и не несем ответственности за любые убытки, возникшие в результате использования сайта.</p>
                
                <h4>Изменения условий</h4>
                <p>Мы оставляем за собой право изменять данные условия в любое время. Продолжение использования сайта после внесения изменений означает ваше согласие с новыми условиями.</p>
                
                <p><strong>Последнее обновление:</strong> 1 января 2025 года</p>
            `
        },
        'privacy': {
            title: 'Конфиденциальность',
            content: `
                <h4>Сбор информации</h4>
                <p>Мы собираем информацию, которую вы предоставляете добровольно, а также автоматически собираемую информацию при использовании нашего сайта.</p>
                
                <h4>Типы собираемой информации</h4>
                <ul>
                    <li>Персональная информация (имя, email, телефон)</li>
                    <li>Информация об использовании сайта</li>
                    <li>Техническая информация (IP-адрес, тип браузера)</li>
                    <li>Файлы куки и аналогичные технологии</li>
                </ul>
                
                <h4>Использование информации</h4>
                <p>Мы используем собранную информацию для:</p>
                <ul>
                    <li>Предоставления и улучшения наших услуг</li>
                    <li>Связи с вами по вопросам услуг</li>
                    <li>Анализа использования сайта</li>
                    <li>Соблюдения правовых обязательств</li>
                </ul>
                
                <h4>Защита информации</h4>
                <p>Мы применяем соответствующие технические и организационные меры для защиты вашей персональной информации от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>
                
                <h4>Передача информации третьим лицам</h4>
                <p>Мы не продаем, не обмениваем и не передаем вашу персональную информацию третьим лицам без вашего согласия, за исключением случаев, предусмотренных законом.</p>
                
                <h4>Ваши права</h4>
                <p>Вы имеете право на доступ, исправление, удаление ваших персональных данных, а также право на ограничение обработки и переносимость данных.</p>
                
                <p><strong>Последнее обновление:</strong> 1 января 2025 года</p>
            `
        }
    };
    
    const policy = policies[policyType];
    if (policy) {
        return `<h3>${policy.title}</h3>${policy.content}`;
    }
    
    return '<h3>Документ не найден</h3><p>Запрашиваемый документ временно недоступен.</p>';
}

function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// Enhanced Accordion Functionality
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other accordion items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
            
            // Track accordion interaction
            trackEvent('accordion_toggle', { 
                section: item.querySelector('.accordion-title').textContent,
                action: !isActive ? 'open' : 'close'
            });
        });
    });
}


// Enhanced Hover Effects
function initHoverEffects() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.analysis-card, .expert-card, .accordion-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple effect CSS
function addRippleCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize hover effects
initHoverEffects();
addRippleCSS();

// Enhanced scroll animations with parallax effect
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-image');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Initialize parallax effects
initParallaxEffects();

// Enhanced loading animations
function initLoadingAnimations() {
    // Add loading state to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                this.style.pointerEvents = 'none';
                
                // Simulate loading
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.style.pointerEvents = '';
                }, 2000);
            }
        });
    });
}

// Add loading animation CSS
function addLoadingCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .btn.loading {
            position: relative;
            color: transparent;
        }
        
        .btn.loading::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            top: 50%;
            left: 50%;
            margin-left: -10px;
            margin-top: -10px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize loading animations
initLoadingAnimations();
addLoadingCSS();

// Force initialize social modal on all pages
setTimeout(() => {
    if (document.getElementById('socialModal')) {
        initSocialModal();
    }
}, 100);

// Global function to open social modal
window.openSocialModal = function(platform) {
    const socialModal = document.getElementById('socialModal');
    if (socialModal) {
        socialModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
};

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initCookieModal,
        initMobileMenu,
        initScrollAnimations,
        initFAQAccordion,
        initAccordion,
        validateForm,
        trackEvent,
        initFooterModals,
        openSocialModal,
        openPolicyModal
    };
}
