// Мультиплеер для "Кролик Панч" через VK Bridge
// Специально адаптированный для игры с системой комбо и ударов

class VKMultiplayer {
    constructor() {
        this.bridge = null;
        this.isVKReady = false;
        this.isMultiplayer = false;
        this.gameId = null;
        this.playerId = null;
        this.opponentId = null;
        this.playerName = '';
        this.playerPhoto = '';
        this.gamesList = [];
        this.playerStats = {
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            rating: 1000
        };
        
        this.gameState = {
            status: 'waiting', // waiting, playing, finished
            players: {},
            moves: [],
            scores: {},
            timeLeft: 90,
            gameStartTime: null,
            lastActivity: Date.now()
        };
        
        this.updateInterval = null;
        this.lastMoveTime = 0;
        this.gameStarted = false;
        this.movesQueue = [];
        
        this.init();
    }

    async init() {
        console.log('🚀 Инициализация VK мультиплеера для "Кролик Панч"...');
        
        try {
            // Проверяем доступность VK Bridge
            if (typeof vkBridge !== 'undefined') {
                this.bridge = vkBridge;
                console.log('✅ VK Bridge найден');
            } else {
                console.log('⚠️ VK Bridge не найден, создаем заглушку');
                this.bridge = this.createMockBridge();
            }
            
            // Инициализируем VK Bridge с ID приложения
            await this.bridge.send('VKWebAppInit', {
                app_id: 51831798
            });
            
            // Получаем информацию о пользователе
            const userInfo = await this.bridge.send('VKWebAppGetUserInfo');
            this.playerId = userInfo.id;
            this.playerName = `${userInfo.first_name} ${userInfo.last_name}`;
            this.playerPhoto = userInfo.photo_100 || '';
            
            console.log(`👤 Пользователь: ${this.playerName} (ID: ${this.playerId})`);
            
            // Инициализируем хранилище
            await this.initStorage();
            
            this.isVKReady = true;
            console.log('✅ VK мультиплеер готов к работе!');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации VK мультиплеера:', error);
            this.isVKReady = false;
        }
    }

    createMockBridge() {
        // Заглушка для тестирования вне VK
        return {
            send: async (method, params = {}) => {
                console.log(`🔧 Mock VK Bridge: ${method}`, params);
                
                switch (method) {
                    case 'VKWebAppInit':
                        return { result: true };
                    
                    case 'VKWebAppGetUserInfo':
                        return {
                            id: Math.floor(Math.random() * 1000000),
                            first_name: 'Тестовый',
                            last_name: 'Игрок',
                            photo_100: ''
                        };
                    
                    case 'VKWebAppStorageGet':
                        const key = params.keys[0];
                        const mockData = {
                            'multiplayer_games': '[]',
                            'player_stats': JSON.stringify({
                                gamesPlayed: 0,
                                wins: 0,
                                losses: 0,
                                rating: 1000
                            })
                        };
                        return {
                            keys: [{
                                key: key,
                                value: mockData[key] || ''
                            }]
                        };
                    
                    case 'VKWebAppStorageSet':
                        console.log(`💾 Сохранено: ${params.key} = ${params.value}`);
                        return { result: true };
                    
                    case 'VKWebAppShowWallPostBox':
                        console.log('📝 Пост на стену:', params.message);
                        return { result: true };
                    
                    default:
                        return { result: true };
                }
            }
        };
    }

    async initStorage() {
        try {
            // Получаем список игр
            const gamesData = await this.bridge.send('VKWebAppStorageGet', {
                keys: ['multiplayer_games']
            });
            
            const gamesValue = gamesData.keys[0]?.value || '[]';
            this.gamesList = JSON.parse(gamesValue);
            
            // Очищаем старые игры (старше 10 минут)
            const now = Date.now();
            this.gamesList = this.gamesList.filter(game => 
                now - game.createdAt < 10 * 60 * 1000
            );
            
            // Получаем статистику игрока
            const statsData = await this.bridge.send('VKWebAppStorageGet', {
                keys: ['player_stats']
            });
            
            const statsValue = statsData.keys[0]?.value;
            if (statsValue) {
                this.playerStats = JSON.parse(statsValue);
            } else {
                this.playerStats = {
                    gamesPlayed: 0,
                    wins: 0,
                    losses: 0,
                    rating: 1000
                };
                await this.savePlayerStats();
            }
            
            console.log('💾 Хранилище инициализировано');
            console.log('📊 Статистика:', this.playerStats);
            
        } catch (error) {
            console.error('❌ Ошибка инициализации хранилища:', error);
        }
    }

