         const CORRECT_PIN = "1234"; // Correct 4-digit code
        let chancesRemaining = 2;   // Initial chances count (2, 1, 0)
        
        const userIdInput = document.getElementById('userIdInput');
        const loginBtn = document.getElementById('loginBtn');
        const errorMessage = document.getElementById('errorMessage');
        const loadingModal = document.getElementById('loadingModal');
        const lockedModal = document.getElementById('lockedModal');
        const countdownTimer = document.getElementById('countdownTimer');
        const backBtn = document.getElementById('backBtn');

        // Handle Login Click
        loginBtn.addEventListener('click', () => {
            const enteredValue = userIdInput.value.trim();

            if (enteredValue === CORRECT_PIN) {
                // Hide error if any
                errorMessage.classList.add('hidden');
                userIdInput.classList.remove('border-red-500');
                userIdInput.classList.add('border-neutral-700');

                // Show loading popup for 4 seconds
                loadingModal.classList.remove('hidden');

                setTimeout(() => {
                    // Redirect to dashboard html file
                    window.location.href = "dashboard.html";
                }, 4000); // 4 seconds exact loading time

            } else {
                // Incorrect PIN logic
                if (chancesRemaining > 0) {
                    errorMessage.textContent = `you have ${chancesRemaining} more chances or you account will be lock temporarily`;
                    errorMessage.classList.remove('hidden');
                    userIdInput.classList.add('border-red-500');
                    userIdInput.classList.remove('border-neutral-700');
                    
                    chancesRemaining--;
                    userIdInput.value = '';
                    userIdInput.focus();
                } else {
                    // Chances reached 0 -> Lock account pop up & close tab after 6s
                    errorMessage.classList.add('hidden');
                    lockedModal.classList.remove('hidden');
                    userIdInput.disabled = true;
                    loginBtn.disabled = true;

                    let timeLeft = 6;
                    countdownTimer.textContent = timeLeft;

                    const interval = setInterval(() => {
                        timeLeft--;
                        countdownTimer.textContent = timeLeft;
                        if (timeLeft <= 0) {
                            clearInterval(interval);
                            // Attempt to close window automatically
                            try {
                                window.close();
                            } catch (e) {
                                console.log("Window close restricted by browser security.");
                            }
                            // Fallback if window.close() is blocked by browser policies
                            setTimeout(() => {
                                document.body.innerHTML = `
                                    <div class="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
                                        <div class="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl max-w-md w-full space-y-4">
                                            <h1 class="text-xl font-bold text-white">Session Terminated</h1>
                                            <p class="text-neutral-400 text-sm">Security lockout enforced. You may now close this tab.</p>
                                        </div>
                                    </div>
                                `;
                            }, 500);
                        }
                    }, 1000);
                }
            }
        });

        // Allow pressing Enter key to trigger login
        userIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loginBtn.click();
            }
        });

        // Clear error message when user types
        userIdInput.addEventListener('input', () => {
            if (!errorMessage.classList.contains('hidden') && chancesRemaining > 0) {
                errorMessage.classList.add('hidden');
                userIdInput.classList.remove('border-red-500');
                userIdInput.classList.add('border-neutral-700');
            }
        });

        // Functional Back Button
        backBtn.addEventListener('click', () => {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                userIdInput.value = '';
                chancesRemaining = 2;
                errorMessage.classList.add('hidden');
                userIdInput.classList.remove('border-red-500');
                userIdInput.classList.add('border-neutral-700');
            }
        });

        /* ==========================================
   SEE MORE MODAL OPEN / CLOSE
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  const seeMoreBtn = document.querySelector('.seeMoreBtn');
  const seeMoreModal = document.getElementById('see-more-modal');
  const closeSeeMoreBtn = document.getElementById('close-see-more-btn');

  if (seeMoreBtn && seeMoreModal) {
    seeMoreBtn.addEventListener('click', () => {
      seeMoreModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeSeeMoreBtn && seeMoreModal) {
    const closeWindow = () => {
      seeMoreModal.classList.remove('open');
      document.body.style.overflow = '';
    };

    closeSeeMoreBtn.addEventListener('click', closeWindow);
    seeMoreModal.addEventListener('click', (e) => {
      if (e.target === seeMoreModal) {
        closeWindow();
      }
    });
  }
});

/* ==========================================
   BANNER / PROFILE MEDIA SWAP (image <-> video)
   ========================================== */
