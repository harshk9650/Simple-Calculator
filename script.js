// Calculator functionality
// We'll store the current display value and calculation history

let currentDisplay = '0';  // Current value shown on display
let calculationHistory = '';  // Stores the full calculation
let lastResult = null;  // Stores the last calculated result
let lastOperator = null;  // Stores the last operator used

// Get references to display elements
const displayElement = document.getElementById('display');
const historyElement = document.getElementById('history');

// Function to update the display
function updateDisplay() {
    displayElement.textContent = currentDisplay;
    historyElement.textContent = calculationHistory;
}

// Function to append a value to the display
function appendToDisplay(value) {
    // If display shows '0' or a result, replace it (unless it's a decimal)
    if (currentDisplay === '0' && value !== '.') {
        currentDisplay = value;
    } 
    // If last result exists and user presses an operator, continue from result
    else if (lastResult !== null && ['+', '-', '*', '/'].includes(value)) {
        calculationHistory = lastResult + ' ' + value + ' ';
        currentDisplay = value;
        lastResult = null;
    }
    // If user presses an operator
    else if (['+', '-', '*', '/'].includes(value)) {
        // Add space around operator for readability
        calculationHistory += ' ' + currentDisplay + ' ' + value + ' ';
        currentDisplay = value;
        lastOperator = value;
    }
    // If user presses a number or decimal
    else {
        // Prevent multiple decimals in one number
        if (value === '.' && currentDisplay.includes('.')) {
            return;
        }
        
        // If current display is an operator, start new number
        if (['+', '-', '*', '/'].includes(currentDisplay)) {
            currentDisplay = value;
        } else {
            currentDisplay += value;
        }
    }
    
    updateDisplay();
}

// Function to clear the display
function clearDisplay() {
    currentDisplay = '0';
    calculationHistory = '';
    lastResult = null;
    lastOperator = null;
    updateDisplay();
}

// Function to calculate the result
function calculateResult() {
    try {
        // If there's nothing to calculate, do nothing
        if (calculationHistory === '' && lastResult === null) {
            return;
        }
        
        // Prepare the expression for evaluation
        let expression = '';
        
        // If we have history, use it with current display
        if (calculationHistory !== '') {
            expression = calculationHistory + currentDisplay;
        } 
        // If we have a last result and operator, continue calculation
        else if (lastResult !== null && lastOperator !== null) {
            expression = lastResult + lastOperator + currentDisplay;
        }
        
        // Clean up the expression for evaluation
        expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
        
        // Evaluate the expression
        // Note: Using eval() is simple for beginners but should be avoided 
        // in production for security reasons
        const result = eval(expression);
        
        // Store the result and update display
        lastResult = result.toString();
        calculationHistory = expression + ' =';
        currentDisplay = formatNumber(result);
        
        updateDisplay();
        
    } catch (error) {
        // Handle calculation errors
        currentDisplay = 'Error';
        calculationHistory = 'Invalid calculation';
        updateDisplay();
        
        // Reset after 2 seconds
        setTimeout(clearDisplay, 2000);
    }
}

// Function to format numbers (limit decimal places)
function formatNumber(num) {
    // If it's not a number, return as is
    if (isNaN(num) || !isFinite(num)) {
        return 'Error';
    }
    
    // Convert to string
    let numStr = num.toString();
    
    // If it's a decimal, limit to 10 decimal places
    if (numStr.includes('.')) {
        const parts = numStr.split('.');
        if (parts[1].length > 10) {
            return num.toFixed(10).replace(/\.?0+$/, '');
        }
    }
    
    return numStr;
}

// Initialize the calculator display
updateDisplay();

// Add keyboard support for better UX
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Number keys
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    }
    // Decimal point
    else if (key === '.') {
        appendToDisplay('.');
    }
    // Operators
    else if (key === '+') {
        appendToDisplay('+');
    }
    else if (key === '-') {
        appendToDisplay('-');
    }
    else if (key === '*') {
        appendToDisplay('*');
    }
    else if (key === '/') {
        event.preventDefault(); // Prevent browser shortcut
        appendToDisplay('/');
    }
    // Equals or Enter
    else if (key === '=' || key === 'Enter') {
        event.preventDefault(); // Prevent form submission if any
        calculateResult();
    }
    // Clear or Escape
    else if (key === 'Escape' || key === 'Delete') {
        clearDisplay();
    }
    // Backspace
    else if (key === 'Backspace') {
        // Remove last character
        if (currentDisplay.length > 1) {
            currentDisplay = currentDisplay.slice(0, -1);
        } else {
            currentDisplay = '0';
        }
        updateDisplay();
    }
});