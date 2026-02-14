/**
 * Hero Scroll-Triggered Frame Animation
 * Draws GIF frames to a canvas element based on scroll position
 */
(function () {
  const FRAME_COUNT = 129;
  const FRAME_DIR = 'assets/frames/';

  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  const hero = document.getElementById('hero');
  const loader = document.getElementById('loader');

  // Text elements for scroll animations
  const heroTitle = document.getElementById('heroTitle');
  const heroSubtitle = document.getElementById('heroSubtitle');
  const heroStat1 = document.getElementById('heroStat1');
  const heroStat2 = document.getElementById('heroStat2');
  const heroStat3 = document.getElementById('heroStat3');
  const scrollIndicator = document.getElementById('scrollIndicator');

  // Text content that changes as user scrolls
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

  // Build frame file names
  function getFrameName(index) {
    const padded = String(index).padStart(3, '0');
    // Frames have mixed delays (0.03s and 0.04s), match the pattern
    const delay = ([3, 11, 19, 27, 35, 43, 51, 59, 67, 75, 83, 91, 99, 107, 115, 123].includes(index)) ? '0.04s' : '0.03s';
    return `frame_${padded}_delay-${delay}.gif`;
  }

  // Preload all frames
  const frames = [];
  let loadedCount = 0;

  function preloadFrames() {
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_DIR + getFrameName(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          onAllFramesLoaded();
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          onAllFramesLoaded();
        }
      };
      frames[i] = img;
    }
  }

  function onAllFramesLoaded() {
    resizeCanvas();
    drawFrame(0);
    // Show page
    setTimeout(() => {
      if (loader) loader.classList.add('hidden');
    }, 300);
    // Make hero text visible initially
    if (heroTitle) heroTitle.classList.add('visible');
    if (heroSubtitle) heroSubtitle.classList.add('visible');
    if (heroStat1) heroStat1.classList.add('visible');
    if (heroStat2) heroStat2.classList.add('visible');
    if (heroStat3) heroStat3.classList.add('visible');
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawFrame(index) {
    if (index < 0 || index >= FRAME_COUNT) return;
    const img = frames[index];
    if (!img || !img.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fit image to canvas while maintaining aspect ratio (cover)
    const hRatio = canvas.width / img.naturalWidth;
    const vRatio = canvas.height / img.naturalHeight;
    const ratio = Math.max(hRatio, vRatio);
    const shiftX = (canvas.width - img.naturalWidth * ratio) / 2;
    const shiftY = (canvas.height - img.naturalHeight * ratio) / 2;

    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight,
      shiftX, shiftY, img.naturalWidth * ratio, img.naturalHeight * ratio);
  }

  // Update text based on scroll phase
  let currentPhase = 0;

  function updateTextPhase(phase) {
    if (phase === currentPhase) return;
    currentPhase = phase;
    const data = textPhases[phase];

    // Animate out then in
    [heroTitle, heroSubtitle, heroStat1, heroStat2, heroStat3].forEach(el => {
      if (el) el.classList.remove('visible');
    });

    setTimeout(() => {
      if (heroTitle) heroTitle.innerHTML = data.title;
      if (heroSubtitle) heroSubtitle.textContent = data.subtitle;

      if (heroStat1) {
        heroStat1.querySelector('.stat-number').textContent = data.stat1.number;
        heroStat1.querySelector('.stat-label').textContent = data.stat1.label;
      }
      if (heroStat2) {
        heroStat2.querySelector('.stat-number').textContent = data.stat2.number;
        heroStat2.querySelector('.stat-label').textContent = data.stat2.label;
      }
      if (heroStat3) {
        heroStat3.querySelector('.stat-number').textContent = data.stat3.number;
        heroStat3.querySelector('.stat-label').textContent = data.stat3.label;
      }

      requestAnimationFrame(() => {
        [heroTitle, heroSubtitle, heroStat1, heroStat2, heroStat3].forEach(el => {
          if (el) el.classList.add('visible');
        });
      });
    }, 300);
  }

  // Scroll handler
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const heroRect = hero.getBoundingClientRect();
      const heroTop = -heroRect.top;
      const heroScrollable = hero.offsetHeight - window.innerHeight;

      if (heroTop >= 0 && heroTop <= heroScrollable) {
        const progress = heroTop / heroScrollable;
        const frameIndex = Math.min(Math.floor(progress * (FRAME_COUNT - 1)), FRAME_COUNT - 1);
        drawFrame(frameIndex);

        // Determine text phase (4 phases across scroll)
        const phase = Math.min(Math.floor(progress * textPhases.length), textPhases.length - 1);
        updateTextPhase(phase);

        // Fade scroll indicator
        if (scrollIndicator) {
          scrollIndicator.style.opacity = progress > 0.1 ? '0' : '0.7';
        }
      }
      ticking = false;
    });
  }

  // Event listeners
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    resizeCanvas();
    const heroRect = hero.getBoundingClientRect();
    const heroTop = -heroRect.top;
    const heroScrollable = hero.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, heroTop / heroScrollable));
    const frameIndex = Math.min(Math.floor(progress * (FRAME_COUNT - 1)), FRAME_COUNT - 1);
    drawFrame(frameIndex);
  });

  // Start loading
  preloadFrames();
})();
