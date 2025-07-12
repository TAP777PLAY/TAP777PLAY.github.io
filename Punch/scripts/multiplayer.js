// Мультиплеерная система для игры "Кролик Панч"
// Использует GameScore для синхронизации между игроками

class MultiplayerManager {
    constructor() {
        this.isMultiplayer = false;
        this.gameId = null;
        this.playerId = null;
        this.opponentId = null;
        this.isHost = false;
        this.gameState = {
            status: 'waiting', // waiting, playing, finished
            players: {},
            moves: [],
            scores: {},
            timeLeft: 90
        };
        this.updateInterval = null;
        this.gameScore = null;
        this.matchmakingTimeout = 30000; // 30 секунд на поиск игры
        this.gameUpdateInterval = 1000; // Обновление каждую секунду
        
        // Привязка методов к контексту
        this.startMatchmaking = this.startMatchmaking.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.updateGameState = this.updateGameState.bind(this);
        this.sendMove = this.sendMove.bind(this);
        this.endGame = this.endGame.bind(this);
    }

    // Инициализация мультиплеера
    init(gameScoreInstance) {
        this.gameScore = gameScoreInstance;
        this.playerId = this.gameScore.PlayerID();
        console.log('Мультиплеер инициализирован для игрока:', this.playerId);
    }

    // Начать поиск игры
    async startMatchmaking() {
        if (!this.gameScore) {
            console.error('GameScore не инициализирован');
            return false;
        }

        console.log('Начинаем поиск игры...');
        this.showMatchmakingUI();

        try {
            // Сначала ищем существующие игры
            const existingGames = await this.findExistingGames();
            
            if (existingGames.length > 0) {
                // Присоединяемся к существующей игре
                const gameToJoin = existingGames[0];
                return await this.joinExistingGame(gameToJoin);
            } else {
                // Создаем новую игру
                return await this.createNewGame();
            }
        } catch (error) {
            console.error('Ошибка при поиске игры:', error);
            this.hideMatchmakingUI();
            return false;
        }
    }

    // Поиск существующих игр
    async findExistingGames() {
        try {
            // Используем глобальное хранилище для поиска игр
            const gamesList = await this.gameScore.StorageGetGlobal('multiplayer_games_list');
            const currentTime = Date.now();
            const maxGameAge = 60000; // 1 минута
            
            if (gamesList) {
                const games = JSON.parse(gamesList);
                return games.filter(game => 
                    game.status === 'waiting' && 
                    game.playersCount < 2 &&
                    (currentTime - game.createdAt) < maxGameAge
                );
            }
            return [];
        } catch (error) {
            console.error('Ошибка при поиске игр:', error);
            return [];
        }
    }

    // Создание новой игры
    async createNewGame() {
        this.gameId = 'game_' + Date.now() + '_' + this.playerId;
        this.isHost = true;
        
        const gameData = {
            id: this.gameId,
            host: this.playerId,
            hostName: this.gameScore.PlayerName(),
            status: 'waiting',
            playersCount: 1,
            createdAt: Date.now(),
            players: {
                [this.playerId]: {
                    id: this.playerId,
                    name: this.gameScore.PlayerName(),
                    score: 0,
                    ready: false
                }
            }
        };

        try {
            // Сохраняем игру в глобальное хранилище
            await this.gameScore.StorageSetGlobal('multiplayer_game_' + this.gameId, JSON.stringify(gameData));
            
            // Добавляем игру в список доступных игр
            await this.addGameToList(gameData);
            
            console.log('Создана новая игра:', this.gameId);
            this.gameState = gameData;
            this.isMultiplayer = true;
            
            // Начинаем ожидание второго игрока
            this.waitForOpponent();
            return true;
        } catch (error) {
            console.error('Ошибка при создании игры:', error);
            return false;
        }
    }

    // Присоединение к существующей игре
    async joinExistingGame(gameData) {
        this.gameId = gameData.id;
        this.isHost = false;
        this.opponentId = gameData.host;
        
        // Добавляем себя в игру
        gameData.players[this.playerId] = {
            id: this.playerId,
            name: this.gameScore.PlayerName(),
            score: 0,
            ready: false
        };
        gameData.playersCount = 2;
        gameData.status = 'ready';

        try {
            // Обновляем данные игры
            await this.gameScore.StorageSetGlobal('multiplayer_game_' + this.gameId, JSON.stringify(gameData));
            
            // Удаляем игру из списка доступных
            await this.removeGameFromList(this.gameId);
            
            console.log('Присоединились к игре:', this.gameId);
            this.gameState = gameData;
            this.isMultiplayer = true;
            
            // Начинаем игру
            this.startMultiplayerGame();
            return true;
        } catch (error) {
            console.error('Ошибка при присоединении к игре:', error);
            return false;
        }
    }

