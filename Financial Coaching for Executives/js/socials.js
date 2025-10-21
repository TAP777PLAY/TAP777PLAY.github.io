(function() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-socials-popup]');
    if (btn) {
      const popup = btn.parentElement.querySelector('.socials__popup');
      if (!popup) return;
      const open = popup.getAttribute('aria-hidden') === 'false';
      popup.setAttribute('aria-hidden', open ? 'true' : 'false');
      return;
    }
    const close = e.target.closest('[data-socials-close]');
    if (close) {
      const popup = close.closest('.socials__popup');
      if (popup) popup.setAttribute('aria-hidden', 'true');
    }
  });
})();


