// Головоломка Древнего Олимпа
class OlympusPuzzle {
    constructor() {
        this.questions = [
            {
                question: "Кто является верховным богом Олимпа?",
                answers: ["Зевс", "Посейдон", "Аид", "Аполлон"],
                correct: 0
            },
            {
                question: "Какой бог управляет подземным миром?",
                answers: ["Зевс", "Посейдон", "Аид", "Гермес"],
                correct: 2
            },
            {
                question: "Кто является богом моря?",
                answers: ["Зевс", "Посейдон", "Аид", "Гефест"],
                correct: 1
            },
            {
                question: "Какая богиня является покровительницей мудрости?",
                answers: ["Афродита", "Афина", "Артемида", "Гера"],
                correct: 1
            },
            {
                question: "Кто является богом войны?",
                answers: ["Аполлон", "Арес", "Гермес", "Дионис"],
                correct: 1
            },
            {
                question: "Какая богиня является покровительницей любви?",
                answers: ["Афина", "Артемида", "Афродита", "Гера"],
                correct: 2
            },
            {
                question: "Кто является богом солнца?",
                answers: ["Аполлон", "Гелиос", "Зевс", "Гермес"],
                correct: 0
            },
            {
                question: "Какая богиня является покровительницей охоты?",
                answers: ["Афина", "Артемида", "Афродита", "Гера"],
                correct: 1
            },
            {
                question: "Кто является богом торговли и путешествий?",
                answers: ["Аполлон", "Арес", "Гермес", "Дионис"],
                correct: 2
            },
            {
                question: "Какая богиня является покровительницей семьи и брака?",
                answers: ["Афина", "Артемида", "Афродита", "Гера"],
                correct: 3
            },
            {
                question: "Кто является богом огня и кузнечного дела?",
                answers: ["Аполлон", "Гефест", "Арес", "Дионис"],
                correct: 1
            },
            {
                question: "Какая богиня является покровительницей плодородия?",
                answers: ["Деметра", "Афина", "Артемида", "Гера"],
                correct: 0
            },
            {
                question: "Кто является богом вина и веселья?",
                answers: ["Аполлон", "Арес", "Дионис", "Гермес"],
                correct: 2
            },
            {
                question: "Какая богиня является покровительницей домашнего очага?",
                answers: ["Афина", "Гестия", "Артемида", "Афродита"],
                correct: 1
            },
            {
                question: "Кто является богом-вестником богов?",
                answers: ["Аполлон", "Арес", "Гермес", "Дионис"],
                correct: 2
            },
            {
                question: "Какая богиня является покровительницей справедливой войны?",
                answers: ["Афродита", "Афина", "Артемида", "Гера"],
                correct: 1
            },
            {
                question: "Кто является богом-покровителем искусств?",
                answers: ["Аполлон", "Арес", "Гермес", "Дионис"],
                correct: 0
            },
            {
                question: "Какая богиня является покровительницей луны?",
                answers: ["Афина", "Артемида", "Афродита", "Гера"],
                correct: 1
            },
            {
                question: "Кто является богом-покровителем виноделия?",
                answers: ["Аполлон", "Арес", "Дионис", "Гермес"],
                correct: 2
            },
            {
                question: "Какая богиня является покровительницей брака?",
                answers: ["Афина", "Артемида", "Афродита", "Гера"],
                correct: 3
            },
            {
                question: "Кто является богом-покровителем медицины?",
                answers: ["Аполлон", "Асклепий", "Гермес", "Дионис"],
                correct: 1
            },
            {
                question: "Какая богиня является покровительницей земледелия?",
                answers: ["Деметра", "Афина", "Артемида", "Гера"],
                correct: 0
            },
            {
                question: "Кто является богом-покровителем музыки?",
                answers: ["Аполлон", "Арес", "Гермес", "Дионис"],
                correct: 0
            },
            {
                question: "Какая богиня является покровительницей деторождения?",
                answers: ["Афина", "Артемида", "Афродита", "Гера"],
                correct: 1
            },
            {
                question: "Кто является богом-покровителем оракулов?",
                answers: ["Аполлон", "Арес", "Гермес", "Дионис"],
                correct: 0
            }
        ];

        this.currentQuestion = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.gameStarted = false;
        this.answered = false;
        this.streak = 0; // Серия правильных ответов
        this.maxStreak = 0; // Максимальная серия
        this.totalQuestions = this.questions.length;

        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.elements = {
            startBtn: document.getElementById('start-btn'),
            nextBtn: document.getElementById('next-btn'),
            restartBtn: document.getElementById('restart-btn'),
            restartFinalBtn: document.getElementById('restart-final-btn'),
            questionText: document.getElementById('question-text'),
            questionImage: document.getElementById('question-image'),
            answersContainer: document.getElementById('answers-container'),
            score: document.getElementById('score'),
            questionNumber: document.getElementById('question-number'),
            level: document.getElementById('level'),
            progressFill: document.getElementById('progress-fill'),
            progressText: document.getElementById('progress-text'),
            puzzleGame: document.getElementById('puzzle-game'),
            resultsContainer: document.getElementById('results-container'),
            correctAnswers: document.getElementById('correct-answers'),
            finalLevel: document.getElementById('final-level'),
            finalScore: document.getElementById('final-score'),
            maxStreak: document.getElementById('max-streak'),
            percentage: document.getElementById('percentage'),
            resultsMessage: document.getElementById('results-message')
        };
    }