    async saveGamesList() {
        try {
            await this.bridge.send('VKWebAppStorageSet', {
                key: 'multiplayer_games',
                value: JSON.stringify(this.gamesList)
            });
        } catch (error) {
            console.error('❌ Ошибка сохранения списка игр:', error);
        }
    }

    async savePlayerStats() {
        try {
            await this.bridge.send('VKWebAppStorageSet', {
                key: 'player_stats',
                value: JSON.stringify(this.playerStats)
            });
        } catch (error) {
            console.error('❌ Ошибка сохранения статистики:', error);
        }
    }

    async saveGameState(gameId, gameData) {
        try {
            await this.bridge.send('VKWebAppStorageSet', {
                key: `game_${gameId}`,
                value: JSON.stringify(gameData)
            });
        } catch (error) {
            console.error('❌ Ошибка сохранения состояния игры:', error);
        }
    }

    async loadGameState(gameId) {
        try {
            const data = await this.bridge.send('VKWebAppStorageGet', {
                keys: [`game_${gameId}`]
            });
            
            const value = data.keys[0]?.value;
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('❌ Ошибка загрузки состояния игры:', error);
            return null;
        }
    }

    async startMatchmaking() {
        if (!this.isVKReady) {
            console.error('❌ VK не готов');
            return false;
        }

        console.log('🔍 Начинаем поиск игры...');
        
        // Показываем UI поиска
        if (window.OnShowMatchmakingUI) {
            window.OnShowMatchmakingUI();
        }
        
        // Сначала пытаемся присоединиться к существующей игре
        const availableGame = this.gamesList.find(game => 
            game.status === 'waiting' && 
            game.host !== this.playerId &&
            Date.now() - game.createdAt < 5 * 60 * 1000 // не старше 5 минут
        );
        
        if (availableGame) {
            console.log('🎯 Найдена доступная игра:', availableGame.id);
            return await this.joinGame(availableGame.id);
        } else {
            console.log('🆕 Создаем новую игру');
            await this.createGame();
            return true;
        }
    }

    async createGame() {
        this.gameId = `game_${Date.now()}_${this.playerId}`;
        
        const gameData = {
            id: this.gameId,
            host: this.playerId,
            hostName: this.playerName,
            status: 'waiting',
            players: {
                [this.playerId]: {
                    id: this.playerId,
                    name: this.playerName,
                    photo: this.playerPhoto,
                    score: 0,
                    combo: 0,
                    maxCombo: 0,
                    punches: 0,
                    ready: false
                }
            },
            createdAt: Date.now(),
            gameStartTime: null,
            moves: [],
            gameType: 'rabbit_punch' // Специально для нашей игры
        };
        
        // Добавляем игру в список
        this.gamesList.push({
            id: this.gameId,
            host: this.playerId,
            hostName: this.playerName,
            status: 'waiting',
            createdAt: Date.now(),
            gameType: 'rabbit_punch'
        });
        
        await this.saveGamesList();
        await this.saveGameState(this.gameId, gameData);
        
        this.gameState = gameData;
        this.isMultiplayer = true;
        
        console.log(`🎮 Создана игра: ${this.gameId}`);
        
        // Ждем второго игрока
        this.waitForOpponent();
        
        // Приглашаем друзей
        await this.inviteFriends();
    }

    async joinGame(gameId) {
        console.log(`🎯 Присоединение к игре: ${gameId}`);
        
        const gameData = await this.loadGameState(gameId);
        if (!gameData) {
            console.error('❌ Игра не найдена');
            return false;
        }
        
        if (Object.keys(gameData.players).length >= 2) {
            console.error('❌ Игра уже заполнена');
            return false;
        }
        
        // Добавляем себя в игру
        gameData.players[this.playerId] = {
            id: this.playerId,
            name: this.playerName,
            photo: this.playerPhoto,
            score: 0,
            combo: 0,
            maxCombo: 0,
            punches: 0,
            ready: false
        };
        
        gameData.status = 'playing';
        gameData.gameStartTime = Date.now();
        
        // Обновляем список игр
        const gameIndex = this.gamesList.findIndex(g => g.id === gameId);
        if (gameIndex !== -1) {
            this.gamesList[gameIndex].status = 'playing';
        }
        
        await this.saveGamesList();
        await this.saveGameState(gameId, gameData);
        
        this.gameId = gameId;
        this.gameState = gameData;
        this.isMultiplayer = true;
        this.opponentId = gameData.host;
        this.gameStarted = true;
        
        // Скрываем UI поиска и показываем игру
        if (window.OnHideMatchmakingUI) {
            window.OnHideMatchmakingUI();
        }
        
        if (window.OnMultiplayerGameStart) {
            window.OnMultiplayerGameStart(this.opponentId, this.gameId);
        }
        
        console.log('✅ Присоединились к игре!');
        this.startGameUpdates();
        
        return true;
    }

