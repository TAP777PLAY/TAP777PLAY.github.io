// Состояние приложения
const state = {
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    transactions: JSON.parse(localStorage.getItem('transactions')) || [],
    selectedCategory: null,
    currentPage: 'main',
    categoryPositions: {
        expense: JSON.parse(localStorage.getItem('expenseCategoryPositions')) || {},
        income: JSON.parse(localStorage.getItem('incomeCategoryPositions')) || {}
    },
    dragState: {
        isDragging: false,
        dragElement: null,
        dragClone: null,
        longPressTimer: null,
        initialX: 0,
        initialY: 0,
        currentX: 0,
        currentY: 0,
        offsetX: 0,
        offsetY: 0
    },
    lastTouchTimestamp: 0 // Добавляем это поле
};

// Объект состояния настроек приложения
const settingsState = {
    currency: 'RUB',
    currencySymbol: '₽',
    language: 'ru',
    remindersEnabled: true,
    reminders: [
        {
            id: 'default-reminder',
            title: 'Ежедневное напоминание',
            time: '18:00',
            repeat: 'daily',
            message: 'Не забудьте внести свои финансы за сегодня',
            enabled: true
        }
    ],
    soundEnabled: true
};

// Объект для хранения данных пользователя после авторизации
let userProfile = {
    isSignedIn: false,
    id: null,
    name: null,
    email: null,
    imageUrl: null
};

// Добавим переменную для отслеживания проблем с авторизацией
let authErrorState = {
    isError: false,
    message: '',
    details: '',
    solution: ''
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    console.log('[DEBUG] DOM полностью загружен');
    
    // Загружаем и применяем сохраненные позиции категорий
    loadCategoryPositions();
    
    // Инициализация страницы
    updateDateDisplay();
    updateTransactionsDisplay();
    setupNavigation();
    
    // Инициализация настроек
    initializeSettings();
    
    // Предзагрузка и инициализация звуковых эффектов
    preloadSoundEffects();
    initializeButtonSounds();
    
    // Проверяем, есть ли страница настроек
    const settingsPage = document.getElementById('settings');
    if (settingsPage) {
        console.log('[DEBUG] Найдена страница настроек при загрузке DOM');
    } else {
        console.warn('[DEBUG] Не найдена страница настроек при загрузке DOM');
    }
    
    // Обработчики для кнопки добавления
    const addButton = document.querySelector('.add-button');
    addButton.addEventListener('click', () => {
        document.querySelector('.transaction-type-modal').classList.add('active');
    });
    
    // Обработчик для кнопки "назад" в модальном окне выбора типа операции
    const backButton = document.querySelector('.transaction-type-modal .back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            document.querySelector('.transaction-type-modal').classList.remove('active');
            
            // Возвращаем активное состояние на главную страницу
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(navItem => navItem.classList.remove('active'));
            const mainNavItem = document.querySelector('.nav-item[data-page="main"]');
            if (mainNavItem) {
                mainNavItem.classList.add('active');
            }
            
            // Показываем главную страницу
            const pages = document.querySelectorAll('.content');
            pages.forEach(page => page.classList.remove('active'));
            const mainPage = document.getElementById('main');
            if (mainPage) {
                mainPage.classList.add('active');
            }
        });
    }
    
    // Инициализация перетаскивания категорий
    initializeDragAndDrop();
    
    // Обработчики для типов транзакций
    document.querySelectorAll('.type-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.type-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const type = button.dataset.type;
            document.querySelectorAll('.categories-grid').forEach(grid => grid.classList.remove('active'));
            
            if (type === 'expense') {
                document.querySelector('.expense-categories').classList.add('active');
            } else if (type === 'income') {
                document.querySelector('.income-categories').classList.add('active');
            } else if (type === 'transfer') {
                document.querySelector('.transfer-categories').classList.add('active');
            }
        });
    });
    
    // Обработчики навигации по месяцам НА ГЛАВНОЙ странице
    const mainPage = document.getElementById('main');
    if (mainPage) {
        const prevMonthMain = mainPage.querySelector('.prev-month');
        const nextMonthMain = mainPage.querySelector('.next-month');
        
        if (prevMonthMain) {
            prevMonthMain.addEventListener('click', () => {
                if (state.selectedMonth === 0) {
                    state.selectedMonth = 11;
                    state.selectedYear--;
                } else {
                    state.selectedMonth--;
                }
                updateDateDisplay();
                updateTransactionsDisplay();
            });
        }
        
        if (nextMonthMain) {
            nextMonthMain.addEventListener('click', () => {
                if (state.selectedMonth === 11) {
                    state.selectedMonth = 0;
                    state.selectedYear++;
                } else {
                    state.selectedMonth++;
                }
                updateDateDisplay();
                updateTransactionsDisplay();
            });
        }
    }
    
    // Обработчик выбора категории
    document.querySelector('.transaction-type-modal').querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Проверяем, что клик был именно по категории в модальном окне выбора типа операции
            if (!e.target.closest('.transaction-type-modal')) {
                return;
            }
            
            // Добавляем проверку на сенсорное событие
            // Если это событие возникло из-за сенсорного ввода и прошло менее 300мс с touchstart
            if (e.timeStamp - (item.touchStartTime || 0) < 300) {
                // Это событие уже было обработано в touchend, пропускаем
                return;
            }

            const category = item.dataset.category;
            const type = document.querySelector('.type-button.active').dataset.type;
            
            // Если категория уже выбрана, снимаем выбор
            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
                hidePopupForm();
                state.selectedCategory = null;
                return;
            }

            // Снимаем выделение со всех категорий
            document.querySelector('.transaction-type-modal').querySelectorAll('.category-item').forEach(cat => {
                cat.classList.remove('selected');
            });

            // Выделяем выбранную категорию
            item.classList.add('selected');
            state.selectedCategory = category;

            // Заполняем скрытые поля
            document.getElementById('popup-category').value = category;
            document.getElementById('popup-type').value = type;

            // Устанавливаем текущую дату
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('popup-date').value = today;

            // Показываем форму
            showPopupForm();
        });

        // Добавляем обработчик для сенсорного взаимодействия
        if ('ontouchstart' in window) {
            item.addEventListener('touchend', (e) => {
                // Пропускаем, если это был скролл или swipe, а не tap
                if (item.touchMoved) return;
                
                // Предотвращаем дребезг касаний - проверяем, что прошло достаточно времени с последнего касания
                const now = Date.now();
                if (now - state.lastTouchTimestamp < 500) {
                    return; // Слишком быстрое повторное касание, игнорируем
                }
                state.lastTouchTimestamp = now;
                
                const category = item.dataset.category;
                const type = document.querySelector('.type-button.active').dataset.type;
                
                // Если категория уже выбрана, снимаем выбор
                if (item.classList.contains('selected')) {
                    item.classList.remove('selected');
                    hidePopupForm();
                    state.selectedCategory = null;
                    return;
                }
                
                // Снимаем выделение со всех категорий
                document.querySelector('.transaction-type-modal').querySelectorAll('.category-item').forEach(cat => {
                    cat.classList.remove('selected');
                });
                
                // Выделяем выбранную категорию
                item.classList.add('selected');
                state.selectedCategory = category;
                
                // Заполняем скрытые поля
                document.getElementById('popup-category').value = category;
                document.getElementById('popup-type').value = type;
                
                // Устанавливаем текущую дату
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('popup-date').value = today;
                
                // Показываем форму
                showPopupForm();
                
                // Предотвращаем дополнительный клик
                e.preventDefault();
            });
        }
    });

    // Обработчик сохранения транзакции
    document.getElementById('popup-submit').addEventListener('click', () => {
        const amount = document.getElementById('popup-amount').value;
        const date = document.getElementById('popup-date').value;
        const note = document.getElementById('popup-note').value;
        const category = document.getElementById('popup-category').value;
        const type = document.getElementById('popup-type').value;
        const editId = document.querySelector('.popup-form').dataset.editId;

        if (!amount || !category || !date) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        const transaction = {
            id: editId ? parseInt(editId) : Date.now(),
            amount: parseFloat(amount),
            category,
            type,
            date,
            note
        };

        saveTransaction(transaction);
        
        // Очищаем форму
        document.getElementById('popup-amount').value = '';
        document.getElementById('popup-note').value = '';
        document.getElementById('popup-category').value = '';
        document.getElementById('popup-type').value = '';
        document.getElementById('popup-date').value = '';
        document.querySelector('.popup-form').dataset.editId = '';
        
        // Скрываем форму
        hidePopupForm();
        
        // Снимаем выделение с категории
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Обновляем список транзакций и сводку
        updateTransactionsList();
        updateSummary();
    });

    // Инициализация функционала переводов
    initializeTransfers();

    // Инициализация выбора периода вместо календаря
    // initializePeriodSelector();

    // Инициализация календаря
    initializeCalendar();

    // Инициализация отчетов
    initializeReports();

    // Инициализация Google Sign-In
    setTimeout(() => {
        initializeGoogleSignIn();
    }, 1000);
});

// Функции для работы с данными
function loadData() {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
        state.transactions = JSON.parse(savedTransactions);
    }
}

function saveData() {
    localStorage.setItem('transactions', JSON.stringify(state.transactions));
}

// Функции обновления интерфейса
function updateDateDisplay() {
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    const monthElement = document.querySelector('.month');
    const yearElement = document.querySelector('.year');
    
    if (monthElement && yearElement) {
        monthElement.textContent = monthNames[state.selectedMonth];
        yearElement.textContent = state.selectedYear;
    }
}

function updateTransactionsDisplay() {
    const transactions = document.querySelector('.transactions');
    const noRecords = document.querySelector('.no-records');
    
    if (state.transactions.length === 0) {
        if (noRecords) noRecords.style.display = 'flex';
        return;
    }
    
    if (noRecords) noRecords.style.display = 'none';
    
    // Фильтрация транзакций по текущему месяцу
    const currentTransactions = state.transactions.filter(transaction => {
        const date = new Date(transaction.date);
        return date.getMonth() === state.selectedMonth && 
               date.getFullYear() === state.selectedYear;
    });
    
    // Обновление сумм
    updateSummary(currentTransactions);
}

function updateSummary(transactions = []) {
    // Если транзакции не переданы, получаем их из текущего месяца
    if (!transactions || transactions.length === 0) {
        transactions = getTransactions().filter(transaction => {
            const date = new Date(transaction.date);
            return date.getMonth() === state.selectedMonth && 
                   date.getFullYear() === state.selectedYear;
        });
    }
    
    let expenses = 0;
    let income = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            expenses += parseFloat(transaction.amount) || 0;
        } else {
            income += parseFloat(transaction.amount) || 0;
        }
    });
    
    const balance = income - expenses;
    
    // Проверяем существование элементов перед обновлением
    const expenseElement = document.querySelector('.expense');
    const incomeElement = document.querySelector('.income');
    const balanceElement = document.querySelector('.balance');
    
    if (expenseElement) expenseElement.textContent = formatAmount(expenses);
    if (incomeElement) incomeElement.textContent = formatAmount(income);
    if (balanceElement) balanceElement.textContent = formatAmount(balance);
}

// Вспомогательные функции
function formatAmount(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function showPopupForm(transaction = null) {
    const popupForm = document.querySelector('.popup-form');
    
    if (transaction) {
        // Режим редактирования
        document.getElementById('popup-amount').value = transaction.amount;
        document.getElementById('popup-date').value = transaction.date;
        document.getElementById('popup-note').value = transaction.note || '';
        document.getElementById('popup-category').value = transaction.category;
        document.getElementById('popup-type').value = transaction.type;
        popupForm.dataset.editId = transaction.id;
    } else {
        // Режим добавления
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('popup-date').value = today;
        popupForm.dataset.editId = '';
    }
    
    popupForm.classList.add('active');
    document.getElementById('popup-amount').focus();
}

function hidePopupForm() {
    const popupForm = document.querySelector('.popup-form');
    popupForm.classList.remove('active');
    
    // Очищаем все поля формы
    document.getElementById('popup-amount').value = '';
    document.getElementById('popup-note').value = '';
    document.getElementById('popup-category').value = '';
    document.getElementById('popup-type').value = '';
    document.getElementById('popup-date').value = '';
    popupForm.dataset.editId = '';
    
    // Снимаем выделение с категорий
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('selected');
    });
}

// Настройка навигации
function setupNavigation() {
    console.log('[DEBUG] Настройка навигации');
    
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.content');
    
    console.log(`[DEBUG] Найдено ${navItems.length} элементов навигации и ${pages.length} страниц`);
    
    // Проверяем, есть ли элемент навигации для настроек
    const settingsNavItem = document.querySelector('.nav-item[data-page="settings"]');
    if (settingsNavItem) {
        console.log('[DEBUG] Найден элемент навигации для настроек');
    } else {
        console.warn('[DEBUG] Не найден элемент навигации для настроек');
    }
    
    // Проверяем, есть ли страница настроек
    const settingsPage = document.getElementById('settings');
    if (settingsPage) {
        console.log('[DEBUG] Найдена страница настроек');
    } else {
        console.warn('[DEBUG] Не найдена страница настроек');
    }
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageName = item.dataset.page;
            console.log(`[DEBUG] Клик по навигации: ${pageName}`);
            
            // Обработка специального случая - категории
            if (pageName === 'categories') {
                console.log('[DEBUG] Открытие модального окна категорий');
                document.querySelector('.transaction-type-modal').classList.add('active');
                
                // Убираем активный класс со всех навигационных элементов
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Добавляем активный класс на выбранный элемент
                item.classList.add('active');
                
                return;
            }
            
            // Скрываем все страницы
            pages.forEach(page => {
                page.style.display = 'none';
                page.classList.remove('active');
            });
            
            // Убираем активный класс со всех навигационных элементов
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Добавляем активный класс на выбранный элемент
            item.classList.add('active');
            
            // Показываем выбранную страницу
            const currentPage = document.getElementById(pageName);
            if (currentPage) {
                currentPage.style.display = 'block';
                currentPage.classList.add('active');
                state.currentPage = pageName;
                
                console.log(`[DEBUG] Переключение на страницу: ${pageName}`);
                
                // Дополнительные действия при переключении на определенные страницы
                if (pageName === 'reports') {
                    // Обновляем отчеты при переходе на страницу отчетов
                    console.log('[DEBUG] Обновление отчетов');
                    updateReport(true);
                } else if (pageName === 'settings') {
                    // При переходе на страницу настроек обновляем их отображение
                    console.log('[DEBUG] Обновление страницы настроек');
                    
                    // Проверяем, есть ли элементы настроек на странице
                    const settingsItems = document.querySelectorAll('.settings-item');
                    console.log(`[DEBUG] Элементы настроек на странице: ${settingsItems.length}`);
                }
            } else {
                console.error(`[DEBUG] Страница ${pageName} не найдена`);
            }
            
            // Закрываем любые открытые модальные окна при переключении страницы
            document.querySelectorAll('.modal.active').forEach(modal => {
                if (!modal.classList.contains('transaction-type-modal') || pageName !== 'categories') {
                    modal.classList.remove('active');
                }
            });
            
            // Если переходим не на страницу категорий, закрываем модальное окно выбора типа операции
            if (pageName !== 'categories') {
                const transactionTypeModal = document.querySelector('.transaction-type-modal');
                if (transactionTypeModal) {
                    transactionTypeModal.classList.remove('active');
                }
            }
        });
    });
    
    // По умолчанию активна главная страница
    pages.forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active');
    });
    
    const mainPage = document.getElementById('main');
    if (mainPage) {
        mainPage.style.display = 'block';
        mainPage.classList.add('active');
    }
    
    // Активируем кнопку главной страницы
    navItems.forEach(nav => nav.classList.remove('active'));
    const mainNavItem = document.querySelector('.nav-item[data-page="main"]');
    if (mainNavItem) {
        mainNavItem.classList.add('active');
    }
    
    console.log('[DEBUG] Навигация настроена');
}

