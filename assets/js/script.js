document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.topnav a');

    function updateActiveSection() {
        let current = '';
        
        if (window.scrollY <= 100) {
            current = 'home';
            console.log('At top, current:', current);
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                    console.log('In section:', current);
                }
            });
        }

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            console.log('Checking link:', href, 'against current:', current);
            link.classList.remove('active');
            if (href === `#${current}`) {
                link.classList.add('active');
                console.log('Match found! Adding active class to:', href);
            }
        });
    }

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection);
});
