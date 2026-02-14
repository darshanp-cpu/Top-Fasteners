/**
 * Hero Scroll-Triggered Frame Animation
 * Optimized for performance: WebP support, smart preloading, efficient loop
 */
(function () {
  const FRAME_COUNT = 129;
  const FRAME_DIR = 'assets/frames/';
  const INITIAL_LOAD_COUNT = 15; // Load first 15 frames immediately for instant start

  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for no alpha if opaque
  const hero = document.getElementById('hero');
  const loader = document.getElementById('loader');

  // Text Elements
  const heroTitle = document.getElementById('heroTitle');
  const heroSubtitle = document.getElementById('heroSubtitle');
  const heroStat1 = document.getElementById('heroStat1');
  const heroStat2 = document.getElementById('heroStat2');
  const heroStat3 = document.getElementById('heroStat3');
  const scrollIndicator = document.getElementById('scrollIndicator');

  // Text Animation Phases
  const textPhases = [
    {
      title: 'Strength In<br><span class="highlight">Every Turn</span>',
      subtitle: "South Africa's trusted source for industrial fasteners, tools & supplies.",
      stat1: { number: '500+', label: 'Products Stocked' },
      stat2: { number: '15+', label: 'Years Experience' },
      stat3: { number: '100%', label: 'Quality Guaranteed' }
    },
    {
      title: 'Precision<br><span class="highlight">Engineering</span>',
      subtitle: 'Every bolt, nut and fastener manufactured to exacting industrial standards.',
      stat1: { number: 'ISO', label: 'Certified Quality' },
      stat2: { number: '50+', label: 'Brand Partners' },
      stat3: { number: 'A+', label: 'Industry Rating' }
    },
    {
      title: 'Built To<br><span class="highlight">Last</span>',
      subtitle: 'Heavy-duty tools and supplies that perform under the toughest conditions.',
      stat1: { number: '24hr', label: 'Fast Delivery' },
      stat2: { number: '5K+', label: 'Happy Clients' },
      stat3: { number: '99%', label: 'Reorder Rate' }
    },
    {
      title: 'Your Partner<br><span class="highlight">In Industry</span>',
      subtitle: 'From one bolt to a full project supply — we deliver what you need, when you need it.',
      stat1: { number: 'Bulk', label: 'Pricing Available' },
      stat2: { number: '7 Days', label: 'Support Available' },
      stat3: { number: 'Free', label: 'Quotes & Advice' }
    }
  ];

  function getFrameName(index) {
    const padded = String(index).padStart(3, '0');
    // Using simple delay for filename compatibility, logic kept from original
    // But now using .webp extension
    const delay = ([3, 11, 19, 27, 35, 43, 51, 59, 67, 75, 83, 91, 99, 107, 115, 123].includes(index)) ? '0.04s' : '0.03s';
    return `frame_${padded}_delay-${delay}.webp`;
  }

  const frames = [];
  let loadedCount = 0;
  let allLoaded = false;

  function loadFrame(index) {
    if (frames[index]) return; // Already loaded/loading
    const img = new Image();
    img.src = FRAME_DIR + getFrameName(index);
    frames[index] = img;

    // For the very first frame, draw it immediately when loaded
    if (index === 0) {
      img.onload = () => {
        onFirstFrameLoaded();
        loadedCount++;
      };
    } else {
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) allLoaded = true;
      };
    }
  }

  function startSmartLoading() {
    // 1. Load initial batch for immediate interactivity
    for (let i = 0; i < INITIAL_LOAD_COUNT; i++) {
      loadFrame(i);
    }

    // 2. Load the rest lazily to avoid blocking main thread/network
    let nextIndex = INITIAL_LOAD_COUNT;
    const loadNextBatch = () => {
      if (nextIndex >= FRAME_COUNT) return;

      // Load a small batch
      const batchSize = 5;
      for (let i = 0; i < batchSize && nextIndex < FRAME_COUNT; i++) {
        loadFrame(nextIndex++);
      }

      // Schedule next batch
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadNextBatch);
      } else {
        setTimeout(loadNextBatch, 50);
      }
    };

    // Start lazy loading after a short delay to prioritize critical assets
    setTimeout(loadNextBatch, 1000);
  }

  function onFirstFrameLoaded() {
    resizeCanvas();
    drawFrame(0);
    // Reveal UI
    if (loader) loader.classList.add('hidden');
    setTimeout(() => {
      if (heroTitle) heroTitle.classList.add('visible');
      if (heroSubtitle) heroSubtitle.classList.add('visible');
      if (heroStat1) heroStat1.classList.add('visible');
      if (heroStat2) heroStat2.classList.add('visible');
      if (heroStat3) heroStat3.classList.add('visible');
    }, 100);
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Optimized draw function
  function drawFrame(index) {
    if (index < 0 || index >= FRAME_COUNT) return;
    const img = frames[index];
    if (!img || !img.complete || img.naturalWidth === 0) return; // Ensure fully loaded

    // Use requestAnimationFrame for drawing if not already inside one (onScroll uses it)
    // But here we might call it directly. onScroll manages the loop.

    const hRatio = canvas.width / img.naturalWidth;
    const vRatio = canvas.height / img.naturalHeight;
    const ratio = Math.max(hRatio, vRatio);
    const shiftX = (canvas.width - img.naturalWidth * ratio) / 2;
    const shiftY = (canvas.height - img.naturalHeight * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, shiftX, shiftY, img.naturalWidth * ratio, img.naturalHeight * ratio);
  }

  let currentPhase = 0;

  function updateTextPhase(phase) {
    if (phase === currentPhase) return;
    currentPhase = phase;
    const data = textPhases[phase];

    // Batch DOM reads/writes
    const elements = [heroTitle, heroSubtitle, heroStat1, heroStat2, heroStat3];
    elements.forEach(el => { if (el) el.classList.remove('visible'); });

    setTimeout(() => {
      if (heroTitle) heroTitle.innerHTML = data.title;
      if (heroSubtitle) heroSubtitle.textContent = data.subtitle;
      if (heroStat1) { heroStat1.querySelector('.stat-number').textContent = data.stat1.number; heroStat1.querySelector('.stat-label').textContent = data.stat1.label; }
      if (heroStat2) { heroStat2.querySelector('.stat-number').textContent = data.stat2.number; heroStat2.querySelector('.stat-label').textContent = data.stat2.label; }
      if (heroStat3) { heroStat3.querySelector('.stat-number').textContent = data.stat3.number; heroStat3.querySelector('.stat-label').textContent = data.stat3.label; }

      requestAnimationFrame(() => {
        elements.forEach(el => { if (el) el.classList.add('visible'); });
      });
    }, 300);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const heroRect = hero.getBoundingClientRect();
      const heroTop = -heroRect.top;
      const heroScrollable = hero.offsetHeight - window.innerHeight;

      if (heroTop >= -100 && heroTop <= heroScrollable + 100) { // Buffer
        const progress = Math.max(0, Math.min(1, heroTop / heroScrollable));

        // Frame Index
        const frameIndex = Math.min(Math.floor(progress * (FRAME_COUNT - 1)), FRAME_COUNT - 1);
        drawFrame(frameIndex);

        // Text Phase
        const phase = Math.min(Math.floor(progress * textPhases.length), textPhases.length - 1);
        updateTextPhase(phase);

        // Indicator
        if (scrollIndicator) { scrollIndicator.style.opacity = progress > 0.05 ? '0' : '0.7'; }
      }
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    resizeCanvas();
    // Redraw current frame
    onScroll(); // Re-calculate
  });

  // Start
  startSmartLoading();
})();
