(function () {
  const grad = (a, b, c) => `linear-gradient(135deg, ${a}, ${b}${c ? ', ' + c : ''})`;

  const SUGGESTIONS = [
    { img: 'CM', g: grad('#1a0b3d', '#4b1fa8', '#05030d'), link: 'suggestion1.html' },
    { img: 'CM', g: grad('#021a46', '#0a4cc2', '#02050f'), link: 'suggestion2.html' },
    { img: 'CM', g: grad('#0c2b2b', '#12766f', '#030a0a'), link: 'suggestion3.html' },
    { img: 'CM', g: grad('#2c0a2f', '#a02388', '#07030a'), link: 'suggestion4.html' },
    { img: 'CM', g: grad('#2b1505', '#b3541b', '#080401'), link: 'suggestion5.html' },
    { img: 'CM', g: grad('#0a1030', '#3a46d6', '#02030c'), link: 'suggestion6.html' }
  ];

  const FEATURES = [
    { img: 'CM', g: grad('#050505', '#2b2b2b'), badge: 'Logo.jpg', title: 'Upcoming Feature 1' },
    { img: 'CM', g: grad('#020b1c', '#0c4a8a'), badge: 'Logo.jpg', title: 'Upcoming Feature 2' },
    { img: 'CM', g: grad('#130a2b', '#5b2bb5'), badge: 'Logo.jpg', title: 'Upcoming Feature 3' },
    { img: 'CM', g: grad('#0a2020', '#14867a'), badge: 'Logo.jpg', title: 'Upcoming Feature 4' },
    { img: 'CM', g: grad('#2a0a1c', '#b32a6a'), badge: 'Logo.jpg', title: 'Upcoming Feature 5' },
    { img: 'CM', g: grad('#2a1b05', '#c28a1a'), badge: 'Logo.jpg', title: 'Upcoming Feature 6' },
    { img: 'CM', g: grad('#071a2a', '#1b7fb3'), badge: 'Logo.jpg', title: 'Upcoming Feature 7' },
    { img: 'CM', g: grad('#190a2a', '#7a2bd0'), badge: 'Logo.jpg', title: 'Upcoming Feature 8' },
    { img: 'CM', g: grad('#0a1a0f', '#2f9e55'), badge: 'Logo.jpg', title: 'Upcoming Feature 9' },
    { img: 'CM', g: grad('#2a0a0a', '#c23a3a'), badge: 'Logo.jpg', title: 'Upcoming Feature 10' },
    { img: 'CM', g: grad('#0a1030', '#3a6ad6'), badge: 'Logo.jpg', title: 'Upcoming Feature 11' },
    { img: 'CM', g: grad('#1a1a0a', '#b8b02a'), badge: 'Logo.jpg', title: 'Upcoming Feature 12' }
  ];

  const PROMOS = [
    { title: 'Promo Video 1', video: 'CM.mp4', g: grad('#1a0b3d', '#4b1fa8', '#05030d') },
    { title: 'Promo Video 2', video: 'CM.mp4', g: grad('#0b0b0d', '#3a3a44') },
    { title: 'Promo Video 3', video: 'CM.mp4', g: grad('#0a1450', '#2f4ee0', '#d9e0ff') },
    { title: 'Promo Video 4', video: 'CM.mp4', g: grad('#0a0a0d', '#c9d4e8') },
    { title: 'Promo Video 5', video: 'CM.mp4', g: grad('#2c0a2f', '#a02388', '#07030a') },
    { title: 'Promo Video 6', video: 'CM.mp4', g: grad('#0c2b2b', '#12766f', '#030a0a') },
    { title: 'Promo Video 7', video: 'CM.mp4', g: grad('#2b1505', '#b3541b', '#080401') },
    { title: 'Promo Video 8', video: 'CM.mp4', g: grad('#021a46', '#0a4cc2', '#02050f') }
  ];

  const PARTNERS = [
    { title: 'Partner 1', img: 'CM', g: grad('#050a14', '#6f8497', '#020306') },
    { title: 'Partner 2', img: 'CM', g: grad('#050a14', '#2b4a7a', '#020306') },
    { title: 'Partner 3', img: 'CM', g: grad('#0a0614', '#5a3f8f', '#020106') },
    { title: 'Partner 4', img: 'CM', g: grad('#06100a', '#3f8f6a', '#010603') },
    { title: 'Partner 5', img: 'CM', g: grad('#140a06', '#8f5a3f', '#060301') },
    { title: 'Partner 6', img: 'CM', g: grad('#0a0a0a', '#7a7a7a', '#020202') }
  ];

  const SLIDE_MS = 4000; // indicator / slide auto-advance: every 4 seconds
  const $ = (id) => document.getElementById(id);

  function initIcons(root) {
    (root || document).querySelectorAll('[data-icon]:not([data-icon-ready])').forEach((el) => {
      el.dataset.iconReady = '1';
      const base = el.dataset.icon;
      const img = new Image();
      img.className = 'icon-img';
      img.alt = '';
      img.draggable = false;
      let tried = 'jpg';
      img.onload = () => { el.classList.add('has-img'); el.appendChild(img); };
      img.onerror = () => { if (tried === 'jpg') { tried = 'png'; img.src = base + '.png'; } };
      img.src = base + '.jpg';
    });
  }

  const revealIO = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.filter((en) => en.isIntersecting).forEach((en, k) => {
      en.target.style.setProperty('--i', Math.min(k, 5));
      en.target.classList.add('in');
      revealIO.unobserve(en.target);
    });
  }, { threshold: 0.12 }) : null;

  function reveal(list) {
    list.forEach((el, i) => {
      if (el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      el.style.setProperty('--i', Math.min(i, 5));
      if (revealIO) revealIO.observe(el); else el.classList.add('in');
    });
  }

  window.imgFallback = function (el) {
    const base = el.dataset.base;
    if (el.dataset.tried !== 'png') { el.dataset.tried = 'png'; el.src = base + '.png'; }
    else el.style.display = 'none';
  };

  function imgTag(base, alt) {
    return `<img src="${base}.jpg" data-base="${base}" alt="${alt || ''}" loading="lazy" decoding="async" draggable="false" onerror="imgFallback(this)">`;
  }

  // avatar badge on feature cards: tries each .jpg / .png in order, keeps the white circle if none load
  const BADGE_FILES = ['Logo.jpg', 'Logo.png'];
  window.badgeFallback = function (el) {
    const list = (el.dataset.list || '').split('|').filter(Boolean);
    const next = parseInt(el.dataset.i || '0', 10) + 1;
    if (next < list.length) { el.dataset.i = next; el.src = list[next]; }
    else el.style.display = 'none';
  };

  function badgeTag(badge) {
    const list = (typeof badge === 'string' ? [badge] : []).concat(BADGE_FILES).filter((v, i, a) => a.indexOf(v) === i);
    return `<span class="mini-logo has-img"><img src="${list[0]}" data-list="${list.join('|')}" data-i="0" alt="" draggable="false" onerror="badgeFallback(this)"></span>`;
  }

  function videoTag(file) {
    return `<video src="${file}" autoplay muted loop playsinline preload="auto" onerror="this.style.display='none';this.parentElement.classList.add('no-video')"></video><span class="play-badge" aria-hidden="true"></span>`;
  }

  $('sugTrack').innerHTML = SUGGESTIONS.map((s, i) => `
    <div class="media-card" style="--g:${s.g}">
      ${imgTag(s.img, 'Suggestion ' + (i + 1))}
      <a class="pill-btn" href="${s.link}">See More</a>
    </div>`).join('');

  const featureList = $('featureList');
  const featureCount = $('featureCount');

  // build all rows once; searching only shows / hides them so nothing flickers or re-loads
  featureList.innerHTML = FEATURES.map((f) => `
      <div class="feature-row">
        <div class="media-card" style="--g:${f.g}">
          ${f.badge ? badgeTag(f.badge) : ''}
          ${imgTag(f.img, 'Feature')}
        </div>
        <p>${f.title}</p>
      </div>`).join('') + '<div class="no-results is-hidden">No results found</div>';
  initIcons(featureList);

  const featureRows = Array.from(featureList.querySelectorAll('.feature-row'));
  const noResults = featureList.querySelector('.no-results');
  reveal(featureRows);
  reveal([featureCount]);

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let shownCount = FEATURES.length, countRaf = 0;

  function animateCount(to) {
    const from = shownCount;
    shownCount = to;
    cancelAnimationFrame(countRaf);
    const write = (n) => { featureCount.textContent = `Upcoming Features (${n})`; };
    if (reduceMotion || from === to) { write(to); return; }
    const t0 = performance.now(), dur = 350;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      write(Math.round(from + (to - from) * p));
      if (p < 1) countRaf = requestAnimationFrame(tick);
    };
    countRaf = requestAnimationFrame(tick);
    featureCount.classList.remove('bump'); void featureCount.offsetWidth; featureCount.classList.add('bump');
  }

  function filterFeatures(q) {
    let k = 0;
    featureRows.forEach((row, i) => {
      const match = !q || FEATURES[i].title.toLowerCase().includes(q);
      const wasHidden = row.classList.contains('is-hidden');
      row.classList.toggle('is-hidden', !match);
      if (match && wasHidden) {
        // rows that come back glide in one after another
        row.style.setProperty('--e', Math.min(k, 6));
        row.classList.remove('enter'); void row.offsetWidth; row.classList.add('enter');
      }
      if (match) k++;
    });
    noResults.classList.toggle('is-hidden', k > 0);
    if (k === 0) { noResults.classList.remove('enter'); void noResults.offsetWidth; noResults.classList.add('enter'); }
    animateCount(k);
  }

  $('promoGrid').innerHTML = PROMOS.map((p, i) => `
    <div class="media-card" style="--g:${p.g}">${videoTag(p.video)}<span class="card-title">${p.title}</span></div>`).join('');

  $('partnerRow').innerHTML = PARTNERS.map((p, i) => `
    <div class="media-card" style="--g:${p.g}">${imgTag(p.img, 'Partnership ' + (i + 1))}<span class="card-title">${p.title}</span></div>`).join('');

  const sBtn = document.querySelector('.search-btn');
  sBtn.addEventListener('click', (e) => {
    // while searching the icon is an X: close search and return to the normal content
    if (searching) { e.preventDefault(); e.stopPropagation(); cancel(); return; }
    sBtn.classList.remove('pop'); void sBtn.offsetWidth; sBtn.classList.add('pop');
    $('searchInput').focus();
  });

  /* =====================================================
     RECENT SEARCHES
     - tap the search bar -> page swaps to the Recent list
     - searches are saved on the device (localStorage)
     - tap a recent to search it again, x removes one,
       menu icon clears all, See More shows older ones
     ===================================================== */
  const RECENT_KEY = 'ria_recent_searches';
  const RECENT_MAX = 30;
  const RECENT_VISIBLE = 7;

  const input = $('searchInput');
  const form = $('searchForm');
  const home = $('homeContent');
  const recentView = $('recentView');
  const recentList = $('recentList');
  const recentTitle = $('recentTitle');
  const recentEmpty = $('recentEmpty');
  const moreBtn = $('recentMoreBtn');
  const moreLabel = $('recentMoreLabel');
  const menuBtn = $('recentMenuBtn');
  const quick = $('quickMenu');
  const qOverlay = $('qmOverlay');
  const clearBtn = $('clearAllBtn');

  let recents = [];
  try {
    const stored = JSON.parse(localStorage.getItem(RECENT_KEY));
    if (Array.isArray(stored)) recents = stored.filter((x) => typeof x === 'string');
  } catch (e) { recents = []; }

  let searching = false, expanded = false, savedScroll = 0;

  const saveRecents = () => { try { localStorage.setItem(RECENT_KEY, JSON.stringify(recents)); } catch (e) {} };
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function addRecent(term) {
    term = term.trim().replace(/\s+/g, ' ');
    if (!term) return;
    recents = [term].concat(recents.filter((r) => r.toLowerCase() !== term.toLowerCase())).slice(0, RECENT_MAX);
    saveRecents();
  }

  function highlight(text, q) {
    const i = q ? text.toLowerCase().indexOf(q) : -1;
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<b>' + esc(text.slice(i, i + q.length)) + '</b>' + esc(text.slice(i + q.length));
  }

  const SEARCH_SVG = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
  const X_SVG = '<svg viewBox="0 0 24 24"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';

  function currentRows() {
    const q = input.value.trim().toLowerCase();
    if (!q) return { q, rows: recents.map((t) => ({ t, kind: 'recent' })) };
    // search active shows only recent searches (no suggestion rows)
    const mine = recents.filter((t) => t.toLowerCase().includes(q)).map((t) => ({ t, kind: 'recent' }));
    return { q, rows: mine };
  }

  function applyLimit(animate) {
    const q = input.value.trim();
    const items = Array.from(recentList.children).filter((li) => !li.classList.contains('leaving'));
    let k = 0;
    items.forEach((li, i) => {
      const hide = !q && !expanded && i >= RECENT_VISIBLE;
      if (!hide && li.hidden) {
        li.hidden = false;
        if (animate) { li.style.setProperty('--e', Math.min(k++, 6)); li.style.animation = 'none'; void li.offsetWidth; li.style.animation = ''; }
      } else if (hide) li.hidden = true;
    });
    const showMore = !q && items.length > RECENT_VISIBLE;
    moreBtn.hidden = !showMore;
    moreBtn.classList.toggle('open', expanded);
    moreLabel.textContent = expanded ? 'Show Less' : 'See More';
  }

  function renderRecent() {
    const { q, rows } = currentRows();
    recentTitle.textContent = 'Recent';
    // suggestions only show while the search box is empty (typing hides them, clearing/X brings them back)
    const sw = $('suggestWrap'); if (sw) sw.hidden = !!q;
    recentList.innerHTML = rows.map((r, i) => `
      <li class="recent-item${r.kind === 'suggestion' ? ' suggestion' : ''}" data-term="${esc(r.t)}" style="--e:${Math.min(i, 7)}">
        <span class="ico" data-icon="icon-search">${SEARCH_SVG}</span>
        <div class="recent-line">
          <button type="button" class="recent-text">${highlight(r.t, q)}</button>
          <button type="button" class="recent-del" aria-label="Remove ${esc(r.t)}">${X_SVG}</button>
        </div>
      </li>`).join('');
    initIcons(recentList);
    recentEmpty.hidden = rows.length > 0;
    clearBtn.hidden = recents.length === 0;
    recentEmpty.textContent = q ? 'No matches found' : 'No recent searches yet';
    applyLimit(false);
  }

  function setMenu(open) {
    quick.classList.toggle('open', open);
    qOverlay.classList.toggle('show', open);
    quick.setAttribute('aria-hidden', open ? 'false' : 'true');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('menu-open', open);
  }

  function openSearch() {
    if (searching) return;
    searching = true; expanded = false;
    savedScroll = window.scrollY;
    document.body.classList.add('searching');
    home.classList.add('is-away');
    recentView.hidden = false;
    renderRecent();
    window.scrollTo(0, 0);
  }

  function closeSearch() {
    if (!searching) return;
    searching = false;
    document.body.classList.remove('searching');
    recentView.hidden = true;
    home.classList.remove('is-away');
    setMenu(false);
    input.blur();
  }

  function commit(term) {
    term = term.trim();
    if (term) addRecent(term);
    input.value = term;
    closeSearch();
    filterFeatures(term.toLowerCase());
    requestAnimationFrame(() => {
      if (term) $('featureCount').scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo(0, savedScroll);
    });
  }

  function cancel() {
    input.value = '';
    closeSearch();
    filterFeatures('');
    requestAnimationFrame(() => window.scrollTo(0, savedScroll));
  }

  input.addEventListener('focus', openSearch);
  form.addEventListener('click', () => { if (document.activeElement !== input) input.focus(); });
  input.addEventListener('input', () => { if (searching) renderRecent(); });
  form.addEventListener('submit', (e) => { e.preventDefault(); const v = input.value.trim(); if (v) commit(v); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (quick.classList.contains('open')) setMenu(false); else if (searching) cancel();
  });

  recentList.addEventListener('click', (e) => {
    const li = e.target.closest('.recent-item');
    if (!li || li.classList.contains('leaving')) return;
    const term = li.dataset.term;
    if (e.target.closest('.recent-del')) {
      li.classList.add('leaving');
      setTimeout(() => {
        recents = recents.filter((r) => r !== term);
        saveRecents();
        li.remove();
        recentEmpty.hidden = recentList.children.length > 0;
        clearBtn.hidden = recents.length === 0;
        applyLimit(true);
      }, 280);
      return;
    }
    commit(term);
  });

  moreBtn.addEventListener('click', () => { expanded = !expanded; applyLimit(true); });

  menuBtn.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!quick.classList.contains('open')); });
  qOverlay.addEventListener('click', () => setMenu(false));
  // swipe the panel to the right to close it
  (function () {
    let sx = 0, sy = 0;
    quick.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    quick.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (dx > 60 && Math.abs(dx) > Math.abs(dy)) setMenu(false);
    }, { passive: true });
  })();
  clearBtn.addEventListener('click', () => {
    const rowsEl = Array.from(recentList.querySelectorAll('.recent-item:not(.suggestion)'));
    rowsEl.forEach((li, i) => { li.style.animationDelay = (i * 40) + 'ms'; li.classList.add('leaving'); });
    setTimeout(() => { recents = []; saveRecents(); expanded = false; renderRecent(); }, rowsEl.length ? 300 + rowsEl.length * 40 : 0);
  });

  function setupCarousel(root, track, dotsEl) {
    const slides = Array.from(track.children);
    const total = slides.length;
    let index = 0, timer = null, wrapTimer = null;
    let startX = 0, dx = 0, dragging = false, moved = false;

    dotsEl.innerHTML = slides.map((_, i) => `<button class="dot${i === 0 ? ' active' : ''}" aria-label="Slide ${i + 1}"></button>`).join('');
    const dots = Array.from(dotsEl.children);

    const step = () => slides[0].offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 16);
    const place = (extra) => { track.style.transform = `translate3d(${-index * step() + (extra || 0)}px,0,0)`; };

    function apply(i) {
      index = i;
      place(0);
      slides.forEach((c, j) => c.classList.toggle('is-active', j === index));
      dots.forEach((d) => d.classList.remove('active'));
      void dotsEl.offsetWidth;
      dots[index].classList.add('active');
    }

    function goTo(i) {
      const wrapping = i >= total || i < 0;
      const target = (i + total) % total;
      if (!wrapping) { apply(target); return; }
      clearTimeout(wrapTimer);
      track.style.transition = 'opacity 0.18s ease';
      track.style.opacity = '0';
      wrapTimer = setTimeout(() => {
        track.style.transition = 'none';
        apply(target);
        void track.offsetWidth;
        track.style.transition = 'opacity 0.25s ease';
        track.style.opacity = '1';
        wrapTimer = setTimeout(() => { track.style.transition = ''; }, 260);
      }, 190);
    }

    const start = () => { stop(); timer = setInterval(() => { if (document.visibilityState === 'visible') goTo(index + 1); }, SLIDE_MS); };
    const stop = () => { clearInterval(timer); };

    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); start(); }));

    // swipe / drag on the indicator itself to change slides
    let dDown = false, dStartX = 0, dSwiped = false;
    const clampGo = (i) => goTo(Math.max(0, Math.min(total - 1, i)));
    dotsEl.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dDown = true; dSwiped = false; dStartX = e.clientX; stop();
    });
    window.addEventListener('pointermove', (e) => {
      if (!dDown) return;
      const d = e.clientX - dStartX;
      if (Math.abs(d) > 26) { clampGo(index + (d < 0 ? 1 : -1)); dStartX = e.clientX; dSwiped = true; }
    });
    const endDots = () => { if (!dDown) return; dDown = false; start(); };
    window.addEventListener('pointerup', endDots);
    window.addEventListener('pointercancel', endDots);
    dotsEl.addEventListener('click', (e) => { if (dSwiped) { e.preventDefault(); e.stopPropagation(); dSwiped = false; } }, true);
    dotsEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { clampGo(index + 1); start(); }
      if (e.key === 'ArrowLeft') { clampGo(index - 1); start(); }
    });

    root.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; moved = false; startX = e.clientX; dx = 0;
      track.style.transition = 'none';
      root.classList.add('dragging');
      stop();
    });

    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      dx = e.clientX - startX;
      if (Math.abs(dx) > 6) moved = true;
      place(dx);
    });

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      root.classList.remove('dragging');
      track.style.transition = '';
      if (dx < -40) goTo(index + 1);
      else if (dx > 40) goTo(index - 1);
      else apply(index);
      dx = 0;
      start();
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    root.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    root.addEventListener('dragstart', (e) => e.preventDefault());

    window.addEventListener('resize', () => { track.style.transition = 'none'; apply(index); void track.offsetWidth; track.style.transition = ''; });

    track.querySelectorAll('img').forEach(img => { if (img.decode) img.decode().catch(() => {}); });
    apply(0);
    start();
  }

  initIcons(document);
  reveal(Array.from(document.querySelectorAll('.sec-head, .carousel, .carousel-foot')));
  reveal(Array.from(document.querySelectorAll('#promoScroll, #partnerScroll')));

  const promoVideos = Array.from(document.querySelectorAll('#promoGrid video'));

  // Always autoplay: every promo video plays on its own, all at the same time,
  // whether or not it is on screen or another video is already playing.
  const startVideo = (v) => {
    v.muted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  };

  promoVideos.forEach((v) => {
    const card = v.parentElement;
    const sync = () => card.classList.toggle('paused', v.paused);
    v.autoplay = true;
    v.muted = true;
    v.setAttribute('autoplay', '');
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);
    v.addEventListener('loadeddata', () => startVideo(v));
    v.addEventListener('canplay', () => startVideo(v));
    // if the browser/OS pauses it (not the user), start it again
    v.addEventListener('pause', () => { if (!document.hidden) setTimeout(() => startVideo(v), 150); });
    card.classList.add('paused');
    startVideo(v);
  });

  // resume when the tab/app comes back, and on first touch if the browser blocked autoplay
  document.addEventListener('visibilitychange', () => { if (!document.hidden) promoVideos.forEach(startVideo); });
  ['touchstart', 'click', 'scroll'].forEach((ev) =>
    window.addEventListener(ev, () => promoVideos.forEach(startVideo), { once: true, passive: true }));

  setupCarousel($('sugCarousel'), $('sugTrack'),$('sugDots'));

  // bottom nav: hides while scrolling, returns when scrolling stops, stays hidden at the page bottom
  (function () {
    const nav = document.querySelector('.bottom-nav');
    if (!nav) return;
    let stopTimer = null;
    const atBottom = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight > window.innerHeight + 24;
      return scrollable && (window.innerHeight + window.scrollY >= doc.scrollHeight - 6);
    };
    const onScroll = () => {
      nav.classList.add('nav-hidden');
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => {
        if (!atBottom()) nav.classList.remove('nav-hidden');
      }, 180);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { if (!atBottom()) nav.classList.remove('nav-hidden'); });
  })();
})();