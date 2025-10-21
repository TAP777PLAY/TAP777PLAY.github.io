// Experts Page JavaScript - Interactive Gallery and Quote Animations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all experts page functionality
    initQuoteCarousel();
    initExpertAccordion();
    initScrollAnimations();
    initExpertGallery();
    initExpertInteractions();
});

// Quote carousel functionality with smooth animations
function initQuoteCarousel() {
    const opinionCards = document.querySelectorAll('.opinion-card');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.opinion-prev');
    const nextBtn = document.querySelector('.opinion-next');
    
    let currentSlide = 0;
    const totalSlides = opinionCards.length;
    
    // Auto-rotate quotes every 5 seconds
    let autoRotateInterval = setInterval(() => {
        nextSlide();
    }, 5000);
    
    function showSlide(index) {
        // Remove active class from all cards and indicators
        opinionCards.forEach(card => card.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide
        opinionCards[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
        
        // Track slide change
        trackEvent('quote_slide_changed', {
            slide_index: index,
            expert_name: opinionCards[index].querySelector('h4').textContent
        });
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        showSlide(nextIndex);
    }
    
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prevIndex);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoRotate();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoRotate();
    });
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            resetAutoRotate();
        });
    });
    
    // Pause auto-rotate on hover
    const carousel = document.querySelector('.opinion-carousel');
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoRotateInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        resetAutoRotate();
    });
    
    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoRotate();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoRotate();
        }
    });
}

// Expert accordion functionality
function initExpertAccordion() {
    const topicItems = document.querySelectorAll('.topic-item');
    
    topicItems.forEach(item => {
        const header = item.querySelector('.topic-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other topic items
            topicItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
            
            // Track accordion interaction
            trackEvent('topic_accordion_toggled', {
                topic: item.querySelector('h3').textContent,
                action: !isActive ? 'open' : 'close'
            });
        });
    });
}

// Scroll animations for experts page
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Special handling for expert cards with staggered animation
                if (entry.target.classList.contains('expert-card')) {
                    const cards = entry.target.parentElement.querySelectorAll('.expert-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, index * 200);
                    });
                }
                
                // Handle principle items
                if (entry.target.classList.contains('principle-item')) {
                    const items = entry.target.parentElement.querySelectorAll('.principle-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.intro-text, .intro-image, .expert-card, .principle-item'
    );
    
    animatedElements.forEach(el => {
        // Set initial state for principle items
        if (el.classList.contains('principle-item')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease';
        }
        observer.observe(el);
    });
}

// Expert gallery interactions
function initExpertGallery() {
    const expertCards = document.querySelectorAll('.expert-card');
    
    expertCards.forEach(card => {
        // Modern hover effects are now handled by CSS
        // This function is kept for potential future enhancements
        
        // Add click handler for expert details
        card.addEventListener('click', () => {
            const expertName = card.querySelector('.expert-name').textContent;
            const expertTitle = card.querySelector('.expert-title').textContent;
            
            showExpertModal(expertName, expertTitle, card);
            
            // Track expert card click
            trackEvent('expert_card_clicked', {
                expert_name: expertName,
                expert_title: expertTitle
            });
        });
    });
}

// Show expert modal with detailed information
function showExpertModal(name, title, card) {
    const modal = document.createElement('div');
    modal.className = 'expert-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${name}</h3>
                <p>${title}</p>
            </div>
            <div class="modal-body">
                <div class="modal-image">
                    ${card.querySelector('.expert-image').innerHTML}
                </div>
                <div class="modal-details">
                    <div class="modal-bio">
                        <h4>Biography</h4>
                        <p>${card.querySelector('.expert-bio').textContent}</p>
                    </div>
                    <div class="modal-specialties">
                        <h4>Specialties</h4>
                        <div class="specialties-list">
                            ${card.querySelector('.expert-specialties').innerHTML}
                        </div>
                    </div>
                    <div class="modal-stats">
                        <h4>Experience</h4>
                        <div class="stats-grid">
                            ${card.querySelector('.expert-stats').innerHTML}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .expert-modal .modal-content {
            background: white;
            border-radius: var(--radius-large);
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            margin: var(--spacing-md);
            box-shadow: var(--shadow-medium);
            animation: slideInUp 0.3s ease;
        }
        
        .expert-modal .modal-header {
            padding: var(--spacing-xl);
            border-bottom: 1px solid var(--border);
            position: relative;
        }
        
        
        .expert-modal .modal-body {
            padding: var(--spacing-xl);
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: var(--spacing-lg);
        }
        
        .expert-modal .modal-image {
            height: 200px;
            overflow: hidden;
            border-radius: var(--radius-medium);
        }
        
        .expert-modal .modal-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .expert-modal .modal-details h4 {
            color: var(--text-primary);
            margin-bottom: var(--spacing-md);
        }
        
        .expert-modal .modal-details p {
            color: var(--text-secondary);
            line-height: var(--line-height-relaxed);
            margin-bottom: var(--spacing-lg);
        }
        
        
        @media (max-width: 768px) {
            .expert-modal .modal-body {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Animate modal appearance
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    
    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
                style.remove();
            }, 300);
        }
    });
}

