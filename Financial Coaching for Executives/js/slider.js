(function() {
  function initSlider(root) {
    const track = root.querySelector('.slider__track');
    const slides = Array.from(root.querySelectorAll('.slide'));
    const prevBtn = root.querySelector('.slider__btn--prev');
    const nextBtn = root.querySelector('.slider__btn--next');
    const dots = root.querySelector('.slider__dots');
    if (!track || slides.length === 0) return;

    let index = 0;
    let autoplay = root.dataset.autoplay === 'true';
    let intervalId = null;

    // Dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => goTo(i));
      dots && dots.appendChild(dot);
    });

    function update() {
      track.style.transform = `translateX(${-index * 100}%)`;
      const allDots = dots ? Array.from(dots.children) : [];
      allDots.forEach((d, i) => d.setAttribute('aria-selected', i === index ? 'true' : 'false'));
    }

    function goTo(i) { index = (i + slides.length) % slides.length; update(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    prevBtn && prevBtn.addEventListener('click', prev);
    nextBtn && nextBtn.addEventListener('click', next);

    function startAutoplay() { if (!autoplay || intervalId) return; intervalId = setInterval(next, 5000); }
    function stopAutoplay() { if (intervalId) { clearInterval(intervalId); intervalId = null; } }

    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', startAutoplay);

    update();
    startAutoplay();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.slider').forEach(initSlider);
  });
})();


