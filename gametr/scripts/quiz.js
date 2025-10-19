// Mythology Quiz Mini-Game JavaScript
class MythologyQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.questions = [];
        this.selectedAnswer = null;
        this.hintUsed = false;
        this.stats = this.loadStats();
        
        this.initializeQuiz();
        this.bindEvents();
    }
    
    initializeQuiz() {
        this.questions = [
            {
                question: "Yunan mitolojisinde Zeus'un kardeşi olan deniz tanrısı kimdir?",
                answers: [
                    "Poseidon",
                    "Hades", 
                    "Apollo",
                    "Ares"
                ],
                correct: 0,
                hint: "Denizlerin ve okyanusların efendisi olarak bilinir."
            },
            {
                question: "Hades'in krallığı olan yeraltı dünyasının adı nedir?",
                answers: [
                    "Tartarus",
                    "Elysium",
                    "Asphodel",
                    "Underworld"
                ],
                correct: 3,
                hint: "İngilizce 'yeraltı dünyası' anlamına gelir."
            },
            {
                question: "Athena'nın doğum şekli nasıldır?",
                answers: [
                    "Zeus'un kafasından tam zırhlı olarak doğdu",
                    "Deniz köpüğünden doğdu",
                    "Zeus'un bacağından doğdu",
                    "Hera'nın karnından doğdu"
                ],
                correct: 0,
                hint: "Zeus'un kafasından tam zırhlı olarak çıktı."
            },
            {
                question: "Apollo'nun ikiz kardeşi olan tanrıça kimdir?",
                answers: [
                    "Aphrodite",
                    "Artemis",
                    "Hestia",
                    "Demeter"
                ],
                correct: 1,
                hint: "Ay tanrıçası ve avcılık tanrıçası olarak bilinir."
            },
            {
                question: "Prometheus'un Zeus'tan çaldığı şey nedir?",
                answers: [
                    "Altın elma",
                    "Ateş",
                    "Gök gürültüsü",
                    "Şimşek"
                ],
                correct: 1,
                hint: "İnsanlara verdiği en değerli armağan."
            },
            {
                question: "Herakles'in 12 görevinden biri olan Nemea aslanını öldürdükten sonra ne yaptı?",
                answers: [
                    "Derisini yüzüp giydi",
                    "Kafasını Zeus'a hediye etti",
                    "Aslanı diriltti",
                    "Derisini yaktı"
                ],
                correct: 0,
                hint: "Derisini yüzüp kendine zırh yaptı."
            },
            {
                question: "Pandora'nın kutusunda kalan tek şey nedir?",
                answers: [
                    "Umut",
                    "Sevgi",
                    "Bilgelik",
                    "Cesaret"
                ],
                correct: 0,
                hint: "İnsanlığın en son umudu."
            },
            {
                question: "Orpheus'un müziği hangi enstrümanla çalardı?",
                answers: [
                    "Lir",
                    "Flüt",
                    "Davul",
                    "Keman"
                ],
                correct: 0,
                hint: "Yunan mitolojisinin en ünlü müzisyeni."
            },
            {
                question: "Medusa'nın saçları neyden oluşuyordu?",
                answers: [
                    "Yılan",
                    "Ateş",
                    "Buz",
                    "Çiçek"
                ],
                correct: 0,
                hint: "Bakışları taşa çeviren yaratık."
            },
            {
                question: "Olimpos'un 12 tanrısından biri olmayan kimdir?",
                answers: [
                    "Hestia",
                    "Dionysus",
                    "Hades",
                    "Persephone"
                ],
                correct: 3,
                hint: "Hades'in karısı ama Olimpos'ta yaşamıyor."
            },
            {
                question: "Aphrodite'nin doğum yeri neresidir?",
                answers: [
                    "Deniz köpüğünden",
                    "Zeus'un kafasından",
                    "Hera'nın karnından",
                    "Gaia'nın toprağından"
                ],
                correct: 0,
                hint: "Uranus'un kesilen organlarından doğdu."
            },
            {
                question: "Herakles'in 12 görevinden ilki hangisidir?",
                answers: [
                    "Nemea aslanını öldürmek",
                    "Hydra'yı öldürmek",
                    "Cerberus'u yakalamak",
                    "Altın elmaları getirmek"
                ],
                correct: 0,
                hint: "İlk görev en ünlü olanıdır."
            },
            {
                question: "Odysseus'un evi hangi adada bulunuyordu?",
                answers: [
                    "Kreta",
                    "İthaka",
                    "Sicilya",
                    "Kıbrıs"
                ],
                correct: 1,
                hint: "Küçük bir Yunan adası."
            },
            {
                question: "Troya Savaşı kaç yıl sürdü?",
                answers: [
                    "7 yıl",
                    "9 yıl",
                    "10 yıl",
                    "12 yıl"
                ],
                correct: 2,
                hint: "Homeros'un İlyada'sında anlatılan savaş."
            },
            {
                question: "Perseus'un annesi kimdir?",
                answers: [
                    "Andromeda",
                    "Danae",
                    "Medusa",
                    "Athena"
                ],
                correct: 1,
                hint: "Zeus'un altın yağmuru ile hamile kaldı."
            },
            {
                question: "Hades'in üç başlı köpeğinin adı nedir?",
                answers: [
                    "Cerberus",
                    "Hydra",
                    "Chimera",
                    "Sphinx"
                ],
                correct: 0,
                hint: "Yeraltı dünyasının bekçisi."
            },
            {
                question: "Apollo'nun kehanet merkezi neredeydi?",
                answers: [
                    "Atina",
                    "Delfi",
                    "Olimpos",
                    "Troy"
                ],
                correct: 1,
                hint: "En ünlü kehanet merkezi."
            },
            {
                question: "Theseus'un babası kimdir?",
                answers: [
                    "Poseidon",
                    "Aegeus",
                    "Zeus",
                    "Apollo"
                ],
                correct: 1,
                hint: "Atina kralı, deniz adını verdi."
            },
            {
                question: "Icarus'un babası kimdir?",
                answers: [
                    "Daedalus",
                    "Theseus",
                    "Minos",
                    "Apollo"
                ],
                correct: 0,
                hint: "Ünlü mimar ve mucit."
            },
            {
                question: "Narcissus'un aşık olduğu kimdi?",
                answers: [
                    "Echo",
                    "Kendi yansıması",
                    "Aphrodite",
                    "Athena"
                ],
                correct: 1,
                hint: "Su yüzeyindeki kendi görüntüsüne aşık oldu."
            },
            {
                question: "Hera'nın kutsal hayvanı nedir?",
                answers: [
                    "Baykuş",
                    "Tavus kuşu",
                    "Kartal",
                    "Yunus"
                ],
                correct: 1,
                hint: "Göklerin kraliçesinin sembolü."
            },
            {
                question: "Dionysus'un annesi kimdir?",
                answers: [
                    "Hera",
                    "Semele",
                    "Demeter",
                    "Leto"
                ],
                correct: 1,
                hint: "Zeus'un aşık olduğu ölümlü kadın."
            },
            {
                question: "Achilles'in zayıf noktası neresiydi?",
                answers: [
                    "Kalbi",
                    "Topuğu",
                    "Boynu",
                    "Gözü"
                ],
                correct: 1,
                hint: "Annesi onu Styx nehrinde yıkarken tuttuğu yer."
            },
            {
                question: "Jason ve Argonautlar'ın aradığı şey nedir?",
                answers: [
                    "Altın elma",
                    "Altın post",
                    "Gizli hazine",
                    "Kayıp şehir"
                ],
                correct: 1,
                hint: "Kolkhis'teki ünlü altın post."
            },
            {
                question: "Hephaestus'un karısı kimdir?",
                answers: [
                    "Aphrodite",
                    "Athena",
                    "Hera",
                    "Demeter"
                ],
                correct: 0,
                hint: "Güzellik tanrıçası, ama sadık değildi."
            },
            {
                question: "Hermes'in görevleri arasında hangisi yoktur?",
                answers: [
                    "Tanrıların habercisi",
                    "Yolcuların koruyucusu",
                    "Savaş tanrısı",
                    "Hırsızların tanrısı"
                ],
                correct: 2,
                hint: "Savaş Ares'in işi."
            },
            {
                question: "Demeter'in kızı kimdir?",
                answers: [
                    "Athena",
                    "Persephone",
                    "Hestia",
                    "Artemis"
                ],
                correct: 1,
                hint: "Hades tarafından kaçırılan tanrıça."
            },
            {
                question: "Oedipus'un babasını öldürdüğü yer neresiydi?",
                answers: [
                    "Üç yol ayrımı",
                    "Şehir kapısı",
                    "Saray önü",
                    "Tapınak"
                ],
                correct: 0,
                hint: "Yolların kesiştiği nokta."
            }
        ];
        
        this.showQuestion();
    }
    
    loadStats() {
        const savedStats = localStorage.getItem('mythologyQuizStats');
        if (savedStats) {
            return JSON.parse(savedStats);
        }
        return {
            totalGames: 0,
            totalScore: 0,
            bestScore: 0,
            bestLevel: '',
            averageScore: 0,
            totalCorrect: 0,
            totalQuestions: 0,
            hintsUsed: 0,
            perfectGames: 0,
            streak: 0,
            longestStreak: 0,
            lastPlayed: null,
            achievements: []
        };
    }
    
    saveStats() {
        this.stats.totalGames++;
        this.stats.totalScore += this.score;
        this.stats.totalCorrect += this.correctAnswers;
        this.stats.totalQuestions += this.questions.length;
        this.stats.averageScore = Math.round(this.stats.totalScore / this.stats.totalGames);
        
        if (this.score > this.stats.bestScore) {
            this.stats.bestScore = this.score;
        }
        
        if (this.correctAnswers === this.questions.length) {
            this.stats.perfectGames++;
        }
        
        this.stats.lastPlayed = new Date().toISOString();
        
        // Update streak
        if (this.correctAnswers >= this.questions.length * 0.7) { // 70% or more
            this.stats.streak++;
        } else {
            this.stats.streak = 0;
        }
        
        if (this.stats.streak > this.stats.longestStreak) {
            this.stats.longestStreak = this.stats.streak;
        }
        
        // Check for achievements
        this.checkAchievements();
        
        localStorage.setItem('mythologyQuizStats', JSON.stringify(this.stats));
    }
    
    checkAchievements() {
        const achievements = this.stats.achievements;
        
        // First game
        if (this.stats.totalGames === 1 && !achievements.includes('first_game')) {
            achievements.push('first_game');
        }
        
        // Perfect score
        if (this.correctAnswers === this.questions.length && !achievements.includes('perfect_score')) {
            achievements.push('perfect_score');
        }
        
        // 10 games played
        if (this.stats.totalGames >= 10 && !achievements.includes('dedicated_learner')) {
            achievements.push('dedicated_learner');
        }
        
        // 1000 total points
        if (this.stats.totalScore >= 1000 && !achievements.includes('point_master')) {
            achievements.push('point_master');
        }
        
        // 5 game streak
        if (this.stats.streak >= 5 && !achievements.includes('streak_master')) {
            achievements.push('streak_master');
        }
        
        // 50 games played
        if (this.stats.totalGames >= 50 && !achievements.includes('mythology_expert')) {
            achievements.push('mythology_expert');
        }
    }
    
    getAchievementName(achievement) {
        const names = {
            'first_game': 'İlk Adım',
            'perfect_score': 'Mükemmel Skor',
            'dedicated_learner': 'Kararlı Öğrenci',
            'point_master': 'Puan Ustası',
            'streak_master': 'Seri Ustası',
            'mythology_expert': 'Mitoloji Uzmanı'
        };
        return names[achievement] || achievement;
    }
    
    getAchievementDescription(achievement) {
        const descriptions = {
            'first_game': 'İlk oyununuzu tamamladınız!',
            'perfect_score': 'Tüm soruları doğru cevapladınız!',
            'dedicated_learner': '10 oyun oynadınız!',
            'point_master': '1000 puan topladınız!',
            'streak_master': '5 oyun üst üste başarılı!',
            'mythology_expert': '50 oyun oynadınız!'
        };
        return descriptions[achievement] || '';
    }
    
    bindEvents() {
        document.getElementById('quizNext').addEventListener('click', () => this.nextQuestion());
        document.getElementById('quizHint').addEventListener('click', () => this.showHint());
        document.getElementById('quizRestart').addEventListener('click', () => this.restartQuiz());
        document.getElementById('quizShare').addEventListener('click', () => this.shareResults());
        document.getElementById('quizStats').addEventListener('click', () => this.showStats());
        
        // Stats modal events
        document.getElementById('statsModal').addEventListener('click', (e) => {
            if (e.target.id === 'statsModal' || e.target.classList.contains('stats-close')) {
                this.hideStats();
            }
        });
    }
    
    showQuestion() {
        const question = this.questions[this.currentQuestion];
        const questionElement = document.getElementById('questionText');
        const answersElement = document.getElementById('quizAnswers');
        const progressElement = document.getElementById('quizProgress');
        const progressTextElement = document.getElementById('quizProgressText');
        const scoreElement = document.getElementById('quizScore');
        
        // Update question
        questionElement.textContent = question.question;
        
        // Update progress
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        progressElement.style.width = `${progress}%`;
        progressTextElement.textContent = `Soru ${this.currentQuestion + 1} / ${this.questions.length}`;
        
        // Update score
        scoreElement.textContent = `${this.score} Puan`;
        
        // Create answer buttons
        answersElement.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const answerButton = document.createElement('button');
            answerButton.className = 'quiz-answer';
            answerButton.textContent = answer;
            answerButton.addEventListener('click', () => this.selectAnswer(index));
            
            // Add visual indicator that selection can be changed
            const selectionHint = document.createElement('div');
            selectionHint.className = 'selection-hint';
            selectionHint.textContent = 'Değiştirmek için tıklayın';
            selectionHint.style.display = 'none';
            answerButton.appendChild(selectionHint);
            
            answersElement.appendChild(answerButton);
        });
        
        // Reset buttons
        document.getElementById('quizNext').disabled = true;
        document.getElementById('quizHint').disabled = false;
        this.selectedAnswer = null;
        this.hintUsed = false;
        
        // Reset hint button text
        const hintButton = document.getElementById('quizHint');
        hintButton.textContent = 'İpucu';
        hintButton.style.opacity = '1';
    }
    
    selectAnswer(index) {
        // Allow changing selection until confirmed
        this.selectedAnswer = index;
        const answerButtons = document.querySelectorAll('.quiz-answer');
        
        // Remove previous selections
        answerButtons.forEach(btn => {
            btn.classList.remove('selected');
            const hint = btn.querySelector('.selection-hint');
            if (hint) hint.style.display = 'none';
        });
        
        // Mark selected answer
        answerButtons[index].classList.add('selected');
        
        // Show hint for changing selection
        const selectedButton = answerButtons[index];
        const hint = selectedButton.querySelector('.selection-hint');
        if (hint) {
            hint.style.display = 'block';
        }
        
        // Enable next button
        document.getElementById('quizNext').disabled = false;
    }
    
    nextQuestion() {
        if (this.selectedAnswer === null) return;
        
        const question = this.questions[this.currentQuestion];
        const answerButtons = document.querySelectorAll('.quiz-answer');
        
        // Hide selection hints
        answerButtons.forEach(btn => {
            const hint = btn.querySelector('.selection-hint');
            if (hint) hint.style.display = 'none';
        });
        
        // Show correct/incorrect answers
        answerButtons.forEach((btn, index) => {
            btn.classList.add('disabled');
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === this.selectedAnswer && index !== question.correct) {
                btn.classList.add('incorrect');
            }
        });
        
        // Update score
        if (this.selectedAnswer === question.correct) {
            this.correctAnswers++;
            this.score += this.hintUsed ? 5 : 10; // Less points if hint was used
        }
        
        // Update UI
        document.getElementById('quizScore').textContent = `${this.score} Puan`;
        document.getElementById('quizNext').disabled = true;
        document.getElementById('quizHint').disabled = true;
        
        // Move to next question after delay
        setTimeout(() => {
            this.currentQuestion++;
            if (this.currentQuestion < this.questions.length) {
                this.showQuestion();
            } else {
                this.showResults();
            }
        }, 2000);
    }
    
    showHint() {
        if (this.hintUsed) return;
        
        const question = this.questions[this.currentQuestion];
        const hintButton = document.getElementById('quizHint');
        
        // Show hint
        alert(`💡 İpucu: ${question.hint}`);
        
        // Mark hint as used
        this.hintUsed = true;
        hintButton.disabled = true;
        hintButton.textContent = 'İpucu Kullanıldı';
        hintButton.style.opacity = '0.6';
    }
    
    showResults() {
        // Save statistics
        this.saveStats();
        
        const quizContent = document.getElementById('quizContent');
        const quizResults = document.getElementById('quizResults');
        const resultsIcon = document.getElementById('resultsIcon');
        const resultsTitle = document.getElementById('resultsTitle');
        const resultsDescription = document.getElementById('resultsDescription');
        const correctAnswersElement = document.getElementById('correctAnswers');
        const totalScoreElement = document.getElementById('totalScore');
        const quizLevelElement = document.getElementById('quizLevel');
        
        // Hide quiz content, show results
        quizContent.style.display = 'none';
        quizResults.style.display = 'block';
        
        // Calculate level
        const percentage = (this.correctAnswers / this.questions.length) * 100;
        let level, icon, title, description;
        
        if (percentage >= 90) {
            level = 'Mitoloji Ustası';
            icon = '👑';
            title = 'Harika!';
            description = 'Antik mitoloji konusunda gerçek bir uzmansınız!';
        } else if (percentage >= 70) {
            level = 'Kronik Koruyucusu';
            icon = '🏆';
            title = 'Çok İyi!';
            description = 'Mitolojik bilginiz oldukça güçlü!';
        } else if (percentage >= 50) {
            level = 'Öğrenci';
            icon = '📚';
            title = 'İyi Başlangıç!';
            description = 'Mitolojik bilginizi geliştirmeye devam edin!';
        } else {
            level = 'Başlangıç';
            icon = '🌱';
            title = 'Devam Edin!';
            description = 'Mitolojik dünyayı keşfetmeye devam edin!';
        }
        
        // Update results
        resultsIcon.textContent = icon;
        resultsTitle.textContent = title;
        resultsDescription.textContent = description;
        correctAnswersElement.textContent = `${this.correctAnswers}/${this.questions.length}`;
        totalScoreElement.textContent = `${this.score} Puan`;
        quizLevelElement.textContent = level;
    }
    
    restartQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.selectedAnswer = null;
        this.hintUsed = false;
        
        // Reset UI
        document.getElementById('quizContent').style.display = 'block';
        document.getElementById('quizResults').style.display = 'none';
        document.getElementById('quizProgress').style.width = '0%';
        
        this.showQuestion();
    }
    
    shareResults() {
        const percentage = (this.correctAnswers / this.questions.length) * 100;
        const level = document.getElementById('quizLevel').textContent;
        
        const shareText = `🏛️ Olimpos Kronikleri Mitoloji Yarışması'nda ${level} seviyesine ulaştım! ${this.correctAnswers}/${this.questions.length} doğru cevap ile ${this.score} puan kazandım. Siz de deneyin! #ChroniclesOlympus2025`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Olimpos Kronikleri - Mitoloji Yarışması',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Sonuç panoya kopyalandı!');
            });
        }
    }
    
    showStats() {
        const modal = document.getElementById('statsModal');
        modal.style.display = 'flex';
        
        // Update statistics display
        document.getElementById('totalGames').textContent = this.stats.totalGames;
        document.getElementById('bestScore').textContent = this.stats.bestScore;
        document.getElementById('averageScore').textContent = this.stats.averageScore;
        document.getElementById('perfectGames').textContent = this.stats.perfectGames;
        document.getElementById('currentStreak').textContent = this.stats.streak;
        document.getElementById('longestStreak').textContent = this.stats.longestStreak;
        document.getElementById('totalCorrect').textContent = this.stats.totalCorrect;
        
        // Calculate accuracy rate
        const accuracyRate = this.stats.totalQuestions > 0 
            ? Math.round((this.stats.totalCorrect / this.stats.totalQuestions) * 100)
            : 0;
        document.getElementById('accuracyRate').textContent = `${accuracyRate}%`;
        
        // Display achievements
        this.displayAchievements();
    }
    
    hideStats() {
        document.getElementById('statsModal').style.display = 'none';
    }
    
    displayAchievements() {
        const achievementsGrid = document.getElementById('achievementsGrid');
        achievementsGrid.innerHTML = '';
        
        if (this.stats.achievements.length === 0) {
            achievementsGrid.innerHTML = '<p class="no-achievements">Henüz başarım kazanmadınız. Oyun oynayarak başarımlar kazanabilirsiniz!</p>';
            return;
        }
        
        this.stats.achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement-item';
            achievementElement.innerHTML = `
                <div class="achievement-icon">🏆</div>
                <div class="achievement-info">
                    <h5>${this.getAchievementName(achievement)}</h5>
                    <p>${this.getAchievementDescription(achievement)}</p>
                </div>
            `;
            achievementsGrid.appendChild(achievementElement);
        });
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MythologyQuiz();
});
