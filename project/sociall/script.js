// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    // Создаем оверлей для мобильного меню
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    body.appendChild(overlay);

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Закрытие меню при клике на оверлей
        overlay.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });
            });

    // Закрытие мобильного меню при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Отслеживание активной секции для подсветки меню
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // Smooth scrolling for anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const region = formData.get('region');
            const phone = formData.get('phone');
            const message = formData.get('message');

            // Basic validation
            if (!name || !region || !phone || !message) {
                showNotification('Пожалуйста, заполните все поля формы', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
            
            // Reset form
            this.reset();
        });
    }

    // SVG map interaction
    const russiaMap = document.querySelector('.russia-map-svg');
    if (russiaMap) {
        russiaMap.addEventListener('click', function(e) {
            // Show general information about the network
            showNotification('Сеть уполномоченных представителей охватывает все регионы России. Каждый представитель работает на общественных началах и оказывает помощь калмыкам в своем регионе.', 'info');
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '#FFFFFF';
            header.style.backdropFilter = 'none';
        }

        lastScrollTop = scrollTop;
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.about-card, .support-card, .contact-item, .stat-card, .achievement-card, .chart-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Animate statistics numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = parseInt(target.textContent);
                animateNumber(target, 0, finalNumber, 2000);
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));

    // Animate progress bars
    const progressBars = document.querySelectorAll('.progress-fill');
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const value = progressBar.getAttribute('data-value');
                const maxValue = 7; // Максимальное значение для прогресс-бара
                const percentage = (value / maxValue) * 100;
                
                // Сбрасываем ширину перед анимацией
                progressBar.style.width = '0%';
                
                // Добавляем небольшую задержку для плавности
                setTimeout(() => {
                    progressBar.style.transition = 'width 1.5s ease-out';
                    progressBar.style.width = percentage + '%';
                }, 100);
                
                // Не отключаем наблюдение, чтобы анимация могла повториться
                // progressObserver.unobserve(progressBar);
            }
        });
    }, { 
        threshold: 0.3, // Уменьшаем порог для более раннего срабатывания
        rootMargin: '0px 0px -50px 0px' // Добавляем отступ снизу
    });

    progressBars.forEach(bar => progressObserver.observe(bar));
    
    // Дополнительная проверка при загрузке страницы
    setTimeout(() => {
        progressBars.forEach(bar => {
            if (bar.getBoundingClientRect().top < window.innerHeight) {
                const value = bar.getAttribute('data-value');
                const maxValue = 7;
                const percentage = (value / maxValue) * 100;
                
                bar.style.transition = 'width 1.5s ease-out';
                bar.style.width = percentage + '%';
            }
        });
    }, 1000);

    // Initialize charts
    initializeCharts();
    
    // Add interactivity to bar chart
    addBarChartInteractivity();
    
    // Дополнительная функция для анимации прогресс-баров при прокрутке
    function animateProgressBarsOnScroll() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && bar.style.width === '0%') {
                const value = bar.getAttribute('data-value');
                const maxValue = 7;
                const percentage = (value / maxValue) * 100;
                
                bar.style.transition = 'width 1.5s ease-out';
                bar.style.width = percentage + '%';
            }
        });
    }
    
    // Запускаем анимацию при прокрутке
    window.addEventListener('scroll', animateProgressBarsOnScroll);
    
    // Запускаем анимацию при изменении размера окна
    window.addEventListener('resize', animateProgressBarsOnScroll);
    
    // Анимация изображения поддержки при скролле
    function animateSupportImage() {
        const supportImage = document.querySelector('.support-image-container');
        if (!supportImage) return;
        
        const rect = supportImage.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !supportImage.classList.contains('animate')) {
            supportImage.classList.add('animate');
        }
    }
    
    // Анимация изображения "О нашем фонде" при скролле
    function animateAboutImage() {
        const aboutImage = document.querySelector('.about-image-container');
        if (!aboutImage) return;
        
        const rect = aboutImage.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !aboutImage.classList.contains('animate')) {
            aboutImage.classList.add('animate');
        }
    }
    
    // Параллакс эффект для изображения поддержки
    function updateSupportImageParallax() {
        const supportImage = document.querySelector('.support-image-container');
        if (!supportImage) return;
        
        const rect = supportImage.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3; // Скорость параллакса
        
        // Применяем параллакс только когда изображение видимо
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            supportImage.style.setProperty('--parallax-offset', rate + 'px');
            supportImage.classList.add('parallax');
        } else {
            supportImage.classList.remove('parallax');
        }
    }
    
    // Запускаем анимацию изображения поддержки
    window.addEventListener('scroll', animateSupportImage);
    window.addEventListener('scroll', updateSupportImageParallax);
    window.addEventListener('resize', animateSupportImage);
    window.addEventListener('resize', updateSupportImageParallax);
    
    // Запускаем анимацию изображения "О нашем фонде"
    window.addEventListener('scroll', animateAboutImage);
    window.addEventListener('resize', animateAboutImage);
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Region information display
function showRegionInfo(regionName) {
    const regionInfo = {
        'Калмыкия - Центр': 'Центральный офис фонда. Координация всех региональных представителей.',
        'Москва': 'Представитель в Москве. Помощь калмыкам в столице и Московской области.',
        'Санкт-Петербург': 'Представитель в Санкт-Петербурге. Поддержка калмыцкой диаспоры на Северо-Западе.',
        'Ростов': 'Представитель в Ростовской области. Помощь в Южном федеральном округе.',
        'Волгоград': 'Представитель в Волгоградской области. Поддержка в Поволжье.',
        'Астрахань': 'Представитель в Астраханской области. Помощь в Прикаспийском регионе.'
    };

    const info = regionInfo[regionName] || 'Информация о представителе в данном регионе будет добавлена в ближайшее время.';
    
    showNotification(`${regionName}: ${info}`, 'info');
}

