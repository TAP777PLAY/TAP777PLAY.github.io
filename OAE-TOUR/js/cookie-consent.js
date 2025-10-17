/**
 * Cookie Consent Management System
 * Handles cookie acceptance, rejection, and settings through localStorage
 */

class CookieConsent {
    constructor() {
        this.storageKey = 'safari_breakfasts_cookie_consent';
        this.cookieSettings = {
            necessary: true, // Always true, cannot be disabled
            analytics: false,
            marketing: false,
            preferences: false
        };
        
        this.init();
    }

    init() {
        // Check if user has already made a choice
        const savedConsent = this.getSavedConsent();
        
        if (savedConsent === null) {
            // Show cookie consent modal if no choice has been made
            this.showConsentModal();
        } else {
            // Apply saved settings
            this.cookieSettings = { ...this.cookieSettings, ...savedConsent };
            this.applyCookieSettings();
        }

        // Add event listeners
        this.addEventListeners();
    }

    showConsentModal() {
        // Create and show the cookie consent modal
        const modalHTML = this.createConsentModalHTML();
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal with animation
        setTimeout(() => {
            const overlay = document.querySelector('.cookie-consent-overlay');
            if (overlay) {
                overlay.classList.add('show');
            }
        }, 100);
    }

    createConsentModalHTML() {
        return `
            <div class="cookie-consent-overlay" id="cookieConsentOverlay">
                <div class="cookie-consent-modal">
                    <div class="cookie-consent-header">
                        <h2 class="cookie-consent-title">🍪 Cookie Preferences</h2>
                        <p class="cookie-consent-subtitle">We use cookies to enhance your experience on our website</p>
                    </div>
                    
                    <div class="cookie-consent-content">
                        <p class="cookie-consent-text">
                            Safari Breakfasts UAE uses cookies to provide you with the best possible experience. 
                            We respect your privacy and give you control over your data.
                        </p>
                        
                        <ul class="cookie-consent-features">
                            <li>Essential cookies for website functionality</li>
                            <li>Analytics to improve our services</li>
                            <li>Marketing to show relevant content</li>
                            <li>Preferences to remember your choices</li>
                        </ul>
                    </div>
                    
                    <div class="cookie-consent-actions">
                        <button class="cookie-consent-btn decline" id="declineCookies">Decline All</button>
                        <button class="cookie-consent-btn settings" id="cookieSettings">Customize</button>
                        <button class="cookie-consent-btn accept" id="acceptAllCookies">Accept All</button>
                    </div>
                    
                    <div class="cookie-consent-footer">
                        <a href="cookie-policy.html" target="_blank">Learn more about our cookie policy</a>
                    </div>
                </div>
            </div>
            
            <div class="cookie-settings-modal" id="cookieSettingsModal">
                <div class="cookie-settings-content">
                    <div class="cookie-settings-header">
                        <h3 class="cookie-settings-title">Cookie Settings</h3>
                        <button class="cookie-settings-close" id="closeSettings">&times;</button>
                    </div>
                    
                    <div class="cookie-settings-body">
                        <div class="cookie-setting-item">
                            <div class="cookie-setting-info">
                                <h4>Necessary Cookies</h4>
                                <p>Essential for website functionality. Cannot be disabled.</p>
                            </div>
                            <div class="cookie-toggle active" data-setting="necessary">
                                <input type="checkbox" checked disabled style="display: none;">
                            </div>
                        </div>
                        
                        <div class="cookie-setting-item">
                            <div class="cookie-setting-info">
                                <h4>Analytics Cookies</h4>
                                <p>Help us understand how visitors interact with our website.</p>
                            </div>
                            <div class="cookie-toggle" data-setting="analytics">
                                <input type="checkbox" style="display: none;">
                            </div>
                        </div>
                        
                        <div class="cookie-setting-item">
                            <div class="cookie-setting-info">
                                <h4>Marketing Cookies</h4>
                                <p>Used to deliver relevant advertisements and marketing campaigns.</p>
                            </div>
                            <div class="cookie-toggle" data-setting="marketing">
                                <input type="checkbox" style="display: none;">
                            </div>
                        </div>
                        
                        <div class="cookie-setting-item">
                            <div class="cookie-setting-info">
                                <h4>Preference Cookies</h4>
                                <p>Remember your choices and preferences for a better experience.</p>
                            </div>
                            <div class="cookie-toggle" data-setting="preferences">
                                <input type="checkbox" style="display: none;">
                            </div>
                        </div>
                    </div>
                    
                    <div class="cookie-settings-actions">
                        <button class="cookie-consent-btn decline" id="saveSettings">Save Preferences</button>
                        <button class="cookie-consent-btn accept" id="acceptAllSettings">Accept All</button>
                    </div>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
            this.bindEvents();
        });
        
        // If DOM is already loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.bindEvents();
            });
        } else {
            this.bindEvents();
        }
    }

    bindEvents() {
        // Accept all cookies
        const acceptAllBtn = document.getElementById('acceptAllCookies');
        if (acceptAllBtn) {
            acceptAllBtn.addEventListener('click', () => {
                this.acceptAllCookies();
            });
        }

        // Decline all cookies
        const declineBtn = document.getElementById('declineCookies');
        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                this.declineAllCookies();
            });
        }

        // Open settings modal
        const settingsBtn = document.getElementById('cookieSettings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSettingsModal();
            });
        }

        // Close settings modal
        const closeSettingsBtn = document.getElementById('closeSettings');
        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', () => {
                this.hideSettingsModal();
            });
        }

        // Save custom settings
        const saveSettingsBtn = document.getElementById('saveSettings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.saveCustomSettings();
            });
        }

        // Accept all from settings
        const acceptAllSettingsBtn = document.getElementById('acceptAllSettings');
        if (acceptAllSettingsBtn) {
            acceptAllSettingsBtn.addEventListener('click', () => {
                this.acceptAllCookies();
            });
        }

        // Toggle cookie settings
        const toggles = document.querySelectorAll('.cookie-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const setting = e.currentTarget.dataset.setting;
                if (setting !== 'necessary') {
                    this.toggleSetting(setting);
                }
            });
        });

        // Close modal when clicking outside
        const overlay = document.getElementById('cookieConsentOverlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.hideConsentModal();
                }
            });
        }
    }

    acceptAllCookies() {
        this.cookieSettings = {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true
        };
        
        this.saveConsent();
        this.applyCookieSettings();
        this.hideConsentModal();
        this.hideSettingsModal();
        this.showNotification('All cookies accepted!', 'success');
    }

    declineAllCookies() {
        this.cookieSettings = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false
        };
        
        this.saveConsent();
        this.applyCookieSettings();
        this.hideConsentModal();
        this.hideSettingsModal();
        this.showNotification('Only necessary cookies enabled', 'info');
    }

    showSettingsModal() {
        const settingsModal = document.getElementById('cookieSettingsModal');
        if (settingsModal) {
            settingsModal.classList.add('show');
            this.updateSettingsUI();
        }
    }

    hideSettingsModal() {
        const settingsModal = document.getElementById('cookieSettingsModal');
        if (settingsModal) {
            settingsModal.classList.remove('show');
        }
    }

    updateSettingsUI() {
        const toggles = document.querySelectorAll('.cookie-toggle');
        toggles.forEach(toggle => {
            const setting = toggle.dataset.setting;
            if (this.cookieSettings[setting]) {
                toggle.classList.add('active');
            } else {
                toggle.classList.remove('active');
            }
        });
    }

    toggleSetting(setting) {
        if (setting !== 'necessary') {
            this.cookieSettings[setting] = !this.cookieSettings[setting];
            const toggle = document.querySelector(`[data-setting="${setting}"]`);
            if (toggle) {
                toggle.classList.toggle('active');
            }
        }
    }

    saveCustomSettings() {
        this.saveConsent();
        this.applyCookieSettings();
        this.hideConsentModal();
        this.hideSettingsModal();
        this.showNotification('Cookie preferences saved!', 'success');
    }

    saveConsent() {
        const consentData = {
            ...this.cookieSettings,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(consentData));
        } catch (error) {
            console.error('Failed to save cookie consent:', error);
        }
    }

    getSavedConsent() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const consentData = JSON.parse(saved);
                return {
                    necessary: true, // Always true
                    analytics: consentData.analytics || false,
                    marketing: consentData.marketing || false,
                    preferences: consentData.preferences || false
                };
            }
        } catch (error) {
            console.error('Failed to load cookie consent:', error);
        }
        return null;
    }

    applyCookieSettings() {
        // Apply analytics cookies
        if (this.cookieSettings.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }

        // Apply marketing cookies
        if (this.cookieSettings.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }

        // Apply preference cookies
        if (this.cookieSettings.preferences) {
            this.enablePreferences();
        } else {
            this.disablePreferences();
        }

        // Always enable necessary cookies
        this.enableNecessary();
    }

    enableAnalytics() {
        // Google Analytics or other analytics tools
        console.log('Analytics cookies enabled');
        // Add your analytics code here
    }

    disableAnalytics() {
        console.log('Analytics cookies disabled');
        // Disable analytics tracking
    }

    enableMarketing() {
        console.log('Marketing cookies enabled');
        // Add marketing tracking code here
    }

    disableMarketing() {
        console.log('Marketing cookies disabled');
        // Disable marketing tracking
    }

    enablePreferences() {
        console.log('Preference cookies enabled');
        // Save user preferences
    }

    disablePreferences() {
        console.log('Preference cookies disabled');
        // Clear saved preferences
    }

    enableNecessary() {
        console.log('Necessary cookies enabled');
        // Essential functionality
    }

    hideConsentModal() {
        const overlay = document.getElementById('cookieConsentOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `cookie-notification cookie-notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#00E0A4' : type === 'error' ? '#FF70C6' : '#8A7CFF',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
            zIndex: '10002',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Public method to reset cookie consent
    resetConsent() {
        localStorage.removeItem(this.storageKey);
        this.cookieSettings = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false
        };
        this.showConsentModal();
    }

    // Public method to get current settings
    getCurrentSettings() {
        return { ...this.cookieSettings };
    }
}

// Initialize cookie consent when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cookieConsent = new CookieConsent();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookieConsent;
}
