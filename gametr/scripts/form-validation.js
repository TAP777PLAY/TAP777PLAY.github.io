// Form Validation JavaScript for Chronicles of Olympus

document.addEventListener('DOMContentLoaded', function() {
    initFormValidation();
    initProcessSteps();
    initFAQAccordion();
});

// Initialize form validation
function initFormValidation() {
    const form = document.getElementById('applicationForm');
    const successPopup = document.getElementById('successPopup');
    const closeSuccessPopup = document.getElementById('closeSuccessPopup');
    
    if (!form) return;
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Simulate form submission
            submitForm();
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Close success popup
    if (closeSuccessPopup) {
        closeSuccessPopup.addEventListener('click', function() {
            hideSuccessPopup();
        });
    }
    
    // Close popup when clicking outside
    if (successPopup) {
        successPopup.addEventListener('click', function(e) {
            if (e.target === successPopup) {
                hideSuccessPopup();
            }
        });
    }
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('applicationForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Clear all previous errors
    clearAllErrors();
    
    // Validate required fields
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('email');
    if (emailField && emailField.value) {
        if (!isValidEmail(emailField.value)) {
            showFieldError(emailField, 'Geçerli bir e-posta adresi giriniz');
            isValid = false;
        }
    }
    
    // Validate motivation length
    const motivationField = document.getElementById('motivation');
    if (motivationField && motivationField.value) {
        if (motivationField.value.length < 50) {
            showFieldError(motivationField, 'Motivasyon en az 50 karakter olmalıdır');
            isValid = false;
        }
    }
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        errorMessage = getRequiredFieldMessage(fieldName);
        isValid = false;
    }
    
    // Specific validations
    if (value && fieldName === 'email') {
        if (!isValidEmail(value)) {
            errorMessage = 'Geçerli bir e-posta adresi giriniz';
            isValid = false;
        }
    }
    
    if (value && fieldName === 'motivation') {
        if (value.length < 50) {
            errorMessage = 'Motivasyon en az 50 karakter olmalıdır';
            isValid = false;
        }
    }
    
    if (value && fieldName === 'fullName') {
        if (value.length < 2) {
            errorMessage = 'Ad soyad en az 2 karakter olmalıdır';
            isValid = false;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }
    
    field.classList.add('error');
}

// Clear field error
function clearFieldError(field) {
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.classList.remove('visible');
    }
    
    field.classList.remove('error');
}

// Clear all errors
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(error => {
        error.classList.remove('visible');
    });
    
    const errorFields = document.querySelectorAll('.form-input.error, .form-textarea.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
    });
}

// Get required field message
function getRequiredFieldMessage(fieldName) {
    const messages = {
        'fullName': 'Ad soyad alanı zorunludur',
        'email': 'E-posta adresi alanı zorunludur',
        'motivation': 'Motivasyon alanı zorunludur',
        'privacyPolicy': 'Gizlilik politikasını kabul etmelisiniz'
    };
    
    return messages[fieldName] || 'Bu alan zorunludur';
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Submit form
function submitForm() {
    const form = document.getElementById('applicationForm');
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
        showSuccessPopup();
        
        // Reset form
        form.reset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

// Show success popup
function showSuccessPopup() {
    const popup = document.getElementById('successPopup');
    if (popup) {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Hide success popup
function hideSuccessPopup() {
    const popup = document.getElementById('successPopup');
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize process steps animation
function initProcessSteps() {
    const stepItems = document.querySelectorAll('.step-item');
    
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
    
    stepItems.forEach((item, index) => {
        // Staggered animation
        item.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(item);
    });
}

// Initialize FAQ accordion
function initFAQAccordion() {
    const accordionItems = document.querySelectorAll('.faq-accordion .accordion-item');
    
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

// Form reset functionality
function resetForm() {
    const form = document.getElementById('applicationForm');
    if (form) {
        form.reset();
        clearAllErrors();
    }
}

// Add form reset event listener
document.addEventListener('DOMContentLoaded', function() {
    const resetButton = document.querySelector('button[type="reset"]');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            setTimeout(() => {
                clearAllErrors();
            }, 100);
        });
    }
});

// Export functions
window.FormValidationController = {
    validateForm,
    validateField,
    showFieldError,
    clearFieldError,
    clearAllErrors,
    isValidEmail,
    submitForm,
    showSuccessPopup,
    hideSuccessPopup,
    resetForm
};
