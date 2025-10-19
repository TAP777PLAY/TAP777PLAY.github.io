// Contact Page Interactive Elements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Interactive Map
    initializeMap();
    
    // Initialize Contact Form
    initializeContactForm();
    
    // Initialize FAQ Accordions
    initializeFAQ();
    
    // Initialize Animations
    initializeAnimations();
});

// Interactive Map Initialization
function initializeMap() {
    // Initialize the map centered on Al Ain Zoo
    const map = L.map('contact-map').setView([24.2075, 55.7447], 15);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add marker for Al Ain Zoo
    const zooMarker = L.marker([24.2075, 55.7447]).addTo(map);
    
    // Add popup with zoo information
    zooMarker.bindPopup(`
        <div style="color: #0B021F; font-family: 'Poppins', sans-serif; text-align: center;">
            <h3 style="color: #7B2FF7; margin: 0 0 10px 0;">Al Ain Zoo</h3>
            <p style="margin: 0 0 10px 0; color: #666;">Nahyan The First St, Al Ain, UAE</p>
            <p style="margin: 0 0 10px 0; color: #666;">Phone: +971 3 799 2000</p>
            <button onclick="openMap()" 
                    style="background: #7B2FF7; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 10px;">
                Get Directions
            </button>
        </div>
    `);
    
    // Add click event to open in external map
    zooMarker.on('click', function() {
        openMap();
    });
}

// Open external map
function openMap() {
    const lat = 24.2075;
    const lng = 55.7447;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}

// Contact Form Functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Validate phone if provided
            if (data.phone) {
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(data.phone)) {
                    showNotification('Please enter a valid phone number', 'error');
                    return;
                }
            }
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            setTimeout(() => {
                showNotification('Message sent successfully! We will contact you soon.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }, 2000);
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        // Phone number formatting
        const phoneInput = contactForm.querySelector('#phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                formatPhoneNumber(this);
            });
        }
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
    
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    if (fieldName === 'phone' && value) {
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

// Phone number formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.startsWith('971')) {
            value = '+' + value;
        } else if (value.startsWith('3')) {
            value = '+971' + value;
        }
    }
    
    input.value = value;
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
        '.contact-item, .faq-item, .social-link'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-in-out';
        fadeObserver.observe(el);
    });
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

// Enhanced Contact Item Interactions
document.addEventListener('DOMContentLoaded', function() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(123, 47, 247, 0.3)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
});

// Social Link Interactions
document.addEventListener('DOMContentLoaded', function() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(123, 47, 247, 0.3)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
});

// Form Enhancement: Auto-save to localStorage
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    
    // Load saved data
    const savedData = localStorage.getItem('contactFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        formInputs.forEach(input => {
            if (data[input.name]) {
                input.value = data[input.name];
            }
        });
    }
    
    // Save data on input
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            localStorage.setItem('contactFormData', JSON.stringify(data));
        });
    });
    
    // Clear saved data on successful submission
    contactForm.addEventListener('submit', function() {
        setTimeout(() => {
            localStorage.removeItem('contactFormData');
        }, 2000);
    });
});

// Click-to-call functionality
document.addEventListener('DOMContentLoaded', function() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
});

// Email click functionality
document.addEventListener('DOMContentLoaded', function() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
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
