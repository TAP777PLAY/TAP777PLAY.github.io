/* ===== VIP OFFERS JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', function() {
    initializeVIPPackages();
    initializeGiftCertificates();
    initializeVIPForm();
    initializeVIPAnimations();
    initializeVIPNotifications();
});

// ===== VIP PACKAGES FUNCTIONALITY =====
function initializeVIPPackages() {
    const packageCards = document.querySelectorAll('.vip-package-card');
    const packageSelectButtons = document.querySelectorAll('.package-select');
    
    // Package card interactions
    packageCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
        
        card.addEventListener('click', function() {
            // Remove active class from all cards
            packageCards.forEach(c => c.classList.remove('selected'));
            // Add active class to clicked card
            this.classList.add('selected');
            
            // Update form with selected package
            updateSelectedPackage(this);
        });
    });
    
    // Package select buttons
    packageSelectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const packageId = this.dataset.package;
            selectVIPPackage(packageId);
        });
    });
}

function selectVIPPackage(packageId) {
    const packageData = getPackageData(packageId);
    
    // Update form
    const packageSelect = document.getElementById('selectedPackage');
    if (packageSelect) {
        packageSelect.value = packageId;
    }
    
    // Show package details modal
    showPackageDetailsModal(packageData);
    
    // Scroll to form
    const formSection = document.querySelector('.order-form');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    showNotification(`Selected: ${packageData.name}`, 'success');
}

function getPackageData(packageId) {
    const packages = {
        'royal-desert': {
            name: 'Royal Desert Experience',
            price: 'AED 2,500',
            duration: '6-8 hours',
            groupSize: '2-6 people',
            features: ['Private Luxury Tent', 'Personal Chef', 'Dedicated Guide']
        },
        'oasis-retreat': {
            name: 'Private Oasis Retreat',
            price: 'AED 1,800',
            duration: '4-5 hours',
            groupSize: '2-8 people',
            features: ['Private UNESCO Access', 'Traditional Majlis', 'Cultural Expert Guide']
        },
        'sunset-safari': {
            name: 'Sunset Luxury Safari',
            price: 'AED 2,200',
            duration: '5-6 hours',
            groupSize: '2-4 people',
            features: ['Champagne Service', 'Private Photography', 'Exclusive Sunset Views']
        },
        'corporate-vip': {
            name: 'Corporate VIP Experience',
            price: 'AED 1,500',
            duration: 'Full Day',
            groupSize: '10-50 people',
            features: ['Team Building', 'Meeting Facilities', 'Corporate Catering']
        },
        'bespoke-private': {
            name: 'Bespoke Private Experience',
            price: 'AED 3,000',
            duration: 'Custom',
            groupSize: 'Any Size',
            features: ['Custom Design', 'Personal Concierge', 'Flexible Schedule']
        }
    };
    
    return packages[packageId] || packages['royal-desert'];
}

function showPackageDetailsModal(packageData) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'vip-package-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <h3 class="modal-title">${packageData.name}</h3>
                    <div class="modal-price">${packageData.price}</div>
                </div>
                <div class="modal-body">
                    <div class="package-details">
                        <div class="detail-item">
                            <span class="detail-label">Duration:</span>
                            <span class="detail-value">${packageData.duration}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Group Size:</span>
                            <span class="detail-value">${packageData.groupSize}</span>
                        </div>
                    </div>
                    <div class="package-features">
                        <h4>Included Features:</h4>
                        <ul>
                            ${packageData.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="proceedToBooking('${packageData.name}')">Proceed to Booking</button>
                    <button class="btn btn-outline modal-close-btn">Close</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .vip-package-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .modal-content {
            background: var(--bg-secondary);
            border-radius: var(--border-radius);
            border: 2px solid var(--primary);
            box-shadow: var(--shadow-neon);
            max-width: 600px;
            width: 100%;
            position: relative;
            animation: slideInUp 0.3s ease-out;
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 24px;
            cursor: pointer;
            z-index: 1;
        }
        
        .modal-close:hover {
            color: var(--primary);
        }
        
        .modal-header {
            padding: 30px 30px 20px;
            border-bottom: 1px solid rgba(138, 124, 255, 0.2);
        }
        
        .modal-title {
            color: var(--text-primary);
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .modal-price {
            color: var(--primary);
            font-size: 20px;
            font-weight: var(--fw-bold);
        }
        
        .modal-body {
            padding: 20px 30px;
        }
        
        .package-details {
            margin-bottom: 20px;
        }
        
        .detail-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        
        .detail-label {
            color: var(--text-secondary);
        }
        
        .detail-value {
            color: var(--text-primary);
            font-weight: var(--fw-medium);
        }
        
        .package-features h4 {
            color: var(--text-primary);
            margin-bottom: 10px;
        }
        
        .package-features ul {
            list-style: none;
            padding: 0;
        }
        
        .package-features li {
            color: var(--text-secondary);
            margin-bottom: 5px;
            padding-left: 20px;
            position: relative;
        }
        
        .package-features li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--secondary);
            font-weight: var(--fw-bold);
        }
        
        .modal-footer {
            padding: 20px 30px 30px;
            display: flex;
            gap: 15px;
            justify-content: flex-end;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeModal = () => {
        modal.remove();
        style.remove();
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // ESC key to close
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

// ===== GIFT CERTIFICATES FUNCTIONALITY =====
function initializeGiftCertificates() {
    const certificateCards = document.querySelectorAll('.certificate-card');
    const certificateSelectButtons = document.querySelectorAll('.certificate-select');
    
    // Certificate card interactions
    certificateCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
        
        card.addEventListener('click', function() {
            // Remove active class from all cards
            certificateCards.forEach(c => c.classList.remove('selected'));
            // Add active class to clicked card
            this.classList.add('selected');
        });
    });
    
    // Certificate select buttons
    certificateSelectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const certificateId = this.dataset.certificate;
            selectGiftCertificate(certificateId);
        });
    });
}

function selectGiftCertificate(certificateId) {
    const certificateData = getCertificateData(certificateId);
    
    // Show certificate details modal
    showCertificateDetailsModal(certificateData);
    
    showNotification(`Selected: ${certificateData.name}`, 'success');
}

function getCertificateData(certificateId) {
    const certificates = {
        'vip': {
            name: 'VIP Experience Certificate',
            price: 'AED 2,500',
            description: 'Perfect for special occasions. Valid for any VIP package up to AED 2,500 value.',
            features: ['12 months validity', 'Transferable', 'Digital delivery']
        },
        'luxury': {
            name: 'Luxury Desert Certificate',
            price: 'AED 1,800',
            description: 'Premium desert experience certificate. Valid for luxury packages up to AED 1,800 value.',
            features: ['12 months validity', 'Transferable', 'Digital delivery']
        },
        'custom': {
            name: 'Custom Value Certificate',
            price: 'From AED 500',
            description: 'Choose your own value. Perfect for any budget and occasion.',
            features: ['12 months validity', 'Transferable', 'Digital delivery']
        }
    };
    
    return certificates[certificateId] || certificates['vip'];
}

function showCertificateDetailsModal(certificateData) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'certificate-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <h3 class="modal-title">${certificateData.name}</h3>
                    <div class="modal-price">${certificateData.price}</div>
                </div>
                <div class="modal-body">
                    <p class="certificate-description">${certificateData.description}</p>
                    <div class="certificate-features">
                        <h4>Certificate Features:</h4>
                        <ul>
                            ${certificateData.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="proceedToCertificatePurchase('${certificateData.name}')">Purchase Certificate</button>
                    <button class="btn btn-outline modal-close-btn">Close</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles (reuse from package modal)
    const style = document.createElement('style');
    style.textContent = `
        .certificate-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .modal-content {
            background: var(--bg-secondary);
            border-radius: var(--border-radius);
            border: 2px solid var(--secondary);
            box-shadow: 0 0 20px rgba(0, 224, 164, 0.4);
            max-width: 500px;
            width: 100%;
            position: relative;
            animation: slideInUp 0.3s ease-out;
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 24px;
            cursor: pointer;
            z-index: 1;
        }
        
        .modal-close:hover {
            color: var(--secondary);
        }
        
        .modal-header {
            padding: 30px 30px 20px;
            border-bottom: 1px solid rgba(0, 224, 164, 0.2);
        }
        
        .modal-title {
            color: var(--text-primary);
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .modal-price {
            color: var(--secondary);
            font-size: 20px;
            font-weight: var(--fw-bold);
        }
        
        .modal-body {
            padding: 20px 30px;
        }
        
        .certificate-description {
            color: var(--text-secondary);
            margin-bottom: 20px;
            line-height: 1.6;
        }
        
        .certificate-features h4 {
            color: var(--text-primary);
            margin-bottom: 10px;
        }
        
        .certificate-features ul {
            list-style: none;
            padding: 0;
        }
        
        .certificate-features li {
            color: var(--text-secondary);
            margin-bottom: 5px;
            padding-left: 20px;
            position: relative;
        }
        
        .certificate-features li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--secondary);
            font-weight: var(--fw-bold);
        }
        
        .modal-footer {
            padding: 20px 30px 30px;
            display: flex;
            gap: 15px;
            justify-content: flex-end;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeModal = () => {
        modal.remove();
        style.remove();
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // ESC key to close
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

// ===== VIP FORM FUNCTIONALITY =====
function initializeVIPForm() {
    const vipForm = document.getElementById('vipOrderForm');
    
    if (vipForm) {
        vipForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleVIPFormSubmission(this);
        });
    }
    
    // Form validation
    const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateFormField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function handleVIPFormSubmission(form) {
    // Validate form
    if (!validateVIPForm(form)) {
        showNotification('Please fill in all required fields correctly', 'warning');
        return;
    }
    
    // Collect form data
    const formData = new FormData(form);
    const vipRequest = {
        personalInfo: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        preferences: {
            selectedPackage: formData.get('selectedPackage'),
            preferredDate: formData.get('preferredDate'),
            groupSize: formData.get('groupSize'),
            specialRequests: formData.get('specialRequests')
        },
        additionalServices: formData.getAll('additionalServices'),
        contactPreferences: formData.getAll('contactPreferences'),
        bestTime: formData.get('bestTime'),
        submittedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const existingRequests = JSON.parse(localStorage.getItem('vipRequests') || '[]');
    existingRequests.push(vipRequest);
    localStorage.setItem('vipRequests', JSON.stringify(existingRequests));
    
    // Show success message
    showNotification('VIP request submitted successfully! Our concierge will contact you within 2 hours.', 'success');
    
    // Reset form
    form.reset();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateVIPForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateFormField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateFormField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(field)} is required`);
        return false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Date validation
    if (fieldName === 'preferredDate' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showFieldError(field, 'Please select a future date');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function getFieldLabel(field) {
    const label = field.parentNode.querySelector('.form-label');
    return label ? label.textContent.replace('*', '').trim() : field.name;
}

// ===== VIP ANIMATIONS =====
function initializeVIPAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.vip-package-card, .certificate-card, .form-section');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== VIP NOTIFICATIONS =====
function initializeVIPNotifications() {
    // Enhanced notification system for VIP
    window.showVIPNotification = function(message, type = 'info', duration = 5000) {
        showNotification(message, type, duration);
    };
}

// ===== GLOBAL FUNCTIONS =====
function proceedToBooking(packageName) {
    showNotification(`Proceeding to book: ${packageName}`, 'success');
    // In real app, would redirect to booking page
    console.log('Proceeding to booking:', packageName);
}

function proceedToCertificatePurchase(certificateName) {
    showNotification(`Proceeding to purchase: ${certificateName}`, 'success');
    // In real app, would redirect to purchase page
    console.log('Proceeding to certificate purchase:', certificateName);
}

function updateSelectedPackage(packageCard) {
    const packageTitle = packageCard.querySelector('.package-title').textContent;
    const packageSelect = document.getElementById('selectedPackage');
    
    if (packageSelect) {
        // Find option by text content
        const options = packageSelect.querySelectorAll('option');
        options.forEach(option => {
            if (option.textContent.includes(packageTitle)) {
                packageSelect.value = option.value;
            }
        });
    }
}

// ===== ENHANCED NOTIFICATIONS =====
function showNotification(message, type = 'info', duration = 5000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: var(--bg-secondary);
            border: 2px solid var(--primary);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-neon);
            padding: 15px 20px;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        }
        
        .notification-success {
            border-color: var(--secondary);
        }
        
        .notification-warning {
            border-color: var(--accent-yellow);
        }
        
        .notification-error {
            border-color: var(--accent-pink);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 18px;
            cursor: pointer;
        }
        
        .notification-close:hover {
            color: var(--primary);
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, duration);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
        style.remove();
    });
}
