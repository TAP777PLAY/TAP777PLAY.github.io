// Упрощенная версия VK мультиплеера без CSP проблем
// Минимальная реализация для тестирования

(function() {
    'use strict';
    
    // Глобальные переменные
    var vkMultiplayer = {
        isReady: false,
        isMultiplayer: false,
        gameId: null,
        playerId: null,
        playerName: '',
        opponentId: null,
        gamesList: [],
        bridge: null,
        debugMode: true
    };
    
    // Функция логирования
    function log(message, type) {
        var timestamp = new Date().toLocaleTimeString();
        var prefix = '[' + timestamp + '] VK-MP:';
        
        if (type === 'error') {
            console.error(prefix + ' ❌ ' + message);
        } else if (type === 'success') {
            console.log(prefix + ' ✅ ' + message);
        } else if (type === 'warn') {
            console.warn(prefix + ' ⚠️ ' + message);
        } else {
            console.log(prefix + ' ℹ️ ' + message);
        }
    }
    
    // Создание mock VK Bridge
    function createMockBridge() {
        log('Создаем заглушку VK Bridge');
        
        return {
            send: function(method, params) {
                return new Promise(function(resolve) {
                    log('Mock VK Bridge: ' + method + ' ' + JSON.stringify(params || {}));
                    
                    setTimeout(function() {
                        switch (method) {
                            case 'VKWebAppInit':
                                resolve({ result: true });
                                break;
                            
                            case 'VKWebAppGetUserInfo':
                                resolve({
                                    id: Math.floor(Math.random() * 1000000),
                                    first_name: 'Тестовый',
                                    last_name: 'Игрок',
                                    photo_100: ''
                                });
                                break;
                            
                            case 'VKWebAppStorageGet':
                                var key = params.keys[0];
                                var mockData = {
                                    'multiplayer_games': JSON.stringify([]),
                                    'player_stats': JSON.stringify({
                                        gamesPlayed: 0,
                                        wins: 0,
                                        losses: 0,
                                        rating: 1000
                                    })
                                };
                                resolve({
                                    keys: [{
                                        key: key,
                                        value: mockData[key] || ''
                                    }]
                                });
                                break;
                            
                            case 'VKWebAppStorageSet':
                                log('Mock Storage SET ' + params.key + ': ' + params.value);
                                resolve({ result: true });
                                break;
                            
                            default:
                                resolve({ result: true });
                        }
                    }, 100);
                });
            }
        };
    }
    
    // Инициализация
    function init() {
        log('Начинаем инициализацию VK мультиплеера...');
        
        try {
            // Проверяем VK Bridge
            if (typeof window.vkBridge !== 'undefined') {
                vkMultiplayer.bridge = window.vkBridge;
                log('VK Bridge найден', 'success');
            } else {
                log('VK Bridge не найден, используем заглушку', 'warn');
                vkMultiplayer.bridge = createMockBridge();
            }
            
            // Инициализируем VK
            vkMultiplayer.bridge.send('VKWebAppInit', { app_id: 51831798 })
                .then(function(result) {
                    log('VK инициализирован: ' + JSON.stringify(result));
                    return vkMultiplayer.bridge.send('VKWebAppGetUserInfo');
                })
                .then(function(userInfo) {
                    vkMultiplayer.playerId = userInfo.id;
                    vkMultiplayer.playerName = userInfo.first_name + ' ' + userInfo.last_name;
                    log('Пользователь: ' + vkMultiplayer.playerName + ' (ID: ' + vkMultiplayer.playerId + ')', 'success');
                    
                    vkMultiplayer.isReady = true;
                    log('VK мультиплеер готов к работе!', 'success');
                })
                .catch(function(error) {
                    log('Ошибка инициализации: ' + error.message, 'error');
                    vkMultiplayer.isReady = false;
                });
                
        } catch (error) {
            log('Критическая ошибка инициализации: ' + error.message, 'error');
            vkMultiplayer.isReady = false;
        }
    }
    
    // Начать поиск игры
    function startMatchmaking() {
        log('Начинаем поиск игры...');
        
        if (!vkMultiplayer.isReady) {
            log('VK не готов', 'error');
            return false;
        }
        
        // Показываем UI поиска
        if (window.OnShowMatchmakingUI) {
            window.OnShowMatchmakingUI();
        }
        
        // Получаем список игр
        vkMultiplayer.bridge.send('VKWebAppStorageGet', { keys: ['multiplayer_games'] })
            .then(function(data) {
                var gamesValue = data.keys[0].value || '[]';
                try {
                    vkMultiplayer.gamesList = JSON.parse(gamesValue);
                    log('Загружено игр: ' + vkMultiplayer.gamesList.length);
                    
                    // Ищем доступную игру
                    var availableGame = null;
                    for (var i = 0; i < vkMultiplayer.gamesList.length; i++) {
                        var game = vkMultiplayer.gamesList[i];
                        if (game.status === 'waiting' && 
                            game.host !== vkMultiplayer.playerId &&
                            Date.now() - game.createdAt < 300000) { // 5 минут
                            availableGame = game;
                            break;
                        }
                    }
                    
                    if (availableGame) {
                        log('Найдена доступная игра: ' + availableGame.id, 'success');
                        joinGame(availableGame.id);
                    } else {
                        log('Доступных игр не найдено, создаем новую');
                        createGame();
                    }
                    
                } catch (parseError) {
                    log('Ошибка парсинга списка игр: ' + parseError.message, 'error');
                    vkMultiplayer.gamesList = [];
                    createGame();
                }
            })
            .catch(function(error) {
                log('Ошибка получения списка игр: ' + error.message, 'error');
                createGame();
            });
        
        return true;
    }
    
    // Создать новую игру
    function createGame() {
        vkMultiplayer.gameId = 'game_' + Date.now() + '_' + vkMultiplayer.playerId;
        log('Создаем игру: ' + vkMultiplayer.gameId, 'success');
        
        var gameData = {
            id: vkMultiplayer.gameId,
            host: vkMultiplayer.playerId,
            hostName: vkMultiplayer.playerName,
            status: 'waiting',
            createdAt: Date.now(),
            gameType: 'rabbit_punch'
        };
        
        // Добавляем в список
        vkMultiplayer.gamesList.push(gameData);
        vkMultiplayer.isMultiplayer = true;
        
        // Сохраняем список игр
        vkMultiplayer.bridge.send('VKWebAppStorageSet', {
            key: 'multiplayer_games',
            value: JSON.stringify(vkMultiplayer.gamesList)
        })
        .then(function() {
            log('Игра создана и сохранена', 'success');
            waitForOpponent();
        })
        .catch(function(error) {
            log('Ошибка сохранения игры: ' + error.message, 'error');
        });
    }
    
    // Присоединиться к игре
    function joinGame(gameId) {
        log('Присоединяемся к игре: ' + gameId, 'success');
        
        vkMultiplayer.gameId = gameId;
        vkMultiplayer.isMultiplayer = true;
        
        // Находим игру в списке
        for (var i = 0; i < vkMultiplayer.gamesList.length; i++) {
            if (vkMultiplayer.gamesList[i].id === gameId) {
                vkMultiplayer.opponentId = vkMultiplayer.gamesList[i].host;
                vkMultiplayer.gamesList[i].status = 'playing';
                break;
            }
        }
        
        // Сохраняем обновленный список
        vkMultiplayer.bridge.send('VKWebAppStorageSet', {
            key: 'multiplayer_games',
            value: JSON.stringify(vkMultiplayer.gamesList)
        })
        .then(function() {
            log('Присоединились к игре!', 'success');
            
            // Скрываем UI поиска
            if (window.OnHideMatchmakingUI) {
                window.OnHideMatchmakingUI();
            }
            
            // Показываем игру
            if (window.OnMultiplayerGameStart) {
                window.OnMultiplayerGameStart(vkMultiplayer.opponentId, vkMultiplayer.gameId);
            }
        })
        .catch(function(error) {
            log('Ошибка присоединения к игре: ' + error.message, 'error');
        });
    }
    
    // Ждать противника
    function waitForOpponent() {
        log('Ждем противника...');
        
        var checkCount = 0;
        var maxChecks = 30; // 60 секунд
        
        var checkInterval = setInterval(function() {
            checkCount++;
            log('Проверка противника #' + checkCount);
            
            // Получаем обновленный список игр
            vkMultiplayer.bridge.send('VKWebAppStorageGet', { keys: ['multiplayer_games'] })
                .then(function(data) {
                    var gamesValue = data.keys[0].value || '[]';
                    var gamesList = JSON.parse(gamesValue);
                    
                    // Ищем нашу игру
                    for (var i = 0; i < gamesList.length; i++) {
                        var game = gamesList[i];
                        if (game.id === vkMultiplayer.gameId && game.status === 'playing') {
                            clearInterval(checkInterval);
                            
                            log('Противник найден!', 'success');
                            vkMultiplayer.opponentId = 'opponent_' + Date.now();
                            
                            // Скрываем UI поиска
                            if (window.OnHideMatchmakingUI) {
                                window.OnHideMatchmakingUI();
                            }
                            
                            // Показываем игру
                            if (window.OnMultiplayerGameStart) {
                                window.OnMultiplayerGameStart(vkMultiplayer.opponentId, vkMultiplayer.gameId);
                            }
                            
                            return;
                        }
                    }
                    
                    // Если время истекло
                    if (checkCount >= maxChecks) {
                        clearInterval(checkInterval);
                        log('Время поиска истекло', 'warn');
                        cancelMatchmaking();
                    }
                })
                .catch(function(error) {
                    log('Ошибка проверки противника: ' + error.message, 'error');
                });
        }, 2000);
    }
    
    // Отменить поиск
    function cancelMatchmaking() {
        log('Отмена поиска игры');
        
        if (vkMultiplayer.gameId) {
            // Удаляем игру из списка
            vkMultiplayer.gamesList = vkMultiplayer.gamesList.filter(function(game) {
                return game.id !== vkMultiplayer.gameId;
            });
            
            vkMultiplayer.bridge.send('VKWebAppStorageSet', {
                key: 'multiplayer_games',
                value: JSON.stringify(vkMultiplayer.gamesList)
            });
        }
        
        resetGame();
        
        if (window.OnHideMatchmakingUI) {
            window.OnHideMatchmakingUI();
        }
    }
    
    // Сбросить игру
    function resetGame() {
        vkMultiplayer.isMultiplayer = false;
        vkMultiplayer.gameId = null;
        vkMultiplayer.opponentId = null;
    }
    
    // Получить состояние мультиплеера
    function getMultiplayerState() {
        return {
            isActive: vkMultiplayer.isMultiplayer,
            gameId: vkMultiplayer.gameId,
            opponentId: vkMultiplayer.opponentId,
            isReady: vkMultiplayer.isReady,
            playerId: vkMultiplayer.playerId,
            playerName: vkMultiplayer.playerName
        };
    }
    
    // Отладочные функции
    function debugInfo() {
        log('=== ОТЛАДОЧНАЯ ИНФОРМАЦИЯ ===');
        log('Игрок: ' + vkMultiplayer.playerName + ' (ID: ' + vkMultiplayer.playerId + ')');
        log('VK готов: ' + vkMultiplayer.isReady);
        log('Мультиплеер активен: ' + vkMultiplayer.isMultiplayer);
        log('ID игры: ' + vkMultiplayer.gameId);
        log('ID противника: ' + vkMultiplayer.opponentId);
        log('Активных игр: ' + vkMultiplayer.gamesList.length);
        log('=== КОНЕЦ ОТЛАДОЧНОЙ ИНФОРМАЦИИ ===');
    }
    
    function debugGamesList() {
        log('=== СПИСОК ИГР ===');
        for (var i = 0; i < vkMultiplayer.gamesList.length; i++) {
            var game = vkMultiplayer.gamesList[i];
            log((i + 1) + '. ' + game.id + ' - ' + game.status + ' (' + game.hostName + ')');
        }
        log('=== КОНЕЦ СПИСКА ИГР ===');
    }
    
    function debugStorage() {
        log('=== ОТЛАДКА ХРАНИЛИЩА ===');
        vkMultiplayer.bridge.send('VKWebAppStorageGet', { 
            keys: ['multiplayer_games', 'player_stats'] 
        })
        .then(function(data) {
            for (var i = 0; i < data.keys.length; i++) {
                var item = data.keys[i];
                log(item.key + ': ' + item.value);
            }
        })
        .catch(function(error) {
            log('Ошибка чтения хранилища: ' + error.message, 'error');
        });
        log('=== КОНЕЦ ОТЛАДКИ ХРАНИЛИЩА ===');
    }
    
    // Экспорт в глобальную область
    window.vkMultiplayerSimple = {
        startMatchmaking: startMatchmaking,
        cancelMatchmaking: cancelMatchmaking,
        getMultiplayerState: getMultiplayerState,
        debugInfo: debugInfo,
        debugGamesList: debugGamesList,
        debugStorage: debugStorage
    };
    
    // Глобальные функции для отладки
    window.debugVKMultiplayer = debugInfo;
    window.debugVKGamesList = debugGamesList;
    window.debugVKStorage = debugStorage;
    
    // Инициализация при загрузке
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    log('Упрощенный VK мультиплеер загружен!', 'success');
    
})(); 