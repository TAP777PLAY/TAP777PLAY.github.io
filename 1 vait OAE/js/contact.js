/* ===== CONTACT PAGE JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFAQ();
    initializeMap();
    initializeSocialLinks();
});

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmission(this);
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
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

function handleContactSubmission(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly', 'error');
        return;
    }
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Save contact form data
        const contactData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            inquiryType: formData.get('inquiryType'),
            preferredDate: formData.get('preferredDate'),
            groupSize: formData.get('groupSize'),
            message: formData.get('message'),
            contactPreference: formData.getAll('contactPreference'),
            newsletter: formData.get('newsletter'),
            submittedAt: new Date().toISOString()
        };
        
        // Save to localStorage
        const contacts = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        contacts.push(contactData);
        localStorage.setItem('contactSubmissions', JSON.stringify(contacts));
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you within 2 hours.', 'success');
        
        // Reset form
        form.reset();
        
        // Send email notification (in real app)
        sendEmailNotification(contactData);
    }, 2000);
}

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
    
    // Date validation
    if (fieldType === 'date' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            isValid = false;
            errorMessage = 'Please select a future date';
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

function sendEmailNotification(contactData) {
    // In a real application, this would send an email to the admin
    console.log('Email notification would be sent:', contactData);
    
    // Simulate email sending
    const emailData = {
        to: 'admin@safaribreakfasts.ae',
        subject: `New Contact Form Submission - ${contactData.inquiryType}`,
        body: `
            New contact form submission:
            
            Name: ${contactData.firstName} ${contactData.lastName}
            Email: ${contactData.email}
            Phone: ${contactData.phone}
            Inquiry Type: ${contactData.inquiryType}
            Preferred Date: ${contactData.preferredDate}
            Group Size: ${contactData.groupSize}
            Message: ${contactData.message}
            Contact Preference: ${contactData.contactPreference.join(', ')}
            Newsletter: ${contactData.newsletter ? 'Yes' : 'No'}
            
            Submitted at: ${new Date(contactData.submittedAt).toLocaleString()}
        `
    };
    
    // Save email to be sent
    const emails = JSON.parse(localStorage.getItem('pendingEmails') || '[]');
    emails.push(emailData);
    localStorage.setItem('pendingEmails', JSON.stringify(emails));
}

// ===== FAQ FUNCTIONALITY =====
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleFAQ(this);
        });
    });
}

function toggleFAQ(question) {
    const faqItem = question.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = question.querySelector('.faq-icon');
    
    const isOpen = faqItem.classList.contains('open');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('open');
        const itemAnswer = item.querySelector('.faq-answer');
        const itemIcon = item.querySelector('.faq-icon');
        if (itemAnswer) itemAnswer.style.maxHeight = null;
        if (itemIcon) itemIcon.textContent = '+';
    });
    
    if (!isOpen) {
        // Open this FAQ item
        faqItem.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.textContent = '−';
    }
}

// ===== MAP FUNCTIONALITY =====
function initializeMap() {
    const mapContainer = document.querySelector('.map-container');
    
    if (mapContainer) {
        // Add click handler for map interaction
        mapContainer.addEventListener('click', function() {
            openMapInNewTab();
        });
        
        // Add hover effects
        mapContainer.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        mapContainer.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

function openMapInNewTab() {
    const mapUrl = 'https://maps.google.com/?q=24.8607,55.4708'; // Dubai Desert Conservation Reserve coordinates
    window.open(mapUrl, '_blank');
}

// ===== SOCIAL LINKS =====
function initializeSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.className.split(' ')[1];
            openSocialPlatform(platform);
        });
    });
}

function openSocialPlatform(platform) {
    const urls = {
        instagram: 'https://www.instagram.com/safaribreakfastsuae',
        facebook: 'https://www.facebook.com/safaribreakfastsuae',
        youtube: 'https://www.youtube.com/@safaribreakfastsuae',
        tiktok: 'https://www.tiktok.com/@safaribreakfastsuae',
        linkedin: 'https://www.linkedin.com/company/safari-breakfasts-uae',
        whatsapp: 'https://wa.me/971501234567'
    };
    
    if (urls[platform]) {
        window.open(urls[platform], '_blank');
    }
}

// ===== CONTACT METHODS =====
function initializeContactMethods() {
    // Phone click handler
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackContactMethod('phone');
        });
    });
    
    // WhatsApp click handler
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackContactMethod('whatsapp');
        });
    });
    
    // Email click handler
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackContactMethod('email');
        });
    });
}

function trackContactMethod(method) {
    const trackingData = {
        method: method,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    };
    
    // Save tracking data
    const tracking = JSON.parse(localStorage.getItem('contactTracking') || '[]');
    tracking.push(trackingData);
    localStorage.setItem('contactTracking', JSON.stringify(tracking));
    
    console.log(`Contact method used: ${method}`);
}

// ===== FORM PERSISTENCE =====
function initializeFormPersistence() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Load saved form data
    loadFormData(form);
    
    // Save form data on input
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            saveFormData(form);
        });
    });
}

function saveFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    localStorage.setItem('contactFormData', JSON.stringify(data));
}

function loadFormData(form) {
    const savedData = localStorage.getItem('contactFormData');
    if (!savedData) return;
    
    const data = JSON.parse(savedData);
    
    Object.keys(data).forEach(key => {
        const element = form.querySelector(`[name="${key}"]`);
        if (element) {
            if (element.type === 'checkbox' || element.type === 'radio') {
                const values = Array.isArray(data[key]) ? data[key] : [data[key]];
                values.forEach(value => {
                    const checkbox = form.querySelector(`[name="${key}"][value="${value}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            } else {
                element.value = data[key];
            }
        }
    });
}

function clearFormData() {
    localStorage.removeItem('contactFormData');
}

// ===== INITIALIZE ALL FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    initializeContactMethods();
    initializeFormPersistence();
});

// ===== UTILITY FUNCTIONS =====
function formatPhoneNumber(phone) {
    // Format UAE phone number
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12 && cleaned.startsWith('971')) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
    }
    return phone;
}

function validateUAEPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 12 && cleaned.startsWith('971');
}

// ===== ACCESSIBILITY IMPROVEMENTS =====
function initializeAccessibility() {
    // Add keyboard navigation for FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add ARIA labels
    const form = document.getElementById('contactForm');
    if (form) {
        form.setAttribute('aria-label', 'Contact form');
    }
    
    // Add focus management
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modal = document.querySelector(this.dataset.modal);
            if (modal) {
                const firstFocusable = modal.querySelector('input, button, select, textarea');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }
        });
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);
