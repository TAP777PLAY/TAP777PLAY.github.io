document.addEventListener('DOMContentLoaded', function() {
    // Inicialización del carrito
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Abrir/cerrar el modal del carrito
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.querySelector('.close-cart');

    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        updateCartDisplay();
    });

    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Añadir producto al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseInt(button.dataset.price);

            // Verificar si el producto ya está en el carrito
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: id,
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            // Guardar carrito en localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Actualizar visualización
            updateCartCount();
            showAddToCartAnimation(button);
            
            // Mostrar notificación
            showNotification('Producto añadido al carrito');
        });
    });

    // Procesar pedido
    document.querySelector('.checkout-button').addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('El carrito está vacío');
            return;
        }

        // Aquí se puede añadir la lógica de procesamiento del pedido
        alert('¡Gracias por tu compra! Nuestro equipo se pondrá en contacto contigo.');
        cart = [];
        localStorage.removeItem('cart');
        updateCartCount();
        updateCartDisplay();
        cartModal.style.display = 'none';
    });

    // Función para actualizar el contador del carrito
    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    }

    // Función para actualizar la visualización del carrito
    function updateCartDisplay() {
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total span');
        
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">El carrito está vacío</p>';
            cartTotal.textContent = '0';
            return;
        }

        let total = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>${item.price} € x ${item.quantity}</p>
                </div>
                <div class="item-controls">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            cartItems.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        cartTotal.textContent = total;

        // Manejadores de botones de cantidad
        cartItems.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = cart.find(item => item.id === id);
                
                if (btn.classList.contains('plus')) {
                    item.quantity += 1;
                } else if (btn.classList.contains('minus')) {
                    item.quantity -= 1;
                    if (item.quantity <= 0) {
                        cart = cart.filter(cartItem => cartItem.id !== id);
                    }
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                updateCartDisplay();
            });
        });

        // Manejadores de botones de eliminar
        cartItems.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                cart = cart.filter(item => item.id !== id);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                updateCartDisplay();
            });
        });
    }

    // Función para mostrar la animación de añadir al carrito
    function showAddToCartAnimation(button) {
        button.classList.add('added');
        setTimeout(() => {
            button.classList.remove('added');
        }, 1500);
    }

    // Función para mostrar notificaciones
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}); 