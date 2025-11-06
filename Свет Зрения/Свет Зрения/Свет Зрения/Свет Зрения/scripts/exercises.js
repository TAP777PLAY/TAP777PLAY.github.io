// Exercises page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Timer functionality
    let timerInterval = null;
    let timerSeconds = 1200; // 20 minutes default
    const timerDisplay = document.getElementById('timer-display');
    const startTimerBtn = document.getElementById('start-timer');
    const resetTimerBtn = document.getElementById('reset-timer');
    const timerPresets = document.querySelectorAll('.timer-preset');
    let isTimerRunning = false;

    function updateTimerDisplay() {
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer() {
        if (isTimerRunning) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            startTimerBtn.textContent = 'Начать';
            return;
        }

        if (timerSeconds <= 0) {
            timerSeconds = 1200; // Reset to 20 minutes if 0
        }

        isTimerRunning = true;
        startTimerBtn.textContent = 'Пауза';

        timerInterval = setInterval(function() {
            timerSeconds--;
            updateTimerDisplay();

            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                startTimerBtn.textContent = 'Начать';
                playNotificationSound();
                alert('Время паузы истекло! Сделайте упражнения для глаз.');
            }
        }, 1000);
    }

    function resetTimer() {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timerSeconds = 1200;
        updateTimerDisplay();
        startTimerBtn.textContent = 'Начать';
    }

    if (startTimerBtn) {
        startTimerBtn.addEventListener('click', startTimer);
    }

    if (resetTimerBtn) {
        resetTimerBtn.addEventListener('click', resetTimer);
    }

    // Timer presets
    timerPresets.forEach(preset => {
        preset.addEventListener('click', function() {
            const time = parseInt(this.getAttribute('data-time'));
            timerSeconds = time;
            updateTimerDisplay();
            
            // Update active state
            timerPresets.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Initialize timer display
    updateTimerDisplay();

    // Eye gymnastics animation
    const eyeFollower = document.getElementById('eye-follower');
    const startGymnasticsBtn = document.getElementById('start-gymnastics');
    const stopGymnasticsBtn = document.getElementById('stop-gymnastics');
    let gymnasticsInterval = null;

    function startGymnastics() {
        if (eyeFollower.classList.contains('active')) {
            return;
        }

        eyeFollower.classList.add('active');

        // Play sound at the end of each cycle (8 seconds per cycle)
        gymnasticsInterval = setInterval(function() {
            playNotificationSound();
        }, 8000); // 8 seconds per cycle
    }

    function stopGymnastics() {
        eyeFollower.classList.remove('active');
        if (gymnasticsInterval) {
            clearInterval(gymnasticsInterval);
            gymnasticsInterval = null;
        }
    }

    if (startGymnasticsBtn) {
        startGymnasticsBtn.addEventListener('click', startGymnastics);
    }

    if (stopGymnasticsBtn) {
        stopGymnasticsBtn.addEventListener('click', stopGymnastics);
    }

    // Sound notification function
    function playNotificationSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800; // Frequency in Hz
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            // Fallback: just log if audio context is not available
            console.log('Sound notification');
        }
    }

    // Accordion functionality
    const accordionButtons = document.querySelectorAll('.tips-myths .accordion-btn');
    
    accordionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all accordions
            accordionButtons.forEach(b => {
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
});