// Функции для работы с позициями категорий
function loadCategoryPositions() {
    const expenseGrid = document.querySelector('.expense-categories');
    const incomeGrid = document.querySelector('.income-categories');
    
    // Загружаем позиции для расходов
    if (expenseGrid && Object.keys(state.categoryPositions.expense).length > 0) {
        const expenseItems = Array.from(expenseGrid.children);
        const sortedExpenseItems = expenseItems.sort((a, b) => {
            const posA = state.categoryPositions.expense[a.dataset.category] || 0;
            const posB = state.categoryPositions.expense[b.dataset.category] || 0;
            return posA - posB;
        });
        
        sortedExpenseItems.forEach(item => {
            expenseGrid.appendChild(item);
        });
    }
    
    // Загружаем позиции для доходов
    if (incomeGrid && Object.keys(state.categoryPositions.income).length > 0) {
        const incomeItems = Array.from(incomeGrid.children);
        const sortedIncomeItems = incomeItems.sort((a, b) => {
            const posA = state.categoryPositions.income[a.dataset.category] || 0;
            const posB = state.categoryPositions.income[b.dataset.category] || 0;
            return posA - posB;
        });
        
        sortedIncomeItems.forEach(item => {
            incomeGrid.appendChild(item);
        });
    }
}

function saveCategoryPositions() {
    const expenseGrid = document.querySelector('.expense-categories');
    const incomeGrid = document.querySelector('.income-categories');
    
    // Сохраняем позиции расходов
    if (expenseGrid) {
        const expensePositions = {};
        Array.from(expenseGrid.children).forEach((item, index) => {
            expensePositions[item.dataset.category] = index;
        });
        state.categoryPositions.expense = expensePositions;
        localStorage.setItem('expenseCategoryPositions', JSON.stringify(expensePositions));
    }
    
    // Сохраняем позиции доходов
    if (incomeGrid) {
        const incomePositions = {};
        Array.from(incomeGrid.children).forEach((item, index) => {
            incomePositions[item.dataset.category] = index;
        });
        state.categoryPositions.income = incomePositions;
        localStorage.setItem('incomeCategoryPositions', JSON.stringify(incomePositions));
    }
}

// Функции для перетаскивания
function initializeDragAndDrop() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        // Обработчики для мобильных устройств
        item.addEventListener('touchstart', handleTouchStart, { passive: false });
        item.addEventListener('touchmove', handleTouchMove, { passive: false });
        item.addEventListener('touchend', handleTouchEnd);
        
        // Обработчики для мыши
        item.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    });
}

function handleTouchStart(e) {
    // Store the touch start time and position for later determining if it was a tap or drag
    const touch = e.touches[0];
    const touchStartTime = new Date().getTime();
    const touchStartX = touch.clientX;
    const touchStartY = touch.clientY;
    
    // Save these values to the element itself for reference in touchend
    const categoryItem = e.target.closest('.category-item');
    
    // Добавляем проверку на наличие элемента
    if (!categoryItem) return;
    
    categoryItem.touchStartTime = touchStartTime;
    categoryItem.touchStartX = touchStartX;
    categoryItem.touchStartY = touchStartY;
    categoryItem.touchMoved = false;
    
    // Проверяем, находимся ли мы в модальном окне выбора категории
    const isInTransactionModal = categoryItem.closest('.transaction-type-modal');
    
    if (isInTransactionModal) {
        // Для категорий в модальном окне не начинаем перетаскивание
        // и не симулируем клик - просто дадим событию завершиться естественным образом
        return;
    } else {
        // Для других случаев (не в модальном окне) - стандартное перетаскивание
        e.preventDefault();
        startDrag(categoryItem, touch.clientX, touch.clientY);
    }
}

function handleTouchMove(e) {
    const categoryItem = e.target.closest('.category-item');
    if (!categoryItem) return;
    
    // Отмечаем, что произошло движение
    categoryItem.touchMoved = true;
    
    // Если элемент в модальном окне, не мешаем стандартному скроллингу
    if (categoryItem.closest('.transaction-type-modal')) {
        return;
    }
    
    // Иначе обрабатываем перетаскивание как обычно
    e.preventDefault();
    if (!state.dragState.isDragging) return;
    
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
}

function handleTouchEnd(e) {
    const categoryItem = e.target.closest('.category-item');
    
    // Завершаем перетаскивание в любом случае
    endDrag();
    
    // Если нет элемента категории или событие уже обработано, выходим
    if (!categoryItem) return;
    
    // Добавляем обработку тапов в модальном окне выбора категории
    // Но используем собственный обработчик touchend, добавленный к каждой категории
    // Мы НЕ симулируем click, так как мы уже добавили отдельный обработчик touchend
}

function handleMouseDown(e) {
    e.preventDefault();
    startDrag(e.target.closest('.category-item'), e.clientX, e.clientY);
}

function handleMouseMove(e) {
    if (!state.dragState.isDragging) return;
    moveDrag(e.clientX, e.clientY);
}

function handleMouseUp() {
    endDrag();
}

function startDrag(element, x, y) {
    // Запускаем таймер для определения долгого нажатия
    state.dragState.longPressTimer = setTimeout(() => {
        state.dragState.isDragging = true;
        state.dragState.dragElement = element;
        state.dragState.initialX = x;
        state.dragState.initialY = y;
        state.dragState.currentX = x;
        state.dragState.currentY = y;
        
        // Создаем клон элемента
        const clone = element.cloneNode(true);
        clone.classList.add('category-clone');
        document.body.appendChild(clone);
        state.dragState.dragClone = clone;
        
        // Вычисляем смещение от точки касания до центра элемента
        const rect = element.getBoundingClientRect();
        state.dragState.offsetX = rect.width / 2;
        state.dragState.offsetY = rect.height / 2;
        
        // Позиционируем клон
        updateClonePosition(x, y);
        
        element.classList.add('shake');
    }, 500);
}

function moveDrag(x, y) {
    if (!state.dragState.isDragging) return;
    
    state.dragState.currentX = x;
    state.dragState.currentY = y;
    
    updateClonePosition(x, y);
    
    // Проверяем элемент под курсором/пальцем
    const elementBelow = document.elementFromPoint(x, y);
    const categoryBelow = elementBelow?.closest('.category-item');
    
    // Убираем подсветку со всех категорий
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('drag-over');
    });
    
    // Подсвечиваем категорию под курсором/пальцем
    if (categoryBelow && categoryBelow !== state.dragState.dragElement) {
        categoryBelow.classList.add('drag-over');
    }
}

function updateClonePosition(x, y) {
    if (!state.dragState.dragClone) return;
    
    const left = x - state.dragState.offsetX;
    const top = y - state.dragState.offsetY;
    
    state.dragState.dragClone.style.left = `${left}px`;
    state.dragState.dragClone.style.top = `${top}px`;
}

function endDrag() {
    // Очищаем таймер долгого нажатия
    if (state.dragState.longPressTimer) {
        clearTimeout(state.dragState.longPressTimer);
    }
    
    if (!state.dragState.isDragging) return;
    
    const draggedElement = state.dragState.dragElement;
    const dropTarget = document.elementFromPoint(state.dragState.currentX, state.dragState.currentY);
    const dropCategory = dropTarget?.closest('.category-item');
    
    if (dropCategory && dropCategory !== draggedElement) {
        // Меняем местами категории
        const draggedHTML = draggedElement.innerHTML;
        const draggedDataset = { ...draggedElement.dataset };
        
        draggedElement.innerHTML = dropCategory.innerHTML;
        Object.keys(dropCategory.dataset).forEach(key => {
            draggedElement.dataset[key] = dropCategory.dataset[key];
        });
        
        dropCategory.innerHTML = draggedHTML;
        Object.keys(draggedDataset).forEach(key => {
            dropCategory.dataset[key] = draggedDataset[key];
        });
        
        // Сохраняем новые позиции
        saveCategoryPositions();
    }
    
    // Удаляем клон
    if (state.dragState.dragClone) {
        state.dragState.dragClone.remove();
        state.dragState.dragClone = null;
    }
    
    // Очищаем стили и классы
    draggedElement.classList.remove('shake');
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('drag-over');
    });
    
    // Сбрасываем состояние перетаскивания
    state.dragState.isDragging = false;
    state.dragState.dragElement = null;
}

// Объединенный функционал переводов
function initializeTransfers() {
    const transferPlanner = document.querySelector('.transfer-planner');
    const plannedTransfers = document.querySelector('.planned-transfers');
    const bankSelects = document.querySelectorAll('.bank-select');
    
    // Обработка клика по компактному представлению формы
    if (transferPlanner) {
        // Открытие формы
        transferPlanner.addEventListener('click', (e) => {
            if (transferPlanner.classList.contains('collapsed') && !e.target.closest('.transfer-form')) {
                transferPlanner.classList.remove('collapsed');
                // Очищаем форму при открытии
                const transferForm = transferPlanner.querySelector('.transfer-form');
                if (transferForm) {
                    transferForm.reset();
                    delete transferForm.dataset.editId;
                    const saveButton = transferForm.querySelector('.save-transfer');
                    if (saveButton) {
                        saveButton.textContent = 'Сохранить';
                        saveButton.disabled = false;
                    }
                }
            }
        });

        // Обработка клика по кнопке сворачивания
        const collapseButton = transferPlanner.querySelector('.collapse-button');
        if (collapseButton) {
            collapseButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                transferPlanner.classList.add('collapsed');
            });
        }

        // Закрытие формы при клике вне её
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.transfer-planner') && !transferPlanner.classList.contains('collapsed')) {
                transferPlanner.classList.add('collapsed');
            }
        });
    }

    // Обработка выбора "Другой" банк
    bankSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            if (e.target.value === 'other') {
                const customBankName = prompt('Введите название банка:');
                if (customBankName) {
                    const option = document.createElement('option');
                    option.value = 'custom_' + customBankName.toLowerCase().replace(/\s+/g, '_');
                    option.textContent = customBankName;
                    
                    const otherOption = e.target.querySelector('option[value="other"]');
                    e.target.insertBefore(option, otherOption);
                    e.target.value = option.value;
                } else {
                    e.target.value = '';
                }
            }
        });
    });

    // Обработчик сохранения формы
    const transferForm = document.querySelector('.transfer-form');
    if (transferForm) {
        const saveButton = transferForm.querySelector('.save-transfer');
        const scheduleDayInput = transferForm.querySelector('.schedule-field input');
        
        // Добавляем валидацию для поля дня
        scheduleDayInput.addEventListener('input', (e) => {
            let value = parseInt(e.target.value);
            if (isNaN(value)) {
                e.target.value = '';
            } else if (value < 1) {
                e.target.value = '1';
            } else if (value > 31) {
                e.target.value = '31';
            }
        });

        saveButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const fromBank = transferForm.querySelector('.bank-from .bank-select').value;
            const fromAccount = transferForm.querySelector('.bank-from .account-number').value;
            const toBank = transferForm.querySelector('.bank-to .bank-select').value;
            const toAccount = transferForm.querySelector('.bank-to .account-number').value;
            const amount = transferForm.querySelector('.amount-field input').value;
            const scheduleDay = transferForm.querySelector('.schedule-field input').value;
            const note = transferForm.querySelector('.note-field input').value;

            // Создаем и сохраняем перевод
            const transfer = {
                fromBank,
                fromAccount,
                toBank,
                toAccount,
                amount: parseFloat(amount),
                scheduleDay: parseInt(scheduleDay),
                note,
                id: Date.now()
            };

            // Сохраняем перевод
            saveTransfer(transfer);

            // Очищаем форму после сохранения
            transferForm.reset();
            delete transferForm.dataset.editId;
            saveButton.textContent = 'Сохранить';

            // Сворачиваем форму
            transferPlanner.classList.add('collapsed');
        });
    }

    // Загружаем сохраненные переводы при инициализации
    loadSavedTransfers();
}

// Вспомогательные функции для работы с переводами
function createTransferItem(transfer) {
    const transferItem = document.createElement('div');
    transferItem.className = 'planned-transfer-item collapsed';
    transferItem.innerHTML = `
        <div class="transfer-header">
            <div class="transfer-info">
                <div class="transfer-main">
                    <div class="transfer-banks">${getBankName(transfer.fromBank)} → ${getBankName(transfer.toBank)}</div>
                    <div class="transfer-amount">${formatAmount(transfer.amount)} ₽</div>
                </div>
                <div class="transfer-secondary">
                    <div class="schedule-info">Ежемесячно ${transfer.scheduleDay}-го числа</div>
                    ${transfer.notifications ? 
                        `<div class="notification-time">
                            <span class="material-icons">schedule</span>
                            ${transfer.notificationTime}
                        </div>` : 
                        ''}
                    ${transfer.note ? `<div class="transfer-note">${transfer.note}</div>` : ''}
                </div>
            </div>
            <div class="transfer-actions">
                <button class="action-button notification-toggle ${transfer.notifications ? 'active' : ''}" 
                        title="Уведомления ${transfer.notificationTime || ''}">
                    <span class="material-icons">${transfer.notifications ? 'notifications_active' : 'notifications_off'}</span>
                </button>
                <button class="action-button edit-button" title="Редактировать">
                    <span class="material-icons">edit</span>
                </button>
                <button class="action-button delete-button" title="Удалить">
                    <span class="material-icons">delete</span>
                </button>
            </div>
        </div>
        <div class="transfer-details">
            <div class="account-details">
                <div class="account-info">
                    <span class="label">Счет отправителя:</span>
                    <span class="value">${transfer.fromAccount}</span>
                </div>
                <div class="account-info">
                    <span class="label">Счет получателя:</span>
                    <span class="value">${transfer.toAccount}</span>
                </div>
            </div>
        </div>
    `;

    // Обработчик для кнопки уведомлений
    const notificationToggle = transferItem.querySelector('.notification-toggle');
    notificationToggle.addEventListener('click', async (e) => {
        e.stopPropagation();
        
        if (!notificationToggle.classList.contains('active')) {
            // При включении уведомлений запрашиваем время
            const time = await showTimePickerDialog();
            if (!time) return; // Если пользователь отменил выбор времени
            
            notificationToggle.classList.add('active');
            notificationToggle.querySelector('.material-icons').textContent = 'notifications_active';
            notificationToggle.title = `Уведомления ${time}`;
            
            // Обновляем состояние уведомлений в хранилище
            updateTransferNotifications(transfer.id, true, time);
        } else {
            // При выключении просто отключаем уведомления
            notificationToggle.classList.remove('active');
            notificationToggle.querySelector('.material-icons').textContent = 'notifications_off';
            notificationToggle.title = 'Уведомления';
            
            // Обновляем состояние уведомлений в хранилище
            updateTransferNotifications(transfer.id, false, null);
        }
        
        // Обновляем отображение времени уведомления
        loadSavedTransfers();
    });

    // Обработчик для кнопки редактирования
    const editButton = transferItem.querySelector('.edit-button');
    editButton.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditTransferForm(transfer);
    });

    // Обработчик для кнопки удаления
    const deleteButton = transferItem.querySelector('.delete-button');
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Вы уверены, что хотите удалить этот перевод?')) {
            deleteTransfer(transfer.id);
            transferItem.remove();
        }
    });

    // Обработчик для сворачивания/разворачивания
    transferItem.addEventListener('click', () => {
        const wasCollapsed = transferItem.classList.contains('collapsed');
        
        // Сворачиваем все остальные элементы
        document.querySelectorAll('.planned-transfer-item').forEach(item => {
            if (item !== transferItem) {
                item.classList.add('collapsed');
            }
        });
        
        // Переключаем состояние текущего элемента
        transferItem.classList.toggle('collapsed');
    });

    return transferItem;
}

