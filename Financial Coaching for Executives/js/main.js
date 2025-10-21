// Entry point for page-specific inits if needed later
(function() {
  // Mobile navigation functionality
  class MobileNavigation {
    constructor() {
      this.header = document.querySelector('.site-header');
      this.menuBtn = document.querySelector('.site-header__menu-btn');
      this.nav = document.querySelector('.site-nav');
      this.navLinks = document.querySelectorAll('.site-nav__list a');
      this.isOpen = false;
      
      this.init();
    }
    
    init() {
      if (!this.menuBtn || !this.nav) return;
      
      this.bindEvents();
      this.handleResize();
    }
    
    bindEvents() {
      // Menu button click
      this.menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMenu();
      });
      
      // Close menu when clicking on nav links
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeMenu();
        });
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.nav.contains(e.target) && !this.menuBtn.contains(e.target)) {
          this.closeMenu();
        }
      });
      
      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeMenu();
          this.menuBtn.focus();
        }
      });
      
      // Handle window resize
      window.addEventListener('resize', () => {
        this.handleResize();
      });
      
      // Prevent body scroll when menu is open
      this.nav.addEventListener('transitionend', () => {
        if (this.isOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });
    }
    
    toggleMenu() {
      if (this.isOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    }
    
    openMenu() {
      this.isOpen = true;
      this.menuBtn.setAttribute('aria-expanded', 'true');
      this.menuBtn.setAttribute('aria-label', 'Close menu');
      this.header.classList.add('is-open');
      
      // Focus management
      const firstLink = this.nav.querySelector('a');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }
    }
    
    closeMenu() {
      this.isOpen = false;
      this.menuBtn.setAttribute('aria-expanded', 'false');
      this.menuBtn.setAttribute('aria-label', 'Open menu');
      this.header.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    
    handleResize() {
      // Close menu on desktop
      if (window.innerWidth > 768 && this.isOpen) {
        this.closeMenu();
      }
    }
  }
  
  // Initialize mobile navigation when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new MobileNavigation();
    });
  } else {
    new MobileNavigation();
  }
  
  // Smooth scrolling for anchor links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
  
  // Header scroll effect
  let lastScrollY = window.scrollY;
  const header = document.querySelector('.site-header');
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
  });
})();


