// Floating Search Functionality - Lightweight Version

(function() {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

function init() {
    // Create search button
    const searchBtn = document.createElement('button');
    searchBtn.className = 'floating-search-btn';
    searchBtn.innerHTML = '<i class="fas fa-search"></i>';
    searchBtn.setAttribute('aria-label', 'Open Search');
    searchBtn.setAttribute('title', 'Search Site (Ctrl+K)');
    document.body.appendChild(searchBtn);

    // Create search modal
    const searchModal = document.createElement('div');
    searchModal.className = 'search-modal';
    searchModal.innerHTML = `
        <div class="search-modal-content">
            <div class="search-modal-header">
                <h3><i class="fas fa-search"></i> Search Site</h3>
                <button class="search-modal-close" aria-label="Close Search">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="search-modal-input-wrapper">
                <i class="fas fa-search search-modal-icon"></i>
                <input
                    type="text"
                    class="search-modal-input"
                    placeholder="Search games, mods, emulators, tools..."
                    aria-label="Search"
                    autocomplete="off"
                >
            </div>

            <div class="search-shortcuts">
                <button class="search-shortcut" data-search="GTA">GTA Cheats</button>
                <button class="search-shortcut" data-search="emulator">Emulators</button>
                <button class="search-shortcut" data-search="mods">Game Mods</button>
                <button class="search-shortcut" data-search="discord">Discord</button>
            </div>

            <div class="search-results"></div>

            <div class="keyboard-hint">
                Press <kbd>Esc</kbd> to close • <kbd>↑</kbd> <kbd>↓</kbd> to navigate
            </div>
        </div>
    `;
    document.body.appendChild(searchModal);

    // Search data - all site pages and content
    const searchData = [
        // Games
        { title: 'GTA V Cheats', url: 'games/gta/index.html', description: 'Free mod menus, trainers, and scripts for GTA V', category: 'Games', icon: 'fa-car' },
        { title: 'GTA IV Mods', url: 'mods.html#gta', description: 'Graphics overhauls and mods for GTA IV', category: 'Mods', icon: 'fa-puzzle-piece' },
        { title: 'Counter-Strike 2', url: 'games/cs2/index.html', description: 'Aimbot, wallhack, and ESP tools for CS2', category: 'Games', icon: 'fa-crosshairs' },
        { title: 'Garry\'s Mod', url: 'games/gmod/index.html', description: 'Enhanced gameplay tools and cheats', category: 'Games', icon: 'fa-gamepad' },
        { title: 'Red Dead Redemption 2', url: 'games/rdr2/index.html', description: 'Trainers and mod menus for RDR2', category: 'Games', icon: 'fa-horse' },
        { title: 'Call of Duty', url: 'games/cod/index.html', description: 'Cheats for all COD games', category: 'Games', icon: 'fa-crosshairs' },
        { title: 'Battlefield', url: 'games/battlefield/index.html', description: 'Cheats for all Battlefield games', category: 'Games', icon: 'fa-crosshairs' },
        { title: 'Team Fortress 2', url: 'games/tf2/index.html', description: '64-bit and 32-bit TF2 cheats', category: 'Games', icon: 'fa-gamepad' },
        { title: 'Left 4 Dead', url: 'games/left4dead/index.html', description: 'L4D1 & L4D2 cheats and mods', category: 'Games', icon: 'fa-gamepad' },
        { title: 'Farlight 84', url: 'games/farlight84/index.html', description: 'Battle royale cheats', category: 'Games', icon: 'fa-gamepad' },

        // Emulators
        { title: 'PlayStation Emulators', url: 'console/playstation-emulators.html', description: 'PS1, PS2, PS3, PSP emulators', category: 'Emulators', icon: 'fa-play' },
        { title: 'Xbox Emulators', url: 'console/xbox-emulators.html', description: 'Original Xbox and Xbox 360 emulators', category: 'Emulators', icon: 'fa-cube' },
        { title: 'Nintendo Emulators', url: 'console/nintendo-emulators.html', description: 'N64, GameCube, Wii, Switch emulators', category: 'Emulators', icon: 'fa-star' },
        { title: 'All Console Emulators', url: 'console/emulators.html', description: 'Complete emulator collection', category: 'Emulators', icon: 'fa-desktop' },
        { title: 'PCSX2 (PS2)', url: 'console/playstation-emulators.html#ps2', description: 'PlayStation 2 emulator', category: 'Emulators', icon: 'fa-play' },
        { title: 'RPCS3 (PS3)', url: 'console/playstation-emulators.html#ps3', description: 'PlayStation 3 emulator', category: 'Emulators', icon: 'fa-play' },
        { title: 'PPSSPP (PSP)', url: 'console/playstation-emulators.html#psp', description: 'PlayStation Portable emulator', category: 'Emulators', icon: 'fa-play' },
        { title: 'Dolphin', url: 'console/nintendo-emulators.html#dolphin', description: 'GameCube and Wii emulator', category: 'Emulators', icon: 'fa-star' },
        { title: 'Cemu', url: 'console/nintendo-emulators.html#wiiu', description: 'Wii U emulator', category: 'Emulators', icon: 'fa-star' },
        { title: 'Xenia', url: 'console/xbox-emulators.html#xbox360', description: 'Xbox 360 emulator', category: 'Emulators', icon: 'fa-cube' },

        // Mods
        { title: 'Game Mods', url: 'mods.html', description: 'Mods for GTA, Skyrim, Fallout, and more', category: 'Mods', icon: 'fa-puzzle-piece' },
        { title: 'Skyrim Mods', url: 'mods.html#rpg', description: 'Graphics overhauls and quest mods', category: 'Mods', icon: 'fa-dragon' },
        { title: 'Fallout 4 Mods', url: 'mods.html#rpg', description: 'Settlement building and weapon mods', category: 'Mods', icon: 'fa-radiation' },
        { title: 'Minecraft Mods', url: 'mods.html#fps', description: 'Tech mods, shaders, and modpacks', category: 'Mods', icon: 'fa-cube' },

        // Discord & Community
        { title: 'Discord Servers', url: 'index.html#discord', description: 'Join our gaming communities', category: 'Community', icon: 'fa-discord' },
        { title: 'YouTube Channel', url: 'youtube.html', description: 'Watch our gaming videos', category: 'Community', icon: 'fa-youtube' },

        // Tools
        { title: 'Injectors & Tools', url: 'tools/injectors.html', description: 'DLL injectors and process tools', category: 'Tools', icon: 'fa-tools' },
        { title: 'Cheat Sources', url: 'tools/sources.html', description: 'Open-source cheat repositories', category: 'Tools', icon: 'fa-code' },

        // Console Mods
        { title: 'Xbox 360 Mods', url: 'console/xbox360.html', description: 'JTAG, RGH modifications', category: 'Console', icon: 'fa-gamepad' },
        { title: 'PlayStation 3 Mods', url: 'console/ps3.html', description: 'Custom firmware and homebrew', category: 'Console', icon: 'fa-gamepad' },

        // Other
        { title: 'Help & FAQ', url: 'help.html', description: 'Get help and find answers', category: 'Help', icon: 'fa-question-circle' },
        { title: 'Contact Info', url: 'profile.html', description: 'Get in touch with us', category: 'Contact', icon: 'fa-address-card' },
        { title: 'Safety Tips', url: 'safety.html', description: 'Stay safe while gaming', category: 'Help', icon: 'fa-shield-alt' }
    ];

    // Elements
    const searchInput = searchModal.querySelector('.search-modal-input');
    const searchResults = searchModal.querySelector('.search-results');
    const closeBtn = searchModal.querySelector('.search-modal-close');
    const shortcuts = searchModal.querySelectorAll('.search-shortcut');

    // Open search modal
    function openSearch() {
        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput.focus(), 100);
    }

    // Close search modal
    function closeSearch() {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
        searchInput.value = '';
        searchResults.innerHTML = '';
    }

    // Perform search
    function performSearch(query) {
        const lowerQuery = query.toLowerCase().trim();

        if (!lowerQuery) {
            searchResults.innerHTML = '';
            return;
        }

        const results = searchData.filter(item => {
            return item.title.toLowerCase().includes(lowerQuery) ||
                   item.description.toLowerCase().includes(lowerQuery) ||
                   item.category.toLowerCase().includes(lowerQuery);
        });

        displayResults(results, lowerQuery);
    }

    // Display search results
    function displayResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h4>No results found</h4>
                    <p>Try searching for games, mods, emulators, or tools</p>
                </div>
            `;
            return;
        }

        const highlightedResults = results.map(result => {
            const highlightedTitle = highlightText(result.title, query);
            const highlightedDesc = highlightText(result.description, query);

            return `
                <a href="${result.url}" class="search-result-item">
                    <div class="search-result-title">
                        <i class="fas ${result.icon}"></i>
                        ${highlightedTitle}
                    </div>
                    <div class="search-result-description">${highlightedDesc}</div>
                    <span class="search-result-category">${result.category}</span>
                </a>
            `;
        }).join('');

        searchResults.innerHTML = highlightedResults;
    }

    // Highlight matching text
    function highlightText(text, query) {
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    // Escape regex special characters
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Event listeners
    searchBtn.addEventListener('click', openSearch);
    closeBtn.addEventListener('click', closeSearch);

    // Click outside to close
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            closeSearch();
        }
    });

    // Search input
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+K or Cmd+K to open search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }

        // Escape to close
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            closeSearch();
        }
    });

    // Shortcut buttons
    shortcuts.forEach(shortcut => {
        shortcut.addEventListener('click', () => {
            const searchTerm = shortcut.getAttribute('data-search');
            searchInput.value = searchTerm;
            performSearch(searchTerm);
        });
    });

    // Enter key to navigate to first result
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const firstResult = searchResults.querySelector('.search-result-item');
            if (firstResult) {
                window.location.href = firstResult.getAttribute('href');
            }
        }
    });

    // console.log('Floating search initialized successfully');
}

})();