// Функция для обновления состояния уведомлений
function updateTransferNotifications(transferId, enabled, time = null) {
    const savedTransfers = JSON.parse(localStorage.getItem('plannedTransfers') || '[]');
    const transferIndex = savedTransfers.findIndex(t => t.id === transferId);
    
    if (transferIndex !== -1) {
        savedTransfers[transferIndex].notifications = enabled;
        savedTransfers[transferIndex].notificationTime = time;
        localStorage.setItem('plannedTransfers', JSON.stringify(savedTransfers));
    }
}

// Функция для удаления перевода
function deleteTransfer(transferId) {
    const savedTransfers = JSON.parse(localStorage.getItem('plannedTransfers') || '[]');
    const updatedTransfers = savedTransfers.filter(t => t.id !== transferId);
    localStorage.setItem('plannedTransfers', JSON.stringify(updatedTransfers));
}

// Функция для открытия формы редактирования
function openEditTransferForm(transfer) {
    const transferPlanner = document.querySelector('.transfer-planner');
    const transferForm = transferPlanner.querySelector('.transfer-form');
    
    // Заполняем форму данными перевода
    transferForm.querySelector('.bank-from .bank-select').value = transfer.fromBank;
    transferForm.querySelector('.bank-from .account-number').value = transfer.fromAccount;
    transferForm.querySelector('.bank-to .bank-select').value = transfer.toBank;
    transferForm.querySelector('.bank-to .account-number').value = transfer.toAccount;
    transferForm.querySelector('.amount-field input').value = transfer.amount;
    transferForm.querySelector('.schedule-field input').value = transfer.scheduleDay;
    transferForm.querySelector('.note-field input').value = transfer.note || '';
    
    // Добавляем ID редактируемого перевода в форму
    transferForm.dataset.editId = transfer.id;
    
    // Меняем текст кнопки
    const saveButton = transferForm.querySelector('.save-transfer');
    saveButton.textContent = 'Сохранить изменения';
    
    // Разворачиваем форму
    transferPlanner.classList.remove('collapsed');
}

// Обновляем функцию сохранения
function saveTransfer(transfer) {
    const savedTransfers = JSON.parse(localStorage.getItem('plannedTransfers') || '[]');
    const transferForm = document.querySelector('.transfer-form');
    const editId = transferForm?.dataset.editId;
    
    if (editId) {
        // Редактирование существующего перевода
        const transferIndex = savedTransfers.findIndex(t => t.id === parseInt(editId));
        if (transferIndex !== -1) {
            savedTransfers[transferIndex] = {
                ...transfer,
                id: parseInt(editId),
                notifications: savedTransfers[transferIndex].notifications
            };
        }
    } else {
        // Создание нового перевода
        transfer.id = Date.now();
        transfer.notifications = false;
        savedTransfers.push(transfer);
    }
    
    localStorage.setItem('plannedTransfers', JSON.stringify(savedTransfers));
    
    // Обновляем отображение
    loadSavedTransfers();

    // Очищаем форму и сворачиваем её
    const transferPlanner = document.querySelector('.transfer-planner');
    if (transferForm) {
        // Очищаем все поля формы
        const bankFromSelect = transferForm.querySelector('.bank-from .bank-select');
        const bankFromAccount = transferForm.querySelector('.bank-from .account-number');
        const bankToSelect = transferForm.querySelector('.bank-to .bank-select');
        const bankToAccount = transferForm.querySelector('.bank-to .account-number');
        const amountInput = transferForm.querySelector('.amount-field input');
        const scheduleDayInput = transferForm.querySelector('.schedule-field input');
        const noteInput = transferForm.querySelector('.note-field input');

        if (bankFromSelect) bankFromSelect.value = '';
        if (bankFromAccount) bankFromAccount.value = '';
        if (bankToSelect) bankToSelect.value = '';
        if (bankToAccount) bankToAccount.value = '';
        if (amountInput) amountInput.value = '';
        if (scheduleDayInput) scheduleDayInput.value = '';
        if (noteInput) noteInput.value = '';

        // Сбрасываем состояние формы
        delete transferForm.dataset.editId;
        const saveButton = transferForm.querySelector('.save-transfer');
        if (saveButton) {
            saveButton.textContent = 'Сохранить';
            saveButton.disabled = false;
        }
    }

    // Сворачиваем форму
    if (transferPlanner) {
        transferPlanner.classList.add('collapsed');
    }
}

function loadSavedTransfers() {
    const plannedTransfers = document.querySelector('.planned-transfers');
    const savedTransfers = JSON.parse(localStorage.getItem('plannedTransfers') || '[]');
    
    // Очищаем существующие элементы
    plannedTransfers.innerHTML = '';

    // Сортируем переводы по дате создания (ID)
    savedTransfers.sort((a, b) => b.id - a.id);

    savedTransfers.forEach(transfer => {
        const transferItem = createTransferItem(transfer);
        plannedTransfers.appendChild(transferItem);
    });
}

// Вспомогательные функции
function getBankName(bankValue) {
    const bankMap = {
        'sber': 'Сбербанк',
        'tinkoff': 'Тинькофф',
        'vtb': 'ВТБ',
        'alfa': 'Альфа-Банк',
        'gazprom': 'Газпромбанк',
        'raif': 'Райффайзен'
    };

    if (bankValue.startsWith('custom_')) {
        return bankValue.replace('custom_', '').replace(/_/g, ' ');
    }

    return bankMap[bankValue] || bankValue;
}

function formatAmount(amount) {
    return new Intl.NumberFormat('ru-RU').format(amount);
}

// Функция для показа диалога выбора времени
function showTimePickerDialog() {
    return new Promise((resolve) => {
        const dialog = document.createElement('div');
        dialog.className = 'time-picker-dialog';
        dialog.innerHTML = `
            <div class="time-picker-content">
                <h3>Выберите время уведомления</h3>
                <input type="time" class="time-input" value="09:00">
                <div class="time-picker-buttons">
                    <button class="cancel-time">Отмена</button>
                    <button class="confirm-time">Подтвердить</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        const timeInput = dialog.querySelector('.time-input');
        const confirmButton = dialog.querySelector('.confirm-time');
        const cancelButton = dialog.querySelector('.cancel-time');
        
        confirmButton.addEventListener('click', () => {
            const selectedTime = timeInput.value;
            dialog.remove();
            resolve(selectedTime);
        });
        
        cancelButton.addEventListener('click', () => {
            dialog.remove();
            resolve(null);
        });
    });
}

// Инициализация календаря
function initializeCalendar() {
    const calendarButton = document.querySelector('.calendar-button');
    const calendarModal = document.querySelector('.calendar-modal');
    const backButton = calendarModal.querySelector('.back-button');
    let currentDate = new Date();
    let selectedDate = null;

    // Открытие календаря
    calendarButton.addEventListener('click', () => {
        calendarModal.classList.add('active');
        updateMonthDisplay();
        generateCalendarDays();
    });

    // Закрытие календаря
    backButton.addEventListener('click', () => {
        calendarModal.classList.remove('active');
    });

    function updateMonthDisplay() {
        const monthNames = [
            'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
            'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
        ];
        const monthTitle = calendarModal.querySelector('.month-title');
        const date = selectedDate || currentDate;
        monthTitle.textContent = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()} г.`;
    }

    function generateCalendarDays() {
        const calendarGrid = calendarModal.querySelector('.calendar-grid');
        calendarGrid.innerHTML = '';

        // Добавляем дни недели
        const weekdays = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
        weekdays.forEach(day => {
            const weekdayElement = document.createElement('div');
            weekdayElement.className = 'calendar-weekday';
            weekdayElement.textContent = day;
            calendarGrid.appendChild(weekdayElement);
        });

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Добавляем дни предыдущего месяца
        const prevMonthDays = firstDay.getDay();
        const prevMonth = new Date(year, month, 0);
        for (let i = prevMonthDays - 1; i >= 0; i--) {
            const dayButton = document.createElement('button');
            dayButton.className = 'calendar-day other-month';
            dayButton.textContent = prevMonth.getDate() - i;
            calendarGrid.appendChild(dayButton);
        }

        // Добавляем дни текущего месяца
        const today = new Date();
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dayButton = document.createElement('button');
            dayButton.className = 'calendar-day';
            dayButton.textContent = i;

            if (year === today.getFullYear() && 
                month === today.getMonth() && 
                i === today.getDate()) {
                dayButton.classList.add('today');
            }

            if (selectedDate && 
                year === selectedDate.getFullYear() && 
                month === selectedDate.getMonth() && 
                i === selectedDate.getDate()) {
                dayButton.classList.add('selected');
            }

            dayButton.addEventListener('click', () => {
                // Убираем выделение с предыдущего выбранного дня
                const previousSelected = calendarGrid.querySelector('.calendar-day.selected');
                if (previousSelected) {
                    previousSelected.classList.remove('selected');
                }

                // Выделяем новый выбранный день
                dayButton.classList.add('selected');
                selectedDate = new Date(year, month, i);
                
                // Обновляем заголовок
                const headerTitle = document.querySelector('.header-title');
                const monthNames = [
                    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
                    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
                ];
                headerTitle.textContent = `${i} ${monthNames[month]} ${year} г.`;

                // Обновляем state
                state.selectedMonth = month;
                state.selectedYear = year;
                state.selectedDay = i;

                // Фильтруем и отображаем транзакции за выбранный день
                const selectedTransactions = state.transactions.filter(transaction => {
                    const transactionDate = new Date(transaction.date);
                    return transactionDate.getDate() === i &&
                           transactionDate.getMonth() === month &&
                           transactionDate.getFullYear() === year;
                });

                // Обновляем отображение транзакций
                const container = document.querySelector('.transactions');
                container.innerHTML = '';

                if (selectedTransactions.length === 0) {
                    container.innerHTML = `
                        <div class="no-records">
                            <span class="material-icons">receipt_long</span>
                            <p>Нет транзакций</p>
                        </div>
                    `;
                } else {
                    const group = document.createElement('div');
                    group.className = 'transaction-group';

                    const dateHeader = document.createElement('div');
                    dateHeader.className = 'transaction-date';
                    dateHeader.textContent = `${i} ${monthNames[month]}`;
                    group.appendChild(dateHeader);

                    const list = document.createElement('div');
                    list.className = 'transaction-list';

                    selectedTransactions.forEach(transaction => {
                        const item = createTransactionItem(transaction);
                        list.appendChild(item);
                    });

                    group.appendChild(list);
                    container.appendChild(group);
                }

                // Обновляем суммы
                updateSummary(selectedTransactions);
                
                // Закрываем календарь
                setTimeout(() => {
                    calendarModal.classList.remove('active');
                }, 200);
            });

            calendarGrid.appendChild(dayButton);
        }

        // Добавляем дни следующего месяца
        const remainingDays = 42 - (prevMonthDays + lastDay.getDate());
        for (let i = 1; i <= remainingDays; i++) {
            const dayButton = document.createElement('button');
            dayButton.className = 'calendar-day other-month';
            dayButton.textContent = i;
            calendarGrid.appendChild(dayButton);
        }
    }
}

// Инициализируем календарь при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeCalendar);

// Функции для работы с транзакциями
function saveTransaction(transaction) {
    let transactions = getTransactions();
    
    if (transaction.id) {
        // Редактирование существующей транзакции
        const index = transactions.findIndex(t => t.id === transaction.id);
        if (index !== -1) {
            transactions[index] = transaction;
        } else {
            transactions.push(transaction);
        }
    } else {
        // Новая транзакция
        transaction.id = Date.now();
        transactions.push(transaction);
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Обновляем state
    state.transactions = transactions;
    
    // Обновляем отчеты, если модальное окно отчетов открыто
    const reportsModal = document.querySelector('.reports-modal');
    if (reportsModal && reportsModal.classList.contains('active')) {
        // Инициализируем диаграмму, если её нет
        if (!window.expenseChart) {
            initializeChart();
        }
        // Обновляем данные без анимации
        updateReport(false);
    }
    
    // Обновляем список транзакций и сводку
    updateTransactionsList();
    updateSummary();
}

function getTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    // Сортируем транзакции по дате в обратном порядке (новые сверху)
    return transactions.sort((a, b) => {
        // Сначала сравниваем по дате
        const dateComparison = new Date(b.date) - new Date(a.date);
        // Если даты равны, сортируем по времени создания (id) в обратном порядке
        if (dateComparison === 0) {
            return b.id - a.id;
        }
        return dateComparison;
    });
}

function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate();
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                   'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return `${day} ${months[d.getMonth()]}`;
}

function groupTransactionsByDate(transactions) {
    const groups = {};
    transactions.forEach(transaction => {
        const date = transaction.date.split('T')[0]; // Получаем только дату
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
    });
    return groups;
}

function createTransactionItem(transaction) {
    const item = document.createElement('div');
    item.className = `transaction-item ${transaction.type}`;
    item.dataset.id = transaction.id;

    item.innerHTML = `
        <div class="transaction-content">
            <div class="transaction-icon">
                <span class="material-icons">${getCategoryIcon(transaction.category)}</span>
            </div>
            <div class="transaction-info">
                <div class="transaction-category">${getCategoryName(transaction.category)}</div>
                ${transaction.note ? `<div class="transaction-note">${transaction.note}</div>` : ''}
            </div>
            <div class="transaction-amount">${formatAmount(transaction.amount)}</div>
        </div>
        <div class="transaction-details">
            <div class="transaction-detail-row">
                <span class="detail-label">Категория</span>
                <span class="detail-value">${getCategoryName(transaction.category)}</span>
            </div>
            <div class="transaction-detail-row">
                <span class="detail-label">Сумма</span>
                <span class="detail-value">${formatAmount(transaction.amount)}</span>
            </div>
            <div class="transaction-detail-row">
                <span class="detail-label">Дата</span>
                <span class="detail-value">${formatDate(transaction.date)}</span>
            </div>
            ${transaction.note ? `
                <div class="transaction-detail-row">
                    <span class="detail-label">Заметка</span>
                    <span class="detail-value">${transaction.note}</span>
                </div>
            ` : ''}
            <div class="transaction-actions">
                <button class="action-button edit">
                    <span class="material-icons">edit</span>
                    Изменить
                </button>
                <button class="action-button delete">
                    <span class="material-icons">delete</span>
                    Удалить
                </button>
            </div>
        </div>
    `;

    // Обработчик клика по транзакции для раскрытия/сворачивания
    item.addEventListener('click', (e) => {
        if (!e.target.closest('.action-button')) {
            // Закрываем все другие открытые транзакции
            document.querySelectorAll('.transaction-item.expanded').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('expanded');
                }
            });
            // Переключаем состояние текущей транзакции
            item.classList.toggle('expanded');
        }
    });

    // Обработчик кнопки редактирования
    const editButton = item.querySelector('.action-button.edit');
    if (editButton) {
        editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const transactionId = parseInt(item.dataset.id);
            const transaction = getTransactions().find(t => t.id === transactionId);
            if (transaction) {
                showPopupForm(transaction);
            }
        });
    }

    // Обработчик кнопки удаления
    const deleteButton = item.querySelector('.action-button.delete');
    if (deleteButton) {
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const transactionId = parseInt(item.dataset.id);
            if (confirm('Вы уверены, что хотите удалить эту операцию?')) {
                let transactions = getTransactions();
                transactions = transactions.filter(t => t.id !== transactionId);
                localStorage.setItem('transactions', JSON.stringify(transactions));
                
                // Обновляем state
                state.transactions = transactions;
                
                // Обновляем список транзакций и сводку
                updateTransactionsList();
                updateSummary();
                
                // Обновляем отчеты, если модальное окно отчетов открыто
                const reportsModal = document.querySelector('.reports-modal');
                if (reportsModal && reportsModal.classList.contains('active')) {
                    updateReport();
                }
            }
        });
    }

    return item;
}

