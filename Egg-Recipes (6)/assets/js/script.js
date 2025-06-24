
      document.addEventListener('DOMContentLoaded', function() {
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
          menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
          });

          // Close menu when clicking a link
          const navLinks = navMenu.querySelectorAll('a');
          navLinks.forEach(link => {
            link.addEventListener('click', () => {
              menuToggle.classList.remove('active');
              navMenu.classList.remove('active');
            });
          });

          // Close menu when clicking outside
          document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
              menuToggle.classList.remove('active');
              navMenu.classList.remove('active');
            }
          });
        }

        // Smooth scroll to anchors
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          });
        });

        // Form submission handler
        window.handleSubmit = function(event) {
          event.preventDefault();
          const form = document.getElementById('contactForm');
          const formData = new FormData(form);
          
          // Send form data
          fetch('https://formspree.io/f/mldbzjyw', {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          }).finally(() => {
            // Always redirect to merci.html
            window.location.href = 'merci.html';
          });
        };

        // Cards and images scroll animation
        const animatedEls = document.querySelectorAll('.card, .section-image img, .about-image img');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-on-scroll');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 });
        animatedEls.forEach(el => observer.observe(el));
        
        // Initialize automatic image slideshows
        initImageGalleries();
        
        // Auto-detect and display current domain
        autoDisplayDomain();
        
        // Also call with delay for reliability
        setTimeout(autoDisplayDomain, 100);
      });
      
      // Function to initialize all image galleries on the page
      function initImageGalleries() {
        const galleries = document.querySelectorAll('.section-gallery');
        
        galleries.forEach(gallery => {
          const images = gallery.querySelectorAll('.gallery-img');
          const dots = gallery.querySelectorAll('.gallery-dot');
          let currentIndex = 0;
          let interval = null;
          
          // If there are less than 2 images, do nothing
          if (images.length < 2) return;
          
          // Function to switch slides
          function showSlide(index) {
                          // Hide all images
            images.forEach(img => img.style.display = 'none');
            
                          // Reset active dots
            dots.forEach(dot => dot.style.backgroundColor = 'rgba(255,255,255,0.5)');
            
                          // Show selected image
            if (images[index]) {
              images[index].style.display = 'block';
            }
            
                          // Update active dot
            if (dots[index]) {
              dots[index].style.backgroundColor = '#ffffff';
            }
            
            currentIndex = index;
          }
          
          // Set handlers for navigation dots
          dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
              clearInterval(interval); // Stop auto-scroll on manual switch
              showSlide(index);
                              startAutoScroll(); // Restart auto-scroll
            });
          });
          
          // Function to start auto-scroll
          function startAutoScroll() {
                          // Clear previous interval if it exists
            if (interval) {
              clearInterval(interval);
            }
            
                          // Set new interval
            interval = setInterval(() => {
              const nextIndex = (currentIndex + 1) % images.length;
              showSlide(nextIndex);
            }, 3000); // 3 seconds interval between slides
          }
          
          // Add handlers to stop auto-scroll on hover
          gallery.addEventListener('mouseenter', () => {
            clearInterval(interval);
          });
          
          gallery.addEventListener('mouseleave', () => {
            startAutoScroll();
          });
          
          // Start auto-scroll on load
          startAutoScroll();
          
          // Add swipe on mobile devices
          let touchStartX = 0;
          let touchEndX = 0;
          
          gallery.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
          }, false);
          
          gallery.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
          }, false);
          
          function handleSwipe() {
            if (touchEndX < touchStartX) {
              // Swipe left - next slide
              clearInterval(interval);
              showSlide((currentIndex + 1) % images.length);
              startAutoScroll();
            } else if (touchEndX > touchStartX) {
              // Swipe right - previous slide
              clearInterval(interval);
              showSlide((currentIndex - 1 + images.length) % images.length);
              startAutoScroll();
            }
          }
        });
      }
      
      // Function to automatically detect and display current domain
      function autoDisplayDomain() {
        // Get current domain from browser
        const currentDomain = window.location.hostname;
        console.log('Current domain detected:', currentDomain);
        
        // Skip if localhost or IP address
        if (currentDomain === 'localhost' || 
            currentDomain === '127.0.0.1' || 
            currentDomain.includes('192.168.') ||
            currentDomain.includes('10.0.') ||
            /^d+.d+.d+.d+$/.test(currentDomain)) {
          console.log('Skipping domain display for localhost/IP');
          return;
        }
        
        console.log('Auto-displaying domain:', currentDomain);
        
        // Find domain display element in header
        const domainElement = document.querySelector('.domain, .site-domain');
        
        if (domainElement) {
          // Update existing domain element
          domainElement.textContent = currentDomain;
          domainElement.style.display = 'block';
          console.log('Updated header domain element');
        } else {
          // Create new domain element if it doesn't exist
          const sitebranding = document.querySelector('.site-branding');
          if (sitebranding) {
            const domainDiv = document.createElement('div');
            domainDiv.className = 'domain';
            domainDiv.textContent = currentDomain;
            domainDiv.style.cssText = 'color: inherit; opacity: 0.8; font-size: 0.9rem; margin-top: 4px;';
            sitebranding.appendChild(domainDiv);
            console.log('Created new header domain element');
          }
        }
        
        // Update contact domain elements
        const allContactDomainElements = document.querySelectorAll('.contact-domain');
        console.log('Found contact domain elements:', allContactDomainElements.length);
        
        allContactDomainElements.forEach((domainElement, index) => {
          const oldText = domainElement.textContent;
          domainElement.textContent = currentDomain;
          domainElement.style.display = 'block'; // Show the element like in header
          console.log('Updated contact domain element', index + 1, 'from:', oldText, 'to:', currentDomain);
        });
        
        // Update footer domain elements
        const allFooterDomainElements = document.querySelectorAll('.footer-domain');
        console.log('Found footer domain elements:', allFooterDomainElements.length);
        
        allFooterDomainElements.forEach((domainElement, index) => {
          const oldText = domainElement.textContent;
          domainElement.textContent = currentDomain;
          domainElement.style.display = 'block'; // Show the element like in header
          console.log('Updated footer domain element', index + 1, 'from:', oldText, 'to:', currentDomain);
        });
        
        // Update any other domain references on the page
        const domainPlaceholders = document.querySelectorAll('[data-auto-domain]');
        domainPlaceholders.forEach(element => {
          element.textContent = currentDomain;
        });
        
        // Update contact email if it contains placeholder domain
        const emailElements = document.querySelectorAll('a[href*="@"], [data-email]');
        emailElements.forEach(element => {
          const href = element.getAttribute('href') || '';
          const text = element.textContent || '';
          
          if (href.includes('@example.com') || text.includes('@example.com')) {
            const newHref = href.replace('@example.com', `@${currentDomain}`);
            const newText = text.replace('@example.com', `@${currentDomain}`);
            
            if (href !== newHref) element.setAttribute('href', newHref);
            if (text !== newText) element.textContent = newText;
          }
        });
      }
    