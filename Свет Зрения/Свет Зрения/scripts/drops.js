// Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    // Rest time accordion
    const restTimeAccordion = document.getElementById('rest-time-accordion');
    const restTimeContent = document.getElementById('rest-time-content');
    
    if (restTimeAccordion && restTimeContent) {
        restTimeAccordion.addEventListener('click', function() {
            this.classList.toggle('active');
            restTimeContent.classList.toggle('active');
        });
    }

    // Myths accordion
    const mythAccordions = document.querySelectorAll('.myths-accordion .accordion-btn');
    mythAccordions.forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all accordions
            mythAccordions.forEach(b => {
                b.classList.remove('active');
                b.nextElementSibling.classList.remove('active');
            });
            
            // Open clicked one if it wasn't active
            if (!isActive) {
                this.classList.add('active');
                content.classList.add('active');
            }
        });
    });

    // Fade-in animation for aroma cards
    const aromaCards = document.querySelectorAll('.aroma-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    aromaCards.forEach(card => {
        observer.observe(card);
    });

    // Poll form submission
    const pollForm = document.getElementById('eye-care-poll');
    if (pollForm) {
        pollForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const selectedOption = document.querySelector('input[name="care-method"]:checked');
            if (selectedOption) {
                alert('Спасибо за ваш ответ!');
                pollForm.reset();
            } else {
                alert('Пожалуйста, выберите вариант ответа');
            }
        });
    }

    // Popup functionality
    const addTipBtn = document.getElementById('add-tip-btn');
    const tipPopup = document.getElementById('tip-popup');
    const popupClose = document.getElementById('popup-close');
    const tipForm = document.getElementById('tip-form');

    if (addTipBtn && tipPopup) {
        addTipBtn.addEventListener('click', function() {
            tipPopup.classList.add('active');
        });
    }

    if (popupClose && tipPopup) {
        popupClose.addEventListener('click', function() {
            tipPopup.classList.remove('active');
        });
    }

    if (tipPopup) {
        tipPopup.addEventListener('click', function(e) {
            if (e.target === tipPopup) {
                tipPopup.classList.remove('active');
            }
        });
    }

    if (tipForm) {
        tipForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Спасибо за ваш совет! Мы рассмотрим его и добавим на сайт.');
            tipForm.reset();
            tipPopup.classList.remove('active');
        });
    }
});