function updateTransactionsList() {
    const transactions = getTransactions().filter(transaction => {
        const date = new Date(transaction.date);
        return date.getMonth() === state.selectedMonth && 
               date.getFullYear() === state.selectedYear;
    });

    const container = document.querySelector('.transactions');
    container.innerHTML = '';

    if (transactions.length === 0) {
        container.innerHTML = `
            <div class="no-records">
                <span class="material-icons">receipt_long</span>
                <p>Нет транзакций</p>
            </div>
        `;
        return;
    }

    // Группируем транзакции по дате
    const groups = transactions.reduce((acc, transaction) => {
        const date = transaction.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
    }, {});

    // Сортируем даты в обратном порядке (новые сверху)
    const sortedDates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));

    sortedDates.forEach(date => {
        const group = document.createElement('div');
        group.className = 'transaction-group';

        const dateHeader = document.createElement('div');
        dateHeader.className = 'transaction-date';
        dateHeader.textContent = formatDate(date);
        group.appendChild(dateHeader);

        const list = document.createElement('div');
        list.className = 'transaction-list';

        // Сортируем транзакции внутри группы по id в обратном порядке (новые сверху)
        groups[date].sort((a, b) => b.id - a.id).forEach(transaction => {
            const item = createTransactionItem(transaction);
            list.appendChild(item);
        });

        group.appendChild(list);
        container.appendChild(group);
    });

    // Обновляем сводку
    updateSummary();
}

function getCategoryIcon(category) {
    // Преобразуем категорию в нижний регистр для сравнения
    const lowerCategory = typeof category === 'string' ? category.toLowerCase() : '';
    
    // Маппинг категорий на иконки (как на русском, так и на английском)
    const iconMap = {
        // Расходы (на русском)
        'шоппинг': 'shopping_cart',
        'еда': 'restaurant',
        'телефон': 'phone_android',
        'развлечения': 'sports_esports',
        'транспорт': 'directions_car',
        'здоровье': 'local_hospital',
        'дом': 'home',
        'коммунальные': 'bolt',
        'одежда': 'checkroom',
        'подарки': 'card_giftcard',
        'спорт': 'fitness_center',
        'образование': 'school',
        'путешествия': 'flight_takeoff',
        'жкх': 'house',
        
        // Доходы (на русском)
        'зарплата': 'account_balance_wallet',
        'фриланс': 'work',
        'дивиденды': 'trending_up',
        'подарок': 'redeem',
        'проценты': 'account_balance',
        'бизнес': 'business_center',
        'аренда': 'apartment',
        'инвестиции': 'show_chart',
        
        // Расходы (на английском)
        'shopping': 'shopping_cart',
        'food': 'restaurant',
        'phone': 'phone_android',
        'entertainment': 'sports_esports',
        'transport': 'directions_car',
        'health': 'local_hospital',
        'house': 'home',
        'utilities': 'power',
        'clothes': 'checkroom',
        'beauty': 'spa',
        'education': 'school',
        'sports': 'fitness_center',
        'cafe': 'local_cafe',
        'gifts': 'redeem',
        'pets': 'pets',
        'internet': 'wifi',
        'taxi': 'local_taxi',
        'parking': 'local_parking',
        'books': 'menu_book',
        'medicine': 'medication',
        'furniture': 'chair',
        'repair': 'build',
        'insurance': 'security',
        'subscriptions': 'subscriptions',
        'hobbies': 'palette',
        'cinema': 'movie',
        'music': 'music_note',
        'travel': 'flight_takeoff',
        'electronics': 'devices',
        'other_expense': 'attach_money',
        
        // Доходы (на английском)
        'salary': 'account_balance_wallet',
        'investments': 'show_chart',
        'part-time': 'schedule',
        'rewards': 'card_giftcard',
        'rental': 'house',
        'business': 'business_center',
        'dividends': 'trending_up',
        'freelance': 'work',
        'sales': 'sell',
        'other_income': 'payments'
    };
    
    // Возвращаем соответствующую иконку или иконку по умолчанию
    return iconMap[lowerCategory] || 'attach_money';
}

function getCategoryName(category) {
    const names = {
        // Расходы
        shopping: 'Шоппинг',
        food: 'Еда',
        phone: 'Телефон',
        entertainment: 'Развлечения',
        transport: 'Транспорт',
        health: 'Здоровье',
        house: 'Дом',
        utilities: 'ЖКХ',
        clothes: 'Одежда',
        beauty: 'Красота',
        education: 'Образование',
        sports: 'Спорт',
        cafe: 'Кафе',
        gifts: 'Подарки',
        pets: 'Питомцы',
        internet: 'Интернет',
        taxi: 'Такси',
        parking: 'Парковка',
        books: 'Книги',
        medicine: 'Лекарства',
        furniture: 'Мебель',
        repair: 'Ремонт',
        insurance: 'Страховка',
        subscriptions: 'Подписки',
        hobbies: 'Хобби',
        cinema: 'Кино',
        music: 'Музыка',
        travel: 'Путешествия',
        electronics: 'Электроника',
        other_expense: 'Другое',

        // Доходы
        salary: 'Зарплата',
        investments: 'Инвестиции',
        'part-time': 'Подработка',
        rewards: 'Награды',
        rental: 'Аренда',
        business: 'Бизнес',
        dividends: 'Дивиденды',
        freelance: 'Фриланс',
        sales: 'Продажи',
        other_income: 'Другое'
    };
    return names[category] || 'Другое';
}

// Обработчик формы добавления транзакции
document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const transaction = {
        amount: document.getElementById('amount').value,
        date: document.getElementById('date').value,
        note: document.getElementById('note').value,
        category: document.getElementById('category').value,
        type: document.getElementById('type').value
    };

    saveTransaction(transaction);
    
    // Закрываем модальное окно
    document.querySelector('.add-transaction-modal').classList.remove('active');
    // Очищаем форму
    this.reset();
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    clearLocalStorage();
    updateTransactionsList();
    updateSummary();
});

// Функции для работы с отчетами
function reapplyCategories() {
    console.log('Reapplying categories HTML');
    document.querySelector('.reports-modal .category-list').innerHTML = `
        <div class="category-item">
            <div class="category-icon">
                <span class="material-icons">attach_money</span>
            </div>
            <div class="category-info">
                <div class="category-name">Инвестиции</div>
                <div class="category-amount income">11 112</div>
            </div>
        </div>
        <div class="category-item">
            <div class="category-icon">
                <span class="material-icons">attach_money</span>
            </div>
            <div class="category-info">
                <div class="category-name">Одежда</div>
                <div class="category-amount">2 223</div>
            </div>
        </div>
        <div class="category-item">
            <div class="category-icon">
                <span class="material-icons">attach_money</span>
            </div>
            <div class="category-info">
                <div class="category-name">Транспорт</div>
                <div class="category-amount">112</div>
            </div>
        </div>
        <div class="category-item">
            <div class="category-icon">
                <span class="material-icons">attach_money</span>
            </div>
            <div class="category-info">
                <div class="category-name">Дом</div>
                <div class="category-amount">1 123</div>
            </div>
        </div>
    `;
    
    // Инициализируем диаграмму
    initializeChart();
}

function initializeChart() {
    console.log('[initializeChart] Начало создания новой диаграммы');
    
    // Получаем canvas и контекст
    const canvas = document.getElementById('expenseChart');
    if (!canvas) {
        console.error('[initializeChart] Canvas не найден');
        return null;
    }
    
    // Очищаем canvas (если была предыдущая диаграмма)
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Удаляем предыдущую диаграмму, если она есть
    if (window.expenseChart) {
        delete window.expenseChart;
    }
    
    // Принудительно устанавливаем размеры canvas
    canvas.style.width = '90%';
    canvas.style.height = '250px';
    canvas.style.display = 'block';
    
    try {
        // Создаем простую диаграмму с минимальной конфигурацией
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Нет данных'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#333'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%'
            }
        });
    } catch (error) {
        console.error('[initializeChart] Ошибка создания диаграммы:', error);
        return null;
    }
}

function updateCategoryList(categories, total, isExpense) {
    const categoryList = document.querySelector('.reports-modal .category-list');
    if (!categoryList) return;
    
    // Очищаем текущий список
    categoryList.innerHTML = '';
    
    // Сортируем категории по сумме в порядке убывания
    const sortedCategories = [...categories].sort((a, b) => {
        // Если суммы равны, сохраняем порядок
        if (Math.abs(b.amount - a.amount) < 0.01) {
            return 0;
        }
        return b.amount - a.amount;
    });

    // Если нет категорий, показываем сообщение
    if (sortedCategories.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-category-message';
        emptyMessage.textContent = 'Нет данных для отображения';
        emptyMessage.style.color = '#666';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        categoryList.appendChild(emptyMessage);
        return;
    }

    // Создаем элементы для каждой категории
    sortedCategories.forEach(category => {
        // Пропускаем категорию "Другое"
        if (category.name.includes('other_expense') || category.name.includes('other_income')) {
            return;
        }
        
        const categoryItem = document.createElement('div');
        categoryItem.className = 'transaction-item';
        
        // Добавляем класс в зависимости от типа (расход/доход)
        if (isExpense) {
            categoryItem.classList.add('expense');
        } else {
            categoryItem.classList.add('income');
        }
        
        // Создаем содержимое транзакции
        const transactionContent = document.createElement('div');
        transactionContent.className = 'transaction-content';
        
        // Создаем иконку транзакции
        const transactionIcon = document.createElement('div');
        transactionIcon.className = 'transaction-icon';
        
        // Получаем материальный значок для категории
        const iconName = getCategoryIcon(category.name);
        transactionIcon.innerHTML = `<span class="material-icons">${iconName}</span>`;
        
        // Создаем информацию о транзакции
        const transactionInfo = document.createElement('div');
        transactionInfo.className = 'transaction-info';
        
        // Добавляем название категории
        const transactionCategory = document.createElement('div');
        transactionCategory.className = 'transaction-category';
        transactionCategory.textContent = getCategoryName(category.name);
        
        // Добавляем процент от общей суммы как заметку
        const percentage = (category.amount / total * 100).toFixed(2);
        const transactionNote = document.createElement('div');
        transactionNote.className = 'transaction-note';
        transactionNote.textContent = `${percentage}%`;
        
        // Добавляем сумму
        const transactionAmount = document.createElement('div');
        transactionAmount.className = 'transaction-amount';
        transactionAmount.textContent = Math.round(category.amount).toLocaleString('ru-RU');
        
        // Собираем элементы вместе
        transactionInfo.appendChild(transactionCategory);
        transactionInfo.appendChild(transactionNote);
        
        transactionContent.appendChild(transactionIcon);
        transactionContent.appendChild(transactionInfo);
        transactionContent.appendChild(transactionAmount);
        
        categoryItem.appendChild(transactionContent);
        
        categoryList.appendChild(categoryItem);
    });
}

// Функция для получения цвета категории
function getCategoryColor(category, isExpense) {
    // Обновленные цвета для расходов - более разнообразная палитра
    const expenseColors = {
        'shopping': '#FF453A',     // Ярко-красный
        'food': '#FF9500',         // Оранжевый
        'phone': '#00BCD4',        // Голубой
        'entertainment': '#9C27B0', // Фиолетовый
        'transport': '#3F51B5',    // Индиго
        'health': '#00C853',       // Зеленый
        'house': '#795548',        // Коричневый
        'utilities': '#607D8B',    // Сине-серый
        'clothes': '#E91E63',      // Розовый
        'beauty': '#F48FB1',       // Светло-розовый
        'education': '#4527A0',    // Темно-фиолетовый
        'sports': '#1E88E5',       // Синий
        'cafe': '#FFC107',         // Янтарный
        'gifts': '#D81B60',        // Малиновый
        'pets': '#43A047',         // Лесной зеленый
        'internet': '#039BE5',     // Ярко-синий
        'taxi': '#FB8C00',         // Темно-оранжевый
        'parking': '#546E7A',      // Сине-серый темный
        'books': '#6A1B9A',        // Темно-пурпурный
        'medicine': '#2E7D32',     // Темно-зеленый
        'furniture': '#8D6E63',    // Светло-коричневый
        'repair': '#5D4037',       // Темно-коричневый
        'insurance': '#283593',    // Темно-синий
        'subscriptions': '#C2185B', // Темно-розовый
        'hobbies': '#7B1FA2',      // Глубокий пурпурный
        'cinema': '#FF6F00',       // Темно-янтарный
        'music': '#673AB7',        // Фиолетовый
        'travel': '#EF6C00',       // Глубокий оранжевый
        'electronics': '#0277BD',  // Темно-голубой
        'other_expense': '#757575' // Серый
    };
    
    // Полностью обновленная палитра для доходов с яркими контрастными цветами
    const incomeColors = {
        'salary': '#4CAF50',        // Зеленый
        'investments': '#9C27B0',   // Фиолетовый
        'part-time': '#FF9800',     // Оранжевый
        'rewards': '#FFEB3B',       // Желтый
        'rental': '#2196F3',        // Синий
        'business': '#009688',      // Бирюзовый
        'dividends': '#673AB7',     // Темно-фиолетовый
        'freelance': '#F44336',     // Красный
        'sales': '#FF5722',         // Глубокий оранжевый
        'other_income': '#8BC34A'   // Светло-зеленый
    };
    
    // В зависимости от типа транзакции выбираем соответствующий набор цветов
    const colorMap = isExpense ? expenseColors : incomeColors;
    
    // Возвращаем цвет категории, если он есть в наборе, иначе возвращаем цвет по умолчанию
    return colorMap[category] || (isExpense ? '#FF453A' : '#4CAF50');
}

// Функция для обновления навигации по датам
function updateDateNavigation() {
    const dateDisplay = document.querySelector('.reports-modal .date-display');
    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    if (dateDisplay) {
        dateDisplay.textContent = `${months[state.selectedMonth]} ${state.selectedYear}`;
    }
}

