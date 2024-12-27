document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('#main-nav');

    // Update menu toggle functionality to match new layout.css
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('open');
        // Update aria-expanded attribute
        const isExpanded = nav.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Add click outside to close menu
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('open')) {
            nav.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Add keyboard navigation for menu items
    const menuItems = nav.querySelectorAll('a');
    menuItems.forEach((item, index) => {
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                nav.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
            }
        });
    });
});
