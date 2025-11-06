// Cookie Popup Management
(function() {
    'use strict';

    const COOKIE_NAME = 'cookie_consent';
    const COOKIE_EXPIRY_DAYS = 365;

    // Check if user has already given consent
    function hasConsent() {
        return getCookie(COOKIE_NAME) === 'accepted';
    }

    // Get cookie value
    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Set cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + date.toUTCString();
        document.cookie = name + '=' + value + ';' + expires + ';path=/';
    }

    // Show cookie popup
    function showCookiePopup() {
        const popup = document.getElementById('cookie-popup');
        if (popup) {
            popup.classList.add('active');
        }
    }

    // Hide cookie popup
    function hideCookiePopup() {
        const popup = document.getElementById('cookie-popup');
        if (popup) {
            popup.classList.remove('active');
        }
    }

    // Accept cookies
    function acceptCookies() {
        setCookie(COOKIE_NAME, 'accepted', COOKIE_EXPIRY_DAYS);
        hideCookiePopup();
    }

    // Decline cookies
    function declineCookies() {
        setCookie(COOKIE_NAME, 'declined', COOKIE_EXPIRY_DAYS);
        hideCookiePopup();
    }

    // Initialize cookie popup
    function initCookiePopup() {
        if (!hasConsent()) {
            // Show popup after a short delay
            setTimeout(showCookiePopup, 1000);
        }

        // Attach event listeners
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', acceptCookies);
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', declineCookies);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookiePopup);
    } else {
        initCookiePopup();
    }
})();