// Добавляем функцию для очистки localStorage
function clearLocalStorage() {
    console.log('Подготовка локального хранилища...');
    
    // Проверяем, существуют ли уже данные в localStorage
    const hasTransactions = localStorage.getItem('transactions');
    
    // Если в хранилище нет transactions, инициализируем пустой массив
    if (!hasTransactions) {
        localStorage.setItem('transactions', JSON.stringify([]));
        console.log('Инициализирован пустой массив transactions');
    } else {
        console.log('Найдены существующие transactions, сохраняем');
    }
    
    // Проверяем наличие и инициализируем другие необходимые данные
    if (!localStorage.getItem('plannedTransfers')) {
        localStorage.setItem('plannedTransfers', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('expenseCategoryPositions')) {
        localStorage.setItem('expenseCategoryPositions', JSON.stringify({}));
    }
    
    if (!localStorage.getItem('incomeCategoryPositions')) {
        localStorage.setItem('incomeCategoryPositions', JSON.stringify({}));
    }
    
    // Обновляем локальный state из localStorage
    state.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    state.categoryPositions.expense = JSON.parse(localStorage.getItem('expenseCategoryPositions')) || {};
    state.categoryPositions.income = JSON.parse(localStorage.getItem('incomeCategoryPositions')) || {};
    
    console.log('Локальное хранилище готово');
}

function initializeReports() {
    console.log('[initializeReports] Начало инициализации отчетов');
    
    // Получаем элементы для работы с отчетами
    const reportsButton = document.querySelector('.nav-item[data-page="reports"]');
    const reportsModal = document.querySelector('.reports-modal');
    
    // Получаем переключатель периода
    const periodButtons = reportsModal.querySelectorAll('.period-button');
    
    // Получаем кнопки переключения типа отчета
    const expenseButton = reportsModal.querySelector('.expense-button');
    const incomeButton = reportsModal.querySelector('.income-button');

    // Получаем кнопки навигации ОТЧЕТОВ с новыми классами
    const prevMonthButton = reportsModal.querySelector('.reports-prev-month');
    const nextMonthButton = reportsModal.querySelector('.reports-next-month');

    // Получаем навигационные кнопки для закрытия отчетов
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.dataset.page !== 'reports') {
            item.addEventListener('click', () => {
                console.log('[navItem] Закрытие отчетов при переходе на другую страницу');
                reportsModal.classList.remove('active');
            });
        }
    });

    // Обработчики для кнопок навигации по месяцам в ОТЧЕТАХ
    if (prevMonthButton) {
        prevMonthButton.addEventListener('click', (e) => {
            // Предотвращаем всплытие события
            e.stopPropagation();
            
            if (state.selectedMonth === 0) {
                state.selectedMonth = 11;
                state.selectedYear--;
            } else {
                state.selectedMonth--;
            }
            updateDateNavigation();
            updateReport(false);
        });
    }

    if (nextMonthButton) {
        nextMonthButton.addEventListener('click', (e) => {
            // Предотвращаем всплытие события
            e.stopPropagation();
            
            if (state.selectedMonth === 11) {
                state.selectedMonth = 0;
                state.selectedYear++;
            } else {
                state.selectedMonth++;
            }
            updateDateNavigation();
            updateReport(false);
        });
    }

    // Предварительно загружаем данные
    console.log('[initializeReports] Загрузка данных из localStorage');
    state.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    // Добавляем обработчик для открытия отчетов
    reportsButton.addEventListener('click', () => {
        console.log('[reportsButton] Нажата кнопка отчетов');
        
        // Показываем модальное окно
        reportsModal.classList.add('active');

        // Простая задержка перед обновлением, чтобы DOM успел обновиться
        setTimeout(() => {
            // Обновляем навигацию по дате
            updateDateNavigation();
            
            // Обновляем отчет (это создаст новую диаграмму)
            updateReport(true);
            
            console.log('[reportsButton] Отчет обновлен');
        }, 300);
    });

    // Добавляем обработчик для кнопки "назад" в отчетах, если она есть
    const backButton = reportsModal.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            console.log('[backButton] Закрытие отчетов');
            reportsModal.classList.remove('active');

            // Возвращаемся на главную страницу
            const pages = document.querySelectorAll('.content');
            pages.forEach(page => {
                page.style.display = 'none';
                page.classList.remove('active');
            });

            // Активируем главную страницу
            const mainPage = document.getElementById('main');
            if (mainPage) {
                mainPage.style.display = 'block';
                mainPage.classList.add('active');
            }

            // Активируем кнопку главной страницы
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(nav => nav.classList.remove('active'));
            const mainNavItem = document.querySelector('.nav-item[data-page="main"]');
            if (mainNavItem) {
                mainNavItem.classList.add('active');
            }
        });
    }
    
    // Обработчики для переключения периода
    periodButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('[periodButton] Переключение периода');
            periodButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateReport(false);
        });
    });
    
    // Обработчики для переключения типа отчета
    expenseButton.addEventListener('click', () => {
        console.log('[typeButton] Переключение на расходы');
        expenseButton.classList.add('active');
        incomeButton.classList.remove('active');
        updateReport(false);
    });
    
    incomeButton.addEventListener('click', () => {
        console.log('[typeButton] Переключение на доходы');
        incomeButton.classList.add('active');
        expenseButton.classList.remove('active');
        updateReport(false);
    });
    
    console.log('[initializeReports] Завершение инициализации отчетов');
}

function updateReport(animate = false) {
    console.log('[updateReport] Начало обновления отчета');
    
    const reportsModal = document.querySelector('.reports-modal');
    if (!reportsModal) {
        console.log('[updateReport] Модальное окно отчетов не найдено');
        return;
    }

    // Определяем текущие режимы отчета
    const isExpense = document.querySelector('.reports-modal .expense-button').classList.contains('active');
    const isMonthPeriod = document.querySelector('.reports-modal .period-button.active').textContent === 'Месяц';
    
    console.log(`[updateReport] Режим: ${isExpense ? 'расходы' : 'доходы'}, период: ${isMonthPeriod ? 'месяц' : 'год'}`);
    
    // Загружаем и фильтруем транзакции
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const transactionMonth = transactionDate.getMonth();
        const transactionYear = transactionDate.getFullYear();
        
        const typeMatch = isExpense ? transaction.type === 'expense' : transaction.type === 'income';
        const periodMatch = isMonthPeriod 
            ? transactionMonth === state.selectedMonth && transactionYear === state.selectedYear
            : transactionYear === state.selectedYear;
        
        return typeMatch && periodMatch;
    });
    
    console.log(`[updateReport] Отфильтровано транзакций: ${filteredTransactions.length}`);
    
    // Группируем транзакции по категориям
    const categories = {};
    filteredTransactions.forEach(transaction => {
        if (!categories[transaction.category]) {
            categories[transaction.category] = 0;
        }
        categories[transaction.category] += parseFloat(transaction.amount);
    });
    
    // Преобразуем в массив и сортируем
    const categoriesArray = Object.entries(categories)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);
    
    console.log(`[updateReport] Количество категорий: ${categoriesArray.length}`);
    
    // Пересоздаем canvas для диаграммы
    recreateChartCanvas();
    
    // Создаем новую диаграмму вместо обновления существующей
    try {
        // Создаем данные для диаграммы
        const chartLabels = categoriesArray.map(c => c.name);
        const chartData = categoriesArray.map(c => c.amount);
        const chartColors = categoriesArray.map(c => getCategoryColor(c.name, isExpense));
        
        // Если нет данных, показываем заглушку
        if (chartData.length === 0) {
            chartLabels.push('Нет данных');
            chartData.push(1);
            chartColors.push('#333');
        }
        
        // Создаем новую диаграмму на чистом canvas
        const canvas = document.getElementById('expenseChart');
        if (canvas) {
            // Принудительно задаем размеры canvas
            canvas.style.width = '90%';
            canvas.style.height = '250px';
            canvas.style.display = 'block';
            
            try {
                const ctx = canvas.getContext('2d');
                
                window.expenseChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: chartLabels,
                        datasets: [{
                            data: chartData,
                            backgroundColor: chartColors,
                            borderWidth: 2,
                            borderColor: '#000000',
                            hoverBorderWidth: 3,
                            hoverBorderColor: '#FFFFFF',
                            hoverOffset: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '65%',
                        rotation: 0.5 * Math.PI, // Поворачиваем диаграмму для лучшего визуального эффекта
                        plugins: {
                            tooltip: {
                                enabled: true,
                                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                                titleColor: '#FFFFFF',
                                bodyColor: '#FFFFFF',
                                titleFont: {
                                    size: 16,
                                    weight: 'bold',
                                    family: 'system-ui'
                                },
                                bodyFont: {
                                    size: 14,
                                    family: 'system-ui'
                                },
                                padding: 16,
                                displayColors: true,
                                boxWidth: 12,
                                boxHeight: 12,
                                usePointStyle: true,
                                callbacks: {
                                    // Изменение заголовка подсказки на русском
                                    title: function(items) {
                                        if (!items.length) return '';
                                        const category = items[0].label;
                                        return getCategoryName(category);
                                    },
                                    // Изменение текста подсказки на русском
                                    label: function(context) {
                                        const value = context.raw;
                                        const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                                        const percentage = ((value / total) * 100).toFixed(1);
                                        return `${percentage}% (${Math.round(value).toLocaleString('ru-RU')} ₽)`;
                                    },
                                    // Локализация статистики
                                    afterLabel: function(context) {
                                        if (chartData.length <= 1) return '';
                                        const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                                        return `Из общей суммы: ${Math.round(total).toLocaleString('ru-RU')} ₽`;
                                    }
                                }
                            },
                            legend: {
                                display: false
                            }
                        }
                    },
                    animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 800
                    }
                });
                
                console.log('[updateReport] Новая диаграмма успешно создана');
            } catch (error) {
                console.error('[updateReport] Ошибка создания диаграммы:', error);
            }
        }
    } catch (error) {
        console.error('[updateReport] Ошибка при работе с диаграммой:', error);
    }
    
    // Обновляем список категорий
    const total = categoriesArray.reduce((sum, category) => sum + category.amount, 0);
    updateCategoryList(categoriesArray, total, isExpense);
    
    // Обновляем общую сумму
    const totalElement = document.querySelector('.reports-modal .chart-total');
    if (totalElement) {
        totalElement.textContent = Math.round(total).toLocaleString('ru-RU');
    }

    // Обновляем отображение текущего месяца и навигацию
    updateDateNavigation();
    
    console.log('[updateReport] Завершение обновления отчета');
}

// Полное удаление диаграммы из DOM для принудительного пересоздания
function recreateChartCanvas() {
    console.log('[recreateChartCanvas] Пересоздание canvas элемента для диаграммы');
    
    // Находим контейнер и текущий canvas
    const container = document.querySelector('.chart-container');
    const oldCanvas = document.getElementById('expenseChart');
    
    if (!container || !oldCanvas) {
        console.error('[recreateChartCanvas] Не найден контейнер или canvas');
        return false;
    }
    
    // Получаем текущий общий элемент (число в центре)
    const totalElement = document.querySelector('.chart-total');
    
    // Удаляем старый canvas
    oldCanvas.remove();
    
    // Удаляем глобальную диаграмму, если она существует
    if (window.expenseChart) {
        delete window.expenseChart;
    }
    
    // Создаем новый canvas
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'expenseChart';
    
    // Добавляем новый canvas перед элементом с суммой
    container.insertBefore(newCanvas, totalElement);
    
    console.log('[recreateChartCanvas] Canvas успешно пересоздан');
    return true;
}

// Инициализация настроек приложения
function initializeSettings() {
    console.log('[DEBUG] Инициализация настроек приложения');
    
    // Загружаем настройки из localStorage
    loadSettingsFromStorage();
    
    // Настраиваем обработчики для элементов настроек
    setupSettingsHandlers();
    
    // Обновляем отображение настроек в интерфейсе
    updateCurrencyDisplay();
    updateLanguageDisplay();
    
    // Настраиваем обработчик переключения звука
    const soundToggle = document.querySelector('.settings-item[data-setting="sound"] input[type="checkbox"]');
    if (soundToggle) {
        console.log('[DEBUG] Найден переключатель звука');
        soundToggle.checked = settingsState.soundEnabled;
        soundToggle.addEventListener('change', toggleSound);
    } else {
        console.warn('[DEBUG] Переключатель звука не найден');
    }
    
    // Инициализируем списки валют и языков
    setupCurrencyHandlers();
    setupLanguageHandlers();
    
    // Инициализируем напоминания
    setupRemindersHandlers();
    initializeReminders();
    
    // Инициализируем обработчики для данных и профиля
    setupDataHandlers();
    setupShareHandlers();
    setupProfileHandlers();
    
    console.log('[DEBUG] Настройки инициализированы');
}

// Загрузка настроек из localStorage
function loadSettingsFromStorage() {
    console.log('[DEBUG] Загрузка настроек из localStorage');
    
    const savedSettings = localStorage.getItem('financeTrackerSettings');
    if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        
        // Обновление состояния настроек из сохраненных данных
        Object.assign(settingsState, parsedSettings);
        
        console.log('[DEBUG] Загружены настройки:', settingsState);
    } else {
        console.log('[DEBUG] Сохраненные настройки не найдены, используются настройки по умолчанию');
        // Сохраняем настройки по умолчанию
        saveSettingsToStorage();
    }
}

// Сохранение настроек в localStorage
function saveSettingsToStorage() {
    console.log('[DEBUG] Сохранение настроек в localStorage');
    localStorage.setItem('financeTrackerSettings', JSON.stringify(settingsState));
}

// Настройка обработчиков событий для элементов настроек
function setupSettingsHandlers() {
    console.log('[DEBUG] Настройка обработчиков событий для настроек');
    
    const settingsItems = document.querySelectorAll('.settings-item');
    console.log(`[DEBUG] Найдено ${settingsItems.length} элементов настроек`);
    
    settingsItems.forEach(item => {
        item.addEventListener('click', () => {
            const settingType = item.getAttribute('data-setting');
            console.log(`[DEBUG] Клик по настройке: ${settingType}`);
            
            if (settingType === 'sound') {
                // Для звука переключаем состояние переключателя
                toggleSound();
            } else {
                // Для других настроек открываем соответствующее модальное окно
                openSettingsModal(settingType);
            }
        });
    });
    
    // Настройка обработчиков для кнопок возврата в модальных окнах
    const backButtons = document.querySelectorAll('.settings-back-button');
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.settings-modal');
            closeSettingsModal(modal);
        });
    });
    
    // Инициализация обработчиков для различных настроек
    setupCurrencyHandlers();
    setupLanguageHandlers();
    setupRemindersHandlers();
    setupDataHandlers();
    setupShareHandlers();
    
    console.log('[DEBUG] Настройка обработчиков событий для настроек завершена');
}

// Установка обработчиков для валют
function setupCurrencyHandlers() {
    console.log('[DEBUG] Настройка обработчиков для валют');
    
    const currencyItems = document.querySelectorAll('.currency-item');
    currencyItems.forEach(item => {
        item.addEventListener('click', () => {
            const currencyCode = item.getAttribute('data-currency');
            const currencySymbol = item.getAttribute('data-symbol');
            
            console.log(`[DEBUG] Выбрана валюта: ${currencyCode} (${currencySymbol})`);
            
            // Обновляем активную валюту в интерфейсе
            document.querySelectorAll('.currency-item').forEach(i => {
                i.classList.remove('active');
            });
            item.classList.add('active');
            
            // Обновляем состояние настроек
            settingsState.currency = currencyCode;
            settingsState.currencySymbol = currencySymbol;
            
            // Сохраняем настройки
            saveSettingsToStorage();
            
            // Обновляем отображение валюты в интерфейсе
            updateCurrencyDisplay();
            
            // Закрываем модальное окно
            setTimeout(() => {
                closeSettingsModal(document.getElementById('currency-modal'));
            }, 300);
        });
    });
}

// Установка обработчиков для языков
function setupLanguageHandlers() {
    console.log('[DEBUG] Настройка обработчиков для языков');
    
    const languageItems = document.querySelectorAll('.language-item');
    languageItems.forEach(item => {
        item.addEventListener('click', () => {
            const langCode = item.getAttribute('data-language');
            const langName = item.querySelector('.language-item-name').textContent;
            
            console.log(`[DEBUG] Выбран язык: ${langCode} (${langName})`);
            
            // Обновляем активный язык в интерфейсе
            document.querySelectorAll('.language-item').forEach(i => {
                i.classList.remove('active');
            });
            item.classList.add('active');
            
            // Обновляем состояние настроек
            settingsState.language = langCode;
            
            // Сохраняем настройки
            saveSettingsToStorage();
            
            // Обновляем язык интерфейса
            updateLanguageDisplay();
            
            // Закрываем модальное окно
            setTimeout(() => {
                closeSettingsModal(document.getElementById('language-modal'));
            }, 300);
        });
    });
}

