// How long each step shows (milliseconds)
const WAIT_MODAL_MS = 7000;  // "Wait up to 4 hours..." modal
const LOADING_MS = 2500;     // loading popup, then the page refreshes

// Back button goes to this page. Change it to your own file (e.g. 'Login.html').
// Leave it empty ('') to just go to the previous page instead.
const BACK_REDIRECT_URL = 'index.html';

const form = document.getElementById('resetForm');
const fields = ['userId', 'oldPass', 'newPass'].map(id => document.getElementById(id));
const formError = document.getElementById('formError');
const enterBtn = document.getElementById('enterBtn');
const waitModal = document.getElementById('waitModal');
const loadingModal = document.getElementById('loadingModal');
let busy = false;

// Eye indicator: show / hide password
document.querySelectorAll('.eye').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.setAttribute('aria-pressed', String(show));
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');

    btn.classList.remove('blink');
    void btn.offsetWidth; // restart the blink animation
    btn.classList.add('blink');
  });
  btn.addEventListener('animationend', () => btn.classList.remove('blink'));
});

// Clear the error as the user fills each field
fields.forEach(f => f.addEventListener('input', () => {
  f.classList.remove('invalid');
  if (fields.every(x => x.value.trim())) formError.hidden = true;
}));

form.addEventListener('submit', e => {
  e.preventDefault();
  if (busy) return;

  const empty = fields.filter(f => !f.value.trim());
  fields.forEach(f => {
    f.classList.remove('invalid');
    if (!f.value.trim()) {
      void f.offsetWidth; // restart the shake animation
      f.classList.add('invalid');
    }
  });
  if (empty.length) {
    formError.hidden = false;
    empty[0].focus();
    return;
  }

  busy = true;
  enterBtn.disabled = true;

  // 1) wait modal for 7 seconds
  waitModal.style.setProperty('--wait', WAIT_MODAL_MS + 'ms');
  waitModal.classList.add('open');

  setTimeout(() => {
    // 2) loading popup, then refresh
    waitModal.classList.remove('open');
    loadingModal.classList.add('open');

    setTimeout(() => {
      form.reset();
      window.location.reload();
    }, LOADING_MS);
  }, WAIT_MODAL_MS);
});

document.getElementById('backBtn').addEventListener('click', () => {
  if (BACK_REDIRECT_URL) window.location.href = "../UserInteraction/UserI.html";
  else history.back();
});