    bindEvents() {
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.elements.restartBtn.addEventListener('click', () => this.restartGame());
        this.elements.restartFinalBtn.addEventListener('click', () => this.restartGame());
    }

    startGame() {
        this.gameStarted = true;
        this.currentQuestion = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.answered = false;

        this.elements.startBtn.style.display = 'none';
        this.elements.nextBtn.style.display = 'none';
        this.elements.restartBtn.style.display = 'none';
        this.elements.resultsContainer.style.display = 'none';
        this.elements.puzzleGame.style.display = 'block';

        this.updateStats();
        this.showQuestion();
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion];
        
        this.elements.questionText.textContent = question.question;
        this.elements.questionNumber.textContent = this.currentQuestion + 1;
        
        // Отображаем ответы в области question-image
        this.elements.questionImage.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = answer;
            button.addEventListener('click', () => this.selectAnswer(index));
            this.elements.questionImage.appendChild(button);
        });

        this.answered = false;
        this.updateProgress();
    }

    selectAnswer(selectedIndex) {
        if (this.answered) return;

        this.answered = true;
        const question = this.questions[this.currentQuestion];
        const buttons = this.elements.questionImage.querySelectorAll('.answer-btn');

        buttons.forEach((button, index) => {
            button.disabled = true;
            if (index === question.correct) {
                button.classList.add('correct');
            } else if (index === selectedIndex && index !== question.correct) {
                button.classList.add('incorrect');
            }
        });

        if (selectedIndex === question.correct) {
            this.score += 10;
            this.correctAnswers++;
            this.streak++;
            if (this.streak > this.maxStreak) {
                this.maxStreak = this.streak;
            }
            this.showCorrectAnswer();
        } else {
            this.streak = 0; // Сбрасываем серию при неправильном ответе
            this.showIncorrectAnswer();
        }

        this.updateStats();
        this.updateProgress();

        if (this.currentQuestion < this.questions.length - 1) {
            this.elements.nextBtn.style.display = 'inline-block';
        } else {
            setTimeout(() => this.showResults(), 2000);
        }
    }

    showCorrectAnswer() {
        // Простое отображение правильного ответа
        const correctBtn = this.elements.questionImage.querySelector('.correct');
        if (correctBtn) {
            correctBtn.style.background = 'rgba(0, 255, 0, 0.3)';
        }
    }

    showIncorrectAnswer() {
        // Простое отображение неправильного ответа
        const incorrectBtn = this.elements.questionImage.querySelector('.incorrect');
        if (incorrectBtn) {
            incorrectBtn.style.background = 'rgba(255, 0, 0, 0.3)';
        }
    }

    nextQuestion() {
        this.currentQuestion++;
        this.elements.nextBtn.style.display = 'none';
        this.showQuestion();
    }

    showResults() {
        this.elements.puzzleGame.style.display = 'none';
        this.elements.resultsContainer.style.display = 'block';

        const percentage = Math.round((this.correctAnswers / this.questions.length) * 100);
        const level = this.getLevel(percentage);

        this.elements.correctAnswers.textContent = this.correctAnswers;
        this.elements.finalLevel.textContent = level;
        this.elements.finalScore.textContent = this.score;
        this.elements.maxStreak.textContent = this.maxStreak;
        this.elements.percentage.textContent = percentage + '%';

        let message = '';
        if (percentage >= 95) {
            message = 'Невероятно! Вы достигли уровня Верховного Бога! Ваши знания древнегреческой мифологии поражают!';
        } else if (percentage >= 90) {
            message = 'Превосходно! Вы настоящий Мастер Олимпа! Боги гордятся вашими знаниями!';
        } else if (percentage >= 85) {
            message = 'Отлично! Вы достигли уровня Мудреца! Ваше понимание мифов впечатляет!';
        } else if (percentage >= 80) {
            message = 'Хорошо! Вы Знаток древнегреческой мифологии! Продолжайте изучать легенды!';
        } else if (percentage >= 75) {
            message = 'Неплохо! Вы Ученик мифов! Изучайте дальше, чтобы стать Мудрецом!';
        } else if (percentage >= 70) {
            message = 'Хорошо! У вас есть базовые знания о богах Олимпа. Изучайте мифы дальше!';
        } else if (percentage >= 60) {
            message = 'Неплохо для начала! Продолжайте изучать древнегреческую мифологию!';
        } else if (percentage >= 50) {
            message = 'Это хорошее начало! Изучайте мифы, чтобы улучшить свои знания!';
        } else {
            message = 'Не расстраивайтесь! Это отличная возможность изучить древнегреческую мифологию!';
        }

        this.elements.resultsMessage.textContent = message;
    }

    getLevel(percentage) {
        if (percentage >= 95) return 'Верховный Бог';
        if (percentage >= 90) return 'Мастер Олимпа';
        if (percentage >= 85) return 'Мудрец';
        if (percentage >= 80) return 'Знаток';
        if (percentage >= 75) return 'Ученик';
        if (percentage >= 70) return 'Новичок';
        if (percentage >= 60) return 'Начинающий';
        if (percentage >= 50) return 'Странник';
        return 'Мортиал';
    }

    updateStats() {
        this.elements.score.textContent = this.score;
        this.elements.level.textContent = this.getLevel(Math.round((this.correctAnswers / (this.currentQuestion + 1)) * 100));
    }

    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        this.elements.progressFill.style.width = progress + '%';
        this.elements.progressText.textContent = Math.round(progress) + '% завершено';
    }

    restartGame() {
        this.elements.startBtn.style.display = 'inline-block';
        this.elements.nextBtn.style.display = 'none';
        this.elements.restartBtn.style.display = 'none';
        this.elements.resultsContainer.style.display = 'none';
        this.elements.puzzleGame.style.display = 'block';
        
        this.elements.questionText.textContent = 'Загрузка вопроса...';
        this.elements.questionImage.innerHTML = '';
        this.elements.progressFill.style.width = '0%';
        this.elements.progressText.textContent = '0% завершено';
        
        this.gameStarted = false;
        this.currentQuestion = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.answered = false;
        this.streak = 0;
        this.maxStreak = 0;
        
        this.updateStats();
    }
}

// Инициализация головоломки при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    new OlympusPuzzle();
});
