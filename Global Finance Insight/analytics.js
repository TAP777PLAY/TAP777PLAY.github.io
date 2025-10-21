// Analytics Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize analytics page functionality
    initAnalyticsScrollAnimations();
    initAnalyticsAccordion();
    initLoadingDemo();
    initCardFiltering();
    initPriorityIndicators();
});

// Enhanced scroll animations for analytics page
function initAnalyticsScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Special handling for material cards with staggered animation
                if (entry.target.classList.contains('material-card')) {
                    const cards = entry.target.parentElement.querySelectorAll('.material-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, index * 150);
                    });
                }
                
                // Handle methodology items
                if (entry.target.classList.contains('method-item')) {
                    const items = entry.target.parentElement.querySelectorAll('.method-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.intro-text, .intro-image, .material-card, .method-item, .direction-item'
    );
    
    animatedElements.forEach(el => {
        // Set initial state for method items
        if (el.classList.contains('method-item')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease';
        }
        observer.observe(el);
    });
}

// Analytics accordion functionality
function initAnalyticsAccordion() {
    const directionItems = document.querySelectorAll('.direction-item');
    
    directionItems.forEach(item => {
        const header = item.querySelector('.direction-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other direction items
            directionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
            
            // Track analytics event
            trackEvent('analytics_direction_toggle', {
                direction: item.querySelector('h3').textContent,
                action: !isActive ? 'open' : 'close'
            });
        });
    });
}

// Loading demo functionality
function initLoadingDemo() {
    const loadMoreBtn = document.getElementById('loadMoreCards');
    const resetBtn = document.getElementById('resetCards');
    const dynamicContainer = document.getElementById('dynamicCards');
    
    let cardCount = 0;
    const maxCards = 6;
    
    const sampleCards = [
        {
            title: "UAE Banking Sector Analysis",
            description: "Comprehensive review of banking performance and digital transformation trends.",
            category: "Banking",
            priority: "High"
        },
        {
            title: "GCC Real Estate Market Outlook",
            description: "Analysis of property market trends across GCC countries.",
            category: "Real Estate",
            priority: "Medium"
        },
        {
            title: "Digital Currency Regulations",
            description: "Latest developments in cryptocurrency regulatory framework.",
            category: "Digital Assets",
            priority: "High"
        },
        {
            title: "Energy Sector Investment Trends",
            description: "Renewable energy investment opportunities in the region.",
            category: "Energy",
            priority: "Medium"
        },
        {
            title: "Fintech Innovation Report",
            description: "Emerging financial technology solutions and market impact.",
            category: "Technology",
            priority: "Low"
        },
        {
            title: "Trade Policy Analysis",
            description: "Impact of international trade agreements on regional economy.",
            category: "Trade",
            priority: "Medium"
        }
    ];
    
    function createLoadingCard(cardData, index) {
        const card = document.createElement('div');
        card.className = 'loading-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Add click tracking
        card.addEventListener('click', () => {
            trackEvent('analytics_card_clicked', {
                title: cardData.title,
                category: cardData.category,
                priority: cardData.priority
            });
        });
        
        card.innerHTML = `
            <h3>${cardData.title}</h3>
            <p>${cardData.description}</p>
        `;
        
        return card;
    }
    
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--accent) 0%, #4E6C8F 100%);
            color: white;
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--radius-medium);
            box-shadow: 0 8px 25px rgba(92, 123, 160, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            font-weight: var(--font-weight-medium);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    function showLoadingSkeleton() {
        const skeleton = document.createElement('div');
        skeleton.className = 'loading-skeleton';
        skeleton.style.cssText = `
            height: 200px;
            border-radius: var(--radius-medium);
            margin-bottom: var(--spacing-lg);
        `;
        
        dynamicContainer.appendChild(skeleton);
        
        // Remove skeleton after animation
        setTimeout(() => {
            if (skeleton.parentNode) {
                skeleton.parentNode.removeChild(skeleton);
            }
        }, 1500);
    }
    
    loadMoreBtn.addEventListener('click', () => {
        if (cardCount >= maxCards) {
            loadMoreBtn.textContent = 'No More Cards';
            loadMoreBtn.disabled = true;
            return;
        }
        
        // Show loading skeleton
        showLoadingSkeleton();
        
        // Simulate loading delay
        setTimeout(() => {
            const cardsToAdd = Math.min(2, maxCards - cardCount);
            
            for (let i = 0; i < cardsToAdd; i++) {
                const cardData = sampleCards[cardCount % sampleCards.length];
                const card = createLoadingCard(cardData, cardCount);
                dynamicContainer.appendChild(card);
                cardCount++;
            }
            
            // Update button text
            if (cardCount >= maxCards) {
                loadMoreBtn.textContent = 'All Cards Loaded';
                loadMoreBtn.disabled = true;
            }
            
            // Track loading event
            trackEvent('analytics_cards_loaded', {
                cards_loaded: cardsToAdd,
                total_cards: cardCount
            });
            
        }, 1500);
    });
    
    resetBtn.addEventListener('click', () => {
        // Clear all cards
        dynamicContainer.innerHTML = '';
        cardCount = 0;
        
        // Reset button
        loadMoreBtn.textContent = 'Load More Analysis';
        loadMoreBtn.disabled = false;
        
        // Track reset event
        trackEvent('analytics_cards_reset');
    });
}

