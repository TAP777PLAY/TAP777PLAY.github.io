// About Page Enhancements JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all enhancements
    initProgressCounters();
    initTestimonialSlider();
    initAnimationObserver();
    initMilestoneAnimations();
});

// Animated Progress Counters
function initProgressCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + '%';
        }, 16);
    };
    
    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        counterObserver.observe(stat);
    });
}

// Testimonial Slider
function initTestimonialSlider() {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.querySelector('.testimonial-btn.prev-btn');
    const nextBtn = document.querySelector('.testimonial-btn.next-btn');
    let currentIndex = 0;
    
    if (testimonialItems.length === 0) return;
    
    const showTestimonial = (index) => {
        testimonialItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    };
    
    const nextTestimonial = () => {
        currentIndex = (currentIndex + 1) % testimonialItems.length;
        showTestimonial(currentIndex);
    };
    
    const prevTestimonial = () => {
        currentIndex = (currentIndex - 1 + testimonialItems.length) % testimonialItems.length;
        showTestimonial(currentIndex);
    };
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
    if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
    
    // Auto-advance testimonials every 5 seconds
    setInterval(nextTestimonial, 5000);
    
    // Initialize first testimonial
    showTestimonial(0);
}

// Animation Observer
function initAnimationObserver() {
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.getAttribute('data-animation');
                
                // Add visible class based on animation type
                switch(animationType) {
                    case 'fadeInLeft':
                        element.classList.add('fade-in-left', 'visible');
                        break;
                    case 'fadeInRight':
                        element.classList.add('fade-in-right', 'visible');
                        break;
                    case 'fadeInUp':
                        element.classList.add('fade-in-up', 'visible');
                        break;
                }
                
                animationObserver.unobserve(element);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

// Milestone Animations
function initMilestoneAnimations() {
    const milestones = document.querySelectorAll('.milestone');
    
    const milestoneObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation of milestones
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 200); // 200ms delay between each milestone
                
                milestoneObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    milestones.forEach(milestone => {
        milestoneObserver.observe(milestone);
    });
}

// Team Member Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Skill Tag Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.background = 'rgba(99, 255, 143, 0.2)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.background = 'rgba(99, 255, 143, 0.1)';
        });
    });
});

// Progress Bar Animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.stat-fill');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 500);
                
                progressObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// Initialize progress bar animations
document.addEventListener('DOMContentLoaded', animateProgressBars);

// Parallax Effect for Hero Section
function initParallaxEffect() {
    const heroSection = document.querySelector('.page-hero');
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
}

// Initialize parallax effect
document.addEventListener('DOMContentLoaded', initParallaxEffect);

// Smooth Scrolling for Internal Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize smooth scrolling
document.addEventListener('DOMContentLoaded', initSmoothScrolling);

// Loading Animation
function initLoadingAnimation() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Olimpos Kronikleri Yükleniyor...</p>
        </div>
    `;
    
    document.body.appendChild(loadingOverlay);
    
    // Remove loading overlay when page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.remove();
            }, 500);
        }, 1000);
    });
}

// Initialize loading animation
document.addEventListener('DOMContentLoaded', initLoadingAnimation);
