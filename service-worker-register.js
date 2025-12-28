// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                // console.log('[SW] Registration successful:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    // console.log('[SW] New version installing...');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch((error) => {
                // console.log('[SW] Registration failed:', error);
            });
        
        // Handle service worker updates
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });
    });
}

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-info-circle"></i>
            <p>A new version is available!</p>
            <button onclick="updateServiceWorker()" class="btn-update">
                Update Now
            </button>
            <button onclick="this.parentElement.parentElement.remove()" class="btn-dismiss">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Add CSS for update notification
    if (!document.querySelector('#update-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'update-notification-styles';
        style.textContent = `
            .update-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                max-width: 350px;
                background: var(--primary-color);
                color: white;
                border-radius: var(--border-radius);
                padding: var(--spacing-lg);
                box-shadow: var(--shadow-xl);
                z-index: 10000;
                animation: slideInUp 0.3s ease;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
            }
            
            .notification-content i {
                font-size: 1.5rem;
                flex-shrink: 0;
            }
            
            .notification-content p {
                flex: 1;
                margin: 0;
                font-size: 0.875rem;
            }
            
            .btn-update {
                background: white;
                color: var(--primary-color);
                border: none;
                padding: var(--spacing-sm) var(--spacing-md);
                border-radius: var(--border-radius-sm);
                cursor: pointer;
                font-weight: var(--font-weight-semibold);
                white-space: nowrap;
                transition: transform 0.2s ease;
            }
            
            .btn-update:hover {
                transform: scale(1.05);
            }
            
            .btn-dismiss {
                background: transparent;
                border: none;
                color: white;
                cursor: pointer;
                padding: var(--spacing-sm);
                border-radius: var(--border-radius-sm);
                transition: background 0.2s ease;
            }
            
            .btn-dismiss:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            @keyframes slideInUp {
                from {
                    transform: translateY(100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 768px) {
                .update-notification {
                    bottom: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function updateServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
        });
    }
}

// Handle skip waiting message
navigator.serviceWorker?.addEventListener('message', (event) => {
    if (event.data.type === 'SKIP_WAITING') {
        window.location.reload();
    }
});
