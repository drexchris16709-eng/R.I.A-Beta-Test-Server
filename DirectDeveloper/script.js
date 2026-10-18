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
                    window.location.href = "../DeveloperCustomerService/DVCS.html";
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

        // Back button: goes to another page (change BACK_REDIRECT_URL to your page)
        const BACK_REDIRECT_URL = '../UserInteraction/UserI.html';
        backBtn.addEventListener('click', () => {
            document.body.style.transition = 'opacity 0.35s ease';
            document.body.style.opacity = '0';          // quick fade out, then go
            setTimeout(() => { window.location.href = BACK_REDIRECT_URL; }, 350);
        });

        /* ==========================================
   SEE MORE MODAL OPEN / CLOSE
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  const seeMoreBtn = document.querySelector('.seeMoreBtn');
  const seeMoreModal = document.getElementById('see-more-modal');
  const closeSeeMoreBtn = document.getElementById('close-see-more-btn');

  // mp3: starts when See More is clicked, loops, and stops when the modal is closed (X / tap outside)
  const music = document.getElementById('modalMusic');
  const MUSIC_SRC = 'D.mp3';

  let musicWanted = false;   // true while the modal is open: the music keeps looping, even if it ends or gets paused by the browser

  const startMusic = () => {
    if (!music) return;
    musicWanted = true;
    if (!music.getAttribute('src')) music.src = MUSIC_SRC;   // restored after the offline handler clears media
    music.loop = true;
    music.currentTime = 0;
    const p = music.play();
    if (p && p.catch) p.catch((err) => console.log('Music blocked or missing:', err));
  };

  const stopMusic = () => {
    if (!music) return;
    musicWanted = false;
    music.pause();
    music.currentTime = 0;
  };

  const resumeMusic = () => {
    if (!music || !musicWanted || !music.getAttribute('src')) return;
    const p = music.play();
    if (p && p.catch) p.catch(() => {});
  };

  if (music) {
    // if the track ever reaches its end or stops by itself, start it again right away
    music.addEventListener('ended', () => { music.currentTime = 0; resumeMusic(); });
    music.addEventListener('pause', () => { if (musicWanted && !document.hidden) setTimeout(() => { if (music.paused) resumeMusic(); }, 150); });
    document.addEventListener('visibilitychange', () => { if (!document.hidden && music.paused) resumeMusic(); });
  }

  if (seeMoreBtn && seeMoreModal) {
    seeMoreBtn.addEventListener('click', () => {
      seeMoreModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      startMusic();
    });
  }

  if (closeSeeMoreBtn && seeMoreModal) {
    const closeWindow = () => {
      seeMoreModal.classList.remove('open');
      document.body.style.overflow = '';
      stopMusic();
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

  // ----- Red fire particles -----
  const flameParticles = [];
  const maxFlames = 40;

  class RedFlame {
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

      grad.addColorStop(0, `rgba(255, 90, 70, ${this.life})`);
      grad.addColorStop(0.4, `rgba(255, 20, 20, ${this.life * 0.7})`);
      grad.addColorStop(1, 'rgba(200, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < maxFlames; i++) {
    flameParticles.push(new RedFlame());
  }

  // ----- Red lightning arcs -----
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

    ctx.strokeStyle = '#ff2a2a';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = Math.random() * 5 + 4;
    ctx.lineWidth = Math.random() * 1.5 + 1;
    ctx.stroke();
    ctx.restore();
  }

  // ----- Animation loop: only while the modal is open, ~30 fps (same speed as 60 fps) -----
  const energyModal = document.getElementById('see-more-modal');
  let lastLightningTime = 0, lastFrame = 0, rafId = 0, energyRunning = false;

  function animate(time) {
    rafId = requestAnimationFrame(animate);
    const dt = time - lastFrame;
    if (dt < 30) return;
    lastFrame = time;
    const steps = Math.min(3, Math.max(1, Math.round(dt / 16.7)));

    ctx.clearRect(0, 0, width, height);

    for (let s = 0; s < steps; s++) flameParticles.forEach(p => p.update());
    flameParticles.forEach(p => p.draw());

    if (time - lastLightningTime > 600) {
      lastLightningTime = time;

      const arcCount = Math.floor(Math.random() * 2) + 1;
      for (let a = 0; a < arcCount; a++) {
        const startAngle = Math.random() * Math.PI * 2;
        const arcLength = Math.random() * 0.8 + 0.3;
        drawLightningArc(startAngle, startAngle + arcLength);
      }
    }
  }

  function setEnergy(on) {
    if (on === energyRunning) return;
    energyRunning = on;
    cancelAnimationFrame(rafId);
    if (on) { lastFrame = 0; rafId = requestAnimationFrame(animate); }
    else ctx.clearRect(0, 0, width, height);
  }

  if (energyModal) {
    new MutationObserver(() => setEnergy(energyModal.classList.contains('open')))
      .observe(energyModal, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', () => setEnergy(!document.hidden && energyModal.classList.contains('open')));
    setEnergy(energyModal.classList.contains('open'));
  }
}

/* ==========================================
   MODAL VIDEO BACKGROUND + AUTO-ADAPTING DARK THEME
   Samples the background mp4 and tints the black overlay
   (and scrollbar track) with its dominant colour.
   ========================================== */
