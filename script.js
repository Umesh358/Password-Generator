// ==================== JAVASCRIPT FOR BEGINNERS ====================
// Everything is explained with comments so you can learn easily!

// Step 1: Get all elements from HTML
const passwordDisplay = document.getElementById('password-display');
const lengthSlider = document.getElementById('length-slider');
const lengthValue = document.getElementById('length-value');
const lengthValueDisplay = document.getElementById('length-value-display');

const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');

const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');

const strengthContainer = document.getElementById('strength-container');
const strengthText = document.getElementById('strength-text');
const bar1 = document.getElementById('bar1');
const bar2 = document.getElementById('bar2');
const bar3 = document.getElementById('bar3');

// Step 2: Update length value when slider moves
lengthSlider.addEventListener('input', function() {
    lengthValue.textContent = this.value;
    lengthValueDisplay.textContent = this.value;
});

// Character sets grouped cleanly into an Object
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Helper: Get one random character from a string (Using Arrow Function syntax)
const getRandomChar = (str) => str[Math.floor(Math.random() * str.length)];

// Main function to generate password
function generatePassword() {
    const length = parseInt(lengthSlider.value);

    // Step 3: Array Magic! Group options and filter out the unchecked ones.
    const activeOptions = [
        { isChecked: uppercaseCheck.checked, chars: charSets.uppercase },
        { isChecked: lowercaseCheck.checked, chars: charSets.lowercase },
        { isChecked: numbersCheck.checked, chars: charSets.numbers },
        { isChecked: symbolsCheck.checked, chars: charSets.symbols }
    ].filter(option => option.isChecked);

    // If user didn't select anything
    if (activeOptions.length === 0) {
        alert("⚠️ Please select at least one option (Uppercase, Lowercase, Numbers, or Symbols)!");
        return;
    }

    let password = '';
    let allowedChars = '';

    // Step 4: Guarantee one char from each selected type & build the pool
    activeOptions.forEach(option => {
        password += getRandomChar(option.chars); // Guarantees at least one
        allowedChars += option.chars;            // Adds to the total allowed pool
    });

    // Step 5: Fill the rest of the password
    const remaining = length - password.length;
    for (let i = 0; i < remaining; i++) {
        password += getRandomChar(allowedChars);
    }

    // Step 6: Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    // Show the password and strength
    passwordDisplay.textContent = password;
    showStrength(length, activeOptions.length);
}

// Simple strength meter
function showStrength(length, activeTypesCount) {
    strengthContainer.style.display = 'flex';
    strengthText.style.display = 'block';

    let score = 0;

    // Score based on length
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;

    // Score based on variety of characters (1 to 4 types)
    if (activeTypesCount >= 2) score++;
    if (activeTypesCount >= 3) score++;
    if (activeTypesCount === 4) score++;

    // Reset bars efficiently using an array and forEach
    const bars = [bar1, bar2, bar3];
    bars.forEach(bar => bar.classList.remove('filled'));

    // Fill bars based on score
    if (score >= 2) bars[0].classList.add('filled');
    if (score >= 4) bars[1].classList.add('filled');
    if (score >= 6) bars[2].classList.add('filled');

    // Text feedback
    if (score >= 6) {
        strengthText.textContent = '🔥 Very Strong';
        strengthText.style.color = '#27ae60';
    } else if (score >= 4) {
        strengthText.textContent = '👍 Strong';
        strengthText.style.color = '#f39c12';
    } else if (score >= 2) {
        strengthText.textContent = '⚠️ Medium';
        strengthText.style.color = '#e67e22';
    } else {
        strengthText.textContent = '❌ Weak';
        strengthText.style.color = '#e74c3c';
    }
}

// Variable to store our timer so we can cancel it if needed
let copyTimer;

// Copy password to clipboard
copyBtn.addEventListener('click', function() {
    const password = passwordDisplay.textContent;

    if (!password) {
        alert("❌ Generate a password first!");
        return;
    }

    navigator.clipboard.writeText(password).then(() => {
        // 1. If they click fast, cancel the previous countdown!
        clearTimeout(copyTimer);

        // 2. Change button appearance
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = '#27ae60';

        // 3. Start a fresh 2-second countdown
        copyTimer = setTimeout(() => {
            copyBtn.textContent = '📋 Copy to Clipboard'; // Hardcoded reset
            copyBtn.style.background = 'var(--primary)';
        }, 1000);

    }).catch(() => {
        alert("❌ Could not copy (try another browser)");
    });
});

// Event Listeners for Generation
generateBtn.addEventListener('click', generatePassword);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') generatePassword();
});