// Expert interactions and tracking
function initExpertInteractions() {
    // Track social link clicks
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = link.textContent;
            const expertCard = link.closest('.expert-card');
            const expertName = expertCard.querySelector('.expert-name').textContent;
            
            trackEvent('expert_social_clicked', {
                expert_name: expertName,
                platform: platform
            });
            
            // Show coming soon message
            showNotification(`${platform} profile for ${expertName} coming soon!`);
        });
    });
    
    // Track specialty clicks
    const specialties = document.querySelectorAll('.specialty');
    specialties.forEach(specialty => {
        specialty.addEventListener('click', (e) => {
            e.stopPropagation();
            const specialtyText = specialty.textContent;
            const expertCard = specialty.closest('.expert-card');
            const expertName = expertCard.querySelector('.expert-name').textContent;
            
            trackEvent('expert_specialty_clicked', {
                expert_name: expertName,
                specialty: specialtyText
            });
            
            // Highlight specialty
            specialty.style.backgroundColor = 'var(--accent)';
            specialty.style.color = 'white';
            
            setTimeout(() => {
                specialty.style.backgroundColor = '';
                specialty.style.color = '';
            }, 2000);
        });
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent);
        color: white;
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--radius-medium);
        box-shadow: var(--shadow-medium);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Enhanced tracking for experts page
function trackEvent(eventName, properties = {}) {
    const analyticsData = {
        page: 'experts',
        timestamp: new Date().toISOString(),
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        ...properties
    };
    
    console.log('Experts Event:', eventName, analyticsData);
    
    // Store in localStorage for debugging
    const events = JSON.parse(localStorage.getItem('experts_events') || '[]');
    events.push({ event: eventName, data: analyticsData });
    localStorage.setItem('experts_events', JSON.stringify(events));
}

// Expert search functionality (bonus feature)
function initExpertSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search experts by name or specialty...';
    searchInput.className = 'expert-search';
    searchInput.style.cssText = `
        width: 100%;
        max-width: 400px;
        padding: var(--spacing-md);
        border: 2px solid var(--border);
        border-radius: var(--radius-pill);
        font-size: var(--font-size-md);
        margin-bottom: var(--spacing-xl);
    `;
    
    const gallerySection = document.querySelector('.expert-gallery .container');
    const title = gallerySection.querySelector('.section-title');
    title.parentNode.insertBefore(searchInput, title.nextSibling);
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const expertCards = document.querySelectorAll('.expert-card');
        
        expertCards.forEach(card => {
            const name = card.querySelector('.expert-name').textContent.toLowerCase();
            const title = card.querySelector('.expert-title').textContent.toLowerCase();
            const bio = card.querySelector('.expert-bio').textContent.toLowerCase();
            const specialties = Array.from(card.querySelectorAll('.specialty')).map(s => s.textContent.toLowerCase()).join(' ');
            
            const matches = name.includes(searchTerm) || 
                          title.includes(searchTerm) || 
                          bio.includes(searchTerm) || 
                          specialties.includes(searchTerm);
            
            card.style.display = matches ? 'block' : 'none';
        });
        
        trackEvent('expert_search', {
            search_term: searchTerm,
            results_count: document.querySelectorAll('.expert-card[style*="block"]').length
        });
    });
}

// Initialize expert search
initExpertSearch();

// Performance monitoring for experts page
function initExpertsPerformanceMonitoring() {
    // Monitor quote carousel performance
    const carousel = document.querySelector('.opinion-carousel');
    if (carousel) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const startTime = performance.now();
                    
                    // Simulate carousel initialization time
                    setTimeout(() => {
                        const initTime = performance.now() - startTime;
                        
                        trackEvent('carousel_performance', {
                            initialization_time: initTime
                        });
                    }, 100);
                }
            });
        });
        
        observer.observe(carousel);
    }
}

// Initialize performance monitoring
initExpertsPerformanceMonitoring();

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initQuoteCarousel,
        initExpertAccordion,
        initScrollAnimations,
        trackEvent
    };
}
