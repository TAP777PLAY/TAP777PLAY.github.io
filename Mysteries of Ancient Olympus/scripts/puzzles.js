// ===== PUZZLES PAGE INTERACTIVE FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all puzzle interactions
    initializePuzzleAccordions();
    initializeFlipCards();
    initializeAnswerButtons();
    initializeAnimations();
});

// ===== ACCORDION FUNCTIONALITY =====
function initializePuzzleAccordions() {
    const accordions = document.querySelectorAll('.puzzle-accordion');
    
    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        const content = accordion.querySelector('.accordion-content');
        const arrow = accordion.querySelector('.accordion-arrow');
        
        header.addEventListener('click', function() {
            const isActive = content.classList.contains('active');
            
            // Close all other accordions
            accordions.forEach(otherAccordion => {
                if (otherAccordion !== accordion) {
                    otherAccordion.querySelector('.accordion-content').classList.remove('active');
                    otherAccordion.querySelector('.accordion-arrow').style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current accordion
            if (isActive) {
                content.classList.remove('active');
                arrow.style.transform = 'rotate(0deg)';
            } else {
                content.classList.add('active');
                arrow.style.transform = 'rotate(180deg)';
            }
        });
    });
}

// ===== FLIP CARDS FUNCTIONALITY =====
function initializeFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    
    flipCards.forEach(card => {
        const inner = card.querySelector('.flip-card-inner');
        
        // Add click event for mobile devices
        card.addEventListener('click', function() {
            if (inner.style.transform === 'rotateY(180deg)') {
                inner.style.transform = 'rotateY(0deg)';
            } else {
                inner.style.transform = 'rotateY(180deg)';
            }
        });
        
        // Add hover effect for desktop
        card.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                inner.style.transform = 'rotateY(180deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                inner.style.transform = 'rotateY(0deg)';
            }
        });
    });
}

// ===== ANSWER BUTTONS FUNCTIONALITY =====
function initializeAnswerButtons() {
    // Regular answer buttons in accordions
    const showAnswerBtns = document.querySelectorAll('.show-answer-btn');
    
    showAnswerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const answerContent = this.nextElementSibling;
            const isHidden = answerContent.classList.contains('hidden');
            
            if (isHidden) {
                answerContent.classList.remove('hidden');
                this.textContent = 'Hide Answer';
                this.style.background = 'linear-gradient(135deg, var(--color-bronze), #B8860B)';
            } else {
                answerContent.classList.add('hidden');
                this.textContent = 'Show Answer';
                this.style.background = 'linear-gradient(135deg, var(--color-gold), #FFD700)';
            }
        });
    });
    
    // Flip card answer buttons
    const flipAnswerBtns = document.querySelectorAll('.flip-answer-btn');
    
    flipAnswerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const flipAnswer = this.nextElementSibling;
            const isHidden = flipAnswer.classList.contains('hidden');
            
            if (isHidden) {
                flipAnswer.classList.remove('hidden');
                this.textContent = 'Hide Answer';
                this.style.background = 'var(--color-bronze)';
            } else {
                flipAnswer.classList.add('hidden');
                this.textContent = 'Show Answer';
                this.style.background = 'var(--color-gold)';
            }
        });
    });
}

// ===== ANIMATION EFFECTS =====
function initializeAnimations() {
    // Staggered animation for puzzle accordions
    const puzzleAccordions = document.querySelectorAll('.puzzle-accordion');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${Array.from(puzzleAccordions).indexOf(entry.target) * 0.1}s`;
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    puzzleAccordions.forEach(accordion => {
        observer.observe(accordion);
    });
    
    // Animate flip cards on scroll
    const flipCards = document.querySelectorAll('.flip-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${Array.from(flipCards).indexOf(entry.target) * 0.1}s`;
                entry.target.classList.add('animate-in');
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    flipCards.forEach(card => {
        cardObserver.observe(card);
    });
    
    // Add floating animation to hero image
    const heroImage = document.querySelector('.puzzles-hero-img');
    if (heroImage) {
        setInterval(() => {
            heroImage.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                heroImage.style.transform = 'translateY(0px)';
            }, 2000);
        }, 4000);
    }
}

