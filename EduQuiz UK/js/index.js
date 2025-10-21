/* ========================================
   Index Page JavaScript - Specific Functions
   ======================================== */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHeroBackground();
    initializeTestimonialsSlider();
    initializeQuizCards();
    initializeParallaxEffects();
});

// Hero Background Slider
function initializeHeroBackground() {
    const heroImages = document.querySelectorAll('.hero-image');
    let currentImage = 0;
    
    if (heroImages.length === 0) return;
    
    // Remove active class from all images
    function resetImages() {
        heroImages.forEach(img => img.classList.remove('active'));
    }
    
    // Show next image
    function showNextImage() {
        resetImages();
        currentImage = (currentImage + 1) % heroImages.length;
        heroImages[currentImage].classList.add('active');
    }
    
    // Start the slider
    setInterval(showNextImage, 4000); // Change image every 4 seconds
    
    // Initialize with first image
    heroImages[0].classList.add('active');
}

// Testimonials Slider
function initializeTestimonialsSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;
    
    if (slides.length === 0) return;
    
    // Remove active class from all slides and dots
    function resetSlides() {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
    }
    
    // Show specific slide
    function showSlide(index) {
        resetSlides();
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    // Show next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // Start auto-slider
    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    
    // Stop auto-slider
    function stopSlider() {
        clearInterval(slideInterval);
    }
    
    // Initialize
    showSlide(0);
    startSlider();
    
    // Add click handlers to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            stopSlider();
            showSlide(index);
            startSlider();
        });
    });
    
    // Pause on hover
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopSlider);
        slider.addEventListener('mouseleave', startSlider);
    }
}

// Quiz Cards Interactions
function initializeQuizCards() {
    const quizCards = document.querySelectorAll('.quiz-card');
    
    quizCards.forEach(card => {
        // Add click handler for navigation
        card.addEventListener('click', function() {
            // Add a subtle animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
                // Navigate to tests page (you can customize this)
                window.location.href = 'tests.html';
            }, 150);
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Parallax Effects
function initializeParallaxEffects() {
    const decorations = document.querySelectorAll('.decoration');
    
    if (decorations.length === 0) return;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        decorations.forEach((decoration, index) => {
            const speed = 0.3 + (index * 0.1); // Different speeds for different decorations
            decoration.style.transform = `translateY(${rate * speed}px)`;
        });
    }
    
    // Throttled scroll handler
    const throttledParallax = throttle(updateParallax, 16);
    window.addEventListener('scroll', throttledParallax);
}

// Enhanced Button Interactions
function initializeButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
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
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in-up');
            }, index * 200);
        });
    });
}

// Initialize loading animation
initializeLoadingAnimation();

// Add CSS for loading animation
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    .loading {
        overflow: hidden;
    }
    
    .loading .hero-title,
    .loading .hero-subtitle,
    .loading .hero-buttons {
        opacity: 0;
        transform: translateY(30px);
    }
    
    .fade-in-up {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: all 0.6s ease;
    }
    
    .quiz-card {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .quiz-card:active {
        transform: scale(0.98) !important;
    }
`;
document.head.appendChild(loadingStyle);

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
