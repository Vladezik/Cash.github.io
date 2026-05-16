:root {
    --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    
    /* Dark theme (default) */
    --bg: #0f0f12;
    --surface: #1a1a1f;
    --surface-elevated: #22222a;
    --text: #f0f0f5;
    --text-secondary: #8e8e99;
    --primary: #7c5cff;
    --primary-light: #9f85ff;
    --success: #00d084;
    --danger: #ff4757;
    --warning: #ffa502;
    --border: rgba(255,255,255,0.06);
    --shadow: 0 8px 32px rgba(0,0,0,0.4);
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
}

body.light-theme {
    --bg: #f2f2f7;
    --surface: #ffffff;
    --surface-elevated: #f7f7f9;
    --text: #1c1c1e;
    --text-secondary: #8e8e93;
    --primary: #5856d6;
    --primary-light: #7c7ce0;
    --success: #34c759;
    --danger: #ff3b30;
    --warning: #ff9500;
    --border: rgba(0,0,0,0.06);
    --shadow: 0 8px 32px rgba(0,0,0,0.08);
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    font-family: var(--font);
}

body {
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    line-height: 1.5;
    transition: background 0.3s, color 0.3s;
    overflow-x: hidden;
}

.app {
    max-width: 560px;
    margin: 0 auto;
    padding: 20px 16px 40px;
}

/* Header */
.app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
}

.app-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.5px;
}

.icon-btn {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    border: none;
    background: var(--surface);
    color: var(--text);
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-sm);
    transition: all 0.2s;
}

.icon-btn:active {
    transform: scale(0.92);
    opacity: 0.8;
}

/* Sections */
.section-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-secondary);
    margin-bottom: 10px;
    padding-left: 4px;
}

/* Target */
.target-section {
    margin-bottom: 24px;
}

.target-input-wrap {
    position: relative;
    background: var(--surface);
    border-radius: 16px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 20px;
    transition: border-color 0.2s;
}

.target-input-wrap:focus-within {
    border-color: var(--primary);
}

#targetAmount {
    width: 100%;
    padding: 18px 0;
    border: none;
    background: transparent;
    color: var(--text);
    font-size: 28px;
    font-weight: 700;
    outline: none;
    letter-spacing: -0.5px;
}

#targetAmount::placeholder {
    color: var(--text-secondary);
    opacity: 0.4;
}

.currency {
    font-size: 22px;
    font-weight: 600;
    color: var(--primary);
    margin-left: 8px;
}

/* Progress */
.progress-box {
    margin-top: 16px;
    background: var(--surface);
    border-radius: 14px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    opacity: 0;
    transform: translateY(-8px);
    transition: all 0.3s;
    pointer-events: none;
}

.progress-box.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 8px;
}

.progress-info strong {
    color: var(--text);
}

.progress-track {
    height: 8px;
    background: rgba(255,255,255,0.08);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
}

body.light-theme .progress-track {
    background: rgba(0,0,0,0.06);
}

.progress-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.4s;
}

/* Denominations */
.denoms-section {
    margin-bottom: 24px;
}

.denoms-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
}

.denom-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    border-radius: 18px;
    background: var(--surface-elevated);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    user-select: none;
}

.denom-card:active {
    transform: scale(0.98);
}

.denom-value {
    font-size: 22px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.5px;
}

.denom-controls {
    display: flex;
    align-items: center;
    gap: 14px;
    z-index: 1;
}

.denom-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: var(--surface);
    color: var(--text);
    font-size: 22px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    border: 1px solid var(--border);
}

body.light-theme .denom-btn {
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.denom-btn:active {
    transform: scale(1.12);
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

.denom-input {
    width: 70px;
    text-align: center;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px 4px;
    color: var(--text);
    font-size: 20px;
    font-weight: 700;
    outline: none;
    -moz-appearance: textfield;
}

.denom-input::-webkit-outer-spin-button,
.denom-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.denom-input::placeholder {
    color: var(--text-secondary);
    opacity: 0.5;
}

/* === ОБНОВЛЕННЫЕ СТИЛИ ДЛЯ ДЕЛЬТ === */
.denom-sum {
    position: absolute;
    bottom: 10px;
    right: 20px;
    font-size: 13px;
    font-weight: 700;
    z-index: 1;
    letter-spacing: 0.3px;
    transition: color 0.2s, opacity 0.2s;
    min-width: 28px;
    text-align: right;
    opacity: 0;
}

.denom-sum:not(:empty) {
    opacity: 1;
}

.denom-sum.positive {
    color: var(--success);
}

.denom-sum.negative {
    color: var(--danger);
}

.denom-sum.zero {
    color: var(--text-secondary);
    opacity: 0.35;
}
/* ==================================== */

/* Buttons */
.btn-primary {
    width: 100%;
    padding: 18px;
    border-radius: 16px;
    border: none;
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    color: white;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 4px 20px rgba(124,92,255,0.3), var(--shadow-sm);
    transition: all 0.2s;
    margin-bottom: 20px;
}

.btn-primary:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(124,92,255,0.2);
}

.btn-secondary {
    flex: 1;
    padding: 14px;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
}

.btn-secondary:active {
    background: var(--surface-elevated);
    transform: scale(0.97);
}

.btn-text-danger {
    width: 100%;
    padding: 14px;
    border-radius: 14px;
    border: none;
    background: transparent;
    color: var(--danger);
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    opacity: 0.8;
    transition: opacity 0.2s;
}

.btn-text-danger:active {
    opacity: 1;
    background: rgba(255,71,87,0.08);
}

/* Result Card */
.result-card {
    margin-bottom: 20px;
    animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-card.hidden {
    display: none;
}

.receipt {
    background: var(--surface);
    border-radius: 20px;
    padding: 24px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
    position: relative;
}

.receipt::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: var(--primary);
    border-radius: 2px;
    opacity: 0.5;
}

.receipt-header {
    text-align: center;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--text-secondary);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.receipt-divider {
    height: 1px;
    background: repeating-linear-gradient(
        to right,
        var(--border) 0,
        var(--border) 6px,
        transparent 6px,
        transparent 12px
    );
    margin: 14px 0;
}

.receipt-body {
    font-size: 14px;
    line-height: 2;
}

.receipt-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.receipt-line .count {
    color: var(--text-secondary);
    font-variant-numeric: tabular-nums;
}

.receipt-line .amount {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.receipt-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 700;
}

#receiptTotal {
    color: var(--success);
    font-size: 22px;
}

