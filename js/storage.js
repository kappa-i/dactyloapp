// Gestionnaire de stockage localStorage pour DactyloApp

const Storage = {
    // Clés de stockage
    keys: {
        HISTORY: 'dactylo_history',
        SETTINGS: 'dactylo_settings',
        ACHIEVEMENTS: 'dactylo_achievements',
        STATS: 'dactylo_stats',
        STREAKS: 'dactylo_streaks',
        CUSTOM_TEXTS: 'dactylo_custom_texts',
        USER_LEVEL: 'dactylo_user_level'
    },

    // Obtenir une valeur
    get(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error(`Erreur lors de la lecture de ${key}:`, e);
            return null;
        }
    },

    // Définir une valeur
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error(`Erreur lors de l'écriture de ${key}:`, e);
            return false;
        }
    },

    // Supprimer une valeur
    remove(key) {
        localStorage.removeItem(key);
    },

    // Réinitialiser toutes les données
    clear() {
        Object.values(this.keys).forEach(key => this.remove(key));
    },

    // === HISTORIQUE ===
    addHistory(session) {
        const history = this.get(this.keys.HISTORY) || [];
        session.id = Date.now();
        session.date = new Date().toISOString();
        history.unshift(session);

        // Garder seulement les 50 dernières sessions
        if (history.length > 50) {
            history.splice(50);
        }

        this.set(this.keys.HISTORY, history);
        return session;
    },

    getHistory(limit = 10) {
        const history = this.get(this.keys.HISTORY) || [];
        return limit ? history.slice(0, limit) : history;
    },

    // === PARAMÈTRES ===
    getSettings() {
        return this.get(this.keys.SETTINGS) || {
            theme: 'dark',
            colorTheme: 'default',
            fontSize: 'medium',
            fontFamily: 'courier',
            soundEnabled: false,
            animationsEnabled: true,
            transitionSpeed: 500,
            notifications: false
        };
    },

    updateSettings(newSettings) {
        const current = this.getSettings();
        this.set(this.keys.SETTINGS, { ...current, ...newSettings });
    },

    // === ACHIEVEMENTS ===
    getAchievements() {
        return this.get(this.keys.ACHIEVEMENTS) || {
            firstSession: false,
            speed50: false,
            speed70: false,
            speed100: false,
            perfect: false,
            streak7: false,
            streak30: false,
            sessions10: false,
            sessions50: false,
            sessions100: false,
            marathon: false,
            perfectionist: false,
            speedDemon: false,
            dedicated: false
        };
    },

    unlockAchievement(achievementKey) {
        const achievements = this.getAchievements();
        if (!achievements[achievementKey]) {
            achievements[achievementKey] = true;
            achievements[`${achievementKey}_date`] = new Date().toISOString();
            this.set(this.keys.ACHIEVEMENTS, achievements);
            return true; // Nouveau achievement débloqué
        }
        return false; // Déjà débloqué
    },

    // === STATISTIQUES GLOBALES ===
    getStats() {
        return this.get(this.keys.STATS) || {
            totalSessions: 0,
            totalCharacters: 0,
            totalErrors: 0,
            totalTime: 0,
            bestWPM: 0,
            bestAccuracy: 0,
            averageWPM: 0,
            averageAccuracy: 0
        };
    },

    updateStats(sessionData) {
        const stats = this.getStats();

        stats.totalSessions++;
        stats.totalCharacters += sessionData.characters || 0;
        stats.totalErrors += sessionData.errors || 0;
        stats.totalTime += sessionData.time || 0;

        if (sessionData.wpm > stats.bestWPM) {
            stats.bestWPM = sessionData.wpm;
        }

        if (sessionData.accuracy > stats.bestAccuracy) {
            stats.bestAccuracy = sessionData.accuracy;
        }

        // Recalculer les moyennes
        const history = this.getHistory();
        const totalWPM = history.reduce((sum, s) => sum + (s.wpm || 0), 0);
        const totalAcc = history.reduce((sum, s) => sum + (s.accuracy || 0), 0);
        stats.averageWPM = Math.round(totalWPM / history.length);
        stats.averageAccuracy = Math.round(totalAcc / history.length);

        this.set(this.keys.STATS, stats);
        return stats;
    },

    // === STREAKS ===
    getStreaks() {
        return this.get(this.keys.STREAKS) || {
            currentStreak: 0,
            longestStreak: 0,
            lastSessionDate: null,
            sessionsToday: 0
        };
    },

    updateStreaks() {
        const streaks = this.getStreaks();
        const today = new Date().toDateString();
        const lastDate = streaks.lastSessionDate ? new Date(streaks.lastSessionDate).toDateString() : null;

        if (lastDate === today) {
            // Même jour
            streaks.sessionsToday++;
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            if (lastDate === yesterdayStr) {
                // Jour consécutif
                streaks.currentStreak++;
            } else if (lastDate !== null) {
                // Streak cassé
                streaks.currentStreak = 1;
            } else {
                // Premier jour
                streaks.currentStreak = 1;
            }

            streaks.sessionsToday = 1;
        }

        if (streaks.currentStreak > streaks.longestStreak) {
            streaks.longestStreak = streaks.currentStreak;
        }

        streaks.lastSessionDate = new Date().toISOString();
        this.set(this.keys.STREAKS, streaks);
        return streaks;
    },

    // === TEXTES PERSONNALISÉS ===
    getCustomTexts() {
        return this.get(this.keys.CUSTOM_TEXTS) || [];
    },

    addCustomText(text) {
        const customTexts = this.getCustomTexts();
        const newText = {
            id: Date.now(),
            ...text,
            createdAt: new Date().toISOString()
        };
        customTexts.push(newText);
        this.set(this.keys.CUSTOM_TEXTS, customTexts);
        return newText;
    },

    removeCustomText(id) {
        const customTexts = this.getCustomTexts();
        const filtered = customTexts.filter(t => t.id !== id);
        this.set(this.keys.CUSTOM_TEXTS, filtered);
    },

    // === NIVEAU ET XP ===
    getUserLevel() {
        return this.get(this.keys.USER_LEVEL) || {
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            totalXP: 0
        };
    },

    addXP(amount) {
        const userLevel = this.getUserLevel();
        userLevel.xp += amount;
        userLevel.totalXP += amount;

        // Vérifier si on monte de niveau
        const levelsGained = [];
        while (userLevel.xp >= userLevel.xpToNextLevel) {
            userLevel.xp -= userLevel.xpToNextLevel;
            userLevel.level++;
            levelsGained.push(userLevel.level);
            // XP nécessaire augmente de 20% par niveau
            userLevel.xpToNextLevel = Math.floor(userLevel.xpToNextLevel * 1.2);
        }

        this.set(this.keys.USER_LEVEL, userLevel);
        return {
            userLevel,
            levelsGained
        };
    },

    // Calculer XP gagné selon la performance
    calculateXP(sessionData) {
        let xp = 10; // XP de base

        // Bonus pour la vitesse
        if (sessionData.wpm >= 100) xp += 50;
        else if (sessionData.wpm >= 70) xp += 30;
        else if (sessionData.wpm >= 50) xp += 20;
        else if (sessionData.wpm >= 30) xp += 10;

        // Bonus pour la précision
        if (sessionData.accuracy === 100) xp += 50;
        else if (sessionData.accuracy >= 95) xp += 30;
        else if (sessionData.accuracy >= 90) xp += 20;
        else if (sessionData.accuracy >= 80) xp += 10;

        // Bonus pour la difficulté
        if (sessionData.difficulty === 'difficile') xp += 20;
        else if (sessionData.difficulty === 'moyen') xp += 10;

        // Bonus pour le mode
        if (sessionData.mode === 'marathon') xp += 30;
        else if (sessionData.mode === 'perfectionniste') xp += 25;
        else if (sessionData.mode === 'sprint') xp += 15;

        return xp;
    },

    // Obtenir le nom du niveau
    getLevelName(level) {
        if (level < 5) return 'Débutant';
        if (level < 10) return 'Apprenti';
        if (level < 15) return 'Intermédiaire';
        if (level < 20) return 'Avancé';
        if (level < 30) return 'Expert';
        if (level < 50) return 'Maître';
        return 'Légende';
    }
};

// Export pour utilisation dans app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
