/**
 * Performance Optimizer
 * Lightweight performance monitoring and optimization utilities
 */

class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            interactionTime: 0,
            memoryUsage: 0
        };

        this.observers = [];
        this.init();
    }

    init() {
        this.measureLoadTime();
        this.setupLazyLoading();
        this.setupIntersectionObserver();
        this.optimizeImages();
        this.setupResourceHints();
        this.monitorMemoryUsage();
    }

    measureLoadTime() {
        // Measure various performance metrics
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    if (navigation) {
                        this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
                        this.metrics.renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;

                        // Log performance metrics
                        console.info('Performance Metrics:', {
                            loadTime: `${this.metrics.loadTime.toFixed(2)}ms`,
                            renderTime: `${this.metrics.renderTime.toFixed(2)}ms`,
                            domContentLoaded: `${navigation.domContentLoadedEventEnd - navigation.fetchStart}ms`
                        });

                        // Show warning for slow load times
                        if (this.metrics.loadTime > 3000) {
                            console.warn('Page load time is slow:', this.metrics.loadTime);
                        }
                    }
                }, 100);
            });
        }
    }

    setupLazyLoading() {
        // Lazy load images and iframes
        const lazyElements = document.querySelectorAll('img[data-src], iframe[data-src]');

        if ('IntersectionObserver' in window) {
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        if (element.dataset.src) {
                            element.src = element.dataset.src;
                            element.removeAttribute('data-src');
                            element.classList.add('lazy-loaded');
                            lazyObserver.unobserve(element);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            lazyElements.forEach(element => {
                lazyObserver.observe(element);
            });

            this.observers.push(lazyObserver);
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyElements.forEach(element => {
                if (element.dataset.src) {
                    element.src = element.dataset.src;
                    element.removeAttribute('data-src');
                }
            });
        }
    }

    setupIntersectionObserver() {
        // Animate elements when they come into view
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .fade-in, .slide-up');

        if ('IntersectionObserver' in window && animatedElements.length > 0) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(element => {
                animationObserver.observe(element);
            });

            this.observers.push(animationObserver);
        }
    }

    optimizeImages() {
        // Add loading="lazy" to images that don't have it
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            if (this.isImageInViewport(img)) {
                img.loading = 'eager';
            } else {
                img.loading = 'lazy';
            }
        });

        // Optimize image formats based on browser support
        if ('WebP' in window || this.supportsWebP()) {
            this.addWebPSupport();
        }
    }

    isImageInViewport(img) {
        const rect = img.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    supportsWebP() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => resolve(webP.height === 2);
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    addWebPSupport() {
        const images = document.querySelectorAll('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]');
        images.forEach(img => {
            const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

            // Test if WebP version exists
            const testImg = new Image();
            testImg.onload = () => {
                img.src = webpSrc;
            };
            testImg.src = webpSrc;
        });
    }

    setupResourceHints() {
        // Add preconnect hints for external domains
        const externalDomains = new Set();

        // Extract domains from script and link tags
        document.querySelectorAll('script[src], link[href], img[src]').forEach(element => {
            const url = element.src || element.href;
            if (url && url.startsWith('http') && !url.includes(window.location.hostname)) {
                try {
                    const domain = new URL(url).origin;
                    externalDomains.add(domain);
                } catch (e) {
                    // Invalid URL, skip
                }
            }
        });

        // Add preconnect hints
        externalDomains.forEach(domain => {
            if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = domain;
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            }
        });
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            const checkMemory = () => {
                const memory = performance.memory;
                this.metrics.memoryUsage = memory.usedJSHeapSize / memory.totalJSHeapSize;

                // Warn if memory usage is high
                if (this.metrics.memoryUsage > 0.8) {
                    console.warn('High memory usage detected:', {
                        used: Math.round(memory.usedJSHeapSize / 1048576) + 'MB',
                        total: Math.round(memory.totalJSHeapSize / 1048576) + 'MB',
                        limit: Math.round(memory.jsHeapSizeLimit / 1048576) + 'MB'
                    });
                }
            };

            // Check memory usage every 30 seconds
            setInterval(checkMemory, 30000);

            // Initial check
            setTimeout(checkMemory, 5000);
        }
    }

    // Image optimization utilities
    compressImage(file, maxWidth = 1920, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };

            img.src = URL.createObjectURL(file);
        });
    }

    // Debounce utility for performance
    debounce(func, wait) {
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

    // Throttle utility for performance
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Optimize scroll performance
    optimizeScrolling() {
        let isScrolling = false;

        const handleScroll = this.throttle(() => {
            // Add scrolling class for CSS optimizations
            document.body.classList.add('is-scrolling');

            clearTimeout(isScrolling);
            isScrolling = setTimeout(() => {
                document.body.classList.remove('is-scrolling');
            }, 100);
        }, 16); // ~60fps

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Critical resource loading
    loadCriticalResources() {
        const criticalResources = [
            'assets/css/critical.css',
            'assets/js/core.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    // Cleanup method
    cleanup() {
        this.observers.forEach(observer => {
            if (observer && observer.disconnect) {
                observer.disconnect();
            }
        });
        this.observers = [];
    }

    // Public API
    getMetrics() {
        return { ...this.metrics };
    }

    markInteraction(name) {
        if ('performance' in window && performance.mark) {
            performance.mark(`interaction-${name}-start`);

            return () => {
                performance.mark(`interaction-${name}-end`);
                performance.measure(`interaction-${name}`, `interaction-${name}-start`, `interaction-${name}-end`);
            };
        }
        return () => {};
    }
}

// Initialize performance optimizer
if (typeof window !== 'undefined') {
    window.performanceOptimizer = new PerformanceOptimizer();

    // Add CSS for performance optimizations
    const performanceStyles = document.createElement('style');
    performanceStyles.textContent = `
        /* Performance optimizations */
        .is-scrolling * {
            pointer-events: none;
        }

        .animate-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .animate-on-scroll.animated {
            opacity: 1;
            transform: translateY(0);
        }

        .fade-in {
            opacity: 0;
            transition: opacity 0.8s ease;
        }

        .fade-in.animated {
            opacity: 1;
        }

        .slide-up {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .slide-up.animated {
            opacity: 1;
            transform: translateY(0);
        }

        .lazy-loaded {
            animation: fadeInImage 0.3s ease;
        }

        @keyframes fadeInImage {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* Optimize for smooth animations */
        * {
            -webkit-backface-visibility: hidden;
            -moz-backface-visibility: hidden;
            -webkit-transform: translate3d(0, 0, 0);
            -moz-transform: translate3d(0, 0, 0);
        }

        /* Improve text rendering */
        body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
        }
    `;

    document.head.appendChild(performanceStyles);
}