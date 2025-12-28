// Modern Gaming Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initSidebarNavigation();
    initSearch();
    initAnimations();
    initScrollEffects();
    initWireframeBackground();

    // Gaming website loaded successfully
});

// Sidebar Navigation functionality
function initSidebarNavigation() {
    const mobileSidebarBtn = document.getElementById('mobile-sidebar-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.nav-link');

    // Exit if required elements don't exist
    if (!sidebar || !mainContent) {
        console.error('Sidebar or main content not found');
        return;
    }

    // Create backdrop overlay for mobile
    let backdrop = document.querySelector('.sidebar-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'sidebar-backdrop';
        document.body.appendChild(backdrop);
    }

    // Helper function to close sidebar (mobile)
    function closeSidebar() {
        if (!sidebar || !mainContent || !backdrop) return;

        sidebar.classList.remove('active');
        mainContent.classList.remove('sidebar-open');
        backdrop.classList.remove('active');
        document.body.classList.remove('sidebar-open');

        if (mobileSidebarBtn) {
            const icon = mobileSidebarBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }

    // Helper function to open sidebar (mobile)
    function openSidebar() {
        if (!sidebar || !mainContent || !backdrop) return;

        sidebar.classList.add('active');
        mainContent.classList.add('sidebar-open');
        backdrop.classList.add('active');
        document.body.classList.add('sidebar-open');

        if (mobileSidebarBtn) {
            const icon = mobileSidebarBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        }
    }

    // Helper function to toggle sidebar (desktop collapse)
    function toggleSidebarDesktop() {
        sidebar.classList.toggle('collapsed');

        // Update toggle button icon
        const icon = sidebarToggle.querySelector('i');
        if (sidebar.classList.contains('collapsed')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }

        // Save state to localStorage
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    }

    // Restore sidebar state on page load (desktop only)
    if (window.innerWidth > 768) {
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            const icon = sidebarToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }

    // Mobile sidebar toggle
    if (mobileSidebarBtn && sidebar) {
        mobileSidebarBtn.addEventListener('click', function() {
            if (sidebar.classList.contains('active')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    // Close sidebar when clicking backdrop
    if (backdrop) {
        backdrop.addEventListener('click', closeSidebar);
    }

    // Sidebar toggle button - different behavior for mobile vs desktop
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                // Mobile: close sidebar
                closeSidebar();
            } else {
                // Desktop: collapse/expand sidebar
                toggleSidebarDesktop();
            }
        });
    }

    // Close sidebar when clicking on nav links (mobile only)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Desktop mode: remove mobile classes, restore collapsed state
            closeSidebar();
            const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            if (isCollapsed) {
                sidebar.classList.add('collapsed');
            }
        } else {
            // Mobile mode: remove collapsed class
            sidebar.classList.remove('collapsed');
        }
    });

    // Legacy navigation support
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');

            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    navMenu.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Search functionality
function initSearch() {
    const searchInput = document.getElementById('gameSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const gameCards = document.querySelectorAll('.game-card[data-search]');
        let visibleCards = 0;

        gameCards.forEach(card => {
            const searchData = card.getAttribute('data-search').toLowerCase();
            const cardTitle = card.querySelector('.game-title').textContent.toLowerCase();
            const cardDescription = card.querySelector('.game-description').textContent.toLowerCase();

            const isMatch = searchTerm === '' ||
                          searchData.includes(searchTerm) ||
                          cardTitle.includes(searchTerm) ||
                          cardDescription.includes(searchTerm);

            if (isMatch) {
                card.style.display = 'flex';
                card.classList.add('fade-in-up');
                visibleCards++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide no results message
        toggleNoResultsMessage(visibleCards === 0 && searchTerm !== '');
    });
}

// Scroll effects
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    // Navbar scroll effect
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    }

    // Active section highlighting
    function highlightActiveSection() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Parallax effect for hero background
    function updateParallax() {
        const heroBackground = document.querySelector('.hero-bg');
        if (heroBackground) {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroBackground.style.transform = `translateY(${parallax}px)`;
        }
    }

    window.addEventListener('scroll', () => {
        updateNavbar();
        highlightActiveSection();
        updateParallax();
    });

    // Initial calls
    updateNavbar();
    highlightActiveSection();
}

// Intersection Observer for animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.game-card, .tool-card, .console-card, .section-header').forEach(el => {
        observer.observe(el);
    });
}

// Animated wireframe background
function initWireframeBackground() {
    createWireframeGrid();
    createFloatingParticles();
}

