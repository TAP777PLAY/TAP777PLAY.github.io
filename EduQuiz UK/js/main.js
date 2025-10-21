/* ========================================
   Main JavaScript - Common Functions
   ======================================== */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeSmoothScrolling();
    initializeCookieConsent();
    initializeHeaderScroll();
    
    // First remove all active states, then set the correct one
    removeAllActiveStates();
    setActiveNavigationLink();
});

// Navigation Functions
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Remove all active states when opening mobile menu
            if (navMenu.classList.contains('active')) {
                removeAllActiveStates();
            }
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                
                // Update active state after a short delay to allow page navigation
                setTimeout(() => {
                    setActiveNavigationLink();
                }, 100);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu when scrolling on mobile
        window.addEventListener('scroll', function() {
            if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Scroll Animations
function initializeScrollAnimations() {
    // Check if device is mobile to reduce animation complexity
    const isMobile = window.innerWidth <= 768;
    
    const observerOptions = {
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.step-card, .testimonial-content, .quiz-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Reduce animation complexity on mobile
    if (isMobile) {
        // Disable complex animations on mobile
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .step-card,
                .testimonial-content,
                .quiz-card {
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                
                .step-card:hover,
                .quiz-card:hover {
                    transform: translateY(-2px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Cookie Consent Functions
function initializeCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');
    
    if (!cookieConsent || !acceptBtn || !declineBtn) {
        return;
    }

    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');
    
    if (cookieChoice === null) {
        // Show popup after a short delay
        setTimeout(() => {
            showCookieConsent();
        }, 1000);
    } else {
        // Hide popup if choice already made
        hideCookieConsent();
    }

    // Accept cookies
    acceptBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.setItem('cookieConsent', 'accepted');
        hideCookieConsent();
        console.log('Cookies accepted');
        
        // Optional: Initialize analytics or tracking here
        initializeAnalytics();
    });

    // Decline cookies
    declineBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.setItem('cookieConsent', 'declined');
        hideCookieConsent();
        console.log('Cookies declined');
    });

    // Handle keyboard navigation
    cookieConsent.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Don't allow closing with Escape for better UX
            e.preventDefault();
        }
    });

    // Prevent body scroll when popup is open
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (cookieConsent.classList.contains('show')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    observer.observe(cookieConsent, { attributes: true });
}

function showCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    if (cookieConsent) {
        cookieConsent.classList.add('show');
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

function hideCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    if (cookieConsent) {
        cookieConsent.classList.remove('show');
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// Utility function to check cookie consent status
function getCookieConsentStatus() {
    return localStorage.getItem('cookieConsent');
}

// Utility function to reset cookie consent (for testing)
function resetCookieConsent() {
    localStorage.removeItem('cookieConsent');
    location.reload();
}

// Analytics initialization (placeholder)
function initializeAnalytics() {
    const consent = getCookieConsentStatus();
    
    if (consent === 'accepted') {
        // Initialize analytics here
        console.log('Analytics initialized');
        
        // Example: Google Analytics
        // gtag('consent', 'update', {
        //     'analytics_storage': 'granted'
        // });
    } else {
        console.log('Analytics disabled due to cookie consent');
    }
}

// Check if cookies are accepted
function areCookiesAccepted() {
    return getCookieConsentStatus() === 'accepted';
}

// Show cookie consent popup programmatically (for testing)
function showCookieConsentPopup() {
    showCookieConsent();
}

// Header Scroll Animation
function initializeHeaderScroll() {
    const navbar = document.getElementById('navbar');
    
    if (!navbar) return;

    let lastScrollTop = 0;
    let ticking = false;

    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar based on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - hide navbar
            navbar.classList.add('hidden');
        } else {
            // Scrolling up - show navbar
            navbar.classList.remove('hidden');
        }

        lastScrollTop = scrollTop;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    // Throttled scroll event
    window.addEventListener('scroll', requestTick, { passive: true });


    // Show navbar on mouse move (optional)
    let mouseMoveTimeout;
    document.addEventListener('mousemove', function() {
        if (window.pageYOffset > 100) {
            navbar.classList.remove('hidden');
            clearTimeout(mouseMoveTimeout);
            
            mouseMoveTimeout = setTimeout(() => {
                if (window.pageYOffset > 100) {
                    navbar.classList.add('hidden');
                }
            }, 3000);
        }
    });
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
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

// Add CSS for scroll animations
const style = document.createElement('style');
style.textContent = `
    .step-card,
    .testimonial-content,
    .quiz-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .step-card.animate-in,
    .testimonial-content.animate-in,
    .quiz-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .step-card.animate-in:nth-child(1) { transition-delay: 0.1s; }
    .step-card.animate-in:nth-child(2) { transition-delay: 0.2s; }
    .step-card.animate-in:nth-child(3) { transition-delay: 0.3s; }
    
    .quiz-card.animate-in:nth-child(1) { transition-delay: 0.1s; }
    .quiz-card.animate-in:nth-child(2) { transition-delay: 0.2s; }
    .quiz-card.animate-in:nth-child(3) { transition-delay: 0.3s; }
`;
document.head.appendChild(style);


// Set Active Navigation Link
function setActiveNavigationLink() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Get the current page filename
    const currentPageName = currentPage.split('/').pop() || 'index.html';
    
    // Add active class to current page link
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // Check if this link matches the current page
        if (linkPath === currentPageName) {
            link.classList.add('active');
        } else if (currentPageName === '' && linkPath === 'index.html') {
            link.classList.add('active');
        } else if (currentPageName === 'index.html' && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });
}

// Force remove all active states (for mobile menu)
function removeAllActiveStates() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
}
