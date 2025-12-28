/**
 * Real-Time Activity Tracker
 * Tracks actual user interactions and site events
 */

class ActivityTracker {
    constructor() {
        this.activities = [];
        this.maxActivities = 50; // Keep last 50 activities
        this.storageKey = 'site_activities';
        this.init();
    }

    init() {
        // Load existing activities from localStorage
        this.loadActivities();

        // Set up event listeners for trackable actions
        this.setupEventListeners();

        // Clean old activities (older than 24 hours)
        this.cleanOldActivities();
    }

    loadActivities() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.activities = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load activities:', error);
            this.activities = [];
        }
    }

    saveActivities() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.activities));
        } catch (error) {
            console.error('Failed to save activities:', error);
        }
    }

    addActivity(type, description, icon = '🎮') {
        const activity = {
            id: Date.now() + Math.random(),
            type: type,
            description: description,
            icon: icon,
            timestamp: new Date().toISOString()
        };

        this.activities.unshift(activity); // Add to beginning

        // Keep only max number of activities
        if (this.activities.length > this.maxActivities) {
            this.activities = this.activities.slice(0, this.maxActivities);
        }

        this.saveActivities();
        this.broadcastActivity(activity);
    }

    broadcastActivity(activity) {
        // Dispatch custom event for other parts of the site to listen
        window.dispatchEvent(new CustomEvent('newActivity', { detail: activity }));
    }

    getActivities(limit = 10) {
        return this.activities.slice(0, limit);
    }

    cleanOldActivities() {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        this.activities = this.activities.filter(activity => {
            return new Date(activity.timestamp) > oneDayAgo;
        });
        this.saveActivities();
    }

    setupEventListeners() {
        // Track page visits
        this.trackPageVisit();

        // Track Discord button clicks
        this.trackDiscordClicks();

        // Track download button clicks
        this.trackDownloadClicks();

        // Track navigation clicks
        this.trackNavigationClicks();

        // Track video plays
        this.trackVideoPlays();

        // Track external link clicks
        this.trackExternalLinks();
    }

    trackPageVisit() {
        const pageName = this.getPageName();
        const visitKey = `visit_${pageName}_${new Date().toDateString()}`;

        // Only track once per page per day
        if (!sessionStorage.getItem(visitKey)) {
            sessionStorage.setItem(visitKey, 'true');

            let icon = '🎮';
            let description = '';

            if (pageName.includes('gta')) {
                icon = '🚗';
                description = 'User viewing GTA V content';
            } else if (pageName.includes('cs2') || pageName.includes('csgo')) {
                icon = '🔫';
                description = 'User exploring CS2 cheats';
            } else if (pageName.includes('youtube')) {
                icon = '📺';
                description = 'User watching YouTube videos';
            } else if (pageName.includes('discord')) {
                icon = '💬';
                description = 'User checking Discord servers';
            } else if (pageName.includes('rdr2')) {
                icon = '🤠';
                description = 'User viewing RDR2 mods';
            } else if (pageName.includes('l4d')) {
                icon = '🧟';
                description = 'User exploring L4D2 cheats';
            } else if (pageName.includes('tf2')) {
                icon = '🎯';
                description = 'User checking TF2 content';
            } else if (pageName === 'index' || pageName === 'home') {
                icon = '🏠';
                description = 'New visitor on homepage';
            } else {
                icon = '👁️';
                description = `User viewing ${pageName} page`;
            }

            this.addActivity('page_visit', description, icon);
        }
    }

    trackDiscordClicks() {
        document.addEventListener('click', (e) => {
            const discordLink = e.target.closest('a[href*="discord.gg"], a[href*="discord.com"]');
            if (discordLink) {
                const serverName = discordLink.textContent.trim() || 'Discord server';
                this.addActivity('discord_join', `User joining ${serverName}`, '💬');
            }
        });
    }

    trackDownloadClicks() {
        document.addEventListener('click', (e) => {
            const downloadBtn = e.target.closest('.btn-download, [data-download], a[download]');
            if (downloadBtn) {
                const itemName = downloadBtn.getAttribute('data-name') ||
                               downloadBtn.textContent.trim() ||
                               'cheat';
                this.addActivity('download', `Free ${itemName} downloaded`, '⬇️');
            }
        });
    }

    trackNavigationClicks() {
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (navLink) {
                const linkText = navLink.textContent.trim();
                if (linkText && linkText !== '') {
                    this.addActivity('navigation', `User navigating to ${linkText}`, '🧭');
                }
            }
        });
    }

    trackVideoPlays() {
        // Track YouTube video plays
        document.addEventListener('click', (e) => {
            const videoCard = e.target.closest('.video-card');
            if (videoCard) {
                const videoTitle = videoCard.querySelector('.video-title')?.textContent || 'video';
                this.addActivity('video_play', `Playing: ${videoTitle}`, '▶️');
            }
        });

        // Track embedded video plays
        window.addEventListener('message', (e) => {
            if (e.data && typeof e.data === 'string' && e.data.includes('onStateChange')) {
                this.addActivity('video_play', 'YouTube video started playing', '📺');
            }
        });
    }

    trackExternalLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="http"]');
            if (link && !link.href.includes(window.location.hostname)) {
                const url = new URL(link.href);
                if (url.hostname.includes('github.com')) {
                    this.addActivity('external_link', 'User visiting GitHub repository', '💻');
                } else if (url.hostname.includes('youtube.com')) {
                    this.addActivity('external_link', 'User watching YouTube video', '📺');
                }
            }
        });
    }

    getPageName() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop() || 'index.html';
        return fileName.replace('.html', '') || 'index';
    }

    // Public methods for manual tracking
    trackCheatDownload(cheatName) {
        this.addActivity('cheat_download', `${cheatName} downloaded`, '📥');
    }

    trackCheatUpdate(cheatName) {
        this.addActivity('cheat_update', `${cheatName} updated`, '🔄');
    }

    trackNewCheat(cheatName) {
        this.addActivity('new_cheat', `New cheat added: ${cheatName}`, '🆕');
    }

    trackVideoUpload(videoTitle) {
        this.addActivity('video_upload', `New video: ${videoTitle}`, '🎥');
    }

    trackBugFix(description) {
        this.addActivity('bug_fix', description, '🐛');
    }

    trackFeature(description) {
        this.addActivity('feature', description, '✨');
    }

    trackCommunityEvent(description) {
        this.addActivity('community', description, '🎉');
    }
}

// Initialize tracker globally
window.activityTracker = new ActivityTracker();

// Example: Simulate some initial activities if none exist
if (window.activityTracker.activities.length === 0) {
    window.activityTracker.trackNewCheat('Kiddions Modest Menu v9.2');
    window.activityTracker.trackVideoUpload('GTA V Mod Tutorial 2024');
    window.activityTracker.trackCheatUpdate('YimMenu v2.0');
}

// console.log('✅ Activity Tracker initialized');
