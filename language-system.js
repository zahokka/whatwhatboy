/**
 * Unified Language System
 * Simplified and robust language switching functionality
 */

class LanguageSystem {
    constructor() {
        this.currentLanguage = localStorage.getItem('selectedLanguage') || this.detectBrowserLanguage();
        this.isInitialized = false;
        this.languages = {
            'en': { name: 'English', flag: '🇺🇸', native: 'English' },
            'es': { name: 'Spanish', flag: '🇪🇸', native: 'Español' },
            'fr': { name: 'French', flag: '🇫🇷', native: 'Français' },
            'de': { name: 'German', flag: '🇩🇪', native: 'Deutsch' },
            'it': { name: 'Italian', flag: '🇮🇹', native: 'Italiano' },
            'pt': { name: 'Portuguese', flag: '🇵🇹', native: 'Português' },
            'ru': { name: 'Russian', flag: '🇷🇺', native: 'Русский' },
            'zh': { name: 'Chinese', flag: '🇨🇳', native: '中文' },
            'ja': { name: 'Japanese', flag: '🇯🇵', native: '日本語' },
            'ko': { name: 'Korean', flag: '🇰🇷', native: '한국어' },
            'ar': { name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
            'hi': { name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
            'th': { name: 'Thai', flag: '🇹🇭', native: 'ไทย' },
            'tr': { name: 'Turkish', flag: '🇹🇷', native: 'Türkçe' },
            'pl': { name: 'Polish', flag: '🇵🇱', native: 'Polski' },
            'nl': { name: 'Dutch', flag: '🇳🇱', native: 'Nederlands' }
        };

        this.translations = {
            en: {
                'Home': 'Home',
                'Profile': 'Profile',
                'Discord Servers': 'Discord Servers',
                'Free Cheats': 'Free Cheats',
                'YouTube': 'YouTube',
                'Tools': 'Tools',
                'Console': 'Console',
                'Help & FAQ': 'Help & FAQ',
                'Welcome to whatwhatboy\'s': 'Welcome to whatwhatboy\'s',
                'Game Developer • Content Creator • Discord Community Builder': 'Game Developer • Content Creator • Discord Community Builder',
                'Subscribe': 'Subscribe',
                'Download': 'Download',
                'Video Guide': 'Video Guide',
                'Language': 'Language',
                'Select Language': 'Select Language'
            },
            es: {
                'Home': 'Inicio',
                'Profile': 'Perfil',
                'Discord Servers': 'Servidores Discord',
                'Free Cheats': 'Trucos Gratis',
                'YouTube': 'YouTube',
                'Tools': 'Herramientas',
                'Console': 'Consola',
                'Help & FAQ': 'Ayuda y FAQ',
                'Welcome to whatwhatboy\'s': 'Bienvenido a whatwhatboy\'s',
                'Game Developer • Content Creator • Discord Community Builder': 'Desarrollador de Juegos • Creador de Contenido • Constructor de Comunidad Discord',
                'Subscribe': 'Suscribirse',
                'Download': 'Descargar',
                'Video Guide': 'Guía de Video',
                'Language': 'Idioma',
                'Select Language': 'Seleccionar Idioma'
            },
            fr: {
                'Home': 'Accueil',
                'Profile': 'Profil',
                'Discord Servers': 'Serveurs Discord',
                'Free Cheats': 'Triches Gratuites',
                'YouTube': 'YouTube',
                'Tools': 'Outils',
                'Console': 'Console',
                'Help & FAQ': 'Aide et FAQ',
                'Welcome to whatwhatboy\'s': 'Bienvenue chez whatwhatboy\'s',
                'Game Developer • Content Creator • Discord Community Builder': 'Développeur de Jeux • Créateur de Contenu • Constructeur de Communauté Discord',
                'Subscribe': 'S\'abonner',
                'Download': 'Télécharger',
                'Video Guide': 'Guide Vidéo',
                'Language': 'Langue',
                'Select Language': 'Sélectionner la Langue'
            },
            de: {
                'Home': 'Startseite',
                'Profile': 'Profil',
                'Discord Servers': 'Discord Server',
                'Free Cheats': 'Kostenlose Cheats',
                'YouTube': 'YouTube',
                'Tools': 'Werkzeuge',
                'Console': 'Konsole',
                'Help & FAQ': 'Hilfe & FAQ',
                'Welcome to whatwhatboy\'s': 'Willkommen bei whatwhatboy\'s',
                'Game Developer • Content Creator • Discord Community Builder': 'Spieleentwickler • Content Creator • Discord Community Builder',
                'Subscribe': 'Abonnieren',
                'Download': 'Herunterladen',
                'Video Guide': 'Video-Anleitung',
                'Language': 'Sprache',
                'Select Language': 'Sprache Auswählen'
            },
            ru: {
                'Home': 'Главная',
                'Profile': 'Профиль',
                'Discord Servers': 'Discord Серверы',
                'Free Cheats': 'Бесплатные Читы',
                'YouTube': 'YouTube',
                'Tools': 'Инструменты',
                'Console': 'Консоль',
                'Help & FAQ': 'Помощь и FAQ',
                'Welcome to whatwhatboy\'s': 'Добро пожаловать в whatwhatboy\'s',
                'Game Developer • Content Creator • Discord Community Builder': 'Разработчик Игр • Создатель Контента • Строитель Discord Сообщества',
                'Subscribe': 'Подписаться',
                'Download': 'Скачать',
                'Video Guide': 'Видео Руководство',
                'Language': 'Язык',
                'Select Language': 'Выбрать Язык'
            },
            zh: {
                'Home': '首页',
                'Profile': '个人资料',
                'Discord Servers': 'Discord 服务器',
                'Free Cheats': '免费作弊',
                'YouTube': 'YouTube',
                'Tools': '工具',
                'Console': '控制台',
                'Help & FAQ': '帮助与常见问题',
                'Welcome to whatwhatboy\'s': '欢迎来到 whatwhatboy\'s',
                'Game Developer • Content Creator • Discord Community Builder': '游戏开发者 • 内容创作者 • Discord 社区建设者',
                'Subscribe': '订阅',
                'Download': '下载',
                'Video Guide': '视频指南',
                'Language': '语言',
                'Select Language': '选择语言'
            },
            ja: {
                'Home': 'ホーム',
                'Profile': 'プロフィール',
                'Discord Servers': 'Discordサーバー',
                'Free Cheats': '無料チート',
                'YouTube': 'YouTube',
                'Tools': 'ツール',
                'Console': 'コンソール',
                'Help & FAQ': 'ヘルプとFAQ',
                'Welcome to whatwhatboy\'s': 'whatwhatboy\'sへようこそ',
                'Game Developer • Content Creator • Discord Community Builder': 'ゲーム開発者 • コンテンツクリエイター • Discordコミュニティビルダー',
                'Subscribe': '購読',
                'Download': 'ダウンロード',
                'Video Guide': 'ビデオガイド',
                'Language': '言語',
                'Select Language': '言語を選択'
            },
            ko: {
                'Home': '홈',
                'Profile': '프로필',
                'Discord Servers': 'Discord 서버',
                'Free Cheats': '무료 치트',
                'YouTube': 'YouTube',
                'Tools': '도구',
                'Console': '콘솔',
                'Help & FAQ': '도움말 및 FAQ',
                'Welcome to whatwhatboy\'s': 'whatwhatboy\'s에 오신 것을 환영합니다',
                'Game Developer • Content Creator • Discord Community Builder': '게임 개발자 • 콘텐츠 크리에이터 • Discord 커뮤니티 빌더',
                'Subscribe': '구독',
                'Download': '다운로드',
                'Video Guide': '비디오 가이드',
                'Language': '언어',
                'Select Language': '언어 선택'
            },
            ar: {
                'Home': 'الرئيسية',
                'Profile': 'الملف الشخصي',
                'Discord Servers': 'خوادم Discord',
                'Free Cheats': 'غش مجاني',
                'YouTube': 'YouTube',
                'Tools': 'الأدوات',
                'Console': 'وحدة التحكم',
                'Help & FAQ': 'المساعدة والأسئلة الشائعة',
                'Welcome to whatwhatboy\'s': 'مرحباً بك في whatwhatboy\'s',
                'Game Developer • Content Creator • Discord Community Builder': 'مطور ألعاب • منشئ محتوى • باني مجتمع Discord',
                'Subscribe': 'اشتراك',
                'Download': 'تحميل',
                'Video Guide': 'دليل الفيديو',
                'Language': 'اللغة',
                'Select Language': 'اختر اللغة'
            },
            hi: {
                'Home': 'मुख्य पृष्ठ',
                'Profile': 'प्रोफ़ाइल',
                'Discord Servers': 'Discord सर्वर',
                'Free Cheats': 'मुफ्त चीट्स',
                'YouTube': 'YouTube',
                'Tools': 'उपकरण',
                'Console': 'कंसोल',
                'Help & FAQ': 'सहायता और FAQ',
                'Welcome to whatwhatboy\'s': 'whatwhatboy\'s में आपका स्वागत है',
                'Game Developer • Content Creator • Discord Community Builder': 'गेम डेवलपर • कंटेंट क्रिएटर • Discord कम्युनिटी बिल्डर',
                'Subscribe': 'सब्सक्राइब करें',
                'Download': 'डाउनलोड',
                'Video Guide': 'वीडियो गाइड',
                'Language': 'भाषा',
                'Select Language': 'भाषा चुनें'
            },
            th: {
                'Home': 'หน้าหลัก',
                'Profile': 'โปรไฟล์',
                'Discord Servers': 'เซิร์ฟเวอร์ Discord',
                'Free Cheats': 'โกงฟรี',
                'YouTube': 'YouTube',
                'Tools': 'เครื่องมือ',
                'Console': 'คอนโซล',
                'Help & FAQ': 'ช่วยเหลือและคำถามที่พบบ่อย',
                'Welcome to whatwhatboy\'s': 'ยินดีต้อนรับสู่ whatwhatboy\'s',
                'Game Developer • Content Creator • Discord Community Builder': 'นักพัฒนาเกม • ผู้สร้างเนื้อหา • ผู้สร้างชุมชน Discord',
                'Subscribe': 'สมัครสมาชิก',
                'Download': 'ดาวน์โหลด',
                'Video Guide': 'คู่มือวิดีโอ',
                'Language': 'ภาษา',
                'Select Language': 'เลือกภาษา'
            }
        };

        this.init();
    }

    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();

        // Return detected language if supported, otherwise default to English
        return this.languages[langCode] ? langCode : 'en';
    }

    init() {
        if (this.isInitialized) return;

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupLanguageSelector());
        } else {
            this.setupLanguageSelector();
        }

