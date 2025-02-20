document.addEventListener('DOMContentLoaded', function() {
    // ============ Logo Canvas ============
    const canvas = document.getElementById('logoCanvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = 'assets/img/logo_greyscale.png';

    img.onload = function() {
        const scale = .5;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        console.log('Image loaded successfully');
        applyColors(); // Apply initial colors when image loads

        // Start continuous color updates
        setInterval(applyColors, 5); // Updates every 5ms
    };

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function applyColors() {
        const borderColor = document.getElementById('borderColor').value;
        const mainColor = document.getElementById('mainColor').value;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;


        for(let i = 0; i < data.length; i += 4) {
            // Border color check (black #000000) with tolerance
            if(data[i] <= 10 && data[i+1] <= 10 && data[i+2] <= 10) {
                const color = hexToRgb(borderColor);
                data[i] = color.r;
                data[i+1] = color.g;
                data[i+2] = color.b;
            }
            // Main color check (mid-gray #808080) with tolerance
            if(data[i] >= 120 && data[i] <= 136 && 
               data[i+1] >= 120 && data[i+1] <= 136 && 
               data[i+2] >= 120 && data[i+2] <= 136) {
                const color = hexToRgb(mainColor);
                data[i] = color.r;
                data[i+1] = color.g;
                data[i+2] = color.b;
            }
        }        
        ctx.putImageData(imageData, 0, 0);
    }

    document.getElementById('downloadBtn').addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = 'modified_logo.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });



    // ============ NavBar Functionality ============
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




});
