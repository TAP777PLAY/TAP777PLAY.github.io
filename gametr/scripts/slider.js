// Slider JavaScript for Chronicles of Olympus

document.addEventListener('DOMContentLoaded', function() {
    initSlider();
    initSliderAnimations();
});

// Initialize slider functionality
function initSlider() {
    const slider = document.querySelector('.world-slider');
    if (!slider) return;
    
    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = slider.querySelector('.prev-btn');
    const nextBtn = slider.querySelector('.next-btn');
    const indicators = slider.querySelectorAll('.indicator');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Update slide display
    function updateSlide() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index === currentSlide) {
                indicator.classList.add('active');
            }
        });
        
        // Update button states
        if (prevBtn) {
            prevBtn.disabled = currentSlide === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = currentSlide === totalSlides - 1;
        }
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < totalSlides) {
            currentSlide = slideIndex;
            updateSlide();
        }
    }
    
    // Next slide
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlide();
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
        }
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (slider.matches(':hover') || slider.contains(document.activeElement)) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        }
    });
    
    // Touch/swipe support
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    });
    
    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;
        
        // Only handle horizontal swipes
        if (Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault();
        }
    });
    
    slider.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isDragging = false;
    });
    
    // Mouse drag support
    let mouseStartX = 0;
    let isMouseDragging = false;
    
    slider.addEventListener('mousedown', (e) => {
        mouseStartX = e.clientX;
        isMouseDragging = true;
        e.preventDefault();
    });
    
    slider.addEventListener('mousemove', (e) => {
        if (!isMouseDragging) return;
        e.preventDefault();
    });
    
    slider.addEventListener('mouseup', (e) => {
        if (!isMouseDragging) return;
        
        const mouseEndX = e.clientX;
        const diffX = mouseStartX - mouseEndX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isMouseDragging = false;
    });
    
    // Auto-play functionality (optional)
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (currentSlide < totalSlides - 1) {
                nextSlide();
            } else {
                goToSlide(0);
            }
        }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    // Start auto-play when slider is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAutoPlay();
            } else {
                stopAutoPlay();
            }
        });
    });
    
    observer.observe(slider);
    
    // Pause auto-play on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    
    // Initialize
    updateSlide();
}

// Initialize slider animations
function initSliderAnimations() {
    const slider = document.querySelector('.world-slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.slide');
    
    slides.forEach((slide, index) => {
        const image = slide.querySelector('.slide-image');
        const content = slide.querySelector('.slide-content');
        
        if (image) {
            // Image zoom effect on hover
            slide.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.05)';
            });
            
            slide.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
            });
        }
        
        if (content) {
            // Content fade-in animation
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            
            const showContent = () => {
                content.style.transition = 'all 0.6s ease';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            };
            
            // Show content when slide becomes active
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (slide.classList.contains('active')) {
                            setTimeout(showContent, 200);
                        } else {
                            content.style.opacity = '0';
                            content.style.transform = 'translateY(20px)';
                        }
                    }
                });
            });
            
            observer.observe(slide, { attributes: true });
        }
    });
}

// Slider utility functions
function createSliderIndicators(slider, totalSlides) {
    const indicatorsContainer = slider.querySelector('.slider-indicators');
    if (!indicatorsContainer) return;
    
    // Clear existing indicators
    indicatorsContainer.innerHTML = '';
    
    // Create new indicators
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('button');
        indicator.className = 'indicator';
        indicator.setAttribute('data-slide', i);
        indicator.setAttribute('aria-label', `Slide ${i + 1}'e git`);
        indicatorsContainer.appendChild(indicator);
    }
}

function updateSliderAccessibility(slider, currentSlide, totalSlides) {
    const slides = slider.querySelectorAll('.slide');
    
    slides.forEach((slide, index) => {
        slide.setAttribute('aria-hidden', index !== currentSlide);
        slide.setAttribute('aria-label', `Slide ${index + 1} of ${totalSlides}`);
    });
    
    const activeSlide = slides[currentSlide];
    if (activeSlide) {
        activeSlide.setAttribute('aria-hidden', 'false');
    }
}

// Export slider functions
window.SliderController = {
    initSlider,
    initSliderAnimations,
    createSliderIndicators,
    updateSliderAccessibility
};
