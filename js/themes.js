// Système de thèmes de couleurs pour DactyloApp

const Themes = {
    default: {
        name: 'Forêt Sombre',
        id: 'default',
        colors: {
            bgPrimary: 'rgb(33, 81, 71)',
            bgSecondary: 'white',
            textPrimary: 'white',
            textSecondary: '#333',
            accentColor: '#f093fb',
            shadow: 'rgba(0, 0, 0, 0.3)',
            boxBg: 'rgba(255, 255, 255, 0.95)',
            statBoxBg: 'rgba(255, 255, 255, 0.1)'
        }
    },
    ocean: {
        name: 'Océan',
        id: 'ocean',
        colors: {
            bgPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            bgSecondary: '#e0e7ff',
            textPrimary: 'white',
            textSecondary: '#1e293b',
            accentColor: '#3b82f6',
            shadow: 'rgba(0, 0, 0, 0.2)',
            boxBg: 'rgba(255, 255, 255, 0.95)',
            statBoxBg: 'rgba(255, 255, 255, 0.15)'
        }
    },
    sunset: {
        name: 'Coucher de Soleil',
        id: 'sunset',
        colors: {
            bgPrimary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            bgSecondary: '#fff0f3',
            textPrimary: 'white',
            textSecondary: '#4a1d1f',
            accentColor: '#ff6b6b',
            shadow: 'rgba(0, 0, 0, 0.25)',
            boxBg: 'rgba(255, 255, 255, 0.9)',
            statBoxBg: 'rgba(255, 255, 255, 0.2)'
        }
    },
    forest: {
        name: 'Forêt Enchantée',
        id: 'forest',
        colors: {
            bgPrimary: 'linear-gradient(135deg, #134e4a 0%, #064e3b 100%)',
            bgSecondary: '#ecfdf5',
            textPrimary: '#d1fae5',
            textSecondary: '#064e3b',
            accentColor: '#10b981',
            shadow: 'rgba(0, 0, 0, 0.3)',
            boxBg: 'rgba(255, 255, 255, 0.95)',
            statBoxBg: 'rgba(209, 250, 229, 0.1)'
        }
    },
    dracula: {
        name: 'Dracula',
        id: 'dracula',
        colors: {
            bgPrimary: '#282a36',
            bgSecondary: '#44475a',
            textPrimary: '#f8f8f2',
            textSecondary: '#f8f8f2',
            accentColor: '#bd93f9',
            shadow: 'rgba(0, 0, 0, 0.5)',
            boxBg: '#44475a',
            statBoxBg: 'rgba(68, 71, 90, 0.5)'
        }
    },
    nord: {
        name: 'Nord',
        id: 'nord',
        colors: {
            bgPrimary: '#2e3440',
            bgSecondary: '#3b4252',
            textPrimary: '#eceff4',
            textSecondary: '#eceff4',
            accentColor: '#88c0d0',
            shadow: 'rgba(0, 0, 0, 0.4)',
            boxBg: '#3b4252',
            statBoxBg: 'rgba(59, 66, 82, 0.5)'
        }
    },
    light: {
        name: 'Clair',
        id: 'light',
        colors: {
            bgPrimary: '#f0f4f8',
            bgSecondary: 'white',
            textPrimary: '#2d3748',
            textSecondary: '#4a5568',
            accentColor: '#667eea',
            shadow: 'rgba(0, 0, 0, 0.1)',
            boxBg: 'white',
            statBoxBg: '#e2e8f0'
        }
    },
    cyberpunk: {
        name: 'Cyberpunk',
        id: 'cyberpunk',
        colors: {
            bgPrimary: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            bgSecondary: '#1a1a2e',
            textPrimary: '#00ff9f',
            textSecondary: '#00ff9f',
            accentColor: '#ff00ff',
            shadow: 'rgba(0, 255, 159, 0.3)',
            boxBg: 'rgba(26, 26, 46, 0.9)',
            statBoxBg: 'rgba(0, 255, 159, 0.1)'
        }
    },
    sakura: {
        name: 'Sakura',
        id: 'sakura',
        colors: {
            bgPrimary: 'linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%)',
            bgSecondary: '#fff5f7',
            textPrimary: '#831843',
            textSecondary: '#831843',
            accentColor: '#ec4899',
            shadow: 'rgba(131, 24, 67, 0.15)',
            boxBg: 'rgba(255, 255, 255, 0.95)',
            statBoxBg: 'rgba(236, 72, 153, 0.1)'
        }
    }
};

const ThemeManager = {
    currentTheme: 'default',

    // Appliquer un thème
    apply(themeId) {
        const theme = Themes[themeId];
        if (!theme) {
            console.error(`Thème ${themeId} introuvable`);
            return;
        }

        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
            const cssVar = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
            root.style.setProperty(cssVar, value);
        });

        this.currentTheme = themeId;

        // Sauvegarder la préférence
        const settings = Storage.getSettings();
        settings.colorTheme = themeId;
        Storage.updateSettings(settings);

        // Gérer la classe light-mode pour compatibilité
        if (themeId === 'light' || themeId === 'sakura') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    },

    // Obtenir tous les thèmes disponibles
    getAll() {
        return Object.values(Themes);
    },

    // Charger le thème sauvegardé
    loadSaved() {
        const settings = Storage.getSettings();
        const themeId = settings.colorTheme || 'default';
        this.apply(themeId);
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Themes, ThemeManager };
}
