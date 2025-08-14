# Скрипт для обновления года с 2024 на 2025
# Автор: AI Assistant
# Дата: 2025

Write-Host "Обновление года с 2024 на 2025..." -ForegroundColor Green

# Файлы для обработки
$files = @(
    "index.html",
    "README.md",
    "styles.css",
    "additional-styles.css",
    "script.js",
    "design-system.json"
)

$totalReplacements = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Обрабатываю файл: $file" -ForegroundColor Yellow
        
        # Читаем содержимое файла
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Подсчитываем количество замен
        $beforeCount = ([regex]::Matches($content, "2024")).Count
        
        # Выполняем замену
        $newContent = $content -replace "2024", "2025"
        
        # Подсчитываем количество замен после
        $afterCount = ([regex]::Matches($newContent, "2025")).Count
        
        # Записываем обновленный файл
        Set-Content $file -Value $newContent -Encoding UTF8
        
        $replacements = $afterCount - $beforeCount
        $totalReplacements += $replacements
        
        Write-Host "  Заменено: $replacements упоминаний" -ForegroundColor Cyan
    } else {
        Write-Host "Файл не найден: $file" -ForegroundColor Red
    }
}

Write-Host "`nОбновление завершено!" -ForegroundColor Green
Write-Host "Всего заменено: $totalReplacements упоминаний" -ForegroundColor Cyan

# Дополнительная проверка
Write-Host "`nПроверка результатов..." -ForegroundColor Yellow
Get-ChildItem -Name "*.html", "*.md", "*.js", "*.css", "*.json" | ForEach-Object {
    $count = (Get-Content $_ -Raw | Select-String "2025" -AllMatches).Matches.Count
    if ($count -gt 0) {
        Write-Host "  $_: найдено $count упоминаний 2025 года" -ForegroundColor Green
    }
}

Write-Host "`nСкрипт выполнен успешно!" -ForegroundColor Green