.receipt-diff-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid var(--border);
    font-size: 16px;
}

.receipt-diff-row.positive #receiptDiff {
    color: var(--success);
}

.receipt-diff-row.negative #receiptDiff {
    color: var(--danger);
}

.receipt-diff-row.zero #receiptDiff {
    color: var(--warning);
    font-weight: 700;
}

.receipt-time {
    text-align: center;
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 16px;
}

.result-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
}

/* History Sheet */
.sheet {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.sheet.hidden {
    display: none;
}

.sheet-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    animation: fadeIn 0.2s;
}

.sheet-content {
    position: relative;
    background: var(--surface);
    border-radius: 24px 24px 0 0;
    padding: 20px 20px 40px;
    max-height: 70vh;
    overflow-y: auto;
    animation: slideUpSheet 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 -8px 40px rgba(0,0,0,0.3);
}

.sheet-handle {
    width: 40px;
    height: 4px;
    background: var(--text-secondary);
    border-radius: 2px;
    margin: 0 auto 16px;
    opacity: 0.3;
}

.sheet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.sheet-header h3 {
    font-size: 20px;
    font-weight: 700;
}

.btn-text-small {
    background: none;
    border: none;
    color: var(--danger);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 4px 8px;
    transition: opacity 0.2s;
}

.btn-text-small:active {
    opacity: 0.7;
}

.history-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.history-item {
    background: var(--surface-elevated);
    border-radius: 14px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--border);
    animation: fadeIn 0.3s;
}

.history-item-info {
    flex: 1;
}

.history-item-date {
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: 4px;
}

.history-item-sum {
    font-size: 16px;
    font-weight: 700;
}

.history-item-diff {
    font-size: 13px;
    margin-top: 2px;
}

.history-item-diff.positive { color: var(--success); }
.history-item-diff.negative { color: var(--danger); }
.history-item-diff.zero { color: var(--warning); font-weight: 600; }

.history-item-actions {
    display: flex;
    gap: 8px;
}

.history-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: none;
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}

.history-empty {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
    font-size: 15px;
}

/* Dialog */
.dialog-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(6px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.2s;
}

.dialog-overlay.hidden {
    display: none;
}

.dialog {
    background: var(--surface);
    border-radius: 24px;
    padding: 28px;
    width: 100%;
    max-width: 360px;
    text-align: center;
    box-shadow: var(--shadow);
    animation: scaleIn 0.2s;
}

.dialog-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(255,71,87,0.1);
    color: var(--danger);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin: 0 auto 16px;
}

.dialog h3 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
}

.dialog p {
    color: var(--text-secondary);
    font-size: 15px;
    margin-bottom: 24px;
    line-height: 1.5;
}

.dialog-buttons {
    display: flex;
    gap: 12px;
}

.btn-dialog {
    flex: 1;
    padding: 14px;
    border-radius: 14px;
    border: none;
    background: var(--surface-elevated);
    color: var(--text);
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-dialog:active {
    transform: scale(0.96);
}

.btn-dialog-primary {
    background: var(--danger);
    color: white;
}

/* Toast */
.toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: var(--surface-elevated);
    color: var(--text);
    padding: 14px 24px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
    z-index: 3000;
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    white-space: nowrap;
    max-width: 90vw;
    overflow: hidden;
    text-overflow: ellipsis;
}

.toast.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

.toast.hidden {
    display: none;
}

.confetti-container {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 2500;
    overflow: hidden;
}

.confetti-piece {
    position: absolute;
    bottom: -10px;
    animation: confettiRise forwards;
    will-change: transform, opacity;
}

@keyframes confettiRise {
    0% { 
        transform: translateY(0) translateX(0) rotate(0deg) scale(1); 
        opacity: 1; 
    }
    20% {
        opacity: 1;
    }
    100% { 
        transform: translateY(-120vh) translateX(var(--drift, 0)) rotate(1080deg) scale(0.2); 
        opacity: 0; 
    }
}

/* Animations */
@keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUpSheet {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}

/* Scrollbar */
::-webkit-scrollbar {
    width: 6px;
}
::-webkit-scrollbar-track {
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background: var(--text-secondary);
    border-radius: 3px;
    opacity: 0.3;
}

/* Responsive */
@media (min-width: 640px) {
    .denoms-grid {
        grid-template-columns: 1fr 1fr;
    }
    
    .app {
        padding: 32px 24px 60px;
    }
}

@media (max-width: 360px) {
    #targetAmount {
        font-size: 24px;
    }
    
    .denom-value {
        font-size: 18px;
    }
    
    .denom-btn {
        width: 40px;
        height: 40px;
    }
    
    .denom-input {
        width: 60px;
        font-size: 18px;
    }
}
