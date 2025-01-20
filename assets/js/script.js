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
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;  // Distance from top of the page
                const sectionHeight = section.clientHeight;  // Height of the section
                
                // Check if scrolled into this section
                if (window.scrollY >= (sectionTop - 100)) {
                    current = section.getAttribute('id');
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
    
    // Select the slider container and all dots
    const slider = document.querySelector('.skills-slider');
    const dots = document.querySelectorAll('.dot');
    let index = 0;  // Track the current slide index

    // Function to move to the next slide automatically
    function nextSlide() {
        index++;  // Move to the next slide
        if (index >= dots.length) index = 0;  // Loop back to first slide if reached end
        updateSlider();
    }

    // Function to navigate to a specific slide when dot is clicked
    function goToSlide(slideIndex) {
        index = slideIndex;  // Set index to the selected slide
        updateSlider();  // Update slider position

        // Restart auto-slide after manual interaction
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 3000);
    }

    // Function to update the slider position and active dot
    function updateSlider() {
        slider.style.transform = `translateX(-${index * 100}%)`;  // Move the slider

        // Remove active class from all dots, then add it to the current one
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }

    // Set interval to auto-slide every 3 seconds
    let slideInterval = setInterval(nextSlide, 3000);

    // Pause auto-slide when the user hovers over the slider
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));

    // Resume auto-slide when the user stops hovering over the slider
    slider.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 3000));

    // Add click event listeners to each dot for manual navigation
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i));
    });

    // Initialize the first dot as active
    dots[index].classList.add('active');
});