// Установка обработчиков для напоминаний
function setupRemindersHandlers() {
    console.log('[DEBUG] Настройка обработчиков для напоминаний');
    
    // Обработчик для кнопки добавления напоминания
    const addReminderButton = document.querySelector('.add-reminder-button');
    if (addReminderButton) {
        addReminderButton.addEventListener('click', () => {
            console.log('[DEBUG] Нажата кнопка добавления напоминания');
            openReminderEditModal();
        });
    }
    
    // Обработчик для кнопки сохранения напоминания
    const saveReminderButton = document.querySelector('.save-reminder-button');
    if (saveReminderButton) {
        saveReminderButton.addEventListener('click', () => {
            console.log('[DEBUG] Нажата кнопка сохранения напоминания');
            saveReminder();
        });
    }
    
    // Обработчики для кнопок возврата
    document.querySelectorAll('.settings-back-button').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.settings-modal');
            if (modal) {
                closeSettingsModal(modal);
            }
        });
    });
}

// Обновление языка в интерфейсе
function updateLanguageDisplay() {
    console.log('[DEBUG] Обновление языка в интерфейсе');
    
    // Обновляем подзаголовок в настройках
    const languageSubtitle = document.querySelector('[data-setting="language"] .settings-item-subtitle');
    if (languageSubtitle) {
        const selectedLanguage = document.querySelector(`.language-item[data-language="${settingsState.language}"] .language-item-name`);
        if (selectedLanguage) {
            languageSubtitle.textContent = selectedLanguage.textContent;
            console.log(`[DEBUG] Обновлен подзаголовок языка: ${languageSubtitle.textContent}`);
        }
    } else {
        console.warn('[DEBUG] Не найден подзаголовок для языка');
    }
    
    // В реальном приложении здесь был бы код для загрузки локализованных строк
    // и обновления всех текстовых элементов интерфейса
}

// Обновление отображения валюты в интерфейсе
function updateCurrencyDisplay() {
    console.log('[DEBUG] Обновление отображения валюты в интерфейсе');
    
    // Обновляем подзаголовок в настройках
    const currencySubtitle = document.querySelector('[data-setting="currency"] .settings-item-subtitle');
    if (currencySubtitle) {
        currencySubtitle.textContent = `${settingsState.currency} (${settingsState.currencySymbol})`;
        console.log(`[DEBUG] Обновлен подзаголовок валюты: ${currencySubtitle.textContent}`);
    } else {
        console.warn('[DEBUG] Не найден подзаголовок для валюты');
    }
    
    // Обновляем отображение во всех суммах транзакций
    updateTransactionsDisplay();
    
    // Обновляем отчеты, если они отображаются
    const reportsPage = document.getElementById('reports');
    if (reportsPage && reportsPage.style.display !== 'none') {
        updateReport();
    }
}

// Инициализация напоминаний
function initializeReminders() {
    console.log('[DEBUG] Инициализация напоминаний');
    
    // Подсчитываем количество активных напоминаний
    const activeReminders = settingsState.reminders.filter(r => r.enabled !== false).length;
    
    // Обновляем подзаголовок в настройках
    const remindersSubtitle = document.querySelector('[data-setting="reminders"] .settings-item-subtitle');
    if (remindersSubtitle) {
        remindersSubtitle.textContent = `Активно: ${activeReminders}`;
        console.log(`[DEBUG] Обновлен подзаголовок напоминаний: ${remindersSubtitle.textContent}`);
    } else {
        console.warn('[DEBUG] Не найден подзаголовок для напоминаний');
    }
    
    // В реальном приложении здесь был бы код для регистрации уведомлений
    // например, использование Notification API или службы push-уведомлений
    console.log('[DEBUG] Напоминания инициализированы:', settingsState.reminders);
}

// Создание элемента напоминания для интерфейса
function createReminderItem(reminder) {
    console.log(`[DEBUG] Создание элемента напоминания: ${reminder.title}`);
    
    const reminderItem = document.createElement('div');
    reminderItem.className = `reminder-item ${reminder.enabled === false ? 'disabled' : ''}`;
    reminderItem.setAttribute('data-reminder-id', reminder.id);
    
    // Форматируем информацию о времени и повторе
    let timeInfo = reminder.time || '09:00';
    
    // Добавляем информацию о дате для одноразовых напоминаний
    if (reminder.repeat === 'none' && reminder.date) {
        const date = new Date(reminder.date);
        // Форматируем дату как дд.мм.гггг
        const formattedDate = date.toLocaleDateString('ru-RU');
        timeInfo += ` (${formattedDate})`;
    } else if (reminder.repeat === 'daily') {
        timeInfo += ' (ежедневно)';
    } else if (reminder.repeat === 'weekly') {
        timeInfo += ' (еженедельно)';
    } else if (reminder.repeat === 'monthly') {
        timeInfo += ' (ежемесячно)';
    }
    
    reminderItem.innerHTML = `
        <div class="reminder-item-content">
            <div class="reminder-item-info">
                <div class="reminder-item-title ${reminder.enabled === false ? 'text-muted' : ''}">${reminder.title || 'Без названия'}</div>
                <div class="reminder-item-time ${reminder.enabled === false ? 'text-muted' : ''}">${timeInfo}</div>
            </div>
            <div class="reminder-item-actions">
                <span class="material-icons circle-icon ${reminder.enabled !== false ? 'on' : ''}" title="${reminder.enabled !== false ? 'Выключить напоминание' : 'Включить напоминание'}"></span>
                <button class="reminder-edit-button" title="Редактировать напоминание">
                    <span class="material-icons">edit</span>
                </button>
                <button class="reminder-delete-button" title="Удалить напоминание">
                    <span class="material-icons">delete</span>
                </button>
            </div>
        </div>
    `;
    
    // Добавляем обработчик для всего элемента напоминания
    reminderItem.addEventListener('click', function(e) {
        // Сначала удаляем класс active у всех напоминаний
        document.querySelectorAll('.reminder-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Добавляем класс active текущему элементу
        this.classList.add('active');
        
        // Предотвращаем всплытие события, чтобы клик по дочерним элементам не вызывал повторных событий
        e.stopPropagation();
    });
    
    // Снимаем выделение при клике в любом другом месте
    document.addEventListener('click', function(e) {
        if (!reminderItem.contains(e.target)) {
            reminderItem.classList.remove('active');
        }
    });
    
    // Добавляем обработчик для переключателя
    const toggleButton = reminderItem.querySelector('.circle-icon');
    if (toggleButton) {
        toggleButton.addEventListener('click', function(e) {
            // Предотвращаем всплытие события, чтобы не сработал клик по всему элементу
            e.stopPropagation();
            
            // Находим напоминание и обновляем его состояние
            const reminderId = reminderItem.getAttribute('data-reminder-id');
            const reminderIndex = settingsState.reminders.findIndex(r => r.id === reminderId);
            
            if (reminderIndex !== -1) {
                // Инвертируем текущее состояние
                const newState = !settingsState.reminders[reminderIndex].enabled;
                
                // Обновляем состояние напоминания
                settingsState.reminders[reminderIndex].enabled = newState;
                
                // Обновляем визуальный стиль
                if (newState) {
                    reminderItem.classList.remove('disabled');
                    reminderItem.querySelector('.reminder-item-title').classList.remove('text-muted');
                    reminderItem.querySelector('.reminder-item-time').classList.remove('text-muted');
                    this.classList.add('on');
                    this.setAttribute('title', 'Выключить напоминание');
                    
                    // Показываем всплывающее уведомление о включении
                    showNotification('Напоминание включено');
                } else {
                    reminderItem.classList.add('disabled');
                    reminderItem.querySelector('.reminder-item-title').classList.add('text-muted');
                    reminderItem.querySelector('.reminder-item-time').classList.add('text-muted');
                    this.classList.remove('on');
                    this.setAttribute('title', 'Включить напоминание');
                    
                    // Показываем всплывающее уведомление о выключении
                    showNotification('Напоминание выключено');
                }
                
                // Сохраняем настройки
                saveSettingsToStorage();
                
                // Обновляем счетчик в основном меню настроек
                initializeReminders();
                
                console.log(`[DEBUG] Изменено состояние напоминания ${reminderId}: ${newState ? 'включено' : 'выключено'}`);
            }
        });
    }
    
    // Добавляем обработчик для кнопки редактирования
    reminderItem.querySelector('.reminder-edit-button').addEventListener('click', (e) => {
        e.stopPropagation();
        openReminderEditModal(reminder);
    });
    
    // Добавляем обработчик для кнопки удаления
    reminderItem.querySelector('.reminder-delete-button').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteReminder(reminder.id);
    });
    
    return reminderItem;
}

// Открытие модального окна редактирования напоминания
function openReminderEditModal(reminder = null) {
    console.log(`[DEBUG] Открытие модального окна редактирования напоминания: ${reminder ? reminder.id : 'новое'}`);
    
    const modal = document.getElementById('reminder-edit-modal');
    if (modal) {
        try {
            // Заполняем форму данными напоминания или значениями по умолчанию
            const titleInput = modal.querySelector('#reminder-title');
            const timeInput = modal.querySelector('#reminder-time');
            const dateInput = modal.querySelector('#reminder-date');
            const repeatSelect = modal.querySelector('#reminder-repeat');
            const messageInput = modal.querySelector('#reminder-message');
            const enabledToggle = modal.querySelector('#reminder-enabled');
            
            if (!titleInput || !timeInput || !dateInput || !repeatSelect || !messageInput || !enabledToggle) {
                console.error('[DEBUG] Не все поля формы найдены в модальном окне редактирования');
                return;
            }
            
            // Устанавливаем сегодняшнюю дату для нового напоминания
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0]; // Формат YYYY-MM-DD
            
            if (reminder) {
                titleInput.value = reminder.title || '';
                timeInput.value = reminder.time || '09:00';
                
                // Устанавливаем дату, если она есть, иначе устанавливаем сегодняшнюю дату
                dateInput.value = reminder.date ? reminder.date : formattedDate;
                
                repeatSelect.value = reminder.repeat || 'daily';
                messageInput.value = reminder.message || '';
                
                // Устанавливаем состояние переключателя
                enabledToggle.checked = reminder.enabled !== false;
                
                // Показываем/скрываем выбор даты в зависимости от типа повтора
                updateDateVisibility(repeatSelect.value);
                
                // Устанавливаем атрибут с идентификатором редактируемого напоминания
                modal.setAttribute('data-edit-reminder-id', reminder.id);
            } else {
                // Значения по умолчанию для нового напоминания
                titleInput.value = 'Новое напоминание';
                timeInput.value = '09:00';
                dateInput.value = formattedDate;
                repeatSelect.value = 'daily';
                messageInput.value = 'Не забудьте внести свои финансы';
                enabledToggle.checked = true;
                
                // Показываем/скрываем выбор даты в зависимости от типа повтора
                updateDateVisibility('daily');
                
                // Удаляем атрибут, если он был установлен ранее
                modal.removeAttribute('data-edit-reminder-id');
            }
            
            // Добавляем обработчик изменения типа повтора
            repeatSelect.removeEventListener('change', updateDateVisibilityHandler);
            repeatSelect.addEventListener('change', updateDateVisibilityHandler);
            
            // Добавляем обработчики для очистки полей при фокусе
            setupTextInputClearOnFocus(titleInput);
            setupTextInputClearOnFocus(messageInput);
            
            // Отображаем модальное окно
            modal.classList.add('active');
        } catch (error) {
            console.error('[DEBUG] Ошибка при открытии модального окна редактирования:', error);
        }
    } else {
        console.error('[DEBUG] Модальное окно редактирования напоминания не найдено');
    }
}

// Функция для обновления видимости поля даты в зависимости от типа повтора
function updateDateVisibility(repeatType) {
    const dateFieldContainer = document.querySelector('#reminder-edit-modal .form-group:nth-child(3)');
    
    if (dateFieldContainer) {
        if (repeatType === 'none') {
            // Для напоминания без повтора показываем дату
            dateFieldContainer.style.display = 'block';
        } else {
            // Для повторяющихся напоминаний скрываем дату
            dateFieldContainer.style.display = 'none';
        }
    }
}

// Функция-обработчик для изменения видимости поля даты
function updateDateVisibilityHandler() {
    updateDateVisibility(this.value);
}

// Функция для установки обработчика очистки поля при первом клике
function setupTextInputClearOnFocus(inputElement) {
    // Сохраняем исходное значение поля
    const originalValue = inputElement.value;
    let wasClicked = false;
    
    // Удаляем предыдущие обработчики, если они были
    inputElement.removeEventListener('focus', clearOnFirstFocus);
    
    // Функция для очистки поля при первом клике
    function clearOnFirstFocus() {
        if (!wasClicked) {
            inputElement.value = '';
            wasClicked = true;
            
            // После очистки удаляем обработчик, чтобы пользователь мог свободно редактировать
            inputElement.removeEventListener('focus', clearOnFirstFocus);
        }
    }
    
    // Устанавливаем обработчик очистки при фокусе
    inputElement.addEventListener('focus', clearOnFirstFocus);
}

// Сохранение напоминания - исправленная версия для предотвращения дублирования
function saveReminder() {
    console.log('[DEBUG] Сохранение напоминания');
    
    // Предотвращаем повторное выполнение функции, если она уже запущена
    if (saveReminder.isRunning) {
        console.log('[DEBUG] Предотвращено повторное сохранение напоминания');
        return;
    }
    
    saveReminder.isRunning = true;
    
    const modal = document.getElementById('reminder-edit-modal');
    if (modal) {
        try {
            // Получаем данные из формы
            const titleInput = modal.querySelector('#reminder-title');
            const timeInput = modal.querySelector('#reminder-time');
            const dateInput = modal.querySelector('#reminder-date');
            const repeatSelect = modal.querySelector('#reminder-repeat');
            const messageInput = modal.querySelector('#reminder-message');
            const enabledToggle = modal.querySelector('#reminder-enabled');
            
            // Проверяем наличие всех необходимых полей
            if (!titleInput || !timeInput || !dateInput || !repeatSelect || !messageInput || !enabledToggle) {
                console.error('[DEBUG] Не все поля формы найдены при сохранении напоминания');
                alert('Ошибка: не все поля формы найдены');
                saveReminder.isRunning = false;
                return;
            }
            
            // Проверяем валидность входных данных
            if (!titleInput.value.trim()) {
                alert('Пожалуйста, введите название напоминания');
                saveReminder.isRunning = false;
                return;
            }
            
            // Получаем идентификатор редактируемого напоминания, если он есть
            const editReminderId = modal.getAttribute('data-edit-reminder-id');
            
            // Создаем объект напоминания
            const reminderData = {
                id: editReminderId || 'reminder-' + Date.now(),
                title: titleInput.value.trim(),
                time: timeInput.value,
                repeat: repeatSelect.value,
                message: messageInput.value.trim(),
                enabled: enabledToggle.checked
            };
            
            // Добавляем дату только для напоминаний без повтора
            if (repeatSelect.value === 'none') {
                reminderData.date = dateInput.value;
            }
            
            console.log('[DEBUG] Сохраняемые данные напоминания:', reminderData);
            
            // Если это редактирование существующего напоминания
            if (editReminderId) {
                // Находим индекс напоминания в массиве
                const reminderIndex = settingsState.reminders.findIndex(r => r.id === editReminderId);
                
                if (reminderIndex !== -1) {
                    // Обновляем данные напоминания
                    settingsState.reminders[reminderIndex] = reminderData;
                    console.log('[DEBUG] Обновлено существующее напоминание с индексом:', reminderIndex);
                }
            } else {
                // Добавляем новое напоминание
                settingsState.reminders.push(reminderData);
                console.log('[DEBUG] Добавлено новое напоминание. Всего напоминаний:', settingsState.reminders.length);
            }
            
            // Сохраняем настройки
            saveSettingsToStorage();
            
            // Обновляем отображение напоминаний в модальном окне
            updateRemindersModal();
            
            // Обновляем счетчик в основном меню настроек
            initializeReminders();
            
            // Закрываем модальное окно редактирования
            closeSettingsModal(modal);
            
            // Показываем уведомление
            showNotification('Напоминание сохранено');
        } catch (error) {
            console.error('[DEBUG] Ошибка при сохранении напоминания:', error);
            alert('Произошла ошибка при сохранении напоминания');
        } finally {
            saveReminder.isRunning = false;
        }
    } else {
        console.error('[DEBUG] Модальное окно для сохранения напоминания не найдено');
        saveReminder.isRunning = false;
    }
}

