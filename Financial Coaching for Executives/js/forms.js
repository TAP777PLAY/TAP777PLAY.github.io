(function() {
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const note = form.querySelector('.form__note');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const message = String(data.get('message') || '').trim();

      if (!name || !email || !message) {
        note.textContent = 'Please fill in all fields.';
        return;
      }
      if (!isValidEmail(email)) {
        note.textContent = 'Please enter a valid email address.';
        return;
      }

      note.textContent = 'Thank you. Your message has been sent (demo).';
      form.reset();
    });
  });
})();


