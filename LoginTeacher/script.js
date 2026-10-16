function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  
  if (sidebar && overlay) {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  }
}

  const studentDatabase = [
      { contact: "100", password: "123", page: "../Lumpod/SD.html" },
      { contact: "100000000002", password: "studentPass2", page: "dashboard.html" },
      { contact: "100000000003", password: "mySecret456", page: "dashboard.html" },
      { contact: "100000000004", password: "loginPass2026", page: "dashboard.html" },
      { contact: "100000000005", password: "passkeyVal5", page: "dashboard.html" },
      { contact: "100000000006", password: "student6Key", page: "dashboard.html" },
      { contact: "100000000007", password: "adminPassword7", page: "dashboard.html" }
    ];

const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

if (togglePasswordBtn && passwordInput) {
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    togglePasswordBtn.classList.toggle('active', isPassword);
  });
}

const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const enteredLRN = document.getElementById('lrn').value.trim();
    const enteredPassword = passwordInput.value;

    const student = studentDatabase.find(
      s => s.lrn === enteredLRN && s.password === enteredPassword
    );

    const modalOverlay = document.getElementById("modalOverlay");
    const modal1 = document.getElementById("loadingModal1");
    const modal2 = document.getElementById("loadingModal2");
    const modal3 = document.getElementById("loadingModal3");

    if (student) {
      if (errorMsg) errorMsg.style.display = 'none';

      if (modalOverlay) modalOverlay.style.display = "flex";
      if (modal1) modal1.style.display = "block";

      setTimeout(() => {
        if (modal1) modal1.style.display = "none";
        if (modal2) modal2.style.display = "block";

        setTimeout(() => {
          if (modal2) modal2.style.display = "none";
          if (modal3) modal3.style.display = "block";

          setTimeout(() => {
            window.location.href = student.page;
          }, 2000);

        }, 4000);

      }, 8000);

    } else {
      if (errorMsg) {
        errorMsg.style.display = 'block';
      } else {
        alert("Invalid LRN or Password.");
      }
    }
  });
}

const infoModal = document.getElementById('infoModal');
const csModal = document.getElementById('customerServiceModal');
const chatUsModal = document.getElementById('chatUsModal');

const openInfoModal = document.getElementById('openInfoModal');
if (openInfoModal) {
  openInfoModal.addEventListener('click', () => {
    toggleSidebar();
    if (infoModal) infoModal.classList.add('show');
  });
}

const closeInfoModal = document.getElementById('closeInfoModal');
if (closeInfoModal) closeInfoModal.addEventListener('click', () => infoModal.classList.remove('show'));

const openCsModal = document.getElementById('openCsModal');
if (openCsModal) {
  openCsModal.addEventListener('click', () => {
    toggleSidebar();
    if (csModal) csModal.classList.add('show');
  });
}

const closeCsModal = document.getElementById('closeCsModal');
if (closeCsModal) closeCsModal.addEventListener('click', () => csModal.classList.remove('show'));

const openChatUsModal = document.getElementById('openChatUsModal');
if (openChatUsModal) {
  openChatUsModal.addEventListener('click', () => {
    toggleSidebar();
    if (chatUsModal) chatUsModal.classList.add('show');
  });
}

const closeChatUsModal = document.getElementById('closeChatUsModal');
if (closeChatUsModal) closeChatUsModal.addEventListener('click', () => chatUsModal.classList.remove('show'));

window.addEventListener('click', (e) => {
  if (e.target === infoModal) {
    infoModal.classList.remove('show');
  }
  if (e.target === csModal) {
    csModal.classList.remove('show');
  }
  if (e.target === chatUsModal) {
    chatUsModal.classList.remove('show');
  }
});

const csChatBody = document.getElementById('csChatBody');
const csMessageInput = document.getElementById('csMessageInput');

function handleCsOption(optionText) {
  appendCsUserMessage(optionText);
  
  setTimeout(() => {
    let botReply = "Thank you for reaching out regarding " + optionText + ". A support representative will review your request shortly.";
if (optionText === 'Account Termination') {
      botReply = "To process an account termination request, please provide a detailed statement explaining your reasons for closing the account. Once submitted, please remain available and wait for a customer service agent to review your case and assist you with the final steps.";
    } else if (optionText === 'Create An Account') {
      botReply = "To create a new account, please locate and click the 'Create Account' button within the choices menu. Carefully fill out all required fields in the registration form and submit your details. Please allow up to 24 hours for our system to process your application. If your account is still not created after the 24-hour window has passed, please select 'Report a Bug' from the menu so our support team can assist you further.";
    } else if (optionText === 'Report a Bug') {
      botReply = "Please describe the bug or technical issue you encountered in as much detail as possible, including what you were trying to do and any error messages you saw. This will help our customer service and engineering teams thoroughly investigate and resolve the problem for you.";
    }
    appendCsBotMessage(botReply);
  }, 600);
}