// Animate number function
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (difference * easeOutQuart));
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Initialize charts function
function initializeCharts() {
    // Pie Chart
    const pieCanvas = document.getElementById('pieChart');
    if (pieCanvas) {
        const pieCtx = pieCanvas.getContext('2d');
        drawPieChart(pieCtx, pieCanvas.width, pieCanvas.height);
    }
    
    // Bar Chart
    const barCanvas = document.getElementById('barChart');
    if (barCanvas) {
        const barCtx = barCanvas.getContext('2d');
        drawBarChart(barCtx, barCanvas.width, barCanvas.height);
    }
}

// Draw pie chart
function drawPieChart(ctx, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40; // Увеличиваем отступ для текста
    
    const data = [
        { value: 35, color: '#1E3A8A', label: 'Социальная поддержка' },
        { value: 25, color: '#DC2626', label: 'Трудоустройство' },
        { value: 20, color: '#F59E0B', label: 'Религиозная поддержка' },
        { value: 20, color: '#10B981', label: 'Образование' }
    ];
    
    let currentAngle = -Math.PI / 2; // Начинаем с верхней точки
    
    data.forEach((item, index) => {
        const sliceAngle = (item.value / 100) * 2 * Math.PI;
        
        // Рисуем сектор
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        
        // Добавляем обводку
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Добавляем тень
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        currentAngle += sliceAngle;
    });
    
    // Сбрасываем тень
    ctx.shadowColor = 'transparent';
    
    // Рисуем центр
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Добавляем заголовок
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 20px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Распределение помощи', centerX, centerY - radius - 20);
    
    // Добавляем подзаголовок
    ctx.fillStyle = '#64748B';
    ctx.font = '500 14px Inter';
    ctx.fillText('По направлениям деятельности', centerX, centerY - radius - 5);
}

