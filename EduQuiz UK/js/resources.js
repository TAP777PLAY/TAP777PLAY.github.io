/* ========================================
   Resources Page JavaScript - Specific Functions
   ======================================== */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollReveal();
    initializeTopicsAccordion();
    initializeNewsletterForm();
    initializeParallaxEffects();
    initializeArticleCards();
});

// Scroll Reveal Animation
function initializeScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, observerOptions);

    // Observe article cards for animation
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

// Topics Accordion
function initializeTopicsAccordion() {
    const topicItems = document.querySelectorAll('.topic-item');
    
    topicItems.forEach(item => {
        const header = item.querySelector('.topic-header');
        
        header.addEventListener('click', function() {
            // Close all other topic items
            topicItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Newsletter Form Validation and Submission
function initializeNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const submitBtn = document.querySelector('.subscription-btn');
    const successMessage = document.getElementById('subscriptionSuccess');
    
    // Email validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show error message
    function showError(input, errorElement, message) {
        input.style.borderColor = '#ff6b6b';
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    // Hide error message
    function hideError(input, errorElement) {
        input.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    // Real-time email validation
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        
        if (email === '') {
            hideError(emailInput, emailError);
        } else if (!validateEmail(email)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
        } else {
            hideError(emailInput, emailError);
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const interests = document.getElementById('interests').value;
        
        // Validate email
        if (!email) {
            showError(emailInput, emailError, 'Email address is required');
            return;
        }
        
        if (!validateEmail(email)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            return;
        }
        
        // Hide any existing errors
        hideError(emailInput, emailError);
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Hide loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Show success message
            successMessage.style.display = 'flex';
            form.style.display = 'none';
            
            // Reset form after 3 seconds
            setTimeout(() => {
                form.reset();
                successMessage.style.display = 'none';
                form.style.display = 'block';
            }, 3000);
            
            // In a real application, you would send the data to your server
            console.log('Newsletter subscription:', { email, interests });
        }, 2000);
    });
}

// Article Cards Interactions
function initializeArticleCards() {
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Article links removed - no click handlers needed
    });
}

// Parallax Effects
function initializeParallaxEffects() {
    const decorations = document.querySelectorAll('.decoration');
    
    if (decorations.length === 0) return;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        decorations.forEach((decoration, index) => {
            const speed = 0.2 + (index * 0.1);
            decoration.style.transform = `translateY(${rate * speed}px)`;
        });
    }
    
    // Throttled scroll handler
    const throttledParallax = throttle(updateParallax, 16);
    window.addEventListener('scroll', throttledParallax);
}

// Enhanced Button Interactions
function initializeButtonEffects() {
    const buttons = document.querySelectorAll('.btn, .topic-header, .article-link');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Initialize button effects
document.addEventListener('DOMContentLoaded', initializeButtonEffects);

// Loading Animation
function initializeLoadingAnimation() {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Remove loading class when page is fully loaded
    window.addEventListener('load', function() {
        document.body.classList.remove('loading');
        
        // Trigger hero animations
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-stats');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in-up');
            }, index * 200);
        });
    });
}

// Initialize loading animation
initializeLoadingAnimation();

// Add CSS for scroll animations and loading states
const style = document.createElement('style');
style.textContent = `
    .loading {
        overflow: hidden;
    }
    
    .loading .hero-title,
    .loading .hero-subtitle,
    .loading .hero-stats {
        opacity: 0;
        transform: translateY(30px);
    }
    
    .fade-in-up {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: all 0.6s ease;
    }
    
    .article-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .article-card:hover {
        transform: translateY(-8px);
    }
    
    .topic-item {
        transition: all 0.3s ease;
    }
    
    .topic-item:hover {
        transform: translateY(-2px);
    }
    
    .topic-header {
        transition: all 0.3s ease;
    }
    
    .topic-header:hover {
        transform: translateY(-2px);
    }
    
    .article-link {
        transition: color 0.3s ease;
    }
    
    .article-link:hover {
        color: var(--color-accent);
    }
    
    /* Form animations */
    .form-input,
    .form-select {
        transition: all 0.3s ease;
    }
    
    .form-input:focus,
    .form-select:focus {
        transform: translateY(-1px);
    }
    
    .subscription-btn {
        transition: all 0.3s ease;
    }
    
    .subscription-btn:hover {
        transform: translateY(-2px);
    }
    
    .subscription-btn:active {
        transform: translateY(0);
    }
    
    /* Success message animation */
    .form-success {
        animation: slideInUp 0.5s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Utility function for throttling
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

// Smooth scrolling for internal links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize smooth scrolling
document.addEventListener('DOMContentLoaded', initializeSmoothScrolling);

// Newsletter subscription analytics (placeholder)
function trackNewsletterSubscription(email, interests) {
    // In a real application, you would send this data to your analytics service
    console.log('Newsletter subscription tracked:', {
        email: email,
        interests: interests,
        timestamp: new Date().toISOString(),
        source: 'resources-page'
    });
}

// Enhanced form validation with better UX
function enhanceFormValidation() {
    const emailInput = document.getElementById('email');
    const interestsSelect = document.getElementById('interests');
    
    // Add visual feedback for form fields
    [emailInput, interestsSelect].forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--color-accent)';
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                this.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });
    });
}

// Initialize enhanced form validation
document.addEventListener('DOMContentLoaded', enhanceFormValidation);
