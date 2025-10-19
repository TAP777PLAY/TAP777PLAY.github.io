// NeonUX Petting Zoos UAE - Interactive Elements

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for internal anchor links (only for same page)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Counter Animation
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }
        updateCounter();
    }

    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterNumber = entry.target.querySelector('.counter-number');
                const target = parseInt(counterNumber.getAttribute('data-target'));
                animateCounter(counterNumber, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter-item').forEach(item => {
        counterObserver.observe(item);
    });

    // Reviews Slider
    const reviewSlides = document.querySelectorAll('.review-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(index) {
        reviewSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % reviewSlides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + reviewSlides.length) % reviewSlides.length;
        showSlide(currentSlide);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    // Auto-slide reviews every 5 seconds
    setInterval(nextSlide, 5000);

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Header background on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(11, 2, 31, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.background = 'rgba(11, 2, 31, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
    });

    // Button hover effects
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Card hover effects
    document.querySelectorAll('.advantage-card, .event-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                // Simulate form submission
                const button = this.querySelector('button');
                const originalText = button.textContent;
                button.textContent = 'Subscribing...';
                button.disabled = true;
                
                setTimeout(() => {
                    button.textContent = 'Subscribed!';
                    button.style.background = '#00C9FF';
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.disabled = false;
                        button.style.background = '';
                        this.reset();
                    }, 2000);
                }, 1000);
            }
        });
    }

    // Book a Visit button functionality - now handled by href links
    // No JavaScript needed for navigation links

    // Video play button functionality - scroll to video section
    const videoButtons = document.querySelectorAll('.hero-btn');
    videoButtons.forEach(button => {
        if (button.textContent.includes('Watch')) {
            button.addEventListener('click', function() {
                const videoSection = document.querySelector('#video');
                if (videoSection) {
                    videoSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });

    // Hero Slideshow
    initializeHeroSlideshow();
    
    // Loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // Scroll to top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(123, 47, 247, 0.4);
    `;
    
    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Add hover effect to scroll to top button
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(123, 47, 247, 0.6)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(123, 47, 247, 0.4)';
    });

    // Intersection Observer for fade-in animations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-in-out forwards';
            }
        });
    }, { threshold: 0.1 });

    // Observe elements for fade-in animation
    document.querySelectorAll('.advantage-card, .event-card, .review-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        fadeObserver.observe(el);
    });

    // Performance optimization: Throttle scroll events
    let ticking = false;
    
    function updateOnScroll() {
        // Header background update
        if (window.scrollY > 100) {
            header.style.background = 'rgba(11, 2, 31, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.background = 'rgba(11, 2, 31, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        // Scroll to top button visibility
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
});

// Utility function for smooth animations
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Add CSS for scroll to top button
const style = document.createElement('style');
style.textContent = `
    .scroll-to-top:hover {
        transform: translateY(-3px) !important;
        box-shadow: 0 6px 20px rgba(123, 47, 247, 0.6) !important;
    }
`;
document.head.appendChild(style);

// Hero Slideshow Function
function initializeHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Change slide every 5 seconds
    setInterval(showNextSlide, 5000);
}

// Gallery hover effects
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(123, 47, 247, 0.3)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
});

// Video Player Animation
function initializeVideoPlayer() {
    const videoWrapper = document.getElementById('videoWrapper');
    const playButton = document.getElementById('playButton');
    const progressFill = document.getElementById('progressFill');
    const timeDisplay = document.getElementById('timeDisplay');
    
    if (!videoWrapper || !playButton) return;
    
    let isPlaying = false;
    let currentTime = 0;
    const totalDuration = 150; // 2:30 in seconds
    let animationId;
    
    playButton.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (!isPlaying) {
            startVideoAnimation();
        } else {
            stopVideoAnimation();
        }
    });
    
    // Click on video wrapper to toggle play/pause
    videoWrapper.addEventListener('click', function() {
        if (!isPlaying) {
            startVideoAnimation();
        } else {
            stopVideoAnimation();
        }
    });
    
    function startVideoAnimation() {
        isPlaying = true;
        videoWrapper.classList.add('playing');
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        
        // Start progress animation
        animateProgress();
    }
    
    function stopVideoAnimation() {
        isPlaying = false;
        videoWrapper.classList.remove('playing');
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        
        // Stop progress animation
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    }
    
    function animateProgress() {
        if (!isPlaying) return;
        
        currentTime += 0.1;
        const progress = (currentTime / totalDuration) * 100;
        
        progressFill.style.width = Math.min(progress, 100) + '%';
        
        // Update time display
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        const totalMinutes = Math.floor(totalDuration / 60);
        const totalSeconds = Math.floor(totalDuration % 60);
        
        timeDisplay.textContent = 
            `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')} / ${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
        
        if (currentTime < totalDuration) {
            animationId = requestAnimationFrame(animateProgress);
        } else {
            // Video ended, reset
            setTimeout(() => {
                stopVideoAnimation();
                currentTime = 0;
                progressFill.style.width = '0%';
                timeDisplay.textContent = '0:00 / 2:30';
            }, 1000);
        }
    }
}

// Cookie Consent Management
function initializeCookieConsent() {
    // Check if user has already given consent
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
        // Show cookie consent popup
        showCookieConsentPopup();
    }
}

function showCookieConsentPopup() {
    // Create cookie consent popup
    const popup = document.createElement('div');
    popup.id = 'cookie-consent-popup';
    popup.innerHTML = `
        <div class="cookie-consent-overlay">
            <div class="cookie-consent-content">
                <div class="cookie-consent-header">
                    <i class="fas fa-cookie-bite"></i>
                    <h3>Cookie Notice</h3>
                </div>
                <div class="cookie-consent-body">
                    <p>We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.</p>
                    <div class="cookie-consent-links">
                        <a href="cookies-policy.html" target="_blank">Cookie Policy</a>
                        <a href="privacy-policy.html" target="_blank">Privacy Policy</a>
                    </div>
                </div>
                <div class="cookie-consent-buttons">
                    <button class="btn-secondary" id="cookie-consent-necessary">Necessary Only</button>
                    <button class="btn-primary" id="cookie-consent-accept">Accept All</button>
                </div>
            </div>
        </div>
    `;
    
    // Add popup to body
    document.body.appendChild(popup);
    
    // Add event listeners
    document.getElementById('cookie-consent-accept').addEventListener('click', function() {
        acceptAllCookies();
    });
    
    document.getElementById('cookie-consent-necessary').addEventListener('click', function() {
        acceptNecessaryCookies();
    });
}

function acceptAllCookies() {
    // Save consent to localStorage
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    localStorage.setItem('cookieConsentType', 'all');
    
    // Remove popup
    const popup = document.getElementById('cookie-consent-popup');
    if (popup) {
        popup.remove();
    }
    
    // Initialize analytics and other cookies
    initializeAnalytics();
}

function acceptNecessaryCookies() {
    // Save consent to localStorage
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    localStorage.setItem('cookieConsentType', 'necessary');
    
    // Remove popup
    const popup = document.getElementById('cookie-consent-popup');
    if (popup) {
        popup.remove();
    }
    
    // Only initialize necessary cookies
    initializeNecessaryCookies();
}

function initializeAnalytics() {
    // Initialize Google Analytics or other tracking
    console.log('Analytics cookies initialized');
    // Add your analytics code here
}

function initializeNecessaryCookies() {
    // Initialize only necessary cookies
    console.log('Necessary cookies initialized');
    // Add necessary cookies code here
}

// Function to reset cookie consent (for testing)
function resetCookieConsent() {
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentDate');
    localStorage.removeItem('cookieConsentType');
    console.log('Cookie consent reset. Refresh the page to see the popup again.');
}

// Add reset function to window for testing
window.resetCookieConsent = resetCookieConsent;

// Social Media Popup Management
function showSocialMediaPopup(platform) {
    const platformInfo = {
        facebook: {
            name: 'Facebook',
            icon: 'fab fa-facebook',
            color: '#1877F2',
            message: 'Follow us on Facebook for the latest updates about our petting zoos and animal encounters!'
        },
        instagram: {
            name: 'Instagram',
            icon: 'fab fa-instagram',
            color: '#E4405F',
            message: 'Check out our Instagram for amazing photos of our animals and visitor experiences!'
        },
        twitter: {
            name: 'Twitter',
            icon: 'fab fa-twitter',
            color: '#1DA1F2',
            message: 'Follow us on Twitter for news, tips, and updates about UAE petting zoos!'
        },
        youtube: {
            name: 'YouTube',
            icon: 'fab fa-youtube',
            color: '#FF0000',
            message: 'Subscribe to our YouTube channel for educational videos about animals and conservation!'
        }
    };

    const info = platformInfo[platform];
    if (!info) return;

    // Create social media popup
    const popup = document.createElement('div');
    popup.id = 'social-media-popup';
    popup.innerHTML = `
        <div class="social-popup-overlay">
            <div class="social-popup-content">
                <div class="social-popup-header" style="border-color: ${info.color}">
                    <i class="${info.icon}" style="color: ${info.color}"></i>
                    <h3>Find us on ${info.name}</h3>
                </div>
                <div class="social-popup-body">
                    <p>${info.message}</p>
                    <div class="social-popup-site-info">
                        <strong>UAE Petting Zoos</strong>
                        <span>Official ${info.name} Page</span>
                    </div>
                </div>
                <div class="social-popup-buttons">
                    <button class="btn-secondary" id="social-popup-close">Close</button>
                    <button class="btn-primary" id="social-popup-visit" style="background: ${info.color}">
                        Visit ${info.name}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add popup to body
    document.body.appendChild(popup);
    
    // Add event listeners
    document.getElementById('social-popup-close').addEventListener('click', function() {
        closeSocialPopup();
    });
    
    document.getElementById('social-popup-visit').addEventListener('click', function() {
        // In a real implementation, you would redirect to the actual social media page
        alert(`Redirecting to ${info.name}... (This is a demo)`);
        closeSocialPopup();
    });
    
    // Close popup when clicking overlay
    document.querySelector('.social-popup-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeSocialPopup();
        }
    });
}

function closeSocialPopup() {
    const popup = document.getElementById('social-media-popup');
    if (popup) {
        popup.remove();
    }
}

// Initialize social media links
function initializeSocialMediaLinks() {
    // Add click handlers to all social media links
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Determine platform from href or class
            const href = this.getAttribute('href');
            const icon = this.querySelector('i');
            
            let platform = '';
            if (icon) {
                if (icon.classList.contains('fa-facebook')) platform = 'facebook';
                else if (icon.classList.contains('fa-instagram')) platform = 'instagram';
                else if (icon.classList.contains('fa-twitter')) platform = 'twitter';
                else if (icon.classList.contains('fa-youtube')) platform = 'youtube';
            }
            
            if (platform) {
                showSocialMediaPopup(platform);
            }
        });
    });
}

// Initialize video player
document.addEventListener('DOMContentLoaded', function() {
    initializeVideoPlayer();
    initializeCookieConsent();
    initializeSocialMediaLinks();
});
