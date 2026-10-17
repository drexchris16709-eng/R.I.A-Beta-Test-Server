// ---------- Settings ----------
const BACK_REDIRECT_URL = 'index.html';   // Back button goes here ('' = previous page)
const USER_ID = new URLSearchParams(location.search).get('user') || '???';   // or open the page with ?user=YOURID
const REPLY_DELAY_MS = 900;
// Put your images in the SAME folder as this page. Any of these names/formats will work (first one found is used).
const AVATAR_FILES = ['Dev.jpg', 'Dev.png', 'cs-profile.jpg', 'cs-profile.png'];
const BANNER_FILES = ['DevB.jpg', 'DevB.png', 'DevB.jpeg'];
               // "typing..." time before each support reply
const SOCIAL_LINKS = [                    // add the developer's real links (empty url = "not available yet")
  { name: 'Facebook',  url: 'https://www.facebook.com/chryzh.zyh' },
  { name: 'TikTok',    url: 'https://www.tiktok.com/@chryxh_xyh?lang=en' },
  { name: 'Instagram', url: 'https://www.instagram.com/chris_xyhh/' },
  { name: 'Discord',   url: 'https://discord.com/channels/@me' }
];

// Line icons (24x24), drawn in the same white style as the rest of the UI
const SOCIAL_ICONS = {
  Facebook:  '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  TikTok:    '<path d="M14 3v11a4 4 0 1 1-4-4"/><path d="M14 3c.4 2.6 2.1 4.3 5 4.6"/>',
  Instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/>',
  Discord:   '<path d="M8 7c1.3-.5 2.6-.7 4-.7s2.7.2 4 .7c1.7 2.6 2.6 5.3 2.8 8.2-1.4 1-2.8 1.7-4.3 2.1l-.8-1.4"/><path d="M8 7C6.3 9.6 5.4 12.3 5.2 15.2c1.4 1 2.8 1.7 4.3 2.1l.8-1.4"/><path d="M9 15.4c1.9.7 4.1.7 6 0"/><circle cx="9.5" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="14.5" cy="12" r="1.2" fill="currentColor" stroke="none"/>'
};

const MENU = [
  { id: 'dev', label: 'Talk to Main Developer' },
  { id: 'report', label: 'Report a User' },
  { id: 'suggest', label: 'Suggest your Feature' },
  { id: 'social', label: 'Social Media of Developer' },
  { id: 'recovery', label: 'Recovery State' },
  { id: 'ask', label: 'Ask Something' }
];

// Connect this to your backend (e.g. fetch('/api/support', { method: 'POST', body: JSON.stringify({ user: USER_ID, type, text }) }))
function sendToDeveloper(type, text) {
  return 'CS-' + Math.floor(1000 + Math.random() * 9000);   // ticket number
}

// ---------- Images (avatar + banner) ----------
const FALLBACK_AVATAR = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#111"/><circle cx="32" cy="24" r="11" fill="#fff"/><path d="M10 58c2-14 12-20 22-20s20 6 22 20z" fill="#fff"/></svg>');
let avatarSrc = FALLBACK_AVATAR;

function firstWorking(list) {            // tries each file name until one loads
  return list.reduce((p, src) => p.then(found => found || new Promise(res => {
    const im = new Image();
    im.onload = () => res(src);
    im.onerror = () => res(null);
    im.src = src;
  })), Promise.resolve(null));
}

