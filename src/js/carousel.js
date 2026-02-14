/**
 * Featured Product Carousel
 * Touch-friendly, auto-advancing horizontal carousel
 */
(function () {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');

    if (!track) return;

    const slides = track.querySelectorAll('.carousel-slide');
    const slideCount = slides.length;
    let currentIndex = 0;
    let autoPlayInterval;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    // Calculate visible slides based on viewport
    function getVisibleSlides() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        if (window.innerWidth <= 1024) return 3;
        return 3;
    }

    // Create dots
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const visibleSlides = getVisibleSlides();
        const maxIndex = Math.max(0, slideCount - visibleSlides);

        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function goToSlide(index) {
        const visibleSlides = getVisibleSlides();
        const maxIndex = Math.max(0, slideCount - visibleSlides);
        currentIndex = Math.max(0, Math.min(index, maxIndex));

        const slideWidth = slides[0].offsetWidth + parseFloat(getComputedStyle(track).gap || 24);
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateDots();
    }

    function nextSlide() {
        const visibleSlides = getVisibleSlides();
        const maxIndex = Math.max(0, slideCount - visibleSlides);
        goToSlide(currentIndex >= maxIndex ? 0 : currentIndex + 1);
    }

    function prevSlide() {
        const visibleSlides = getVisibleSlides();
        const maxIndex = Math.max(0, slideCount - visibleSlides);
        goToSlide(currentIndex <= 0 ? maxIndex : currentIndex - 1);
    }

    // Auto-play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Touch / drag support
    track.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - track.offsetLeft;
        track.style.cursor = 'grabbing';
        stopAutoPlay();
    });

    track.addEventListener('mouseleave', () => {
        if (isDragging) isDragging = false;
        track.style.cursor = 'grab';
    });

    track.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';
        const endX = e.pageX - track.offsetLeft;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        startAutoPlay();
    });

    // Touch events
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoPlay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        startAutoPlay();
    }, { passive: true });

    // Hover pause
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', () => { if (!isDragging) startAutoPlay(); });

    // Button events
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); stopAutoPlay(); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); stopAutoPlay(); startAutoPlay(); });

    // Resize
    window.addEventListener('resize', () => {
        createDots();
        goToSlide(currentIndex);
    });

    // Init
    createDots();
    startAutoPlay();
})();
