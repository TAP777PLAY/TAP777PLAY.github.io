// Минимальная версия VK мультиплеера
// Самая простая реализация для проверки работы VK Bridge

console.log('🎮 Загружаем минимальный VK мультиплеер...');

// Глобальные переменные
window.vkMultiplayerMinimal = {
    isReady: false,
    playerId: null,
    playerName: '',
    bridge: null,
    gamesList: []
};

// Функция логирования
function logVK(message, type) {
    var timestamp = new Date().toLocaleTimeString();
    var emoji = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warn' ? '⚠️' : 'ℹ️';
    console.log('[' + timestamp + '] VK-MP: ' + emoji + ' ' + message);
}

// Инициализация
function initVKMultiplayer() {
    logVK('Начинаем инициализацию...');
    
    try {
        // Проверяем VK Bridge
        if (typeof window.vkBridge !== 'undefined') {
            window.vkMultiplayerMinimal.bridge = window.vkBridge;
            logVK('VK Bridge найден!', 'success');
            
            // Инициализируем VK
            window.vkBridge.send('VKWebAppInit', { app_id: 51831798 })
                .then(function(result) {
                    logVK('VK инициализирован: ' + JSON.stringify(result), 'success');
                    
                    // Получаем данные пользователя
                    return window.vkBridge.send('VKWebAppGetUserInfo');
                })
                .then(function(userInfo) {
                    window.vkMultiplayerMinimal.playerId = userInfo.id;
                    window.vkMultiplayerMinimal.playerName = userInfo.first_name + ' ' + userInfo.last_name;
                    window.vkMultiplayerMinimal.isReady = true;
                    
                    logVK('Пользователь: ' + window.vkMultiplayerMinimal.playerName + ' (ID: ' + window.vkMultiplayerMinimal.playerId + ')', 'success');
                    logVK('VK мультиплеер готов к работе!', 'success');
                })
                .catch(function(error) {
                    logVK('Ошибка инициализации VK: ' + error.message, 'error');
                });
        } else {
            logVK('VK Bridge не найден! Игра должна быть открыта в VK.', 'error');
        }
    } catch (error) {
        logVK('Критическая ошибка: ' + error.message, 'error');
    }
}

// Начать поиск игры
function startMatchmakingMinimal() {
    logVK('Начинаем поиск игры...');
    
    if (!window.vkMultiplayerMinimal.isReady) {
        logVK('VK не готов! Подождите инициализации.', 'error');
        return false;
    }
    
    // Показываем UI поиска
    if (window.OnShowMatchmakingUI) {
        window.OnShowMatchmakingUI();
    }
    
    // Пытаемся получить список игр
    window.vkBridge.send('VKWebAppStorageGet', { keys: ['multiplayer_games'] })
        .then(function(data) {
            logVK('Получены данные из VK Storage', 'success');
            
            var gamesValue = data.keys[0].value || '[]';
            logVK('Сырые данные игр: ' + gamesValue);
            
            try {
                window.vkMultiplayerMinimal.gamesList = JSON.parse(gamesValue);
                logVK('Загружено игр: ' + window.vkMultiplayerMinimal.gamesList.length, 'success');
                
                // Создаем новую игру
                createGameMinimal();
                
            } catch (parseError) {
                logVK('Ошибка парсинга данных: ' + parseError.message, 'error');
                // Все равно создаем игру
                createGameMinimal();
            }
        })
        .catch(function(error) {
            logVK('Ошибка получения данных из VK Storage: ' + error.message, 'error');
            
            // Проверяем, есть ли разрешения VK Storage
            if (error.message.includes('permissions')) {
                logVK('Нет разрешений VK Storage! Проверьте настройки приложения в vk.com/dev', 'error');
            }
        });
    
    return true;
}

