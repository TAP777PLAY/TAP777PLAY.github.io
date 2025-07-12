# 🎮 Интеграция VK Мультиплеера с Construct 3

## 📋 Обзор интеграции

Этот документ содержит точные инструкции по добавлению VK мультиплеера в игру "Кролик Панч" через события Construct 3.

## 🎯 Необходимые изменения в Event Sheets

### 1. Event Sheet: `menuEvent` (Главное меню)

#### Добавить кнопку мультиплеера:

```javascript
// Событие: On start of layout
// Действие: System -> Create object
// Объект: buttons (кнопка)
// Layer: Layer 0
// X: 80, Y: 120
// После создания установить анимацию на frame 2 (если есть специальная кнопка для мультиплеера)
```

#### Обработка нажатия кнопки мультиплеера:

```javascript
// Событие: Touch -> On touched object: buttons
// Условие: buttons -> Compare frame = 2 (если это кнопка мультиплеера)
// Действия:
// 1. Audio -> Play (by name): "pop" (звук нажатия)
// 2. Browser -> Execute JavaScript: "StartMultiplayerMatchmaking()"
```

### 2. Event Sheet: `gameEvent` (Основная игра)

#### Инициализация мультиплеера при старте игры:

```javascript
// Событие: System -> On start of layout
// Действие: Browser -> Execute JavaScript: 
"
// Проверяем, активен ли мультиплеер
if (IsMultiplayerActive()) {
    // Показываем индикатор мультиплеера
    console.log('Мультиплеер активен');
}
"
```

#### Отправка ходов при ударе кролика:

Найдите существующие события для ударов (когда кролик попадает по цели) и добавьте:

```javascript
// В событие: theRabbit -> On collision with redbox/bluebox
// После существующих действий добавить:
// Browser -> Execute JavaScript:
"
if (IsMultiplayerActive()) {
    SendMultiplayerMove('punch', theRabbit.X, theRabbit.Y, score, combo);
    UpdateMyMultiplayerScore(score);
}
"
```

#### Отправка комбо ударов:

```javascript
// В событие обработки комбо (когда combo > 1)
// Browser -> Execute JavaScript:
"
if (IsMultiplayerActive()) {
    SendMultiplayerMove('combo', theRabbit.X, theRabbit.Y, score, combo);
    UpdateMyMultiplayerScore(score);
}
"
```

#### Завершение игры в мультиплеере:

```javascript
// В событие окончания времени или игры
// Добавить условие: Browser -> Execute JavaScript (expression): "IsMultiplayerActive()"
// Действие: Browser -> Execute JavaScript: "EndMultiplayerGame()"
```

#### Обновление счета в мультиплеере:

```javascript
// В любое событие, где обновляется переменная score
// Добавить действие: Browser -> Execute JavaScript:
"
if (IsMultiplayerActive()) {
    UpdateMyMultiplayerScore(score);
}
"
```

### 3. Добавление переменных для мультиплеера

Создайте глобальные переменные:

- `isMultiplayer` (Boolean) - активен ли мультиплеер
- `opponentScore` (Number) - счет противника
- `multiplayerGameId` (Text) - ID текущей игры

### 4. Создание UI элементов для мультиплеера

#### Кнопка мультиплеера в меню:

1. Откройте layout `menu`
2. Добавьте новый объект `Sprite` или используйте существующий `buttons`
3. Создайте новый frame с текстом "Играть с другом" или символом 🎮
4. Разместите кнопку рядом с другими кнопками меню

#### Индикатор мультиплеера в игре:

1. Откройте layout `game`
2. На слое `UI` добавьте `Spritefont2` объекты:
   - `multiplayerStatus` - статус игры ("Мультиплеер", "Ожидание хода")
   - `opponentScoreText` - "Противник: 0"

### 5. Обработка событий противника

Добавьте в `gameEvent`:

```javascript
// Событие: System -> Every 1 second
// Условие: Browser -> Execute JavaScript (expression): "IsMultiplayerActive()"
// Действие: Browser -> Execute JavaScript:
"
// Проверяем состояние игры
const state = GetMultiplayerState();
if (state.isActive) {
    // Обновляем UI
    if (state.opponentScore !== undefined) {
        // Здесь можно обновить отображение счета противника
        console.log('Счет противника:', state.opponentScore);
    }
}
"
```

### 6. Специальные эффекты для мультиплеера

#### Показ хода противника:

```javascript
// В глобальную функцию OnOpponentMove добавить:
// (это уже есть в index.html, но можно дополнить через Construct 3)

// Событие: Browser -> On script finished: "onOpponentMove"
// Действия:
// 1. Создать визуальный эффект в позиции хода противника
// 2. Воспроизвести звук удара
// 3. Показать "+X очков" для противника
```

## 🔧 Технические детали

### Доступные JavaScript функции:

- `StartMultiplayerMatchmaking()` - начать поиск игры
- `SendMultiplayerMove(type, x, y, score, combo)` - отправить ход
- `EndMultiplayerGame()` - завершить игру
- `IsMultiplayerActive()` - проверить активность мультиплеера
- `GetMultiplayerState()` - получить состояние игры
- `UpdateMyMultiplayerScore(score)` - обновить свой счет

### События обратного вызова:

- `OnShowMatchmakingUI()` - показ поиска игры
- `OnHideMatchmakingUI()` - скрытие поиска игры
- `OnMultiplayerGameStart(opponentId, gameId)` - начало игры
- `OnOpponentMove(type, x, y, score, combo)` - ход противника
- `OnMultiplayerGameEnd(result, myScore, opponentScore)` - окончание игры

## 🎨 Рекомендуемые улучшения UI

### 1. Анимации для мультиплеера:

- Добавить мигающий индикатор "В сети" 
- Анимация поиска противника (вращающийся спиннер)
- Эффект появления ходов противника

### 2. Звуковые эффекты:

- Звук подключения к игре
- Звук хода противника (отличный от своего)
- Звук победы/поражения в мультиплеере

### 3. Дополнительная информация:

- Отображение имени противника (если доступно)
- Счетчик времени до следующего хода
- История последних ходов

## 🚀 Тестирование

### Локальное тестирование:

1. Откройте `vk-multiplayer-demo.html` в браузере
2. Протестируйте все функции мультиплеера
3. Проверьте консоль на ошибки

### Тестирование в VK:

1. Загрузите игру на хостинг
2. Создайте VK Mini App
3. Настройте домены и разрешения
4. Протестируйте с реальными пользователями VK

## 📝 Чеклист интеграции

- [ ] Добавлена кнопка мультиплеера в меню
- [ ] Настроены события для отправки ходов
- [ ] Добавлено завершение мультиплеер игры
- [ ] Создан UI для отображения информации о противнике
- [ ] Протестированы все функции локально
- [ ] Настроена VK Mini App
- [ ] Проведено тестирование с реальными пользователями

## 🔗 Дополнительные ресурсы

- [VK Bridge документация](https://dev.vk.com/bridge/overview)
- [VK Mini Apps](https://dev.vk.com/mini-apps/overview)
- [Construct 3 JavaScript](https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference) 