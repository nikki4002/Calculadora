const previousOperandElement = document.querySelector("#previous-operand");
const currentOperandElement = document.querySelector("#current-operand");
const themeToggle = document.querySelector("#theme-toggle");

let currentOperand = "0";
let previousOperand = "";
let operation = null;
let shouldResetDisplay = false;

const operators = { "+": "+", "-": "−", "*": "×", "/": "÷" };

function updateDisplay() {
  currentOperandElement.textContent = currentOperand;
  previousOperandElement.textContent = operation
    ? `${previousOperand} ${operators[operation]}`
    : "";
}

function resetCalculator() {
  currentOperand = "0";
  previousOperand = "";
  operation = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function appendDigit(digit) {
  if (shouldResetDisplay) {
    currentOperand = digit;
    shouldResetDisplay = false;
  } else if (currentOperand === "0") {
    currentOperand = digit;
  } else {
    currentOperand += digit;
  }
  updateDisplay();
}

function appendDecimal() {
  if (shouldResetDisplay) {
    currentOperand = "0";
    shouldResetDisplay = false;
  }
  if (!currentOperand.includes(".")) currentOperand += ".";
  updateDisplay();
}

function chooseOperator(nextOperation) {
  if (operation && !shouldResetDisplay) calculate();
  previousOperand = currentOperand;
  operation = nextOperation;
  shouldResetDisplay = true;
  updateDisplay();
}

function calculate() {
  if (!operation || previousOperand === "") return;

  const firstNumber = Number(previousOperand);
  const secondNumber = Number(currentOperand);
  let result;

  switch (operation) {
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
      result = secondNumber === 0 ? null : firstNumber / secondNumber;
      break;
  }

  currentOperand = result === null
    ? "Não é possível dividir por zero"
    : String(Number(result.toPrecision(12)));
  previousOperand = "";
  operation = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function deleteDigit() {
  if (shouldResetDisplay) {
    currentOperand = "0";
    shouldResetDisplay = false;
  } else {
    currentOperand = currentOperand.length > 1 ? currentOperand.slice(0, -1) : "0";
  }
  updateDisplay();
}

function handleCalculatorAction(action, value) {
  if (action === "digit") {
    appendDigit(value);
  } else {
    if (action === "decimal") appendDecimal();
    if (action === "operator") chooseOperator(value);
    if (action === "equals") calculate();
    if (action === "clear") resetCalculator();
    if (action === "delete") deleteDigit();
  }
}

document.querySelector(".keypad").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  handleCalculatorAction(button.dataset.action, button.dataset.value);
});

document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (/^\d$/.test(key)) handleCalculatorAction("digit", key);
  else if (key === "." || key === ",") handleCalculatorAction("decimal");
  else if (["+", "-", "*", "/"].includes(key)) handleCalculatorAction("operator", key);
  else if (key === "Enter" || key === "=") handleCalculatorAction("equals");
  else if (key === "Backspace") handleCalculatorAction("delete");
  else if (key === "Escape") handleCalculatorAction("clear");
});

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Ativar tema claro" : "Ativar tema escuro",
  );
  document.querySelector("#theme-icon").textContent = isDark ? "☀️" : "🌙";
});

updateDisplay();
