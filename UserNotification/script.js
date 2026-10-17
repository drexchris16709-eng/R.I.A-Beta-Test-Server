(function () {
  // ---------- Staggered entrance ----------
  document.querySelectorAll('#panel-notification .section-title, #panel-notification .item')
    .forEach((el, i) => el.style.setProperty('--i', i));

  // ---------- Bottom nav: hides while scrolling, returns when scrolling stops ----------
  // 1) The nav hides while the user scrolls and comes back when scrolling stops.
  // 2) At the very bottom of the page it stays hidden, and comes back as soon as
  //    the user scrolls up a little from the bottom.
  const navEl = document.querySelector('.bottom-nav');
  const SHOW_AFTER = 12;   // px up from the very bottom: nav may appear once scrolling stops
  const IDLE_MS = 180;     // scrolling counts as stopped after this long
  let idleTimer;

  const metrics = () => {
    const doc = document.documentElement;
    return {
      doc,
      canScroll: doc.scrollHeight - window.innerHeight > 24,
      fromBottom: doc.scrollHeight - (window.scrollY + window.innerHeight)
    };
  };

  function updateNav() {
    const { doc, canScroll } = metrics();
    if (!canScroll || doc.classList.contains('inbox-open')) {
      navEl.classList.remove('nav-hidden');
      return;
    }
    navEl.classList.add('nav-hidden');           // any scrolling (up or down) hides it

    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {               // scrolling stopped
      // stopped at the deep bottom: stay hidden; anywhere else: show
      if (metrics().fromBottom >= SHOW_AFTER) navEl.classList.remove('nav-hidden');
    }, IDLE_MS);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);

  // ---------- Tabs ----------
  const tabs = document.querySelectorAll('.tab');
  const panels = {
    notification: document.getElementById('panel-notification'),
    updates: document.getElementById('panel-updates')
  };
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.dataset.tab === 'inbox') { window.RIA_inbox.open(); return; }
      if (tab.dataset.tab === 'updates') { window.RIA_updates.open(); return; }
      tabs.forEach(t => t.classList.remove('active'));
      Object.values(panels).forEach(p => p.classList.remove('show'));
      tab.classList.add('active');
      panels[tab.dataset.tab].classList.add('show');
    });
  });

  // ---------- Online time on this page ----------
  // Starts again from 0h, 0m, 0s every time the page is opened or refreshed.
  // Counts only while the page is visible and the device is online.
  const inTimeEl = document.getElementById('inActiveTime');
  const timeEl = document.getElementById('activeTime');
  const dot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  let total = 0;

  // clear anything saved by earlier versions so nothing is carried over
  ['ria_active_seconds', 'ria_notification_active_seconds', 'ria_inbox_active_seconds'].forEach(k => {
    try { localStorage.removeItem(k); } catch (e) {}
    try { sessionStorage.removeItem(k); } catch (e) {}
  });
  try { document.cookie = 'ria_active_seconds=; max-age=0; path=/'; } catch (e) {}
  try { window.name = String(window.name).replace(/ria_t=\d+;?/, ''); } catch (e) {}
  try { if (/ria_t=/.test(window.location.hash)) history.replaceState(history.state, '', window.location.pathname + window.location.search); } catch (e) {}

  function format(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return h + 'h, ' + m + 'm, ' + s + 's';
  }

  function render() { const t = format(total); timeEl.textContent = t; if (inTimeEl) inTimeEl.textContent = t; }

  function setStatus() {
    const online = navigator.onLine;
    dot.classList.toggle('off', !online);
    statusText.textContent = online ? 'Online' : 'Offline';
  }

  render();
  setStatus();
  window.addEventListener('online', setStatus);
  window.addEventListener('offline', setStatus);

  setInterval(() => {
    if (document.visibilityState === 'visible' && navigator.onLine) {
      total += 1;
      render();
    }
  }, 1000);
})();

