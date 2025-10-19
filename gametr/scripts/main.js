// Main JavaScript for Chronicles of Olympus

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initNavigation();
    initPopups();
    initCookies();
    initScrollAnimations();
    initAccordion();
    initSocialLinks();
    
    // Инициализируем видимость крестика закрытия
    initPopupCloseButton();
});

// Инициализация крестика закрытия
function initPopupCloseButton() {
    const popupClose = document.querySelector('.popup-close');
    if (popupClose) {
        if (window.innerWidth <= 768) {
            popupClose.style.display = 'flex';
        } else {
            popupClose.style.display = 'none';
        }
    }
}

// Header functionality
function initHeader() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
    });
}

// Navigation functionality
function initNavigation() {
    const burgerMenu = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav');
    
    if (burgerMenu && nav) {
        burgerMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !burgerMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Close menu on window resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && nav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav');
    
    if (nav.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

// Open mobile menu
function openMobileMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav');
    
    nav.classList.add('active');
    burgerMenu.classList.add('active');
    document.body.classList.add('nav-open');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close mobile menu
function closeMobileMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav');
    
    nav.classList.remove('active');
    burgerMenu.classList.remove('active');
    document.body.classList.remove('nav-open');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Popup functionality
function initPopups() {
    // Social media popup
    const socialLinks = document.querySelectorAll('.social-link');
    const socialPopup = document.getElementById('socialPopup');
    const popupClose = document.querySelector('.popup-close');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showPopup(socialPopup);
        });
    });
    
    if (popupClose) {
        popupClose.addEventListener('click', () => {
            // Проверяем, что это мобильное устройство
            if (window.innerWidth <= 768) {
                hidePopup(socialPopup);
            }
        });
    }
    
    // Close popup when clicking outside
    if (socialPopup) {
        socialPopup.addEventListener('click', (e) => {
            if (e.target === socialPopup) {
                hidePopup(socialPopup);
            }
        });
    }
    
    // Close popup on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && socialPopup && socialPopup.classList.contains('active')) {
            hidePopup(socialPopup);
        }
    });
    
    // Показываем/скрываем крестик при изменении размера окна
    window.addEventListener('resize', () => {
        const popupClose = document.querySelector('.popup-close');
        if (popupClose) {
            if (window.innerWidth <= 768) {
                popupClose.style.display = 'flex';
            } else {
                popupClose.style.display = 'none';
            }
        }
    });
}

// Cookie functionality
function initCookies() {
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');
    
    // Check if cookies were already accepted
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    if (!cookiesAccepted) {
        // Show popup after a short delay for better UX
        setTimeout(() => {
            showCookiePopup();
        }, 1500);
    }
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            acceptCookies();
        });
    }
    
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            declineCookies();
        });
    }
}

// Show cookie popup
function showCookiePopup() {
    const cookiePopup = document.getElementById('cookiePopup');
    if (cookiePopup) {
        showPopup(cookiePopup);
        
        // Add animation class for smooth appearance
        setTimeout(() => {
            cookiePopup.classList.add('animate-in');
        }, 100);
    }
}

// Accept cookies
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.setItem('cookiesAcceptedDate', new Date().toISOString());
    
    // Enable analytics and other tracking
    enableAnalytics();
    
    hideCookiePopup();
    
    // Show success message briefly
    showCookieSuccessMessage('Çerezler kabul edildi');
}

// Decline cookies
function declineCookies() {
    localStorage.setItem('cookiesAccepted', 'false');
    localStorage.setItem('cookiesAcceptedDate', new Date().toISOString());
    
    // Disable analytics and tracking
    disableAnalytics();
    
    hideCookiePopup();
    
    // Show info message
    showCookieSuccessMessage('Çerezler reddedildi');
}

// Hide cookie popup
function hideCookiePopup() {
    const cookiePopup = document.getElementById('cookiePopup');
    if (cookiePopup) {
        cookiePopup.classList.add('animate-out');
        
        setTimeout(() => {
            hidePopup(cookiePopup);
            cookiePopup.classList.remove('animate-in', 'animate-out');
        }, 300);
    }
}

// Enable analytics
function enableAnalytics() {
    // Enable Google Analytics or other tracking
    console.log('Analytics enabled');
    
    // You can add Google Analytics or other tracking code here
    // gtag('consent', 'update', {
    //     'analytics_storage': 'granted'
    // });
}

