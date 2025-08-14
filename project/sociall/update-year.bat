@echo off
chcp 65001 >nul
echo Обновление года с 2024 на 2025...
echo.

REM Замена в HTML файле
if exist index.html (
    echo Обрабатываю index.html...
    powershell -Command "(Get-Content index.html -Raw) -replace '2024', '2025' | Set-Content index.html -Encoding UTF8"
    echo   index.html обновлен
)

REM Замена в README
if exist README.md (
    echo Обрабатываю README.md...
    powershell -Command "(Get-Content README.md -Raw) -replace '2024', '2025' | Set-Content README.md -Encoding UTF8"
    echo   README.md обновлен
)

REM Замена в CSS файлах
if exist styles.css (
    echo Обрабатываю styles.css...
    powershell -Command "(Get-Content styles.css -Raw) -replace '2024', '2025' | Set-Content styles.css -Encoding UTF8"
    echo   styles.css обновлен
)

if exist additional-styles.css (
    echo Обрабатываю additional-styles.css...
    powershell -Command "(Get-Content additional-styles.css -Raw) -replace '2024', '2025' | Set-Content additional-styles.css -Encoding UTF8"
    echo   additional-styles.css обновлен
)

REM Замена в JavaScript файле
if exist script.js (
    echo Обрабатываю script.js...
    powershell -Command "(Get-Content script.js -Raw) -replace '2024', '2025' | Set-Content script.js -Encoding UTF8"
    echo   script.js обновлен
)

REM Замена в JSON файле
if exist design-system.json (
    echo Обрабатываю design-system.json...
    powershell -Command "(Get-Content design-system.json -Raw) -replace '2024', '2025' | Set-Content design-system.json -Encoding UTF8"
    echo   design-system.json обновлен
)

echo.
echo Обновление завершено!
echo.
echo Проверка результатов:
powershell -Command "Get-ChildItem -Name '*.html', '*.md', '*.js', '*.css', '*.json' | ForEach-Object { $count = (Get-Content $_ -Raw | Select-String '2025' -AllMatches).Matches.Count; if ($count -gt 0) { Write-Host '  $_: найдено $count упоминаний 2025 года' } }"

pause
