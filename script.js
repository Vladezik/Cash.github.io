document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const themeToggleButton = document.getElementById('themeToggleButton');
    const resetButton = document.getElementById('resetButton');
    const targetAmountInput = document.getElementById('targetAmount');
    const calculateButton = document.getElementById('calculateButton');
    const resultCard = document.getElementById('resultCard');
    const denomResults = document.getElementById('denomResults');
    const totalAmountElement = document.getElementById('totalAmount');
    const differenceElement = document.getElementById('difference');
    const confirmDialog = document.getElementById('confirmDialog');
    const confirmYesButton = document.getElementById('confirmYes');
    const confirmNoButton = document.getElementById('confirmNo');
    const toast = document.getElementById('toast');

    // Элементы для номиналов
    const denominations = [
        { id: 'denom1000', value: 1000, sumId: 'sum1000' },
        { id: 'denom500', value: 500, sumId: 'sum500' },
        { id: 'denom200', value: 200, sumId: 'sum200' },
        { id: 'denom100', value: 100, sumId: 'sum100' },
        { id: 'denom50', value: 50, sumId: 'sum50' },
        { id: 'denom20', value: 20, sumId: 'sum20' },
    ];

    // Состояние приложения
    let isDarkTheme = false;
    let isCalculated = false;
    let hasChangesAfterCalculation = false;
    let currentFormattedTarget = '';

    // Инициализация приложения
    function init() {
        // Загружаем сохраненную тему
        loadTheme();
        
        // Загружаем сохраненные данные
        loadSavedData();
        
        // Настройка слушателей событий
        setupEventListeners();
        
        // Обновляем иконку темы
        updateThemeIcon();
        
        // Настройка форматирования целевой суммы
        setupTargetAmountFormatting();
        
        // Настройка текстовых наблюдателей для номиналов
        setupTextWatchers();
    }

    // Загрузка сохраненной темы
    function loadTheme() {
        const savedTheme = localStorage.getItem('cashAppTheme');
        isDarkTheme = savedTheme === 'dark';
        
        if (isDarkTheme) {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        }
    }

    // Загрузка сохраненных данных
    function loadSavedData() {
        // Загружаем целевой сумму
        const savedTargetAmount = localStorage.getItem('cashAppTargetAmount');
        if (savedTargetAmount) {
            targetAmountInput.value = savedTargetAmount;
            currentFormattedTarget = savedTargetAmount;
        }
        
        // Загружаем номиналы
        denominations.forEach(denom => {
            const savedValue = localStorage.getItem(`cashApp_${denom.id}`);
            if (savedValue) {
                const input = document.getElementById(denom.id);
                input.value = savedValue;
                calculateDenominationSum(denom.value, savedValue, denom.sumId);
            }
        });
        
        // Загружаем состояние расчетов
        const savedIsCalculated = localStorage.getItem('cashAppIsCalculated');
        if (savedIsCalculated === 'true') {
            isCalculated = true;
            
            // Восстанавливаем результаты
            const savedResults = localStorage.getItem('cashAppResults');
            const savedTotal = localStorage.getItem('cashAppTotal');
            const savedDifference = localStorage.getItem('cashAppDifference');
            const savedDifferenceColor = localStorage.getItem('cashAppDifferenceColor');
            
            if (savedResults && savedTotal && savedDifference) {
                denomResults.innerHTML = savedResults;
                totalAmountElement.textContent = savedTotal;
                differenceElement.textContent = savedDifference;
                
                if (savedDifferenceColor) {
                    differenceElement.style.color = savedDifferenceColor;
                }
                
                resultCard.classList.remove('hidden');
            }
        }
        
        // Обновляем текст кнопки
        updateCalculateButtonText();
    }

    // Настройка слушателей событий
    function setupEventListeners() {
        // Переключение темы
        themeToggleButton.addEventListener('click', toggleTheme);
        
        // Сброс данных
        resetButton.addEventListener('click', () => {
            confirmDialog.classList.remove('hidden');
        });
        
        // Диалог подтверждения очистки
        confirmYesButton.addEventListener('click', resetAllFields);
        confirmNoButton.addEventListener('click', () => {
            confirmDialog.classList.add('hidden');
        });
        
        // Расчет
        calculateButton.addEventListener('click', calculateTotal);
        
        // Закрытие диалога при клике вне его
        confirmDialog.addEventListener('click', (e) => {
            if (e.target === confirmDialog) {
                confirmDialog.classList.add('hidden');
            }
        });
    }

    // Переключение темы
    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        
        if (isDarkTheme) {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('cashAppTheme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('cashAppTheme', 'light');
        }
        
        // Обновляем иконку темы
        updateThemeIcon();
        
        // Обновляем цвет разницы если она равна 0
        updateDifferenceColorForZero();
    }

    // Обновление иконки темы
    function updateThemeIcon() {
        const icon = themeToggleButton.querySelector('i');
        if (isDarkTheme) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // Настройка текстовых наблюдателей для номиналов
    function setupTextWatchers() {
        denominations.forEach(denom => {
            const input = document.getElementById(denom.id);
            
            // Слушатель для реального времени подсчета суммы
            input.addEventListener('input', () => {
                const countStr = input.value;
                calculateDenominationSum(denom.value, countStr, denom.sumId);
                saveDenominationValue(denom.id, countStr);
                
                // Проверяем, нужно ли изменить текст кнопки
                if (isCalculated && !hasChangesAfterCalculation) {
                    hasChangesAfterCalculation = true;
                    updateCalculateButtonText();
                }
            });
            
            // Слушатель для изменения текста кнопки на "Обновить"
            input.addEventListener('input', () => {
                if (isCalculated && !hasChangesAfterCalculation) {
                    hasChangesAfterCalculation = true;
                    updateCalculateButtonText();
                }
            });
        });
        
        // Слушатель для целевой суммы
        targetAmountInput.addEventListener('input', () => {
            if (isCalculated && !hasChangesAfterCalculation) {
                hasChangesAfterCalculation = true;
                updateCalculateButtonText();
            }
        });
    }

    // Подсчет суммы для номинала
    function calculateDenominationSum(denomination, countStr, sumId) {
        try {
            const count = countStr === '' ? 0 : parseInt(countStr, 10);
            const sum = count * denomination;
            const sumElement = document.getElementById(sumId);
            sumElement.textContent = formatNumber(sum);
        } catch (e) {
            const sumElement = document.getElementById(sumId);
            sumElement.textContent = '0';
        }
    }

    // Настройка форматирования целевой суммы
    function setupTargetAmountFormatting() {
        targetAmountInput.addEventListener('input', function(e) {
            // Сохраняем позицию курсора
            const cursorPosition = this.selectionStart;
            
            // Получаем введенное значение
            let input = this.value;
            
            // Сохраняем, удаляем ли пользователь символы
            const isDeleting = e.inputType === 'deleteContentBackward' || 
                              e.inputType === 'deleteContentForward';
            
            // Удаляем все символы, кроме цифр и точки
            let cleaned = input.replace(/[^\d.]/g, '');
            
            // Удаляем лишние точки (оставляем только первую)
            const parts = cleaned.split('.');
            if (parts.length > 2) {
                cleaned = parts[0] + '.' + parts.slice(1).join('');
            }
            
            // Ограничиваем дробную часть до 2 символов
            if (parts.length > 1) {
                cleaned = parts[0] + '.' + parts[1].substring(0, 2);
            }
            
            // Форматируем целую часть с пробелами
            if (parts[0]) {
                const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                cleaned = integerPart + (parts.length > 1 ? '.' + parts[1] : '');
            }
            
            // Обновляем значение
            this.value = cleaned;
            currentFormattedTarget = cleaned;
            
            // Восстанавливаем позицию курсора
            setTimeout(() => {
                let newCursorPosition = cursorPosition;
                
                if (!isDeleting && cleaned.length > input.length) {
                    // При добавлении символов корректируем позицию
                    newCursorPosition += (cleaned.length - input.length);
                }
                
                // Ограничиваем позицию курсора длиной строки
                newCursorPosition = Math.min(newCursorPosition, cleaned.length);
                this.setSelectionRange(newCursorPosition, newCursorPosition);
            }, 0);
            
            // Сохраняем значение
            saveTargetAmount(cleaned);
        });
    }

    // Обновление текста кнопки расчета
    function updateCalculateButtonText() {
        calculateButton.textContent = hasChangesAfterCalculation ? 'Обновить' : 'Рассчитать';
    }

    // Сброс всех полей
    function resetAllFields() {
        // Очищаем все поля ввода
        targetAmountInput.value = '';
        currentFormattedTarget = '';
        
        denominations.forEach(denom => {
            const input = document.getElementById(denom.id);
            input.value = '';
            const sumElement = document.getElementById(denom.sumId);
            sumElement.textContent = '0';
        });
        
        // Скрываем карточку результатов
        resultCard.classList.add('hidden');
        
        // Сбрасываем состояние
        isCalculated = false;
        hasChangesAfterCalculation = false;
        updateCalculateButtonText();
        
        // Очищаем localStorage
        clearLocalStorage();
        
        // Скрываем диалог
        confirmDialog.classList.add('hidden');
        
        // Прокручиваем наверх
        window.scrollTo(0, 0);
        
        // Показываем уведомление
        showToast('Все данные очищены');
    }

    // Расчет итоговой суммы
    function calculateTotal() {
        try {
            // Получаем целевую сумму
            const targetAmountStr = currentFormattedTarget.replace(/\s/g, '');
            if (!targetAmountStr) {
                showToast('Введите целевую сумму');
                return;
            }
            
            const targetAmount = parseFloat(targetAmountStr) || 0;
            
            // Рассчитываем суммы по номиналам
            let totalAmount = 0;
            let resultsHTML = '';
            
            denominations.forEach(denom => {
                const input = document.getElementById(denom.id);
                const countStr = input.value;
                const count = countStr === '' ? 0 : parseInt(countStr, 10);
                const sum = count * denom.value;
                totalAmount += sum;
                
                // Формируем результаты в формате "количествошт.| номинал | сумма"
                resultsHTML += `<div>${count}шт.| ${denom.value} | ${formatNumber(sum)}</div>`;
            });
            
            // Рассчитываем разницу
            const difference = totalAmount - targetAmount;
            let differenceText = '';
            
            if (difference > 0) {
                differenceText = `+${formatNumber(difference)}`;
                differenceElement.style.color = 'var(--success-color)';
            } else if (difference < 0) {
                differenceText = formatNumber(difference);
                differenceElement.style.color = 'var(--error-color)';
            } else {
                differenceText = '0';
                updateDifferenceColorForZero();
            }
            
            // Обновляем UI с результатами
            denomResults.innerHTML = resultsHTML;
            totalAmountElement.textContent = formatNumber(totalAmount);
            differenceElement.textContent = differenceText;
            
            // Показываем карточку с результатами
            resultCard.classList.remove('hidden');
            
            // Устанавливаем флаг, что расчет произведен
            isCalculated = true;
            hasChangesAfterCalculation = false;
            updateCalculateButtonText();
            
            // Сохраняем результаты
            saveResults(resultsHTML, formatNumber(totalAmount), differenceText, differenceElement.style.color);
            
            // Прокручиваем к результатам
            setTimeout(() => {
                resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
            
        } catch (e) {
            showToast('Проверьте правильность введенных данных');
            console.error('Ошибка расчета:', e);
        }
    }

    // Обновление цвета разницы для нулевого значения
    function updateDifferenceColorForZero() {
        if (differenceElement.textContent === '0') {
            differenceElement.style.color = isDarkTheme ? 'white' : 'black';
        }
    }

    // Форматирование числа с разделителями
    function formatNumber(num) {
        return num.toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Показ уведомления
    function showToast(message) {
        toast.textContent = message;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    // Сохранение целевой суммы
    function saveTargetAmount(value) {
        localStorage.setItem('cashAppTargetAmount', value);
    }

    // Сохранение значения номинала
    function saveDenominationValue(id, value) {
        localStorage.setItem(`cashApp_${id}`, value);
    }

    // Сохранение результатов
    function saveResults(results, total, difference, differenceColor) {
        localStorage.setItem('cashAppResults', results);
        localStorage.setItem('cashAppTotal', total);
        localStorage.setItem('cashAppDifference', difference);
        localStorage.setItem('cashAppDifferenceColor', differenceColor);
        localStorage.setItem('cashAppIsCalculated', 'true');
    }

    // Очистка localStorage
    function clearLocalStorage() {
        localStorage.removeItem('cashAppTargetAmount');
        localStorage.removeItem('cashAppResults');
        localStorage.removeItem('cashAppTotal');
        localStorage.removeItem('cashAppDifference');
        localStorage.removeItem('cashAppDifferenceColor');
        localStorage.removeItem('cashAppIsCalculated');
        
        denominations.forEach(denom => {
            localStorage.removeItem(`cashApp_${denom.id}`);
        });
    }

    // Запуск приложения
    init();
});