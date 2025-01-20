document.addEventListener('DOMContentLoaded', function() {
    // Select all sections and navigation links
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.topnav a');

    // Function to update active navigation link based on scroll position
    function updateActiveSection() {
        let current = '';
        
        // If scrolled near the top, set current section to 'home'
        if (window.scrollY <= 100) {
            current = 'home';
            // console.log('At top, current:', current);
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;  // Distance from top of the page
                const sectionHeight = section.clientHeight;  // Height of the section
                
                // Check if scrolled into this section
                if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                    // console.log('In section:', current);
                }
            });
        }

        // Loop through all navigation links to update the active class
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Call function initially to set active section on page load
    updateActiveSection();

    // Add scroll event listener to update active section dynamically
    window.addEventListener('scroll', updateActiveSection);

    // ======= Skill Slider Functionality =======

    const slider = document.querySelector('.skills-slider');
    const cards = document.querySelectorAll('.skill-card');
    let index = 0;  // Track the current slide index

    function nextSlide() {
        index++;
        if (index >= cards.length) index = 0;  // Loop back to the first card if end is reached
        slider.style.transform = `translateX(-${index * 100}%)`;  // Move slider to show next card
    }

    let slideInterval = setInterval(nextSlide, 3000);

    // Pause auto-slide when the user hovers over the slider
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));

    // Resume auto-slide when the user stops hovering over the slider
    slider.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 3000));
    });