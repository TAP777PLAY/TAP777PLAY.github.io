// Игра на память с карточками богов Олимпа
class MemoryGame {
    constructor() {
        this.gods = [
            'Зевс', 'Посейдон', 'Аид', 'Аполлон',
            'Афина', 'Арес', 'Афродита', 'Артемида'
        ];
        
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.startTime = null;
        this.gameTimer = null;
        this.gameStarted = false;
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.elements = {
            startBtn: document.getElementById('memory-start-btn'),
            restartBtn: document.getElementById('memory-restart-btn'),
            restartFinalBtn: document.getElementById('memory-restart-final-btn'),
            memoryBoard: document.getElementById('memory-board'),
            memoryGame: document.getElementById('memory-game'),
            memoryResults: document.getElementById('memory-results'),
            score: document.getElementById('memory-score'),
            moves: document.getElementById('memory-moves'),
            time: document.getElementById('memory-time'),
            progressText: document.getElementById('memory-progress-text'),
            finalTime: document.getElementById('final-time'),
            finalMoves: document.getElementById('final-moves'),
            finalScore: document.getElementById('final-score'),
            finalRating: document.getElementById('final-rating'),
            resultsMessage: document.getElementById('memory-results-message')
        };
    }

    bindEvents() {
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.restartBtn.addEventListener('click', () => this.restartGame());
        this.elements.restartFinalBtn.addEventListener('click', () => this.restartGame());
    }

    startGame() {
        this.gameStarted = true;
        this.moves = 0;
        this.score = 0;
        this.matchedPairs = 0;
        this.flippedCards = [];
        this.startTime = Date.now();
        
        this.elements.startBtn.style.display = 'none';
        this.elements.restartBtn.style.display = 'inline-block';
        this.elements.memoryResults.style.display = 'none';
        this.elements.memoryGame.style.display = 'block';
        
        this.createCards();
        this.updateStats();
        this.startTimer();
    }

    createCards() {
        // Создаем пары карточек
        this.cards = [];
        const pairs = [...this.gods, ...this.gods]; // Дублируем для пар
        
        // Перемешиваем карточки
        for (let i = pairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
        }
        
        this.elements.memoryBoard.innerHTML = '';
        
        pairs.forEach((god, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.god = god;
            card.dataset.index = index;
            card.textContent = '?';
            card.addEventListener('click', () => this.flipCard(card));
            this.elements.memoryBoard.appendChild(card);
            this.cards.push(card);
        });
    }

    flipCard(card) {
        if (!this.gameStarted || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        card.textContent = card.dataset.god;
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            this.checkMatch();
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.dataset.god === card2.dataset.god) {
            // Найдена пара
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.matchedPairs++;
            this.score += 50;
            this.updateProgress();
            
            if (this.matchedPairs === this.gods.length) {
                this.endGame();
            }
        } else {
            // Не совпадают
            card1.classList.add('wrong');
            card2.classList.add('wrong');
            
            setTimeout(() => {
                card1.classList.remove('flipped', 'wrong');
                card2.classList.remove('flipped', 'wrong');
                card1.textContent = '?';
                card2.textContent = '?';
            }, 1000);
        }
        
        this.flippedCards = [];
    }

    startTimer() {
        this.gameTimer = setInterval(() => {
            if (this.gameStarted) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                this.elements.time.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    endGame() {
        this.gameStarted = false;
        clearInterval(this.gameTimer);
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Бонус за скорость
        const timeBonus = Math.max(0, 300 - elapsed) * 2; // Бонус за быстрое прохождение
        this.score += timeBonus;
        
        // Бонус за малое количество ходов
        const moveBonus = Math.max(0, 16 - this.moves) * 10; // Бонус за эффективность
        this.score += moveBonus;
        
        this.elements.memoryGame.style.display = 'none';
        this.elements.memoryResults.style.display = 'block';
        
        this.elements.finalTime.textContent = timeString;
        this.elements.finalMoves.textContent = this.moves;
        this.elements.finalScore.textContent = this.score;
        this.elements.finalRating.textContent = this.getRating(this.moves, elapsed);
        
        const message = this.getResultMessage(this.moves, elapsed);
        this.elements.resultsMessage.textContent = message;
    }

    getRating(moves, time) {
        const efficiency = (this.gods.length * 2) / moves; // Идеально: 8 ходов для 8 пар
        const speed = 300 / time; // Идеально: 5 минут
        
        if (efficiency >= 0.8 && speed >= 0.6) return 'Мастер памяти';
        if (efficiency >= 0.7 && speed >= 0.5) return 'Эксперт';
        if (efficiency >= 0.6 && speed >= 0.4) return 'Профи';
        if (efficiency >= 0.5 && speed >= 0.3) return 'Хорошо';
        if (efficiency >= 0.4 && speed >= 0.2) return 'Новичок';
        return 'Начинающий';
    }

    getResultMessage(moves, time) {
        const efficiency = (this.gods.length * 2) / moves;
        const speed = 300 / time;
        
        if (efficiency >= 0.8 && speed >= 0.6) {
            return 'Невероятно! Вы настоящий мастер памяти! Ваша скорость и точность поражают!';
        } else if (efficiency >= 0.7 && speed >= 0.5) {
            return 'Превосходно! Вы отлично справились с задачей! Ваша память работает великолепно!';
        } else if (efficiency >= 0.6 && speed >= 0.4) {
            return 'Отлично! Хорошая работа! Продолжайте тренировать память!';
        } else if (efficiency >= 0.5 && speed >= 0.3) {
            return 'Хорошо! Неплохой результат! Тренируйтесь дальше для улучшения!';
        } else if (efficiency >= 0.4 && speed >= 0.2) {
            return 'Неплохо для начала! Продолжайте тренировать память!';
        } else {
            return 'Это хорошее начало! Тренируйте память регулярно для улучшения результатов!';
        }
    }

    updateStats() {
        this.elements.score.textContent = this.score;
        this.elements.moves.textContent = this.moves;
    }

    updateProgress() {
        const progress = Math.round((this.matchedPairs / this.gods.length) * 100);
        this.elements.progressText.textContent = `Найдено пар: ${this.matchedPairs}/${this.gods.length} (${progress}%)`;
    }

    restartGame() {
        this.elements.startBtn.style.display = 'inline-block';
        this.elements.restartBtn.style.display = 'none';
        this.elements.memoryResults.style.display = 'none';
        this.elements.memoryGame.style.display = 'block';
        
        this.elements.memoryBoard.innerHTML = '';
        this.elements.progressText.textContent = 'Найдите все пары карточек!';
        this.elements.score.textContent = '0';
        this.elements.moves.textContent = '0';
        this.elements.time.textContent = '00:00';
        
        this.gameStarted = false;
        this.moves = 0;
        this.score = 0;
        this.matchedPairs = 0;
        this.flippedCards = [];
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    new MemoryGame();
});
