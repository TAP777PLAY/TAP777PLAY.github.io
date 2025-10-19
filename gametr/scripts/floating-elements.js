// Floating Elements Animation for Chronicles of Olympus

document.addEventListener('DOMContentLoaded', function() {
    initFloatingElements();
    initScrollAnimations();
    initModeCards();
    initInfographicItems();
});

// Initialize floating elements animation
function initFloatingElements() {
    const floatingItems = document.querySelectorAll('.floating-item');
    
    floatingItems.forEach((item, index) => {
        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        // Staggered animation
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 200);
        
        // Add random movement
        const randomDelay = Math.random() * 2;
        const randomDuration = 2 + Math.random() * 3;
        
        item.style.animationDelay = `${randomDelay}s`;
        item.style.animationDuration = `${randomDuration}s`;
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'translateY(-15px) scale(1.1)';
            this.style.boxShadow = '0 10px 25px rgba(99, 255, 143, 0.3)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animation;
                
                if (animationType) {
                    element.classList.add('visible');
                }
                
                // Special handling for floating elements
                if (element.classList.contains('progress-image')) {
                    const floatingItems = element.querySelectorAll('.floating-item');
                    floatingItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements with animation data attributes
    const animatedElements = document.querySelectorAll('[data-animation]');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize mode cards animations
function initModeCards() {
    const modeCards = document.querySelectorAll('.mode-card');
    
    modeCards.forEach((card, index) => {
        // Staggered entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
        
        // Add hover effects
        const image = card.querySelector('.mode-img');
        const overlay = card.querySelector('.card-overlay');
        
        if (image && overlay) {
            card.addEventListener('mouseenter', function() {
                image.style.transform = 'scale(1.1)';
                overlay.style.opacity = '1';
            });
            
            card.addEventListener('mouseleave', function() {
                image.style.transform = 'scale(1)';
                overlay.style.opacity = '0';
            });
        }
    });
}

// Initialize infographic items animations
function initInfographicItems() {
    const infographicItems = document.querySelectorAll('.infographic-item');
    
    infographicItems.forEach((item, index) => {
        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        
        // Staggered animation
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 150);
        
        // Add hover effects
        const icon = item.querySelector('.item-icon');
        
        if (icon) {
            item.addEventListener('mouseenter', function() {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.boxShadow = '0 10px 25px rgba(99, 255, 143, 0.3)';
            });
            
            item.addEventListener('mouseleave', function() {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.boxShadow = 'none';
            });
        }
    });
}

// Create additional floating elements dynamically
function createDynamicFloatingElements() {
    const progressImage = document.querySelector('.progress-image');
    if (!progressImage) return;
    
    const floatingContainer = progressImage.querySelector('.floating-elements');
    if (!floatingContainer) return;
    
    // Additional floating elements
    const additionalElements = [
        { icon: '🌟', text: 'Yıldız Eseri', position: { top: '15%', right: '10%' } },
        { icon: '🔮', text: 'Kehanet Küresi', position: { bottom: '40%', left: '10%' } },
        { icon: '⚡', text: 'Şimşek Eseri', position: { top: '60%', right: '20%' } }
    ];
    
    additionalElements.forEach((element, index) => {
        const floatingItem = document.createElement('div');
        floatingItem.className = 'floating-item';
        floatingItem.style.cssText = `
            position: absolute;
            ${element.position.top ? `top: ${element.position.top};` : ''}
            ${element.position.bottom ? `bottom: ${element.position.bottom};` : ''}
            ${element.position.left ? `left: ${element.position.left};` : ''}
            ${element.position.right ? `right: ${element.position.right};` : ''}
            background: rgba(15, 15, 15, 0.9);
            border: 2px solid var(--color-accent);
            border-radius: 12px;
            padding: 8px 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--color-text-primary);
            font-size: 12px;
            font-weight: bold;
            animation: float 3s ease-in-out infinite;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        `;
        
        floatingItem.innerHTML = `
            <div class="floating-icon">${element.icon}</div>
            <span>${element.text}</span>
        `;
        
        floatingContainer.appendChild(floatingItem);
        
        // Animate in
        setTimeout(() => {
            floatingItem.style.opacity = '1';
            floatingItem.style.transform = 'translateY(0)';
        }, (index + 3) * 200);
    });
}

// Initialize particle system for floating elements
function initParticleSystem() {
    const progressImage = document.querySelector('.progress-image');
    if (!progressImage) return;
    
    const particleCount = 20;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--color-accent);
            border-radius: 50%;
            opacity: 0.6;
            pointer-events: none;
            animation: particleFloat ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s;
        `;
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        progressImage.appendChild(particle);
        particles.push(particle);
    }
}

// Add particle animation keyframes
function addParticleAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0%, 100% {
                transform: translateY(0px) translateX(0px);
                opacity: 0.6;
            }
            25% {
                transform: translateY(-20px) translateX(10px);
                opacity: 0.8;
            }
            50% {
                transform: translateY(-10px) translateX(-5px);
                opacity: 0.4;
            }
            75% {
                transform: translateY(-15px) translateX(5px);
                opacity: 0.7;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize all floating element features
function initAllFloatingFeatures() {
    createDynamicFloatingElements();
    initParticleSystem();
    addParticleAnimation();
}

// Call initialization
initAllFloatingFeatures();

// Export functions
window.FloatingElementsController = {
    initFloatingElements,
    initScrollAnimations,
    initModeCards,
    initInfographicItems,
    createDynamicFloatingElements,
    initParticleSystem
};
