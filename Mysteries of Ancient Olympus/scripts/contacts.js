// ===== CONTACTS PAGE INTERACTIVE FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all contact page interactions
    initializeContactForm();
    initializeFormValidation();
    initializeMap();
    initializeAnimations();
    initializeAccessibility();
    initializeMobileMenu();
});

// ===== MOBILE MENU INITIALIZATION =====
function initializeMobileMenu() {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    
    if (burger && nav) {
        console.log('Инициализация мобильного меню на странице контактов');
        
        // Убеждаемся, что меню закрыто при загрузке
        burger.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';
        
        // Добавляем обработчик клика
        burger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Клик по бургер-меню на странице контактов');
            
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('nav-open');
            
            // Предотвращаем скролл при открытом меню
            if (nav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log('Закрытие меню по клику на ссылку');
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('nav-open');
                document.body.style.overflow = '';
            });
        });
    } else {
        console.error('Элементы мобильного меню не найдены на странице контактов');
    }
}

// ===== CONTACT FORM FUNCTIONALITY =====
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('.form-submit');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
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
}

function validateForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
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
    
    // Clear previous error state
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = `${getFieldLabel(fieldName)} is required`;
        isValid = false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }
    
    // Name validation
    if (fieldName === 'name' && value) {
        if (value.length < 2) {
            errorMessage = 'Name must be at least 2 characters long';
            isValid = false;
        }
    }
    
    // Message validation
    if (fieldName === 'message' && value) {
        if (value.length < 10) {
            errorMessage = 'Message must be at least 10 characters long';
            isValid = false;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        showFieldSuccess(field);
    }
    
    return isValid;
}

function getFieldLabel(fieldName) {
    const labels = {
        'name': 'Name',
        'email': 'Email',
        'message': 'Message'
    };
    return labels[fieldName] || fieldName;
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`);
    field.classList.add('error');
    field.classList.remove('success');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function showFieldSuccess(field) {
    field.classList.remove('error');
    field.classList.add('success');
}

function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    field.classList.remove('error', 'success');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

function submitForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('.form-submit');
    const formData = new FormData(form);
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show success modal
        showSuccessModal();
        
        // Clear all field states
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            clearFieldError(input);
        });
        
    }, 2000);
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.add('active');
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            modal.classList.remove('active');
        }, 5000);
    }
}

// ===== GOOGLE MAPS INTEGRATION =====
function initializeMap() {
    // Check if Google Maps is loaded
    if (typeof google !== 'undefined' && google.maps) {
        // initMap(); // Удалено - теперь используется iframe
    } else {
        // Wait for Google Maps to load
        window.initMap = initMap;
        
        // Fallback if Google Maps fails to load
        setTimeout(() => {
            if (typeof google === 'undefined' || !google.maps) {
                showMapFallback();
            }
        }, 3000);
    }
    
    // Also try to show fallback immediately as backup
    setTimeout(() => {
        const mapContainer = document.getElementById('google-map');
        if (mapContainer && !mapContainer.hasChildNodes()) {
            showMapFallback();
        }
    }, 1000);
}

function showMapFallback() {
    const mapContainer = document.getElementById('google-map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                background: linear-gradient(135deg, #f5f5dc, #e8e8e8);
                color: #1B2951;
                text-align: center;
                padding: 20px;
                border-radius: 8px;
            ">
                <h3 style="margin: 0 0 8px 0; color: #1B2951;">Mysteries of Ancient Olympus</h3>
                <p style="margin: 0 0 4px 0; color: #666; font-size: 16px;">45 Kingswood Lane, Egham, Surrey</p>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">TW20 8NB, UNITED KINGDOM</p>
                <a href="https://www.google.com/maps/search/45+Kingswood+Lane,+Egham,+Surrey,+TW20+8NB,+UK" 
                   target="_blank" 
                   style="
                       display: inline-block;
                       background: linear-gradient(135deg, #D4AF37, #FFD700);
                       color: white;
                       padding: 8px 16px;
                       border-radius: 4px;
                       text-decoration: none;
                       font-weight: bold;
                       margin-top: 8px;
                   ">
                    Open in Google Maps
                </a>
            </div>
        `;
    }
}

