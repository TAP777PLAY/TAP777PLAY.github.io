(function() {
  'use strict';

  function toggle(panel, trigger, expand) {
    const willOpen = expand !== undefined ? expand : panel.hasAttribute('hidden');
    trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    
    if (willOpen) {
      panel.removeAttribute('hidden');
      panel.setAttribute('aria-expanded', 'true');
      // Add animation class for smooth opening
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.setAttribute('aria-expanded', 'false');
      panel.style.maxHeight = '0px';
      // wait for transition to finish then hide for a11y
      panel.addEventListener('transitionend', function onEnd() {
        panel.setAttribute('hidden', '');
        panel.removeEventListener('transitionend', onEnd);
      }, { once: true });
    }
  }

  function initAccordion(root) {
    const triggers = root.querySelectorAll('.accordion__trigger');
    
    triggers.forEach(btn => {
      const panelId = btn.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      
      if (!panel) {
        console.warn('Accordion panel not found:', panelId);
        return;
      }

      // Ensure all panels start closed
      panel.setAttribute('hidden', '');
      panel.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-expanded', 'false');

      // Add click handler
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggle(panel, btn);
      });

      // Add keyboard navigation
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const arr = Array.from(triggers);
          const idx = arr.indexOf(btn);
          const next = e.key === 'ArrowDown' ? arr[idx + 1] || arr[0] : arr[idx - 1] || arr[arr.length - 1];
          next.focus();
        }
        
        // Enter and Space to toggle
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle(panel, btn);
        }
      });
    });
  }

  // Initialize accordions when DOM is ready
  function init() {
    const accordionElements = document.querySelectorAll('[data-accordion]');
    
    if (accordionElements.length === 0) {
      console.warn('No accordion elements found');
      return;
    }

    accordionElements.forEach(initAccordion);
    console.log('Accordions initialized:', accordionElements.length);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.AccordionDebug = {
    init: init,
    toggle: toggle
  };
})();


