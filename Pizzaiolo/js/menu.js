// Pizzaiolo - Menu Page JavaScript

// Pizza data
const pizzas = [
    {
        id: 'margherita',
        name: 'Margherita',
        description: 'Classic Italian pizza with fresh tomatoes, mozzarella, and basil',
        price: 14.99,
        category: 'classic',
        image: 'images/margarita.jfif'
    },
    {
        id: 'pepperoni',
        name: 'Pepperoni',
        description: 'Traditional pepperoni with mozzarella cheese',
        price: 16.99,
        category: 'classic',
        image: 'images/piperoni.jpg'
    },
    {
        id: 'hawaiian',
        name: 'Hawaiian',
        description: 'Ham, pineapple, and mozzarella cheese',
        price: 17.99,
        category: 'specialty',
        image: 'images/gavaiskaya.jfif'
    },
    {
        id: 'meat-lovers',
        name: 'Meat Lovers',
        description: 'Pepperoni, sausage, ham, and bacon with mozzarella',
        price: 19.99,
        category: 'specialty',
        image: 'images/myasnaya.jfif'
    },
    {
        id: 'veggie',
        name: 'Veggie Delight',
        description: 'Bell peppers, mushrooms, onions, olives, and tomatoes',
        price: 16.99,
        category: 'vegetarian',
        image: 'images/vegetarianskaya.jfif'
    },
    {
        id: 'supreme',
        name: 'Supreme',
        description: 'Pepperoni, sausage, peppers, onions, and mushrooms',
        price: 18.99,
        category: 'specialty',
        image: 'images/verhovnii.jfif'
    },
    {
        id: 'bbq-chicken',
        name: 'BBQ Chicken',
        description: 'Grilled chicken, red onions, and BBQ sauce',
        price: 18.99,
        category: 'specialty',
        image: 'images/bbq.jfif'
    },
    {
        id: 'four-cheese',
        name: 'Four Cheese',
        description: 'Mozzarella, cheddar, parmesan, and gorgonzola',
        price: 17.99,
        category: 'vegetarian',
        image: 'images/hetirisira.jfif'
    },
    {
        id: 'mushroom',
        name: 'Mushroom',
        description: 'Fresh mushrooms, garlic, and mozzarella',
        price: 15.99,
        category: 'vegetarian',
        image: 'images/gribnaya.jfif'
    },
    {
        id: 'buffalo-chicken',
        name: 'Buffalo Chicken',
        description: 'Spicy buffalo chicken, red onions, and blue cheese',
        price: 19.99,
        category: 'specialty',
        image: 'images/Buffalo Chicken.jfif'
    },
    {
        id: 'pesto',
        name: 'Pesto Delight',
        description: 'Basil pesto, cherry tomatoes, and mozzarella',
        price: 17.99,
        category: 'vegetarian',
        image: 'images/Pesto Delight.jfif'
    },
    {
        id: 'canadian',
        name: 'Canadian',
        description: 'Bacon, pepperoni, and mushrooms',
        price: 18.99,
        category: 'specialty',
        image: 'images/Canadian.jfif'
    }
];

// Filter pizzas
let currentFilter = 'all';

function filterPizzas(category) {
    currentFilter = category;
    const filteredPizzas = category === 'all' 
        ? pizzas 
        : pizzas.filter(pizza => pizza.category === category);
    
    displayPizzas(filteredPizzas);
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
}

// Display pizzas
function displayPizzas(pizzaList) {
    const pizzaGrid = document.getElementById('pizza-grid');
    if (!pizzaGrid) return;

    pizzaGrid.innerHTML = pizzaList.map(pizza => {
        // Escape special characters for safe HTML insertion
        const safeId = String(pizza.id || '').replace(/'/g, "&#39;").replace(/"/g, "&quot;");
        const safeName = String(pizza.name || '').replace(/'/g, "&#39;").replace(/"/g, "&quot;");
        const safeImage = String(pizza.image || '').replace(/'/g, "&#39;").replace(/"/g, "&quot;");
        const safeDescription = String(pizza.description || '').replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        return `
        <div class="pizza-card">
            <div class="pizza-image" style="background-image: url('${safeImage}');"></div>
            <div class="pizza-info">
                <div class="pizza-name">${safeName}</div>
                <div class="pizza-description">${safeDescription}</div>
                <div class="pizza-footer">
                    <div class="pizza-price">$${pizza.price.toFixed(2)}</div>
                    <button class="btn btn-primary" onclick="addToCart('${safeId}', '${safeName}', ${pizza.price}, '${safeImage}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');

    // Re-initialize animations
    const cards = pizzaGrid.querySelectorAll('.pizza-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize menu page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('pizza-grid')) {
        displayPizzas(pizzas);
        
        // Setup filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                filterPizzas(this.dataset.category);
            });
        });
    }
});