(function () {
  const modalEl = document.getElementById('see-more-modal');
  const box = modalEl && modalEl.querySelector('.modal-content-box');
  const bgVideo = document.getElementById('modalBgVideo');
  if (!modalEl || !box || !bgVideo) return;

  const SIZE = 16;
  const sampler = document.createElement('canvas');
  sampler.width = SIZE;
  sampler.height = SIZE;
  const sctx = sampler.getContext('2d', { willReadFrequently: true });

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return [h, s, l];
  }

  function hslToRgb(h, s, l) {
    if (s === 0) {
      const v = Math.round(l * 255);
      return [v, v, v];
    }
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return [
      Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      Math.round(hue2rgb(p, q, h) * 255),
      Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
    ];
  }

  let failed = false;

  function updateTheme() {
    if (failed || !modalEl.classList.contains('open') || bgVideo.readyState < 2) return;
    try {
      sctx.drawImage(bgVideo, 0, 0, SIZE, SIZE);
      const data = sctx.getImageData(0, 0, SIZE, SIZE).data;
      let r = 0, g = 0, b = 0;
      const n = data.length / 4;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i]; g += data[i + 1]; b += data[i + 2];
      }
      const [h, s] = rgbToHsl(r / n, g / n, b / n);
      const sat = Math.min(0.9, s);

      const tint = hslToRgb(h, sat, 0.07);   // near-black, hue follows the video
      const track = hslToRgb(h, sat, 0.14);  // scrollbar track

      box.style.setProperty('--theme-tint', tint.join(', '));
      box.style.setProperty('--theme-track', `rgb(${track.join(', ')})`);
    } catch (err) {
      // Canvas is blocked (e.g. page opened via file://). Keep the plain black theme.
      failed = true;
      console.warn('Video colour sampling unavailable, using black theme:', err);
    }
  }

  setInterval(() => { if (!document.hidden) updateTheme(); }, 1500);
  bgVideo.addEventListener('loadeddata', updateTheme);

  // Play the background video only while the modal is open
  new MutationObserver(() => {
    if (modalEl.classList.contains('open')) {
      bgVideo.play().catch(err => console.log('Autoplay handled:', err));
      updateTheme();
    } else {
      bgVideo.pause();
    }
  }).observe(modalEl, { attributes: true, attributeFilter: ['class'] });
})();

/* ==========================================
   BANNER RED LIGHTNING (forked bolts + sparks)
   ========================================== */
