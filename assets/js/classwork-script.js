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





    // ============ Classwork Card Functionality ============
    const classworkCards = document.querySelectorAll('.classwork-card');
    
    classworkCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });

});