// Draw bar chart
function drawBarChart(ctx, width, height) {
    const margin = 80; // Увеличиваем отступы для лучшего размещения текста
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;
    
    const data = [
        { month: 'Январь', value: 365, growth: '+8%', category: 'Социальная поддержка' },
        { month: 'Февраль', value: 378, growth: '+20%', category: 'Трудоустройство' },
        { month: 'Март', value: 392, growth: '+18%', category: 'Религиозная поддержка' },
        { month: 'Апрель', value: 385, growth: '-8%', category: 'Образование' },
        { month: 'Май', value: 403, growth: '+21%', category: 'Социальная поддержка' },
        { month: 'Июнь', value: 412, growth: '+9%', category: 'Трудоустройство' },
        { month: 'Июль', value: 428, growth: '+15%', category: 'Социальная поддержка' }
    ];
    
    const barWidth = chartWidth / data.length * 0.7;
    const barSpacing = chartWidth / data.length * 0.3;
    const maxValue = Math.max(...data.map(d => d.value));
    
    // Очищаем canvas
    ctx.clearRect(0, 0, width, height);
    
    // Рисуем фон
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, width, height);
    
    // Рисуем сетку
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    const gridLines = 8;
    for (let i = 0; i <= gridLines; i++) {
        const y = margin + (chartHeight / gridLines) * i;
        ctx.beginPath();
        ctx.moveTo(margin + 10, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
        
        // Подписи значений на Y оси
        const value = Math.round(maxValue - (maxValue / gridLines) * i);
        ctx.fillStyle = '#64748B';
        ctx.font = '500 14px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(value.toString(), margin - 25, y + 5);
    }
    
    // Рисуем оси
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    
    // Y ось
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);
    ctx.stroke();
    
    // X ось
    ctx.beginPath();
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.stroke();
    
    // Рисуем столбцы
    data.forEach((item, index) => {
        const x = margin + (chartWidth / data.length) * index + barSpacing / 2;
        const barHeight = (item.value / maxValue) * chartHeight;
        const y = height - margin - barHeight;
        
        // Градиент для столбца
        const gradient = ctx.createLinearGradient(x, y, x, height - margin);
        if (item.growth.includes('+')) {
            gradient.addColorStop(0, '#1E3A8A');
            gradient.addColorStop(1, '#3B82F6');
        } else {
            gradient.addColorStop(0, '#DC2626');
            gradient.addColorStop(1, '#EF4444');
        }
        
        // Рисуем столбец с закругленными углами
        ctx.fillStyle = gradient;
        roundRect(ctx, x, y, barWidth, barHeight, 8);
        ctx.fill();
        
        // Добавляем тень
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
        
        // Рисуем значение на столбце
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 18px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(item.value.toString(), x + barWidth / 2, y - 30);
        
        // Рисуем рост/падение
        ctx.fillStyle = item.growth.includes('+') ? '#10B981' : '#EF4444';
        ctx.font = '600 14px Inter';
        ctx.fillText(item.growth, x + barWidth / 2, y - 60);
        
        // Рисуем месяц под столбцом
        ctx.fillStyle = '#475569';
        ctx.font = '600 16px Inter';
        ctx.fillText(item.month, x + barWidth / 2, height - margin + 50);
        
        // Рисуем категорию вертикально на столбце (в центре)
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 11px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Добавляем фон для лучшей читаемости
        const categoryText = item.category;
        const categoryMetrics = ctx.measureText(categoryText);
        const categoryBgWidth = 25;
        const categoryBgHeight = categoryMetrics.width + 30;
        const categoryBgX = x + barWidth / 2 - categoryBgWidth / 2;
        const categoryBgY = y + barHeight / 2 - categoryBgHeight / 2;
        
        // Проверяем, чтобы фон не выходил за границы столбца
        if (categoryBgY < y) {
            categoryBgY = y + 10;
        }
        if (categoryBgY + categoryBgHeight > y + barHeight) {
            categoryBgHeight = y + barHeight - categoryBgY - 10;
        }
        
        // Рисуем фон для категории
        ctx.fillStyle = 'rgba(30, 58, 138, 0.9)';
        roundRect(ctx, categoryBgX, categoryBgY, categoryBgWidth, categoryBgHeight, 10);
        ctx.fill();
        
        // Рисуем рамку желтого цвета
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        roundRect(ctx, categoryBgX, categoryBgY, categoryBgWidth, categoryBgHeight, 10);
        ctx.stroke();
        
        // Рисуем текст категории вертикально
        ctx.save();
        ctx.translate(x + barWidth / 2, y + barHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 10px Inter'; // Уменьшаем размер шрифта
        ctx.fillText(categoryText, 0, 0);
        ctx.restore();
        
        // Добавляем интерактивность - подсветка при наведении
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - 2, y - 2, barWidth + 4, barHeight + 4);
    });
    
    // Сбрасываем тень
    ctx.shadowColor = 'transparent';
    
    // Рисуем заголовки осей
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 22px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Количество обращений в месяц', width / 2, margin - 100);
    
    // Рисуем подзаголовок
    ctx.fillStyle = '#64748B';
    ctx.font = '500 16px Inter';
    ctx.fillText('По категориям и динамике роста', width / 2, margin - 70);
    
    // Рисуем Y ось заголовок
    ctx.save();
    ctx.translate(margin - 60, height / 2 - 60);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#475569';
    ctx.font = '600 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Количество обращений', 0, 0);
    ctx.restore();
    
    // Рисуем X ось заголовок
    // ctx.fillStyle = '#475569';
    // ctx.font = '600 16px Inter';
    // ctx.textAlign = 'center';
    // ctx.fillText('Месяцы', width / 2, height - 15);
    
    // Добавляем легенду
    drawLegend(ctx, width, height, margin);
}

