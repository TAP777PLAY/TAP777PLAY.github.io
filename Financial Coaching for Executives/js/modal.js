(function() {
  let lastActive = null;

  function openModal(name) {
    console.log('Opening modal:', name);
    const modal = document.querySelector(`.modal[data-modal="${name}"]`);
    if (!modal) {
      console.error('Modal not found:', name);
      return;
    }
    console.log('Modal found:', modal);
    lastActive = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
    const dialog = modal.querySelector('.modal__dialog');
    const focusable = dialog.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    (focusable || dialog).focus();
    document.body.style.overflow = 'hidden';
    console.log('Modal opened successfully');
  }

  function closeModal(modal) {
    console.log('Closing modal');
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    if (lastActive) lastActive.focus();
  }

  document.addEventListener('click', (e) => {
    console.log('Click detected on:', e.target);
    const btn = e.target.closest('[data-modal-open]');
    if (btn) { 
      console.log('Modal open button clicked:', btn.getAttribute('data-modal-open'));
      e.preventDefault(); 
      openModal(btn.getAttribute('data-modal-open')); 
      return; 
    }

    const toClose = e.target.closest('[data-modal-close]');
    if (toClose) { 
      console.log('Modal close button clicked');
      const m = toClose.closest('.modal'); 
      if (m) closeModal(m); 
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const open = document.querySelector('.modal[aria-hidden="false"]');
      if (open) closeModal(open);
    }
  });
})();


