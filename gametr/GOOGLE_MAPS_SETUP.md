# Google Maps API Setup Instructions

## 🗺️ Настройка Google Maps для страницы контактов

### 1. Получение API ключа

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите следующие API:
   - **Maps JavaScript API**
   - **Directions API**
   - **Geocoding API**
4. Перейдите в "Credentials" → "Create Credentials" → "API Key"
5. Скопируйте полученный API ключ

### 2. Настройка ограничений (рекомендуется)

1. В настройках API ключа добавьте ограничения:
   - **HTTP referrers**: `http://localhost/*`, `https://yourdomain.com/*`
   - **IP addresses**: IP адреса ваших серверов

### 3. Замена API ключа в коде

В файле `contacts.html` найдите строку:
```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
```

Замените `YOUR_API_KEY` на ваш реальный API ключ:
```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&callback=initMap"></script>
```

### 4. Функции карты

После настройки карта будет поддерживать:

- ✅ **Интерактивная карта** с темной темой
- ✅ **Кастомный маркер** с логотипом игры
- ✅ **Информационное окно** с деталями студии
- ✅ **Построение маршрутов** от текущего местоположения
- ✅ **Поделиться местоположением** через Web Share API
- ✅ **Fallback карта** если Google Maps недоступна
- ✅ **Адаптивный дизайн** для мобильных устройств

### 5. Координаты студии

```javascript
const STUDIO_COORDINATES = {
    lat: 41.0351,  // Широта
    lng: 28.9853   // Долгота
};
```

**Адрес**: İstiklal Cd. No:45, Beyoğlu, İstanbul, Türkiye

### 6. Тестирование

1. Откройте `contacts.html` в браузере
2. Прокрутите до секции "Konum ve Ulaşım"
3. Проверьте загрузку карты
4. Протестируйте кнопки "Yol Tarifi Al" и "Konumu Paylaş"

### 7. Возможные проблемы

- **Карта не загружается**: Проверьте API ключ и ограничения
- **Ошибка CORS**: Добавьте домен в HTTP referrers
- **Квоты превышены**: Проверьте использование API в Google Cloud Console

### 8. Альтернатива

Если Google Maps API недоступна, автоматически активируется fallback карта с:
- Информацией о студии
- Ссылкой на Google Maps
- Красивым дизайном в стиле сайта