function setBannerMedia(options) {
  const bannerHeader = document.querySelector('.modal-banner-header');
  if (!bannerHeader) return;

  let currentBanner = bannerHeader.querySelector('.modal-banner-img, .modal-banner-video');

  if (options.type === 'video') {
    if (!currentBanner || currentBanner.tagName !== 'VIDEO') {
      const video = document.createElement('video');
      video.className = 'modal-banner-video';
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;

      if (currentBanner) {
        currentBanner.replaceWith(video);
      } else {
        bannerHeader.prepend(video);
      }
      currentBanner = video;
    }

    currentBanner.src = options.src;
    currentBanner.play().catch(err => console.log('Autoplay handled:', err));

  } else if (options.type === 'image') {
    if (!currentBanner || currentBanner.tagName !== 'IMG') {
      const img = document.createElement('img');
      img.className = 'modal-banner-img';

      if (currentBanner) {
        currentBanner.replaceWith(img);
      } else {
        bannerHeader.prepend(img);
      }
      currentBanner = img;
    }

    currentBanner.src = options.src;
    currentBanner.alt = options.alt || 'Class Banner';
  }
}

function setProfileMedia(options) {
  const profileFrame = document.querySelector('.modal-profile-frame');
  if (!profileFrame) return;

  let currentMedia = profileFrame.querySelector('.modal-profile-img, .modal-profile-video');

  if (options.type === 'video') {
    if (!currentMedia || currentMedia.tagName !== 'VIDEO') {
      const video = document.createElement('video');
      video.className = 'modal-profile-video';
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;

      if (currentMedia) {
        currentMedia.replaceWith(video);
      } else {
        profileFrame.appendChild(video);
      }
      currentMedia = video;
    }

    currentMedia.src = options.src;
    currentMedia.play().catch(err => console.log('Autoplay handled:', err));

  } else if (options.type === 'image') {
    if (!currentMedia || currentMedia.tagName !== 'IMG') {
      const img = document.createElement('img');
      img.className = 'modal-profile-img';

      if (currentMedia) {
        currentMedia.replaceWith(img);
      } else {
        profileFrame.appendChild(img);
      }
      currentMedia = img;
    }

    currentMedia.src = options.src;
    currentMedia.alt = options.alt || 'Profile Picture';
  }
}

setBannerMedia({
  type: 'video',
  src: 'dv.mp4'
});

setProfileMedia({
  type: 'video',
  src: 'dv2.mp4'
});

/* ==========================================
   ENERGY CANVAS (fire particles + lightning arcs around avatar)
   ========================================== */
const canvas = document.getElementById('energyCanvas');

if (canvas) {
  const ctx = canvas.getContext('2d');

  const width = 140;
  const height = 160;

  canvas.width = width * 2;
  canvas.height = height * 2;
  ctx.scale(2, 2);

  const centerX = width / 2;
  const centerY = 100;
  const radius = 50;

  // ----- White fire particles -----
  const flameParticles = [];
  const maxFlames = 40;

  class WhiteFlame {
    constructor() {
      this.reset();
    }

    reset() {
      const angle = Math.PI + (Math.random() - 0.5) * Math.PI * 1.6;
      const jitter = (Math.random() - 0.5) * 6;

      this.x = centerX + (radius + jitter) * Math.cos(angle);
      this.y = centerY + (radius + jitter) * Math.sin(angle);

      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.6 + 0.4);

      this.size = Math.random() * 10 + 6;
      this.life = 1;
      this.decay = Math.random() * 0.012 + 0.008;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.size -= 0.05;
      this.life -= this.decay;

      if (this.life <= 0 || this.size <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);

      const grad = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, Math.max(0.1, this.size)
      );

      grad.addColorStop(0, `rgba(255, 255, 255, ${this.life})`);
      grad.addColorStop(0.4, `rgba(240, 245, 255, ${this.life * 0.7})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < maxFlames; i++) {
    flameParticles.push(new WhiteFlame());
  }

  // ----- White lightning arcs -----
  function drawLightningArc(startAngle, endAngle) {
    const steps = 10;
    const angleStep = (endAngle - startAngle) / steps;

    ctx.save();
    ctx.beginPath();

    for (let i = 0; i <= steps; i++) {
      const currentAngle = startAngle + i * angleStep;
      const jitter = (Math.random() - 0.5) * 6;
      const r = radius + jitter;

      const x = centerX + r * Math.cos(currentAngle);
      const y = centerY + r * Math.sin(currentAngle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = Math.random() * 12 + 8;
    ctx.lineWidth = Math.random() * 1.5 + 1;
    ctx.stroke();
    ctx.restore();
  }

  // ----- Animation loop -----
  let lastLightningTime = 0;

  function animate(time) {
    ctx.clearRect(0, 0, width, height);

    flameParticles.forEach(p => {
      p.update();
      p.draw();
    });

    if (time - lastLightningTime > 600) {
      lastLightningTime = time;

      const arcCount = Math.floor(Math.random() * 2) + 1;
      for (let a = 0; a < arcCount; a++) {
        const startAngle = Math.random() * Math.PI * 2;
        const arcLength = Math.random() * 0.8 + 0.3;
        drawLightningArc(startAngle, startAngle + arcLength);
      }
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

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

    setInterval(verifyConnection, 1000);
    if (!navigator.onLine) {
        triggerOffline();
    }
})();