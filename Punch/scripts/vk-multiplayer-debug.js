// Отладочная версия VK мультиплеера с подробным логированием
// Для диагностики проблем с подключением игроков

class VKMultiplayerDebug {
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
            status: 'waiting',
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
        this.debugMode = true;
        
        // Счетчики для отладки
        this.debugCounters = {
            storageReads: 0,
            storageWrites: 0,
            gameListUpdates: 0,
            matchmakingAttempts: 0,
            gameCreations: 0,
            gameJoins: 0
        };
        
        this.init();
    }

    log(message, level = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] VK-MP:`;
        
        switch (level) {
            case 'error':
                console.error(`${prefix} ❌ ${message}`);
                break;
            case 'warn':
                console.warn(`${prefix} ⚠️ ${message}`);
                break;
            case 'success':
                console.log(`${prefix} ✅ ${message}`);
                break;
            case 'debug':
                if (this.debugMode) {
                    console.log(`${prefix} 🔍 ${message}`);
                }
                break;
            default:
                console.log(`${prefix} ℹ️ ${message}`);
        }
    }

    async init() {
        this.log('Начинаем инициализацию VK мультиплеера...');
        
        try {
            // Проверяем окружение
            this.log(`Окружение: ${typeof window !== 'undefined' ? 'браузер' : 'другое'}`);
            this.log(`VK Bridge доступен: ${typeof vkBridge !== 'undefined'}`);
            this.log(`URL: ${window.location.href}`);
            
            // Инициализируем VK Bridge
            if (typeof vkBridge !== 'undefined') {
                this.bridge = vkBridge;
                this.log('VK Bridge найден', 'success');
            } else {
                this.log('VK Bridge не найден, используем заглушку', 'warn');
                this.bridge = this.createMockBridge();
            }
            
            // Инициализируем VK приложение
            this.log('Инициализируем VK приложение с ID 51831798...');
            const initResult = await this.bridge.send('VKWebAppInit', {
                app_id: 51831798
            });
            this.log(`Результат инициализации VK: ${JSON.stringify(initResult)}`);
            
            // Получаем информацию о пользователе
            this.log('Получаем информацию о пользователе...');
            const userInfo = await this.bridge.send('VKWebAppGetUserInfo');
            this.playerId = userInfo.id;
            this.playerName = `${userInfo.first_name} ${userInfo.last_name}`;
            this.playerPhoto = userInfo.photo_100 || '';
            
            this.log(`Пользователь: ${this.playerName} (ID: ${this.playerId})`, 'success');
            
            // Инициализируем хранилище
            this.log('Инициализируем хранилище...');
            await this.initStorage();
            
            this.isVKReady = true;
            this.log('VK мультиплеер готов к работе!', 'success');
            
            // Выводим отладочную информацию
            this.printDebugInfo();
            
        } catch (error) {
            this.log(`Ошибка инициализации: ${error.message}`, 'error');
            this.log(`Стек ошибки: ${error.stack}`, 'error');
            this.isVKReady = false;
        }
    }

    createMockBridge() {
        this.log('Создаем заглушку VK Bridge для тестирования', 'debug');
        
        return {
            send: async (method, params = {}) => {
                this.log(`Mock VK Bridge: ${method} ${JSON.stringify(params)}`, 'debug');
                
                switch (method) {
                    case 'VKWebAppInit':
                        return { result: true };
                    
                    case 'VKWebAppGetUserInfo':
                        const mockUser = {
                            id: Math.floor(Math.random() * 1000000),
                            first_name: 'Тестовый',
                            last_name: 'Игрок',
                            photo_100: ''
                        };
                        this.log(`Mock пользователь: ${JSON.stringify(mockUser)}`, 'debug');
                        return mockUser;
                    
                    case 'VKWebAppStorageGet':
                        const key = params.keys[0];
                        const mockData = {
                            'multiplayer_games': JSON.stringify([]),
                            'player_stats': JSON.stringify({
                                gamesPlayed: 0,
                                wins: 0,
                                losses: 0,
                                rating: 1000
                            })
                        };
                        const result = {
                            keys: [{
                                key: key,
                                value: mockData[key] || ''
                            }]
                        };
                        this.log(`Mock Storage GET ${key}: ${result.keys[0].value}`, 'debug');
                        return result;
                    
                    case 'VKWebAppStorageSet':
                        this.log(`Mock Storage SET ${params.key}: ${params.value}`, 'debug');
                        return { result: true };
                    
                    case 'VKWebAppShowWallPostBox':
                        this.log(`Mock пост на стену: ${params.message}`, 'debug');
                        return { result: true };
                    
                    default:
                        return { result: true };
                }
            }
        };
    }

    async initStorage() {
        try {
            this.log('Получаем список игр из хранилища...');
            const gamesData = await this.bridge.send('VKWebAppStorageGet', {
                keys: ['multiplayer_games']
            });
            this.debugCounters.storageReads++;
            
            const gamesValue = gamesData.keys[0]?.value || '[]';
            this.log(`Сырые данные игр: ${gamesValue}`, 'debug');
            
            try {
                this.gamesList = JSON.parse(gamesValue);
                this.log(`Загружено игр: ${this.gamesList.length}`);
            } catch (parseError) {
                this.log(`Ошибка парсинга списка игр: ${parseError.message}`, 'error');
                this.gamesList = [];
            }
            
            // Очищаем старые игры
            const now = Date.now();
            const oldGamesCount = this.gamesList.length;
            this.gamesList = this.gamesList.filter(game => 
                now - game.createdAt < 10 * 60 * 1000
            );
            
            if (oldGamesCount !== this.gamesList.length) {
                this.log(`Удалено старых игр: ${oldGamesCount - this.gamesList.length}`);
                await this.saveGamesList();
            }
            
            // Получаем статистику игрока
            this.log('Получаем статистику игрока...');
            const statsData = await this.bridge.send('VKWebAppStorageGet', {
                keys: ['player_stats']
            });
            this.debugCounters.storageReads++;
            
            const statsValue = statsData.keys[0]?.value;
            this.log(`Сырые данные статистики: ${statsValue}`, 'debug');
            
            if (statsValue) {
                try {
                    this.playerStats = JSON.parse(statsValue);
                    this.log(`Загружена статистика: ${JSON.stringify(this.playerStats)}`);
                } catch (parseError) {
                    this.log(`Ошибка парсинга статистики: ${parseError.message}`, 'error');
                    this.playerStats = {
                        gamesPlayed: 0,
                        wins: 0,
                        losses: 0,
                        rating: 1000
                    };
                }
            } else {
                this.log('Статистика не найдена, создаем новую');
                this.playerStats = {
                    gamesPlayed: 0,
                    wins: 0,
                    losses: 0,
                    rating: 1000
                };
                await this.savePlayerStats();
            }
            
            this.log('Хранилище инициализировано успешно', 'success');
            
        } catch (error) {
            this.log(`Ошибка инициализации хранилища: ${error.message}`, 'error');
            this.log(`Стек ошибки: ${error.stack}`, 'error');
        }
    }

    async saveGamesList() {
        try {
            this.log(`Сохраняем список игр: ${this.gamesList.length} игр`);
            await this.bridge.send('VKWebAppStorageSet', {
                key: 'multiplayer_games',
                value: JSON.stringify(this.gamesList)
            });
            this.debugCounters.storageWrites++;
            this.debugCounters.gameListUpdates++;
            this.log('Список игр сохранен', 'success');
        } catch (error) {
            this.log(`Ошибка сохранения списка игр: ${error.message}`, 'error');
        }
    }

    async savePlayerStats() {
        try {
            this.log(`Сохраняем статистику: ${JSON.stringify(this.playerStats)}`);
            await this.bridge.send('VKWebAppStorageSet', {
                key: 'player_stats',
                value: JSON.stringify(this.playerStats)
            });
            this.debugCounters.storageWrites++;
            this.log('Статистика сохранена', 'success');
        } catch (error) {
            this.log(`Ошибка сохранения статистики: ${error.message}`, 'error');
        }
    }

    async startMatchmaking() {
        this.debugCounters.matchmakingAttempts++;
        this.log(`Начинаем поиск игры (попытка #${this.debugCounters.matchmakingAttempts})`);
        
        if (!this.isVKReady) {
            this.log('VK не готов, отмена поиска', 'error');
            return false;
        }

        this.log(`Игрок ${this.playerId} ищет игру...`);
        
        // Показываем UI поиска
        if (window.OnShowMatchmakingUI) {
            this.log('Показываем UI поиска');
            window.OnShowMatchmakingUI();
        }
        
        // Обновляем список игр
        await this.refreshGamesList();
        
        // Ищем доступную игру
        const availableGame = this.gamesList.find(game => 
            game.status === 'waiting' && 
            game.host !== this.playerId &&
            Date.now() - game.createdAt < 5 * 60 * 1000
        );
        
        if (availableGame) {
            this.log(`Найдена доступная игра: ${availableGame.id} (хост: ${availableGame.hostName})`, 'success');
            return await this.joinGame(availableGame.id);
        } else {
            this.log('Доступных игр не найдено, создаем новую');
            await this.createGame();
            return true;
        }
    }

    async refreshGamesList() {
        this.log('Обновляем список игр...');
        try {
            const gamesData = await this.bridge.send('VKWebAppStorageGet', {
                keys: ['multiplayer_games']
            });
            this.debugCounters.storageReads++;
            
            const gamesValue = gamesData.keys[0]?.value || '[]';
            this.gamesList = JSON.parse(gamesValue);
            
            this.log(`Обновлен список игр: ${this.gamesList.length} игр`);
            this.gamesList.forEach((game, index) => {
                this.log(`  ${index + 1}. ${game.id} - ${game.status} (${game.hostName})`, 'debug');
            });
            
        } catch (error) {
            this.log(`Ошибка обновления списка игр: ${error.message}`, 'error');
        }
    }

    async createGame() {
        this.debugCounters.gameCreations++;
        this.gameId = `game_${Date.now()}_${this.playerId}`;
        
        this.log(`Создаем игру: ${this.gameId}`, 'success');
        
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
                    ready: false
                }
            },
            createdAt: Date.now(),
            gameStartTime: null,
            moves: [],
            gameType: 'rabbit_punch'
        };
        
        // Добавляем в список игр
        const gameListEntry = {
            id: this.gameId,
            host: this.playerId,
            hostName: this.playerName,
            status: 'waiting',
            createdAt: Date.now(),
            gameType: 'rabbit_punch'
        };
        
        this.gamesList.push(gameListEntry);
        
        await this.saveGamesList();
        await this.saveGameState(this.gameId, gameData);
        
        this.gameState = gameData;
        this.isMultiplayer = true;
        
        this.log(`Игра создана: ${this.gameId}`, 'success');
        this.log(`Ожидаем второго игрока...`);
        
        // Ждем второго игрока
        this.waitForOpponent();
    }

    async saveGameState(gameId, gameData) {
        try {
            this.log(`Сохраняем состояние игры: ${gameId}`, 'debug');
            await this.bridge.send('VKWebAppStorageSet', {
                key: `game_${gameId}`,
                value: JSON.stringify(gameData)
            });
            this.debugCounters.storageWrites++;
            this.log(`Состояние игры ${gameId} сохранено`, 'success');
        } catch (error) {
            this.log(`Ошибка сохранения состояния игры: ${error.message}`, 'error');
        }
    }

    async loadGameState(gameId) {
        try {
            this.log(`Загружаем состояние игры: ${gameId}`, 'debug');
            const data = await this.bridge.send('VKWebAppStorageGet', {
                keys: [`game_${gameId}`]
            });
            this.debugCounters.storageReads++;
            
            const value = data.keys[0]?.value;
            if (value) {
                const gameData = JSON.parse(value);
                this.log(`Состояние игры ${gameId} загружено`, 'success');
                return gameData;
            } else {
                this.log(`Состояние игры ${gameId} не найдено`, 'warn');
                return null;
            }
        } catch (error) {
            this.log(`Ошибка загрузки состояния игры: ${error.message}`, 'error');
            return null;
        }
    }

    waitForOpponent() {
        this.log('Ожидаем противника...');
        
        const checkInterval = setInterval(async () => {
            this.log('Проверяем наличие противника...', 'debug');
            const gameData = await this.loadGameState(this.gameId);
            
            if (gameData && Object.keys(gameData.players).length >= 2) {
                clearInterval(checkInterval);
                
                this.gameState = gameData;
                this.opponentId = Object.keys(gameData.players).find(id => id != this.playerId);
                this.gameStarted = true;
                
                this.log(`Противник найден! ID: ${this.opponentId}`, 'success');
                
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
                
                this.startGameUpdates();
            }
        }, 2000);
        
        // Таймаут поиска 60 секунд
        setTimeout(() => {
            clearInterval(checkInterval);
            if (!this.opponentId) {
                this.log('Время поиска истекло', 'warn');
                this.cancelMatchmaking();
            }
        }, 60000);
    }

    async joinGame(gameId) {
        this.debugCounters.gameJoins++;
        this.log(`Присоединяемся к игре: ${gameId}`, 'success');
        
        const gameData = await this.loadGameState(gameId);
        if (!gameData) {
            this.log('Игра не найдена', 'error');
            return false;
        }
        
        if (Object.keys(gameData.players).length >= 2) {
            this.log('Игра уже заполнена', 'error');
            return false;
        }
        
        // Добавляем себя в игру
        gameData.players[this.playerId] = {
            id: this.playerId,
            name: this.playerName,
            photo: this.playerPhoto,
            score: 0,
            combo: 0,
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
        
        this.log(`Присоединились к игре! Противник: ${this.opponentId}`, 'success');
        
        // Скрываем UI поиска и показываем игру
        if (window.OnHideMatchmakingUI) {
            window.OnHideMatchmakingUI();
        }
        
        if (window.OnMultiplayerGameStart) {
            window.OnMultiplayerGameStart(this.opponentId, this.gameId);
        }
        
        this.startGameUpdates();
        
        return true;
    }

    startGameUpdates() {
        this.log('Запускаем обновления игры...');
        
        this.updateInterval = setInterval(async () => {
            const gameData = await this.loadGameState(this.gameId);
            
            if (gameData) {
                // Проверяем новые ходы
                const newMoves = gameData.moves.filter(move => 
                    move.playerId !== this.playerId &&
                    move.timestamp > (this.lastMoveTime || 0)
                );
                
                if (newMoves.length > 0) {
                    this.log(`Получено новых ходов: ${newMoves.length}`, 'debug');
                    newMoves.forEach(move => {
                        this.processOpponentMove(move);
                        this.lastMoveTime = move.timestamp;
                    });
                }
                
                this.gameState = gameData;
                
                // Проверяем завершение игры
                if (gameData.status === 'finished') {
                    this.log('Игра завершена');
                    this.endGame();
                }
            }
        }, 1000);
    }

    processOpponentMove(move) {
        this.log(`Обработка хода противника: ${move.type} (${move.score} очков)`, 'debug');
        
        if (window.OnOpponentMove) {
            window.OnOpponentMove(move.type, move.x, move.y, move.score, move.combo);
        }
    }

    async cancelMatchmaking() {
        this.log('Отмена поиска игры');
        
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

    resetGame() {
        this.isMultiplayer = false;
        this.gameId = null;
        this.opponentId = null;
        this.gameStarted = false;
        this.lastMoveTime = 0;
        this.movesQueue = [];
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
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
            gameStarted: this.gameStarted,
            isVKReady: this.isVKReady
        };
    }

    printDebugInfo() {
        this.log('=== ОТЛАДОЧНАЯ ИНФОРМАЦИЯ ===');
        this.log(`Игрок: ${this.playerName} (ID: ${this.playerId})`);
        this.log(`VK готов: ${this.isVKReady}`);
        this.log(`Активных игр: ${this.gamesList.length}`);
        this.log(`Статистика: ${JSON.stringify(this.playerStats)}`);
        this.log(`Счетчики: ${JSON.stringify(this.debugCounters)}`);
        this.log('=== КОНЕЦ ОТЛАДОЧНОЙ ИНФОРМАЦИИ ===');
    }

    // Методы для отладки через консоль
    debugInfo() {
        this.printDebugInfo();
    }

    debugGamesList() {
        this.log('=== СПИСОК ИГР ===');
        this.gamesList.forEach((game, index) => {
            this.log(`${index + 1}. ${game.id}`);
            this.log(`   Хост: ${game.hostName} (${game.host})`);
            this.log(`   Статус: ${game.status}`);
            this.log(`   Создана: ${new Date(game.createdAt).toLocaleString()}`);
        });
        this.log('=== КОНЕЦ СПИСКА ИГР ===');
    }

    async debugStorage() {
        this.log('=== ОТЛАДКА ХРАНИЛИЩА ===');
        
        try {
            const keys = ['multiplayer_games', 'player_stats', `game_${this.gameId}`];
            const data = await this.bridge.send('VKWebAppStorageGet', { keys });
            
            data.keys.forEach(item => {
                this.log(`${item.key}: ${item.value}`);
            });
            
        } catch (error) {
            this.log(`Ошибка чтения хранилища: ${error.message}`, 'error');
        }
        
        this.log('=== КОНЕЦ ОТЛАДКИ ХРАНИЛИЩА ===');
    }
}

// Создаем отладочный экземпляр
window.vkMultiplayerDebug = new VKMultiplayerDebug();

// Глобальные функции для отладки
window.debugVKMultiplayer = function() {
    window.vkMultiplayerDebug.debugInfo();
};

window.debugVKGamesList = function() {
    window.vkMultiplayerDebug.debugGamesList();
};

window.debugVKStorage = function() {
    window.vkMultiplayerDebug.debugStorage();
};

console.log('🔍 VK Мультиплеер (отладочная версия) загружен!');
console.log('Доступные команды для отладки:');
console.log('- debugVKMultiplayer() - общая информация');
console.log('- debugVKGamesList() - список игр');
console.log('- debugVKStorage() - содержимое хранилища'); 