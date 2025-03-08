let displayValue = '0';
let isNewCalculation = true;

// Theme Management
function toggleTheme() {
    const body = document.body;
    const isLight = body.getAttribute('data-theme') === 'light';
    body.setAttribute('data-theme', isLight ? 'dark' : 'light');
    localStorage.setItem('theme', isLight ? 'dark' : 'light');
}

// Initialize Theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
}

// Display Management
function updateDisplay() {
    const display = document.getElementById('display');
    display.textContent = displayValue.replace(/\*/g, '×').replace(/\//g, '÷');
    display.style.fontSize = displayValue.length > 10 ? '2rem' : '3rem';
}

// Input Handling
function handleInput(value) {
    if (isNewCalculation && !'+-×÷'.includes(value)) {
        displayValue = '';
        isNewCalculation = false;
    }

    if (value === 'C') {
        displayValue = '0';
        isNewCalculation = true;
    } else {
        displayValue = displayValue === '0' ? value : displayValue + value;
    }
    updateDisplay();
}

// Calculation Engine
function calculateResult() {
    try {
        let expression = displayValue
            .replace(/×/g, '*')
            .replace(/÷/g, '/');

        const result = eval(expression);
        
        if (typeof result === 'number' && !isNaN(result)) {
            displayValue = result.toString();
            isNewCalculation = true;
            
            // Celebration effect
            document.querySelector('.calculator').classList.add('celebrate');
            setTimeout(() => {
                document.querySelector('.calculator').classList.remove('celebrate');
            }, 500);
        }
    } catch (error) {
        displayValue = 'Error';
        setTimeout(() => {
            displayValue = '0';
            isNewCalculation = true;
            updateDisplay();
        }, 1000);
    }
    updateDisplay();
}

// Event Listeners
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;
        value === '=' ? calculateResult() : handleInput(value);
    });
});

document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);

document.addEventListener('keydown', (e) => {
    const key = e.key;
    const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','+','-','*','/','.','Enter','Backspace','Escape'];
    
    if (!allowedKeys.includes(key)) return;
    
    e.preventDefault();
    
    if (key === 'Enter') calculateResult();
    else if (key === 'Backspace') displayValue = displayValue.slice(0, -1) || '0';
    else if (key === 'Escape') displayValue = '0';
    else handleInput(key);
    
    updateDisplay();
});

// Initialize
initTheme();
updateDisplay();

// Create floating particles
for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${5 + Math.random() * 10}s infinite linear;
    `;
    document.querySelector('.particles').appendChild(particle);
}