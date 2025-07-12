# 🎮 Интеграция кнопки мультиплеера с Construct 3

## ✅ Готовая кнопка мультиплеера

Кнопка мультиплеера уже добавлена в `index.html`:
- 🎮 Круглая кнопка с иконкой геймпада
- 📍 Расположена в правом нижнем углу
- ✨ Пульсирующая анимация для привлечения внимания
- 🔄 Автоматически скрывается во время мультиплеера

## 🎯 Как это работает

### Автоматическое поведение:
1. **По умолчанию**: Кнопка видна и пульсирует
2. **При поиске игры**: Кнопка скрывается
3. **Во время игры**: Кнопка скрыта
4. **После игры**: Кнопка появляется снова

### Функции управления:
```javascript
// Показать кнопку мультиплеера
ShowMultiplayerButton()

// Скрыть кнопку мультиплеера  
HideMultiplayerButton()

// Обновить состояние кнопки (вызывается автоматически)
UpdateMultiplayerButtonState()
```

## 🔧 Дополнительная настройка в Construct 3

### Опциональные улучшения:

#### 1. Скрытие кнопки в меню
Если вы хотите показывать кнопку только в игре:

```javascript
// В Event Sheet: menuEvent
// Событие: System -> On start of layout
// Действие: Browser -> Execute JavaScript: "HideMultiplayerButton()"
```

#### 2. Показ кнопки в игре
```javascript
// В Event Sheet: gameEvent  
// Событие: System -> On start of layout
// Действие: Browser -> Execute JavaScript: "ShowMultiplayerButton()"
```

#### 3. Интеграция с игровой логикой
```javascript
// При ударе кролика (уже настроено автоматически)
// В событие: theRabbit -> On collision with redbox/bluebox
// Добавить: Browser -> Execute JavaScript:
if (IsMultiplayerActive()) {
    SendMultiplayerMove('punch', theRabbit.X, theRabbit.Y, score, combo);
}
```

## 🎨 Настройка внешнего вида

### CSS стили кнопки (в index.html):
```css
.vk-multiplayer-menu-button {
    position: fixed;
    bottom: 20px;        /* Отступ снизу */
    right: 20px;         /* Отступ справа */
    width: 60px;         /* Размер кнопки */
    height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;  /* Круглая форма */
    font-size: 24px;     /* Размер эмодзи */
}
```

### Изменение позиции:
```css
/* Левый нижний угол */
.vk-multiplayer-menu-button {
    bottom: 20px;
    left: 20px;
    right: auto;
}

/* Верхний правый угол */
.vk-multiplayer-menu-button {
    top: 20px;
    right: 20px;
    bottom: auto;
}
```

### Изменение иконки:
```html
<!-- В index.html найти кнопку и заменить эмодзи -->
<button id="vkMultiplayerMenuButton" class="vk-multiplayer-menu-button pulse">
    🥊  <!-- Для игры про бокс -->
    👥  <!-- Для мультиплеера -->
    ⚔️  <!-- Для сражений -->
</button>
```

## 🚀 Тестирование

### 1. Локальное тестирование
```bash
# Откройте файл в браузере
index.html

# Проверьте:
✅ Кнопка видна в правом нижнем углу
✅ Кнопка пульсирует
✅ При клике открывается поиск игры
✅ Во время поиска кнопка скрыта
```

### 2. Тестирование в VK
```bash
# Загрузите на GitHub Pages
git add .
git commit -m "Добавлена кнопка мультиплеера"
git push origin main

# Откройте в VK
https://vk.com/app51831798
```

## 🔍 Отладка

### Проверка в консоли браузера:
```javascript
// Проверить состояние мультиплеера
console.log(GetMultiplayerState());

// Проверить видимость кнопки
console.log(document.getElementById('vkMultiplayerMenuButton').classList);

// Принудительно показать кнопку
ShowMultiplayerButton();

// Принудительно скрыть кнопку
HideMultiplayerButton();
```

### Частые проблемы:

**Кнопка не видна:**
- Проверьте z-index в CSS
- Убедитесь, что нет class="hidden"

**Кнопка не работает:**
- Проверьте консоль на ошибки JavaScript
- Убедитесь, что vk-multiplayer.js загружен

**Кнопка не скрывается:**
- Проверьте работу UpdateMultiplayerButtonState()
- Убедитесь, что события мультиплеера вызываются

## 🎉 Готово!

Ваша игра теперь имеет красивую кнопку мультиплеера, которая:
- ✅ Автоматически управляется
- ✅ Интегрирована с VK Bridge
- ✅ Готова к использованию
- ✅ Работает на всех устройствах

Просто загрузите файлы и игроки смогут играть друг с другом! 