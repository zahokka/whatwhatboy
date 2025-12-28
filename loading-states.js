// Loading States Manager
class LoadingStateManager {
    constructor() {
        this.init();
    }

    init() {
        // Show page loader
        this.createPageLoader();
        
        // Add loading states to images
        this.initImageLoading();
        
        // Add loading states to external content
        this.initExternalContentLoading();
        
        // Handle slow connections
        this.handleSlowConnection();
    }

    createPageLoader() {
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p class="loader-text">Loading awesome content...</p>
            </div>
        `;
        document.body.prepend(loader);

        // Hide loader when page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('loaded');
                setTimeout(() => loader.remove(), 300);
            }, 500);
        });
    }

    initImageLoading() {
        // Only target images with data-src (lazy load placeholder images)
        // Regular images with src attribute should load normally without placeholders
        const images = document.querySelectorAll('img[data-src]');

        images.forEach(img => {
            // Add loading placeholder
            if (!img.classList.contains('loaded')) {
                img.classList.add('loading');

                // Create placeholder
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.innerHTML = '<div class="placeholder-spinner"></div>';

                if (img.parentElement) {
                    img.parentElement.style.position = 'relative';
                    img.parentElement.appendChild(placeholder);
                }

                // Handle load event
                img.addEventListener('load', () => {
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                    placeholder?.remove();
                });

                // Handle error event
                img.addEventListener('error', () => {
                    img.classList.remove('loading');
                    img.classList.add('error');
                    placeholder?.remove();

                    // Show error state
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'image-error';
                    errorDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Image failed to load</span>';
                    img.parentElement?.appendChild(errorDiv);
                });
            }
        });
    }

    initExternalContentLoading() {
        // Add loading states to download buttons
        const downloadButtons = document.querySelectorAll('.btn-primary[href*="bstlar"], .btn-primary[href*="download"]');
        
        downloadButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!btn.classList.contains('loading')) {
                    btn.classList.add('loading');
                    btn.dataset.originalText = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                    
                    // Reset after 3 seconds
                    setTimeout(() => {
                        btn.classList.remove('loading');
                        btn.innerHTML = btn.dataset.originalText;
                    }, 3000);
                }
            });
        });
    }

    handleSlowConnection() {
        // Detect slow connection
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                this.showSlowConnectionWarning();
            }
            
            // Monitor connection changes
            connection.addEventListener('change', () => {
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    this.showSlowConnectionWarning();
                }
            });
        }
    }

    showSlowConnectionWarning() {
        const warning = document.createElement('div');
        warning.className = 'connection-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <i class="fas fa-wifi"></i>
                <p>Slow connection detected. Content may take longer to load.</p>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(warning);
        
        // Auto-hide after 10 seconds
        setTimeout(() => warning.remove(), 10000);
    }

    // Utility function to show loading state on any element
    static showLoading(element, message = 'Loading...') {
        element.classList.add('loading');
        element.dataset.originalContent = element.innerHTML;
        element.innerHTML = `<div class="inline-loader"><i class="fas fa-spinner fa-spin"></i> ${message}</div>`;
    }

    // Utility function to hide loading state
    static hideLoading(element) {
        element.classList.remove('loading');
        if (element.dataset.originalContent) {
            element.innerHTML = element.dataset.originalContent;
            delete element.dataset.originalContent;
        }
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.loadingManager = new LoadingStateManager();
    });
} else {
    window.loadingManager = new LoadingStateManager();
}

// Export for use in other scripts
window.LoadingState = LoadingStateManager;