// Устанавливаем начальное значение флага
saveReminder.isRunning = false;

// Удаление напоминания
function deleteReminder(reminderId) {
    console.log(`[DEBUG] Удаление напоминания: ${reminderId}`);
    
    if (confirm('Вы уверены, что хотите удалить это напоминание?')) {
        // Находим индекс напоминания в массиве
        const reminderIndex = settingsState.reminders.findIndex(r => r.id === reminderId);
        
        if (reminderIndex !== -1) {
            // Удаляем напоминание из массива
            settingsState.reminders.splice(reminderIndex, 1);
            console.log(`[DEBUG] Напоминание удалено. Индекс: ${reminderIndex}, осталось: ${settingsState.reminders.length}`);
            
            // Сохраняем настройки
            saveSettingsToStorage();
            
            // Обновляем отображение напоминаний
            updateRemindersModal();
            
            // Обновляем счетчик в основном меню настроек
            initializeReminders();
            
            // Показываем уведомление
            showNotification('Напоминание удалено');
            
            // Открываем окно напоминаний, если мы находимся в окне редактирования
            const reminderEditModal = document.getElementById('reminder-edit-modal');
            if (reminderEditModal && reminderEditModal.classList.contains('active')) {
                // Закрываем окно редактирования
                closeSettingsModal(reminderEditModal);
                
                // Открываем основное окно напоминаний
                setTimeout(() => {
                    openSettingsModal('reminders');
                }, 100);
            }
        } else {
            console.error(`[DEBUG] Напоминание с ID ${reminderId} не найдено`);
        }
    }
}

// Функция для открытия модального окна настроек
function openSettingsModal(settingType) {
    console.log(`[DEBUG] Открытие модального окна настроек: ${settingType}`);
    
    // Находим соответствующее модальное окно
    const modalId = `${settingType}-modal`;
    const modal = document.getElementById(modalId);
    
    if (modal) {
        console.log(`[DEBUG] Найдено модальное окно: ${modalId}`);
        
        // Закрываем все другие модальные окна настроек
        document.querySelectorAll('.settings-modal.active').forEach(m => {
            if (m !== modal) {
                m.classList.remove('active');
            }
        });
        
        // Открываем выбранное модальное окно
        modal.classList.add('active');
        
        // Дополнительные действия в зависимости от типа настройки
        if (settingType === 'currency') {
            // Выделяем текущую валюту
            const currencyItems = modal.querySelectorAll('.currency-item');
            currencyItems.forEach(item => {
                const itemCurrency = item.getAttribute('data-currency');
                if (itemCurrency === settingsState.currency) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        } else if (settingType === 'language') {
            // Выделяем текущий язык
            const languageItems = modal.querySelectorAll('.language-item');
            languageItems.forEach(item => {
                const itemLanguage = item.getAttribute('data-language');
                if (itemLanguage === settingsState.language) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        } else if (settingType === 'reminders') {
            // Обновляем список напоминаний
            updateRemindersModal();
            
            // Устанавливаем состояние переключателя
            const toggleInput = modal.querySelector('.reminders-toggle-container .switch input');
            if (toggleInput) {
                toggleInput.checked = settingsState.remindersEnabled;
            }
        }
    } else {
        console.error(`[DEBUG] Модальное окно не найдено: ${modalId}`);
    }
}

// Функция для закрытия модального окна настроек
function closeSettingsModal(modal) {
    console.log('[DEBUG] Закрытие модального окна настроек');
    
    if (modal) {
        modal.classList.remove('active');
    } else {
        // Если модальное окно не указано, закрываем все модальные окна настроек
        document.querySelectorAll('.settings-modal.active').forEach(m => {
            m.classList.remove('active');
        });
    }
}

// Функция для переключения звука
function toggleSound() {
    console.log('[DEBUG] Переключение звука: было =', settingsState.soundEnabled);
    
    // Инвертируем текущее состояние
    settingsState.soundEnabled = !settingsState.soundEnabled;
    
    // Обновляем переключатель в интерфейсе
    const soundToggle = document.querySelector('.settings-item[data-setting="sound"] input[type="checkbox"]');
    if (soundToggle) {
        soundToggle.checked = settingsState.soundEnabled;
    }
    
    // Обновляем подзаголовок настройки
    const soundSubtitle = document.querySelector('.settings-item[data-setting="sound"] .settings-item-subtitle');
    if (soundSubtitle) {
        soundSubtitle.textContent = settingsState.soundEnabled ? 'Включить звуковые эффекты' : 'Выключить звуковые эффекты';
    }
    
    // Если звук включен, воспроизводим тестовый звук
    if (settingsState.soundEnabled) {
        playClickSound();
    }
    
    // Сохраняем настройки
    saveSettingsToStorage();
    
    console.log('[DEBUG] Новое состояние звука =', settingsState.soundEnabled);
}

// Установка обработчиков для импорта/экспорта данных
function setupDataHandlers() {
    console.log('[DEBUG] Настройка обработчиков для данных');
    
    // Обработчик для кнопки импорта
    const importButton = document.querySelector('.import-button');
    if (importButton) {
        importButton.addEventListener('click', () => {
            console.log('[DEBUG] Импорт данных');
            
            // Создаем невидимый элемент ввода файла
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.style.display = 'none';
            
            // Добавляем обработчик выбора файла
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const importedData = JSON.parse(event.target.result);
                            
                            // Проверяем валидность данных
                            if (importedData.transactions && Array.isArray(importedData.transactions)) {
                                // Сохраняем импортированные данные
                                localStorage.setItem('transactions', JSON.stringify(importedData.transactions));
                                
                                // Обновляем отображение транзакций
                                state.transactions = importedData.transactions;
                                updateTransactionsList();
                                
                                // Обновляем сводку
                                updateSummary(state.transactions);
                                
                                // Если в импортированных данных есть настройки, обновляем их
                                if (importedData.settings) {
                                    Object.assign(settingsState, importedData.settings);
                                    saveSettingsToStorage();
                                    updateCurrencyDisplay();
                                    updateLanguageDisplay();
                                }
                                
                                alert('Данные успешно импортированы');
                            } else {
                                alert('Некорректный формат файла');
                            }
                        } catch (error) {
                            console.error('[DEBUG] Ошибка импорта:', error);
                            alert('Ошибка при импорте данных');
                        }
                    };
                    reader.readAsText(file);
                }
            });
            
            // Имитируем клик по элементу ввода файла
            document.body.appendChild(fileInput);
            fileInput.click();
            
            // Удаляем элемент после выбора файла
            fileInput.addEventListener('blur', () => {
                document.body.removeChild(fileInput);
            });
        });
    }
    
    // Обработчик для кнопки экспорта
    const exportButton = document.querySelector('.export-button');
    if (exportButton) {
        exportButton.addEventListener('click', () => {
            console.log('[DEBUG] Экспорт данных');
            
            // Получаем данные для экспорта
            const exportData = {
                transactions: state.transactions || [],
                settings: settingsState
            };
            
            // Подготавливаем данные для загрузки
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            
            // Создаем ссылку для скачивания
            const dateStr = new Date().toISOString().slice(0, 10);
            const exportFileDefaultName = `finance_tracker_backup_${dateStr}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.style.display = 'none';
            
            // Добавляем ссылку в DOM, имитируем клик и удаляем
            document.body.appendChild(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);
        });
    }
}

// Установка обработчиков для функции поделиться
function setupShareHandlers() {
    console.log('[DEBUG] Настройка обработчиков для функции поделиться');
    
    // Обработчик для кнопки копирования ссылки
    const copyLinkButton = document.querySelector('.copy-link-button');
    const linkInput = document.querySelector('.share-link input');
    
    if (copyLinkButton && linkInput) {
        copyLinkButton.addEventListener('click', () => {
            console.log('[DEBUG] Копирование ссылки');
            
            // Выделяем текст в поле ввода
            linkInput.select();
            linkInput.setSelectionRange(0, 99999); // Для мобильных устройств
            
            // Копируем в буфер обмена
            try {
                document.execCommand('copy');
                alert('Ссылка скопирована в буфер обмена');
            } catch (err) {
                console.error('[DEBUG] Ошибка копирования:', err);
                alert('Не удалось скопировать ссылку');
            }
        });
    }
    
    // Обработчики для кнопок соцсетей
    const shareButtons = document.querySelectorAll('.share-button');
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const network = button.classList[1]; // telegram, whatsapp, vk
            const appUrl = linkInput ? linkInput.value : 'https://example.com/finance-tracker';
            const shareText = 'Попробуйте этот удобный трекер финансов!';
            
            let shareUrl = '';
            
            switch (network) {
                case 'telegram':
                    shareUrl = `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + appUrl)}`;
                    break;
                case 'vk':
                    shareUrl = `https://vk.com/share.php?url=${encodeURIComponent(appUrl)}&title=${encodeURIComponent(shareText)}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank');
            }
        });
    });
}

// Обновление отображения текущего языка
function updateLanguageDisplay() {
    console.log('[DEBUG] Обновление отображения языка');
    
    // Обновляем отображение текущего языка в настройках
    const languageSubtitle = document.querySelector('.settings-item[data-setting="language"] .settings-item-subtitle');
    
    if (languageSubtitle) {
        if (settingsState.language === 'ru') {
            languageSubtitle.textContent = 'Русский';
        } else if (settingsState.language === 'en') {
            languageSubtitle.textContent = 'English';
        }
    }
}

// Функция для инициализации Google Sign-In
function initializeGoogleSignIn() {
    console.log('[DEBUG] Инициализация Google Sign-In');
    
    // Проверяем, работаем ли мы на GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    console.log('[DEBUG] Работа на GitHub Pages:', isGitHubPages);
    
    // Используем разные client_id для разных сред
    let clientId, originUrl;
    
    if (isGitHubPages) {
        // Для GitHub Pages - используем правильный client_id, полученный через Google Cloud Console
        // ОБЯЗАТЕЛЬНО нужно добавить https://sladostivk.github.io в Authorized JavaScript origins
        clientId = '40740878192-abc123def456.apps.googleusercontent.com'; // ЗАМЕНИТЕ НА ВАШ РЕАЛЬНЫЙ client_id
        originUrl = 'https://sladostivk.github.io';
    } else {
        // Для локальной разработки
        clientId = '40740878192-abc123def456.apps.googleusercontent.com'; // ЗАМЕНИТЕ НА ВАШ РЕАЛЬНЫЙ client_id
        originUrl = window.location.origin;
    }
    
    try {
        // Создаем кнопку входа с Google
        google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            // Настройки оптимизированные для текущей среды
            ux_mode: 'popup',
            context: 'signin',
            // Используем соответствующее происхождение
            origin: originUrl,
            // Добавляем обработку ошибок
            error_callback: handleAuthError
        });
        
        // Отображаем кнопку в контейнере
        const buttonContainer = document.getElementById('google-signin-button');
        if (buttonContainer) {
            google.accounts.id.renderButton(
                buttonContainer, 
                { 
                    type: "standard",
                    theme: "filled_black",
                    size: "large",
                    text: "signin_with",
                    shape: "rectangular",
                    logo_alignment: "left",
                    width: 280
                }
            );
            
            console.log('[DEBUG] Кнопка Google Sign-In отрендерена');
        } else {
            console.warn('[DEBUG] Контейнер для кнопки Google Sign-In не найден');
        }
    } catch (error) {
        console.error('[DEBUG] Ошибка при инициализации Google Sign-In:', error);
        authErrorState.isError = true;
        authErrorState.message = 'Не удалось инициализировать вход через Google';
        authErrorState.details = error.message || 'Неизвестная ошибка';
        showAuthError();
    }
    
    // Проверяем, авторизован ли уже пользователь
    if (localStorage.getItem('userProfile')) {
        try {
            userProfile = JSON.parse(localStorage.getItem('userProfile'));
            if (userProfile.isSignedIn) {
                updateUserProfileUI();
            }
        } catch (error) {
            console.error('[DEBUG] Ошибка при загрузке профиля пользователя:', error);
        }
    }
    
    // Настраиваем кнопку выхода
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            signOut();
        });
    }
}

// Функция для обработки ошибок авторизации
function handleAuthError(error) {
    console.error('[DEBUG] Ошибка авторизации Google:', error);
    authErrorState.isError = true;
    authErrorState.message = 'Ошибка при авторизации через Google';
    
    // Обработка специфических ошибок
    if (error.type === 'invalid_client' || error.error === 'invalid_client') {
        authErrorState.details = 'Ошибка: invalid_client - клиент OAuth не найден. Необходимо проверить client_id.';
        authErrorState.solution = 'Создайте правильный OAuth client ID в Google Cloud Console и обновите его в коде приложения.';
    } else if (error.type === 'redirect_uri_mismatch' || error.error === 'redirect_uri_mismatch') {
        authErrorState.details = 'Ошибка: redirect_uri_mismatch - URI перенаправления не совпадает с зарегистрированным.';
        authErrorState.solution = 'Убедитесь, что https://sladostivk.github.io и https://sladostivk.github.io/ST/ добавлены как разрешенные URL в Google Cloud Console.';
    } else {
        authErrorState.details = error.message || error.type || error.error || 'Неизвестная ошибка';
        authErrorState.solution = 'Проверьте настройки OAuth в Google Cloud Console.';
    }
    
    showAuthError();
}

// Функция для отображения ошибки авторизации
function showAuthError() {
    const buttonContainer = document.getElementById('google-signin-button');
    if (buttonContainer) {
        buttonContainer.innerHTML = `
            <div class="auth-error-message">
                <span class="material-icons">error</span>
                <p>${authErrorState.message}</p>
                <p>${authErrorState.details}</p>
                <p>${authErrorState.solution || ''}</p>
                <p>Необходимо обновить настройки в Google Cloud Console:</p>
                <code>https://console.cloud.google.com/apis/credentials</code>
            </div>
        `;
    }
    
    // Обновляем текст в настройках профиля
    const profileSubtitle = document.querySelector('.settings-item[data-setting="profile"] .settings-item-subtitle');
    if (profileSubtitle) {
        profileSubtitle.textContent = 'Ошибка авторизации';
    }
}

// Обработчик ответа от Google Sign-In
function handleCredentialResponse(response) {
    console.log('[DEBUG] Получен ответ от Google Sign-In');
    
    // Декодируем JWT токен
    const payload = parseJwt(response.credential);
    console.log('[DEBUG] Данные пользователя:', payload);
    
    // Сохраняем данные пользователя
    userProfile = {
        isSignedIn: true,
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        imageUrl: payload.picture
    };
    
    // Сохраняем профиль в localStorage
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // Обновляем интерфейс
    updateUserProfileUI();
    
    // В реальном приложении здесь можно добавить код для синхронизации данных с сервером
    // и загрузки данных пользователя
}

// Функция для разбора JWT токена
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
}

