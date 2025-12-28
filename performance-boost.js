// Performance Boost Module
(function() {
    'use strict';
    
    // Debounce function for scroll/resize events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function for frequent events
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Optimize scroll events
    const optimizeScrollEvents = () => {
        const scrollElements = document.querySelectorAll('[data-scroll]');
        const throttledScroll = throttle(() => {
            scrollElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('in-view');
                }
            });
        }, 100);
        
        window.addEventListener('scroll', throttledScroll, { passive: true });
    };
    
    // Lazy load images more aggressively
    const optimizeLazyLoading = () => {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    };
    
    // Reduce animation complexity on low-end devices
    const optimizeAnimations = () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        if (prefersReducedMotion || isLowEndDevice) {
            document.documentElement.classList.add('reduce-animations');
            
            // Add CSS for reduced animations
            const style = document.createElement('style');
            style.textContent = `
                .reduce-animations * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    };
    
    // Optimize card hover effects
    const optimizeCardEffects = () => {
        const cards = document.querySelectorAll('.game-card, .cheat-card, .tool-card, .console-card');
        
        cards.forEach(card => {
            // Use will-change only when needed
            card.addEventListener('mouseenter', () => {
                card.style.willChange = 'transform';
            }, { once: false });
            
            card.addEventListener('mouseleave', () => {
                card.style.willChange = 'auto';
            }, { once: false });
        });
    };
    
    // Remove unused CSS animations after page load
    const cleanupUnusedAnimations = () => {
        setTimeout(() => {
            document.querySelectorAll('.fade-in-up').forEach(el => {
                el.style.animation = 'none';
            });
        }, 2000);
    };
    
    // Optimize background effects
    const optimizeBackgroundEffects = () => {
        const heroBackground = document.querySelector('.hero-bg');
        const wireframeCanvas = document.querySelector('.wireframe-canvas');
        
        // Disable complex backgrounds on mobile
        if (window.innerWidth < 768) {
            if (heroBackground) heroBackground.style.display = 'none';
            if (wireframeCanvas) wireframeCanvas.style.display = 'none';
        }
    };
    
    // Prefetch important pages
    const prefetchPages = () => {
        const importantPages = [
            '/profile.html',
            '/games/gta/index.html',
            '/games/cs2/index.html'
        ];
        
        importantPages.forEach(page => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = page;
            document.head.appendChild(link);
        });
    };
    
    // Resource hints for external domains
    const addResourceHints = () => {
        const domains = [
            'https://fonts.googleapis.com',
            'https://cdnjs.cloudflare.com',
            'https://i.imgur.com',
            'https://imagizer.imageshack.com'
        ];
        
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
    };
    
    // Defer non-critical CSS
    const deferNonCriticalCSS = () => {
        const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-defer]');
        
        nonCriticalCSS.forEach(link => {
            link.media = 'print';
            link.onload = function() {
                this.media = 'all';
            };
        });
    };
    
    // Initialize all optimizations
    const init = () => {
        // Run immediately
        optimizeAnimations();
        optimizeBackgroundEffects();
        addResourceHints();
        
        // Run after DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                optimizeLazyLoading();
                optimizeCardEffects();
                optimizeScrollEvents();
            });
        } else {
            optimizeLazyLoading();
            optimizeCardEffects();
            optimizeScrollEvents();
        }
        
        // Run after page is fully loaded
        window.addEventListener('load', () => {
            cleanupUnusedAnimations();
            prefetchPages();
            deferNonCriticalCSS();
        });
    };
    
    // Start performance optimizations
    init();
    
    // console.log('[Performance] Boost module loaded');
})();