// Card filtering functionality
function initCardFiltering() {
    const cards = document.querySelectorAll('.material-card');
    
    // Add filter buttons (if needed in future)
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            cards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Track filtering event
            trackEvent('analytics_cards_filtered', {
                category: category
            });
        });
    });
}

// Priority indicators functionality
function initPriorityIndicators() {
    const priorityElements = document.querySelectorAll('.card-priority');
    
    priorityElements.forEach(element => {
        const priority = element.textContent.toLowerCase();
        
        // Add data attribute for CSS styling
        element.setAttribute('data-priority', priority);
        
        // Add tooltip functionality
        element.addEventListener('mouseenter', () => {
            const tooltip = document.createElement('div');
            tooltip.className = 'priority-tooltip';
            tooltip.textContent = getPriorityDescription(priority);
            tooltip.style.cssText = `
                position: absolute;
                background: var(--text-primary);
                color: white;
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--radius-small);
                font-size: var(--font-size-xs);
                z-index: 1000;
                pointer-events: none;
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - 30) + 'px';
        });
        
        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.priority-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

function getPriorityDescription(priority) {
    const descriptions = {
        'high priority': 'Urgent analysis - immediate attention required',
        'medium priority': 'Important analysis - review within 24 hours',
        'low priority': 'Informational analysis - review when convenient'
    };
    
    return descriptions[priority] || 'Priority level indicator';
}

// Enhanced analytics tracking
function trackAnalyticsEvent(eventName, properties = {}) {
    // Enhanced tracking for analytics page
    const analyticsData = {
        page: 'analytics',
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        ...properties
    };
    
    // Send to analytics service (placeholder)
    console.log('Analytics Event:', eventName, analyticsData);
    
    // Store in localStorage for debugging
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push({ event: eventName, data: analyticsData });
    localStorage.setItem('analytics_events', JSON.stringify(events));
}

// Card interaction tracking
function initCardInteractionTracking() {
    const cards = document.querySelectorAll('.material-card');
    
    cards.forEach(card => {
        const cardLink = card.querySelector('.card-link');
        
        if (cardLink) {
            cardLink.addEventListener('click', (e) => {
                const cardTitle = card.querySelector('.card-title').textContent;
                const cardCategory = card.querySelector('.card-category').textContent;
                
                trackAnalyticsEvent('card_clicked', {
                    card_title: cardTitle,
                    card_category: cardCategory,
                    action: 'read_more'
                });
            });
        }
        
        // Track card hover time
        let hoverStartTime;
        
        card.addEventListener('mouseenter', () => {
            hoverStartTime = Date.now();
        });
        
        card.addEventListener('mouseleave', () => {
            if (hoverStartTime) {
                const hoverDuration = Date.now() - hoverStartTime;
                
                if (hoverDuration > 2000) { // Only track if hovered for more than 2 seconds
                    trackAnalyticsEvent('card_hovered', {
                        card_title: card.querySelector('.card-title').textContent,
                        hover_duration: hoverDuration
                    });
                }
            }
        });
    });
}

// Initialize card interaction tracking
initCardInteractionTracking();

// Performance monitoring for analytics page
function initAnalyticsPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        const navigation = performance.getEntriesByType('navigation')[0];
        
        trackAnalyticsEvent('page_performance', {
            load_time: loadTime,
            dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            first_paint: performance.getEntriesByType('paint')[0]?.startTime || 0
        });
    });
    
    // Monitor scroll performance
    let scrollStartTime;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        if (!scrollStartTime) {
            scrollStartTime = Date.now();
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollDuration = Date.now() - scrollStartTime;
            
            trackAnalyticsEvent('scroll_session', {
                duration: scrollDuration,
                scroll_depth: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
            });
            
            scrollStartTime = null;
        }, 1000);
    });
}

// Initialize performance monitoring
initAnalyticsPerformanceMonitoring();

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAnalyticsScrollAnimations,
        initAnalyticsAccordion,
        initLoadingDemo,
        trackAnalyticsEvent
    };
}
