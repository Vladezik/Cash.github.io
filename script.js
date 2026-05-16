class CashApp {
    constructor() {
        this.denominations = [
            { value: 1000, label: '1000 ₴' },
            { value: 500,  label: '500 ₴' },
            { value: 200,  label: '200 ₴' },
            { value: 100,  label: '100 ₴' },
            { value: 50,   label: '50 ₴' },
            { value: 20,   label: '20 ₴' }
        ];
        
        this.saveTimeout = null;
        this.isDark = true;
        this.hasCalculated = false;
        this.isDirty = false;
        this.baseCounts = {};
        this.init();
    }

    init() {
        this.cacheDOM();
        this.loadTheme();
        this.renderDenoms();
        this.loadSavedData();
        this.setupEventListeners();
        this.renderHistory();
        this.updateProgress();
    }

    cacheDOM() {
        this.dom = {
            themeToggle: document.getElementById('themeToggle'),
            historyToggle: document.getElementById('historyToggle'),
            targetAmount: document.getElementById('targetAmount'),
            calculateBtn: document.getElementById('calculateBtn'),
            resultCard: document.getElementById('resultCard'),
            receiptBody: document.getElementById('receiptBody'),
            receiptTotal: document.getElementById('receiptTotal'),
            receiptDiff: document.getElementById('receiptDiff'),
            receiptDiffRow: document.getElementById('receiptDiffRow'),
            receiptTime: document.getElementById('receiptTime'),
            saveToHistoryBtn: document.getElementById('saveToHistoryBtn'),
            resetBtn: document.getElementById('resetBtn'),
            confirmDialog: document.getElementById('confirmDialog'),
            confirmYes: document.getElementById('confirmYes'),
            confirmNo: document.getElementById('confirmNo'),
            toast: document.getElementById('toast'),
            progressBox: document.getElementById('progressBox'),
            progressCurrent: document.getElementById('progressCurrent'),
            progressFill: document.getElementById('progressFill'),
            progressPercent: document.getElementById('progressPercent'),
            historySheet: document.getElementById('historySheet'),
            historyList: document.getElementById('historyList'),
            clearHistoryBtn: document.getElementById('clearHistoryBtn'),
            exportHistoryBtn: document.getElementById('exportHistoryBtn'),
            confettiContainer: document.getElementById('confettiContainer')
        };
    }

    loadTheme() {
        const saved = localStorage.getItem('cashTheme');
        if (saved) {
            this.isDark = saved === 'dark';
        } else {
            this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        this.applyTheme();
    }

    applyTheme() {
        document.body.classList.toggle('dark-theme', this.isDark);
        document.body.classList.toggle('light-theme', !this.isDark);
        const icon = this.dom.themeToggle.querySelector('i');
        icon.className = this.isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        this.applyTheme();
        localStorage.setItem('cashTheme', this.isDark ? 'dark' : 'light');
    }

    renderDenoms() {
        const grid = document.getElementById('denomsGrid');
        grid.innerHTML = this.denominations.map(d => `
            <div class="denom-card" data-value="${d.value}">
                <div class="denom-value">${d.label}</div>
                <div class="denom-controls">
                    <button class="denom-btn btn-dec" data-value="${d.value}">−</button>
                    <input type="number" 
                           id="denom${d.value}" 
                           class="denom-input" 
                           value="" 
                           placeholder="0" 
                           min="0" 
                           inputmode="numeric">
                    <button class="denom-btn btn-inc" data-value="${d.value}">+</button>
                </div>
                <div class="denom-sum" id="sum${d.value}"></div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        this.dom.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        this.dom.historyToggle.addEventListener('click', () => this.openHistory());
        this.dom.historySheet.querySelector('.sheet-overlay').addEventListener('click', () => this.closeHistory());
        this.dom.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        this.dom.exportHistoryBtn.addEventListener('click', () => this.exportHistory());
        
        this.dom.targetAmount.addEventListener('input', (e) => {
            this.handleTargetInput(e);
            this.markDirty();
        });
        this.dom.targetAmount.addEventListener('focus', () => this.dom.progressBox.classList.add('visible'));
        
        document.querySelectorAll('.btn-inc').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleIncrement(e);
                this.markDirty();
            });
        });
        document.querySelectorAll('.btn-dec').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleDecrement(e);
                this.markDirty();
            });
        });
        document.querySelectorAll('.denom-input').forEach(input => {
            input.addEventListener('input', (e) => {
                this.handleDenomInput(e);
                this.markDirty();
            });
            input.addEventListener('focus', () => this.dom.progressBox.classList.add('visible'));
        });
        
        document.querySelectorAll('.denom-card').forEach(card => {
            this.setupSwipe(card);
        });
        
        this.dom.calculateBtn.addEventListener('click', () => this.calculate());
        this.dom.saveToHistoryBtn.addEventListener('click', () => this.saveCurrentToHistory());
        
        this.dom.resetBtn.addEventListener('click', () => this.dom.confirmDialog.classList.remove('hidden'));
        this.dom.confirmYes.addEventListener('click', () => this.resetAll());
        this.dom.confirmNo.addEventListener('click', () => this.dom.confirmDialog.classList.add('hidden'));
        this.dom.confirmDialog.addEventListener('click', (e) => {
            if (e.target === this.dom.confirmDialog) this.dom.confirmDialog.classList.add('hidden');
        });
    }

    markDirty() {
        if (this.hasCalculated) {
            this.isDirty = true;
            this.updateButtonText();
        }
    }

    updateButtonText() {
        const btn = this.dom.calculateBtn;
        const span = btn.querySelector('span');
        const icon = btn.querySelector('i');
        
        if (this.isDirty && this.hasCalculated) {
            span.textContent = 'Обновить';
            icon.className = 'fas fa-sync-alt';
        } else {
            span.textContent = 'Рассчитать';
            icon.className = 'fas fa-calculator';
        }
    }

    handleTargetInput(e) {
        const input = e.target;
        let val = input.value.replace(/[^\d.]/g, '');
        const parts = val.split('.');
        if (parts.length > 2) val = parts[0] + '.' + parts[1];
        if (parts[1]) val = parts[0] + '.' + parts[1].slice(0, 2);
        
        if (parts[0]) {
            const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            val = intPart + (parts[1] ? '.' + parts[1] : '');
        }
        
        input.value = val;
        this.debouncedSave();
        this.updateProgress();
    }

    normalizeTarget(val) {
        if (!val) return '';
        return val.toString().replace(/\s/g, '').replace(/,/g, '.');
    }

    handleIncrement(e) {
        const value = parseInt(e.target.dataset.value);
        const input = document.getElementById(`denom${value}`);
        input.value = (parseInt(input.value) || 0) + 1;
        this.vibrate(15);
        this.updateDenomSum(value);
        this.debouncedSave();
        this.updateProgress();
    }

    handleDecrement(e) {
        const value = parseInt(e.target.dataset.value);
        const input = document.getElementById(`denom${value}`);
        const current = parseInt(input.value) || 0;
        if (current > 0) {
            input.value = current - 1;
            this.vibrate(10);
            this.updateDenomSum(value);
            this.debouncedSave();
            this.updateProgress();
        }
    }

    handleDenomInput(e) {
        const input = e.target;
        const value = parseInt(input.closest('.denom-card').dataset.value);
        if (input.value.length > 1 && input.value.startsWith('0')) {
            input.value = input.value.replace(/^0+/, '');
        }
        this.updateDenomSum(value);
        this.debouncedSave();
        this.updateProgress();
    }

    // === ИСПРАВЛЕНО: добавлена инициализация currentX ===
    setupSwipe(card) {
        let startX = 0;
        let currentX = 0;
        
        card.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            currentX = startX; // <-- исправление
            card.style.transition = 'none';
        }, { passive: true });
        
        card.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            if (diff < 0) {
                card.style.transform = `translateX(${diff}px)`;
                card.style.opacity = 1 + (diff / 200);
            }
        }, { passive: true });
        
        card.addEventListener('touchend', () => {
            const diff = currentX - startX;
            card.style.transition = 'all 0.3s';
            
            if (diff < -80) {
                const value = parseInt(card.dataset.value);
                const input = document.getElementById(`denom${value}`);
                if (input.value) {
                    input.value = '';
                    this.updateDenomSum(value);
                    this.vibrate(20);
                    this.showToast(`${value} ₴ обнулено`);
                    this.debouncedSave();
                    this.updateProgress();
                    this.markDirty();
                }
                card.style.transform = '';
                card.style.opacity = '';
            } else {
                card.style.transform = '';
                card.style.opacity = '';
            }
        });
    }

    updateDenomSum(value) {
        const input = document.getElementById(`denom${value}`);
        const count = parseInt(input.value) || 0;
        const sumEl = document.getElementById(`sum${value}`);

        if (!this.hasCalculated) {
            sumEl.textContent = '';
            sumEl.className = 'denom-sum';
            return;
        }

        const base = this.baseCounts[value] || 0;
        const delta = count - base;

        sumEl.className = 'denom-sum';

        if (delta > 0) {
            sumEl.textContent = `+${delta}`;
            sumEl.classList.add('positive');
        } else if (delta < 0) {
            sumEl.textContent = `${delta}`;
            sumEl.classList.add('negative');
        } else {
            sumEl.textContent = '0';
            sumEl.classList.add('zero');
        }
    }

    updateProgress() {
        const target = this.parseTarget();
        const current = this.calculateCurrentTotal();
        
        this.dom.progressCurrent.textContent = this.formatNumber(current);
        
        if (target > 0) {
            const ratio = Math.min(current / target, 1);
            const percent = Math.round((current / target) * 100);
            
            const hue = ratio * 135;
            const saturation = 90;
            const lightness = 55;
            
            this.dom.progressFill.style.background = 
                `linear-gradient(90deg, hsl(${hue}, ${saturation}%, ${lightness}%), hsl(${hue}, ${saturation}%, ${lightness + 8}%))`;
            this.dom.progressFill.style.boxShadow = 
                `0 0 12px hsla(${hue}, ${saturation}%, ${lightness}%, 0.35)`;
            
            let widthPct = Math.min(percent, 100);
            
            if (current > target) {
                widthPct = 100;
                this.dom.progressFill.style.background = 
                    `linear-gradient(90deg, hsl(0, 95%, 55%), hsl(0, 95%, 65%))`;
                this.dom.progressFill.style.boxShadow = 
                    `0 0 12px hsla(0, 95%, 55%, 0.35)`;
            }
            
            this.dom.progressFill.style.width = widthPct + '%';
            this.dom.progressPercent.textContent = percent + '%';
        } else {
            this.dom.progressFill.style.width = '0%';
            this.dom.progressPercent.textContent = '0%';
        }
    }

    calculateCurrentTotal() {
        return this.denominations.reduce((sum, d) => {
            const val = parseInt(document.getElementById(`denom${d.value}`).value) || 0;
            return sum + (val > 0 ? val * d.value : 0);
        }, 0);
    }

    parseTarget() {
        const val = this.normalizeTarget(this.dom.targetAmount.value);
        const parsed = parseFloat(val);
        return isNaN(parsed) ? 0 : Math.max(0, parsed);
    }

    calculate() {
        const target = this.parseTarget();
        if (!target) {
            this.showToast('Введите целевую сумму');
            this.dom.targetAmount.focus();
            return;
        }

        const current = this.calculateCurrentTotal();
        const diff = current - target;
        
        let html = '';
        this.denominations.forEach(d => {
            const count = parseInt(document.getElementById(`denom${d.value}`).value) || 0;
            if (count > 0) {
                const sum = count * d.value;
                html += `
                    <div class="receipt-line">
                        <span><span class="count">${count} шт.</span> × ${d.label}</span>
                        <span class="amount">${this.formatNumber(sum)} ₴</span>
                    </div>
                `;
            }
        });
        
        if (!html) {
            this.showToast('Введите хотя бы один номинал');
            return;
        }
        
        if (diff >= -100) {
            this.launchConfetti();
        }
        
        this.dom.receiptBody.innerHTML = html;
        this.dom.receiptTotal.textContent = this.formatNumber(current) + ' ₴';
        
        this.dom.receiptDiffRow.classList.remove('positive', 'negative', 'zero');
        if (diff > 0) {
            this.dom.receiptDiff.textContent = '+' + this.formatNumber(diff) + ' ₴';
            this.dom.receiptDiffRow.classList.add('positive');
        } else if (diff < 0) {
            this.dom.receiptDiff.textContent = this.formatNumber(diff) + ' ₴';
            this.dom.receiptDiffRow.classList.add('negative');
        } else {
            this.dom.receiptDiff.textContent = 'Сошлось! 🎉';
            this.dom.receiptDiffRow.classList.add('zero');
            this.vibrate([50, 50, 50, 50, 100]);
        }
        
        this.dom.receiptTime.textContent = new Date().toLocaleString('ru-RU');
        this.dom.resultCard.classList.remove('hidden');
        
        setTimeout(() => {
            this.dom.resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
        this.denominations.forEach(d => {
            const count = parseInt(document.getElementById(`denom${d.value}`).value) || 0;
            this.baseCounts[d.value] = count;
        });
        
        this.hasCalculated = true;
        this.isDirty = false;
        this.updateButtonText();
        
        this.denominations.forEach(d => this.updateDenomSum(d.value));
        
        this.saveResults();
    }

    formatNumber(num) {
        return num.toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    launchConfetti() {
        const colors = [
            '#ff4757', '#2ed573', '#1e90ff', '#ffa502', 
            '#ff6b81', '#7c5cff', '#ffd700', '#00d2d3', '#ff9ff3'
        ];
        const container = this.dom.confettiContainer;
        container.innerHTML = '';
        
        for (let i = 0; i < 90; i++) {
            const el = document.createElement('div');
            el.className = 'confetti-piece';
            
            const startX = 50 + (Math.random() * 20 - 10);
            el.style.left = startX + '%';
            el.style.bottom = '-10px';
            
            const size = Math.random() * 8 + 4;
            el.style.width = size + 'px';
            el.style.height = size + 'px';
            el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            el.style.borderRadius = Math.random() > 0.4 ? '50%' : '2px';
            
            const drift = (Math.random() * 100 - 50) + 'vw';
            el.style.setProperty('--drift', drift);
            
            el.style.animationName = 'confettiRise';
            el.style.animationDuration = (Math.random() * 1.5 + 2) + 's';
            el.style.animationDelay = (Math.random() * 0.4) + 's';
            el.style.animationTimingFunction = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            container.appendChild(el);
        }
        
        setTimeout(() => container.innerHTML = '', 4000);
    }

    saveCurrentToHistory() {
        const target = this.parseTarget();
        const current = this.calculateCurrentTotal();
        const diff = current - target;
        
        const denoms = {};
        this.denominations.forEach(d => {
            const count = parseInt(document.getElementById(`denom${d.value}`).value) || 0;
            if (count > 0) denoms[d.value] = count;
        });
        
        const item = {
            id: Date.now(),
            date: new Date().toLocaleString('ru-RU'),
            target,
            total: current,
            diff,
            denoms
        };
        
        const history = this.getHistory();
        history.unshift(item);
        if (history.length > 30) history.pop();
        
        localStorage.setItem('cashHistory', JSON.stringify(history));
        this.renderHistory();
        this.showToast('Сохранено в историю');
        this.vibrate(30);
    }

    getHistory() {
        try {
            return JSON.parse(localStorage.getItem('cashHistory')) || [];
        } catch {
            return [];
        }
    }

    renderHistory() {
        const history = this.getHistory();
        const list = this.dom.historyList;
        
        if (!history.length) {
            list.innerHTML = '<div class="history-empty">История пуста</div>';
            return;
        }
        
        const fragment = document.createDocumentFragment();
        
        history.forEach(item => {
            const total = parseFloat(item.total);
            const target = parseFloat(item.target);
            const diff = parseFloat(item.diff);
            
            if (isNaN(total) || isNaN(target) || isNaN(diff)) {
                return;
            }
            
            const diffClass = diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'zero';
            const diffText = diff > 0 ? `+${this.formatNumber(diff)}` : 
                            diff < 0 ? this.formatNumber(diff) : 'Сошлось!';
            
            let denomsHtml = '';
            if (item.denoms && Object.keys(item.denoms).length > 0) {
                const denomsList = Object.entries(item.denoms)
                    .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
                    .map(([val, count]) => `${count}×${val}₴`)
                    .join(', ');
                denomsHtml = `<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">${denomsList}</div>`;
            }
            
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <div class="history-item-info">
                    <div class="history-item-date">${this.escapeHtml(item.date)}</div>
                    <div class="history-item-sum">${this.formatNumber(total)} ₴ / цель ${this.formatNumber(target)} ₴</div>
                    <div class="history-item-diff ${diffClass}">${diffText} ₴</div>
                    ${denomsHtml}
                </div>
                <div class="history-item-actions">
                    <button class="history-btn" data-action="load" data-id="${item.id}" title="Загрузить">
                        <i class="fas fa-upload"></i>
                    </button>
                    <button class="history-btn" data-action="delete" data-id="${item.id}" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            fragment.appendChild(div);
        });
        
        list.innerHTML = '';
        list.appendChild(fragment);
        
        list.querySelectorAll('[data-action="load"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                if (!isNaN(id)) this.loadHistoryItem(id);
            });
        });
        
        list.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                if (!isNaN(id)) this.deleteHistoryItem(id);
            });
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadHistoryItem(id) {
        const history = this.getHistory();
        const item = history.find(h => h.id === id);
        if (!item) {
            this.showToast('Элемент истории не найден');
            return;
        }
        
        const target = parseFloat(item.target);
        if (isNaN(target) || target <= 0) {
            this.showToast('Некорректная целевая сумма');
            return;
        }
        
        this.dom.targetAmount.value = this.formatNumberForInput(target);
        
        this.denominations.forEach(d => {
            const count = item.denoms && item.denoms[d.value] ? parseInt(item.denoms[d.value]) : 0;
            document.getElementById(`denom${d.value}`).value = count > 0 ? count : '';
        });
        
        this.closeHistory();
        this.updateProgress();
        
        this.calculate();
        
        this.showToast('Данные загружены');
    }

    deleteHistoryItem(id) {
        if (!isNaN(id)) {
            let history = this.getHistory();
            history = history.filter(h => h.id !== id);
            localStorage.setItem('cashHistory', JSON.stringify(history));
            this.renderHistory();
            this.showToast('Удалено из истории');
        }
    }

    clearHistory() {
        if (!confirm('Очистить всю историю?')) return;
        localStorage.removeItem('cashHistory');
        this.renderHistory();
        this.showToast('История очищена');
    }

    exportHistory() {
        const history = this.getHistory();
        if (!history.length) {
            this.showToast('История пуста');
            return;
        }

        const csv = [
            ['Дата', 'Целевая сумма', 'Итого', 'Разница'].join('\t'),
            ...history.map(h => [
                h.date,
                h.target.toString(),
                h.total.toString(),
                h.diff.toString()
            ].join('\t'))
        ].join('\n');

        const json = JSON.stringify(history, null, 2);
        
        const data = {
            csv: csv,
            json: json,
            timestamp: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cash-history-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showToast('История экспортирована');
    }

    openHistory() {
        this.dom.historySheet.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeHistory() {
        this.dom.historySheet.classList.add('hidden');
        document.body.style.overflow = '';
    }

    debouncedSave() {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => this.saveToStorage(), 400);
    }

    saveToStorage() {
        const data = {
            target: this.normalizeTarget(this.dom.targetAmount.value),
            denoms: {},
            hasCalculated: this.hasCalculated,
            baseCounts: this.baseCounts
        };
        this.denominations.forEach(d => {
            const val = parseInt(document.getElementById(`denom${d.value}`).value);
            if (val > 0) data.denoms[d.value] = val;
        });
        localStorage.setItem('cashAppData', JSON.stringify(data));
    }

    loadSavedData() {
        try {
            const data = JSON.parse(localStorage.getItem('cashAppData'));
            if (!data) return;
            
            if (data.hasCalculated && data.baseCounts) {
                this.hasCalculated = true;
                this.baseCounts = data.baseCounts;
            }
            
            if (data.target) {
                const parsed = parseFloat(data.target);
                if (!isNaN(parsed) && parsed > 0) {
                    this.dom.targetAmount.value = this.formatNumberForInput(parsed);
                }
            }
            
            if (data.denoms && typeof data.denoms === 'object') {
                Object.entries(data.denoms).forEach(([value, count]) => {
                    const intValue = parseInt(value);
                    const intCount = parseInt(count);
                    if (!isNaN(intValue) && !isNaN(intCount) && intCount > 0) {
                        const input = document.getElementById(`denom${intValue}`);
                        if (input) {
                            input.value = intCount;
                        }
                    }
                });
            }
            
            this.denominations.forEach(d => this.updateDenomSum(d.value));
        } catch (e) {
            console.error('Load error:', e);
        }
    }

    formatNumberForInput(num) {
        return num.toLocaleString('ru-RU', {
            minimumFractionDigits: num % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2
        });
    }

    saveResults() {
        this.saveToStorage();
    }

    resetAll() {
        clearTimeout(this.saveTimeout);
        localStorage.removeItem('cashAppData');
        
        this.dom.targetAmount.value = '';
        this.baseCounts = {};
        this.hasCalculated = false;
        this.isDirty = false;
        this.updateButtonText();
        
        this.denominations.forEach(d => {
            document.getElementById(`denom${d.value}`).value = '';
            this.updateDenomSum(d.value);
        });
        
        this.dom.resultCard.classList.add('hidden');
        this.dom.progressBox.classList.remove('visible');
        this.dom.progressFill.style.width = '0%';
        this.dom.progressPercent.textContent = '0%';
        this.dom.confirmDialog.classList.add('hidden');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.showToast('Все данные очищены');
        this.vibrate(20);
    }

    vibrate(pattern) {
        if (navigator.vibrate) navigator.vibrate(pattern);
    }

    showToast(msg) {
        const toast = this.dom.toast;
        toast.textContent = msg;
        toast.classList.remove('hidden');
        toast.classList.add('visible');
        
        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 2500);
    }
}

const app = new CashApp();
