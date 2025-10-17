/* ===== ROUTE BUILDER JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', function() {
    initializeRouteBuilder();
    initializeStepNavigation();
    initializeSelections();
    initializePricing();
    initializeDragAndDrop();
    initializeRouteOptimization();
    loadSavedProgress();
});

// ===== ROUTE BUILDER INITIALIZATION =====
function initializeRouteBuilder() {
    // Initialize with step 1
    showStep(1);
    updateProgress();
}

// ===== STEP NAVIGATION =====
function initializeStepNavigation() {
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');

    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = parseInt(this.dataset.next);
            if (validateCurrentStep()) {
                showStep(nextStep);
                updateProgress();
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.dataset.prev);
            showStep(prevStep);
            updateProgress();
        });
    });
}

function showStep(stepNumber) {
    // Hide all steps
    const allSteps = document.querySelectorAll('.builder-step');
    allSteps.forEach(step => {
        step.classList.remove('active');
    });

    // Show current step
    const currentStep = document.getElementById(`step${stepNumber}`);
    if (currentStep) {
        currentStep.classList.add('active');
    }

    // Update step indicators
    const stepIndicators = document.querySelectorAll('.step');
    stepIndicators.forEach((indicator, index) => {
        const stepNum = index + 1;
        indicator.classList.remove('active');
        
        if (stepNum === stepNumber) {
            indicator.classList.add('active');
        } else if (stepNum < stepNumber) {
            indicator.classList.add('completed');
        }
    });
}

function updateProgress() {
    const currentStep = document.querySelector('.builder-step.active');
    if (!currentStep) return;

    const stepNumber = parseInt(currentStep.id.replace('step', ''));
    const progress = (stepNumber / 3) * 100;

    // Update progress bar if exists
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

function validateCurrentStep() {
    const currentStep = document.querySelector('.builder-step.active');
    if (!currentStep) return true;

    const stepNumber = parseInt(currentStep.id.replace('step', ''));

    switch (stepNumber) {
        case 1:
            return validateParksSelection();
        case 2:
            return validateMenuSelection();
        case 3:
            return validateAnimalsSelection();
        default:
            return true;
    }
}

// ===== PARKS SELECTION =====
function validateParksSelection() {
    const selectedParks = document.querySelectorAll('.park-option.selected');
    if (selectedParks.length === 0) {
        showNotification('Please select at least one park', 'warning');
        return false;
    }
    return true;
}

function initializeSelections() {
    // Parks selection
    const parkOptions = document.querySelectorAll('.park-option');
    parkOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateParksSummary();
        });
    });

    // Menu selection
    const menuItems = document.querySelectorAll('.add-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const itemName = this.dataset.item;
            const itemPrice = parseInt(this.dataset.price);
            toggleMenuItem(itemName, itemPrice, this);
        });
    });

    // Animals selection
    const animalOptions = document.querySelectorAll('.animal-option');
    animalOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateAnimalsSummary();
        });
    });
}

function updateParksSummary() {
    const selectedParks = document.querySelectorAll('.park-option.selected');
    const parksContainer = document.getElementById('selectedParks');
    
    if (selectedParks.length === 0) {
        if (parksContainer) {
            parksContainer.innerHTML = '<p class="no-selection">No parks selected yet</p>';
        }
        return;
    }

    if (parksContainer) {
        parksContainer.innerHTML = Array.from(selectedParks).map(park => {
            const name = park.querySelector('.park-name').textContent;
            const location = park.querySelector('.park-location').textContent;
            return `
                <div class="selected-item">
                    <div class="item-name">${name}</div>
                    <div class="item-location">${location}</div>
                </div>
            `;
        }).join('');
    }
}

// ===== MENU SELECTION =====
function validateMenuSelection() {
    const selectedItems = document.querySelectorAll('.menu-item.selected');
    if (selectedItems.length === 0) {
        showNotification('Please select at least one menu item', 'warning');
        return false;
    }
    return true;
}

function toggleMenuItem(itemName, itemPrice, button) {
    const menuItem = button.closest('.menu-item');
    const isSelected = menuItem.classList.contains('selected');
    
    if (isSelected) {
        menuItem.classList.remove('selected');
        button.textContent = 'Add';
        button.classList.remove('added');
    } else {
        menuItem.classList.add('selected');
        button.textContent = 'Added';
        button.classList.add('added');
    }
    
    updateMenuSummary();
}

function updateMenuSummary() {
    const selectedItems = document.querySelectorAll('.menu-item.selected');
    const menuContainer = document.getElementById('selectedMenu');
    
    if (selectedItems.length === 0) {
        if (menuContainer) {
            menuContainer.innerHTML = '<p class="no-selection">No menu items selected yet</p>';
        }
        return;
    }

    if (menuContainer) {
        menuContainer.innerHTML = Array.from(selectedItems).map(item => {
            const name = item.querySelector('.item-name').textContent;
            const price = item.querySelector('.item-price').textContent;
            return `
                <div class="selected-item">
                    <div class="item-name">${name}</div>
                    <div class="item-price">${price}</div>
                </div>
            `;
        }).join('');
    }
}

// ===== ANIMALS SELECTION =====
function validateAnimalsSelection() {
    const selectedAnimals = document.querySelectorAll('.animal-option.selected');
    if (selectedAnimals.length === 0) {
        showNotification('Please select at least one animal encounter', 'warning');
        return false;
    }
    return true;
}

function updateAnimalsSummary() {
    const selectedAnimals = document.querySelectorAll('.animal-option.selected');
    const animalsContainer = document.getElementById('selectedAnimals');
    
    if (selectedAnimals.length === 0) {
        if (animalsContainer) {
            animalsContainer.innerHTML = '<p class="no-selection">No animals selected yet</p>';
        }
        return;
    }

    if (animalsContainer) {
        animalsContainer.innerHTML = Array.from(selectedAnimals).map(animal => {
            const name = animal.querySelector('.animal-name').textContent;
            const price = animal.querySelector('.animal-price').textContent;
            return `
                <div class="selected-item">
                    <div class="item-name">${name}</div>
                    <div class="item-price">${price}</div>
                </div>
            `;
        }).join('');
    }
}

// ===== PRICING CALCULATION =====
function initializePricing() {
    // Update pricing when selections change
    document.addEventListener('click', function(e) {
        if (e.target.closest('.park-option') || 
            e.target.closest('.menu-item') || 
            e.target.closest('.animal-option')) {
            setTimeout(updatePricing, 100);
        }
    });
}

function updatePricing() {
    let totalPrice = 0;
    const pricingItems = document.querySelectorAll('.pricing-item');
    
    // Parks pricing
    const selectedParks = document.querySelectorAll('.park-option.selected');
    const parksPrice = selectedParks.length * 450; // Base price per park
    totalPrice += parksPrice;
    
    // Menu pricing
    const selectedMenuItems = document.querySelectorAll('.menu-item.selected');
    const menuPrice = Array.from(selectedMenuItems).reduce((sum, item) => {
        const price = parseInt(item.querySelector('.item-price').textContent.replace(/\D/g, ''));
        return sum + price;
    }, 0);
    totalPrice += menuPrice;
    
    // Animals pricing
    const selectedAnimals = document.querySelectorAll('.animal-option.selected');
    const animalsPrice = Array.from(selectedAnimals).reduce((sum, animal) => {
        const price = parseInt(animal.querySelector('.animal-price').textContent.replace(/\D/g, ''));
        return sum + price;
    }, 0);
    totalPrice += animalsPrice;
    
    // Fixed costs
    const transportation = 100;
    const guideService = 150;
    totalPrice += transportation + guideService;
    
    // Update pricing display
    updatePricingItem('parks', parksPrice);
    updatePricingItem('menu', menuPrice);
    updatePricingItem('animals', animalsPrice);
    updatePricingItem('transportation', transportation);
    updatePricingItem('guide', guideService);
    
    // Update total
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = `AED ${totalPrice}`;
    }
    
    // Enable/disable book button
    const bookButton = document.getElementById('bookRoute');
    if (bookButton) {
        bookButton.disabled = totalPrice === 400; // Only fixed costs
    }
}

function updatePricingItem(itemType, price) {
    const pricingItems = document.querySelectorAll('.pricing-item');
    pricingItems.forEach(item => {
        const itemName = item.querySelector('.item-name').textContent.toLowerCase();
        if (itemName.includes(itemType)) {
            const priceElement = item.querySelector('.item-price');
            if (priceElement) {
                priceElement.textContent = `AED ${price}`;
            }
        }
    });
}

// ===== ROUTE ACTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    const bookButton = document.getElementById('bookRoute');
    const saveButton = document.getElementById('saveRoute');
    const clearButton = document.getElementById('clearRoute');
    
    if (bookButton) {
        bookButton.addEventListener('click', function() {
            if (validateCurrentStep()) {
                bookRoute();
            }
        });
    }
    
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveRoute();
        });
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            clearRoute();
        });
    }
});

function bookRoute() {
    const selectedParks = Array.from(document.querySelectorAll('.park-option.selected')).map(park => ({
        name: park.querySelector('.park-name').textContent,
        location: park.querySelector('.park-location').textContent
    }));
    
    const selectedMenu = Array.from(document.querySelectorAll('.menu-item.selected')).map(item => ({
        name: item.querySelector('.item-name').textContent,
        price: item.querySelector('.item-price').textContent
    }));
    
    const selectedAnimals = Array.from(document.querySelectorAll('.animal-option.selected')).map(animal => ({
        name: animal.querySelector('.animal-name').textContent,
        price: animal.querySelector('.animal-price').textContent
    }));
    
    const routeData = {
        parks: selectedParks,
        menu: selectedMenu,
        animals: selectedAnimals,
        totalPrice: document.getElementById('totalPrice').textContent,
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('currentRoute', JSON.stringify(routeData));
    
    // Show success message
    showNotification('Route booked successfully! Redirecting to confirmation...', 'success');
    
    // Redirect to booking confirmation (in real app)
    setTimeout(() => {
        // window.location.href = 'booking-confirmation.html';
        console.log('Route booked:', routeData);
    }, 2000);
}

function saveRoute() {
    const selectedParks = Array.from(document.querySelectorAll('.park-option.selected')).map(park => ({
        name: park.querySelector('.park-name').textContent,
        location: park.querySelector('.park-location').textContent
    }));
    
    const selectedMenu = Array.from(document.querySelectorAll('.menu-item.selected')).map(item => ({
        name: item.querySelector('.item-name').textContent,
        price: item.querySelector('.item-price').textContent
    }));
    
    const selectedAnimals = Array.from(document.querySelectorAll('.animal-option.selected')).map(animal => ({
        name: animal.querySelector('.animal-name').textContent,
        price: animal.querySelector('.animal-price').textContent
    }));
    
    const routeData = {
        parks: selectedParks,
        menu: selectedMenu,
        animals: selectedAnimals,
        totalPrice: document.getElementById('totalPrice').textContent,
        savedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const savedRoutes = JSON.parse(localStorage.getItem('savedRoutes') || '[]');
    savedRoutes.push(routeData);
    localStorage.setItem('savedRoutes', JSON.stringify(savedRoutes));
    
    showNotification('Route saved successfully!', 'success');
}

function clearRoute() {
    // Clear all selections
    document.querySelectorAll('.park-option.selected').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelectorAll('.menu-item.selected').forEach(item => {
        item.classList.remove('selected');
        const button = item.querySelector('.add-item');
        button.textContent = 'Add';
        button.classList.remove('added');
    });
    
    document.querySelectorAll('.animal-option.selected').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Reset to step 1
    showStep(1);
    updateProgress();
    
    // Update summaries
    updateParksSummary();
    updateMenuSummary();
    updateAnimalsSummary();
    updatePricing();
    
    showNotification('Route cleared successfully!', 'info');
}

// ===== STEP COMPLETION INDICATORS =====
function markStepCompleted(stepNumber) {
    const step = document.querySelector(`[data-step="${stepNumber}"]`);
    if (step) {
        step.classList.add('completed');
    }
}

// ===== AUTO-SAVE FUNCTIONALITY =====
function initializeAutoSave() {
    // Auto-save every 30 seconds
    setInterval(() => {
        const currentStep = document.querySelector('.builder-step.active');
        if (currentStep) {
            saveCurrentProgress();
        }
    }, 30000);
}

function saveCurrentProgress() {
    const progress = {
        currentStep: document.querySelector('.builder-step.active').id,
        selectedParks: Array.from(document.querySelectorAll('.park-option.selected')).map(p => p.dataset.park),
        selectedMenu: Array.from(document.querySelectorAll('.menu-item.selected')).map(m => m.querySelector('.item-name').textContent),
        selectedAnimals: Array.from(document.querySelectorAll('.animal-option.selected')).map(a => a.dataset.animal),
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('routeBuilderProgress', JSON.stringify(progress));
}

function loadSavedProgress() {
    const saved = localStorage.getItem('routeBuilderProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        
        // Restore selections
        progress.selectedParks.forEach(parkId => {
            const park = document.querySelector(`[data-park="${parkId}"]`);
            if (park) park.classList.add('selected');
        });
        
        // Restore other selections...
        updateParksSummary();
        updateMenuSummary();
        updateAnimalsSummary();
        updatePricing();
    }
}

// Initialize auto-save
initializeAutoSave();

// Load saved progress on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSavedProgress();
});

// ===== DRAG AND DROP FUNCTIONALITY =====
function initializeDragAndDrop() {
    const parkOptions = document.querySelectorAll('.park-option');
    const selectedParksContainer = document.getElementById('selectedParks');
    
    parkOptions.forEach(option => {
        option.draggable = true;
        
        option.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.park);
            this.classList.add('dragging');
        });
        
        option.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
        
        option.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        option.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        option.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const parkId = e.dataTransfer.getData('text/plain');
            const draggedPark = document.querySelector(`[data-park="${parkId}"]`);
            
            if (draggedPark && draggedPark !== this) {
                // Swap positions
                const parent = this.parentNode;
                const nextSibling = this.nextSibling;
                parent.insertBefore(draggedPark, nextSibling);
                
                updateParksSummary();
                updatePricing();
            }
        });
    });
}

// ===== ROUTE OPTIMIZATION =====
function initializeRouteOptimization() {
    const optimizeButton = document.createElement('button');
    optimizeButton.className = 'btn btn-secondary';
    optimizeButton.textContent = 'Optimize Route';
    optimizeButton.id = 'optimizeRoute';
    
    const stepActions = document.querySelector('.step-actions');
    if (stepActions) {
        stepActions.appendChild(optimizeButton);
    }
    
    optimizeButton.addEventListener('click', function() {
        optimizeRoute();
    });
}

function optimizeRoute() {
    const selectedParks = document.querySelectorAll('.park-option.selected');
    if (selectedParks.length < 2) {
        showNotification('Please select at least 2 parks to optimize route', 'warning');
        return;
    }
    
    // Simulate route optimization
    showNotification('Optimizing route...', 'info');
    
    setTimeout(() => {
        const parks = Array.from(selectedParks);
        const optimizedOrder = optimizeParkOrder(parks);
        
        // Reorder parks in DOM
        const parksContainer = document.querySelector('.parks-selection');
        optimizedOrder.forEach(park => {
            parksContainer.appendChild(park);
        });
        
        showNotification('Route optimized for best travel time!', 'success');
        updateRouteMap();
    }, 1500);
}

function optimizeParkOrder(parks) {
    // Simple optimization based on location proximity
    // In real app, would use actual coordinates and distance calculations
    const locationOrder = ['dubai', 'abu-dhabi', 'al-ain', 'sharjah', 'fujairah'];
    
    return parks.sort((a, b) => {
        const locationA = a.querySelector('.park-location').textContent.toLowerCase();
        const locationB = b.querySelector('.park-location').textContent.toLowerCase();
        
        const indexA = locationOrder.findIndex(loc => locationA.includes(loc));
        const indexB = locationOrder.findIndex(loc => locationB.includes(loc));
        
        return indexA - indexB;
    });
}

// ===== ROUTE MAP UPDATES =====
function updateRouteMap() {
    const selectedParks = document.querySelectorAll('.park-option.selected');
    const mapContainer = document.querySelector('.map-container');
    
    if (selectedParks.length === 0) {
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="no-route-message">
                    <h3>No Route Selected</h3>
                    <p>Please select parks to see your route map</p>
                </div>
            `;
        }
        return;
    }
    
    // Update map with selected parks
    if (mapContainer) {
        const parkNames = Array.from(selectedParks).map(park => 
            park.querySelector('.park-name').textContent
        );
        
        mapContainer.innerHTML = `
            <div class="route-visualization">
                <h3>Your Safari Route</h3>
                <div class="route-path">
                    ${parkNames.map((name, index) => `
                        <div class="route-stop">
                            <div class="stop-number">${index + 1}</div>
                            <div class="stop-name">${name}</div>
                        </div>
                        ${index < parkNames.length - 1 ? '<div class="route-arrow">→</div>' : ''}
                    `).join('')}
                </div>
                <div class="route-stats">
                    <div class="stat-item">
                        <span class="stat-label">Total Parks:</span>
                        <span class="stat-value">${selectedParks.length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Estimated Duration:</span>
                        <span class="stat-value">${selectedParks.length * 4} hours</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// ===== ENHANCED STEP VALIDATION =====
function validateCurrentStep() {
    const currentStep = document.querySelector('.builder-step.active');
    if (!currentStep) return true;

    const stepNumber = parseInt(currentStep.id.replace('step', ''));

    switch (stepNumber) {
        case 1:
            return validateParksSelection();
        case 2:
            return validateMenuSelection();
        case 3:
            return validateAnimalsSelection();
        default:
            return true;
    }
}

// ===== IMPROVED PRICING CALCULATION =====
function updatePricing() {
    let totalPrice = 0;
    const pricingItems = document.querySelectorAll('.pricing-item');
    
    // Parks pricing with dynamic calculation
    const selectedParks = document.querySelectorAll('.park-option.selected');
    const parksPrice = Array.from(selectedParks).reduce((sum, park) => {
        // Get price from park data or use default
        const priceText = park.querySelector('.park-price');
        if (priceText) {
            return sum + parseInt(priceText.textContent.replace(/\D/g, ''));
        }
        return sum + 450; // Default price
    }, 0);
    totalPrice += parksPrice;
    
    // Menu pricing
    const selectedMenuItems = document.querySelectorAll('.menu-item.selected');
    const menuPrice = Array.from(selectedMenuItems).reduce((sum, item) => {
        const price = parseInt(item.querySelector('.item-price').textContent.replace(/\D/g, ''));
        return sum + price;
    }, 0);
    totalPrice += menuPrice;
    
    // Animals pricing
    const selectedAnimals = document.querySelectorAll('.animal-option.selected');
    const animalsPrice = Array.from(selectedAnimals).reduce((sum, animal) => {
        const price = parseInt(animal.querySelector('.animal-price').textContent.replace(/\D/g, ''));
        return sum + price;
    }, 0);
    totalPrice += animalsPrice;
    
    // Fixed costs
    const transportation = 100;
    const guideService = 150;
    totalPrice += transportation + guideService;
    
    // Update pricing display
    updatePricingItem('parks', parksPrice);
    updatePricingItem('menu', menuPrice);
    updatePricingItem('animals', animalsPrice);
    updatePricingItem('transportation', transportation);
    updatePricingItem('guide', guideService);
    
    // Update total
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = `AED ${totalPrice}`;
    }
    
    // Enable/disable book button
    const bookButton = document.getElementById('bookRoute');
    if (bookButton) {
        bookButton.disabled = totalPrice === 250; // Only fixed costs
    }
    
    // Update route map when pricing changes
    updateRouteMap();
}

// ===== ENHANCED NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: var(--bg-secondary);
            border: 2px solid var(--primary);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-neon);
            padding: 15px 20px;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        }
        
        .notification-success {
            border-color: var(--secondary);
        }
        
        .notification-warning {
            border-color: var(--accent-yellow);
        }
        
        .notification-error {
            border-color: var(--accent-pink);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 18px;
            cursor: pointer;
        }
        
        .notification-close:hover {
            color: var(--primary);
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
        style.remove();
    });
}