(function () {
  const bannerCanvas = document.getElementById('bannerLightning');
  const modalEl = document.getElementById('see-more-modal');
  if (!bannerCanvas || !modalEl) return;

  const bctx = bannerCanvas.getContext('2d');
  let bw = 0, bh = 0;

  function resizeBanner() {
    const rect = bannerCanvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    bw = rect.width;
    bh = rect.height;
    bannerCanvas.width = Math.round(bw * dpr);
    bannerCanvas.height = Math.round(bh * dpr);
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  if (window.ResizeObserver) new ResizeObserver(resizeBanner).observe(bannerCanvas);
  window.addEventListener('resize', resizeBanner);
  resizeBanner();

  // Jagged path between two points
  function makePath(x1, y1, x2, y2, jitter) {
    const dx = x2 - x1, dy = y2 - y1;
    const dist = Math.hypot(dx, dy) || 1;
    const steps = Math.max(4, Math.round(dist / 9));
    const nx = -dy / dist, ny = dx / dist;
    const pts = [{ x: x1, y: y1 }];
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const off = (Math.random() - 0.5) * 2 * jitter;
      pts.push({ x: x1 + dx * t + nx * off, y: y1 + dy * t + ny * off });
    }
    pts.push({ x: x2, y: y2 });
    return pts;
  }

  function makeBolt() {
    const x1 = Math.random() * bw;
    const y1 = -4;
    const x2 = x1 + (Math.random() - 0.5) * bw * 0.35;
    const y2 = bh * (0.55 + Math.random() * 0.45);

    const main = makePath(x1, y1, x2, y2, 9);
    const paths = [{ pts: main, w: 1 }];

    if (main.length > 6) {
      const branches = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < branches; i++) {
        const p = main[2 + Math.floor(Math.random() * (main.length - 4))];
        const ang = Math.PI / 2 + (Math.random() - 0.5) * 1.8;
        const len = 20 + Math.random() * 45;
        paths.push({
          pts: makePath(p.x, p.y, p.x + Math.cos(ang) * len, p.y + Math.sin(ang) * len, 5),
          w: 0.55
        });
      }
    }

    return { paths, life: 1, decay: 0.045 + Math.random() * 0.03, end: { x: x2, y: y2 } };
  }

  function strokePath(pts, w, alpha) {
    bctx.beginPath();
    pts.forEach((p, i) => (i ? bctx.lineTo(p.x, p.y) : bctx.moveTo(p.x, p.y)));
    bctx.lineJoin = 'round';
    bctx.lineCap = 'round';

    bctx.strokeStyle = `rgba(255, 0, 0, ${0.35 * alpha})`;   // outer glow
    bctx.lineWidth = 7 * w;
    bctx.shadowColor = '#ff0000';
    bctx.shadowBlur = 8;
    bctx.stroke();

    bctx.strokeStyle = `rgba(255, 40, 40, ${alpha})`;        // body
    bctx.lineWidth = 2.4 * w;
    bctx.shadowBlur = 4;
    bctx.stroke();

    bctx.strokeStyle = `rgba(255, 170, 160, ${alpha})`;      // hot core
    bctx.lineWidth = 1 * w;
    bctx.shadowBlur = 0;
    bctx.stroke();
  }

  let bolts = [];
  let sparks = [];
  let nextStrike = 0;

  function spawnStrike() {
    const bolt = makeBolt();
    bolts.push(bolt);
    const count = 8 + Math.floor(Math.random() * 8);
    for (let i = 0; i < count; i++) {
      const src = i % 3 === 0 ? bolt.end : bolt.paths[0].pts[Math.floor(Math.random() * bolt.paths[0].pts.length)];
      sparks.push({
        x: src.x,
        y: src.y,
        vx: (Math.random() - 0.5) * 2.4,
        vy: (Math.random() - 0.7) * 2.2,
        size: Math.random() * 1.6 + 0.6,
        life: 1
      });
    }
  }

  function frame(time) {
    requestAnimationFrame(frame);

    if (!bw || !modalEl.classList.contains('open')) {
      if (bolts.length || sparks.length) {
        bolts = [];
        sparks = [];
        bctx.clearRect(0, 0, bw, bh);
      }
      return;
    }

    bctx.clearRect(0, 0, bw, bh);

    if (time >= nextStrike) {
      spawnStrike();
      if (Math.random() < 0.3) spawnStrike();
      nextStrike = time + 500 + Math.random() * 1400;
    }

    // Bolts
    bolts.forEach(bolt => {
      const alpha = Math.max(0, bolt.life) * (0.55 + Math.random() * 0.45);

      // quick red flash across the banner
      const flash = bctx.createLinearGradient(0, 0, 0, bh);
      flash.addColorStop(0, `rgba(255, 0, 0, ${0.22 * bolt.life})`);
      flash.addColorStop(1, 'rgba(255, 0, 0, 0)');
      bctx.fillStyle = flash;
      bctx.fillRect(0, 0, bw, bh);

      bctx.save();
      bolt.paths.forEach(p => strokePath(p.pts, p.w, alpha));
      bctx.restore();

      bolt.life -= bolt.decay;
    });
    bolts = bolts.filter(b => b.life > 0);

    // Sparks
    sparks.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.05;
      s.life -= 0.03;
      if (s.life <= 0) return;
      bctx.save();
      bctx.beginPath();
      bctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      bctx.fillStyle = `rgba(255, 60, 50, ${s.life})`;
      bctx.shadowColor = '#ff0000';
      bctx.shadowBlur = 4;
      bctx.fill();
      bctx.restore();
    });
    sparks = sparks.filter(s => s.life > 0);
  }

  requestAnimationFrame(frame);
})();

/* ==========================================
   PROFILE CIRCLE RED LIGHTNING (crawling arcs + spikes + sparks)
   ========================================== */
