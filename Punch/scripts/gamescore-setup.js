// Автоматическая настройка GameScore для мультиплеера
// Запустите этот скрипт в консоли браузера после загрузки игры

class GameScoreSetup {
    constructor() {
        this.gameScore = null;
        this.setupStatus = {
            globalStorage: false,
            cloudStorage: false,
            leaderboard: false,
            permissions: false
        };
        
        this.init();
    }

    async init() {
        console.log('🎮 Запуск автоматической настройки GameScore...');
        
        // Ждем инициализации GameScore
        await this.waitForGameScore();
        
        // Проверяем текущие настройки
        await this.checkCurrentSettings();
        
        // Выполняем настройку
        await this.setupGameScore();
        
        // Проверяем результат
        await this.verifySetup();
        
        console.log('✅ Настройка GameScore завершена!');
    }

    async waitForGameScore() {
        return new Promise((resolve) => {
            const checkGameScore = () => {
                if (typeof gp !== 'undefined' && gp.isReady) {
                    this.gameScore = gp;
                    console.log('✅ GameScore готов');
                    resolve();
                } else {
                    console.log('⏳ Ожидание GameScore...');
                    setTimeout(checkGameScore, 1000);
                }
            };
            checkGameScore();
        });
    }

    async checkCurrentSettings() {
        console.log('🔍 Проверка текущих настроек...');
        
        try {
            // Проверка глобального хранилища
            const globalTest = await this.gameScore.storage.getGlobal('test_key');
            console.log('✅ Глобальное хранилище: доступно');
            this.setupStatus.globalStorage = true;
        } catch (error) {
            console.log('❌ Глобальное хранилище: недоступно');
            console.log('   Ошибка:', error.message);
        }

        try {
            // Проверка облачного хранилища
            const cloudTest = await this.gameScore.storage.get('test_key');
            console.log('✅ Облачное хранилище: доступно');
            this.setupStatus.cloudStorage = true;
        } catch (error) {
            console.log('❌ Облачное хранилище: недоступно');
            console.log('   Ошибка:', error.message);
        }

        try {
            // Проверка таблиц лидеров
            const leaderboardTest = await this.gameScore.leaderboard.getTable('multiplayer');
            console.log('✅ Таблица лидеров "multiplayer": существует');
            this.setupStatus.leaderboard = true;
        } catch (error) {
            console.log('❌ Таблица лидеров "multiplayer": не найдена');
            console.log('   Ошибка:', error.message);
        }
    }

    async setupGameScore() {
        console.log('⚙️ Настройка GameScore...');

        // Инициализация глобального хранилища
        await this.setupGlobalStorage();
        
        // Инициализация облачного хранилища
        await this.setupCloudStorage();
        
        // Создание таблицы лидеров
        await this.setupLeaderboard();
    }

    async setupGlobalStorage() {
        console.log('🌐 Настройка глобального хранилища...');
        
        try {
            // Инициализируем список игр
            const gamesList = await this.gameScore.storage.getGlobal('multiplayer_games_list');
            
            if (!gamesList) {
                await this.gameScore.storage.setGlobal('multiplayer_games_list', JSON.stringify([]));
                console.log('✅ Список игр инициализирован');
            } else {
                console.log('✅ Список игр уже существует');
            }
            
            // Очищаем старые игры (старше 30 минут)
            await this.cleanupOldGames();
            
            this.setupStatus.globalStorage = true;
        } catch (error) {
            console.log('❌ Ошибка настройки глобального хранилища:', error.message);
        }
    }

    async setupCloudStorage() {
        console.log('☁️ Настройка облачного хранилища...');
        
        try {
            // Инициализируем статистику игрока
            let playerStats = await this.gameScore.storage.get('multiplayerStats');
            
            if (!playerStats) {
                const defaultStats = {
                    gamesPlayed: 0,
                    wins: 0,
                    losses: 0,
                    totalScore: 0,
                    averageScore: 0,
                    bestScore: 0,
                    rating: 1000
                };
                
                await this.gameScore.storage.set('multiplayerStats', JSON.stringify(defaultStats));
                console.log('✅ Статистика игрока инициализирована');
            } else {
                console.log('✅ Статистика игрока уже существует');
            }
            
            this.setupStatus.cloudStorage = true;
        } catch (error) {
            console.log('❌ Ошибка настройки облачного хранилища:', error.message);
        }
    }

