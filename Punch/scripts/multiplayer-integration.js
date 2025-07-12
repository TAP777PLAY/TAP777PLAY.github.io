// Интеграция мультиплеера с Construct 3
// Этот файл связывает мультиплеерную систему с игровым движком

class MultiplayerIntegration {
    constructor() {
        this.runtime = null;
        this.multiplayer = null;
        this.gameScoreInstance = null;
        this.isInitialized = false;
        
        // Привязка методов к контексту
        this.init = this.init.bind(this);
        this.onGameScoreReady = this.onGameScoreReady.bind(this);
        this.startMultiplayerMatch = this.startMultiplayerMatch.bind(this);
        this.sendPlayerMove = this.sendPlayerMove.bind(this);
        this.endMultiplayerGame = this.endMultiplayerGame.bind(this);
    }

    // Инициализация интеграции
    init(runtime) {
        this.runtime = runtime;
        this.multiplayer = window.MultiplayerManager;
        
        if (!this.multiplayer) {
            console.error('MultiplayerManager не найден!');
            return false;
        }

        // Ждем инициализации GameScore
        this.waitForGameScore();
        
        console.log('Интеграция мультиплеера инициализирована');
        return true;
    }

    // Ожидание готовности GameScore
    waitForGameScore() {
        const checkGameScore = () => {
            if (this.runtime && this.runtime.GameScore) {
                this.onGameScoreReady(this.runtime.GameScore);
            } else {
                setTimeout(checkGameScore, 100);
            }
        };
        checkGameScore();
    }

    // Обработка готовности GameScore
    onGameScoreReady(gameScore) {
        this.gameScoreInstance = gameScore;
        this.multiplayer.init(gameScore);
        this.isInitialized = true;
        
        console.log('GameScore готов для мультиплеера');
        
        // Регистрируем глобальные функции для Construct 3
        this.registerConstructFunctions();
    }

    // Регистрация функций для Construct 3
    registerConstructFunctions() {
        const self = this;
        
        // Функция для начала поиска игры
        window.StartMultiplayerMatchmaking = function() {
            console.log('Запуск поиска мультиплеерной игры');
            return self.startMultiplayerMatch();
        };

        // Функция для отправки хода
        window.SendMultiplayerMove = function(moveType, x, y, score, combo) {
            const moveData = {
                type: moveType,
                x: x,
                y: y,
                score: score,
                combo: combo,
                timestamp: Date.now()
            };
            return self.sendPlayerMove(moveData);
        };

        // Функция для завершения игры
        window.EndMultiplayerGame = function() {
            return self.endMultiplayerGame();
        };

        // Функция для отмены поиска
        window.CancelMultiplayerMatchmaking = function() {
            return self.multiplayer.cancelMatchmaking();
        };

        // Функция для получения состояния мультиплеера
        window.GetMultiplayerState = function() {
            return {
                isActive: self.multiplayer.isMultiplayer,
                gameId: self.multiplayer.gameId,
                opponentId: self.multiplayer.opponentId,
                isHost: self.multiplayer.isHost,
                myScore: self.multiplayer.getMyScore(),
                opponentScore: self.multiplayer.getOpponentScore()
            };
        };

        // Функция для проверки, активен ли мультиплеер
        window.IsMultiplayerActive = function() {
            return self.multiplayer.isInMultiplayerGame();
        };

        // Функции обратного вызова для Construct 3
        window.StartMultiplayerGame = function(opponentId, gameId) {
            console.log('Начинаем мультиплеерную игру с:', opponentId);
            self.notifyConstruct('OnMultiplayerGameStart', [opponentId, gameId]);
        };

        window.ProcessOpponentMove = function(moveData) {
            console.log('Обрабатываем ход противника:', moveData);
            self.notifyConstruct('OnOpponentMove', [
                moveData.type,
                moveData.x,
                moveData.y,
                moveData.score,
                moveData.combo
            ]);
        };

        window.ShowMatchmakingUI = function() {
            self.notifyConstruct('OnShowMatchmakingUI', []);
        };

        window.HideMatchmakingUI = function() {
            self.notifyConstruct('OnHideMatchmakingUI', []);
        };

        window.ShowMultiplayerUI = function(opponentId) {
            self.notifyConstruct('OnShowMultiplayerUI', [opponentId]);
        };

        window.ShowMultiplayerResult = function(result, myScore, opponentScore) {
            self.notifyConstruct('OnMultiplayerGameEnd', [result, myScore, opponentScore]);
        };

        console.log('Функции мультиплеера зарегистрированы');
    }

