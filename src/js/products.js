/**
 * Products Page — Client-side filter logic
 */
(function () {
    const grid = document.getElementById('productsGrid');
    const filterToggle = document.getElementById('filterToggle');
    const filterSidebar = document.getElementById('filterSidebar');
    const clearFilters = document.getElementById('clearFilters');

    if (!grid) return;

    const allCheckboxes = document.querySelectorAll('[data-filter]');
    const productCards = grid.querySelectorAll('.product-card');
    const categoryHeaders = grid.querySelectorAll('.category-header');

    // Mobile filter toggle
    if (filterToggle && filterSidebar) {
        filterToggle.addEventListener('click', () => {
            filterSidebar.classList.toggle('active');
            filterToggle.textContent = filterSidebar.classList.contains('active')
                ? '✕ Close Filters'
                : '☰ Filter Products';
        });
    }

    // Filter logic
    function getActiveFilters() {
        const filters = { category: [], brand: [] };
        allCheckboxes.forEach(cb => {
            if (cb.checked) {
                filters[cb.dataset.filter].push(cb.value);
            }
        });
        return filters;
    }

    function applyFilters() {
        const filters = getActiveFilters();

        productCards.forEach(card => {
            const cat = card.dataset.category;
            const brand = card.dataset.brand;

            const catMatch = filters.category.length === 0 || filters.category.includes(cat);
            const brandMatch = filters.brand.length === 0 || filters.brand.includes(brand);

            card.style.display = (catMatch && brandMatch) ? '' : 'none';
        });

        // Hide category headers if no visible cards in that category
        categoryHeaders.forEach(header => {
            const catId = header.id;
            const visibleCards = grid.querySelectorAll(`.product-card[data-category="${catId}"]:not([style*="display: none"])`);
            header.style.display = visibleCards.length > 0 ? '' : 'none';
        });

        // Handle UNIDELTA Callout Box visibility
        const unideltaCallout = document.querySelector('.unidelta-callout');
        if (unideltaCallout) {
            const unideltaHeaderVisible = document.getElementById('plumbing').style.display !== 'none';
            unideltaCallout.style.display = unideltaHeaderVisible ? '' : 'none';
        }
    }

    allCheckboxes.forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });

    // Clear filters
    if (clearFilters) {
        clearFilters.addEventListener('click', () => {
            allCheckboxes.forEach(cb => { cb.checked = true; });
            applyFilters();
        });
    }

    // Smooth scroll to category anchors
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }
})();
