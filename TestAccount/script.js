// ---------- Logout confirmation ----------
// Change this to the page you want users to land on after logging out.
const LOGOUT_REDIRECT_URL = '../User/index.html';

function openLogoutModal() {
  document.getElementById('logoutModal').style.display = 'flex';
}

function closeLogoutModal() {
  document.getElementById('logoutModal').style.display = 'none';
}

const LOGOUT_LOADING_MS = 1500; // how long the loading screen shows before redirecting
let logoutInProgress = false;

function confirmLogout() {
  if (logoutInProgress) return;
  logoutInProgress = true;
  closeLogoutModal();
  document.getElementById('logoutLoading').style.display = 'flex';
  setTimeout(() => {
    window.location.href = LOGOUT_REDIRECT_URL;
  }, LOGOUT_LOADING_MS);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLogoutModal();
});

function openModal(title, text) {
      document.getElementById('modalTitle').innerText = title;
      const bodyEl = document.getElementById('modalBody');
      const lines = text.split('\n').filter(Boolean);
      if (lines.length > 1) {
        bodyEl.innerHTML = '<div class="modal-body-row">' + lines.map(l => `<div class="modal-body-cell">${l}</div>`).join('') + '</div>';
      } else {
        bodyEl.textContent = text;
      }
      document.getElementById('infoModal').style.display = 'flex';
    }

    function closeModal(event) {
      document.getElementById('infoModal').style.display = 'none';
    }

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    function setupAutoSlideshow(slideshowId, indicatorsId) {
      const slideshow = document.getElementById(slideshowId);
      const track = slideshow.querySelector('.slideshow-track');
      const dots = document.getElementById(indicatorsId).querySelectorAll('.indicator-dot');
      const totalSlides = dots.length;
      let currentIndex = 0;

      function applySlide(index) {
        currentIndex = index;
        track.style.transform = `translate3d(-${currentIndex * 82}%, 0, 0)`;

        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });
        track.querySelectorAll('.slide-card').forEach((c, j) => c.classList.toggle('is-active', j === currentIndex));
      }

      let wrapTimer = null;

      function goToSlide(index) {
        const wrapping = index >= totalSlides || index < 0;
        const target = (index + totalSlides) % totalSlides;

        if (!wrapping) {
          applySlide(target);
          return;
        }

        clearTimeout(wrapTimer);
        track.style.transition = 'opacity 0.18s ease';
        track.style.opacity = '0';
        wrapTimer = setTimeout(() => {
          track.style.transition = 'none';
          applySlide(target);
          void track.offsetWidth;
          track.style.transition = 'opacity 0.25s ease';
          track.style.opacity = '1';
          wrapTimer = setTimeout(() => { track.style.transition = ''; }, 260);
        }, 190);
      }

      track.querySelectorAll('img').forEach(img => {
        img.decoding = 'async';
        img.draggable = false;
        if (img.decode) img.decode().catch(() => {});
      });

      function startTimer() {
        return setInterval(() => {
          goToSlide(currentIndex + 1);
        }, 4000);
      }

      let timer = startTimer();
      applySlide(0);

      function restartTimer() {
        clearInterval(timer);
        timer = startTimer();
      }

      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          goToSlide(i);
          restartTimer();
        });
      });

      // swipe / drag directly on the indicator dots
      const indEl = document.getElementById(indicatorsId);
      let iDown = false, iStartX = 0, iSwiped = false;
      const clampGo = (i) => goToSlide(Math.max(0, Math.min(totalSlides - 1, i)));
      indEl.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        iDown = true; iSwiped = false; iStartX = e.clientX;
        clearInterval(timer);
      });
      window.addEventListener('pointermove', (e) => {
        if (!iDown) return;
        const d = e.clientX - iStartX;
        if (Math.abs(d) > 26) { clampGo(currentIndex + (d < 0 ? 1 : -1)); iStartX = e.clientX; iSwiped = true; }
      });
      const endInd = () => { if (!iDown) return; iDown = false; restartTimer(); };
      window.addEventListener('pointerup', endInd);
      window.addEventListener('pointercancel', endInd);
      indEl.addEventListener('click', (e) => { if (iSwiped) { e.preventDefault(); e.stopPropagation(); iSwiped = false; } }, true);

      let touchStartX = 0;
      let touchStartY = 0;
      let touchDeltaX = 0;
      let isSwiping = false;
      const SWIPE_THRESHOLD = 40;
      
      function isMobileViewport() {
        return window.matchMedia('(max-width: 991px)').matches;
      }

      slideshow.addEventListener('touchstart', (e) => {
        if (!isMobileViewport()) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchDeltaX = 0;
        isSwiping = true;
        track.style.transition = 'none';
        clearInterval(timer);
      }, { passive: true });

      slideshow.addEventListener('touchmove', (e) => {
        if (!isSwiping || !isMobileViewport()) return;
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        touchDeltaX = touchX - touchStartX;
        const deltaY = touchY - touchStartY;
        if (Math.abs(touchDeltaX) > Math.abs(deltaY)) {
          const trackWidth = track.getBoundingClientRect().width;
          const dragPercent = (touchDeltaX / trackWidth) * 100;
          track.style.transform = `translate3d(calc(-${currentIndex * 82}% + ${dragPercent}%), 0, 0)`;
        }
      }, { passive: true });

      slideshow.addEventListener('touchend', () => {
        if (!isSwiping || !isMobileViewport()) return;
        isSwiping = false;
        track.style.transition = '';
        if (touchDeltaX < -SWIPE_THRESHOLD) {
          goToSlide(currentIndex + 1);
        } else if (touchDeltaX > SWIPE_THRESHOLD) {
          goToSlide(currentIndex - 1);
        } else {
          goToSlide(currentIndex);
        }

        touchDeltaX = 0;
        restartTimer();
      });

      slideshow.addEventListener('touchcancel', () => {
        if (!isSwiping) return;
        isSwiping = false;
        track.style.transition = '';
        goToSlide(currentIndex);
        restartTimer();
      });
    }

    function setupNavAutoHide() {
      const nav = document.querySelector('.bottom-nav');
      let scrollStopTimer = null;
      const SCROLL_STOP_DELAY = 500;
      const BOTTOM_THRESHOLD = 40;

      function isAtBottom() {
        const scrollY = window.scrollY || window.pageYOffset;
        const viewportH = window.innerHeight;
        const fullH = document.documentElement.scrollHeight;
        return scrollY + viewportH >= fullH - BOTTOM_THRESHOLD;
      }

      function onScroll() {
        nav.classList.add('nav-hidden');
        clearTimeout(scrollStopTimer);
        scrollStopTimer = setTimeout(() => {
          if (!isAtBottom()) {
            nav.classList.remove('nav-hidden');
          }
        }, SCROLL_STOP_DELAY);
      }

      window.addEventListener('scroll', onScroll, { passive: true });
    }

    document.addEventListener('DOMContentLoaded', () => {
      setupAutoSlideshow('newsSlideshow', 'newsIndicators');
      setupAutoSlideshow('riaSlideshow', 'riaIndicators');
      setupNavAutoHide();
    });


