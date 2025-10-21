// ===== GALLERY PAGE INTERACTIVE FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all gallery interactions
    initializeFiltering();
    initializeImageAnimations();
    initializeLazyLoading();
    initializeAccessibility();
    initializeKeyboardNavigation();
});

// ===== FILTERING FUNCTIONALITY =====
function initializeFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryGrid = document.getElementById('gallery-grid');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items with animation
            filterGalleryItems(galleryItems, filter, galleryGrid);
        });
    });
}

function filterGalleryItems(items, filter, container) {
    let visibleCount = 0;
    
    items.forEach((item, index) => {
        const category = item.dataset.category;
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
            item.classList.remove('filtered-out');
            item.classList.add('filtered-in');
            item.style.display = 'block';
            item.style.animationDelay = `${visibleCount * 0.1}s`;
            visibleCount++;
        } else {
            item.classList.add('filtered-out');
            item.classList.remove('filtered-in');
            
            // Hide after animation completes
            setTimeout(() => {
                if (item.classList.contains('filtered-out')) {
                    item.style.display = 'none';
                }
            }, 300);
        }
    });
    
    // Show empty state if no items visible
    showEmptyState(visibleCount === 0, container);
}

function showEmptyState(isEmpty, container) {
    let emptyState = document.querySelector('.gallery-empty');
    
    if (isEmpty && !emptyState) {
        emptyState = document.createElement('div');
        emptyState.className = 'gallery-empty';
        emptyState.innerHTML = `
            <h3 class="gallery-empty-title">No Items Found</h3>
            <p class="gallery-empty-description">Try selecting a different category to explore more treasures.</p>
        `;
        container.appendChild(emptyState);
    } else if (!isEmpty && emptyState) {
        emptyState.remove();
    }
}

// ===== IMAGE ANIMATIONS =====
function initializeImageAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    galleryItems.forEach(item => {
        observer.observe(item);
    });
    
    // Enhanced hover effects
    galleryItems.forEach(item => {
        const inner = item.querySelector('.gallery-item-inner');
        const img = item.querySelector('.gallery-img');
        
        item.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                inner.style.transform = 'translateY(-8px) scale(1.02)';
                img.style.transform = 'scale(1.1)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            inner.style.transform = 'translateY(0) scale(1)';
            img.style.transform = 'scale(1)';
        });
    });
}

// ===== LAZY LOADING =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('.gallery-img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src || img.src;
                
                if (src) {
                    img.src = src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initializeAccessibility() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Add ARIA labels and roles
    galleryItems.forEach((item, index) => {
        item.setAttribute('role', 'img');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `Gallery item ${index + 1}`);
        
        const title = item.querySelector('.gallery-item-title');
        if (title) {
            item.setAttribute('aria-labelledby', `item-title-${index}`);
            title.id = `item-title-${index}`;
        }
    });
    
    // Add ARIA labels to filter buttons
    filterButtons.forEach(button => {
        button.setAttribute('role', 'button');
        button.setAttribute('aria-pressed', 'false');
        
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.setAttribute('aria-pressed', 'false'));
            this.setAttribute('aria-pressed', 'true');
        });
    });
    
    // Announce filter changes to screen readers
    const filterContainer = document.querySelector('.filter-buttons');
    if (filterContainer) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        
        document.body.appendChild(announcement);
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                const filterName = this.textContent.trim();
                announcement.textContent = `Gallery filtered to show ${filterName}`;
            });
        });
    }
}

// ===== KEYBOARD NAVIGATION =====
function initializeKeyboardNavigation() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Gallery item keyboard navigation
    galleryItems.forEach(item => {
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Filter button keyboard navigation
    filterButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const nextIndex = e.key === 'ArrowRight' 
                    ? (index + 1) % filterButtons.length 
                    : (index - 1 + filterButtons.length) % filterButtons.length;
                filterButtons[nextIndex].focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// ===== IMAGE ZOOM MODAL =====
function initializeImageModal() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('.gallery-img');
            const title = this.querySelector('.gallery-item-title').textContent;
            const subtitle = this.querySelector('.gallery-item-subtitle').textContent;
            const description = this.querySelector('.gallery-item-description').textContent;
            
            showImageModal(img.src, title, subtitle, description);
        });
    });
}

function showImageModal(src, title, subtitle, description) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <div class="image-modal-header">
                <h3 class="image-modal-title">${title}</h3>
                <button class="image-modal-close" aria-label="Close modal">&times;</button>
            </div>
            <div class="image-modal-body">
                <img src="${src}" alt="${title}" class="image-modal-img">
                <div class="image-modal-info">
                    <h4 class="image-modal-subtitle">${subtitle}</h4>
                    <p class="image-modal-description">${description}</p>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 3000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
        }
        
        .image-modal-content {
            max-width: 90vw;
            max-height: 90vh;
            background: var(--color-white);
            border-radius: var(--radius-lg);
            overflow: hidden;
            animation: scaleUp 0.3s ease;
        }
        
        .image-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-lg);
            border-bottom: 1px solid var(--color-light-gray);
        }
        
        .image-modal-title {
            margin: 0;
            color: var(--color-dark-blue);
        }
        
        .image-modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--color-gray);
            transition: var(--transition-fast);
        }
        
        .image-modal-close:hover {
            color: var(--color-dark-blue);
        }
        
        .image-modal-body {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: var(--spacing-lg);
        }
        
        .image-modal-img {
            max-width: 100%;
            max-height: 60vh;
            object-fit: contain;
            border-radius: var(--radius-md);
            margin-bottom: var(--spacing-lg);
        }
        
        .image-modal-info {
            text-align: center;
        }
        
        .image-modal-subtitle {
            color: var(--color-gold);
            margin-bottom: var(--spacing-sm);
        }
        
        .image-modal-description {
            color: var(--color-gray);
            margin: 0;
        }
        
        @media (max-width: 768px) {
            .image-modal-body {
                flex-direction: column;
            }
            
            .image-modal-img {
                max-height: 40vh;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.image-modal-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            style.remove();
        }
    });
    
    // Keyboard close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modal.remove();
            style.remove();
        }
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
function optimizePerformance() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Handle scroll-based animations
            updateScrollAnimations();
        }, 16); // ~60fps
    });
    
    // Throttle resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Handle responsive changes
            updateResponsiveLayout();
        }, 250);
    });
}

function updateScrollAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    galleryItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        
        if (isVisible) {
            const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
            item.style.opacity = progress;
            item.style.transform = `translateY(${(1 - progress) * 20}px)`;
        }
    });
}

function updateResponsiveLayout() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (window.innerWidth <= 768) {
        // Mobile layout adjustments
        galleryGrid.style.gridTemplateColumns = '1fr';
        filterButtons.forEach(btn => {
            btn.style.width = '100%';
        });
    } else {
        // Desktop layout
        galleryGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        filterButtons.forEach(btn => {
            btn.style.width = 'auto';
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeImageModal();
    optimizePerformance();
    
    // Add loading states
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
        galleryGrid.style.opacity = '0';
        setTimeout(() => {
            galleryGrid.style.transition = 'opacity 0.5s ease';
            galleryGrid.style.opacity = '1';
        }, 100);
    }
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