(function () {
  const $ = id => document.getElementById(id);
  const CHEV = '<svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>';


  /* ----- Example messages (profile picture: Logo.jpg) ----- */
  const DATA = [
    { id: 1, av: 'Logo.jpg', name: 'Super AI', subj: 'Welcome to R.I.A!', body: 'Thanks for joining R.I.A. Your account is ready, explore search, tasks and notifications from the bottom bar anytime.', time: '8:27 AM', read: false, pinned: true, sub: true },
    { id: 2, av: 'Logo.jpg', name: 'Developer', subj: 'New feature: Search is live', body: 'The new search page is now available. You can look up students and features faster, and more filters are coming soon.', time: '8:10 AM', read: false, imp: true, from: 'developer', upd: true, pinned: true },
    { id: 3, av: 'Logo.jpg', name: 'Teacher', subj: 'Assignment reminder', body: 'Please remember to submit your assignment before the deadline. Late submissions will not be accepted without a reason.', time: '7:45 AM', read: true, imp: true, from: 'teacher' },
    { id: 4, av: 'Logo.jpg', name: 'Developer', subj: 'Maintenance this weekend', body: 'R.I.A will be offline for a short maintenance window this weekend. Your data will stay safe and nothing will be lost.', time: 'Yesterday', read: true, imp: true, from: 'developer', upd: true },
    { id: 5, av: 'Logo.jpg', name: 'Super AI Updates', subj: 'Version 2.1 release notes', body: 'Version 2.1 brings faster loading, a new inbox, smoother animations and a bunch of small bug fixes.', time: 'Yesterday', read: true, upd: true, sub: true },
    { id: 6, av: 'Logo.jpg', name: 'Teacher', subj: 'Quiz results are posted', body: 'Your quiz results are now posted. Check the Tasks page to see your score and the comments from your teacher.', time: '6:30 AM', read: false, imp: true, from: 'teacher', pinned: true },
    { id: 7, av: 'Logo.jpg', name: 'Old Announcements', subj: 'Last semester schedule', body: 'This is the schedule from last semester, kept here for reference only.', time: 'Mon', read: true, arch: true },
    { id: 8, av: 'Logo.jpg', name: 'Unknown Sender', subj: 'You won a free prize!!!', body: 'Click this link now to claim your free prize. This looks suspicious, so it was moved to spam.', time: 'Sun', read: false, spam: true },
    { id: 9, av: 'Logo.jpg', name: 'Archived Notice', subj: 'Holiday break reminder', body: 'Classes will resume after the holiday break. Enjoy your time off!', time: 'Fri', read: true, arch: true }
  ];
  const live = m => !m.arch && !m.spam;
  const CATS = {
    all:   { title: 'All Messages', f: live },
    read:  { title: 'Read & Unread', f: live, subs: [['Read', m => m.read], ['Unread', m => !m.read]] },
    imp:   { title: 'Important', f: m => m.imp, subs: [['From the developer', m => m.from === 'developer'], ['From the teacher', m => m.from === 'teacher']] },
    pin:   { title: 'Pinned', f: m => m.pinned },
    sub:   { title: 'Subscriptions', f: m => m.sub },
    arch:  { title: 'Archived', f: m => m.arch },
    upd:   { title: 'Updates', f: m => m.upd },
    spam:  { title: 'Spam', f: m => m.spam }
  };
  const ORDER = [['all', 'All Messages'], ['read', 'Read & Unread'], ['imp', 'Important'], ['pin', 'Pinned'], ['sub', 'Subscriptions'], ['arch', 'Archived'], ['upd', 'Updates'], ['spam', 'Spam']];
  const SETTINGS = ['Search & Filtering', 'Clear Inbox Data', 'Storage & Data', 'Deep Files', 'Privacy & Security', 'Language & Region', 'Events', 'Advanced'];

  let cat = 'all', sub = 0;
  try { const r = JSON.parse(localStorage.getItem('ria_inbox_read') || '[]'); DATA.forEach(m => { if (r.includes(m.id)) m.read = true; }); } catch (e) {}
  const saveRead = () => { try { localStorage.setItem('ria_inbox_read', JSON.stringify(DATA.filter(m => m.read).map(m => m.id))); } catch (e) {} };
  const replay = el => { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; };

  /* ----- Menu ----- */
  $('menuItems').innerHTML = ORDER.map(([k, l], i) => `<button class="mitem${k === cat ? ' active' : ''}" data-cat="${k}" style="--i:${i}"><span>${l}</span>${CHEV}</button>`).join('');
  $('menuItems').addEventListener('click', e => {
    const b = e.target.closest('.mitem'); if (!b) return;
    cat = b.dataset.cat; sub = 0;
    document.querySelectorAll('.mitem[data-cat]').forEach(x => x.classList.toggle('active', x === b));
    render(true);
  });
  // size menu rows to whole pixels so every divider renders the same weight
  function fitMenu() {
    const m = $('menu'), items = [...m.querySelectorAll('#menuItems .mitem')];
    const avail = m.clientHeight - m.querySelector('.menu-head').offsetHeight - $('closeMenu').offsetHeight;
    if (avail <= 0 || !items.length) return;
    const h = Math.floor(avail / items.length), rest = avail - h * items.length;
    items.forEach((b, i) => { b.style.flex = 'none'; b.style.height = (h + (i === items.length - 1 ? rest : 0)) + 'px'; });
  }
  fitMenu(); window.addEventListener('resize', fitMenu);
  window.fitInboxMenu = fitMenu;
  $('closeMenu').addEventListener('click', () => $('menu').classList.add('closed'));
  const box = $('menu').parentElement;
  function exitReading() {
    if (!box.classList.contains('reading')) return false;
    box.classList.remove('reading');
    document.querySelectorAll('#list .row.reading-row').forEach(r => r.classList.remove('open', 'reading-row'));
    $('list').scrollTop = 0;
    return true;
  }
  $('openMenu').addEventListener('click', () => { exitReading(); $('menu').classList.remove('closed'); });

  /* ----- Render list ----- */
  function render(head) {
    const c = CATS[cat];
    $('ctitle').textContent = c.title;
    if (head) replay($('chead'));
    const st = $('subtabs');
    if (c.subs) {
      st.hidden = false;
      st.innerHTML = c.subs.map((s, i) => `<button class="sub${i === sub ? ' active' : ''}" data-i="${i}">${s[0]}</button>`).join('');
      if (head) replay(st);
    } else st.hidden = true;
    let items = DATA.filter(c.f);
    if (c.subs) items = items.filter(c.subs[sub][1]);
    $('list').innerHTML = items.length ? items.map((m, i) => `
      <article class="row${m.read ? '' : ' unread'}" data-id="${m.id}" style="--i:${i}">
        <span class="avatar"><img src="${m.av}" data-i="${m.name[0]}" alt=""></span>
        <div class="rtext">
          <div class="rtop"><h3>${m.name}</h3><time>${m.time}</time>${CHEV}</div>
          <div class="subj">${m.subj}</div>
          <div class="body">${m.body}</div>
          <div class="full"><div>${m.body}</div></div>
        </div>
      </article>`).join('') : '<p class="iempty">No messages here.</p>';
    const band = $('band');
    band.hidden = !c.subs;
    if (c.subs) { band.textContent = items.length + (items.length === 1 ? ' message' : ' messages'); replay(band); }
    $('list').scrollTop = 0;
  }
  $('subtabs').addEventListener('click', e => {
    const b = e.target.closest('.sub'); if (!b) return;
    sub = +b.dataset.i; render(false);
  });
  $('list').addEventListener('click', e => {
    const r = e.target.closest('.row'); if (!r) return;
    if (box.classList.contains('reading')) return;
    $('menu').classList.add('closed');
    box.classList.add('reading');
    r.classList.add('open', 'reading-row');
    $('list').scrollTop = 0;
    const m = DATA.find(x => x.id === +r.dataset.id);
    if (m && !m.read) { m.read = true; r.classList.remove('unread'); saveRead(); }
  });
  // If a profile picture file is missing, show the sender's initial instead
  $('list').addEventListener('error', e => {
    if (e.target.tagName === 'IMG') e.target.replaceWith(document.createTextNode(e.target.dataset.i));
  }, true);
  render(false);

  /* ----- Settings sidebar (opens when the gear is tapped) ----- */
  $('slist').innerHTML = SETTINGS.map((s, i) => `<button class="sitem" style="--i:${i}"><span>${s}</span>${CHEV}</button>`).join('');
  const setOpen = o => { $('settings').classList.toggle('open', o); $('backdrop').classList.toggle('open', o); $('gearBtn').classList.toggle('on', o); };
  $('gearBtn').addEventListener('click', () => setOpen(true));
  $('backdrop').addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if ($('settings').classList.contains('open')) setOpen(false); else if (isOpen) { if (!exitReading()) closeInbox(); else $('menu').classList.remove('closed'); } } });

  /* ----- Modal open/close (slides from deep left to center) ----- */
  const modal = $('inboxModal');
  let isOpen = false;
  function openInbox() {
    isOpen = true;
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('inbox-open');
    const nv = document.querySelector('.bottom-nav'); if (nv) nv.classList.remove('nav-hidden');
    $('list').scrollTop = 0;
    fitMenu();
    requestAnimationFrame(() => modal.classList.add('open'));
  }
  function closeInbox() {
    isOpen = false; setOpen(false); exitReading(); $('menu').classList.remove('closed');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('inbox-open');
  }
  window.RIA_inbox = { open: openInbox, close: closeInbox };
  // block touch/wheel scrolling anywhere except inside the message list
  const canScroll = t => { const l = t.closest && t.closest('.list'); return l && l.scrollHeight > l.clientHeight; };
  modal.addEventListener('touchmove', e => { if (!canScroll(e.target)) e.preventDefault(); }, { passive: false });
  modal.addEventListener('wheel', e => { if (!canScroll(e.target)) e.preventDefault(); }, { passive: false });
  modal.querySelectorAll('.itab[data-go]').forEach(btn => btn.addEventListener('click', () => {
    closeInbox();
    if (btn.dataset.go === 'updates') { const u = document.querySelector('.tab[data-tab="updates"]'); if (u) u.click(); }
  }));
  const bell = document.querySelector('.bottom-nav .nav-item.active');
  if (bell) bell.addEventListener('click', closeInbox);

  /* ----- Online status (the time itself is shared with the main counter) ----- */
  const status = () => { const on = navigator.onLine; $('inStatusDot').classList.toggle('off', !on); $('inStatusText').textContent = on ? 'Online' : 'Offline'; };
  status();
  window.addEventListener('online', status); window.addEventListener('offline', status);
})();