// ===== PUZZLE PROGRESS TRACKING =====
function trackPuzzleProgress() {
    const completedPuzzles = JSON.parse(localStorage.getItem('completedPuzzles') || '[]');
    
    // Mark puzzle as completed when answer is shown
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('show-answer-btn') || e.target.classList.contains('flip-answer-btn')) {
            const puzzleId = e.target.closest('.puzzle-accordion, .flip-card').dataset.puzzle || 
                           e.target.closest('.flip-card').dataset.card;
            
            if (puzzleId && !completedPuzzles.includes(puzzleId)) {
                completedPuzzles.push(puzzleId);
                localStorage.setItem('completedPuzzles', JSON.stringify(completedPuzzles));
                
                // Show completion animation
                showCompletionAnimation(e.target);
            }
        }
    });
}

function showCompletionAnimation(element) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'absolute';
    sparkle.style.fontSize = '24px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '1000';
    sparkle.style.animation = 'sparkleAnimation 1s ease-out forwards';
    
    const rect = element.getBoundingClientRect();
    sparkle.style.left = rect.left + rect.width / 2 + 'px';
    sparkle.style.top = rect.top + rect.height / 2 + 'px';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        document.body.removeChild(sparkle);
    }, 1000);
}

// ===== KEYBOARD NAVIGATION =====
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Allow Enter key to activate accordions and flip cards
        if (e.key === 'Enter') {
            const activeElement = document.activeElement;
            
            if (activeElement.classList.contains('accordion-header')) {
                activeElement.click();
            } else if (activeElement.classList.contains('flip-card')) {
                activeElement.click();
            }
        }
        
        // Allow Escape to close modals
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.active');
            if (openModal) {
                openModal.classList.remove('active');
            }
        }
    });
}

// ===== RESPONSIVE BEHAVIOR =====
function handleResponsiveBehavior() {
    const flipCards = document.querySelectorAll('.flip-card');
    
    function updateFlipCardBehavior() {
        flipCards.forEach(card => {
            const inner = card.querySelector('.flip-card-inner');
            
            if (window.innerWidth <= 768) {
                // Mobile: click to flip
                card.style.cursor = 'pointer';
                inner.style.transition = 'transform 0.6s';
            } else {
                // Desktop: hover to flip
                card.style.cursor = 'default';
                inner.style.transition = 'transform 0.6s';
            }
        });
    }
    
    window.addEventListener('resize', updateFlipCardBehavior);
    updateFlipCardBehavior();
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function enhanceAccessibility() {
    // Add ARIA labels to interactive elements
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-expanded', 'false');
        
        header.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    });
    
    // Add ARIA labels to flip cards
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Flip card to reveal puzzle');
    });
    
    // Announce puzzle completions to screen readers
    const answerButtons = document.querySelectorAll('.show-answer-btn, .flip-answer-btn');
    answerButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const puzzleName = this.closest('.puzzle-accordion, .flip-card').querySelector('.puzzle-name, h3').textContent;
            const announcement = `Puzzle ${puzzleName} answer revealed`;
            
            // Create temporary announcement element
            const announcementEl = document.createElement('div');
            announcementEl.setAttribute('aria-live', 'polite');
            announcementEl.setAttribute('aria-atomic', 'true');
            announcementEl.style.position = 'absolute';
            announcementEl.style.left = '-10000px';
            announcementEl.style.width = '1px';
            announcementEl.style.height = '1px';
            announcementEl.style.overflow = 'hidden';
            announcementEl.textContent = announcement;
            
            document.body.appendChild(announcementEl);
            setTimeout(() => document.body.removeChild(announcementEl), 1000);
        });
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    trackPuzzleProgress();
    initializeKeyboardNavigation();
    handleResponsiveBehavior();
    enhanceAccessibility();
    
    // Add CSS for sparkle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleAnimation {
            0% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(0.5);
            }
            50% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.2);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(1.5);
            }
        }
    `;
    document.head.appendChild(style);
});

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