(function () {
  const pCanvas = document.getElementById('profileLightning');
  const modalEl = document.getElementById('see-more-modal');
  if (!pCanvas || !modalEl) return;

  const SIZE = 140;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 50; // outer edge of the profile circle line

  const pctx = pCanvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  pCanvas.width = SIZE * dpr;
  pCanvas.height = SIZE * dpr;
  pctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const pt = (r, a) => ({ x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) });

  // Arc that crawls along the circle line
  function makeArc() {
    const start = Math.random() * Math.PI * 2;
    const len = 0.5 + Math.random() * 1.0;
    const steps = Math.max(6, Math.round(len * R / 4));
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const a = start + (len * i) / steps;
      const r = R + (Math.random() - 0.5) * 7;
      pts.push(pt(r, a));
    }
    return { pts, w: 1, life: 1, decay: 0.09 + Math.random() * 0.07, spark: pts[pts.length - 1] };
  }

  // Jagged spike shooting outward from the line, with a small fork
  function makeSpike() {
    const a = Math.random() * Math.PI * 2;
    const reach = 10 + Math.random() * 10;
    const steps = 5;
    const pts = [pt(R - 2, a)];
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const aj = a + (Math.random() - 0.5) * 0.18;
      pts.push(pt(R - 2 + (reach + 2) * t + (Math.random() - 0.5) * 2, aj));
    }
    const paths = [{ pts, w: 1 }];
    const fp = pts[2 + Math.floor(Math.random() * 2)];
    const fa = a + (Math.random() < 0.5 ? -1 : 1) * (0.35 + Math.random() * 0.3);
    const flen = 6 + Math.random() * 6;
    paths.push({
      pts: [fp, { x: fp.x + Math.cos(fa) * flen * 0.5 + (Math.random() - 0.5) * 2, y: fp.y + Math.sin(fa) * flen * 0.5 + (Math.random() - 0.5) * 2 },
            { x: fp.x + Math.cos(fa) * flen, y: fp.y + Math.sin(fa) * flen }],
      w: 0.6
    });
    return { paths, life: 1, decay: 0.1 + Math.random() * 0.07, spark: pts[pts.length - 1] };
  }

  function strokePath(pts, w, alpha) {
    pctx.beginPath();
    pts.forEach((p, i) => (i ? pctx.lineTo(p.x, p.y) : pctx.moveTo(p.x, p.y)));
    pctx.lineJoin = 'round';
    pctx.lineCap = 'round';

    pctx.strokeStyle = `rgba(255, 0, 0, ${0.4 * alpha})`;   // glow
    pctx.lineWidth = 5 * w;
    pctx.shadowColor = '#ff0000';
    pctx.shadowBlur = 6;
    pctx.stroke();

    pctx.strokeStyle = `rgba(255, 40, 40, ${alpha})`;        // body
    pctx.lineWidth = 1.8 * w;
    pctx.shadowBlur = 3;
    pctx.stroke();

    pctx.strokeStyle = `rgba(255, 170, 160, ${alpha})`;      // hot core
    pctx.lineWidth = 0.8 * w;
    pctx.shadowBlur = 0;
    pctx.stroke();
  }

  let bolts = [];
  let sparks = [];
  let nextStrike = 0;

  function addSparks(from, n) {
    for (let i = 0; i < n; i++) {
      sparks.push({
        x: from.x,
        y: from.y,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        size: Math.random() * 1.1 + 0.4,
        life: 1
      });
    }
  }

  function frame(time) {
    requestAnimationFrame(frame);

    if (!modalEl.classList.contains('open')) {
      if (bolts.length || sparks.length) {
        bolts = [];
        sparks = [];
        pctx.clearRect(0, 0, SIZE, SIZE);
      }
      return;
    }

    pctx.clearRect(0, 0, SIZE, SIZE);

    if (time >= nextStrike) {
      const arcs = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < arcs; i++) {
        const a = makeArc();
        bolts.push({ paths: [{ pts: a.pts, w: a.w }], life: a.life, decay: a.decay });
        addSparks(a.spark, 2);
      }
      if (Math.random() < 0.6) {
        const s = makeSpike();
        bolts.push(s);
        addSparks(s.spark, 3);
      }
      nextStrike = time + 120 + Math.random() * 280;
    }

    bolts.forEach(b => {
      const alpha = Math.max(0, b.life) * (0.55 + Math.random() * 0.45);
      pctx.save();
      b.paths.forEach(p => strokePath(p.pts, p.w, alpha));
      pctx.restore();
      b.life -= b.decay;
    });
    bolts = bolts.filter(b => b.life > 0);

    sparks.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.06;
      if (s.life <= 0) return;
      pctx.save();
      pctx.beginPath();
      pctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      pctx.fillStyle = `rgba(255, 70, 60, ${s.life})`;
      pctx.shadowColor = '#ff0000';
      pctx.shadowBlur = 3;
      pctx.fill();
      pctx.restore();
    });
    sparks = sparks.filter(s => s.life > 0);
  }

  requestAnimationFrame(frame);
})();

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