    // Добавление игры в список доступных
    async addGameToList(gameData) {
        try {
            const gamesList = await this.gameScore.StorageGetGlobal('multiplayer_games_list');
            let games = [];
            
            if (gamesList) {
                games = JSON.parse(gamesList);
            }
            
            games.push({
                id: gameData.id,
                host: gameData.host,
                hostName: gameData.hostName,
                status: gameData.status,
                playersCount: gameData.playersCount,
                createdAt: gameData.createdAt
            });
            
            await this.gameScore.StorageSetGlobal('multiplayer_games_list', JSON.stringify(games));
        } catch (error) {
            console.error('Ошибка при добавлении игры в список:', error);
        }
    }

    // Удаление игры из списка доступных
    async removeGameFromList(gameId) {
        try {
            const gamesList = await this.gameScore.StorageGetGlobal('multiplayer_games_list');
            
            if (gamesList) {
                let games = JSON.parse(gamesList);
                games = games.filter(game => game.id !== gameId);
                await this.gameScore.StorageSetGlobal('multiplayer_games_list', JSON.stringify(games));
            }
        } catch (error) {
            console.error('Ошибка при удалении игры из списка:', error);
        }
    }

    // Ожидание второго игрока
    waitForOpponent() {
        let attempts = 0;
        const maxAttempts = 30; // 30 секунд ожидания
        
        const checkInterval = setInterval(async () => {
            attempts++;
            
            try {
                const gameDataStr = await this.gameScore.StorageGetGlobal('multiplayer_game_' + this.gameId);
                const gameData = JSON.parse(gameDataStr);
                
                if (gameData.playersCount === 2) {
                    clearInterval(checkInterval);
                    this.gameState = gameData;
                    this.opponentId = Object.keys(gameData.players).find(id => id !== this.playerId);
                    console.log('Найден противник:', this.opponentId);
                    this.startMultiplayerGame();
                }
                
                if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    console.log('Время ожидания истекло');
                    this.cancelMatchmaking();
                }
            } catch (error) {
                console.error('Ошибка при ожидании противника:', error);
                clearInterval(checkInterval);
                this.cancelMatchmaking();
            }
        }, 1000);
    }

    // Начало мультиплеерной игры
    startMultiplayerGame() {
        console.log('Начинаем мультиплеерную игру!');
        this.hideMatchmakingUI();
        this.showMultiplayerUI();
        
        // Запускаем цикл обновления состояния игры
        this.updateInterval = setInterval(this.updateGameState, this.gameUpdateInterval);
        
        // Уведомляем Construct 3 о начале мультиплеерной игры
        if (window.cr_runtime) {
            window.cr_runtime.callFunction('StartMultiplayerGame', [this.opponentId, this.gameId]);
        }
    }

    // Отправка хода противнику
    async sendMove(moveData) {
        if (!this.isMultiplayer || !this.gameId) return;
        
        const move = {
            playerId: this.playerId,
            timestamp: Date.now(),
            data: moveData
        };
        
        try {
            // Получаем текущее состояние игры
            const gameDataStr = await this.gameScore.StorageGetGlobal('multiplayer_game_' + this.gameId);
            const gameData = JSON.parse(gameDataStr);
            
            // Добавляем ход
            if (!gameData.moves) gameData.moves = [];
            gameData.moves.push(move);
            
            // Обновляем счет игрока
            if (gameData.players[this.playerId]) {
                gameData.players[this.playerId].score = moveData.score || 0;
                gameData.players[this.playerId].lastMove = Date.now();
            }
            
            // Сохраняем обновленное состояние
            await this.gameScore.StorageSetGlobal('multiplayer_game_' + this.gameId, JSON.stringify(gameData));
            
            console.log('Ход отправлен:', move);
        } catch (error) {
            console.error('Ошибка при отправке хода:', error);
        }
    }

    // Обновление состояния игры
    async updateGameState() {
        if (!this.isMultiplayer || !this.gameId) return;
        
        try {
            const gameDataStr = await this.gameScore.StorageGetGlobal('multiplayer_game_' + this.gameId);
            const gameData = JSON.parse(gameDataStr);
            
            // Проверяем новые ходы противника
            if (gameData.moves && gameData.moves.length > 0) {
                const opponentMoves = gameData.moves.filter(move => 
                    move.playerId === this.opponentId && 
                    move.timestamp > (this.lastProcessedMove || 0)
                );
                
                opponentMoves.forEach(move => {
                    this.processOpponentMove(move);
                    this.lastProcessedMove = move.timestamp;
                });
            }
            
            // Обновляем локальное состояние
            this.gameState = gameData;
            
            // Проверяем условия окончания игры
            this.checkGameEnd();
            
        } catch (error) {
            console.error('Ошибка при обновлении состояния игры:', error);
        }
    }

    // Обработка хода противника
    processOpponentMove(move) {
        console.log('Получен ход противника:', move);
        
        // Уведомляем Construct 3 о ходе противника
        if (window.cr_runtime) {
            window.cr_runtime.callFunction('ProcessOpponentMove', [move.data]);
        }
    }

    // Проверка окончания игры
    checkGameEnd() {
        const currentTime = Date.now();
        const gameStartTime = this.gameState.createdAt;
        const gameDuration = 90000; // 90 секунд
        
        if (currentTime - gameStartTime >= gameDuration) {
            this.endGame();
        }
    }

    // Завершение игры
    async endGame() {
        console.log('Игра завершена');
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        try {
            // Обновляем статус игры
            const gameDataStr = await this.gameScore.StorageGetGlobal('multiplayer_game_' + this.gameId);
            const gameData = JSON.parse(gameDataStr);
            gameData.status = 'finished';
            gameData.endTime = Date.now();
            
            await this.gameScore.StorageSetGlobal('multiplayer_game_' + this.gameId, JSON.stringify(gameData));
            
            // Определяем победителя
            const myScore = gameData.players[this.playerId]?.score || 0;
            const opponentScore = gameData.players[this.opponentId]?.score || 0;
            
            let result = 'draw';
            if (myScore > opponentScore) result = 'win';
            else if (myScore < opponentScore) result = 'lose';
            
            // Показываем результат
            this.showGameResult(result, myScore, opponentScore);
            
            // Сохраняем результат в таблицу лидеров
            await this.saveGameResult(result, myScore, opponentScore);
            
        } catch (error) {
            console.error('Ошибка при завершении игры:', error);
        }
        
        // Сбрасываем состояние мультиплеера
        this.resetMultiplayerState();
    }

    // Отмена поиска игры
    cancelMatchmaking() {
        console.log('Отмена поиска игры');
        
        if (this.isHost && this.gameId) {
            // Удаляем созданную игру
            this.removeGameFromList(this.gameId);
            this.gameScore.StorageSetGlobal('multiplayer_game_' + this.gameId, '');
        }
        
        this.hideMatchmakingUI();
        this.resetMultiplayerState();
    }

    // Сброс состояния мультиплеера
    resetMultiplayerState() {
        this.isMultiplayer = false;
        this.gameId = null;
        this.opponentId = null;
        this.isHost = false;
        this.gameState = {
            status: 'waiting',
            players: {},
            moves: [],
            scores: {},
            timeLeft: 90
        };
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Сохранение результата игры
    async saveGameResult(result, myScore, opponentScore) {
        try {
            // Сохраняем в таблицу лидеров мультиплеера
            await this.gameScore.LeaderboardSetRecord('multiplayer', 'default', 'score', myScore);
            await this.gameScore.LeaderboardSetRecord('multiplayer', 'default', 'games_played', 1);
            
            if (result === 'win') {
                await this.gameScore.LeaderboardSetRecord('multiplayer', 'default', 'wins', 1);
            }
            
            await this.gameScore.LeaderboardPublishRecord('multiplayer', 'default', false);
            
        } catch (error) {
            console.error('Ошибка при сохранении результата:', error);
        }
    }

    // UI методы
    showMatchmakingUI() {
        console.log('Показываем UI поиска игры');
        // Здесь будет код для показа UI поиска игры в Construct 3
        if (window.cr_runtime) {
            window.cr_runtime.callFunction('ShowMatchmakingUI', []);
        }
    }

    hideMatchmakingUI() {
        console.log('Скрываем UI поиска игры');
        if (window.cr_runtime) {
            window.cr_runtime.callFunction('HideMatchmakingUI', []);
        }
    }

    showMultiplayerUI() {
        console.log('Показываем UI мультиплеера');
        if (window.cr_runtime) {
            window.cr_runtime.callFunction('ShowMultiplayerUI', [this.opponentId]);
        }
    }

    showGameResult(result, myScore, opponentScore) {
        console.log('Показываем результат игры:', result);
        if (window.cr_runtime) {
            window.cr_runtime.callFunction('ShowMultiplayerResult', [result, myScore, opponentScore]);
        }
    }

    // Геттеры для состояния
    getGameState() {
        return this.gameState;
    }

    getOpponentScore() {
        return this.gameState.players[this.opponentId]?.score || 0;
    }

    getMyScore() {
        return this.gameState.players[this.playerId]?.score || 0;
    }

    isInMultiplayerGame() {
        return this.isMultiplayer && this.gameState.status === 'playing';
    }
}

// Создаем глобальный экземпляр менеджера мультиплеера
window.MultiplayerManager = new MultiplayerManager();

// Экспортируем для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiplayerManager;
} 