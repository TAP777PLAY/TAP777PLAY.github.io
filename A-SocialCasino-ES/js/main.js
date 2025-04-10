// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animation for elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature, .service-card, .testimonial, .blog-card').forEach((el) => {
        observer.observe(el);
    });

    // Form submission handling (if exists on page)
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation can be added here
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Form submission simulation
            console.log('Envío del formulario:', formObject);
            alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
            this.reset();
        });
    }

    // Mobile menu
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'mobile-menu-button';
    mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
    
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelector('.nav-links');
    
    nav.insertBefore(mobileMenuButton, navLinks);
    
    mobileMenuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuButton.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Estilos para el menú móvil
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu-button {
            display: none;
            background: none;
            border: none;
            color: var(--primary-color);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
        }

        @media (max-width: 768px) {
            .mobile-menu-button {
                display: block;
            }

            .nav-links {
                display: none;
                width: 100%;
            }

            .nav-links.active {
                display: flex;
            }
        }
    `;
    document.head.appendChild(style);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .service-card, .testimonial, .value-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
    }
    
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: block;
        }
        
        .nav-links {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--primary-color);
            padding: 1rem;
        }
    }
`;
document.head.appendChild(style); 