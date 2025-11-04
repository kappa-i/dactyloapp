// Système d'achievements pour DactyloApp

const AchievementsSystem = {
    // Définition de tous les achievements
    definitions: {
        firstSession: {
            id: 'firstSession',
            name: 'Premier Pas',
            description: 'Complétez votre premier exercice',
            icon: '🎯',
            xpReward: 10
        },
        speed50: {
            id: 'speed50',
            name: 'Rapide',
            description: 'Atteignez 50 mots/minute',
            icon: '⚡',
            xpReward: 25
        },
        speed70: {
            id: 'speed70',
            name: 'Très Rapide',
            description: 'Atteignez 70 mots/minute',
            icon: '🚀',
            xpReward: 50
        },
        speed100: {
            id: 'speed100',
            name: 'Vitesse Lumière',
            description: 'Atteignez 100 mots/minute',
            icon: '⚡',
            xpReward: 100
        },
        perfect: {
            id: 'perfect',
            name: 'Perfection',
            description: 'Terminez avec 100% de précision',
            icon: '💯',
            xpReward: 50
        },
        streak7: {
            id: 'streak7',
            name: 'Semaine Productive',
            description: 'Pratiquez 7 jours consécutifs',
            icon: '🔥',
            xpReward: 75
        },
        streak30: {
            id: 'streak30',
            name: 'Mois Dévoué',
            description: 'Pratiquez 30 jours consécutifs',
            icon: '🏆',
            xpReward: 200
        },
        sessions10: {
            id: 'sessions10',
            name: 'Pratiquant',
            description: 'Complétez 10 exercices',
            icon: '📚',
            xpReward: 30
        },
        sessions50: {
            id: 'sessions50',
            name: 'Assidu',
            description: 'Complétez 50 exercices',
            icon: '📖',
            xpReward: 100
        },
        sessions100: {
            id: 'sessions100',
            name: 'Maître',
            description: 'Complétez 100 exercices',
            icon: '👑',
            xpReward: 250
        },
        marathon: {
            id: 'marathon',
            name: 'Marathonien',
            description: 'Complétez un mode Marathon',
            icon: '🏃',
            xpReward: 75
        },
        perfectionist: {
            id: 'perfectionist',
            name: 'Perfectionniste',
            description: 'Réussir le mode Perfectionniste',
            icon: '✨',
            xpReward: 100
        },
        speedDemon: {
            id: 'speedDemon',
            name: 'Démon de Vitesse',
            description: 'Taper 200 mots en mode Sprint',
            icon: '👹',
            xpReward: 50
        },
        dedicated: {
            id: 'dedicated',
            name: 'Dévoué',
            description: 'Pratiquez 5 exercices en un jour',
            icon: '💪',
            xpReward: 40
        }
    },

    // Vérifier et débloquer les achievements
    checkAchievements(sessionData, stats, streaks) {
        const unlocked = [];

        // Premier exercice
        if (stats.totalSessions === 1) {
            if (Storage.unlockAchievement('firstSession')) {
                unlocked.push(this.definitions.firstSession);
            }
        }

        // Achievements de vitesse
        if (sessionData.wpm >= 50 && Storage.unlockAchievement('speed50')) {
            unlocked.push(this.definitions.speed50);
        }
        if (sessionData.wpm >= 70 && Storage.unlockAchievement('speed70')) {
            unlocked.push(this.definitions.speed70);
        }
        if (sessionData.wpm >= 100 && Storage.unlockAchievement('speed100')) {
            unlocked.push(this.definitions.speed100);
        }

        // Précision parfaite
        if (sessionData.accuracy === 100 && Storage.unlockAchievement('perfect')) {
            unlocked.push(this.definitions.perfect);
        }

        // Streaks
        if (streaks.currentStreak >= 7 && Storage.unlockAchievement('streak7')) {
            unlocked.push(this.definitions.streak7);
        }
        if (streaks.currentStreak >= 30 && Storage.unlockAchievement('streak30')) {
            unlocked.push(this.definitions.streak30);
        }

        // Nombre de sessions
        if (stats.totalSessions >= 10 && Storage.unlockAchievement('sessions10')) {
            unlocked.push(this.definitions.sessions10);
        }
        if (stats.totalSessions >= 50 && Storage.unlockAchievement('sessions50')) {
            unlocked.push(this.definitions.sessions50);
        }
        if (stats.totalSessions >= 100 && Storage.unlockAchievement('sessions100')) {
            unlocked.push(this.definitions.sessions100);
        }

        // Modes spéciaux
        if (sessionData.mode === 'marathon' && Storage.unlockAchievement('marathon')) {
            unlocked.push(this.definitions.marathon);
        }
        if (sessionData.mode === 'perfectionniste' && Storage.unlockAchievement('perfectionist')) {
            unlocked.push(this.definitions.perfectionist);
        }
        if (sessionData.mode === 'sprint' && sessionData.wordCount >= 200 && Storage.unlockAchievement('speedDemon')) {
            unlocked.push(this.definitions.speedDemon);
        }

        // Dévoué (5 exercices en un jour)
        if (streaks.sessionsToday >= 5 && Storage.unlockAchievement('dedicated')) {
            unlocked.push(this.definitions.dedicated);
        }

        return unlocked;
    },

    // Obtenir tous les achievements avec leur statut
    getAllAchievements() {
        const unlocked = Storage.getAchievements();
        return Object.values(this.definitions).map(achievement => ({
            ...achievement,
            unlocked: unlocked[achievement.id] || false,
            unlockedDate: unlocked[`${achievement.id}_date`] || null
        }));
    },

    // Obtenir le pourcentage de complétion
    getCompletionPercentage() {
        const all = this.getAllAchievements();
        const unlockedCount = all.filter(a => a.unlocked).length;
        return Math.round((unlockedCount / all.length) * 100);
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementsSystem;
}