function createWireframeGrid() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'wireframe-canvas';
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.1;
        z-index: 0;
    `;

    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let animationFrame;

    function resizeCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    function drawWireframe() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 1;

        const gridSize = 50;
        const time = Date.now() * 0.001;

        // Animated grid
        for (let x = 0; x < canvas.width; x += gridSize) {
            for (let y = 0; y < canvas.height; y += gridSize) {
                const wave = Math.sin((x + y) * 0.01 + time) * 10;

                ctx.beginPath();
                ctx.moveTo(x, y + wave);
                ctx.lineTo(x + gridSize, y + wave);
                ctx.lineTo(x + gridSize, y + gridSize + wave);
                ctx.lineTo(x, y + gridSize + wave);
                ctx.closePath();
                ctx.stroke();
            }
        }

        animationFrame = requestAnimationFrame(drawWireframe);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawWireframe();
}

function createFloatingParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #6366f1;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.6;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;

        hero.appendChild(particle);
    }

    // Add CSS for particle animation
    if (!document.querySelector('#particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translateY(0px) translateX(0px);
                    opacity: 0.6;
                }
                25% {
                    transform: translateY(-20px) translateX(10px);
                    opacity: 1;
                }
                50% {
                    transform: translateY(-10px) translateX(-10px);
                    opacity: 0.8;
                }
                75% {
                    transform: translateY(-30px) translateX(5px);
                    opacity: 0.9;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Enhanced card interactions
function initCardInteractions() {
    const cards = document.querySelectorAll('.game-card, .tool-card, .console-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.3)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });

        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(99, 102, 241, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation CSS
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Loading states and error handling
function showLoading(element) {
    if (!element) return;

    element.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading awesome content...</p>
        </div>
    `;
}

