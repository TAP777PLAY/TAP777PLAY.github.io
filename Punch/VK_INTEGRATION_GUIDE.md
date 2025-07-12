# 🔗 Интеграция мультиплеера с VK Bridge

## 📋 Обзор

Мультиплеер теперь использует **официальную библиотеку VK Bridge** для:
- ✅ Авторизации пользователей ВКонтакте
- ✅ Хранения данных игры
- ✅ Приглашения друзей
- ✅ Публикации результатов

## 🚀 Быстрый старт

### 1. Подключение VK Bridge

Добавьте в `index.html` перед другими скриптами:

```html
<!-- VK Bridge -->
<script src="https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js"></script>

<!-- Наш мультиплеер -->
<script src="scripts/vk-multiplayer.js"></script>
```

### 2. Инициализация

VK мультиплеер инициализируется автоматически при загрузке страницы:

```javascript
// Автоматически создается window.vkMultiplayer
// Доступны глобальные функции для Construct 3
```

### 3. Интеграция с игрой

В Construct 3 добавьте события:

```javascript
// Кнопка мультиплеера
On touched object: multiplayerButton
-> Browser: Execute JavaScript: "StartMultiplayerMatchmaking()"

// Отправка ходов
On collision: theRabbit with target
-> Browser: Execute JavaScript: 
   "SendMultiplayerMove('punch', theRabbit.X, theRabbit.Y, score, combo)"
```

## 🎮 API функции

### Основные функции:

```javascript
// Начать поиск игры
StartMultiplayerMatchmaking()

// Отправить ход
SendMultiplayerMove(moveType, x, y, score, combo)

// Завершить игру
EndMultiplayerGame()

// Отменить поиск
CancelMultiplayerMatchmaking()

// Получить состояние
GetMultiplayerState()

// Проверить активность
IsMultiplayerActive()
```

### События обратного вызова:

```javascript
// Показать UI поиска
window.OnShowMatchmakingUI = function() {
    // Показать экран "Поиск игры..."
};

// Скрыть UI поиска
window.OnHideMatchmakingUI = function() {
    // Скрыть экран поиска
};

// Игра началась
window.OnMultiplayerGameStart = function(opponentId, gameId) {
    // Показать игровой экран
    // opponentId - ID противника
    // gameId - ID игры
};

// Ход противника
window.OnOpponentMove = function(moveType, x, y, score, combo) {
    // Обработать ход противника
};

// Игра завершена
window.OnMultiplayerGameEnd = function(result, myScore, opponentScore) {
    // result: 'win', 'lose', 'draw'
    // Показать результаты
};
```

## 🔧 Настройка VK приложения

### 1. Создание VK Mini App

1. Перейдите в **VK для разработчиков**: https://vk.com/dev
2. Создайте новое **Mini App**
3. Настройте параметры:
   - **Название**: "Кролик Панч"
   - **Тип**: HTML5 игра
   - **URL**: адрес вашей игры

### 2. Настройки безопасности

```javascript
// Разрешенные домены
Trusted domains: your-game-domain.com

// Разрешенные методы VK Bridge
VKWebAppInit
VKWebAppGetUserInfo
VKWebAppStorageGet
VKWebAppStorageSet
VKWebAppShowWallPostBox
VKWebAppGetFriends
```

### 3. Права доступа

Запросите следующие разрешения:
- **Базовая информация** - для получения имени и фото
- **Друзья** - для приглашений
- **Публикации** - для постов о победах

## 📊 Структура данных

### VK Storage ключи:

```javascript
// Список активных игр
"multiplayer_games": [
    {
        "id": "game_1234567890_12345",
        "host": 12345,
        "hostName": "Игрок1",
        "status": "waiting",
        "createdAt": 1234567890
    }
]

// Статистика игрока
"player_stats": {
    "gamesPlayed": 25,
    "wins": 15,
    "losses": 10,
    "rating": 1250
}

// Данные конкретной игры
"game_[gameId]": {
    "id": "game_1234567890_12345",
    "status": "playing",
    "players": {
        "12345": {
            "id": 12345,
            "name": "Игрок1",
            "photo": "https://...",
            "score": 150,
            "ready": true
        }
    },
    "moves": [
        {
            "playerId": 12345,
            "type": "punch",
            "x": 50,
            "y": 60,
            "score": 30,
            "timestamp": 1234567891
        }
    ],
    "createdAt": 1234567890,
    "endTime": null
}
```

## 🎯 Интеграция с Construct 3

### Event Sheet: menuEvent

```javascript
// Добавить кнопку мультиплеера
On start of layout
-> System: Create object multiplayerButton on layer "UI"

// Обработка нажатия
On touched object: multiplayerButton
-> Browser: Execute JavaScript: "StartMultiplayerMatchmaking()"
```

### Event Sheet: gameEvent

```javascript
// Отправка ходов
On collision: theRabbit with redbox
-> Browser: Execute JavaScript: 
   "SendMultiplayerMove('punch', theRabbit.X, theRabbit.Y, score, combo)"

// Проверка мультиплеера
System: Every 1 second
-> Browser: Execute JavaScript: 
   "if (IsMultiplayerActive()) { /* обновить UI */ }"
```

### Создание UI элементов

Добавьте в Construct 3:

```javascript
// Объекты для мультиплеера
multiplayerButton - кнопка "Играть с другом"
matchmakingUI - экран поиска игры
opponentInfo - информация о противнике
gameResults - результаты игры
```

## 🧪 Тестирование

### 1. Локальное тестирование

Откройте `vk-multiplayer-demo.html` для тестирования:
- Эмуляция VK Bridge
- Полный workflow мультиплеера
- Логи всех событий

### 2. Тестирование в VK

1. Загрузите игру на сервер
2. Создайте VK Mini App
3. Протестируйте через VK

### 3. Отладка

```javascript
// Проверка VK Bridge
console.log('VK Bridge:', window.vkBridge);

// Проверка мультиплеера
console.log('Мультиплеер:', window.vkMultiplayer);

// Состояние игры
console.log('Состояние:', GetMultiplayerState());
```

## 🔍 Решение проблем

### Проблема: VK Bridge не найден
```javascript
// Проверьте подключение библиотеки
if (typeof vkBridge === 'undefined') {
    console.error('VK Bridge не подключен');
}
```

### Проблема: Ошибки авторизации
```javascript
// Проверьте настройки VK приложения
// Убедитесь, что домен в списке разрешенных
```

### Проблема: Не сохраняются данные
```javascript
// Проверьте права доступа к Storage
vkBridge.send('VKWebAppStorageGet', {keys: ['test']})
    .then(result => console.log('Storage работает'))
    .catch(error => console.error('Storage ошибка:', error));
```

## 🎉 Преимущества VK Bridge

✅ **Официальная поддержка** - стабильная работа в VK  
✅ **Простая интеграция** - минимум кода  
✅ **Социальные функции** - друзья, посты, приглашения  
✅ **Надежное хранилище** - данные сохраняются в VK  
✅ **Быстрая авторизация** - без дополнительных форм  

## 📞 Поддержка

- **VK для разработчиков**: https://vk.com/dev
- **Документация VK Bridge**: https://vk.com/dev/bridge
- **Демо-страница**: `vk-multiplayer-demo.html`

---

**🎯 Готово! Мультиплеер полностью интегрирован с VK Bridge!** 