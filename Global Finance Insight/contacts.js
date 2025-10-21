// Contacts Page JavaScript - Google Maps and Form Functionality


document.addEventListener('DOMContentLoaded', function() {
    // Initialize all contacts page functionality
    initHeaderVisibility();
    initActiveNavigation();
    initScrollAnimations();
    initContactForm();
    initFormAnimations();
});




// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission
            await submitForm(form);
            
            // Show success message
            showFormMessage('success', 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.');
            
            // Reset form
            form.reset();
            
            // Track successful submission
            trackEvent('form_submitted', {
                form_type: 'contact',
                success: true
            });
            
        } catch (error) {
            // Show error message
            showFormMessage('error', 'Sorry, there was an error sending your message. Please try again or contact us directly.');
            
            // Track failed submission
            trackEvent('form_submitted', {
                form_type: 'contact',
                success: false,
                error: error.message
            });
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            clearFieldError(input);
        });
    });
}

// Form validation
function validateForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = `${getFieldLabel(fieldName)} is required.`;
        isValid = false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address.';
            isValid = false;
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            errorMessage = 'Please enter a valid phone number.';
            isValid = false;
        }
    }
    
    // Message length validation
    if (fieldName === 'message' && value && value.length < 10) {
        errorMessage = 'Message must be at least 10 characters long.';
        isValid = false;
    }
    
    // Show/hide error
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function getFieldLabel(fieldName) {
    const labels = {
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        company: 'Company',
        subject: 'Subject',
        message: 'Message',
        privacy: 'Privacy Policy'
    };
    return labels[fieldName] || fieldName;
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    field.style.borderColor = '#e74c3c';
}

function clearFieldError(field) {
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
    
    field.style.borderColor = '';
}

// Simulate form submission
async function submitForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate random success/failure for demo
    if (Math.random() < 0.9) { // 90% success rate
        console.log('Form submitted successfully:', data);
    } else {
        throw new Error('Simulated server error');
    }
}

// Show form message
function showFormMessage(type, message) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Insert before form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageElement, form);
    
    // Show message with animation
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 300);
    }, 5000);
}

// Form animations
function initFormAnimations() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Add focus animations
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
            // Add pulse animation to label
            const label = input.parentElement.querySelector('.form-label');
            if (label) {
                label.style.animation = 'pulse 0.6s ease';
            }
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Add typing animation
        input.addEventListener('input', () => {
            input.parentElement.classList.add('typing');
            setTimeout(() => {
                input.parentElement.classList.remove('typing');
            }, 1000);
        });
    });
    
    // Add hover effects to submit button
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.addEventListener('mouseenter', () => {
        if (!submitBtn.classList.contains('loading')) {
            submitBtn.style.transform = 'translateY(-3px) scale(1.02)';
            submitBtn.style.boxShadow = '0 8px 25px rgba(92, 123, 160, 0.4)';
        }
    });
    
    submitBtn.addEventListener('mouseleave', () => {
        if (!submitBtn.classList.contains('loading')) {
            submitBtn.style.transform = 'translateY(0) scale(1)';
            submitBtn.style.boxShadow = '0 4px 15px rgba(92, 123, 160, 0.3)';
        }
    });
    
    // Add ripple effect to submit button
    submitBtn.addEventListener('click', (e) => {
        if (!submitBtn.classList.contains('loading')) {
            createRippleEffect(e, submitBtn);
        }
    });
    
    // Add enhanced social button animations
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px) scale(1.1)';
            btn.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
            btn.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Add contact item animations
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px) scale(1.02)';
            item.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
            item.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
}

// Create ripple effect
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Special handling for FAQ items with staggered animation
                if (entry.target.classList.contains('faq-item')) {
                    const items = entry.target.parentElement.querySelectorAll('.faq-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, index * 150);
                    });
                }
                
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.office-description, .contact-details, .form-intro, .contact-form, .faq-item'
    );
    
    animatedElements.forEach(el => observer.observe(el));
}

// Enhanced tracking for contacts page
function trackEvent(eventName, properties = {}) {
    const analyticsData = {
        page: 'contacts',
        timestamp: new Date().toISOString(),
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        ...properties
    };
    
    console.log('Contacts Event:', eventName, analyticsData);
    
    // Store in localStorage for debugging
    const events = JSON.parse(localStorage.getItem('contacts_events') || '[]');
    events.push({ event: eventName, data: analyticsData });
    localStorage.setItem('contacts_events', JSON.stringify(events));
}

// Track form interactions
function initFormTracking() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            trackEvent('form_field_focused', {
                field_name: input.name,
                field_type: input.type
            });
        });
        
        input.addEventListener('blur', () => {
            trackEvent('form_field_blurred', {
                field_name: input.name,
                field_type: input.type,
                has_value: !!input.value
            });
        });
    });
    
    // Track social button clicks
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = btn.textContent.trim();
            
            trackEvent('social_button_clicked', {
                platform: platform
            });
            
            showNotification(`${platform} profile coming soon!`);
        });
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent);
        color: white;
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--radius-medium);
        box-shadow: var(--shadow-medium);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize form tracking
initFormTracking();

// Performance monitoring for contacts page
function initContactsPerformanceMonitoring() {
    // Monitor form load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        
        trackEvent('page_performance', {
            load_time: loadTime,
            form_ready: !!document.getElementById('contactForm')
        });
    });
    
    // Monitor map load time
    if (typeof google !== 'undefined' && google.maps) {
        const mapLoadTime = performance.now();
        
        trackEvent('map_performance', {
            load_time: mapLoadTime
        });
    }
}

// Initialize performance monitoring
initContactsPerformanceMonitoring();

// Header visibility initialization
function initHeaderVisibility() {
    const header = document.querySelector('.header');
    if (header) {
        // Show header on page load
        setTimeout(() => {
            header.classList.add('visible');
        }, 100);
        
        // Add scroll effect
        let lastScrollY = window.scrollY;
        let ticking = false;
        
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
    }
}

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

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMap,
        initContactForm,
        validateForm,
        trackEvent
    };
}
