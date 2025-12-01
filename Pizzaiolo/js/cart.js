// Pizzaiolo - Cart Management

// Get cart from localStorage
function getCart() {
    try {
        if (typeof(Storage) === "undefined") {
            return [];
        }
        const stored = localStorage.getItem('pizzaioloCart');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Ensure it's an array
            return Array.isArray(parsed) ? parsed : [];
        }
        return [];
    } catch (e) {
        // Clear corrupted data
        try {
            localStorage.removeItem('pizzaioloCart');
        } catch (clearError) {
            // Ignore clear errors
        }
        return [];
    }
}

// Save cart to localStorage
function saveCart(cart) {
    try {
        if (typeof(Storage) !== "undefined") {
            // Validate cart is an array
            if (!Array.isArray(cart)) {
                console.error('Cart must be an array');
                return;
            }
            
            localStorage.setItem('pizzaioloCart', JSON.stringify(cart));
            updateCartCount();
            
            // Update cart display if on cart page
            if (document.getElementById('cart-items')) {
                updateCartDisplay();
            }
        }
    } catch (e) {
        console.error('Error saving cart to localStorage:', e);
        // Try to clear corrupted data
        try {
            localStorage.removeItem('pizzaioloCart');
        } catch (clearError) {
            // Ignore clear errors
        }
    }
}

// Add item to cart
function addToCart(pizzaId, pizzaName, pizzaPrice, pizzaImage = '') {
    if (typeof(Storage) === "undefined") {
        alert('Your browser does not support localStorage. Cart functionality may not work.');
        return;
    }
    
    // Validate inputs
    if (!pizzaId || !pizzaName || !pizzaPrice) {
        console.error('Invalid cart item data');
        return;
    }
    
    const cart = getCart();
    const existingItem = cart.find(item => item.id === pizzaId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: String(pizzaId),
            name: String(pizzaName),
            price: parseFloat(pizzaPrice),
            quantity: 1,
            image: String(pizzaImage || '')
        });
    }

    saveCart(cart);
    showCartNotification('Item added to cart!');
}

// Remove item from cart
function removeFromCart(pizzaId) {
    const cart = getCart();
    const filteredCart = cart.filter(item => item.id !== pizzaId);
    saveCart(filteredCart);
    showCartNotification('Item removed from cart!');
    
    // Update display immediately
    if (document.getElementById('cart-items')) {
        updateCartDisplay();
    }
}

// Update item quantity
function updateQuantity(pizzaId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === pizzaId);
    
    if (item) {
        const newQuantity = parseInt(quantity);
        if (isNaN(newQuantity) || newQuantity <= 0) {
            removeFromCart(pizzaId);
        } else {
            item.quantity = newQuantity;
            saveCart(cart);
            showCartNotification('Cart updated!');
        }
    }
}

// Get cart total
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Display cart items
function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartContainer) {
        return;
    }
    
    const cart = getCart();

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some delicious pizzas to get started!</p>
                <a href="menu.html" class="btn btn-primary">Browse Menu</a>
            </div>
        `;
        if (cartSummary) {
            cartSummary.style.display = 'none';
        }
        return;
    }

    if (cartSummary) {
        cartSummary.style.display = 'block';
    }

    let html = '';
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const safeName = String(item.name || '').replace(/'/g, "&#39;").replace(/"/g, "&quot;").replace(/&/g, "&amp;");
        const itemId = String(item.id || '').replace(/'/g, "&#39;").replace(/"/g, "&quot;").replace(/&/g, "&amp;");
        const price = parseFloat(item.price || 0);
        const quantity = parseInt(item.quantity || 1);
        const itemTotal = price * quantity;
        const imageUrl = item.image || '';
        const safeImageUrl = imageUrl.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
        
        html += `
        <div class="cart-item" data-id="${itemId}">
            ${imageUrl ? `<div class="cart-item-image" style="background-image: url('${safeImageUrl}');"></div>` : ''}
            <div class="cart-item-info">
                <div class="cart-item-name">${safeName}</div>
                <div class="cart-item-price">$${price.toFixed(2)} each</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity('${itemId}', ${quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${quantity}" min="1" 
                           onchange="updateQuantity('${itemId}', this.value)">
                    <button class="quantity-btn" onclick="updateQuantity('${itemId}', ${quantity + 1})">+</button>
                </div>
                <div style="font-weight: bold; min-width: 80px; text-align: right;">
                    $${itemTotal.toFixed(2)}
                </div>
                <button class="remove-btn" onclick="removeFromCart('${itemId}')">Remove</button>
            </div>
        </div>
        `;
    }
    cartContainer.innerHTML = html;

    // Update total
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        totalElement.textContent = `$${getCartTotal().toFixed(2)}`;
    }
}

// Update cart count in header
function updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count');
    const count = getCartItemCount();
    
    cartCounts.forEach(cartCount => {
        if (cartCount) {
            if (count > 0) {
                cartCount.textContent = count;
                cartCount.style.display = 'flex';
            } else {
                cartCount.style.display = 'none';
            }
        }
    });
}

// Show cart notification
function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #C41E3A;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 4000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Make functions available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.updateCartDisplay = updateCartDisplay;
window.getCart = getCart;

// Initialize cart display on cart page
function initializeCart() {
    updateCartCount();
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        updateCartDisplay();
    }
}

// Initialize immediately if DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initializeCart, 1);
} else {
    document.addEventListener('DOMContentLoaded', initializeCart);
}

// Also update on window load as backup
window.addEventListener('load', function() {
    setTimeout(function() {
        updateCartCount();
        if (document.getElementById('cart-items')) {
            updateCartDisplay();
        }
    }, 100);
});

// Add CSS animations for notifications
if (!document.getElementById('cart-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'cart-notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