(function () {
  const $ = id => document.getElementById(id);
  const CHEV = '<svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>';

  /* Each update has its own profile picture (jpg / png). Put these files next to this page. */
  const UPDATES = [
    { img: 'SuperAI.jpg',    name: 'Super AI',    subj: 'System functions update',          body: 'Super AI powers the core functions of the system. This update improves speed, stability and how the main features work together.', time: '8:10 PM', unread: true },
    { img: 'ExoAI.jpg',      name: 'Exo AI',      subj: 'AI assistant for students and teachers', body: 'Exo AI is the AI assistant for both students and teachers. It helps with questions, lessons, tasks and everyday school needs.', time: '8:10 PM', unread: true },
    { img: 'PendulumOs.jpg', name: 'Pendulum OS', subj: 'Operating system update',          body: 'Pendulum OS is the operating system behind R.I.A. This update improves performance, smoothness and overall system management.', time: '8:10 PM', unread: false },
    { img: 'CryleAI.jpg',    name: 'Cryle AI',    subj: 'Animations and gaming-style features', body: 'Cryle AI handles the animations and other gaming-style functions, making the app feel more lively, fast and fun to use.', time: '8:10 PM', unread: false }
  ];

  /* Read state is saved permanently: once an update is opened, its red dot never comes back. */
  const READ_KEY = 'ria_updates_read';
  const uid = u => u.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  function loadRead() {
    const ids = new Set();
    try { JSON.parse(localStorage.getItem(READ_KEY) || '[]').forEach(x => ids.add(x)); } catch (e) {}
    try { const m = document.cookie.match(/(?:^|;\s*)ria_updates_read=([^;]*)/); if (m && m[1]) decodeURIComponent(m[1]).split(',').forEach(x => x && ids.add(x)); } catch (e) {}
    return ids;
  }
  function saveRead(ids) {
    const arr = [...ids];
    try { localStorage.setItem(READ_KEY, JSON.stringify(arr)); } catch (e) {}
    try { document.cookie = 'ria_updates_read=' + encodeURIComponent(arr.join(',')) + '; max-age=31536000; path=/; SameSite=Lax'; } catch (e) {}
  }
  const readIds = loadRead();
  UPDATES.forEach(u => { u.id = uid(u); if (readIds.has(u.id)) u.unread = false; });

  const list = $('uList');
  list.innerHTML = UPDATES.map((u, i) => `
    <article class="row${u.unread ? ' unread' : ''}" data-uid="${u.id}" style="--i:${i + 4}">
      <span class="avatar"><img src="${u.img}" data-i="${u.name.replace('R.I.A ', '')[0]}" alt=""></span>
      <div class="rtext">
        <div class="rtop"><h3>${u.name}</h3><time>${u.time}</time>${CHEV}</div>
        <div class="subj">${u.subj}</div>
        <div class="body">${u.body}</div>
        <div class="full"><div>${u.body}</div></div>
      </div>
    </article>`).join('');

  // tap a row (or its arrow) to open it in full view inside the box
  const card = document.querySelector('.ucard');
  function exitReading() {
    if (!card.classList.contains('reading')) return false;
    card.classList.remove('reading');
    list.querySelectorAll('.row.reading-row').forEach(r => r.classList.remove('open', 'reading-row'));
    list.scrollTop = 0;
    return true;
  }
  list.addEventListener('click', e => {
    const r = e.target.closest('.row'); if (!r) return;
    if (card.classList.contains('reading')) return;
    card.classList.add('reading');
    r.classList.add('open', 'reading-row');
    r.classList.remove('unread');
    if (r.dataset.uid && !readIds.has(r.dataset.uid)) { readIds.add(r.dataset.uid); saveRead(readIds); }
    list.scrollTop = 0;
  });
  $('uBack').addEventListener('click', exitReading);
  // missing picture -> show the first letter instead
  list.addEventListener('error', e => {
    if (e.target.tagName === 'IMG') e.target.replaceWith(document.createTextNode(e.target.dataset.i));
  }, true);

  /* ----- open / close ----- */
  const modal = $('updModal');
  let isOpen = false;
  function openUpd() {
    if (window.RIA_inbox) window.RIA_inbox.close();
    isOpen = true;
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('inbox-open');
    const nv = document.querySelector('.bottom-nav'); if (nv) nv.classList.remove('nav-hidden');
    list.scrollTop = 0;
    requestAnimationFrame(() => modal.classList.add('open'));
  }
  function closeUpd(instant) {
    if (!isOpen) return;
    isOpen = false;
    exitReading();
    if (instant === true) modal.classList.add('instant');
    modal.classList.remove('open');
    if (instant === true) { void modal.offsetWidth; setTimeout(() => modal.classList.remove('instant'), 80); }
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('inbox-open');
  }
  window.RIA_updates = { open: openUpd, close: closeUpd };

  // opening the inbox closes this panel first
  if (window.RIA_inbox) {
    const origOpen = window.RIA_inbox.open;
    window.RIA_inbox.open = function () { closeUpd(true); origOpen(); };
  }

  modal.querySelectorAll('.itab[data-ugo]').forEach(btn => btn.addEventListener('click', () => {
    if (btn.dataset.ugo === 'inbox') { window.RIA_inbox.open(); return; }
    closeUpd();
  }));
  const bell = document.querySelector('.bottom-nav .nav-item.active');
  if (bell) bell.addEventListener('click', () => closeUpd());
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen && !exitReading()) closeUpd(); });

  // block scrolling anywhere except inside the update list
  const canScroll = t => { const l = t.closest && t.closest('.ulist'); return l && l.scrollHeight > l.clientHeight; };
  modal.addEventListener('touchmove', e => { if (!canScroll(e.target)) e.preventDefault(); }, { passive: false });
  modal.addEventListener('wheel', e => { if (!canScroll(e.target)) e.preventDefault(); }, { passive: false });

  /* ----- Check for updates: show spinner, then go to the other page ----- */
  const btn = $('checkBtn');
  btn.addEventListener('click', e => {
    e.preventDefault();
    if (btn.classList.contains('checking') || !navigator.onLine) return;
    btn.classList.add('checking');
    btn.querySelector('span:last-child').textContent = 'Checking...';
    setTimeout(() => { window.location.href = btn.getAttribute('href'); }, 800);
  });

  /* ----- keep the clock + online status in step with the main page ----- */
  const mainTime = $('activeTime');
  setInterval(() => { $('upActiveTime').textContent = mainTime.textContent; }, 1000);
  const status = () => { const on = navigator.onLine; $('upStatusDot').classList.toggle('off', !on); $('upStatusText').textContent = on ? 'Online' : 'Offline'; };
  status();
  window.addEventListener('online', status); window.addEventListener('offline', status);
})();

