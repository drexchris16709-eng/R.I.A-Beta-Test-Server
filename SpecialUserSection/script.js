const VALID_PINS = ["1234", "5678", "0000", "1111", "9999", "4321", "8888"];
let chancesLeft = 2;

const pinInput = document.getElementById('pinInput');
const togglePin = document.getElementById('togglePin');
const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMsg');
const loadingModal = document.getElementById('loadingModal');
const backBtn = document.getElementById('backBtn');

backBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "index.html";
    }
});

togglePin.addEventListener('mousedown', function(e) {
    e.preventDefault();
});

togglePin.addEventListener('click', function() {
    const isHidden = pinInput.type === 'password';
    pinInput.type = isHidden ? 'text' : 'password';
    togglePin.classList.toggle('showing', isHidden);
    togglePin.setAttribute('aria-pressed', String(isHidden));
    togglePin.setAttribute('aria-label', isHidden ? 'Hide PIN' : 'Show PIN');
});

loginBtn.addEventListener('click', function() {
    const enteredVal = pinInput.value.trim();

    if (VALID_PINS.includes(enteredVal)) {
        errorMsg.textContent = "";

        loadingModal.classList.add('active');

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 4000);
    } else {
        if (chancesLeft > 0) {
            errorMsg.textContent = `you have ${chancesLeft} more chances or your account will be lock temporarily`;
            chancesLeft--;
        } else {
            errorMsg.textContent = "account is locked temporarily due to multiple failed attempts.";
            pinInput.disabled = true;
            loginBtn.disabled = true;
            togglePin.disabled = true;
        }
    }
});

pinInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        loginBtn.click();
    }
});