// Disable analytics
function disableAnalytics() {
    // Disable Google Analytics or other tracking
    console.log('Analytics disabled');
    
    // You can add code to disable tracking here
    // gtag('consent', 'update', {
    //     'analytics_storage': 'denied'
    // });
}

// Show cookie success message
function showCookieSuccessMessage(message) {
    // Create temporary success message
    const successMessage = document.createElement('div');
    successMessage.className = 'cookie-success-message';
    successMessage.textContent = message;
    successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-accent);
        color: var(--color-background);
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 3000;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(successMessage);
    
    // Animate in
    setTimeout(() => {
        successMessage.style.opacity = '1';
        successMessage.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateX(100px)';
        
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 300);
    }, 3000);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Accordion functionality
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        if (header && content) {
            header.addEventListener('click', (e) => {
                e.preventDefault();
                const isActive = item.classList.contains('active');
                
                // Close all other accordion items
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherContent = otherItem.querySelector('.accordion-content');
                        if (otherContent) {
                            otherContent.style.maxHeight = '0';
                        }
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    content.style.maxHeight = '0';
                } else {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });
}

// Social links functionality
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const socialType = link.getAttribute('data-social');
            let searchQuery = '';
            
            switch(socialType) {
                case 'instagram':
                    searchQuery = 'Chronicles of Olympus OR #ChroniclesOlympus2025';
                    break;
                case 'youtube':
                    searchQuery = 'Chronicles of Olympus';
                    break;
                case 'twitter':
                    searchQuery = 'Chronicles of Olympus OR #ChroniclesOlympus2025';
                    break;
            }
            
            // Show popup with search instructions
            showSocialPopup(searchQuery);
        });
    });
}

// Utility functions
let savedScrollPosition = 0;

function showPopup(popup) {
    if (popup) {
        // Сохраняем текущую позицию прокрутки
        savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        popup.style.display = 'flex';
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Убеждаемся, что всплывающее окно центрируется
        popup.style.alignItems = 'center';
        popup.style.justifyContent = 'center';
        
        // Прокручиваем к всплывающему окну
        setTimeout(() => {
            popup.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'center'
            });
        }, 100);
    }
}

function hidePopup(popup) {
    if (popup) {
        popup.classList.remove('active');
        setTimeout(() => {
            popup.style.display = 'none';
            // Восстанавливаем позицию прокрутки
            window.scrollTo(0, savedScrollPosition);
        }, 300);
        document.body.style.overflow = '';
    }
}

function showSocialPopup(searchQuery) {
    const popup = document.getElementById('socialPopup');
    const popupContent = popup.querySelector('p');
    
    if (popupContent) {
        // Обновляем сообщение в зависимости от социальной сети
        let message = '';
        switch(searchQuery) {
            case 'Chronicles of Olympus OR #ChroniclesOlympus2025':
                message = `Sosyal medyada bizi bulmak için:<br>
                          <strong>Chronicles of Olympus</strong> adını arayın veya<br>
                          <strong>#ChroniclesOlympus2025</strong> etiketini kullanın`;
                break;
            case 'Chronicles of Olympus':
                message = `YouTube'da bizi bulmak için:<br>
                          <strong>Chronicles of Olympus</strong> kanal adını arayın`;
                break;
            default:
                message = `<strong>Chronicles of Olympus</strong> adıyla veya <strong>#ChroniclesOlympus2025</strong> etiketiyle bizi bulun`;
        }
        
        popupContent.innerHTML = message;
    }
    
    showPopup(popup);
}

// Smooth scrolling for anchor links
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

// Form validation helper
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

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Debounce function for performance
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

// Throttle function for scroll events
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

// Reset cookie consent (for testing purposes)
function resetCookieConsent() {
    localStorage.removeItem('cookiesAccepted');
    localStorage.removeItem('cookiesAcceptedDate');
    console.log('Cookie consent reset. Refresh the page to see the popup again.');
}

// Check cookie consent status
function getCookieConsentStatus() {
    const accepted = localStorage.getItem('cookiesAccepted');
    const date = localStorage.getItem('cookiesAcceptedDate');
    
    return {
        accepted: accepted === 'true',
        declined: accepted === 'false',
        date: date ? new Date(date) : null,
        hasConsent: accepted !== null
    };
}

// Export functions for use in other scripts
window.ChroniclesOfOlympus = {
    showPopup,
    hidePopup,
    validateForm,
    isValidEmail,
    isValidPhone,
    debounce,
    throttle,
    resetCookieConsent,
    getCookieConsentStatus
};
