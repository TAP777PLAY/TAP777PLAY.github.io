/* ========================================
   Contacts Page JavaScript - Specific Functions
   ======================================== */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFAQAccordion();
    initializeParallaxEffects();
    initializeScrollAnimations();
    initializeMapInteractions();
});

// Contact Form Validation and Submission
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.querySelector('.submit-btn');
    const successMessage = document.getElementById('formSuccess');
    
    // Error elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    
    // Validation functions
    function validateName(name) {
        return name.trim().length >= 2;
    }
    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validateMessage(message) {
        return message.trim().length >= 10;
    }
    
    // Show error message
    function showError(input, errorElement, message) {
        input.style.borderColor = '#ff6b6b';
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    // Hide error message
    function hideError(input, errorElement) {
        input.style.borderColor = 'var(--color-background)';
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    // Real-time validation
    nameInput.addEventListener('input', function() {
        const name = this.value.trim();
        
        if (name === '') {
            hideError(nameInput, nameError);
        } else if (!validateName(name)) {
            showError(nameInput, nameError, 'Name must be at least 2 characters long');
        } else {
            hideError(nameInput, nameError);
        }
    });
    
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
    
    messageInput.addEventListener('input', function() {
        const message = this.value.trim();
        
        if (message === '') {
            hideError(messageInput, messageError);
        } else if (!validateMessage(message)) {
            showError(messageInput, messageError, 'Message must be at least 10 characters long');
        } else {
            hideError(messageInput, messageError);
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = document.getElementById('subject').value;
        const message = messageInput.value.trim();
        const newsletter = document.getElementById('newsletter').checked;
        
        // Validate all fields
        let hasErrors = false;
        
        if (!validateName(name)) {
            showError(nameInput, nameError, 'Name is required and must be at least 2 characters long');
            hasErrors = true;
        }
        
        if (!validateEmail(email)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            hasErrors = true;
        }
        
        if (!validateMessage(message)) {
            showError(messageInput, messageError, 'Message is required and must be at least 10 characters long');
            hasErrors = true;
        }
        
        if (hasErrors) {
            return;
        }
        
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
            
            // Reset form after 5 seconds
            setTimeout(() => {
                form.reset();
                successMessage.style.display = 'none';
                form.style.display = 'block';
            }, 5000);
            
            // In a real application, you would send the data to your server
            console.log('Contact form submission:', {
                name,
                email,
                subject,
                message,
                newsletter,
                timestamp: new Date().toISOString()
            });
        }, 2000);
    });
}

// FAQ Accordion
function initializeFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        
        header.addEventListener('click', function() {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Map Interactions
function initializeMapInteractions() {
    const mapWrapper = document.querySelector('.map-wrapper');
    const mapMarker = document.querySelector('.map-marker');
    
    if (mapWrapper && mapMarker) {
        // Add click handler to map marker
        mapMarker.addEventListener('click', function() {
            // Open Google Maps in new tab
            window.open('https://maps.google.com/?q=123+High+Holborn,+London+WC1V+6EA', '_blank');
        });
        
        // Add hover effects
        mapMarker.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = 'var(--shadow-medium)';
        });
        
        mapMarker.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'var(--shadow-light)';
        });
    }
}

// Scroll Animations
function initializeScrollAnimations() {
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
    const animatedElements = document.querySelectorAll('.contact-item, .faq-item, .form-container');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
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
    const buttons = document.querySelectorAll('.btn, .contact-link, .faq-header');
    
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
    
    .contact-item,
    .faq-item,
    .form-container {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .contact-item.animate-in,
    .faq-item.animate-in,
    .form-container.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .contact-item {
        transition: transform 0.3s ease;
    }
    
    .contact-item:hover {
        transform: translateY(-2px);
    }
    
    .faq-item {
        transition: all 0.3s ease;
    }
    
    .faq-item:hover {
        transform: translateY(-2px);
    }
    
    .faq-header {
        transition: all 0.3s ease;
    }
    
    .faq-header:hover {
        transform: translateY(-2px);
    }
    
    .contact-link {
        transition: color 0.3s ease;
    }
    
    .contact-link:hover {
        color: var(--color-text-primary);
    }
    
    .map-marker {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .map-marker:hover {
        transform: scale(1.05);
    }
    
    /* Form animations */
    .form-input,
    .form-select,
    .form-textarea {
        transition: all 0.3s ease;
    }
    
    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
        transform: translateY(-1px);
    }
    
    .submit-btn {
        transition: all 0.3s ease;
    }
    
    .submit-btn:hover {
        transform: translateY(-2px);
    }
    
    .submit-btn:active {
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
    
    /* Spinner animation */
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
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

// Enhanced form validation with better UX
function enhanceFormValidation() {
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--color-accent)';
            this.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.style.borderColor = 'var(--color-background)';
                this.style.boxShadow = 'none';
            }
        });
    });
}

// Initialize enhanced form validation
document.addEventListener('DOMContentLoaded', enhanceFormValidation);

// Contact form analytics (placeholder)
function trackContactFormSubmission(formData) {
    // In a real application, you would send this data to your analytics service
    console.log('Contact form submission tracked:', {
        ...formData,
        timestamp: new Date().toISOString(),
        source: 'contacts-page',
        userAgent: navigator.userAgent
    });
}
