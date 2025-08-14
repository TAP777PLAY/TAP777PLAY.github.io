@echo off
chcp 65001 >nul
echo Обновление года с 2024 на 2025...
echo.

REM Простая замена с помощью findstr и copy
echo Создаю временные файлы...

REM HTML файл
if exist index.html (
    echo Обрабатываю index.html...
    findstr /v "2024" index.html > temp.html
    copy temp.html index.html >nul
    del temp.html
    echo   index.html обновлен
)

REM README файл
if exist README.md (
    echo Обрабатываю README.md...
    findstr /v "2024" README.md > temp.md
    copy temp.md README.md >nul
    del temp.md
    echo   README.md обновлен
)

echo.
echo Обновление завершено!
echo.
echo Проверка результатов:
findstr /s /i "2025" *.html *.md *.js *.css *.json

pause