function sendCsMessage() {
  if (!csMessageInput) return;
  const text = csMessageInput.value.trim();
  if (text === "") return;
  
  appendCsUserMessage(text);
  csMessageInput.value = "";

  setTimeout(() => {
    appendCsBotMessage("Got your message! We'll get back to you soon regarding: \"" + text + "\"");
  }, 700);
}

function checkEnter(e) {
  if (e.key === 'Enter') {
    sendCsMessage();
  }
}

function appendCsUserMessage(text) {
  if (!csChatBody) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = 'cs-message user';
  msgDiv.textContent = text;
  csChatBody.appendChild(msgDiv);
  csChatBody.scrollTop = csChatBody.scrollHeight;
}

function appendCsBotMessage(text) {
  if (!csChatBody) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = 'cs-message bot';
  msgDiv.textContent = text;
  csChatBody.appendChild(msgDiv);
  csChatBody.scrollTop = csChatBody.scrollHeight;
}

const chatUsBody = document.getElementById('chatUsBody');
const chatUsMessageInput = document.getElementById('chatUsMessageInput');

function handleChatUsOption(optionText) {
  appendChatUsUserMessage(optionText);
  
  setTimeout(() => {
    let botReply = `Connecting you to the ${optionText} team. Please state your inquiry.`;
    if (optionText === 'Developer') {
      botReply = "Developer channel active. What technical aspect can we assist you with?";
    } else if (optionText === 'Admin') {
      botReply = "Admin desk reached. Please provide details regarding your administrative request.";
    } else if (optionText === 'Support') {
      botReply = "Support team online. How can we help you today?";
    }
    appendChatUsBotMessage(botReply);
  }, 600);
}

function sendChatUsMessage() {
  if (!chatUsMessageInput) return;
  const text = chatUsMessageInput.value.trim();
  if (text === "") return;
  
  appendChatUsUserMessage(text);
  chatUsMessageInput.value = "";

  setTimeout(() => {
    appendChatUsBotMessage(`Message received. Someone will reply to you shortly regarding: "${text}"`);
  }, 700);
}

function checkChatUsEnter(e) {
  if (e.key === 'Enter') {
    sendChatUsMessage();
  }
}

function appendChatUsUserMessage(text) {
  if (!chatUsBody) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = 'cs-message user';
  msgDiv.textContent = text;
  chatUsBody.appendChild(msgDiv);
  chatUsBody.scrollTop = chatUsBody.scrollHeight;
}

function appendChatUsBotMessage(text) {
  if (!chatUsBody) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = 'cs-message bot';
  msgDiv.textContent = text;
  chatUsBody.appendChild(msgDiv);
  chatUsBody.scrollTop = chatUsBody.scrollHeight;
}

(function() {
  const style = document.createElement('style');
  style.innerHTML = `
    body.offline-mode {
      filter: grayscale(100%) !important;
      -webkit-filter: grayscale(100%) !important;
      pointer-events: none !important;
      overflow: hidden !important;
      height: 100vh !important;
    }

    body.offline-mode *, body.offline-mode *::before, body.offline-mode *::after {
      animation-play-state: paused !important;
      transition: none !important;
    }

    #offlineOverlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.95);
      z-index: 2147483647;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: white;
      text-align: center;
      padding: 24px;
      pointer-events: auto !important;
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'offlineOverlay';
  overlay.innerHTML = `
    <div style="font-size: 64px; margin-bottom: 16px;">⚠️</div>
    <h1 style="margin: 0 0 10px 0; font-size: 26px; font-weight: 700;">No Internet Connection</h1>
    <p style="margin: 0; color: #b0b0b0; font-size: 15px; line-height: 1.4;">Network connection lost. All media and redirects have been stopped.</p>
  `;

  const appendOverlay = () => {
    if (!document.getElementById('offlineOverlay') && document.body) {
      document.body.appendChild(overlay);
    }
  };

  if (document.body) appendOverlay();
  else document.addEventListener('DOMContentLoaded', appendOverlay);

  let isOfflineState = false;

  function triggerOffline() {
    if (isOfflineState) return;
    isOfflineState = true;
    appendOverlay();
    document.body.classList.add('offline-mode');
    const activeOverlay = document.getElementById('offlineOverlay') || overlay;
    if (activeOverlay) activeOverlay.style.display = 'flex';
  }

  function triggerOnline() {
    if (!isOfflineState) return;
    isOfflineState = false;
    window.location.reload();
  }

  window.addEventListener('offline', triggerOffline);
  window.addEventListener('online', triggerOnline);
  if (!navigator.onLine) triggerOffline();
})();