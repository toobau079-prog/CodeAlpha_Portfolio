const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

let currentInput = "";
let previousInput = "";
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
    currentDisplay.textContent = currentInput || "0";

    if (operator && previousInput) {
        previousDisplay.textContent = `${previousInput} ${getOperatorSymbol(operator)}`;
    } else {
        previousDisplay.textContent = "";
    }
}

function getOperatorSymbol(value) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷",
        "%": "%"
    };

    return symbols[value] || value;
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = "";
        shouldResetDisplay = false;
    }

    if (currentInput === "0") {
        currentInput = number;
    } else {
        currentInput += number;
    }

    updateDisplay();
}

function appendDecimal() {
    if (shouldResetDisplay) {
        currentInput = "";
        shouldResetDisplay = false;
    }

    if (!currentInput.includes(".")) {
        currentInput = currentInput === "" ? "0." : currentInput + ".";
    }

    updateDisplay();
}

function chooseOperator(selectedOperator) {
    if (currentInput === "" && previousInput === "") {
        return;
    }

    if (previousInput !== "" && operator !== null && currentInput !== "") {
        calculate();
    }

    previousInput = currentInput;
    currentInput = "";
    operator = selectedOperator;

    updateDisplay();
}

function calculate() {
    if (previousInput === "" || currentInput === "" || operator === null) {
        return;
    }

    const firstNumber = parseFloat(previousInput);
    const secondNumber = parseFloat(currentInput);

    let result;

    switch (operator) {
        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":
            if (secondNumber === 0) {
                showError("Cannot divide by zero");
                return;
            }
            result = firstNumber / secondNumber;
            break;

        case "%":
            result = firstNumber % secondNumber;
            break;

        default:
            return;
    }

    result = Number(result.toFixed(10));

    currentInput = String(result);
    previousInput = "";
    operator = null;
    shouldResetDisplay = true;

    updateDisplay();
}

function clearCalculator() {
    currentInput = "";
    previousInput = "";
    operator = null;
    shouldResetDisplay = false;

    updateDisplay();
}

function deleteLast() {
    if (shouldResetDisplay) {
        clearCalculator();
        return;
    }

    currentInput = currentInput.slice(0, -1);

    updateDisplay();
}

function showError(message) {
    currentDisplay.textContent = message;
    previousDisplay.textContent = "";

    currentInput = "";
    previousInput = "";
    operator = null;
    shouldResetDisplay = true;
}

document.querySelectorAll("[data-value]").forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;

        if (!isNaN(value)) {
            appendNumber(value);
        } else if (value === ".") {
            appendDecimal();
        } else {
            chooseOperator(value);
        }
    });
});

document.querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);

document.querySelector('[data-action="delete"]')
    .addEventListener("click", deleteLast);

document.querySelector('[data-action="calculate"]')
    .addEventListener("click", calculate);

document.addEventListener("keydown", event => {
    const key = event.key;

    if (key >= "0" && key <= "9") {
        appendNumber(key);
        return;
    }

    if (key === ".") {
        appendDecimal();
        return;
    }

    if (["+", "-", "*", "/", "%"].includes(key)) {
        chooseOperator(key);
        return;
    }

    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
        return;
    }

    if (key === "Backspace") {
        deleteLast();
        return;
    }

    if (key === "Escape") {
        clearCalculator();
    }
});

updateDisplay();