// ---------- Auto dark theme for images ----------
// Turns the picture black & white and darkens it to fit the black UI.
// Bright pictures get darkened more, already-dark ones are barely touched.
function measureLuma(src) {
  return new Promise(res => {
    const im = new Image();
    im.onload = () => {
      try {
        const c = document.createElement('canvas'); c.width = c.height = 24;
        const x = c.getContext('2d'); x.drawImage(im, 0, 0, 24, 24);
        const d = x.getImageData(0, 0, 24, 24).data; let sum = 0;
        for (let i = 0; i < d.length; i += 4) sum += (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
        res(sum / (d.length / 4));
      } catch (_) { res(null); }     // opened as a local file: can't read pixels, use a safe default
    };
    im.onerror = () => res(null);
    im.src = src;
  });
}
function darkFilters(L) {
  // Every colour (red, blue, green...) becomes a shade of grey/black, then it is darkened.
  // Lower BLACKNESS = darker images. Brighter pictures are darkened a bit more.
  const BLACKNESS = 0.8;                      // 0.5 = dark grey, 1 = lighter grey
  const b = (L == null ? 0.75 : Math.min(1, Math.max(0.5, 1.05 - L * 0.7))) * BLACKNESS;
  return {
    base: `grayscale(1) contrast(1.4) brightness(${b.toFixed(2)})`,
    hover: `grayscale(1) contrast(1.3) brightness(${(b + 0.25).toFixed(2)})`
  };
}

let avatarVars = { base: 'none', hover: 'none' };

function paintAvatar(a) {
  const img = a.querySelector('img');
  img.style.setProperty('--dark', avatarVars.base);
  img.style.setProperty('--dark-hover', avatarVars.hover);
}

async function setAvatar(src, animate) {
  avatarSrc = src;
  avatarVars = src === FALLBACK_AVATAR ? { base: 'none', hover: 'none' } : darkFilters(await measureLuma(src));
  document.querySelectorAll('.avatar').forEach(a => {
    a.querySelector('img').src = src;
    paintAvatar(a);
    if (animate) { a.classList.remove('swap'); void a.offsetWidth; a.classList.add('swap'); }
  });
}

async function setBanner(src, animate) {
  bannerEl.src = src;
  bannerEl.style.setProperty('--dark', darkFilters(await measureLuma(src)).base);
  if (animate) { bannerEl.classList.remove('swap'); void bannerEl.offsetWidth; bannerEl.classList.add('swap'); }
}

// ---------- Chat engine ----------
const chat = document.getElementById('chat');
const form = document.getElementById('composer');
const input = document.getElementById('msg');
const sendBtn = document.getElementById('sendBtn');
document.getElementById('userId').textContent = USER_ID;

let mode = null;       // what the next typed message is for: dev | report | suggest | ask
let last = null;       // who spoke last (to group avatars)
let queue = Promise.resolve();

const scrollDown = () => requestAnimationFrame(() => chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' }));

function makeRow(sender) {
  const row = document.createElement('div');
  row.className = 'row ' + sender + (last === sender ? ' cont' : '');
  if (sender === 'bot') row.insertAdjacentHTML('beforeend', '<div class="avatar" title="Tap to change photo"><img src="' + avatarSrc + '" alt=""><i class="status"></i></div>');
  last = sender;
  chat.appendChild(row);
  const av = row.querySelector('.avatar'); if (av) paintAvatar(av);
  return row;
}

function userSay(text) {
  const b = document.createElement('div');
  b.className = 'bubble';
  b.textContent = text;            // text only, never HTML
  makeRow('user').appendChild(b);
  scrollDown();
}

// Bot reply: shows typing dots, then the message. Queued so replies keep their order.
function say(html, opts = {}) {
  queue = queue.then(() => new Promise(resolve => {
    const b = document.createElement('div');
    b.className = 'bubble' + (opts.menu ? ' menu-bubble' : '');
    b.innerHTML = '<span class="dots"><i></i><i></i><i></i></span>';
    makeRow('bot').appendChild(b);
    scrollDown();
    setTimeout(() => {
      b.innerHTML = opts.menu ? html : '<div class="reveal">' + html + '</div>';
      if (opts.chips) b.insertAdjacentHTML('beforeend', '<div class="chips">' + opts.chips + '</div>');
      scrollDown();
      resolve();
    }, REPLY_DELAY_MS);
  }));
}

const menuChip = '<button class="chip" data-act="menu">Main menu</button>';

function showMenu() {
  const items = MENU.map((m, i) => `<button class="opt" data-id="${m.id}" style="--i:${i}">${m.label}</button>`).join('');
  say(items, { menu: true });
}

// ---------- Support answers ----------
function choose(id, label) {
  userSay(label);
  mode = null;
  switch (id) {
    case 'dev':
      mode = 'dev';
      say('Connecting you to the main developer. Please describe your concern in the message box below.');
      break;
    case 'report':
      mode = 'report';
      say('Please type the User ID you want to report and tell us what happened.');
      break;
    case 'suggest':
      mode = 'suggest';
      say('Got an idea? Tell us the feature you’d like to see.');
      break;
    case 'social': {
      const chips = SOCIAL_LINKS.map(x => {
        const svg = `<svg viewBox="0 0 24 24" aria-hidden="true">${SOCIAL_ICONS[x.name]}</svg>`;
        return x.url
          ? `<a class="chip icon" href="${x.url}" target="_blank" rel="noopener" aria-label="${x.name}" title="${x.name}">${svg}</a>`
          : `<button class="chip icon" data-act="nolink" aria-label="${x.name}" title="${x.name}">${svg}</button>`;
      }).join('');
      say('You can find the developer here:', { chips });
      break;
    }
    case 'recovery':
      say('If you changed your password with Forget Password, it can take up to 4 hours to save. After that, log in again with your new password. Still can’t get in? Choose Talk to Main Developer.', { chips: menuChip });
      break;
    case 'ask':
      mode = 'ask';
      say('Sure, what would you like to ask?');
      break;
  }
}

function answer(text) {
  const t = text.toLowerCase();
  if (/(password|login|log in|forgot|forget|recover)/.test(t)) return 'For password problems, use Forget Password on the login page. A new password can take up to 4 hours to save.';
  if (/(report|abuse|spam|harass)/.test(t)) return 'To report someone, go back to the menu and choose Report a User.';
  if (/(feature|suggest|idea)/.test(t)) return 'We’d love to hear it! Go back to the menu and choose Suggest your Feature.';
  if (/(developer|contact|talk)/.test(t)) return 'You can reach the main developer from the menu with Talk to Main Developer.';
  return 'Thanks for asking! We’ve passed your question to the developer and you’ll get an answer as soon as possible.';
}

function handleText(text) {
  const t = text.trim().toLowerCase();
  if (t === 'menu' || t === 'help') return showMenu();

  if (mode === 'dev' || mode === 'report' || mode === 'suggest') {
    const ticket = sendToDeveloper(mode, text);
    const what = { dev: 'message', report: 'report', suggest: 'suggestion' }[mode];
    mode = null;
    say(`Thank you! Your ${what} was sent. Your ticket number is <b class="ticket">${ticket}</b>. The developer will reply as soon as possible.`, { chips: menuChip });
  } else if (mode === 'ask') {
    say(answer(text), { chips: menuChip });
  } else {
    say('I can help with the options below.');
    showMenu();
  }
}

// ---------- Events ----------
chat.addEventListener('click', e => {
  const opt = e.target.closest('.opt');
  if (opt) return choose(opt.dataset.id, opt.textContent);

  const chip = e.target.closest('[data-act]');
  if (!chip) return;
  if (chip.dataset.act === 'menu') { userSay('Main menu'); mode = null; showMenu(); }
  if (chip.dataset.act === 'nolink') say('That link isn’t available yet.', { chips: menuChip });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) {
    input.classList.remove('empty');
    void input.offsetWidth;
    input.classList.add('empty');
    return;
  }
  userSay(text);
  input.value = '';
  sendBtn.classList.remove('fly');
  void sendBtn.offsetWidth;
  sendBtn.classList.add('fly');
  handleText(text);
});

document.getElementById('backBtn').addEventListener('click', () => {
  document.body.classList.add('leaving');          // fade out, then go
  setTimeout(() => {
    if (BACK_REDIRECT_URL) window.location.href = "../DirectDeveloper/D.html";
    else history.back();
  }, 350);
});

// send button glows while there is text to send
input.addEventListener('input', () => sendBtn.classList.toggle('ready', input.value.trim() !== ''));
form.addEventListener('submit', () => sendBtn.classList.remove('ready'));

// ripple on every button
document.addEventListener('pointerdown', e => {
  const el = e.target.closest('.opt, .chip, .circle');
  if (!el) return;
  const r = el.getBoundingClientRect(), size = Math.max(r.width, r.height) * 2;
  const dot = document.createElement('span');
  dot.className = 'ripple';
  dot.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
  el.appendChild(dot);
  setTimeout(() => dot.remove(), 650);
});

// tap the avatar or the banner to choose your own JPG/PNG, saved in this browser
const avatarPick = document.getElementById('avatarPick');
const bannerPick = document.getElementById('bannerPick');
const bannerEl = document.getElementById('banner');
const OK_TYPES = ['image/jpeg', 'image/png'];

function wirePicker(picker, storeKey, apply) {
  picker.addEventListener('change', () => {
    const f = picker.files[0];
    picker.value = '';
    if (!f) return;
    if (!OK_TYPES.includes(f.type)) { say('Please choose a JPG or PNG image.', { chips: menuChip }); return; }
    const reader = new FileReader();
    reader.onload = () => {
      apply(reader.result);
      try { localStorage.setItem(storeKey, reader.result); } catch (_) {}
    };
    reader.readAsDataURL(f);
  });
}
wirePicker(avatarPick, 'cs-avatar', src => setAvatar(src, true));
wirePicker(bannerPick, 'cs-banner', src => setBanner(src, true));

chat.addEventListener('click', e => { if (e.target.closest('.avatar')) avatarPick.click(); });
bannerEl.addEventListener('click', () => bannerPick.click());

// Load images, then show the first support message (the menu)
(async function init() {
  let savedBanner = null;
  try { savedBanner = localStorage.getItem('cs-banner'); } catch (_) {}
  const bannerSrc = savedBanner || await firstWorking(BANNER_FILES);
  if (bannerSrc) await setBanner(bannerSrc);

  let saved = null;
  try { saved = localStorage.getItem('cs-avatar'); } catch (_) {}
  const found = saved || await firstWorking(AVATAR_FILES);
  if (found) await setAvatar(found);

  showMenu();
})();