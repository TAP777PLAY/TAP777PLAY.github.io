/* ========================================
   Tests Page JavaScript - Specific Functions
   ======================================== */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeQuizCards();
    initializeModal();
    initializeLoadingModal();
    initializeScrollAnimations();
    initializeParallaxEffects();
});

// Quiz Data
const quizData = {
    'financial-basics': {
        title: 'Financial Basics Mastery',
        description: 'Master essential money management skills, budgeting, and financial planning for a secure future.',
        difficulty: 'Beginner',
        questions: '15',
        time: '20 min',
        category: 'Financial',
        image: 'images/Financial Literacy Quiz.webp'
    },
    'investment-strategies': {
        title: 'Investment Strategies',
        description: 'Learn about stocks, bonds, mutual funds, and building a diversified investment portfolio.',
        difficulty: 'Intermediate',
        questions: '20',
        time: '25 min',
        category: 'Financial',
        image: 'images/Investment Strategies Quiz.webp'
    },
    'logic-puzzles': {
        title: 'Critical Thinking Puzzles',
        description: 'Challenge your logical reasoning with brain-teasing puzzles and problem-solving scenarios.',
        difficulty: 'Intermediate',
        questions: '18',
        time: '30 min',
        category: 'Logic',
        image: 'images/Logic Puzzles Quiz.jpg'
    },
    'personal-growth': {
        title: 'Personal Growth Journey',
        description: 'Discover your strengths, set meaningful goals, and develop life skills for personal success.',
        difficulty: 'All Levels',
        questions: '12',
        time: '15 min',
        category: 'Personal',
        image: 'images/Personal Growth Quiz.jpg'
    }
};

// Filter Functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const quizCards = document.querySelectorAll('.quiz-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Get filter category
            const category = this.getAttribute('data-category');
            
            // Filter quiz cards
            filterQuizCards(category, quizCards);
        });
    });
}

function filterQuizCards(category, quizCards) {
    quizCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
            card.style.animation = 'fadeInUp 0.5s ease-out';
        } else {
            card.classList.add('hidden');
        }
    });
}

// Quiz Cards Interactions
function initializeQuizCards() {
    const quizCards = document.querySelectorAll('.quiz-card');
    
    // Add hover effects to quiz cards
    quizCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Modal Functionality
function initializeModal() {
    const modal = document.getElementById('quizModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalBegin = document.getElementById('modalBegin');
    
    // Close modal handlers
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    
    // Close modal when clicking overlay
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Begin quiz handler
    modalBegin.addEventListener('click', function() {
        const quizId = this.getAttribute('data-quiz-id');
        startQuiz(quizId);
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function openQuizModal(quizId) {
    const modal = document.getElementById('quizModal');
    const quiz = quizData[quizId];
    
    if (!quiz) return;
    
    // Update modal content
    document.getElementById('modalTitle').textContent = 'Quiz Preview';
    document.getElementById('modalQuizTitle').textContent = quiz.title;
    document.getElementById('modalDescription').textContent = quiz.description;
    document.getElementById('modalDifficulty').textContent = quiz.difficulty;
    document.getElementById('modalQuestions').textContent = quiz.questions;
    document.getElementById('modalTime').textContent = quiz.time;
    document.getElementById('modalCategory').textContent = quiz.category;
    document.getElementById('modalImage').src = quiz.image;
    
    // Set quiz ID for begin button
    document.getElementById('modalBegin').setAttribute('data-quiz-id', quizId);
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('quizModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Loading Modal
function initializeLoadingModal() {
    // This will be called when starting a quiz
}

function showLoadingModal() {
    const loadingModal = document.getElementById('loadingModal');
    loadingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideLoadingModal() {
    const loadingModal = document.getElementById('loadingModal');
    loadingModal.classList.remove('active');
    document.body.style.overflow = '';
}

function startQuiz(quizId) {
    // Close preview modal
    closeModal();
    
    // Show loading modal
    showLoadingModal();
    
    // Simulate quiz preparation
    setTimeout(() => {
        hideLoadingModal();
        
        // Here you would normally redirect to the actual quiz page
        // For now, we'll show an alert
        alert(`Starting quiz: ${quizData[quizId].title}\n\nThis would normally redirect to the quiz interface.`);
        
        // In a real application, you would do:
        // window.location.href = `quiz.html?id=${quizId}`;
    }, 3000);
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
    const animatedElements = document.querySelectorAll('.quiz-card, .filter-btn');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
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
    const buttons = document.querySelectorAll('.btn, .filter-btn');
    
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
    
    .quiz-card,
    .filter-btn {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .quiz-card.animate-in,
    .filter-btn.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .quiz-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .quiz-card:hover {
        transform: translateY(-8px) scale(1.02);
    }
    
    .filter-btn {
        transition: all 0.3s ease;
    }
    
    .filter-btn:hover {
        transform: translateY(-2px);
    }
    
    .start-quiz-btn {
        transition: all 0.3s ease;
    }
    
    .start-quiz-btn:hover {
        transform: translateY(-2px);
    }
    
    /* Modal animations */
    .modal-overlay {
        transition: all 0.3s ease;
    }
    
    .modal-content {
        transition: all 0.3s ease;
    }
    
    /* Loading spinner animation */
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Progress bar animation */
    @keyframes progress {
        0% { width: 0%; }
        50% { width: 70%; }
        100% { width: 100%; }
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

// URL parameter handling for category filtering
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        const filterButton = document.querySelector(`[data-category="${category}"]`);
        if (filterButton) {
            filterButton.click();
        }
    }
}

// Initialize URL parameter handling
document.addEventListener('DOMContentLoaded', handleURLParameters);