// Функция для обновления UI после входа пользователя
function updateUserProfileUI() {
    console.log('[DEBUG] Обновление UI пользователя');
    
    // Проверка протокола - не показываем профиль пользователя на file://
    if (window.location.protocol === 'file:') {
        console.warn('[DEBUG] Обнаружен протокол file:// - авторизация через Google невозможна');
        return;
    }
    
    // Скрываем кнопку входа и показываем профиль
    const googleButton = document.getElementById('google-signin-button');
    const profileContainer = document.querySelector('.user-profile-container');
    
    if (userProfile.isSignedIn) {
        if (googleButton) googleButton.style.display = 'none';
        if (profileContainer) {
            profileContainer.style.display = 'block';
            
            // Заполняем данные профиля
            const nameElement = profileContainer.querySelector('.user-profile-name');
            const emailElement = profileContainer.querySelector('.user-profile-email');
            const imageElement = profileContainer.querySelector('.user-profile-image');
            
            if (nameElement) nameElement.textContent = userProfile.name;
            if (emailElement) emailElement.textContent = userProfile.email;
            if (imageElement) imageElement.src = userProfile.imageUrl;
            
            // Обновляем информацию в настройках
            const profileSubtitle = document.querySelector('.settings-item[data-setting="profile"] .settings-item-subtitle');
            if (profileSubtitle) profileSubtitle.textContent = userProfile.email;
        }
    } else {
        if (googleButton) googleButton.style.display = 'flex';
        if (profileContainer) profileContainer.style.display = 'none';
        
        // Обновляем информацию в настройках
        const profileSubtitle = document.querySelector('.settings-item[data-setting="profile"] .settings-item-subtitle');
        if (profileSubtitle) profileSubtitle.textContent = 'Не выполнен вход';
    }
}

// Функция для выхода из аккаунта
function signOut() {
    console.log('[DEBUG] Выход из аккаунта Google');
    
    // Сбрасываем данные пользователя
    userProfile = {
        isSignedIn: false,
        id: null,
        name: null,
        email: null,
        imageUrl: null
    };
    
    // Удаляем данные из localStorage
    localStorage.removeItem('userProfile');
    
    // Обновляем интерфейс
    updateUserProfileUI();
    
    // В реальном приложении здесь может быть код для отмены синхронизации с сервером
    // и сброса локального кэша данных пользователя
    
    // Закрываем модальное окно профиля
    const profileModal = document.getElementById('profile-modal');
    if (profileModal) closeSettingsModal(profileModal);
}

// Добавляем инициализацию Google Sign-In при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Существующий код инициализации...
    
    // Инициализация Google Sign-In
    setTimeout(() => {
        initializeGoogleSignIn();
    }, 1000);
});

// ... existing code ...

// Функция для управления профилем пользователя (локальная версия без Google)
function setupProfileHandlers() {
    console.log('[DEBUG] Настройка обработчиков профиля');
    
    // Получаем элементы формы
    const firstNameInput = document.getElementById('profile-firstname');
    const lastNameInput = document.getElementById('profile-lastname');
    const saveButton = document.querySelector('.save-profile-button');
    
    if (!firstNameInput || !lastNameInput || !saveButton) {
        console.error('[DEBUG] Не удалось найти элементы формы профиля');
        return;
    }
    
    // Загружаем сохраненные данные профиля при открытии модального окна
    document.querySelector('[data-setting="profile"]').addEventListener('click', function() {
        loadProfileData();
    });
    
    // Обработчик для кнопки сохранения
    saveButton.addEventListener('click', function() {
        saveProfileData();
    });
    
    // Обновляем отображение данных профиля в настройках
    updateProfileDisplay();
}

// Функция для загрузки данных профиля
function loadProfileData() {
    console.log('[DEBUG] Загрузка данных профиля');
    
    const firstNameInput = document.getElementById('profile-firstname');
    const lastNameInput = document.getElementById('profile-lastname');
    
    if (!firstNameInput || !lastNameInput) {
        console.error('[DEBUG] Не удалось найти поля ввода профиля');
        return;
    }
    
    // Загружаем данные из localStorage
    const profileData = localStorage.getItem('profileData');
    
    if (profileData) {
        const data = JSON.parse(profileData);
        firstNameInput.value = data.firstName || '';
        lastNameInput.value = data.lastName || '';
    } else {
        // Если данных нет, очищаем поля
        firstNameInput.value = '';
        lastNameInput.value = '';
    }
}

// Функция для сохранения данных профиля
function saveProfileData() {
    console.log('[DEBUG] Сохранение данных профиля');
    
    const firstNameInput = document.getElementById('profile-firstname');
    const lastNameInput = document.getElementById('profile-lastname');
    
    if (!firstNameInput || !lastNameInput) {
        console.error('[DEBUG] Не удалось найти поля ввода профиля');
        return;
    }
    
    // Получаем значения полей
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    
    // Создаем объект с данными профиля
    const profileData = {
        firstName: firstName,
        lastName: lastName
    };
    
    // Сохраняем в localStorage
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    // Обновляем отображение в настройках
    updateProfileDisplay();
    
    // Показываем уведомление об успешном сохранении
    showNotification('Профиль сохранен');
    
    // Закрываем модальное окно
    closeSettingsModal(document.getElementById('profile-modal'));
}

// Функция для отображения уведомления
function showNotification(message) {
    // Проверяем, существует ли уже контейнер для уведомлений
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        // Создаем контейнер для уведомлений, если его нет
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Добавляем уведомление в контейнер
    notificationContainer.appendChild(notification);
    
    // Устанавливаем таймер для удаления уведомления
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    }, 2000);
}

// Функция для обновления отображения профиля в настройках
function updateProfileDisplay() {
    console.log('[DEBUG] Обновление отображения профиля');
    
    const profileSubtitle = document.querySelector('.settings-item[data-setting="profile"] .settings-item-subtitle');
    
    if (!profileSubtitle) {
        console.error('[DEBUG] Не удалось найти элемент для отображения профиля');
        return;
    }
    
    // Загружаем данные из localStorage
    const profileData = localStorage.getItem('profileData');
    
    if (profileData) {
        const data = JSON.parse(profileData);
        
        if (data.firstName || data.lastName) {
            profileSubtitle.textContent = `${data.firstName} ${data.lastName}`.trim();
        } else {
            profileSubtitle.textContent = 'Нажмите, чтобы заполнить профиль';
        }
    } else {
        profileSubtitle.textContent = 'Нажмите, чтобы заполнить профиль';
    }
}

// Функция для обновления модального окна со списком напоминаний
function updateRemindersModal() {
    console.log('[DEBUG] Обновление модального окна напоминаний');
    
    const remindersModal = document.getElementById('reminders-modal');
    if (!remindersModal) {
        console.error('[DEBUG] Модальное окно напоминаний не найдено');
        return;
    }
    
    const remindersList = remindersModal.querySelector('.reminders-list');
    if (!remindersList) {
        console.error('[DEBUG] Список напоминаний не найден');
        return;
    }
    
    // Очищаем список
    remindersList.innerHTML = '';
    
    // Проверяем есть ли напоминания
    if (!settingsState.reminders || settingsState.reminders.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-reminders-message';
        emptyMessage.textContent = 'Нет добавленных напоминаний';
        remindersList.appendChild(emptyMessage);
        console.log('[DEBUG] Нет добавленных напоминаний');
        return;
    }
    
    // Сортируем напоминания по времени
    const sortedReminders = [...settingsState.reminders].sort((a, b) => {
        return a.time.localeCompare(b.time);
    });
    
    // Добавляем напоминания в список
    sortedReminders.forEach(reminder => {
        const reminderElement = createReminderItem(reminder);
        remindersList.appendChild(reminderElement);
        console.log(`[DEBUG] Добавлено напоминание в список: ${reminder.title} (${reminder.id})`);
    });
    
    console.log(`[DEBUG] Всего напоминаний в списке: ${sortedReminders.length}`);
}

// Обновляем функцию openSettingsModal, чтобы она использовала updateRemindersModal
function openSettingsModal(settingType) {
    console.log(`[DEBUG] Открытие модального окна настроек: ${settingType}`);
    
    // Находим соответствующее модальное окно
    const modalId = `${settingType}-modal`;
    const modal = document.getElementById(modalId);
    
    if (modal) {
        console.log(`[DEBUG] Найдено модальное окно: ${modalId}`);
        
        // Закрываем все другие модальные окна настроек
        document.querySelectorAll('.settings-modal.active').forEach(m => {
            if (m !== modal) {
                m.classList.remove('active');
            }
        });
        
        // Открываем выбранное модальное окно
        modal.classList.add('active');
        
        // Дополнительные действия в зависимости от типа настройки
        if (settingType === 'currency') {
            // Выделяем текущую валюту
            const currencyItems = modal.querySelectorAll('.currency-item');
            currencyItems.forEach(item => {
                const itemCurrency = item.getAttribute('data-currency');
                if (itemCurrency === settingsState.currency) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        } else if (settingType === 'language') {
            // Выделяем текущий язык
            const languageItems = modal.querySelectorAll('.language-item');
            languageItems.forEach(item => {
                const itemLanguage = item.getAttribute('data-language');
                if (itemLanguage === settingsState.language) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        } else if (settingType === 'reminders') {
            // Обновляем список напоминаний
            updateRemindersModal();
            
            // Устанавливаем состояние переключателя
            const toggleInput = modal.querySelector('.reminders-toggle-container .switch input');
            if (toggleInput) {
                toggleInput.checked = settingsState.remindersEnabled;
            }
        }
    } else {
        console.error(`[DEBUG] Модальное окно не найдено: ${modalId}`);
    }
}

// Debounce функция для предотвращения множественных вызовов
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Функция для проигрывания звука щелчка
function playClickSound() {
    try {
        // Проверяем, включен ли звук в настройках
        if (settingsState.soundEnabled) {
            console.log('[DEBUG] Попытка воспроизведения звука - начало функции');
            
            // Первый метод: использование Web Audio API (наиболее надежный и четкий звук щелчка)
            if (window.playBeep) {
                console.log('[DEBUG] Использую Web Audio API для воспроизведения звука щелчка');
                window.playBeep();
                return;
            }
            
            // Второй метод: через создание нового элемента Audio
            try {
                // Пробуем воспроизвести звук щелчка через стандартный Audio API
                const audio = new Audio();
                
                // Выбираем наиболее подходящий формат для браузера
                // Сначала пробуем WAV как самый короткий и четкий
                const wavSound = document.getElementById('click-sound-wav');
                if (wavSound && wavSound.querySelector('source')) {
                    audio.src = wavSound.querySelector('source').src;
                    audio.volume = 0.3;
                    audio.play()
                        .then(() => console.log('[DEBUG] WAV звук щелчка воспроизведен'))
                        .catch(e => {
                            console.error('[DEBUG] Ошибка воспроизведения WAV:', e.message);
                            
                            // Если WAV не работает, пробуем WebM
                            const webmSound = document.getElementById('click-sound-webm');
                            if (webmSound && webmSound.querySelector('source')) {
                                const fallbackAudio = new Audio(webmSound.querySelector('source').src);
                                fallbackAudio.volume = 0.3;
                                fallbackAudio.play()
                                    .then(() => console.log('[DEBUG] WebM звук щелчка воспроизведен'))
                                    .catch(e2 => console.error('[DEBUG] Ошибка воспроизведения WebM:', e2.message));
                            }
                        });
                    return;
                }
                
                // Если WAV элемент не найден, пробуем сразу WebM
                const webmSound = document.getElementById('click-sound-webm');
                if (webmSound && webmSound.querySelector('source')) {
                    audio.src = webmSound.querySelector('source').src;
                    audio.volume = 0.3;
                    audio.play()
                        .then(() => console.log('[DEBUG] WebM звук щелчка воспроизведен'))
                        .catch(e => console.error('[DEBUG] Ошибка воспроизведения WebM:', e.message));
                    return;
                }
                
                // В последнюю очередь пробуем MP3
                const clickSound = document.getElementById('click-sound');
                if (clickSound && clickSound.querySelector('source')) {
                    audio.src = clickSound.querySelector('source').src;
                    audio.volume = 0.3;
                    audio.play()
                        .then(() => console.log('[DEBUG] MP3 звук щелчка воспроизведен'))
                        .catch(e => console.error('[DEBUG] Ошибка воспроизведения MP3:', e.message));
                    return;
                }
                
                console.error('[DEBUG] Не удалось найти источник звука для воспроизведения щелчка');
            } catch (audioError) {
                console.error('[DEBUG] Ошибка при воспроизведении через Audio():', audioError);
            }
        } else {
            console.log('[DEBUG] Звук отключен в настройках');
        }
    } catch (error) {
        console.error('[DEBUG] Необработанная ошибка в playClickSound:', error);
    }
}

// Функция для инициализации звуковых эффектов на всех кнопках
function initializeButtonSounds() {
    console.log('[DEBUG] Инициализация звуковых эффектов для кнопок');
    
    // Используем делегирование событий для всех кликабельных элементов
    document.body.addEventListener('click', function(e) {
        // Проверяем, является ли элемент или его родитель интерактивным элементом
        const isInteractive = e.target.matches('button, .nav-item, .settings-item, .category-item, .data-button, .currency-item, .language-item, .settings-back-button, .switch input') || 
                              e.target.closest('button, .nav-item, .settings-item, .category-item, .data-button, .currency-item, .language-item, .settings-back-button');
        
        if (isInteractive) {
            console.log('[DEBUG] Обнаружен клик по интерактивному элементу:', e.target.tagName, e.target.className);
            // Используем setTimeout для небольшой задержки воспроизведения звука
            setTimeout(playClickSound, 5);
        }
    });
    
    // Проверяем доступность звукового файла при инициализации
    testSoundAvailability();
    
    console.log('[DEBUG] Звуковые эффекты инициализированы через делегирование событий');
}

// Функция для тестирования доступности звукового файла
function testSoundAvailability() {
    const clickSound = document.getElementById('click-sound');
    if (!clickSound) {
        console.error('[DEBUG] Элемент звука не найден при тестировании');
        return;
    }
    
    console.log('[DEBUG] Тестирование звукового файла...');
    console.log('[DEBUG] Элемент звука:', clickSound);
    console.log('[DEBUG] Состояние readyState:', clickSound.readyState);
    
    if (clickSound.querySelector('source')) {
        console.log('[DEBUG] Источник звука (через source):', clickSound.querySelector('source').src.substring(0, 50) + '...');
    } else if (clickSound.src) {
        console.log('[DEBUG] Источник звука (напрямую):', clickSound.src.substring(0, 50) + '...');
    } else {
        console.error('[DEBUG] Не удалось найти источник звука при тестировании');
    }
}

// Запускаем предварительную загрузку звука
function preloadSoundEffects() {
    console.log('[DEBUG] Предварительная загрузка звуковых эффектов');
    
    // Создаем временный элемент Audio для предзагрузки
    const tempAudio = new Audio();
    
    // Получаем ссылку на существующий элемент звука
    const clickSound = document.getElementById('click-sound');
    if (!clickSound) {
        console.error('[DEBUG] Элемент звука не найден для предзагрузки');
        return;
    }
    
    // Получаем источник звука
    if (clickSound.querySelector('source')) {
        tempAudio.src = clickSound.querySelector('source').src;
    } else if (clickSound.src) {
        tempAudio.src = clickSound.src;
    } else {
        console.error('[DEBUG] Не удалось найти источник звука для предзагрузки');
        return;
    }
    
    // Устанавливаем обработчики событий
    tempAudio.addEventListener('canplaythrough', function() {
        console.log('[DEBUG] Звук успешно предзагружен');
    }, { once: true });
    
    tempAudio.addEventListener('error', function(e) {
        console.error('[DEBUG] Ошибка предзагрузки звука:', e);
    }, { once: true });
    
    // Начинаем загрузку
    tempAudio.load();
    console.log('[DEBUG] Запущена предзагрузка звука, src:', tempAudio.src.substring(0, 50) + '...');
}