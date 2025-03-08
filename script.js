let displayValue = '0';
let historyValue = '';
let isNewCalculation = true;

function updateDisplay() {
    const display = document.getElementById('display');
    const history = document.getElementById('history');
    
    display.textContent = displayValue.replace(/\*/g, '×').replace(/\//g, '÷');
    history.textContent = historyValue;
    
    // Auto-scale font size for large numbers
    if (displayValue.length > 10) {
        display.style.fontSize = '2rem';
    } else {
        display.style.fontSize = '2.8rem';
    }
}

function handleInput(value) {
    if (isNewCalculation && !'+-*/'.includes(value)) {
        displayValue = '';
        isNewCalculation = false;
    }
    
    if (value === '√') {
        displayValue += 'Math.sqrt(';
    } else if (value === 'C') {
        displayValue = '0';
        historyValue = '';
        isNewCalculation = true;
    } else {
        displayValue = displayValue === '0' ? value : displayValue + value;
    }
}

function calculateResult() {
    try {
        let expression = displayValue
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/√/g, 'Math.sqrt')
            .replace(/%/g, '/100*')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan');

        // Add closing parenthesis if missing
        const openParens = (expression.match(/\(/g) || []).length;
        const closeParens = (expression.match(/\)/g) || []).length;
        expression += ')'.repeat(openParens - closeParens);

        const result = eval(expression);
        
        if (typeof result === 'number' && !isNaN(result)) {
            historyValue = `${displayValue} =`;
            displayValue = String(result.includes('.') ? result.toFixed(4) : result);
            isNewCalculation = true;
            
            setTimeout(() => {
                historyValue = '';
                updateDisplay();
            }, 2500);
        }
    } catch (error) {
        displayValue = 'Error';
        setTimeout(() => {
            displayValue = '0';
            updateDisplay();
        }, 1000);
    }
}

// Event Listeners
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;
        
        if (value === '=') {
            calculateResult();
        } else if (value === 'C') {
            displayValue = '0';
            historyValue = '';
            isNewCalculation = true;
        } else {
            handleInput(value);
        }
        
        updateDisplay();
    });
});

document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        handleInput(key);
    } else if (['+', '-', '*', '/', '(', ')', '%'].includes(key)) {
        handleInput(key);
    } else if (key === 'Enter') {
        calculateResult();
    } else if (key === 'Backspace') {
        displayValue = displayValue.slice(0, -1) || '0';
        isNewCalculation = false;
    } else if (key === 'Escape') {
        displayValue = '0';
        historyValue = '';
        isNewCalculation = true;
    } else if (key === 's' || key === 'c' || key === 't') {
        handleInput(`${key}(`);
    }
    
    updateDisplay();
});

// Initial display
updateDisplay();

// Prevent context menu on mobile
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Prevent zoom on mobile
document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.style.touchAction = 'manipulation';
});