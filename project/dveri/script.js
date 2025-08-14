// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Hero section enhanced animations
    const heroSection = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background img');
    const heroContent = document.querySelector('.hero-content');
    
    if (heroSection && heroBackground) {
        // Parallax effect for hero background
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `scale(1.1) rotate(1deg) translateY(${rate}px)`;
        });

        // Mouse move effect for hero content
        heroSection.addEventListener('mousemove', function(e) {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const x = (clientX - innerWidth / 2) / 100;
            const y = (clientY - innerHeight / 2) / 100;
            
            heroContent.style.transform = `translate(${x}px, ${y}px)`;
        });

        // Reset transform on mouse leave
        heroSection.addEventListener('mouseleave', function() {
            heroContent.style.transform = 'translate(0, 0)';
        });

        // Add floating animation to hero elements
        const heroElements = heroSection.querySelectorAll('h1, p, .hero-buttons');
        heroElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.3}s`;
        });
    }

    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const address = formData.get('address');
            const service = formData.get('service');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !phone || !address || !service) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // Show success message
            alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
            
            // Reset form
            this.reset();
        });
    }

    // CTA button functionality
    const ctaButtons = document.querySelectorAll('.cta-button, .btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // "Узнать больше" button functionality
    const learnMoreButtons = document.querySelectorAll('.btn-secondary');
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Simple hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Gallery lightbox effect (simple version)
    const galleryItems = document.querySelectorAll('.gallery-item img, .production-item img, .installation-item img');
    galleryItems.forEach(img => {
        img.addEventListener('click', function() {
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${this.src}" alt="${this.alt}">
                    <button class="lightbox-close">&times;</button>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            
            // Close lightbox
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target.className === 'lightbox-close') {
                    document.body.removeChild(lightbox);
                }
            });
        });
    });

    // Simple form field focus effects
    const formFields = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.style.borderColor = '#3498db';
        });
        
        field.addEventListener('blur', function() {
            this.style.borderColor = '#e9ecef';
        });
    });

    // Add entrance animation for hero section
    setTimeout(() => {
        if (heroSection) {
            heroSection.classList.add('hero-loaded');
        }
    }, 100);
});

// Add CSS for lightbox and hero animations
const style = document.createElement('style');
style.textContent = `
    /* Lightbox styles */
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .lightbox-content img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 8px;
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 30px;
        cursor: pointer;
        padding: 5px;
    }
    
    /* Hero entrance animation */
    .hero {
        opacity: 0;
        transform: scale(0.95);
        transition: all 1s ease-out;
    }
    
    .hero.hero-loaded {
        opacity: 1;
        transform: scale(1);
    }
    
    /* Enhanced hero animations */
    .hero-background img {
        filter: brightness(0.8) contrast(1.1);
        transition: filter 0.5s ease;
    }
    
    .hero:hover .hero-background img {
        filter: brightness(0.9) contrast(1.2);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .lightbox-content {
            max-width: 95%;
            max-height: 95%;
        }
        
        .hero-title {
            font-size: 36px;
        }
        
        .hero-description {
            font-size: 18px;
        }
    }
`;
document.head.appendChild(style);
