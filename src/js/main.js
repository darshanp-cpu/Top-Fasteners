/**
 * Main JS — Navigation, Cookie Consent, Scroll Animations
 */
(function () {

    // ---- Mobile Navigation ----
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ---- Header scroll effect ----
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // ---- Cookie Consent ----
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAcceptAll = document.getElementById('cookieAcceptAll');
    const cookieEssential = document.getElementById('cookieEssential');

    function showCookieBanner() {
        if (!localStorage.getItem('tf_cookies')) {
            setTimeout(() => {
                if (cookieBanner) cookieBanner.classList.add('show');
            }, 1500);
        }
    }

    function acceptCookies(level) {
        localStorage.setItem('tf_cookies', level);
        if (cookieBanner) cookieBanner.classList.remove('show');
    }

    if (cookieAcceptAll) {
        cookieAcceptAll.addEventListener('click', () => acceptCookies('all'));
    }
    if (cookieEssential) {
        cookieEssential.addEventListener('click', () => acceptCookies('essential'));
    }

    showCookieBanner();

    // ---- Scroll Animations (Intersection Observer) ----
    const animatedElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: just show everything
        animatedElements.forEach(el => el.classList.add('visible'));
    }

    // ---- Lazy Loading Support ----
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }

    // ---- Sticky CTA visibility ----
    const stickyCta = document.getElementById('stickyCta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            stickyCta.style.opacity = window.scrollY > 400 ? '1' : '0';
            stickyCta.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
        }, { passive: true });

        // Start hidden
        stickyCta.style.opacity = '0';
        stickyCta.style.pointerEvents = 'none';
        stickyCta.style.transition = 'opacity 0.4s ease';
    }

    // ---- Active page highlight ----
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ---- Pre-populate Contact Form Message ----
    const contactMessageTextarea = document.getElementById('message');
    if (contactMessageTextarea) {
        const urlParams = new URLSearchParams(window.location.search);
        const productName = urlParams.get('product');
        if (productName) {
            contactMessageTextarea.value = `Hi Top Fasteners team,\n\nI would like to enquire about the ${productName}. Please provide more information.\n\nThank you.`;
        }
    }

})();