// Функция initMap больше не используется - заменена на iframe
/*
function initMap() {
    try {
        // UK coordinates for 45 Kingswood Lane, Egham, Surrey
        const ukLocation = { lat: 51.4308, lng: -0.5469 };
        
        const map = new google.maps.Map(document.getElementById('google-map'), {
        zoom: 16,
        center: ukLocation,
        mapTypeId: 'roadmap',
        styles: [
            {
                featureType: 'all',
                elementType: 'geometry.fill',
                stylers: [{ weight: '2.00' }]
            },
            {
                featureType: 'all',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#9c9c9c' }]
            },
            {
                featureType: 'all',
                elementType: 'labels.text',
                stylers: [{ visibility: 'on' }]
            },
            {
                featureType: 'landscape',
                elementType: 'all',
                stylers: [{ color: '#f2f2f2' }]
            },
            {
                featureType: 'landscape',
                elementType: 'geometry.fill',
                stylers: [{ color: '#ffffff' }]
            },
            {
                featureType: 'landscape.man_made',
                elementType: 'geometry.fill',
                stylers: [{ color: '#ffffff' }]
            },
            {
                featureType: 'poi',
                elementType: 'all',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'road',
                elementType: 'all',
                stylers: [{ saturation: -100 }, { lightness: 45 }]
            },
            {
                featureType: 'road',
                elementType: 'geometry.fill',
                stylers: [{ color: '#eeeeee' }]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#7b7b7b' }]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#ffffff' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'all',
                stylers: [{ visibility: 'simplified' }]
            },
            {
                featureType: 'road.arterial',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'transit',
                elementType: 'all',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'water',
                elementType: 'all',
                stylers: [{ color: '#46bcec' }, { visibility: 'on' }]
            },
            {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [{ color: '#c8d7d4' }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#070707' }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#ffffff' }]
            }
        ]
    });
    
    // Add custom marker
    const marker = new google.maps.Marker({
        position: ukLocation,
        map: map,
        title: 'Mysteries of Ancient Olympus Studio',
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="#D4AF37" stroke="#1B2951" stroke-width="2"/>
                    <text x="20" y="26" text-anchor="middle" fill="#1B2951" font-family="Arial" font-size="20">T</text>
                </svg>
            `),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
        }
    });
    
    // Add info window
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px; font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 8px 0; color: #1B2951;">Mysteries of Ancient Olympus</h3>
                <p style="margin: 0 0 4px 0; color: #666;">45 Kingswood Lane, Egham, Surrey, TW20 8NB, UK</p>
                <p style="margin: 0; color: #666;">Phone: +44 (0) 1784 556 789</p>
            </div>
        `
    });
    
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
    
    } catch (error) {
        console.error('Google Maps initialization error:', error);
        showMapFallback();
    }
}
*/

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.contact-form-content, .contact-info-content, .map-content, .additional-info-content');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initializeAccessibility() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, textarea');
    
    // Add ARIA attributes
    inputs.forEach(input => {
        const label = form.querySelector(`label[for="${input.id}"]`);
        if (label) {
            input.setAttribute('aria-labelledby', label.id || input.id + '-label');
        }
        
        // Add error association
        const errorElement = document.getElementById(`${input.name}-error`);
        if (errorElement) {
            input.setAttribute('aria-describedby', errorElement.id);
        }
    });
    
    // Add keyboard navigation for form
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const nextInput = inputs[index + 1];
                if (nextInput) {
                    nextInput.focus();
                } else {
                    form.querySelector('.form-submit').focus();
                }
            }
        });
    });
    
    // Form submission with keyboard
    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            if (validateForm()) {
                submitForm();
            }
        }
    });
}

// ===== FORM PERSISTENCE =====
function saveFormData() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem('contactFormData', JSON.stringify(data));
}

function loadFormData() {
    const savedData = localStorage.getItem('contactFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        const form = document.getElementById('contact-form');
        
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = data[key];
            }
        });
    }
}

function clearFormData() {
    localStorage.removeItem('contactFormData');
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

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Load saved form data
    loadFormData();
    
    // Save form data on input
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', debounce(saveFormData, 1000));
    });
    
    // Clear form data on successful submission
    const originalSubmitForm = submitForm;
    submitForm = function() {
        originalSubmitForm();
        clearFormData();
    };
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Contact page error:', e.error);
    
    // Show user-friendly error message
    const errorModal = document.createElement('div');
    errorModal.className = 'error-modal';
    errorModal.innerHTML = `
        <div class="error-content">
            <h3>Oops! Something went wrong</h3>
            <p>We're having technical difficulties. Please try again later or contact us directly.</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    document.body.appendChild(errorModal);
    
    setTimeout(() => {
        if (errorModal.parentElement) {
            errorModal.remove();
        }
    }, 5000);
});