(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        .small-social-icons {
            transform: none;
            margin-top: -12px;
            margin-bottom: 2px;
        }

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

const icon = (inner, strokeW=1.8) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

(function(){
  const scroller = document.getElementById('tasksScroll');
  let isDown = false, startX = 0, startScroll = 0, moved = false;
  const start = (x)=>{ isDown = true; moved = false; startX = x; startScroll = scroller.scrollLeft; };
  const move = (x)=>{
    if(!isDown) return;
    const dx = x - startX;
    if(Math.abs(dx) > 4) moved = true;
    const max = scroller.scrollWidth - scroller.clientWidth;
    scroller.scrollLeft = Math.max(0, Math.min(max, startScroll - dx));
  };
  const end = ()=>{ isDown = false; };
  scroller.addEventListener('mousedown', e=>{ start(e.clientX); scroller.style.cursor='grabbing'; });
  window.addEventListener('mousemove', e=> move(e.clientX));
  window.addEventListener('mouseup', ()=>{ end(); scroller.style.cursor='grab'; });
  scroller.addEventListener('click', e=>{ if(moved){ e.preventDefault(); e.stopPropagation(); } }, true);
})();

const CHEV = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M5 8h14l-7 9z"/></svg>`;

const ICONS = {
  star: '<path d="M12 2.5l3.2 6.8 7.3.9-5.4 5.1 1.5 7.3L12 18.9 5.4 22.6 6.9 15.3 1.5 10.2l7.3-.9z"/>',
  theme: '<rect x="4" y="5" width="16" height="14" rx="2.4"/><path d="M12 5v14" fill="currentColor"/><path d="M8 9h1M8 12h1M8 15h1" stroke-width="1.3"/>',
  trophy: '<path d="M8.5 21h7M12 17.2V21M8 4h8v4.2a4 4 0 0 1-8 0z"/><path d="M8 5.2H5.3a1 1 0 0 0-1 1.1c.2 2.6 1.9 4.4 3.9 4.6M16 5.2h2.7a1 1 0 0 1 1 1.1c-.2 2.6-1.9 4.4-3.9 4.6"/>',
  shield: '<path d="M12 2.3l7.5 2.8v5.4c0 5-3.3 8.7-7.5 11.2-4.2-2.5-7.5-6.2-7.5-11.2V5.1z" fill="currentColor" stroke="none"/>',
  bell: '<path d="M18 8.5a6 6 0 0 0-12 0c0 6.5-2.5 8.5-2.5 8.5h17S18 15 18 8.5z"/><path d="M13.7 20.5a2 2 0 0 1-3.4 0"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2.4"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
  gear: '<circle cx="12" cy="12" r="3.1"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  help: '<circle cx="12" cy="12" r="9.3"/><path d="M9.1 9.3a3 3 0 0 1 5.8 1c0 2-3 2-3 3.9"/><circle cx="12" cy="17" r=".2" fill="currentColor"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 3v5h5M8 13h8M8 17h5"/>',  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8 9h8M8 13h5"/>',  chart: '<path d="M3.5 3.5v17h17"/><path d="M7 15l4-4 3 3 5-6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  puzzle: '<path d="M9 3h6v2a2 2 0 0 0 2 2h2v6h-2a2 2 0 0 0 0 4h2v6h-6v-2a2 2 0 0 0-4 0v2H5v-6h2a2 2 0 0 0 0-4H5V7h4a2 2 0 0 0 0-4V3z"/>',  globe: '<circle cx="12" cy="12" r="9.3"/><path d="M2.7 12h18.6M12 2.7a15 15 0 0 1 0 18.6 15 15 0 0 1 0-18.6z"/>',
  camera: '<path d="M4 8h3.2l1.8-2.6h6l1.8 2.6H20v11.5H4z"/><circle cx="12" cy="13.7" r="3.4"/>',
  headphones: '<path d="M4 14v-2.4a8 8 0 0 1 16 0V14"/><rect x="3.3" y="14" width="4" height="6" rx="1"/><rect x="16.7" y="14" width="4" height="6" rx="1"/>',
  target: '<circle cx="12" cy="12" r="9.3"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r=".9" fill="currentColor"/>',
  mail: '<rect x="3" y="5.2" width="18" height="13.6" rx="2"/><path d="M3 7l9 6 9-6"/>',
  gift: '<rect x="3.2" y="8.5" width="17.6" height="12.5" rx="1"/><path d="M12 8.5V21M3.2 12.5h17.6"/><path d="M12 8.5c-2.2 0-4.4-1.1-4.4-3.1a2.1 2.1 0 0 1 4.2-.4 2.1 2.1 0 0 1 4.2.4c0 2-2.2 3.1-4.4 3.1z"/>',
  video: '<rect x="2" y="6.5" width="14.5" height="11" rx="2"/><path d="M22 8.5l-5.5 3.5 5.5 3.5z"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  info:'<line x1="12" y1="10.5" x2="12" y2="18" stroke-width="3.2"/><circle cx="12" cy="5.8" r="1.5" fill="currentColor" stroke="none"/>',
  palette:'<path d="M13 3.2c-5.4 0-9.8 4.1-9.8 9.2 0 4 3 6.6 6 6.6 1.1 0 1.6-.6 1.6-1.4 0-.6-.4-1-.4-1.7 0-.9.8-1.6 1.9-1.6h2.1c3.3 0 6-2.4 6-5.8 0-3-3.2-5.3-7.4-5.3z" fill="currentColor" stroke="none"/><circle cx="8.5" cy="10.5" r=".9" fill="#000"/><circle cx="12" cy="8" r=".9" fill="#000"/><circle cx="16" cy="9.5" r=".9" fill="#000"/>',
  sparkle:'<path d="M6 4.5c.6 1.8 1.7 2.9 3.5 3.5-1.8.6-2.9 1.7-3.5 3.5-.6-1.8-1.7-2.9-3.5-3.5C4.3 7.4 5.4 6.3 6 4.5z" fill="currentColor" stroke="none"/><path d="M17 9c.9 2.6 2.5 4.2 5 5-2.5.8-4.1 2.4-5 5-.9-2.6-2.5-4.2-5-5 2.5-.8 4.1-2.4 5-5z" fill="currentColor" stroke="none"/>',
  square: '<path d="M9 6h12M9 12h12M9 18h12"/><rect x="3" y="4" width="4" height="4" rx="1"/><rect x="3" y="10" width="4" height="4" rx="1"/><rect x="3" y="16" width="4" height="4" rx="1"/>',
  fire: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/>',
  flask:'<path d="M9.5 3h5M10.2 3v6.2L5.8 18a2 2 0 0 0 1.8 2.9h8.8a2 2 0 0 0 1.8-2.9l-4.4-8.8V3"/><path d="M8 15h8"/>',
  tools: '<path d="M7 10h3v-3l-3.5-3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1-3 3l-6-6a6 6 0 0 1-8-8l3.5 3.5z"/>',
  rocket: '<path d="M15 4a6 6 0 0 1 5 5l-6 6a8 8 0 0 1-5 2l-3-3a8 8 0 0 1 2-5l7-5z"/><path d="M9 15l-4 4M12 18l-2 2M4 12l2-2"/><circle cx="15" cy="9" r="1"/>',rocket: '<path d="M15 4a6 6 0 0 1 5 5l-6 6a8 8 0 0 1-5 2l-3-3a8 8 0 0 1 2-5l7-5z"/><path d="M9 15l-4 4M12 18l-2 2M4 12l2-2"/><circle cx="15" cy="9" r="1"/>',
};

const accData = [
  {name:'General Information', icons:['user','doc','calendar','bell','globe','shield'], labels:['Class Rules','School Calendar','Class Schedule','Funds Budget','Grades']},
  {name:"Albums & Video's", icons:['camera','video','folder','music','star','globe'], labels:['General Content','Section Gallerys','Classroom Highlights','Featured Section','Important Events']},
  {name:'Attendance Manager', icons:['calendar','chart','user','bell','doc','target'], labels:['Daily Attendance Record','Weekly Summary','Monthly Report','Absences & Late Lists','Submission Section','Attendance Guidelines','Overall Attendance Status']},
  {name:'Learning Modules', icons:['book','doc','chart','headphones','video','target'], labels:['All Subjects','Weekly Modules','Download Materials','Instructions','Submission Portal','Reviewers & References','Archive Modules']},
  {name:'Special Actions', icons:['star','gift','lock','puzzle','mail','shield'], labels:['Research Project (R.I.A)','Admin Exclusive','Restricted Section (Officers)','AI Study Assistant (Classified)','Research Hub']},
];
const accBox = document.getElementById('accordions');
accData.forEach((sec)=>{
  const acc = document.createElement('div');
  acc.className = 'acc';
  acc.innerHTML = `
    <div class="acc-head">
      <h3>${sec.name}</h3>
      <div class="chev">${CHEV}</div>
    </div>
    <div class="acc-body">
      <div class="acc-list">
        ${sec.labels.map(lbl=>`<button type="button" class="acc-row">${lbl}</button>`).join('')}
      </div>
    </div>`;
  acc.querySelector('.acc-head').addEventListener('click', ()=>{
    const body = acc.querySelector('.acc-body');
    const isOpen = acc.classList.toggle('open');
    body.style.maxHeight = isOpen ? body.scrollHeight + 'px' : '0px';
  });
  accBox.appendChild(acc);
});

const featureData = [
  { image: './C1.jpg', tag: 'Brigada Eskwela' },
  { image: './C2.jpg', tag: 'Cariñosa' },
  { image: './C3.jpg', tag: 'Early Birds' },
  { image: './C4.jpg', tag: 'PTA Meeting' },
  { image: './C5.jpg', tag: 'Group Selfie' },
];

const featureTrack = document.getElementById('featureTrack');
featureData.forEach((f,i)=>{
  const slide = document.createElement('div');
  slide.className = 'feature-slide' + (i===0 ? ' active' : '');
  
  slide.style.backgroundImage = `url(${f.image})`;
  slide.style.backgroundSize = 'cover';
  slide.style.backgroundPosition = 'center';
  
  slide.innerHTML = `<span class="tag">${f.tag}</span>`;
  featureTrack.appendChild(slide);
});
let fIdx = 0;
function goFeature(i){
  fIdx = (i+featureData.length)%featureData.length;
  [...featureTrack.children].forEach((s,j)=> s.classList.toggle('active', j===fIdx));
}
setInterval(()=>goFeature(fIdx+1), 3200);

const qaData = [
  {ic:'star', label:'R.I.A Pro'},
  {ic:'gear', label: 'Control Center' },
  {ic:'trophy', label:'Rankings'},
  {ic:'shield', label:'Special User Section'},
  {ic:'sparkle', label:'Super AI', extra:true},
  {ic:'square', label:'Developers Lists', extra:true},
  {ic:'fire', label:'Pendulum Os', extra:true},
  {ic:'flask', label:'Test Features', extra:true},
  {ic:'tools', label:'Developer Options', extra:true},
  {ic:'rocket', label:'Future Mode', extra:true},
];

const qaList = document.getElementById('qaList');

qaData.forEach(q => {
  const row = document.createElement('div');
  row.className = 'qa-item' + (q.extra ? ' qa-extra' : '');
  row.innerHTML = `<div class="ic">${icon(ICONS[q.ic])}</div><span>${q.label}</span>`;
  qaList.appendChild(row);
});

const qaToggleBtn = document.getElementById('qaToggleBtn');
let qaExpanded = false;
let isLoading = false;

qaToggleBtn.addEventListener('click', () => {
  if (isLoading) return;

  if (!qaExpanded) {
    isLoading = true;
    qaToggleBtn.style.pointerEvents = 'none';

    const loader = document.createElement('div');
    loader.className = 'qa-dropdown-loader';

    const firstExtraItem = qaList.querySelector('.qa-extra');
    if (firstExtraItem) {
      qaList.insertBefore(loader, firstExtraItem);
    } else {
      qaList.appendChild(loader);
    }

setTimeout(() => {
  loader.remove();
  qaExpanded = true;
  qaList.classList.add('expanded');
  setTimeout(() => { if (qaExpanded) qaList.classList.add('qa-settled'); }, 900);

  qaToggleBtn.innerHTML = 'Show Less <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><polyline points="6 15 12 9 18 15"/></svg>';
  qaToggleBtn.style.pointerEvents = 'auto';
  isLoading = false;
}, 300);

  } else {
    qaExpanded = false;
    qaList.classList.remove('expanded', 'qa-settled');
    qaToggleBtn.innerHTML = 'See More <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>';
  }
});

const extData = [
  {ic:'gear', label:'Settings'},
  {ic:'folder', label:'Folders'},
  {ic:'help', label:'Instructions'},
  {ic:'doc', label:'Documents'},
  {ic:'bell', label:'Notifications'},
  {ic:'chat', label:'Chatters'},
  {ic:'chart', label:'Analytics'},
  {ic:'user', label:'Profile'},
  {ic:'book', label:'Article'},
  {ic:'lock', label:'Security'},
  {ic:'puzzle', label:'Extras'},
  {ic:'globe', label:'Global Chat'},
];
const extScroll = document.getElementById('extScroll');
extData.forEach(e=>{
  const item = document.createElement('div');
  item.className = 'ext-item';
  item.innerHTML = `<div class="ext-btn">${icon(ICONS[e.ic])}</div><span class="ext-name">${e.label}</span>`;
  extScroll.appendChild(item);
});

const planData = [
  {tag:'24H PASS', price:'₱29.99', per:'/ day', name:'Pro Mode : Professional (R.I.A) ', desc:'Enjoy 24-hour Pro Access with exclusive customization, special features, unique badges, cool effects, passkey login, and flexible Casual or Professional mode switching.', info:'Billed once at ₱29.99 for 24 hours of Pro Access. Access ends automatically after 24 hours with no auto-renewal.'},
  {tag:'POPULAR', price:'₱199.99', per:'/ month', name:'Admin Mode : Professional R+ (R.I.A)', desc:'Get a full month of R+ Access with all daily perks, priority support, advanced analytics, and early access to new Learning Modules.', info:'Billed at ₱199.99 every 30 days. Includes everything in the Basic Plan plus priority support and advanced analytics.'},
  {tag:'SAVE 35%', price:'₱1,299.99 ', per:'/ year', name:'Super VIP : Professional Pro+ (R.I.A)', desc:'Unlock a full year of Pro+ Access at the best value, including everything in Standard plus exclusive yearly badges and premium event invites.', info:'Billed at ₱1,299.99 every 365 days, the best value per day. Includes everything in the Standard Plan plus exclusive yearly badges and premium event invites.'},
];
const planTrack = document.getElementById('planTrack');
const planDots = document.getElementById('planDots');
planData.forEach((p,i)=>{
  const slide = document.createElement('div');
  slide.className = 'plan-slide';
  slide.innerHTML = `
    <div class="plan-card">
      <div class="plan-top">
        <div class="plan-badge">${p.tag}</div>
        <div class="plan-price">
          <div class="p-num"><b>${p.price}</b><div>${p.per}</div></div>
          <button type="button" class="info" aria-label="${p.name} Information"><span class="info-ic">${icon(ICONS.info,1.8)}</span></button>
        </div>
      </div>
      <div class="plan-name">${p.name}</div>
      <div class="plan-desc">${p.desc}</div>
      <div class="plan-cta">BUY NOW</div>
    </div>`;
  slide.querySelector('.info').addEventListener('click', (e)=>{
    e.stopPropagation();
    openModal(p.name, p.info);
  });
  planTrack.appendChild(slide);
  const dot = document.createElement('i');
  if(i===0) dot.className='on';
  planDots.appendChild(dot);
});
let pIdx = 0;
function goPlan(i){
  pIdx = (i+planData.length)%planData.length;
  planTrack.style.transform = `translateX(-${pIdx*100}%)`;
  [...planDots.children].forEach((d,j)=>d.className = j===pIdx?'on':'');
}
let planTimer = setInterval(()=>goPlan(pIdx+1), 3800);
(function(track){
  let startX=0, dx=0, dragging=false;
  track.addEventListener('touchstart', e=>{dragging=true; startX=e.touches[0].clientX; clearInterval(planTimer);});
  track.addEventListener('touchmove', e=>{ if(!dragging) return; dx = e.touches[0].clientX-startX; });
  track.addEventListener('touchend', ()=>{
    if(dx<-40) goPlan(pIdx+1); else if(dx>40) goPlan(pIdx-1);
    dx=0; dragging=false;
    planTimer = setInterval(()=>goPlan(pIdx+1), 3800);
  });
})(planTrack);

const sidebarPhone = document.getElementById('sidebarPhone');
const overlay = document.getElementById('overlay');
const menuBtn = document.getElementById('menuBtn');
function openSidebar(){ sidebarPhone.classList.add('open'); overlay.classList.add('show'); document.documentElement.classList.add('sidebar-open'); document.body.classList.add('sidebar-open'); }
function closeSidebar(){ sidebarPhone.classList.remove('open'); overlay.classList.remove('show'); document.documentElement.classList.remove('sidebar-open'); document.body.classList.remove('sidebar-open'); }
menuBtn.addEventListener('click', ()=>{
  sidebarPhone.classList.contains('open') ? closeSidebar() : openSidebar();
});
overlay.addEventListener('click', closeSidebar);
overlay.addEventListener('touchmove', e=>e.preventDefault(), {passive:false});

(function () {
  const popupOverlay = document.getElementById('popupOverlay');
  const popupSliderContainer = document.getElementById('sliderContainer');
  const popupSlides = popupSliderContainer.querySelectorAll('.slide');
  let popupCurrent = 0;
  let popupAutoSlideTimer;

  function popupShowSlide(index) {
    popupSlides[popupCurrent].classList.remove('active');
    popupCurrent = (index + popupSlides.length) % popupSlides.length;
    popupSlides[popupCurrent].classList.add('active');
  }

  function popupNextSlide() {
    popupShowSlide(popupCurrent + 1);
  }

  function popupStartAutoSlide() {
    clearInterval(popupAutoSlideTimer);
    popupAutoSlideTimer = setInterval(popupNextSlide, 4000);
  }

  function popupStopAutoSlide() {
    clearInterval(popupAutoSlideTimer);
  }

  let popupTouchStartX = 0;
  let popupTouchEndX = 0;
  let popupJustSwiped = false;

  popupSliderContainer.addEventListener('touchstart', (e) => {
    popupTouchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  popupSliderContainer.addEventListener('touchend', (e) => {
    popupTouchEndX = e.changedTouches[0].screenX;
    popupHandleSwipe();
  }, { passive: true });

  function popupHandleSwipe() {
    const diff = popupTouchStartX - popupTouchEndX;
    const threshold = 40;
    if (Math.abs(diff) > threshold) {
      popupJustSwiped = true;
      setTimeout(() => { popupJustSwiped = false; }, 400);
      if (diff > 0) {
        popupShowSlide(popupCurrent + 1);
      } else {
        popupShowSlide(popupCurrent - 1);
      }
      popupStartAutoSlide();
    }
  }

  // Tap a slide to open it in a bigger popup with an X button (swipe still changes slides)
  const imageViewer = document.getElementById('imageViewer');
  const imageViewerImg = document.getElementById('imageViewerImg');

  function openImageViewer(src, alt) {
    imageViewerImg.src = src;
    imageViewerImg.alt = alt || '';
    imageViewer.style.display = 'flex';
    popupStopAutoSlide();
  }

  function closeImageViewer() {
    imageViewer.style.display = 'none';
    imageViewerImg.removeAttribute('src');
    if (popupOverlay.style.display === 'flex') popupStartAutoSlide();
  }
  window.closeImageViewer = closeImageViewer;

  // Single tap: previous (left half) / next (right half). Double tap: full screen view.
  const DOUBLE_TAP_MS = 280;
  let lastTapTime = 0;
  let singleTapTimer = null;

  popupSliderContainer.addEventListener('click', (e) => {
    if (popupJustSwiped) return;
    const now = Date.now();

    if (now - lastTapTime < DOUBLE_TAP_MS) {
      // second tap -> cancel the pending slide change and open full screen
      clearTimeout(singleTapTimer);
      lastTapTime = 0;
      const active = popupSlides[popupCurrent];
      openImageViewer(active.src, active.alt);
      return;
    }

    lastTapTime = now;
    const rect = popupSliderContainer.getBoundingClientRect();
    const tapLeft = (e.clientX - rect.left) < rect.width / 2;
    singleTapTimer = setTimeout(() => {
      popupShowSlide(popupCurrent + (tapLeft ? -1 : 1));
      popupStartAutoSlide();
    }, DOUBLE_TAP_MS);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && imageViewer.style.display === 'flex') closeImageViewer();
  });

  // lock page scroll while the popup is open (touch scrolling on iOS/Android too)
  const popupContentEl = popupOverlay.querySelector('.popup-content');
  popupOverlay.addEventListener('touchmove', function (e) {
    const canScrollInside = popupContentEl.scrollHeight > popupContentEl.clientHeight;
    if (!(canScrollInside && popupContentEl.contains(e.target))) e.preventDefault();
  }, { passive: false });
  popupOverlay.addEventListener('wheel', function (e) {
    if (!popupContentEl.contains(e.target)) e.preventDefault();
  }, { passive: false });

  function openFeaturedPopup() {
    popupOverlay.style.display = 'flex';
    document.documentElement.classList.add('popup-open');
    document.body.classList.add('popup-open');
    popupCurrent = 0;
    popupSlides.forEach(s => s.classList.remove('active'));
    popupSlides[0].classList.add('active');
    popupStartAutoSlide();
  }

  function closeFeaturedPopup() {
    popupOverlay.style.display = 'none';
    document.documentElement.classList.remove('popup-open');
    document.body.classList.remove('popup-open');
    popupStopAutoSlide();
  }

  window.closeFeaturedPopup = closeFeaturedPopup;

  // show the Featured popup only once every 7 page loads
  const POPUP_EVERY_N_LOADS = 7;
  const POPUP_COUNT_KEY = 'featuredPopupLoadCount';

  function shouldShowFeaturedPopup() {
    let count = 0;
    try {
      count = parseInt(localStorage.getItem(POPUP_COUNT_KEY), 10) || 0;
      localStorage.setItem(POPUP_COUNT_KEY, String((count + 1) % POPUP_EVERY_N_LOADS));
    } catch (e) {
      return true; // storage unavailable: fall back to always showing
    }
    return count === 0; // loads 1, 8, 15, ...
  }

  window.addEventListener('load', function () {
    if (shouldShowFeaturedPopup()) openFeaturedPopup();
  });
})();

/* =========================================================
   ANIMATIONS (same style as the Search page)
   ========================================================= */
(function () {
  const run = function () {
    const inViewIO = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add(en.target.classList.contains('pop-item') ? 'in-view' : 'in');
        inViewIO.unobserve(en.target);
      });
    }, { threshold: 0.12 }) : null;

    function watch(el, cls) {
      if (inViewIO) inViewIO.observe(el); else el.classList.add(cls);
    }

    // whole sections fade/slide up as they scroll into view
    const sections = document.querySelectorAll(
      'body > .greeting, body > .dashboard-header, body > .section-label, body > .worksheets-scroll, ' +
      'body > .tasks-manager-label, body > .dues-card, body > .attendance-header, body > .attendance-footer, ' +
      'body > .school-events-section, body > .slideshow-section, body > .ria-banner-card, body > .app-footer'
    );
    sections.forEach(function (el) {
      el.classList.add('reveal');
      el.style.setProperty('--i', 0);
      watch(el, 'in');
    });

    // cards / pills / rows pop in one after another
    const groups = [
      '.worksheets-scroll .btn-pill',
      '.dues-list .due-item',
      '.attendance-scroll .attendance-card'
    ];
    groups.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        el.classList.add('pop-item');
        el.style.setProperty('--i', Math.min(i, 5));
        watch(el, 'in-view');
      });
    });

    // icons pop when tapped
    document.querySelectorAll('.icon-link').forEach(function (a) {
      a.addEventListener('click', function () {
        a.classList.remove('pop'); void a.offsetWidth; a.classList.add('pop');
      });
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();


/* sidebar sections glide in one after another when it opens */
(function () {
  const side = document.getElementById('sidebarPhone');
  if (!side) return;
  Array.from(side.children).forEach(function (el, i) { el.style.setProperty('--i', i); });
})();