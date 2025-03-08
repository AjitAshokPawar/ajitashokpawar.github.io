let displayValue = '0';
let isNewCalculation = true;
const display = document.getElementById('display');
const calculator = document.querySelector('.calculator');

// Theme Management
function toggleTheme() {
    const body = document.body;
    const isLight = body.getAttribute('data-theme') === 'light';
    body.setAttribute('data-theme', isLight ? 'dark' : 'light');
    localStorage.setItem('theme', isLight ? 'dark' : 'light');
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
}

// Display Management
function updateDisplay() {
    display.textContent = displayValue.replace(/\*/g, '×').replace(/\//g, '÷');
    display.style.fontSize = displayValue.length > 10 ? '2rem' : '3rem';
}

// Calculation Engine
function calculateResult() {
    try {
        let expression = displayValue
            .replace(/×/g, '*')
            .replace(/÷/g, '/');

        const result = eval(expression);
        
        if (typeof result === 'number' && !isNaN(result)) {
            createPopOutAnimation(result.toString());
            setTimeout(() => {
                displayValue = result.toString();
                isNewCalculation = true;
                updateDisplay();
            }, 800);
        }
    } catch (error) {
        displayValue = 'Error';
        setTimeout(() => {
            displayValue = '0';
            isNewCalculation = true;
            updateDisplay();
        }, 1000);
    }
}

// Animation Effects
function createPopOutAnimation(result) {
    const displayRect = display.getBoundingClientRect();
    
    // Glow Trail
    const glow = document.createElement('div');
    glow.className = 'glow-trail';
    glow.style.left = `${displayRect.left + displayRect.width/2 - 50}px`;
    glow.style.top = `${displayRect.top}px`;
    document.body.appendChild(glow);
    
    // Pop-out Text
    const popOut = document.createElement('div');
    popOut.className = 'pop-out-effect';
    popOut.textContent = result;
    popOut.style.left = `${displayRect.left + displayRect.width/2 - 30}px`;
    popOut.style.top = `${displayRect.top}px`;
    popOut.style.fontSize = display.style.fontSize;
    document.body.appendChild(popOut);
    
    // Star Particles
    for(let i = 0; i < 12; i++) {
        const star = document.createElement('div');
        star.className = 'star-particle';
        star.style.left = `${displayRect.left + displayRect.width/2 - 2}px`;
        star.style.top = `${displayRect.top}px`;
        star.style.setProperty('--tx', `${Math.random() * 100 - 50}px`);
        star.style.setProperty('--ty', `${Math.random() * -100 - 50}px`);
        document.body.appendChild(star);
    }
    
    // Cleanup
    setTimeout(() => {
        glow.remove();
        popOut.remove();
        document.querySelectorAll('.star-particle').forEach(star => star.remove());
    }, 1200);
}

// Event Listeners
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;
        if (value === '=') {
            calculateResult();
        } else if (value === 'C') {
            displayValue = '0';
            isNewCalculation = true;
        } else {
            if (isNewCalculation && !'+-×÷'.includes(value)) {
                displayValue = '';
                isNewCalculation = false;
            }
            displayValue = displayValue === '0' ? value : displayValue + value;
        }
        updateDisplay();
    });
});

document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);

document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key === 'Enter') calculateResult();
    else if (key === 'Backspace') displayValue = displayValue.slice(0, -1) || '0';
    else if (key === 'Escape') displayValue = '0';
    else if ('0123456789+-*/.'.includes(key)) {
        if (isNewCalculation && !'+-×÷'.includes(key)) {
            displayValue = '';
            isNewCalculation = false;
        }
        displayValue = displayValue === '0' ? key : displayValue + key;
    }
    updateDisplay();
});

// Initialize
initTheme();
updateDisplay();