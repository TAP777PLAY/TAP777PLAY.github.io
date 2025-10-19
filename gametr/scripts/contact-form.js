// Contact Form JavaScript for Chronicles of Olympus

document.addEventListener('DOMContentLoaded', function() {
    initContactFormValidation();
    initContactAnimations();
});

// Initialize contact form validation
function initContactFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm()) {
            submitContactForm();
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateContactField(this);
        });
        
        input.addEventListener('input', function() {
            clearContactFieldError(this);
        });
    });
    
    // Form reset handler
    const resetButton = form.querySelector('button[type="reset"]');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            setTimeout(() => {
                clearAllContactErrors();
            }, 100);
        });
    }
}

// Initialize contact animations
function initContactAnimations() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animation;
                
                if (animationType === 'fadeInUp') {
                    element.classList.add('visible');
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    contactCards.forEach((card, index) => {
        // Staggered animation
        card.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
}

// Validate contact form
function validateContactForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Clear all previous errors
    clearAllContactErrors();
    
    // Validate required fields
    requiredFields.forEach(field => {
        if (!validateContactField(field)) {
            isValid = false;
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('contactEmail');
    if (emailField && emailField.value) {
        if (!isValidEmail(emailField.value)) {
            showContactFieldError(emailField, 'Geçerli bir e-posta adresi giriniz');
            isValid = false;
        }
    }
    
    // Validate message length
    const messageField = document.getElementById('contactMessage');
    if (messageField && messageField.value) {
        if (messageField.value.length < 10) {
            showContactFieldError(messageField, 'Mesaj en az 10 karakter olmalıdır');
            isValid = false;
        }
    }
    
    return isValid;
}

// Validate contact field
function validateContactField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        errorMessage = getContactRequiredFieldMessage(fieldName);
        isValid = false;
    }
    
    // Specific validations
    if (value && fieldName === 'contactEmail') {
        if (!isValidEmail(value)) {
            errorMessage = 'Geçerli bir e-posta adresi giriniz';
            isValid = false;
        }
    }
    
    if (value && fieldName === 'contactName') {
        if (value.length < 2) {
            errorMessage = 'Ad soyad en az 2 karakter olmalıdır';
            isValid = false;
        }
    }
    
    if (value && fieldName === 'contactMessage') {
        if (value.length < 10) {
            errorMessage = 'Mesaj en az 10 karakter olmalıdır';
            isValid = false;
        }
    }
    
    if (!isValid) {
        showContactFieldError(field, errorMessage);
    } else {
        clearContactFieldError(field);
    }
    
    return isValid;
}

// Show contact field error
function showContactFieldError(field, message) {
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }
    
    field.classList.add('error');
}

// Clear contact field error
function clearContactFieldError(field) {
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.classList.remove('visible');
    }
    
    field.classList.remove('error');
}

// Clear all contact errors
function clearAllContactErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(error => {
        error.classList.remove('visible');
    });
    
    const errorFields = document.querySelectorAll('.form-input.error, .form-textarea.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
    });
}

// Get contact required field message
function getContactRequiredFieldMessage(fieldName) {
    const messages = {
        'contactName': 'Ad soyad alanı zorunludur',
        'contactEmail': 'E-posta adresi alanı zorunludur',
        'contactMessage': 'Mesaj alanı zorunludur'
    };
    
    return messages[fieldName] || 'Bu alan zorunludur';
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Submit contact form
function submitContactForm() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Gönderiliyor...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success popup
        showContactSuccessPopup();
        
        // Reset form
        form.reset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

// Show contact success popup
function showContactSuccessPopup() {
    const popup = document.getElementById('contactSuccessPopup');
    if (popup) {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Hide contact success popup
function hideContactSuccessPopup() {
    const popup = document.getElementById('contactSuccessPopup');
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize success popup handlers
document.addEventListener('DOMContentLoaded', function() {
    const closeSuccessPopup = document.getElementById('closeContactSuccessPopup');
    const successPopup = document.getElementById('contactSuccessPopup');
    
    if (closeSuccessPopup) {
        closeSuccessPopup.addEventListener('click', function() {
            hideContactSuccessPopup();
        });
    }
    
    if (successPopup) {
        successPopup.addEventListener('click', function(e) {
            if (e.target === successPopup) {
                hideContactSuccessPopup();
            }
        });
    }
});

// Initialize FAQ accordion functionality
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const content = item.querySelector('.faq-content');
        
        if (header && content) {
            header.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherContent = otherItem.querySelector('.faq-content');
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

// Initialize FAQ accordion on page load
document.addEventListener('DOMContentLoaded', function() {
    initFAQAccordion();
});

// Export functions
window.ContactFormController = {
    initContactFormValidation,
    initContactAnimations,
    validateContactForm,
    validateContactField,
    showContactFieldError,
    clearContactFieldError,
    clearAllContactErrors,
    isValidEmail,
    submitContactForm,
    showContactSuccessPopup,
    hideContactSuccessPopup,
    initFAQAccordion
};
