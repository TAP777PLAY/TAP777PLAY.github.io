(function() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  });
})();