// Функция для рисования закругленных прямоугольников
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Функция для рисования легенды
function drawLegend(ctx, width, height, margin) {
    const legendData = [
        { color: '#1E3A8A', label: 'Рост обращений' },
        { color: '#DC2626', label: 'Снижение обращений' },
        { color: '#10B981', label: 'Социальная поддержка' },
        { color: '#F59E0B', label: 'Трудоустройство' }
    ];
    
    const legendX = margin;
    const legendY = height - margin + 90;
    const itemHeight = 25;
    
    legendData.forEach((item, index) => {
        const y = legendY + index * itemHeight;
        
        // Цветной квадрат
        ctx.fillStyle = item.color;
        ctx.fillRect(legendX, y, 15, 15);
        
        // Подпись
        ctx.fillStyle = '#475569';
        ctx.font = '500 12px Inter';
        ctx.textAlign = 'left';
        ctx.fillText(item.label, legendX + 25, y + 12);
    });
}

// Функция для добавления интерактивности к столбчатой диаграмме
function addBarChartInteractivity() {
    const canvas = document.getElementById('barChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let isHovering = false;
    let hoveredBar = -1;
    
    // Данные для определения позиций столбцов
    const data = [
        { month: 'Январь', value: 365, growth: '+8%', category: 'Социальная поддержка' },
        { month: 'Февраль', value: 378, growth: '+20%', category: 'Трудоустройство' },
        { month: 'Март', value: 392, growth: '+18%', category: 'Религиозная поддержка' },
        { month: 'Апрель', value: 385, growth: '-8%', category: 'Образование' },
        { month: 'Май', value: 403, growth: '+21%', category: 'Социальная поддержка' },
        { month: 'Июнь', value: 412, growth: '+9%', category: 'Трудоустройство' },
        { month: 'Июль', value: 428, growth: '+15%', category: 'Социальная поддержка' }
    ];
    
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Определяем, над каким столбцом находится курсор
        const margin = 60;
        const chartWidth = canvas.width - 2 * margin;
        const barWidth = chartWidth / data.length * 0.7;
        const barSpacing = chartWidth / data.length * 0.3;
        
        let newHoveredBar = -1;
        data.forEach((item, index) => {
            const barX = margin + (chartWidth / data.length) * index + barSpacing / 2;
            if (x >= barX && x <= barX + barWidth) {
                newHoveredBar = index;
            }
        });
        
        if (newHoveredBar !== hoveredBar) {
            hoveredBar = newHoveredBar;
            isHovering = hoveredBar !== -1;
            
            // Перерисовываем диаграмму с подсветкой
            drawBarChart(ctx, canvas.width, canvas.height);
            
            if (isHovering) {
                // Показываем детальную информацию
                showBarTooltip(e.clientX, e.clientY, data[hoveredBar]);
            } else {
                hideTooltip();
            }
        }
    });
    
    canvas.addEventListener('mouseleave', function() {
        if (isHovering) {
            isHovering = false;
            hoveredBar = -1;
            drawBarChart(ctx, canvas.width, canvas.height);
            hideTooltip();
        }
    });
    
    canvas.addEventListener('click', function(e) {
        if (hoveredBar !== -1) {
            // Показываем уведомление с деталями
            const item = data[hoveredBar];
            showNotification(`${item.month}: ${item.value} обращений (${item.growth}). Категория: ${item.category}`, 'info');
        }
    });
}

// Функция для показа всплывающей подсказки
function showBarTooltip(x, y, data) {
    hideTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-header">${data.month}</div>
        <div class="tooltip-value">${data.value} обращений</div>
        <div class="tooltip-growth ${data.growth.includes('+') ? 'positive' : 'negative'}">${data.growth}</div>
        <div class="tooltip-category">${data.category}</div>
    `;
    
    tooltip.style.cssText = `
        position: fixed;
        left: ${x + 10}px;
        top: ${y - 10}px;
        background: rgba(30, 41, 59, 0.95);
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        z-index: 10000;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        max-width: 200px;
    `;
    
    document.body.appendChild(tooltip);
}

// Функция для скрытия всплывающей подсказки
function hideTooltip() {
    const existingTooltip = document.querySelector('.chart-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    .notification-message {
        flex: 1;
    }
`;

document.head.appendChild(notificationStyles);

// Enhanced mobile menu styles
const mobileMenuStyles = document.createElement('style');
mobileMenuStyles.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 80px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 80px);
            background-color: white;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 2rem;
            transition: left 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

document.head.appendChild(mobileMenuStyles);
