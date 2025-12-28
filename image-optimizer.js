/**
 * Image Optimization Script
 * Optimizes image loading performance across the site
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        placeholderColor: '#1a1a2e',
        fadeInDuration: 300,
        intersectionThreshold: 0.01,
        rootMargin: '50px'
    };

    // Create lightweight placeholder
    function createPlaceholder(img) {
        const placeholder = document.createElement('div');
        placeholder.className = 'img-placeholder';
        placeholder.style.cssText = `
            background: ${config.placeholderColor};
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity ${config.fadeInDuration}ms ease;
        `;

        // Add loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'img-spinner';
        spinner.innerHTML = '<i class="fas fa-spinner fa-spin" style="color: rgba(255,255,255,0.3); font-size: 24px;"></i>';
        placeholder.appendChild(spinner);

        return placeholder;
    }

    // Lazy load images using Intersection Observer
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: config.rootMargin,
                threshold: config.intersectionThreshold
            });

            images.forEach(img => {
                // Add placeholder
                if (img.parentElement && !img.parentElement.querySelector('.img-placeholder')) {
                    const wrapper = img.parentElement;
                    wrapper.style.position = 'relative';
                    const placeholder = createPlaceholder(img);
                    wrapper.insertBefore(placeholder, img);
                }

                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without Intersection Observer
            images.forEach(img => loadImage(img));
        }
    }

    // Load individual image
    function loadImage(img) {
        const src = img.dataset.src || img.src;

        if (!src) return;

        // Create a new image to preload
        const tempImg = new Image();

        tempImg.onload = function() {
            // Set the actual source
            if (img.dataset.src) {
                img.src = img.dataset.src;
                delete img.dataset.src;
            }

            // Fade in image
            img.style.opacity = '0';
            img.style.transition = `opacity ${config.fadeInDuration}ms ease`;

            setTimeout(() => {
                img.style.opacity = '1';

                // Remove placeholder after fade in
                setTimeout(() => {
                    const placeholder = img.parentElement?.querySelector('.img-placeholder');
                    if (placeholder) {
                        placeholder.style.opacity = '0';
                        setTimeout(() => placeholder.remove(), config.fadeInDuration);
                    }
                }, config.fadeInDuration);
            }, 50);

            img.classList.add('loaded');
        };

        tempImg.onerror = function() {
            // Handle error - show placeholder or fallback image
            const placeholder = img.parentElement?.querySelector('.img-placeholder');
            if (placeholder) {
                placeholder.innerHTML = '<i class="fas fa-image" style="color: rgba(255,255,255,0.2); font-size: 32px;"></i>';
            }
            img.classList.add('error');
        };

        tempImg.src = src;
    }

    // Optimize images that are already in viewport (above the fold)
    function prioritizeVisibleImages() {
        const images = document.querySelectorAll('img');
        const viewportHeight = window.innerHeight;

        images.forEach(img => {
            const rect = img.getBoundingClientRect();

            // If image is in viewport or close to it
            if (rect.top < viewportHeight + 100) {
                // Remove lazy loading for above-the-fold images
                img.removeAttribute('loading');

                // Load immediately
                if (img.dataset.src) {
                    loadImage(img);
                }
            } else {
                // Ensure lazy loading for below-the-fold images
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    // Add responsive image support
    function setupResponsiveImages() {
        const images = document.querySelectorAll('img[data-srcset]');

        images.forEach(img => {
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
                delete img.dataset.srcset;
            }
        });
    }

    // Decode images asynchronously for better performance
    function decodeImages() {
        if ('decode' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img');

            images.forEach(img => {
                if (img.complete && img.naturalWidth) {
                    img.decode().catch(() => {
                        // Ignore decode errors
                    });
                }
            });
        }
    }

    // Initialize on DOM ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                prioritizeVisibleImages();
                initLazyLoading();
                setupResponsiveImages();

                // Decode images after a short delay
                setTimeout(decodeImages, 500);
            });
        } else {
            prioritizeVisibleImages();
            initLazyLoading();
            setupResponsiveImages();
            setTimeout(decodeImages, 500);
        }
    }

    // Run initialization
    init();

    // Export for manual triggering if needed
    window.imageOptimizer = {
        loadImage,
        init
    };
})();