// Создать игру
function createGameMinimal() {
    var gameId = 'game_' + Date.now() + '_' + window.vkMultiplayerMinimal.playerId;
    logVK('Создаем игру: ' + gameId, 'success');
    
    var gameData = {
        id: gameId,
        host: window.vkMultiplayerMinimal.playerId,
        hostName: window.vkMultiplayerMinimal.playerName,
        status: 'waiting',
        createdAt: Date.now()
    };
    
    // Добавляем в список
    window.vkMultiplayerMinimal.gamesList.push(gameData);
    
    // Сохраняем в VK Storage
    window.vkBridge.send('VKWebAppStorageSet', {
        key: 'multiplayer_games',
        value: JSON.stringify(window.vkMultiplayerMinimal.gamesList)
    })
    .then(function(result) {
        logVK('Игра сохранена в VK Storage!', 'success');
        logVK('Результат сохранения: ' + JSON.stringify(result));
        
        // Имитируем поиск противника
        setTimeout(function() {
            logVK('Ждем противника... (через 10 сек будет тест)', 'warn');
            
            setTimeout(function() {
                // Имитируем нахождение противника
                logVK('Противник найден! (тестовый)', 'success');
                
                if (window.OnHideMatchmakingUI) {
                    window.OnHideMatchmakingUI();
                }
                
                if (window.OnMultiplayerGameStart) {
                    window.OnMultiplayerGameStart('test_opponent', gameId);
                }
            }, 10000);
        }, 1000);
        
    })
    .catch(function(error) {
        logVK('Ошибка сохранения в VK Storage: ' + error.message, 'error');
        
        if (error.message.includes('permissions')) {
            logVK('ПРОБЛЕМА: Нет разрешений VK Storage!', 'error');
            logVK('Решение: Перейдите в vk.com/dev → Ваше приложение → Настройки → включите VK Storage', 'error');
        }
    });
}

// Отменить поиск
function cancelMatchmakingMinimal() {
    logVK('Отмена поиска игры');
    
    if (window.OnHideMatchmakingUI) {
        window.OnHideMatchmakingUI();
    }
}

// Получить состояние
function getMultiplayerStateMinimal() {
    return {
        isActive: false,
        isReady: window.vkMultiplayerMinimal.isReady,
        playerId: window.vkMultiplayerMinimal.playerId,
        playerName: window.vkMultiplayerMinimal.playerName,
        gamesCount: window.vkMultiplayerMinimal.gamesList.length
    };
}

// Отладочные функции
function debugVKMultiplayerMinimal() {
    logVK('=== ОТЛАДОЧНАЯ ИНФОРМАЦИЯ ===');
    logVK('VK Bridge доступен: ' + (typeof window.vkBridge !== 'undefined'));
    logVK('Мультиплеер готов: ' + window.vkMultiplayerMinimal.isReady);
    logVK('Игрок: ' + window.vkMultiplayerMinimal.playerName + ' (ID: ' + window.vkMultiplayerMinimal.playerId + ')');
    logVK('Игр в списке: ' + window.vkMultiplayerMinimal.gamesList.length);
    logVK('=== КОНЕЦ ОТЛАДОЧНОЙ ИНФОРМАЦИИ ===');
}

function testVKStorage() {
    logVK('=== ТЕСТ VK STORAGE ===');
    
    if (!window.vkBridge) {
        logVK('VK Bridge не найден!', 'error');
        return;
    }
    
    // Тест записи
    window.vkBridge.send('VKWebAppStorageSet', {
        key: 'test_key',
        value: 'test_value_' + Date.now()
    })
    .then(function(result) {
        logVK('Тест записи в VK Storage: УСПЕШНО', 'success');
        logVK('Результат: ' + JSON.stringify(result));
        
        // Тест чтения
        return window.vkBridge.send('VKWebAppStorageGet', { keys: ['test_key'] });
    })
    .then(function(data) {
        logVK('Тест чтения из VK Storage: УСПЕШНО', 'success');
        logVK('Данные: ' + JSON.stringify(data));
    })
    .catch(function(error) {
        logVK('Тест VK Storage: ОШИБКА', 'error');
        logVK('Ошибка: ' + error.message);
        
        if (error.message.includes('permissions')) {
            logVK('ПРОБЛЕМА: Нет разрешений VK Storage!', 'error');
            logVK('Решение: vk.com/dev → Приложение 51831798 → Настройки → включите VK Storage', 'error');
        }
    });
    
    logVK('=== КОНЕЦ ТЕСТА VK STORAGE ===');
}

// Экспорт функций
window.vkMultiplayerMinimal.startMatchmaking = startMatchmakingMinimal;
window.vkMultiplayerMinimal.cancelMatchmaking = cancelMatchmakingMinimal;
window.vkMultiplayerMinimal.getState = getMultiplayerStateMinimal;

// Глобальные функции для отладки
window.debugVKMultiplayer = debugVKMultiplayerMinimal;
window.testVKStorage = testVKStorage;

// Инициализация
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVKMultiplayer);
} else {
    initVKMultiplayer();
}

logVK('Минимальный VK мультиплеер загружен!', 'success');
logVK('Доступные команды: debugVKMultiplayer(), testVKStorage()'); 