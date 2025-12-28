/**
 * Global Error Handling and Loading States
 * Provides consistent error handling and loading indicators across the site
 */

class ErrorHandler {
    constructor() {
        this.loadingStates = new Map();
        this.errorLog = [];
        this.init();
    }

    init() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleError(event.error, 'JavaScript Error', event.filename, event.lineno);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Unhandled Promise Rejection');
            event.preventDefault();
        });

        // Resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.handleResourceError(event.target);
            }
        }, true);

        this.createGlobalLoadingIndicator();
        this.setupNetworkStatusMonitoring();
        this.setupBrokenLinkRedirects();
    }

    handleError(error, type = 'Unknown Error', filename = '', lineno = 0) {
        const errorInfo = {
            type: type,
            message: error.message || error.toString(),
            filename: filename,
            lineno: lineno,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.errorLog.push(errorInfo);
        console.error('ErrorHandler:', errorInfo);

        // Show user-friendly error message for critical errors
        if (this.isCriticalError(error)) {
            this.showErrorToast('Something went wrong. Please refresh the page if issues persist.');
        }
    }

    handleResourceError(element) {
        const resourceType = element.tagName.toLowerCase();
        const resourceSrc = element.src || element.href;

        if (resourceType === 'img') {
            this.handleImageError(element);
        } else if (resourceType === 'script') {
            this.handleScriptError(element);
        } else if (resourceType === 'link') {
            this.handleStylesheetError(element);
        }

        console.warn(`Failed to load ${resourceType}: ${resourceSrc}`);
    }

    handleImageError(img) {
        // Replace broken images with placeholder
        if (!img.dataset.errorHandled) {
            img.dataset.errorHandled = 'true';
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNkwyNCAxNkwyNCAxNkwxNiAxNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
            img.alt = 'Image not available';
            img.style.opacity = '0.5';
        }
    }

    handleScriptError(script) {
        // Log script loading failure
        this.showErrorToast(`Failed to load component. Some features may not work properly.`);
    }

    handleStylesheetError(link) {
        // Log stylesheet loading failure
        console.warn('Stylesheet failed to load, using fallback styles');
    }

    isCriticalError(error) {
        const criticalPatterns = [
            /network/i,
            /fetch/i,
            /cors/i,
            /script error/i
        ];

        const errorString = error.message || error.toString();
        return criticalPatterns.some(pattern => pattern.test(errorString));
    }

    // Loading States Management
    showLoading(key, element = null) {
        this.loadingStates.set(key, true);

        if (element) {
            element.classList.add('loading');

            if (!element.querySelector('.loading-spinner')) {
                const spinner = document.createElement('div');
                spinner.className = 'loading-spinner';
                spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                element.appendChild(spinner);
            }
        } else {
            this.showGlobalLoading();
        }
    }

    hideLoading(key, element = null) {
        this.loadingStates.set(key, false);

        if (element) {
            element.classList.remove('loading');
            const spinner = element.querySelector('.loading-spinner');
            if (spinner) {
                spinner.remove();
            }
        } else {
            // Check if any loading states are still active
            const hasActiveLoading = Array.from(this.loadingStates.values()).some(state => state);
            if (!hasActiveLoading) {
                this.hideGlobalLoading();
            }
        }
    }

    createGlobalLoadingIndicator() {
        const loader = document.createElement('div');
        loader.id = 'global-loading';
        loader.className = 'global-loading hidden';
        loader.innerHTML = `
            <div class="loading-backdrop"></div>
            <div class="loading-content">
                <div class="loading-spinner-large">
                    <i class="fas fa-cog fa-spin"></i>
                </div>
                <p class="loading-text">Loading...</p>
            </div>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .global-loading {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: opacity 0.3s ease;
            }

            .global-loading.hidden {
                opacity: 0;
                pointer-events: none;
            }

            .loading-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                backdrop-filter: blur(5px);
            }

            .loading-content {
                position: relative;
                background: var(--bg-card, #1a1a1a);
                padding: 2rem;
                border-radius: 15px;
                text-align: center;
                border: 2px solid var(--primary-color, #6366f1);
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            }

            .loading-spinner-large {
                font-size: 2rem;
                color: var(--primary-color, #6366f1);
                margin-bottom: 1rem;
            }

            .loading-text {
                color: var(--text-primary, #ffffff);
                margin: 0;
                font-size: 1.1rem;
            }

            .loading-spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: var(--primary-color, #6366f1);
                font-size: 1.5rem;
                z-index: 10;
            }

            .loading {
                position: relative;
                pointer-events: none;
                opacity: 0.7;
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(loader);
    }

    showGlobalLoading(text = 'Loading...') {
        const loader = document.getElementById('global-loading');
        if (loader) {
            const loadingText = loader.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = text;
            }
            loader.classList.remove('hidden');
        }
    }

    hideGlobalLoading() {
        const loader = document.getElementById('global-loading');
        if (loader) {
            loader.classList.add('hidden');
        }
    }

    setupNetworkStatusMonitoring() {
        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.showSuccessToast('Connection restored');
        });

        window.addEventListener('offline', () => {
            this.showErrorToast('You are currently offline. Some features may not work.');
        });
    }

    // Toast Notifications
    showErrorToast(message, duration = 5000) {
        this.showToast(message, 'error', duration);
    }

    showSuccessToast(message, duration = 3000) {
        this.showToast(message, 'success', duration);
    }

    showWarningToast(message, duration = 4000) {
        this.showToast(message, 'warning', duration);
    }

    showToast(message, type = 'info', duration = 3000) {
        // Remove existing toasts of the same type
        document.querySelectorAll(`.toast.${type}`).forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            error: 'fas fa-exclamation-circle',
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <div class="toast-content">
                <i class="${icons[type]}"></i>
                <span>${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add toast styles if not already present
        if (!document.getElementById('toast-styles')) {
            const toastStyles = document.createElement('style');
            toastStyles.id = 'toast-styles';
            toastStyles.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    min-width: 300px;
                    max-width: 500px;
                    z-index: 10002;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    animation: slideInRight 0.3s ease;
                    margin-bottom: 10px;
                }

                .toast.error {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    border-left: 4px solid #b91c1c;
                }

                .toast.success {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    border-left: 4px solid #047857;
                }

                .toast.warning {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    border-left: 4px solid #b45309;
                }

                .toast.info {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    border-left: 4px solid #1d4ed8;
                }

                .toast-content {
                    display: flex;
                    align-items: center;
                    padding: 15px 20px;
                    color: white;
                    gap: 10px;
                }

                .toast-content i:first-child {
                    font-size: 1.2rem;
                    flex-shrink: 0;
                }

                .toast-content span {
                    flex: 1;
                    font-weight: 500;
                }

                .toast-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 3px;
                    transition: background 0.2s ease;
                    flex-shrink: 0;
                }

                .toast-close:hover {
                    background: rgba(255,255,255,0.2);
                }

                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }

                @media (max-width: 768px) {
                    .toast {
                        right: 10px;
                        left: 10px;
                        min-width: auto;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(toastStyles);
        }

        document.body.appendChild(toast);

        // Auto-remove toast
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    // Public API for other scripts to use
    withErrorHandling(asyncFunction, errorMessage = 'Operation failed') {
        return async (...args) => {
            try {
                return await asyncFunction(...args);
            } catch (error) {
                this.handleError(error, 'Async Operation Error');
                this.showErrorToast(errorMessage);
                throw error;
            }
        };
    }

    async fetchWithErrorHandling(url, options = {}) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response;
        } catch (error) {
            this.handleError(error, 'Network Error');
            if (error.name === 'TypeError') {
                this.showErrorToast('Network error. Please check your connection.');
            } else {
                this.showErrorToast('Failed to load data. Please try again.');
            }
            throw error;
        }
    }

    // Debugging helper
    getErrorLog() {
        return this.errorLog;
    }

    clearErrorLog() {
        this.errorLog = [];
    }

    // Broken link redirect handling
    setupBrokenLinkRedirects() {
        // Common broken link patterns and their corrections
        const redirectMap = {
            '/game/': '/games/',
            '/download/': '/downloads/',
            '/mod/': '/games/',
            '/cheat/': '/games/',
            '/tool/': '/tools/'
        };

        // Check current URL for broken patterns
        const currentPath = window.location.pathname.toLowerCase();
        for (const [pattern, redirect] of Object.entries(redirectMap)) {
            if (currentPath.includes(pattern)) {
                const correctedPath = currentPath.replace(pattern, redirect);
                this.showWarningToast('Redirecting to correct page...', 2000);
                setTimeout(() => {
                    window.location.href = correctedPath;
                }, 500);
                return;
            }
        }

        // Monitor all clicks on links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href === '#' || href.startsWith('javascript:')) return;

            // Check if link matches broken patterns
            for (const [pattern, redirect] of Object.entries(redirectMap)) {
                if (href.includes(pattern)) {
                    e.preventDefault();
                    const correctedHref = href.replace(pattern, redirect);
                    this.showWarningToast('Redirecting to correct page...', 1500);
                    setTimeout(() => {
                        window.location.href = correctedHref;
                    }, 500);
                    return;
                }
            }
        }, true);
    }
}

// Initialize error handler
if (typeof window !== 'undefined') {
    window.errorHandler = new ErrorHandler();
}