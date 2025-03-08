let displayValue = '0';
let historyValue = '';
let isNewCalculation = true;

function updateDisplay() {
    const display = document.getElementById('display');
    const history = document.getElementById('history');
    
    // Update display with proper symbols
    display.textContent = displayValue.replace(/\*/g, '×').replace(/\//g, '÷');
    history.textContent = historyValue;

    // Auto-scale font size for large numbers
    if (displayValue.length > 12) {
        display.style.fontSize = '1.8rem';
    } else if (displayValue.length > 8) {
        display.style.fontSize = '2.4rem';
    } else {
        display.style.fontSize = '3rem';
    }
}

function handleInput(value) {
    if (isNewCalculation && !'+-×÷'.includes(value)) {
        displayValue = '';
        isNewCalculation = false;
    }

    // Handle special characters
    switch(value) {
        case '√':
            displayValue += 'Math.sqrt(';
            break;
        case 'C':
            displayValue = '0';
            historyValue = '';
            isNewCalculation = true;
            break;
        default:
            displayValue = displayValue === '0' ? value : displayValue + value;
    }
    
    updateDisplay();
}

function calculateResult() {
    try {
        let expression = displayValue
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/√/g, 'Math.sqrt')
            .replace(/%/g, '/100')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan');

        // Auto-close parentheses only for math functions
        const functionCalls = (expression.match(/(Math\.sqrt|Math\.sin|Math\.cos|Math\.tan)/g) || []).length;
        const closeParens = (expression.match(/\)/g) || []).length;
        expression += ')'.repeat(functionCalls - closeParens);

        // Handle percentage calculations properly
        expression = expression.replace(/(\d+)%/g, '($1/100)');

        const result = eval(expression);
        
        if (typeof result === 'number' && !isNaN(result)) {
            historyValue = `${displayValue}=`;
            
            // Format result correctly
            if (Number.isInteger(result)) {
                displayValue = result.toString();
            } else {
                // Show max 6 decimal places and trim trailing zeros
                displayValue = result.toFixed(6).replace(/\.?0+$/, '');
            }
            
            isNewCalculation = true;
            
            // Clear history after 2.5 seconds
            setTimeout(() => {
                historyValue = '';
                updateDisplay();
            }, 2500);
        }
    } catch (error) {
        displayValue = 'Error';
        historyValue = '';
        updateDisplay();
        setTimeout(() => {
            displayValue = '0';
            updateDisplay();
        }, 1000);
    }
}

// Button click handlers
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;
        
        if (value === '=') {
            calculateResult();
        } else {
            handleInput(value);
        }
        updateDisplay();
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    const keyMap = {
        'Enter': '=',
        'Backspace': '⌫',
        'Escape': 'C',
        '*': '×',
        '/': '÷'
    };

    // Prevent default actions for calculator keys
    if (key in keyMap || key >= '0' && key <= '9' || ['+', '-', '.', '%', '(', ')'].includes(key)) {
        e.preventDefault();
    }

    switch(key) {
        case 'Enter':
            calculateResult();
            break;
        case 'Backspace':
            displayValue = displayValue.slice(0, -1) || '0';
            break;
        case 'Escape':
            displayValue = '0';
            historyValue = '';
            isNewCalculation = true;
            break;
        case 's':
            handleInput('sin(');
            break;
        case 'c':
            handleInput('cos(');
            break;
        case 't':
            handleInput('tan(');
            break;
        default:
            if (key in keyMap) {
                handleInput(keyMap[key]);
            } else if (key >= '0' && key <= '9' || ['+', '-', '*', '/', '.', '%', '(', ')'].includes(key)) {
                handleInput(key);
            }
    }
    
    updateDisplay();
});

// Initial setup
updateDisplay();

// Mobile touch improvements
document.addEventListener('touchstart', function() {}, true);
document.documentElement.style.touchAction = 'manipulation';