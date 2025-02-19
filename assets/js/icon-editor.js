document.addEventListener('DOMContentLoaded', function() {
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
    };

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    document.getElementById('applyColors').addEventListener('click', function() {
        const borderColor = document.getElementById('borderColor').value;
        const mainColor = document.getElementById('mainColor').value;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Add these logs
        console.log('Border Color:', borderColor);
        console.log('Main Color:', mainColor);
        
        // Log a sample pixel's RGB values
        console.log('Sample Pixel RGB:', data[0], data[1], data[2]);
        


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
    });

    document.getElementById('downloadBtn').addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = 'modified_logo.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
