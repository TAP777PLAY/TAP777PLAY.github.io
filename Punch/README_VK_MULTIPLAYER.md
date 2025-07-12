# 🐰 VK Мультиплеер для игры "Кролик Панч"

## 📋 Описание

Полная интеграция мультиплеера через VK Bridge для HTML5 игры "Кролик Панч" на Construct 3. Позволяет игрокам ВКонтакте играть друг с другом в реальном времени.

## ✨ Возможности

- 🎮 **Матчмейкинг** - автоматический поиск противника
- 🥊 **Синхронизация ходов** - передача ударов и комбо в реальном времени
- 📊 **Система рейтинга** - отслеживание побед, поражений и рейтинга
- 👥 **Приглашение друзей** - через посты на стену ВКонтакте
- 🏆 **Публикация результатов** - автоматический пост при победе
- 💾 **Облачное хранилище** - сохранение прогресса в VK Storage

## 🚀 Установка

### 1. Подготовка файлов

Все необходимые файлы уже добавлены в проект:

```
Кролик Панч/
├── index.html                    # ✅ Обновлен с VK интеграцией
├── scripts/
│   └── vk-multiplayer.js        # ✅ Основной файл мультиплеера
├── CONSTRUCT3_INTEGRATION.md    # ✅ Инструкции для Construct 3
├── VK_INTEGRATION_GUIDE.md      # ✅ Техническая документация
└── vk-multiplayer-demo.html     # ✅ Демо для тестирования
```

### 2. Настройка VK Mini App