        this.isInitialized = true;
    }

    setupLanguageSelector() {
        // Find existing language selector or create one
        let languageSelector = document.getElementById('language-selector');

        if (!languageSelector) {
            // Create floating language button if no selector exists
            this.createFloatingLanguageButton();
        } else {
            // Setup existing language selector
            this.setupExistingSelector(languageSelector);
        }

        // Apply current language
        this.applyLanguage();
    }

    createFloatingLanguageButton() {
        // Remove existing elements if present
        const existingBtn = document.getElementById('floating-language-btn');
        if (existingBtn) existingBtn.remove();
        const existingBar = document.getElementById('language-top-bar');
        if (existingBar) existingBar.remove();

        // Create top language bar
        this.createTopLanguageBar();
    }

    createTopLanguageBar() {
        const languageBar = document.createElement('div');
        languageBar.id = 'language-top-bar';
        languageBar.className = 'language-top-bar';

        languageBar.innerHTML = `
            <div class="language-bar-content">
                <div class="language-current" id="language-current">
                    <span class="current-flag">${this.languages[this.currentLanguage].flag}</span>
                    <span class="current-text">${this.languages[this.currentLanguage].native}</span>
                    <i class="fas fa-chevron-down" id="language-arrow"></i>
                </div>
                <div class="language-dropdown" id="language-dropdown" style="display: none;">
                    <div class="language-grid" id="language-grid"></div>
                </div>
            </div>
        `;

        languageBar.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            background: linear-gradient(135deg, var(--primary-color, #6366f1) 0%, var(--secondary-color, #8b5cf6) 100%) !important;
            color: white !important;
            z-index: 9999 !important;
            transform: translateY(-100%) !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 2px 20px rgba(0,0,0,0.3) !important;
            border-bottom: 1px solid rgba(255,255,255,0.2) !important;
        `;

        // Add styles for the content
        const barStyles = `
            .language-bar-content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
                position: relative;
            }

            .language-current {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 12px 20px;
                cursor: pointer;
                transition: all 0.2s ease;
                user-select: none;
                font-weight: 500;
            }

            .language-current:hover {
                background: rgba(255,255,255,0.1);
            }

            .current-flag {
                font-size: 18px;
            }

            .current-text {
                font-size: 14px;
            }

            #language-arrow {
                transition: transform 0.3s ease;
                font-size: 12px;
            }

            .language-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--bg-card, #1a1a1a);
                border: 2px solid var(--primary-color, #6366f1);
                border-top: none;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                max-height: 400px;
                overflow-y: auto;
                z-index: 10000;
            }

            .language-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 0;
                padding: 10px;
            }

            .language-option {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 15px;
                cursor: pointer;
                transition: all 0.2s ease;
                color: var(--text-primary, #ffffff);
                border-radius: 6px;
                margin: 2px;
            }

            .language-option:hover {
                background: var(--primary-color, #6366f1);
                transform: translateY(-1px);
            }

            .language-option.active {
                background: var(--primary-color, #6366f1);
                font-weight: 600;
            }

            .language-option .flag {
                font-size: 16px;
            }

            .language-option .name {
                font-size: 13px;
            }

            @media (max-width: 768px) {
                .language-grid {
                    grid-template-columns: repeat(2, 1fr);
                }

                .current-text {
                    display: none;
                }

                .language-bar-content {
                    padding: 0 15px;
                }
            }
        `;

        // Inject styles
        if (!document.getElementById('language-bar-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'language-bar-styles';
            styleSheet.textContent = barStyles;
            document.head.appendChild(styleSheet);
        }

        document.body.appendChild(languageBar);

        // Auto-show the bar after a short delay
        setTimeout(() => {
            languageBar.style.transform = 'translateY(0)';
            this.scheduleAutoHide(languageBar);
        }, 500);

        // Populate dropdown
        this.populateTopDropdown();

        // Add event listeners
        this.setupTopBarEvents(languageBar);

        // Add keyboard shortcut (Ctrl+L or Cmd+L)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                // console.log('Keyboard shortcut triggered');
                this.toggleTopDropdown();
            }
        });
    }

    populateTopDropdown() {
        const grid = document.getElementById('language-grid');
        if (!grid) return;

        grid.innerHTML = '';

        Object.entries(this.languages).forEach(([code, lang]) => {
            const option = document.createElement('div');
            option.className = `language-option ${code === this.currentLanguage ? 'active' : ''}`;
            option.dataset.language = code;

            option.innerHTML = `
                <span class="flag">${lang.flag}</span>
                <span class="name">${lang.native}</span>
            `;

            option.addEventListener('click', () => {
                this.changeLanguage(code);
                this.closeTopDropdown();
            });

            grid.appendChild(option);
        });
    }

    setupTopBarEvents(languageBar) {
        const currentSelector = languageBar.querySelector('.language-current');
        const dropdown = languageBar.querySelector('.language-dropdown');
        const arrow = languageBar.querySelector('#language-arrow');

        // Toggle dropdown on click
        currentSelector.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleTopDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!languageBar.contains(e.target)) {
                this.closeTopDropdown();
            }
        });

        // Handle scroll behavior - keep bar visible when dropdown is open
        let isDropdownOpen = false;
        this.isTopDropdownOpen = false;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target === dropdown && mutation.attributeName === 'style') {
                    const isOpen = dropdown.style.display === 'block';
                    if (isOpen !== isDropdownOpen) {
                        isDropdownOpen = isOpen;
                        this.isTopDropdownOpen = isOpen;
                        this.handleScrollBehavior(languageBar, isOpen);
                    }
                }
            });
        });

        observer.observe(dropdown, { attributes: true, attributeFilter: ['style'] });

        // Double-click to reset
        currentSelector.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            this.resetLanguage();
        });
    }

    toggleTopDropdown() {
        const dropdown = document.getElementById('language-dropdown');
        const arrow = document.getElementById('language-arrow');

        if (!dropdown || !arrow) return;

        const isOpen = dropdown.style.display === 'block';

        if (isOpen) {
            this.closeTopDropdown();
        } else {
            this.openTopDropdown();
        }
    }

    openTopDropdown() {
        const dropdown = document.getElementById('language-dropdown');
        const arrow = document.getElementById('language-arrow');

        if (!dropdown || !arrow) return;

        dropdown.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';
        this.isTopDropdownOpen = true;
    }

    closeTopDropdown() {
        const dropdown = document.getElementById('language-dropdown');
        const arrow = document.getElementById('language-arrow');

        if (!dropdown || !arrow) return;

        dropdown.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
        this.isTopDropdownOpen = false;
    }

    handleScrollBehavior(languageBar, isDropdownOpen) {
        if (isDropdownOpen) {
            // When dropdown is open, make sure bar stays visible and follows scroll
            languageBar.style.position = 'fixed';
            languageBar.style.top = '0';

            // Add scroll listener to keep it at top
            this.scrollHandler = () => {
                if (this.isTopDropdownOpen) {
                    languageBar.style.top = '0';
                }
            };

            window.addEventListener('scroll', this.scrollHandler);
        } else {
            // When dropdown closes, remove scroll handler
            if (this.scrollHandler) {
                window.removeEventListener('scroll', this.scrollHandler);
                this.scrollHandler = null;
            }
        }
    }

    scheduleAutoHide(languageBar) {
        // Clear any existing timeout
        if (this.autoHideTimeout) {
            clearTimeout(this.autoHideTimeout);
        }

        // Set timeout to hide after 5 seconds
        this.autoHideTimeout = setTimeout(() => {
            if (!this.isTopDropdownOpen) {
                languageBar.style.transform = 'translateY(-100%)';
            }
        }, 5000);

        // Show bar on hover and reset timer
        languageBar.addEventListener('mouseenter', () => {
            languageBar.style.transform = 'translateY(0)';
            if (this.autoHideTimeout) {
                clearTimeout(this.autoHideTimeout);
            }
        });

        languageBar.addEventListener('mouseleave', () => {
            if (!this.isTopDropdownOpen) {
                this.scheduleAutoHide(languageBar);
            }
        });
    }

    setupExistingSelector(selector) {
        const currentLang = selector.querySelector('#language-current, .language-current');
        const dropdown = selector.querySelector('#language-dropdown, .language-dropdown');

        if (currentLang && dropdown) {
            // Update current language display
            const langText = currentLang.querySelector('#current-language-text, .current-language-text, span');
            if (langText) {
                langText.textContent = this.languages[this.currentLanguage].native;
            }

            // Populate dropdown
            this.populateDropdown(dropdown);

            // Add click handler
            currentLang.addEventListener('click', () => {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!selector.contains(e.target)) {
                    dropdown.style.display = 'none';
                }
            });
        }
    }

    populateDropdown(dropdown) {
        dropdown.innerHTML = '';

        Object.entries(this.languages).forEach(([code, lang]) => {
            const option = document.createElement('div');
            option.className = 'language-option';
            option.innerHTML = `
                <span class="flag">${lang.flag}</span>
                <span class="name">${lang.native}</span>
            `;

            option.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 15px;
                cursor: pointer;
                transition: background 0.2s ease;
                color: var(--text-primary, #ffffff);
            `;

            if (code === this.currentLanguage) {
                option.style.background = 'var(--primary-color, #6366f1)';
            }

            option.addEventListener('mouseenter', () => {
                if (code !== this.currentLanguage) {
                    option.style.background = 'var(--bg-hover, rgba(255,255,255,0.1))';
                }
            });

            option.addEventListener('mouseleave', () => {
                if (code !== this.currentLanguage) {
                    option.style.background = 'transparent';
                }
            });

            option.addEventListener('click', () => {
                this.changeLanguage(code);
                dropdown.style.display = 'none';
            });

            dropdown.appendChild(option);
        });
    }

    showLanguageModal() {
        // console.log('Language modal triggered'); // Debug log

        // Remove existing modal
        const existingModal = document.getElementById('language-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'language-modal';
        modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0,0,0,0.8) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 99999 !important;
            backdrop-filter: blur(5px) !important;
            opacity: 1 !important;
            visibility: visible !important;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: var(--bg-card, #1a1a1a) !important;
            border: 2px solid var(--primary-color, #6366f1) !important;
            border-radius: 15px !important;
            padding: 30px !important;
            max-width: 400px !important;
            width: 90% !important;
            max-height: 70vh !important;
            overflow-y: auto !important;
            color: var(--text-primary, #ffffff) !important;
            position: relative !important;
            z-index: 100000 !important;
        `;

        modalContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; color: var(--primary-color, #6366f1);">
                    <i class="fas fa-globe"></i> ${this.translate('Select Language')}
                </h3>
                <p style="margin: 0; color: var(--text-secondary, #cccccc); font-size: 14px;">
                    Choose your preferred language
                </p>
            </div>

            <div id="language-grid" style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 10px;
                margin-bottom: 20px;
            "></div>

            <div style="text-align: center;">
                <button id="close-modal" style="
                    background: var(--bg-secondary, #333);
                    color: var(--text-primary, #ffffff);
                    border: 1px solid var(--border-color, #555);
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Close</button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Populate language grid
        const grid = modalContent.querySelector('#language-grid');
        Object.entries(this.languages).forEach(([code, lang]) => {
            const langButton = document.createElement('button');
            langButton.style.cssText = `
                background: ${code === this.currentLanguage ? 'var(--primary-color, #6366f1)' : 'var(--bg-secondary, #333)'};
                color: var(--text-primary, #ffffff);
                border: 1px solid var(--border-color, #555);
                padding: 15px 10px;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
                font-size: 14px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
            `;

            langButton.innerHTML = `
                <span style="font-size: 20px;">${lang.flag}</span>
                <span style="font-weight: 500;">${lang.native}</span>
            `;

            langButton.addEventListener('mouseenter', () => {
                if (code !== this.currentLanguage) {
                    langButton.style.background = 'var(--bg-hover, rgba(255,255,255,0.1))';
                    langButton.style.transform = 'translateY(-2px)';
                }
            });

            langButton.addEventListener('mouseleave', () => {
                if (code !== this.currentLanguage) {
                    langButton.style.background = 'var(--bg-secondary, #333)';
                    langButton.style.transform = 'translateY(0)';
                }
            });

            langButton.addEventListener('click', () => {
                this.changeLanguage(code);
                modal.remove();
            });

            grid.appendChild(langButton);
        });

        // Close modal handlers
        modalContent.querySelector('#close-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // ESC key to close
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    changeLanguage(langCode) {
        if (this.languages[langCode]) {
            this.currentLanguage = langCode;
            localStorage.setItem('selectedLanguage', langCode);
            this.applyLanguage();
            this.updateLanguageDisplay();

            // Show success notification
            this.showNotification(`Language changed to ${this.languages[langCode].native}!`);
        }
    }

    applyLanguage() {
        // Apply RTL for Arabic
        if (this.currentLanguage === 'ar') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
        } else {
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = this.currentLanguage;
        }

        // Apply font families for specific languages
        const fontMap = {
            'zh': "'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', sans-serif",
            'ja': "'Noto Sans JP', 'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif",
            'ko': "'Noto Sans KR', 'Malgun Gothic', sans-serif",
            'ar': "'Noto Sans Arabic', 'Tahoma', sans-serif",
            'hi': "'Noto Sans Devanagari', 'Mangal', sans-serif",
            'th': "'Noto Sans Thai', 'Leelawadee UI', sans-serif",
            'ru': "'Noto Sans', 'Segoe UI', sans-serif"
        };

        if (fontMap[this.currentLanguage]) {
            document.documentElement.style.fontFamily = fontMap[this.currentLanguage];
        } else {
            document.documentElement.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
        }

        // Translate page content
        this.translatePageContent();
    }

    translatePageContent() {
        const translations = this.translations[this.currentLanguage] || this.translations.en;

        // Translate all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });

        // Translate navigation items
        document.querySelectorAll('.nav-link span, .sidebar-nav span').forEach(element => {
            const text = element.textContent.trim();
            if (translations[text]) {
                element.textContent = translations[text];
            }
        });

        // Translate buttons and common elements
        document.querySelectorAll('button, .btn').forEach(element => {
            const text = element.textContent.trim();
            if (translations[text]) {
                element.textContent = translations[text];
            }
        });
    }

    updateLanguageDisplay() {
        // Update top language bar
        const currentFlag = document.querySelector('.current-flag');
        const currentText = document.querySelector('.current-text');

        if (currentFlag) {
            currentFlag.textContent = this.languages[this.currentLanguage].flag;
        }
        if (currentText) {
            currentText.textContent = this.languages[this.currentLanguage].native;
        }

        // Update dropdown options
        const options = document.querySelectorAll('.language-option');
        options.forEach(option => {
            const code = option.dataset.language;
            if (code === this.currentLanguage) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });

        // Update floating button (if exists)
        const floatingBtn = document.getElementById('floating-language-btn');
        if (floatingBtn) {
            const flagSpan = floatingBtn.querySelector('span');
            if (flagSpan) {
                flagSpan.textContent = this.languages[this.currentLanguage].flag;
            }
        }

        // Update existing language selector
        const currentLangText = document.querySelector('#current-language-text, .current-language-text');
        if (currentLangText) {
            currentLangText.textContent = this.languages[this.currentLanguage].native;
        }
    }

    translate(key) {
        const translations = this.translations[this.currentLanguage] || this.translations.en;
        return translations[key] || key;
    }

    resetLanguage() {
        // console.log('Resetting language to English');
        localStorage.removeItem('selectedLanguage');
        this.currentLanguage = 'en';
        this.applyLanguage();
        this.updateLanguageDisplay();
        this.showNotification('Language reset to English!');
    }

    showNotification(message) {
        // Remove existing notifications
        document.querySelectorAll('.language-notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'language-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary-color, #6366f1);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            z-index: 10002;
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            animation: slideDown 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        `;

        // Add animation styles
        if (!document.getElementById('language-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'language-notification-styles';
            styles.textContent = `
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }
}

// Initialize language system
if (typeof window !== 'undefined') {
    // Ensure DOM is ready before initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.languageSystem = new LanguageSystem();
            // Add global reset function
            window.resetLanguage = () => window.languageSystem.resetLanguage();
        });
    } else {
        window.languageSystem = new LanguageSystem();
        // Add global reset function
        window.resetLanguage = () => window.languageSystem.resetLanguage();
    }
}