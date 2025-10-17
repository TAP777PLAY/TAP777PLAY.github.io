/* ===== PARKS PAGE JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeViewToggle();
    initializeQuickView();
    initializeRouteActions();
    initializeScrollHideFilter();
});

// ===== FILTER FUNCTIONALITY =====
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    const sortSelect = document.getElementById('sortSelect');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const parkCards = document.querySelectorAll('.park-card');

    // Location filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Apply filters immediately
            applyFilters();
        });
    });

    // Experience checkboxes
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            applyFilters();
        });
    });

    // Sort select
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applyFilters();
        });
    }

    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            clearAllFilters();
        });
    }

    // Apply filters
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyFilters();
        });
    }

    function applyFilters() {
        const activeLocation = document.querySelector('.filter-btn.active').dataset.filter;
        const checkedExperiences = Array.from(filterCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        const sortBy = sortSelect ? sortSelect.value : 'popularity';

        let visibleCards = Array.from(parkCards);

        // Filter by location
        if (activeLocation !== 'all') {
            visibleCards = visibleCards.filter(card => 
                card.dataset.location === activeLocation
            );
        }

        // Filter by experiences
        if (checkedExperiences.length > 0) {
            visibleCards = visibleCards.filter(card => {
                const cardExperiences = card.dataset.experiences.split(',');
                return checkedExperiences.some(exp => cardExperiences.includes(exp));
            });
        }

        // Sort cards
        visibleCards = sortCards(visibleCards, sortBy);

        // Hide all cards first
        parkCards.forEach(card => {
            card.style.display = 'none';
            card.classList.remove('animate-in');
        });

        // Show filtered cards with animation
        visibleCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.display = 'block';
                card.classList.add('animate-in');
            }, index * 100);
        });

        // Update results count
        updateResultsCount(visibleCards.length);
    }

    function sortCards(cards, sortBy) {
        return cards.sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    const ratingA = parseFloat(a.querySelector('.rating-text').textContent);
                    const ratingB = parseFloat(b.querySelector('.rating-text').textContent);
                    return ratingB - ratingA;
                
                case 'price-low':
                    const priceA = parseInt(a.querySelector('.detail-item:last-child span').textContent.replace(/\D/g, ''));
                    const priceB = parseInt(b.querySelector('.detail-item:last-child span').textContent.replace(/\D/g, ''));
                    return priceA - priceB;
                
                case 'price-high':
                    const priceA2 = parseInt(a.querySelector('.detail-item:last-child span').textContent.replace(/\D/g, ''));
                    const priceB2 = parseInt(b.querySelector('.detail-item:last-child span').textContent.replace(/\D/g, ''));
                    return priceB2 - priceA2;
                
                case 'distance':
                    // Mock distance sorting - in real app would use actual coordinates
                    return Math.random() - 0.5;
                
                default: // popularity
                    return 0; // Keep original order
            }
        });
    }

    function clearAllFilters() {
        // Reset location filter
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');

        // Reset experience checkboxes
        filterCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });

        // Reset sort
        if (sortSelect) {
            sortSelect.value = 'popularity';
        }

        // Apply filters
        applyFilters();
    }

    function updateResultsCount(count) {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = count;
        }
    }
}

// ===== VIEW TOGGLE FUNCTIONALITY =====
function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const parksGrid = document.getElementById('parksGrid');

    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const viewType = this.dataset.view;
            
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Apply view
            if (parksGrid) {
                parksGrid.className = `parks-grid ${viewType}-view`;
            }
        });
    });
}

// ===== QUICK VIEW FUNCTIONALITY =====
function initializeQuickView() {
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');

    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parkId = this.dataset.park;
            showQuickViewModal(parkId);
        });
    });
}

function showQuickViewModal(parkId) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-body">
                    <h3>Quick View: ${parkId}</h3>
                    <p>This is a quick preview of the park details. In a real implementation, this would show detailed information about the selected park.</p>
                    <div class="modal-actions">
                        <button class="btn btn-primary">View Full Details</button>
                        <button class="btn btn-secondary">Add to Route</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.appendChild(modal);

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .quick-view-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .modal-content {
            background: var(--bg-primary);
            border-radius: var(--border-radius);
            border: 2px solid var(--primary);
            box-shadow: var(--shadow-neon);
            max-width: 500px;
            width: 100%;
            position: relative;
            animation: slideInUp 0.3s ease-out;
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 24px;
            cursor: pointer;
            z-index: 1;
        }
        
        .modal-close:hover {
            color: var(--primary);
        }
        
        .modal-body {
            padding: 30px;
        }
        
        .modal-body h3 {
            color: var(--text-primary);
            margin-bottom: 15px;
        }
        
        .modal-body p {
            color: var(--text-secondary);
            margin-bottom: 20px;
            line-height: 1.6;
        }
        
        .modal-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Close modal functionality
    const closeModal = () => {
        modal.remove();
        style.remove();
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // ESC key to close
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

// ===== ROUTE ACTIONS =====
function initializeRouteActions() {
    const addToRouteButtons = document.querySelectorAll('.add-to-route');
    const clearRouteBtn = document.getElementById('clearRoute');
    const routePreview = document.getElementById('routePreview');
    const routeItems = document.getElementById('routeItems');
    const routeCount = document.getElementById('routeCount');

    addToRouteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const parkCard = this.closest('.park-card');
            const parkName = parkCard.querySelector('.park-title').textContent;
            const parkLocation = parkCard.querySelector('.park-location').textContent;
            const parkPrice = parkCard.querySelector('.detail-item:last-child span').textContent;
            
            addToRoute({
                name: parkName,
                location: parkLocation,
                price: parkPrice,
                id: Date.now()
            });

            // Update button state
            this.textContent = 'Added to Route';
            this.classList.add('added');
            this.disabled = true;

            // Show success notification
            showNotification(`${parkName} added to your route!`, 'success');
        });
    });

    if (clearRouteBtn) {
        clearRouteBtn.addEventListener('click', function() {
            clearRoute();
            showNotification('Route cleared successfully!', 'info');
        });
    }

    function addToRoute(park) {
        let route = JSON.parse(localStorage.getItem('safariRoute') || '[]');
        
        // Check if already in route
        const existingItem = route.find(item => item.name === park.name);
        if (existingItem) {
            showNotification('This park is already in your route!', 'warning');
            return;
        }

        route.push(park);
        localStorage.setItem('safariRoute', JSON.stringify(route));
        
        updateRoutePreview();
    }

    function clearRoute() {
        localStorage.removeItem('safariRoute');
        updateRoutePreview();
        
        // Reset all add-to-route buttons
        addToRouteButtons.forEach(button => {
            button.textContent = 'Add to Route';
            button.classList.remove('added');
            button.disabled = false;
        });
    }

    function updateRoutePreview() {
        const route = JSON.parse(localStorage.getItem('safariRoute') || '[]');
        
        if (route.length === 0) {
            if (routePreview) routePreview.style.display = 'none';
            return;
        }

        if (routePreview) routePreview.style.display = 'block';
        if (routeCount) routeCount.textContent = route.length;

        if (routeItems) {
            routeItems.innerHTML = route.map(park => `
                <div class="route-item">
                    <div class="route-item-info">
                        <div class="route-item-name">${park.name}</div>
                        <div class="route-item-location">${park.location}</div>
                    </div>
                    <div class="route-item-price">${park.price}</div>
                    <button class="route-item-remove" onclick="removeFromRoute('${park.id}')">&times;</button>
                </div>
            `).join('');
        }
    }

    // Load route preview on page load
    updateRoutePreview();
}

// Global function for removing items from route
function removeFromRoute(parkId) {
    let route = JSON.parse(localStorage.getItem('safariRoute') || '[]');
    route = route.filter(park => park.id != parkId);
    localStorage.setItem('safariRoute', JSON.stringify(route));
    
    // Update preview
    const event = new CustomEvent('routeUpdated');
    document.dispatchEvent(event);
    
    showNotification('Park removed from route', 'info');
}

// Listen for route updates
document.addEventListener('routeUpdated', function() {
    const routePreview = document.getElementById('routePreview');
    const routeItems = document.getElementById('routeItems');
    const routeCount = document.getElementById('routeCount');
    
    const route = JSON.parse(localStorage.getItem('safariRoute') || '[]');
    
    if (route.length === 0) {
        if (routePreview) routePreview.style.display = 'none';
        return;
    }

    if (routePreview) routePreview.style.display = 'block';
    if (routeCount) routeCount.textContent = route.length;

    if (routeItems) {
        routeItems.innerHTML = route.map(park => `
            <div class="route-item">
                <div class="route-item-info">
                    <div class="route-item-name">${park.name}</div>
                    <div class="route-item-location">${park.location}</div>
                </div>
                <div class="route-item-price">${park.price}</div>
                <button class="route-item-remove" onclick="removeFromRoute('${park.id}')">&times;</button>
            </div>
        `).join('');
    }
});

// ===== SCROLL HIDE FILTER FUNCTIONALITY =====
function initializeScrollHideFilter() {
    const filterPanel = document.querySelector('.filter-panel');
    let lastScrollTop = 0;
    let isFilterHidden = false;
    let scrollTimeout;

    if (!filterPanel) return;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
        
        // Clear existing timeout
        clearTimeout(scrollTimeout);
        
        // Hide filter when scrolling down
        if (scrollDirection === 'down' && scrollTop > 100 && !isFilterHidden) {
            filterPanel.style.transform = 'translateY(-100%)';
            filterPanel.style.transition = 'transform 0.3s ease-out';
            isFilterHidden = true;
        }
        
        // Show filter when scrolling up
        if (scrollDirection === 'up' && scrollTop > 50) {
            filterPanel.style.transform = 'translateY(0)';
            filterPanel.style.transition = 'transform 0.3s ease-out';
            isFilterHidden = false;
        }
        
        // Always show filter at the top of the page
        if (scrollTop <= 50) {
            filterPanel.style.transform = 'translateY(0)';
            filterPanel.style.transition = 'transform 0.3s ease-out';
            isFilterHidden = false;
        }
        
        lastScrollTop = scrollTop;
        
        // Auto-show filter after stopping scroll
        scrollTimeout = setTimeout(() => {
            if (scrollTop > 100) {
                filterPanel.style.transform = 'translateY(0)';
                filterPanel.style.transition = 'transform 0.3s ease-out';
                isFilterHidden = false;
            }
        }, 1500);
    });
}

// ===== LOAD MORE FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.getElementById('loadMore');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more parks
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = 'Load More Parks';
                this.disabled = false;
                showNotification('More parks loaded!', 'success');
            }, 1500);
        });
    }
});
