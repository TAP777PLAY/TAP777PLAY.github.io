/* ===== MAIN JAVASCRIPT FILE ===== */

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeForms();
    initializeInteractiveElements();
});

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Active link highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header background on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Parallax effect for hero background
    const heroBackground = document.querySelector('.hero-bg-image');
    if (heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.advantage-card, .park-card, .review-card, .feature-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Counter animation for statistics
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// ===== COUNTER ANIMATION =====
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        const suffix = element.textContent.replace(/\d/g, '').replace(/[^\D]/g, '');
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// ===== FORM FUNCTIONALITY =====
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

// ===== FORM SUBMISSION =====
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
    }, 2000);
}

// ===== FIELD VALIDATION =====
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const isRequired = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (isRequired && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Show/hide error
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }

    return isValid;
}

// ===== FIELD ERROR HANDLING =====
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.classList.add('error');
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// ===== INTERACTIVE ELEMENTS =====
function initializeInteractiveElements() {
    // Park card interactions
    const parkCards = document.querySelectorAll('.park-card');
    parkCards.forEach(card => {
        const addToRouteBtn = card.querySelector('.add-to-route');
        if (addToRouteBtn) {
            addToRouteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                addToRoute(card);
            });
        }
    });

    // Like button functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleLike(this);
        });
    });

    // Share button functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            openShareMenu(this);
        });
    });

    // Bookmark functionality
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    bookmarkButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleBookmark(this);
        });
    });
}

// ===== ROUTE FUNCTIONALITY =====
function addToRoute(card) {
    const parkName = card.querySelector('.park-title').textContent;
    const parkLocation = card.querySelector('.park-location').textContent;
    const parkPrice = card.querySelector('.detail-item:last-child span').textContent;
    
    // Create route item
    const routeItem = {
        name: parkName,
        location: parkLocation,
        price: parkPrice,
        id: Date.now()
    };

    // Get existing route from localStorage
    let route = JSON.parse(localStorage.getItem('safariRoute') || '[]');
    
    // Check if already in route
    const existingItem = route.find(item => item.name === parkName);
    if (existingItem) {
        showNotification('This park is already in your route!', 'warning');
        return;
    }

    // Add to route
    route.push(routeItem);
    localStorage.setItem('safariRoute', JSON.stringify(route));

    // Update UI
    updateRouteCounter();
    showNotification(`${parkName} added to your route!`, 'success');
    
    // Update button state
    const addBtn = card.querySelector('.add-to-route');
    addBtn.textContent = 'Added to Route';
    addBtn.classList.add('added');
    addBtn.disabled = true;
}

// ===== ROUTE COUNTER =====
function updateRouteCounter() {
    const route = JSON.parse(localStorage.getItem('safariRoute') || '[]');
    const counter = document.getElementById('routeCount');
    if (counter) {
        counter.textContent = route.length;
    }
}

// ===== LIKE FUNCTIONALITY =====
function toggleLike(button) {
    const isLiked = button.classList.contains('liked');
    const countElement = button.querySelector('.btn-count');
    let count = parseInt(countElement.textContent) || 0;

    if (isLiked) {
        button.classList.remove('liked');
        count--;
        showNotification('Removed from likes', 'info');
    } else {
        button.classList.add('liked');
        count++;
        showNotification('Added to likes!', 'success');
    }

    countElement.textContent = count;
}

// ===== SHARE FUNCTIONALITY =====
function openShareMenu(button) {
    const url = window.location.href;
    const title = document.title;
    const text = 'Check out this amazing safari breakfast experience!';

    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        });
    }
}

// ===== BOOKMARK FUNCTIONALITY =====
function toggleBookmark(button) {
    const isBookmarked = button.classList.contains('bookmarked');
    
    if (isBookmarked) {
        button.classList.remove('bookmarked');
        showNotification('Removed from bookmarks', 'info');
    } else {
        button.classList.add('bookmarked');
        showNotification('Added to bookmarks!', 'success');
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
}

// ===== UTILITY FUNCTIONS =====
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

// ===== LAZY LOADING =====
function initializeLazyLoading() {
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

// ===== PERFORMANCE OPTIMIZATION =====
// Throttled scroll handler
const throttledScrollHandler = throttle(function() {
    // Scroll-based animations and effects
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.header');
    
    if (scrolled > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, 16);

window.addEventListener('scroll', throttledScrollHandler);

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

// ===== ADDITIONAL FEATURES =====
function initializeAdditionalFeatures() {
    // Initialize lazy loading
    initializeLazyLoading();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize back to top button
    initializeBackToTop();
    
    // Initialize theme toggle
    initializeThemeToggle();
    
    // Initialize performance monitoring
    initializePerformanceMonitoring();
    
    // Initialize error handling
    initializeErrorHandling();
}

// ===== TOOLTIP SYSTEM =====
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            showTooltip(this);
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function showTooltip(element) {
    const text = element.dataset.tooltip;
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    // Show tooltip
    setTimeout(() => {
        tooltip.classList.add('show');
    }, 100);
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== THEME TOGGLE =====
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            showNotification(`Switched to ${newTheme} theme`, 'success');
        });
    }
}

// ===== PERFORMANCE MONITORING =====
function initializePerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Track Core Web Vitals
        if ('web-vital' in window) {
            console.log('Core Web Vitals monitoring initialized');
        }
    });
}

// ===== ERROR HANDLING =====
function initializeErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        
        // Send error to analytics (in real app)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: e.error.message,
                fatal: false
            });
        }
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        
        // Send error to analytics (in real app)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: e.reason,
                fatal: false
            });
        }
    });
}

// ===== ANALYTICS =====
function trackEvent(category, action, label, value) {
    // Google Analytics tracking (in real app)
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// ===== INITIALIZE ALL FEATURES =====
document.addEventListener('DOMContentLoaded', function() {
    updateRouteCounter();
    initializeAdditionalFeatures();
    
    // Listen for route updates
    document.addEventListener('routeUpdated', updateRouteCounter);
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToRoute,
        toggleLike,
        showNotification,
        debounce,
        throttle,
        trackEvent
    };
}
