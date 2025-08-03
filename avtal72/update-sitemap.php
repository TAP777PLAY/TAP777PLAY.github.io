<?php
/**
 * Автоматическое обновление домена в sitemap.xml
 * Запустите этот скрипт один раз после размещения сайта на новом домене
 */

// Определяем текущий домен
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
$currentDomain = $protocol . $_SERVER['HTTP_HOST'];

// Путь к файлу sitemap.xml
$sitemapFile = 'sitemap.xml';

// Проверяем, существует ли файл
if (!file_exists($sitemapFile)) {
    die("❌ Файл sitemap.xml не найден!");
}

// Читаем содержимое файла
$sitemapContent = file_get_contents($sitemapFile);

if ($sitemapContent === false) {
    die("❌ Не удалось прочитать файл sitemap.xml!");
}

// Заменяем все вхождения example.com на текущий домен
$updatedContent = str_replace('https://example.com', $currentDomain, $sitemapContent);

// Также заменяем http://example.com на случай, если там был http
$updatedContent = str_replace('http://example.com', $currentDomain, $updatedContent);

// Обновляем дату последнего изменения на текущую
$currentDate = date('c'); // ISO 8601 формат
$updatedContent = preg_replace(
    '/<lastmod>.*?<\/lastmod>/',
    '<lastmod>' . $currentDate . '</lastmod>',
    $updatedContent
);

// Сохраняем обновленный файл
if (file_put_contents($sitemapFile, $updatedContent) !== false) {
    echo "✅ <strong>Успешно!</strong><br>";
    echo "📍 Домен обновлен на: <strong>" . htmlspecialchars($currentDomain) . "</strong><br>";
    echo "📅 Дата обновления: " . date('d.m.Y H:i:s') . "<br><br>";
    echo "🎯 <strong>Что дальше:</strong><br>";
    echo "1. Удалите этот файл (update-sitemap.php) с сервера<br>";
    echo "2. Загрузите обновленный sitemap.xml в Google Search Console<br>";
    echo "3. Проверьте работоспособность всех страниц<br>";
    
    // Показываем превью обновленного sitemap
    echo "<br><hr><h3>📋 Превью обновленного sitemap.xml:</h3>";
    echo "<pre>" . htmlspecialchars(substr($updatedContent, 0, 500)) . "...</pre>";
    
} else {
    echo "❌ Ошибка при сохранении файла sitemap.xml!<br>";
    echo "Проверьте права на запись в директории.";
}
?>

<style>
body { 
    font-family: Arial, sans-serif; 
    max-width: 800px; 
    margin: 50px auto; 
    padding: 20px; 
    background: #f5f5f5; 
}
pre { 
    background: #fff; 
    padding: 15px; 
    border-radius: 5px; 
    overflow-x: auto; 
    border-left: 4px solid #007cba;
}
</style> 