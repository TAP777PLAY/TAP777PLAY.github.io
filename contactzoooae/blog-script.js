// Blog Page Interactive Elements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Topic Filters
    initializeTopicFilters();
    
    // Initialize Article Accordions
    initializeArticleAccordions();
    
    // Initialize Popular Posts Slider
    initializePopularSlider();
    
    // Initialize Newsletter Form
    initializeNewsletterForm();
    
    // Initialize Animations
    initializeAnimations();
});

// Topic Filter Functionality
function initializeTopicFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const articleCards = document.querySelectorAll('.article-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Add loading state
            this.classList.add('loading');
            
            // Filter articles with animation
            setTimeout(() => {
                filterArticles(filter, articleCards);
                this.classList.remove('loading');
            }, 300);
        });
    });
}

function filterArticles(filter, articleCards) {
    articleCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
            card.classList.remove('hidden', 'filtering');
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        } else {
            card.classList.add('filtering');
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.classList.add('hidden');
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Article Accordion Functionality
function initializeArticleAccordions() {
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        const accordionHeader = card.querySelector('.accordion-header');
        
        if (accordionHeader) {
            accordionHeader.addEventListener('click', function() {
                const isActive = card.classList.contains('active');
                
                // Close all other accordions
                articleCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('active');
                    }
                });
                
                // Toggle current accordion
                if (isActive) {
                    card.classList.remove('active');
                } else {
                    card.classList.add('active');
                }
            });
            
            // Add keyboard support
            accordionHeader.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    accordionHeader.click();
                }
            });
            
            // Make focusable
            accordionHeader.setAttribute('tabindex', '0');
            accordionHeader.setAttribute('role', 'button');
            accordionHeader.setAttribute('aria-expanded', 'false');
            
            // Update aria-expanded when toggled
            accordionHeader.addEventListener('click', function() {
                const isActive = card.classList.contains('active');
                this.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            });
        }
    });
}

// Popular Posts Slider
function initializePopularSlider() {
    const sliderTrack = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const posts = document.querySelectorAll('.popular-post');
    
    if (!sliderTrack || !posts.length) return;
    
    let currentIndex = 0;
    const postsPerView = getPostsPerView();
    const maxIndex = Math.max(0, posts.length - postsPerView);
    
    function getPostsPerView() {
        const containerWidth = sliderTrack.parentElement.offsetWidth;
        const postWidth = 300; // min-width from CSS
        const gap = 16; // gap from CSS
        return Math.floor((containerWidth + gap) / (postWidth + gap));
    }
    
    function updateSlider() {
        const translateX = -currentIndex * (300 + 16); // post width + gap
        sliderTrack.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }
    
    function nextSlide() {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Auto-slide every 5 seconds
    setInterval(() => {
        if (currentIndex >= maxIndex) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        updateSlider();
    }, 5000);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const newPostsPerView = getPostsPerView();
        const newMaxIndex = Math.max(0, posts.length - newPostsPerView);
        
        if (currentIndex > newMaxIndex) {
            currentIndex = newMaxIndex;
        }
        
        updateSlider();
    });
    
    // Initialize slider
    updateSlider();
}

// Newsletter Form Functionality
function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('#newsletterEmail').value;
            const agreement = this.querySelector('#newsletterAgreement').checked;
            
            // Validate form
            if (!email) {
                showNotification('Please enter your email address', 'error');
                return;
            }
            
            if (!agreement) {
                showNotification('Please agree to receive newsletters', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Successfully subscribed to our newsletter!', 'success');
                newsletterForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
        
        // Real-time email validation
        const emailInput = newsletterForm.querySelector('#newsletterEmail');
        emailInput.addEventListener('blur', function() {
            validateEmailField(this);
        });
        
        emailInput.addEventListener('input', function() {
            clearFieldError(this);
        });
    }
}

// Email validation
function validateEmailField(field) {
    const value = field.value.trim();
    clearFieldError(field);
    
    if (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.style.borderColor = '#FF6B6B';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #FF6B6B;
        font-size: 12px;
        margin-top: 4px;
        font-family: 'Poppins', sans-serif;
    `;
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Animation Initialization
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe elements for fade-in animation
    const animatedElements = document.querySelectorAll(
        '.article-card, .popular-post, .video-card'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-in-out';
        fadeObserver.observe(el);
    });
    
    // Stagger animation for article cards
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00C9FF' : type === 'error' ? '#FF6B6B' : '#7B2FF7'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add animation styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Enhanced Article Card Interactions
document.addEventListener('DOMContentLoaded', function() {
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(123, 47, 247, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            }
        });
        
        // Click to expand
        const image = card.querySelector('.article-image');
        if (image) {
            image.addEventListener('click', function() {
                const accordionHeader = card.querySelector('.accordion-header');
                if (accordionHeader) {
                    accordionHeader.click();
                }
            });
        }
    });
});

// Video Card Interactions
document.addEventListener('DOMContentLoaded', function() {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(123, 47, 247, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
});

// Popular Post Interactions
document.addEventListener('DOMContentLoaded', function() {
    const popularPosts = document.querySelectorAll('.popular-post');
    
    popularPosts.forEach(post => {
        post.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(123, 47, 247, 0.3)';
        });
        
        post.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
});

// Search functionality (if needed)
function addSearchFunctionality() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search articles...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        padding: 8px 16px;
        background: #1A033B;
        color: var(--text-primary);
        border: 1px solid var(--primary);
        border-radius: var(--radius-sm);
        font-family: inherit;
        margin-bottom: var(--spacing-lg);
    `;
    
    const filtersContainer = document.querySelector('.filters-container');
    if (filtersContainer) {
        filtersContainer.appendChild(searchInput);
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const articleCards = document.querySelectorAll('.article-card');
            
            articleCards.forEach(card => {
                const title = card.querySelector('.article-title').textContent.toLowerCase();
                const excerpt = card.querySelector('.article-excerpt').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', function() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
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
});

// Performance optimization: Throttle scroll events
let ticking = false;

function updateOnScroll() {
    // Add any scroll-based animations here
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);