(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        button.loading {
            color: transparent !important;
            pointer-events: none !important;
            position: relative !important;
        }

        button.loading::after {
            content: "" !important;
            position: absolute !important;
            width: 20px !important;
            height: 20px !important;
            top: 50% !important;
            left: 50% !important;
            margin-left: -10px !important;
            margin-top: -10px !important;
            border: 3px solid rgba(0, 0, 0, 0) !important;
            border-radius: 50% !important;
            border-top-color: #000000 !important;
            animation: button-loading-spinner 0.6s linear infinite !important;
        }

        @keyframes button-loading-spinner {
            to {
                transform: rotate(360deg);
            }
        }

        body.offline-mode {
            filter: grayscale(100%) !important;
            -webkit-filter: grayscale(100%) !important;
            pointer-events: none !important;
            overflow: hidden !important;
            height: 100vh !important;
        }

        body.offline-mode *, 
        body.offline-mode *::before, 
        body.offline-mode *::after {
            animation-play-state: paused !important;
            transition: none !important;
        }

        body.offline-mode img, 
        body.offline-mode svg,
        body.offline-mode video,
        body.offline-mode audio,
        body.offline-mode [style*="background-image"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
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
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            text-align: center;
            padding: 24px;
            box-sizing: border-box;
            pointer-events: auto !important;
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'offlineOverlay';

    const appendOverlay = () => {
        if (!document.getElementById('offlineOverlay') && document.body) {
            document.body.appendChild(overlay);
        }
    };

    if (document.body) {
        appendOverlay();
    } else {
        document.addEventListener('DOMContentLoaded', appendOverlay);
    }

    let isOfflineState = false;

    const originalLocation = window.location;
    try {
        Object.defineProperty(window, 'location', {
            get: function() { return originalLocation; },
            set: function(url) {
                if (isOfflineState || !navigator.onLine) {
                    console.warn("Redirect blocked due to offline state.");
                    return;
                }
                originalLocation.href = url;
            }
        });
    } catch(e) {}

    const originalAssign = window.location.assign;
    const originalReplace = window.location.replace;
    window.location.assign = function(url) {
        if (isOfflineState || !navigator.onLine) return;
        originalAssign.call(window.location, url);
    };

    window.location.replace = function(url) {
        if (isOfflineState || !navigator.onLine) return;
        originalReplace.call(window.location, url);
    };

    document.addEventListener('click', (e) => {
        if (isOfflineState || !navigator.onLine) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, true);

    function triggerOffline() {
        if (isOfflineState) return;
        isOfflineState = true;

        appendOverlay();
        const activeOverlay = document.getElementById('offlineOverlay') || overlay;

        activeOverlay.style.display = 'flex';
        activeOverlay.innerHTML = `
            <div style="width: 48px; height: 48px; border: 4px solid rgba(255, 255, 255, 0.2); border-radius: 50%; border-top-color: #ffffff; animation: button-loading-spinner 0.6s linear infinite; margin-bottom: 20px;"></div>
            <p style="margin: 0; color: #b0b0b0; font-size: 16px; font-weight: 500;">Checking connection status...</p>
        `;

        setTimeout(() => {
            if (!isOfflineState) return;
            
            document.body.classList.add('offline-mode');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            activeOverlay.innerHTML = `
                <div style="font-size: 64px; margin-bottom: 16px;">⚠️</div>
                <h1 style="margin: 0 0 10px 0; font-size: 26px; font-weight: 700;">No Internet Connection</h1>
                <p style="margin: 0; color: #b0b0b0; font-size: 15px; line-height: 1.4;">Network connection lost. All media, redirects, timers, and processes have been stopped.</p>
            `;

            document.querySelectorAll('video, audio').forEach(media => {
                try {
                    media.pause();
                    media.currentTime = 0;
                    media.src = '';
                    media.load();
                } catch(err) {}
            });

            let highestTimeoutId = setTimeout(';');
            for (let i = 0; i < highestTimeoutId; i++) clearTimeout(i);
            let highestIntervalId = setInterval(';');
            for (let i = 0; i < highestIntervalId; i++) clearInterval(i);
            if (document.getAnimations) {
                document.getAnimations().forEach(anim => anim.pause());
            }
        }, 800);
    }

    function triggerOnline() {
        if (!isOfflineState) return;
        
        appendOverlay();
        const activeOverlay = document.getElementById('offlineOverlay') || overlay;

        document.body.classList.remove('offline-mode');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        activeOverlay.style.display = 'flex';
        activeOverlay.innerHTML = `
            <div style="width: 48px; height: 48px; border: 4px solid rgba(255, 255, 255, 0.2); border-radius: 50%; border-top-color: #ffffff; animation: button-loading-spinner 0.6s linear infinite; margin-bottom: 20px;"></div>
            <p style="margin: 0; color: #b0b0b0; font-size: 16px; font-weight: 500;">Connection restored. Reconnecting...</p>
        `;

        setTimeout(() => {
            isOfflineState = false;
            window.location.reload();
        }, 700);
    }

    window.addEventListener('offline', triggerOffline);
    window.addEventListener('online', triggerOnline);

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            if (!navigator.onLine) {
                triggerOffline();
            } else {
                verifyConnection();
            }
        }
    });

    async function verifyConnection() {
        if (!navigator.onLine) {
            triggerOffline();
            return;
        }

        // A page opened straight from a file (file://) can't be pinged, and the
        // failed ping used to wrongly freeze the page as "No Internet Connection".
        if (window.location.protocol === 'file:') {
            if (isOfflineState) triggerOnline();
            return;
        }

        try {
            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const response = await fetch(window.location.href.split('#')[0] + '?ping=' + Date.now(), {
                method: 'HEAD',
                cache: 'no-store',
                signal: signal
            });

            clearTimeout(timeoutId);
            if (response.ok || response.type === 'opaque' || response.status < 500) {
                if (isOfflineState) triggerOnline();
            } else {
                triggerOffline();
            }
        } catch (error) {
            triggerOffline();
        }
    }

    setInterval(() => {
        if (document.visibilityState === 'visible') verifyConnection();
    }, 5000);
    if (!navigator.onLine) {
        triggerOffline();
    }
})();