    async setupLeaderboard() {
        console.log('🏆 Настройка таблицы лидеров...');
        
        try {
            // Пытаемся получить таблицу
            await this.gameScore.leaderboard.getTable('multiplayer');
            console.log('✅ Таблица лидеров "multiplayer" уже существует');
            this.setupStatus.leaderboard = true;
        } catch (error) {
            console.log('⚠️ Таблица лидеров "multiplayer" не найдена');
            console.log('   Необходимо создать вручную в панели GameScore');
            console.log('   Инструкции: см. файл GAMESCORE_SETUP_GUIDE.md');
        }
    }

    async cleanupOldGames() {
        try {
            const gamesListStr = await this.gameScore.storage.getGlobal('multiplayer_games_list');
            if (!gamesListStr) return;
            
            const gamesList = JSON.parse(gamesListStr);
            const now = Date.now();
            const thirtyMinutes = 30 * 60 * 1000;
            
            // Фильтруем игры, удаляя старые
            const activeGames = gamesList.filter(game => {
                const gameAge = now - game.createdAt;
                return gameAge < thirtyMinutes;
            });
            
            if (activeGames.length !== gamesList.length) {
                await this.gameScore.storage.setGlobal('multiplayer_games_list', JSON.stringify(activeGames));
                console.log(`🧹 Очищено ${gamesList.length - activeGames.length} старых игр`);
            }
        } catch (error) {
            console.log('⚠️ Ошибка очистки старых игр:', error.message);
        }
    }

    async verifySetup() {
        console.log('🔍 Проверка настроек...');
        
        const allGood = Object.values(this.setupStatus).every(status => status);
        
        if (allGood) {
            console.log('✅ Все компоненты настроены правильно!');
            console.log('🎮 Мультиплеер готов к использованию');
        } else {
            console.log('⚠️ Некоторые компоненты требуют ручной настройки:');
            
            if (!this.setupStatus.globalStorage) {
                console.log('❌ Глобальное хранилище - требует включения в панели GameScore');
            }
            
            if (!this.setupStatus.cloudStorage) {
                console.log('❌ Облачное хранилище - требует включения в панели GameScore');
            }
            
            if (!this.setupStatus.leaderboard) {
                console.log('❌ Таблица лидеров - требует создания в панели GameScore');
            }
        }
        
        // Показываем полезную информацию
        this.showUsefulInfo();
    }

    showUsefulInfo() {
        console.log('\n📋 Полезная информация:');
        console.log('🌐 Панель GameScore: https://gs.eponesh.com');
        console.log('🆔 ID проекта: 248');
        console.log('📖 Подробная инструкция: GAMESCORE_SETUP_GUIDE.md');
        
        console.log('\n🧪 Команды для тестирования:');
        console.log('// Проверка списка игр');
        console.log('gp.storage.getGlobal("multiplayer_games_list").then(console.log);');
        
        console.log('// Проверка статистики');
        console.log('gp.storage.get("multiplayerStats").then(console.log);');
        
        console.log('// Сброс настроек (для тестирования)');
        console.log('gp.storage.setGlobal("multiplayer_games_list", "[]");');
        
        console.log('\n🎯 Для запуска мультиплеера:');
        console.log('1. Откройте multiplayer-demo.html');
        console.log('2. Или нажмите "Играть с случайным игроком" в игре');
    }
}

// Автоматический запуск при загрузке
if (typeof window !== 'undefined') {
    // Запускаем настройку после загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => new GameScoreSetup(), 2000);
        });
    } else {
        setTimeout(() => new GameScoreSetup(), 2000);
    }
}

// Экспорт для ручного запуска
if (typeof window !== 'undefined') {
    window.GameScoreSetup = GameScoreSetup;
    window.setupGameScore = () => new GameScoreSetup();
}

// Экспорт для Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameScoreSetup;
} 