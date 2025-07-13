document.addEventListener('DOMContentLoaded', function() {
    // Tool Button Alert Functionality (Removed as tools now link to dedicated pages)

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const categoryLink = document.querySelector('.dropbtn');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Handle Category link behavior
    if (categoryLink) {
        categoryLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 767) { // If on mobile
                // Allow default link behavior to categories.html
            } else { // If on desktop
                e.preventDefault(); // Prevent default link behavior for desktop hover dropdown
                // Desktop hover is handled by CSS, no JS needed to show/hide dropdown
            }
        });
    }

    // Smooth Scrolling for Navigation Links (only for internal links on index.html)
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if the link is an internal anchor link and not the category link
            if (this.getAttribute('href').startsWith('#') && !this.classList.contains('dropbtn')) {
                e.preventDefault();

                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - document.querySelector('header').offsetHeight, // Adjust for fixed header
                        behavior: 'smooth'
                    });
                }
            }

            // Close mobile nav after clicking a link
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Active Navigation Link Highlighting on Scroll
    const sections = document.querySelectorAll('.tools-section');
    const navLi = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - document.querySelector('header').offsetHeight;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(li => {
            li.classList.remove('active');
            // Only highlight if it's not the category link and matches an ID
            if (li.getAttribute('href').startsWith('#') && li.getAttribute('href').substring(1) === current) {
                li.classList.add('active');
            }
        });
    });
});