function toggleNoResultsMessage(show) {
    let noResultsDiv = document.querySelector('.no-results');

    if (show && !noResultsDiv) {
        noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;">🎮</div>
                <h3 style="margin-bottom: 0.5rem;">No games found</h3>
                <p>Try searching with different keywords or browse our categories.</p>
            </div>
        `;

        const gamesGrid = document.getElementById('pc-games');
        if (gamesGrid) {
            gamesGrid.parentNode.appendChild(noResultsDiv);
        }
    } else if (!show && noResultsDiv) {
        noResultsDiv.remove();
    }
}

// Keyboard navigation and accessibility
function initAccessibility() {
    // ESC key functionality
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('nav-menu');
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');

            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // Enhanced focus indicators
    const focusableElements = document.querySelectorAll(
        'a, button, input, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '3px solid var(--primary-color)';
            this.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// Performance monitoring
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            // Page loaded in ${loadTime}ms
        });
    }

    // Monitor frame rate
    let frameCount = 0;
    let lastTime = performance.now();

    function countFrames() {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime - lastTime >= 1000) {
            // FPS: ${frameCount}
            frameCount = 0;
            lastTime = currentTime;
        }

        requestAnimationFrame(countFrames);
    }

    requestAnimationFrame(countFrames);
}

// Initialize additional systems
function initAdditionalSystems() {
    initCardInteractions();
    initAccessibility();
    initPerformanceMonitoring();
}

// Admin Edit Mode System - Disabled for Security
class AdminEditMode {
    constructor() {
        this.isEditMode = false;
        this.isAuthenticated = false;
        // Admin functionality disabled in production for security
        console.warn('Admin mode disabled in production build');
        return; // Disable admin functionality
    }

    init() {
        this.createAdminButton();
        this.createAdminPanel();
        this.bindEvents();
    }

    createAdminButton() {
        const adminBtn = document.createElement('button');
        adminBtn.className = 'admin-mode-btn';
        adminBtn.innerHTML = '<i class="fas fa-edit"></i>';
        adminBtn.title = 'Admin Edit Mode';
        adminBtn.addEventListener('click', () => this.showPasswordPrompt());
        document.body.appendChild(adminBtn);
    }

    createAdminPanel() {
        const panel = document.createElement('div');
        panel.className = 'admin-panel';
        panel.id = 'admin-panel';
        panel.innerHTML = `
            <h3><i class="fas fa-shield-alt"></i> Admin Panel</h3>
            <div class="admin-controls">
                <button class="btn btn-primary" onclick="adminMode.toggleEditMode()">
                    <i class="fas fa-edit"></i> Toggle Edit Mode
                </button>
                <button class="btn btn-outline" onclick="adminMode.addNewCheat()">
                    <i class="fas fa-plus"></i> Add New Cheat
                </button>
                <button class="btn btn-outline" onclick="adminMode.exportData()">
                    <i class="fas fa-download"></i> Export Data
                </button>
                <button class="btn btn-outline" onclick="adminMode.importData()">
                    <i class="fas fa-upload"></i> Import Data
                </button>
                <button class="btn btn-danger" onclick="adminMode.logout()" style="background: var(--danger-color); margin-top: 1rem;">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
            <div class="admin-stats" style="margin-top: 2rem; padding: 1rem; background: var(--bg-tertiary); border-radius: var(--border-radius);">
                <h4>Site Statistics</h4>
                <p>Total Cheats: <span id="total-cheats">0</span></p>
                <p>Edit Mode: <span id="edit-status">Disabled</span></p>
            </div>
        `;
        document.body.appendChild(panel);
    }

    showPasswordPrompt() {
        if (this.isAuthenticated) {
            this.toggleAdminPanel();
            return;
        }

        const password = prompt('Enter admin password:');
        if (password === this.adminPassword) {
            this.isAuthenticated = true;
            this.showSuccessMessage('Admin access granted!');
            this.toggleAdminPanel();
            this.updateStats();
        } else {
            this.showErrorMessage('Invalid password!');
        }
    }

    toggleAdminPanel() {
        const panel = document.getElementById('admin-panel');
        panel.classList.toggle('active');
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        document.body.classList.toggle('edit-mode');

        const statusEl = document.getElementById('edit-status');
        statusEl.textContent = this.isEditMode ? 'Enabled' : 'Disabled';
        statusEl.style.color = this.isEditMode ? 'var(--success-color)' : 'var(--text-secondary)';

        if (this.isEditMode) {
            this.addEditControls();
            this.showSuccessMessage('Edit mode enabled');
        } else {
            this.removeEditControls();
            this.showSuccessMessage('Edit mode disabled');
        }
    }

    addEditControls() {
        const cheatCards = document.querySelectorAll('.cheat-card');
        cheatCards.forEach((card, index) => {
            if (!card.querySelector('.edit-controls')) {
                const controls = document.createElement('div');
                controls.className = 'edit-controls';
                controls.innerHTML = `
                    <button class="edit-btn edit" onclick="adminMode.editCheat(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="edit-btn delete" onclick="adminMode.deleteCheat(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button class="edit-btn move-up" onclick="adminMode.moveCheat(${index}, 'up')">
                        <i class="fas fa-arrow-up"></i> Up
                    </button>
                    <button class="edit-btn move-down" onclick="adminMode.moveCheat(${index}, 'down')">
                        <i class="fas fa-arrow-down"></i> Down
                    </button>
                `;
                card.appendChild(controls);
            }
        });
    }

    removeEditControls() {
        const controls = document.querySelectorAll('.edit-controls');
        controls.forEach(control => control.remove());
    }

    editCheat(index) {
        const cheatCards = document.querySelectorAll('.cheat-card');
        const card = cheatCards[index];
        const title = card.querySelector('h3').textContent;
        const description = card.querySelector('p').textContent;
        const downloadLink = card.querySelector('.btn-primary');

        const newTitle = prompt('Edit title:', title);
        const newDescription = prompt('Edit description:', description);
        const newLink = prompt('Edit download link:', downloadLink ? downloadLink.href : '');
        const newStatus = prompt('Edit status (detected/updating/safe):',
            card.querySelector('.status-badge').className.split(' ')[1]);

        if (newTitle) card.querySelector('h3').textContent = newTitle;
        if (newDescription) card.querySelector('p').textContent = newDescription;
        if (newLink && downloadLink) downloadLink.href = newLink;
        if (newStatus) {
            const badge = card.querySelector('.status-badge');
            badge.className = `status-badge ${newStatus}`;
            badge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        }

        this.showSuccessMessage('Cheat updated successfully!');
        this.saveData();
    }

    deleteCheat(index) {
        if (confirm('Are you sure you want to delete this cheat?')) {
            const cheatCards = document.querySelectorAll('.cheat-card');
            cheatCards[index].remove();
            this.showSuccessMessage('Cheat deleted successfully!');
            this.updateStats();
            this.saveData();
        }
    }

    moveCheat(index, direction) {
        const cheatCards = document.querySelectorAll('.cheat-card');
        const card = cheatCards[index];
        const container = card.parentNode;

        if (direction === 'up' && index > 0) {
            container.insertBefore(card, cheatCards[index - 1]);
        } else if (direction === 'down' && index < cheatCards.length - 1) {
            container.insertBefore(cheatCards[index + 1], card);
        }

        this.removeEditControls();
        this.addEditControls();
        this.showSuccessMessage('Cheat moved successfully!');
        this.saveData();
    }

    addNewCheat() {
        const title = prompt('Enter cheat title:');
        if (!title) return;

        const description = prompt('Enter cheat description:');
        const downloadLink = prompt('Enter download link:');
        const status = prompt('Enter status (detected/updating/safe):') || 'safe';
        const iconClass = prompt('Enter icon class (e.g., fas fa-star):') || 'fas fa-gamepad';

        const newCheat = document.createElement('div');
        newCheat.className = 'cheat-card';
        newCheat.innerHTML = `
            <div class="cheat-header">
                <div class="cheat-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="cheat-info">
                    <h3>${title}</h3>
                    <p>${description || 'No description provided.'}</p>
                </div>
                <div class="cheat-status">
                    <span class="status-badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                </div>
            </div>
            <div class="cheat-actions">
                ${downloadLink ? `<a href="${downloadLink}" class="btn btn-primary" target="_blank">
                    <i class="fas fa-download"></i>
                    Download
                </a>` : ''}
            </div>
        `;

        const container = document.querySelector('.cheats-grid') || document.querySelector('.games-grid');
        if (container) {
            container.appendChild(newCheat);
            this.showSuccessMessage('New cheat added successfully!');
            this.updateStats();
            this.saveData();

            if (this.isEditMode) {
                this.removeEditControls();
                this.addEditControls();
            }
        }
    }

    exportData() {
        const cheats = this.getAllCheats();
        const data = {
            timestamp: new Date().toISOString(),
            cheats: cheats,
            siteName: 'whatwhatboy Gaming Site'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cheats-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showSuccessMessage('Data exported successfully!');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (data.cheats && Array.isArray(data.cheats)) {
                            this.importCheats(data.cheats);
                            this.showSuccessMessage('Data imported successfully!');
                        } else {
                            this.showErrorMessage('Invalid file format!');
                        }
                    } catch (error) {
                        this.showErrorMessage('Error reading file!');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    getAllCheats() {
        const cheats = [];
        const cheatCards = document.querySelectorAll('.cheat-card');

        cheatCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent || '';
            const description = card.querySelector('p')?.textContent || '';
            const downloadLink = card.querySelector('.btn-primary')?.href || '';
            const status = card.querySelector('.status-badge')?.textContent || '';
            const icon = card.querySelector('.cheat-icon i')?.className || '';

            cheats.push({
                title,
                description,
                downloadLink,
                status,
                icon
            });
        });

        return cheats;
    }

    saveData() {
        const data = this.getAllCheats();
        localStorage.setItem('adminCheatsData', JSON.stringify(data));
    }

    updateStats() {
        const totalCheats = document.querySelectorAll('.cheat-card').length;
        const totalEl = document.getElementById('total-cheats');
        if (totalEl) totalEl.textContent = totalCheats;
    }

    logout() {
        this.isAuthenticated = false;
        this.isEditMode = false;
        document.body.classList.remove('edit-mode');
        this.removeEditControls();
        this.toggleAdminPanel();
        this.showSuccessMessage('Logged out successfully!');
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--primary-color)'};
            color: white;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            min-width: 250px;
        `;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
            <span style="margin-left: 0.5rem;">${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    bindEvents() {
        // Global keyboard shortcuts for admins
        document.addEventListener('keydown', (e) => {
            if (this.isAuthenticated && e.ctrlKey && e.altKey) {
                switch(e.key) {
                    case 'e': // Ctrl+Alt+E: Toggle edit mode
                        e.preventDefault();
                        this.toggleEditMode();
                        break;
                    case 'a': // Ctrl+Alt+A: Add new cheat
                        e.preventDefault();
                        this.addNewCheat();
                        break;
                    case 's': // Ctrl+Alt+S: Save data
                        e.preventDefault();
                        this.saveData();
                        this.showSuccessMessage('Data saved!');
                        break;
                }
            }
        });
    }
}

// Initialize admin mode
let adminMode;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initAdditionalSystems();
        adminMode = new AdminEditMode();
    });
} else {
    initAdditionalSystems();
    adminMode = new AdminEditMode();
}
// Back to Top Button
function initBackToTop() {
    // Create back to top button
    const backToTopBtn = document.createElement("button");
    backToTopBtn.className = "back-to-top";
    backToTopBtn.innerHTML = `<i class="fas fa-arrow-up"></i>`;
    backToTopBtn.setAttribute("aria-label", "Back to top");
    document.body.appendChild(backToTopBtn);

    // Show/hide button on scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    // Scroll to top on click
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// Initialize back to top when DOM is loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBackToTop);
} else {
    initBackToTop();
}
