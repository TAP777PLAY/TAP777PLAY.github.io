// Animation JavaScript for Chronicles of Olympus

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations
    initHeroAnimations();
    initScrollAnimations();
    initParallaxEffects();
    initHoverEffects();
    initTypewriterEffect();
    initShapeAnimations();
    initGameplayGallery();
});

// Hero section animations
function initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroActions = document.querySelector('.hero-actions');
    
    // Staggered animation for hero elements
    if (heroTitle) {
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 500);
    }
    
    if (heroSubtitle) {
        setTimeout(() => {
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 1000);
    }
    
    if (heroActions) {
        setTimeout(() => {
            heroActions.style.opacity = '1';
            heroActions.style.transform = 'translateY(0)';
        }, 1500);
    }
}

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animation || 'fadeInUp';
                
                element.classList.add('animate');
                
                // Add specific animation classes
                switch(animationType) {
                    case 'fadeInLeft':
                        element.classList.add('fade-in-left');
                        break;
                    case 'fadeInRight':
                        element.classList.add('fade-in-right');
                        break;
                    case 'scaleIn':
                        element.classList.add('scale-in');
                        break;
                    default:
                        element.classList.add('fade-in-up');
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation data attributes
    const animatedElements = document.querySelectorAll('[data-animation]');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Observe section elements
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.dataset.animation = 'fadeInUp';
        observer.observe(section);
    });
}

// Parallax effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-background, .shape');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    }, 16));
}

// Hover effects for interactive elements
function initHoverEffects() {
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.gameplay-item, .accordion-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(99, 255, 143, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Typewriter effect
function initTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--color-accent)';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, 100);
    });
}

// Shape animations
function initShapeAnimations() {
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        // Random floating animation
        const randomDelay = Math.random() * 2;
        const randomDuration = 3 + Math.random() * 4;
        
        shape.style.animationDelay = `${randomDelay}s`;
        shape.style.animationDuration = `${randomDuration}s`;
        
        // Add mouse interaction
        shape.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'scale(1.2)';
        });
        
        shape.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.transform = 'scale(1)';
        });
    });
}

// Gameplay gallery animations
function initGameplayGallery() {
    const galleryItems = document.querySelectorAll('.gameplay-item');
    
    galleryItems.forEach((item, index) => {
        // Staggered entrance animation
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200);
        
        // Image zoom effect on hover
        const image = item.querySelector('.gameplay-image');
        if (image) {
            item.addEventListener('mouseenter', function() {
                image.style.transform = 'scale(1.1)';
            });
            
            item.addEventListener('mouseleave', function() {
                image.style.transform = 'scale(1)';
            });
        }
    });
}

// Accordion animations
function initAccordionAnimations() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const content = item.querySelector('.accordion-content');
        const icon = item.querySelector('.accordion-icon');
        
        if (content && icon) {
            // Smooth height transition
            content.style.maxHeight = '0';
            content.style.overflow = 'hidden';
            content.style.transition = 'max-height 0.3s ease';
            
            // Icon rotation
            icon.style.transition = 'transform 0.3s ease';
        }
    });
}

// Loading animations
function initLoadingAnimations() {
    // Page load animation
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    
    window.addEventListener('load', () => {
        document.body.style.transition = 'all 0.6s ease';
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    });
}

// Particle system for hero section
function initParticleSystem() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleCount = 50;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--color-accent);
            border-radius: 50%;
            opacity: 0.6;
            pointer-events: none;
        `;
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation
        const duration = 3 + Math.random() * 4;
        const delay = Math.random() * 2;
        
        particle.style.animation = `float ${duration}s ease-in-out infinite ${delay}s`;
        
        hero.appendChild(particle);
        particles.push(particle);
    }
}

// Text reveal animations
function initTextRevealAnimations() {
    const textElements = document.querySelectorAll('h1, h2, h3, p');
    
    textElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Cursor trail effect
function initCursorTrail() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, var(--color-accent) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.6;
        transition: transform 0.1s ease;
    `;
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
}

// Initialize all animations when DOM is ready
function initAllAnimations() {
    initLoadingAnimations();
    initTextRevealAnimations();
    initParticleSystem();
    initCursorTrail();
    initAccordionAnimations();
}

// Initialize accordion animations
function initAccordionAnimations() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const content = item.querySelector('.accordion-content');
        const icon = item.querySelector('.accordion-icon');
        
        if (content && icon) {
            // Set initial state
            content.style.maxHeight = '0';
            content.style.overflow = 'hidden';
            content.style.transition = 'max-height 0.3s ease';
            
            // Icon rotation
            icon.style.transition = 'transform 0.3s ease';
        }
    });
}

// Call initialization
initAllAnimations();

// Export animation functions
window.AnimationController = {
    initHeroAnimations,
    initScrollAnimations,
    initParallaxEffects,
    initHoverEffects,
    initTypewriterEffect,
    initShapeAnimations,
    initGameplayGallery,
    initParticleSystem,
    initCursorTrail
};
