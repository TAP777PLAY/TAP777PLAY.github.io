// Services Page Interactive Elements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Before/After Sliders
    initializeBeforeAfterSliders();
    
    // Initialize FAQ Accordions
    initializeFAQ();
    
    // Initialize Contact Form
    initializeContactForm();
    
    // Initialize Animations
    initializeAnimations();
});

// Before/After Slider Functionality
function initializeBeforeAfterSliders() {
    const sliders = document.querySelectorAll('.before-after-slider');
    
    sliders.forEach(slider => {
        const handle = slider.querySelector('.slider-handle');
        const afterImg = slider.querySelector('.after-img');
        const sliderContainer = slider.querySelector('.before-after-image');
        
        let isDragging = false;
        let startX = 0;
        let currentX = 0;
        
        // Mouse events
        handle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        
        // Touch events for mobile
        handle.addEventListener('touchstart', startDrag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', endDrag);
        
        // Click to move
        sliderContainer.addEventListener('click', (e) => {
            if (!isDragging) {
                const rect = sliderContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = (x / rect.width) * 100;
                updateSlider(percentage);
            }
        });
        
        function startDrag(e) {
            isDragging = true;
            startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            slider.style.cursor = 'grabbing';
            handle.style.cursor = 'grabbing';
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            const rect = sliderContainer.getBoundingClientRect();
            const x = currentX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            updateSlider(percentage);
        }
        
        function endDrag() {
            isDragging = false;
            slider.style.cursor = 'grab';
            handle.style.cursor = 'grab';
        }
        
        function updateSlider(percentage) {
            afterImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            handle.style.left = `${percentage}%`;
        }
    });
}

// FAQ Accordion Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Contact Form Functionality
function initializeContactForm() {
    const contactForm = document.getElementById('quickContactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!data.contactName || !data.contactPhone || !data.contactMessage) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Validate phone number (basic validation)
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(data.contactPhone)) {
                showNotification('Please enter a valid phone number', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Message sent successfully! We will contact you soon.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

// Field Validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    clearFieldError(field);
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (fieldName === 'contactPhone' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.style.borderColor = '#FF6B6B';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #FF6B6B;
        font-size: 12px;
        margin-top: 4px;
        font-family: 'Poppins', sans-serif;
    `;
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Animation Initialization
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe elements for fade-in animation
    const animatedElements = document.querySelectorAll(
        '.service-card, .program-card, .infographic-item, .video-testimonial, .faq-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-in-out';
        fadeObserver.observe(el);
    });
    
    // Counter animation for infographics
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.infographic-number').forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Counter Animation
function animateCounter(element) {
    const text = element.textContent;
    const number = parseFloat(text.replace(/[^\d.]/g, ''));
    const suffix = text.replace(/[\d.]/g, '');
    
    if (isNaN(number)) return;
    
    let start = 0;
    const increment = number / 60; // 60 frames for 1 second animation
    const duration = 1000; // 1 second
    
    function updateCounter() {
        start += increment;
        if (start < number) {
            element.textContent = Math.floor(start) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = text;
        }
    }
    
    updateCounter();
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00C9FF' : type === 'error' ? '#FF6B6B' : '#7B2FF7'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add animation styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Service Card Interactions
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Program Card Interactions
document.addEventListener('DOMContentLoaded', function() {
    const programCards = document.querySelectorAll('.program-card');
    
    programCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

// Video Testimonial Interactions
document.addEventListener('DOMContentLoaded', function() {
    const videoTestimonials = document.querySelectorAll('.video-testimonial');
    
    videoTestimonials.forEach(testimonial => {
        testimonial.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(123, 47, 247, 0.3)';
        });
        
        testimonial.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
});

// Smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', function() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Enhanced FAQ interactions
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        // Add keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
        
        // Make focusable
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        
        // Update aria-expanded when toggled
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            this.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });
    });
});

// Performance optimization: Throttle scroll events
let ticking = false;

function updateOnScroll() {
    // Add any scroll-based animations here
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);