1. **Создайте приложение:**
   - Перейдите на [vk.com/dev](https://vk.com/dev)
   - Создайте новое приложение типа "Mini App"
   - Укажите название "Кролик Панч"

2. **Настройте домены:**
   ```
   Доверенные домены:
   - ваш-домен.com
   - localhost (для тестирования)
   ```

3. **Включите разрешения:**
   - ✅ Доступ к профилю пользователя
   - ✅ Хранилище данных (VK Storage)
   - ✅ Публикация на стену
   - ✅ Список друзей (опционально)

### 3. Загрузка на хостинг

Загрузите все файлы проекта на ваш веб-хостинг. Убедитесь, что:
- ✅ Поддерживается HTTPS
- ✅ Все файлы доступны по прямым ссылкам
- ✅ Настроены правильные MIME-типы для .webp, .m4a, .ogg

## 🎮 Интеграция с Construct 3

### Шаг 1: Добавление кнопки мультиплеера

В **Event Sheet: menuEvent**:

```javascript
// Событие: System -> On start of layout
// Действие: System -> Create object
// Объект: buttons, Layer: Layer 0, X: 80, Y: 130
// Установить frame = 2 (кнопка мультиплеера)
```

```javascript
// Событие: Touch -> On touched object: buttons
// Условие: buttons -> Compare frame = 2
// Действия:
// 1. Audio -> Play: "pop"
// 2. Browser -> Execute JavaScript: "StartMultiplayerMatchmaking()"
```

### Шаг 2: Интеграция с игровой логикой

В **Event Sheet: gameEvent**, найдите события ударов кролика и добавьте:

```javascript
// В событие: theRabbit -> On collision with redbox/bluebox
// После существующих действий добавить:
Browser -> Execute JavaScript:
```
```javascript
if (IsMultiplayerActive()) {
    SendMultiplayerMove('punch', theRabbit.X, theRabbit.Y, score, combo);
    UpdateMyMultiplayerScore(score);
}
```

### Шаг 3: Обработка комбо

```javascript
// В событие обработки комбо (где combo > 1)
Browser -> Execute JavaScript:
```
```javascript
if (IsMultiplayerActive()) {
    SendMultiplayerMove('combo', theRabbit.X, theRabbit.Y, score, combo);
    UpdateMyMultiplayerScore(score);
}
```

### Шаг 4: Завершение игры

```javascript
// В событие окончания времени/игры
// Условие: Browser -> Execute JavaScript (expression): "IsMultiplayerActive()"
// Действие: Browser -> Execute JavaScript: "EndMultiplayerGame()"
```

## 🔧 API Функции

### Основные функции:

```javascript
// Начать поиск игры
StartMultiplayerMatchmaking()

// Отправить ход игрока
SendMultiplayerMove(moveType, x, y, score, combo)
// moveType: 'punch', 'combo', 'special'

// Завершить игру
EndMultiplayerGame()

// Отменить поиск
CancelMultiplayerMatchmaking()

// Получить состояние игры
GetMultiplayerState()
// Возвращает: { isActive, gameId, myScore, opponentScore, ... }

// Проверить активность мультиплеера
IsMultiplayerActive()

// Обновить свой счет в UI
UpdateMyMultiplayerScore(score)
```

### События обратного вызова:

```javascript
// Показ UI поиска игры
window.OnShowMatchmakingUI = function() {
    // Показать "Поиск противника..."
}

// Скрытие UI поиска
window.OnHideMatchmakingUI = function() {
    // Скрыть UI поиска
}

// Начало игры
window.OnMultiplayerGameStart = function(opponentId, gameId) {
    // Игра началась, показать UI мультиплеера
}

// Ход противника
window.OnOpponentMove = function(moveType, x, y, score, combo) {
    // Показать эффект хода противника
}

// Окончание игры
window.OnMultiplayerGameEnd = function(result, myScore, opponentScore) {
    // result: 'win', 'lose', 'draw'
    // Показать результат игры
}
```

## 🎨 UI Элементы

Мультиплеер автоматически добавляет в игру:

### 1. UI поиска игры
- Модальное окно с анимацией загрузки
- Кнопка отмены поиска
- Статус поиска

### 2. Игровая информация
- Счет игрока и противника
- Статус игры
- Время игры

### 3. Результаты игры
- Окно с результатом (победа/поражение/ничья)
- Финальные счета
- Кнопка закрытия

## 🧪 Тестирование

### Локальное тестирование:

1. Откройте `vk-multiplayer-demo.html` в браузере
2. Протестируйте все функции:
   - ✅ Поиск игры
   - ✅ Отправка ходов
   - ✅ Завершение игры
   - ✅ Отмена поиска

### Тестирование в VK:

1. Загрузите игру на хостинг
2. Добавьте URL в настройки VK Mini App
3. Откройте игру через VK
4. Протестируйте с друзьями

## 📊 Система рейтинга

- **Победа:** +25 рейтинга
- **Поражение:** -15 рейтинга  
- **Ничья:** +5 рейтинга
- **Начальный рейтинг:** 1000

Статистика сохраняется в VK Storage:
- Количество игр
- Победы/поражения
- Текущий рейтинг
- Процент побед

## 🔄 Синхронизация данных

### Структура данных игры:

```javascript
{
    "id": "game_1234567890_12345",
    "status": "playing", // waiting, playing, finished
    "gameType": "rabbit_punch",
    "players": {
        "12345": {
            "name": "Игрок 1",
            "score": 150,
            "combo": 3,
            "maxCombo": 5,
            "punches": 25
        }
    },
    "moves": [
        {
            "playerId": 12345,
            "type": "punch",
            "x": 50, "y": 60,
            "score": 30,
            "combo": 1,
            "timestamp": 1234567890
        }
    ]
}
```

### Обновление в реальном времени:

- Проверка новых ходов каждую секунду
- Автоматическое завершение при неактивности (2 минуты)
- Очистка старых игр (10 минут)

## 🛠️ Устранение неполадок

### Частые проблемы:

**1. VK Bridge не найден**
```javascript
// Решение: Проверьте подключение скрипта VK Bridge
<script src="https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js"></script>
```

**2. Функции мультиплеера недоступны**
```javascript
// Решение: Дождитесь инициализации
setTimeout(() => {
    if (window.vkMultiplayer && window.vkMultiplayer.isVKReady) {
        // Мультиплеер готов
    }
}, 1000);
```

**3. Ошибки сохранения данных**
- Проверьте разрешения VK Storage в настройках приложения
- Убедитесь, что размер данных не превышает лимиты VK

### Логирование:

Все события мультиплеера логируются в консоль:
- 🎮 Общие события
- 📤 Отправка ходов  
- 👊 Ходы противника
- 🏁 Завершение игр
- ❌ Ошибки

## 📈 Дальнейшие улучшения

### Возможные дополнения:

1. **Турнирный режим** - соревнования на несколько раундов
2. **Зрители** - возможность наблюдать за играми друзей
3. **Чат** - обмен сообщениями во время игры
4. **Реплеи** - сохранение и просмотр записей игр
5. **Достижения** - система наград за различные результаты

### Оптимизация:

1. **Кэширование** - локальное сохранение часто используемых данных
2. **Сжатие** - минификация передаваемых данных
3. **Батчинг** - группировка множественных ходов
4. **Предсказание** - локальная симуляция ходов противника

## 🔗 Полезные ссылки

- [VK Bridge документация](https://dev.vk.com/bridge/overview)
- [VK Mini Apps](https://dev.vk.com/mini-apps/overview)  
- [VK Storage API](https://dev.vk.com/bridge/VKWebAppStorageGet)
- [Construct 3 JavaScript](https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference)

## 📝 Лицензия

Этот код предоставляется "как есть" для использования в проекте "Кролик Панч". Свободно модифицируйте под свои нужды.

---

**🎉 Готово!** Ваша игра теперь поддерживает мультиплеер через ВКонтакте! 