    waitForOpponent() {
        const checkInterval = setInterval(async () => {
            const gameData = await this.loadGameState(this.gameId);
            
            if (gameData && Object.keys(gameData.players).length >= 2) {
                clearInterval(checkInterval);
                
                this.gameState = gameData;
                this.opponentId = Object.keys(gameData.players).find(id => id != this.playerId);
                this.gameStarted = true;
                
                // Обновляем время начала игры
                gameData.gameStartTime = Date.now();
                await this.saveGameState(this.gameId, gameData);
                
                // Скрываем UI поиска и показываем игру
                if (window.OnHideMatchmakingUI) {
                    window.OnHideMatchmakingUI();
                }
                
                if (window.OnMultiplayerGameStart) {
                    window.OnMultiplayerGameStart(this.opponentId, this.gameId);
                }
                
                console.log('✅ Противник найден!');
                this.startGameUpdates();
            }
        }, 2000);
        
        // Таймаут поиска 60 секунд
        setTimeout(() => {
            clearInterval(checkInterval);
            if (!this.opponentId) {
                console.log('⏰ Время поиска истекло');
                this.cancelMatchmaking();
            }
        }, 60000);
    }

    startGameUpdates() {
        this.updateInterval = setInterval(async () => {
            const gameData = await this.loadGameState(this.gameId);
            
            if (gameData) {
                // Проверяем новые ходы
                const newMoves = gameData.moves.filter(move => 
                    move.playerId !== this.playerId &&
                    move.timestamp > (this.lastMoveTime || 0)
                );
                
                newMoves.forEach(move => {
                    this.processOpponentMove(move);
                    this.lastMoveTime = move.timestamp;
                });
                
                this.gameState = gameData;
                
                // Проверяем завершение игры
                if (gameData.status === 'finished') {
                    this.endGame();
                }
                
                // Проверяем таймаут (если игра длится больше 2 минут без активности)
                if (Date.now() - gameData.lastActivity > 2 * 60 * 1000) {
                    console.log('⏰ Игра завершена по таймауту');
                    this.endGame();
                }
            }
        }, 1000);
    }

    processOpponentMove(move) {
        console.log('👊 Обработка хода противника:', move);
        
        // Обновляем счет противника в UI
        if (window.OnOpponentMove) {
            window.OnOpponentMove(move.type, move.x, move.y, move.score, move.combo);
        }
        
        // Специальная обработка для разных типов ходов
        switch (move.type) {
            case 'punch':
                console.log(`🥊 Противник ударил! Счет: ${move.score}`);
                break;
            case 'combo':
                console.log(`🔥 Противник сделал комбо x${move.combo}! Счет: ${move.score}`);
                break;
            case 'special':
                console.log(`⭐ Противник сделал специальный удар! Счет: ${move.score}`);
                break;
        }
    }

    async sendMove(moveType, x, y, score, combo = 1) {
        if (!this.isMultiplayer || !this.gameId || !this.gameStarted) return;
        
        const move = {
            playerId: this.playerId,
            type: moveType,
            x: x,
            y: y,
            score: score,
            combo: combo,
            timestamp: Date.now()
        };
        
        const gameData = await this.loadGameState(this.gameId);
        if (gameData) {
            gameData.moves.push(move);
            gameData.lastActivity = Date.now();
            
            // Обновляем статистику игрока
            if (gameData.players[this.playerId]) {
                gameData.players[this.playerId].score = score;
                gameData.players[this.playerId].combo = combo;
                gameData.players[this.playerId].punches++;
                
                if (combo > gameData.players[this.playerId].maxCombo) {
                    gameData.players[this.playerId].maxCombo = combo;
                }
            }
            
            await this.saveGameState(this.gameId, gameData);
            console.log('📤 Ход отправлен:', move);
        }
    }

