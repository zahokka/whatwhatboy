// Lightweight Mode Toggle
(function() {
    'use strict';

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'lightweight-toggle-btn';
    toggleBtn.id = 'lightweight-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle Lightweight Mode');
    toggleBtn.setAttribute('title', 'Toggle Lightweight Mode');
    toggleBtn.innerHTML = '<i class="fas fa-bolt"></i>';
    document.body.appendChild(toggleBtn);

    // Check if lightweight mode is enabled
    const isLightweightMode = localStorage.getItem('lightweightMode') === 'true';

    // CSS stylesheets
    const normalStylesheets = [
        document.querySelector('link[href="style.css"]'),
        document.querySelector('link[href="assets/css/site-fixes.css"]'),
        document.querySelector('link[href="assets/css/visual-enhancements.css"]'),
        document.querySelector('link[href="assets/css/dark-theme-enhancements.css"]'),
        document.querySelector('link[href="assets/css/performance-optimized.css"]')
    ];

    const lightweightCSS = document.getElementById('lightweight-css');

    function enableLightweightMode() {
        // Disable normal stylesheets
        normalStylesheets.forEach(sheet => {
            if (sheet) sheet.disabled = true;
        });

        // Enable lightweight CSS
        if (lightweightCSS) {
            lightweightCSS.disabled = false;
        }

        // Update button
        toggleBtn.classList.add('active');
        toggleBtn.innerHTML = '<i class="fas fa-bolt"></i>';
        toggleBtn.setAttribute('title', 'Disable Lightweight Mode');

        // Save preference
        localStorage.setItem('lightweightMode', 'true');

        // console.log('✓ Lightweight mode enabled');
    }

    function disableLightweightMode() {
        // Enable normal stylesheets
        normalStylesheets.forEach(sheet => {
            if (sheet) sheet.disabled = false;
        });

        // Disable lightweight CSS
        if (lightweightCSS) {
            lightweightCSS.disabled = true;
        }

        // Update button
        toggleBtn.classList.remove('active');
        toggleBtn.innerHTML = '<i class="fas fa-bolt"></i>';
        toggleBtn.setAttribute('title', 'Enable Lightweight Mode');

        // Save preference
        localStorage.setItem('lightweightMode', 'false');

        // console.log('✓ Normal mode enabled');
    }

    // Apply saved preference on load
    if (isLightweightMode) {
        enableLightweightMode();
    }

    // Toggle on click
    toggleBtn.addEventListener('click', function() {
        const currentMode = localStorage.getItem('lightweightMode') === 'true';
        if (currentMode) {
            disableLightweightMode();
        } else {
            enableLightweightMode();
        }
    });

    // console.log('Lightweight mode toggle initialized');
})();
