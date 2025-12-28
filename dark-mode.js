/**
 * Dark Mode Toggle
 * Adds a dark/light mode switcher to make the site more modern
 */

class DarkModeToggle {
    constructor() {
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.init();
    }

    init() {
        this.createToggleButton();
        this.applyTheme();
        this.addToggleToSidebar();
    }

    createToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'dark-mode-toggle';
        toggleBtn.innerHTML = `
            <i class="fas fa-${this.isDarkMode ? 'sun' : 'moon'}"></i>
        `;
        toggleBtn.title = `Switch to ${this.isDarkMode ? 'light' : 'dark'} mode`;

        // Position as floating button
        toggleBtn.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-color);
            border: none;
            color: white;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            z-index: 9999;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        `;

        toggleBtn.addEventListener('click', () => this.toggle());
        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.transform = 'scale(1.1)';
            toggleBtn.style.boxShadow = 'var(--shadow-xl)';
        });
        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.transform = 'scale(1)';
            toggleBtn.style.boxShadow = 'var(--shadow-lg)';
        });

        document.body.appendChild(toggleBtn);
        this.toggleBtn = toggleBtn;
    }

    addToggleToSidebar() {
        const sidebarSocial = document.querySelector('.sidebar-social');
        if (!sidebarSocial) return;

        const darkModeSection = document.createElement('div');
        darkModeSection.className = 'sidebar-theme-toggle';
        darkModeSection.innerHTML = `
            <h4>Theme</h4>
            <div class="theme-selector">
                <button class="theme-btn ${!this.isDarkMode ? 'active' : ''}" data-theme="light">
                    <i class="fas fa-sun"></i>
                    <span>Light</span>
                </button>
                <button class="theme-btn ${this.isDarkMode ? 'active' : ''}" data-theme="dark">
                    <i class="fas fa-moon"></i>
                    <span>Dark</span>
                </button>
            </div>
        `;

        sidebarSocial.appendChild(darkModeSection);

        // Add event listeners to sidebar theme buttons
        darkModeSection.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                const newDarkMode = theme === 'dark';

                if (newDarkMode !== this.isDarkMode) {
                    this.toggle();
                }
            });
        });
    }

    toggle() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        this.updateButtons();
        this.savePreference();
        this.showNotification();
    }

    applyTheme() {
        const root = document.documentElement;

        if (this.isDarkMode) {
            // Enhanced dark mode colors
            root.style.setProperty('--bg-primary', '#0a0a0a');
            root.style.setProperty('--bg-secondary', '#111111');
            root.style.setProperty('--bg-tertiary', '#1a1a1a');
            root.style.setProperty('--bg-card', '#151515');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#e0e0e0');
            root.style.setProperty('--text-muted', '#b0b0b0');
            root.style.setProperty('--border-color', '#2a2a2a');
            root.style.setProperty('--border-hover', '#404040');

            document.body.classList.add('dark-mode');
        } else {
            // Reset to light mode (original values)
            root.style.setProperty('--bg-primary', '#0f172a');
            root.style.setProperty('--bg-secondary', '#1e293b');
            root.style.setProperty('--bg-tertiary', '#334155');
            root.style.setProperty('--bg-card', '#1e293b');
            root.style.setProperty('--text-primary', '#f8fafc');
            root.style.setProperty('--text-secondary', '#cbd5e1');
            root.style.setProperty('--text-muted', '#94a3b8');
            root.style.setProperty('--border-color', '#334155');
            root.style.setProperty('--border-hover', '#475569');

            document.body.classList.remove('dark-mode');
        }
    }

    updateButtons() {
        // Update floating button
        const icon = this.toggleBtn.querySelector('i');
        icon.className = `fas fa-${this.isDarkMode ? 'sun' : 'moon'}`;
        this.toggleBtn.title = `Switch to ${this.isDarkMode ? 'light' : 'dark'} mode`;

        // Update sidebar buttons
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if ((btn.dataset.theme === 'dark' && this.isDarkMode) ||
                (btn.dataset.theme === 'light' && !this.isDarkMode)) {
                btn.classList.add('active');
            }
        });
    }

    savePreference() {
        localStorage.setItem('darkMode', this.isDarkMode.toString());
    }

    showNotification() {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.innerHTML = `
            <i class="fas fa-${this.isDarkMode ? 'moon' : 'sun'}"></i>
            <span>${this.isDarkMode ? 'Dark' : 'Light'} mode enabled</span>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 6rem;
            right: 1rem;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 0.75rem 1rem;
            color: var(--text-primary);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
        `;

        document.body.appendChild(notification);

        // Remove notification after 2 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Enhanced CSS for dark mode toggle
const darkModeStyles = `
    /* Theme toggle sidebar section */
    .sidebar-theme-toggle {
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
    }

    .sidebar-theme-toggle h4 {
        color: var(--text-primary);
        margin-bottom: 1rem;
        font-size: 1rem;
    }

    .theme-selector {
        display: flex;
        gap: 0.5rem;
    }

    .theme-btn {
        flex: 1;
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        padding: 0.5rem;
        border-radius: var(--border-radius-sm);
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.8rem;
    }

    .theme-btn:hover {
        background: var(--bg-primary);
        border-color: var(--primary-color);
        color: var(--text-primary);
    }

    .theme-btn.active {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: white;
    }

    .theme-btn i {
        font-size: 1rem;
    }

    /* Dark mode specific styles */
    .dark-mode .hero-bg {
        background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
    }

    .dark-mode .wireframe-canvas {
        opacity: 0.05;
    }

    .dark-mode .floating-particle {
        background: #6366f1 !important;
        opacity: 0.3;
    }

    /* Notification animation */
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    /* Mobile responsive adjustments */
    @media (max-width: 768px) {
        .dark-mode-toggle {
            top: 0.5rem !important;
            right: 0.5rem !important;
            width: 45px !important;
            height: 45px !important;
        }

        .theme-notification {
            top: 4rem !important;
            right: 0.5rem !important;
            left: 0.5rem !important;
            width: auto !important;
        }
    }
`;

// Inject the styles
const darkModeStyleSheet = document.createElement('style');
darkModeStyleSheet.textContent = darkModeStyles;
document.head.appendChild(darkModeStyleSheet);

// Initialize dark mode when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DarkModeToggle();
    });
} else {
    new DarkModeToggle();
}