    async endGame() {
        if (!this.isMultiplayer) return;
        
        clearInterval(this.updateInterval);
        
        const gameData = await this.loadGameState(this.gameId);
        if (gameData) {
            gameData.status = 'finished';
            gameData.endTime = Date.now();
            
            // Определяем победителя
            const myScore = gameData.players[this.playerId]?.score || 0;
            const opponentScore = gameData.players[this.opponentId]?.score || 0;
            
            let result = 'draw';
            if (myScore > opponentScore) {
                result = 'win';
                this.playerStats.wins++;
            } else if (myScore < opponentScore) {
                result = 'lose';
                this.playerStats.losses++;
            }
            
            this.playerStats.gamesPlayed++;
            
            // Рассчитываем изменение рейтинга
            let ratingChange = 0;
            if (result === 'win') {
                ratingChange = 25;
            } else if (result === 'lose') {
                ratingChange = -15;
            } else {
                ratingChange = 5;
            }
            
            this.playerStats.rating += ratingChange;
            
            await this.savePlayerStats();
            await this.saveGameState(this.gameId, gameData);
            
            // Убираем игру из списка активных
            this.gamesList = this.gamesList.filter(g => g.id !== this.gameId);
            await this.saveGamesList();
            
            // Публикуем результат на стену (если победа)
            if (result === 'win' && myScore > 100) {
                await this.shareResult(myScore, opponentScore);
            }
            
            if (window.OnMultiplayerGameEnd) {
                window.OnMultiplayerGameEnd(result, myScore, opponentScore);
            }
            
            console.log(`🏁 Игра завершена: ${result} (${myScore}:${opponentScore})`);
            console.log(`📊 Рейтинг изменен на: ${ratingChange > 0 ? '+' : ''}${ratingChange}`);
        }
        
        this.resetGame();
    }

    resetGame() {
        this.isMultiplayer = false;
        this.gameId = null;
        this.opponentId = null;
        this.gameStarted = false;
        this.lastMoveTime = 0;
        this.movesQueue = [];
    }

    async cancelMatchmaking() {
        console.log('❌ Отмена поиска игры');
        
        if (this.gameId) {
            // Удаляем игру из списка
            this.gamesList = this.gamesList.filter(g => g.id !== this.gameId);
            await this.saveGamesList();
        }
        
        this.resetGame();
        
        if (window.OnHideMatchmakingUI) {
            window.OnHideMatchmakingUI();
        }
    }

    async inviteFriends() {
        try {
            const message = `🐰 Сыграем в "Кролик Панч"! Кто быстрее наберет очки ударами? 🥊\n\nПрисоединяйся к игре!`;
            
            await this.bridge.send('VKWebAppShowWallPostBox', {
                message: message,
                attachments: window.location.href
            });
        } catch (error) {
            console.log('ℹ️ Приглашение друзей недоступно:', error);
        }
    }

    async shareResult(myScore, opponentScore) {
        try {
            const message = `🏆 Победил в "Кролик Панч"!\n🥊 Мой счет: ${myScore}\n😅 Счет противника: ${opponentScore}\n\nТвоя очередь показать класс!`;
            
            await this.bridge.send('VKWebAppShowWallPostBox', {
                message: message,
                attachments: window.location.href
            });
        } catch (error) {
            console.log('ℹ️ Публикация результата недоступна:', error);
        }
    }

    getMultiplayerState() {
        return {
            isActive: this.isMultiplayer,
            gameId: this.gameId,
            opponentId: this.opponentId,
            status: this.gameState.status,
            myScore: this.gameState.players?.[this.playerId]?.score || 0,
            opponentScore: this.gameState.players?.[this.opponentId]?.score || 0,
            myCombo: this.gameState.players?.[this.playerId]?.combo || 0,
            opponentCombo: this.gameState.players?.[this.opponentId]?.combo || 0,
            gameStarted: this.gameStarted,
            timeElapsed: this.gameState.gameStartTime ? 
                Math.floor((Date.now() - this.gameState.gameStartTime) / 1000) : 0
        };
    }

    getPlayerStats() {
        return {
            ...this.playerStats,
            winRate: this.playerStats.gamesPlayed > 0 ? 
                Math.round((this.playerStats.wins / this.playerStats.gamesPlayed) * 100) : 0
        };
    }
}

// Создаем глобальный экземпляр
window.vkMultiplayer = new VKMultiplayer();

// Глобальные функции для Construct 3 (уже определены в index.html)
console.log('🎮 VK Мультиплеер для "Кролик Панч" загружен!'); 