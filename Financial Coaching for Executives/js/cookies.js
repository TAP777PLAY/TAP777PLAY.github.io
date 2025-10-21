(function() {
  'use strict';

  const STORAGE_KEY = 'cookie-consent-2025';
  const CONSENT_VERSION = '1.0';
  
  // Cookie categories
  const COOKIE_CATEGORIES = {
    essential: {
      name: 'Essential',
      description: 'Required for basic site functionality',
      required: true,
      enabled: true
    },
    analytics: {
      name: 'Analytics',
      description: 'Help us understand how visitors interact with our website',
      required: false,
      enabled: false
    },
    marketing: {
      name: 'Marketing',
      description: 'Used to deliver relevant advertisements',
      required: false,
      enabled: false
    },
    preferences: {
      name: 'Preferences',
      description: 'Remember your settings and preferences',
      required: false,
      enabled: false
    }
  };

  let banner = null;
  let settingsModal = null;

  // Check if consent is already given
  function hasConsent() {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) return false;
    
    try {
      const data = JSON.parse(consent);
      return data.version === CONSENT_VERSION && data.timestamp;
    } catch {
      return false;
    }
  }

  // Get current consent data
  function getConsentData() {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) return null;
    
    try {
      return JSON.parse(consent);
    } catch {
      return null;
    }
  }

  // Save consent data
  function saveConsent(categories) {
    const consentData = {
      version: CONSENT_VERSION,
      timestamp: Date.now(),
      categories: categories,
      accepted: true
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consentData));
    
    // Trigger consent event
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', {
      detail: consentData
    }));
  }

  // Create main cookie banner
  function createBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'cookie-banner-title');
    banner.setAttribute('aria-describedby', 'cookie-banner-description');
    
    banner.innerHTML = `
      <div class="cookie-banner__inner">
        <div class="cookie-banner__content">
          <h3 id="cookie-banner-title" class="cookie-banner__title">🍪 We use cookies</h3>
          <p id="cookie-banner-description" class="cookie-banner__description">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies.
          </p>
        </div>
        <div class="cookie-banner__actions">
          <button class="btn btn--secondary cookie-banner__btn" data-cookie-settings>
            <span class="btn__icon">⚙️</span>
            Settings
          </button>
          <button class="btn btn--primary cookie-banner__btn" data-cookie-accept-all>
            <span class="btn__icon">✅</span>
            Accept All
          </button>
          <button class="btn btn--secondary cookie-banner__btn" data-cookie-decline>
            <span class="btn__icon">❌</span>
            Decline
          </button>
        </div>
      </div>`;
    
    document.body.appendChild(banner);
    return banner;
  }

  // Create detailed settings modal
  function createSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'cookie-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'cookie-modal-title');
    modal.setAttribute('aria-modal', 'true');
    
    const categoriesHtml = Object.entries(COOKIE_CATEGORIES).map(([key, category]) => `
      <div class="cookie-category">
        <div class="cookie-category__header">
          <label class="cookie-category__label">
            <input type="checkbox" 
                   class="cookie-category__checkbox" 
                   data-category="${key}"
                   ${category.enabled ? 'checked' : ''}
                   ${category.required ? 'disabled' : ''}>
            <span class="cookie-category__name">${category.name}</span>
            ${category.required ? '<span class="cookie-category__required">Required</span>' : ''}
          </label>
        </div>
        <p class="cookie-category__description">${category.description}</p>
      </div>
    `).join('');

    modal.innerHTML = `
      <div class="cookie-modal__backdrop" data-cookie-modal-close></div>
      <div class="cookie-modal__dialog">
        <div class="cookie-modal__header">
          <h2 id="cookie-modal-title" class="cookie-modal__title">Cookie Preferences</h2>
          <button class="cookie-modal__close" data-cookie-modal-close aria-label="Close">
            <span>×</span>
          </button>
        </div>
        <div class="cookie-modal__content">
          <p class="cookie-modal__description">
            Manage your cookie preferences. You can enable or disable different types of cookies below.
          </p>
          <div class="cookie-categories">
            ${categoriesHtml}
          </div>
        </div>
        <div class="cookie-modal__actions">
          <button class="btn btn--secondary" data-cookie-save-preferences>
            <span class="btn__icon">💾</span>
            Save Preferences
          </button>
          <button class="btn btn--primary" data-cookie-accept-all-modal>
            <span class="btn__icon">✅</span>
            Accept All
          </button>
        </div>
      </div>`;
    
    document.body.appendChild(modal);
    return modal;
  }

  // Show banner with animation
  function showBanner() {
    if (banner) return;
    
    banner = createBanner();
    
    // Add animation
    requestAnimationFrame(() => {
      banner.classList.add('cookie-banner--visible');
    });
  }

  // Hide banner with animation
  function hideBanner() {
    if (!banner) return;
    
    banner.classList.add('cookie-banner--hiding');
    
    setTimeout(() => {
      if (banner && banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
      banner = null;
    }, 300);
  }

  // Show settings modal
  function showSettingsModal() {
    if (settingsModal) return;
    
    settingsModal = createSettingsModal();
    
    // Add animation
    requestAnimationFrame(() => {
      settingsModal.classList.add('cookie-modal--visible');
    });
  }

  // Hide settings modal
  function hideSettingsModal() {
    if (!settingsModal) return;
    
    settingsModal.classList.add('cookie-modal--hiding');
    
    setTimeout(() => {
      if (settingsModal && settingsModal.parentNode) {
        settingsModal.parentNode.removeChild(settingsModal);
      }
      settingsModal = null;
    }, 300);
  }

  // Get selected categories from modal
  function getSelectedCategories() {
    if (!settingsModal) return COOKIE_CATEGORIES;
    
    const checkboxes = settingsModal.querySelectorAll('.cookie-category__checkbox');
    const selected = {};
    
    Object.keys(COOKIE_CATEGORIES).forEach(key => {
      const checkbox = settingsModal.querySelector(`[data-category="${key}"]`);
      selected[key] = {
        ...COOKIE_CATEGORIES[key],
        enabled: checkbox ? checkbox.checked : COOKIE_CATEGORIES[key].enabled
      };
    });
    
    return selected;
  }

  // Handle banner clicks
  function handleBannerClick(e) {
    const target = e.target.closest('[data-cookie-accept-all]');
    const settings = e.target.closest('[data-cookie-settings]');
    const decline = e.target.closest('[data-cookie-decline]');
    
    if (target) {
      // Accept all cookies
      saveConsent(COOKIE_CATEGORIES);
      hideBanner();
    } else if (settings) {
      // Open settings modal
      hideBanner();
      showSettingsModal();
    } else if (decline) {
      // Decline non-essential cookies
      const essentialOnly = {
        essential: { ...COOKIE_CATEGORIES.essential, enabled: true },
        analytics: { ...COOKIE_CATEGORIES.analytics, enabled: false },
        marketing: { ...COOKIE_CATEGORIES.marketing, enabled: false },
        preferences: { ...COOKIE_CATEGORIES.preferences, enabled: false }
      };
      saveConsent(essentialOnly);
      hideBanner();
    }
  }

  // Handle modal clicks
  function handleModalClick(e) {
    const close = e.target.closest('[data-cookie-modal-close]');
    const save = e.target.closest('[data-cookie-save-preferences]');
    const acceptAll = e.target.closest('[data-cookie-accept-all-modal]');
    
    if (close) {
      hideSettingsModal();
      showBanner(); // Show banner again if modal is closed
    } else if (save) {
      const selected = getSelectedCategories();
      saveConsent(selected);
      hideSettingsModal();
    } else if (acceptAll) {
      saveConsent(COOKIE_CATEGORIES);
      hideSettingsModal();
    }
  }

  // Initialize cookie consent system
  function init() {
    // Don't show banner if consent already given
    if (hasConsent()) {
      console.log('Cookie consent already given');
      return;
    }
    
    // Show banner after a short delay
    setTimeout(showBanner, 1000);
    
    // Add event listeners
    document.addEventListener('click', (e) => {
      if (banner && banner.contains(e.target)) {
        handleBannerClick(e);
      } else if (settingsModal && settingsModal.contains(e.target)) {
        handleModalClick(e);
      }
    });
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && settingsModal) {
        hideSettingsModal();
        showBanner();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API for external use
  window.CookieConsent = {
    hasConsent: hasConsent,
    getConsentData: getConsentData,
    showBanner: showBanner,
    showSettings: showSettingsModal,
    reset: () => {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  };

})();


