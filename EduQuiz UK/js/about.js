/* ========================================
   About Page JavaScript - Specific Functions
   ======================================== */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAccordion();
    initializeCountUpAnimations();
    initializeScrollAnimations();
    initializeTeamCards();
    initializeParallaxEffects();
});

// Accordion Functionality
function initializeAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', function() {
            // Close all other accordion items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Count Up Animation for Numbers
function initializeCountUpAnimations() {
    const countUpElements = document.querySelectorAll('.stat-number[data-target]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-target'));
                animateCountUp(element, target);
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    countUpElements.forEach(element => {
        observer.observe(element);
    });
}

function animateCountUp(element, target) {
    const duration = 2000; // 2 seconds
    const start = performance.now();
    const startValue = 0;
    
    function updateCount(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCount);
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.accordion-item, .team-card, .stat-card');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// Team Cards Interactions
function initializeTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Add click handler for mobile devices
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const inner = this.querySelector('.team-card-inner');
                inner.style.transform = inner.style.transform === 'rotateY(180deg)' ? 'rotateY(0deg)' : 'rotateY(180deg)';
            }
        });
    });
}

// Parallax Effects
function initializeParallaxEffects() {
    const decorations = document.querySelectorAll('.decoration');
    
    if (decorations.length === 0) return;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        decorations.forEach((decoration, index) => {
            const speed = 0.2 + (index * 0.1);
            decoration.style.transform = `translateY(${rate * speed}px)`;
        });
    }
    
    // Throttled scroll handler
    const throttledParallax = throttle(updateParallax, 16);
    window.addEventListener('scroll', throttledParallax);
}

// Enhanced Button Interactions
function initializeButtonEffects() {
    const buttons = document.querySelectorAll('.btn, .accordion-header');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
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
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-stats');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in-up');
            }, index * 200);
        });
    });
}

// Initialize loading animation
initializeLoadingAnimation();

// Add CSS for scroll animations and loading states
const style = document.createElement('style');
style.textContent = `
    .loading {
        overflow: hidden;
    }
    
    .loading .hero-title,
    .loading .hero-subtitle,
    .loading .hero-stats {
        opacity: 0;
        transform: translateY(30px);
    }
    
    .fade-in-up {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: all 0.6s ease;
    }
    
    .accordion-item,
    .team-card,
    .stat-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .accordion-item.animate-in,
    .team-card.animate-in,
    .stat-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .team-card {
        transition: transform 0.3s ease;
    }
    
    .team-card:hover {
        transform: scale(1.02);
    }
    
    .stat-card {
        cursor: pointer;
    }
    
    .stat-card:hover {
        transform: translateY(-5px) scale(1.02);
    }
    
    /* Mobile team card interactions */
    @media (max-width: 768px) {
        .team-card {
            cursor: pointer;
        }
        
        .team-card .team-card-inner {
            transition: transform 0.6s ease;
        }
    }
`;
document.head.appendChild(style);

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

// Smooth scrolling for internal links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize smooth scrolling
document.addEventListener('DOMContentLoaded', initializeSmoothScrolling);