    // Начало поиска мультиплеерной игры
    async startMultiplayerMatch() {
        if (!this.isInitialized) {
            console.error('Мультиплеер не инициализирован');
            return false;
        }

        try {
            const success = await this.multiplayer.startMatchmaking();
            if (success) {
                console.log('Поиск игры начат успешно');
                return true;
            } else {
                console.log('Не удалось начать поиск игры');
                return false;
            }
        } catch (error) {
            console.error('Ошибка при запуске поиска игры:', error);
            return false;
        }
    }

    // Отправка хода игрока
    async sendPlayerMove(moveData) {
        if (!this.multiplayer.isMultiplayer) {
            return false;
        }

        try {
            await this.multiplayer.sendMove(moveData);
            return true;
        } catch (error) {
            console.error('Ошибка при отправке хода:', error);
            return false;
        }
    }

    // Завершение мультиплеерной игры
    async endMultiplayerGame() {
        if (!this.multiplayer.isMultiplayer) {
            return false;
        }

        try {
            await this.multiplayer.endGame();
            return true;
        } catch (error) {
            console.error('Ошибка при завершении игры:', error);
            return false;
        }
    }

    // Уведомление Construct 3 о событиях
    notifyConstruct(eventName, parameters = []) {
        if (!this.runtime) {
            console.warn('Runtime не доступен для уведомления:', eventName);
            return;
        }

        try {
            // Пытаемся вызвать функцию в Construct 3
            if (this.runtime.callFunction) {
                this.runtime.callFunction(eventName, parameters);
            } else {
                console.warn('callFunction не доступен в runtime');
            }
        } catch (error) {
            console.error('Ошибка при уведомлении Construct:', error);
        }
    }

    // Получение информации о текущем состоянии мультиплеера
    getMultiplayerInfo() {
        if (!this.multiplayer) {
            return null;
        }

        return {
            isActive: this.multiplayer.isMultiplayer,
            gameId: this.multiplayer.gameId,
            playerId: this.multiplayer.playerId,
            opponentId: this.multiplayer.opponentId,
            isHost: this.multiplayer.isHost,
            gameState: this.multiplayer.getGameState(),
            myScore: this.multiplayer.getMyScore(),
            opponentScore: this.multiplayer.getOpponentScore()
        };
    }

    // Проверка готовности мультиплеера
    isReady() {
        return this.isInitialized && this.multiplayer && this.gameScoreInstance;
    }

    // Очистка ресурсов
    cleanup() {
        if (this.multiplayer) {
            this.multiplayer.resetMultiplayerState();
        }
        
        // Удаляем глобальные функции
        delete window.StartMultiplayerMatchmaking;
        delete window.SendMultiplayerMove;
        delete window.EndMultiplayerGame;
        delete window.CancelMultiplayerMatchmaking;
        delete window.GetMultiplayerState;
        delete window.IsMultiplayerActive;
        delete window.StartMultiplayerGame;
        delete window.ProcessOpponentMove;
        delete window.ShowMatchmakingUI;
        delete window.HideMatchmakingUI;
        delete window.ShowMultiplayerUI;
        delete window.ShowMultiplayerResult;
        
        console.log('Интеграция мультиплеера очищена');
    }
}

// Создаем глобальный экземпляр интеграции
window.MultiplayerIntegration = new MultiplayerIntegration();

// Автоматическая инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Ждем готовности runtime
    const initIntegration = () => {
        if (window.cr_runtime) {
            window.MultiplayerIntegration.init(window.cr_runtime);
        } else {
            setTimeout(initIntegration, 100);
        }
    };
    
    setTimeout(initIntegration, 1000); // Даем время на инициализацию Construct 3
});

// Экспортируем для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiplayerIntegration;
} 