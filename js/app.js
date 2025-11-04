// ============================================
// DACTYLOAPP - APPLICATION PRINCIPALE
// ============================================

// Éléments DOM principaux
const elements = {
    // Boutons principaux
    start: document.querySelector("#btn-commencer"),
    pause: document.querySelector("#btn-pause"),
    stop: document.querySelector("#btn-stop"),

    // Texte et saisie
    textRef: document.querySelector("#texte-reference > p"),
    textArea: document.querySelector("#input-utilisateur"),
    themeAffichage: document.querySelector("#theme-affichage"),
    themeTexte: document.querySelector("#theme-texte"),

    // Configuration
    modeSelect: document.querySelector("#mode-select"),
    difficultySelect: document.querySelector("#difficulty-select"),
    themeSelect: document.querySelector("#theme-select"),
    configPanel: document.querySelector("#config-panel"),

    // Stats temps réel
    statsPanel: document.querySelector("#stats-panel"),
    timer: document.querySelector("#timer"),
    progress: document.querySelector("#progress"),
    wpm: document.querySelector("#wpm"),
    accuracy: document.querySelector("#accuracy"),

    // Barre de progression
    progressBarContainer: document.querySelector("#progress-bar-container"),
    progressFill: document.querySelector("#progress-fill"),

    // Niveau et XP
    userLevel: document.querySelector("#user-level"),
    xpFill: document.querySelector("#xp-fill"),
    xpText: document.querySelector("#xp-text"),
    streakCount: document.querySelector("#streak-count"),

    // Boutons navigation
    themeToggle: document.querySelector("#theme-toggle"),
    themeSelectorBtn: document.querySelector("#theme-selector-btn"),
    achievementsBtn: document.querySelector("#achievements-btn"),
    historyBtn: document.querySelector("#history-btn"),
    settingsBtn: document.querySelector("#settings-btn"),

    // Modales
    resultsModal: document.querySelector("#results-modal"),
    achievementsModal: document.querySelector("#achievements-modal"),
    historyModal: document.querySelector("#history-modal"),
    settingsModal: document.querySelector("#settings-modal"),
    themeSelectorModal: document.querySelector("#theme-selector-modal")
};

// Variables d'état
let state = {
    tousLesTextes: {},
    phrases: [],
    ensembleChoisi: null,

    // État de l'exercice
    startTime: null,
    pauseTime: null,
    totalPauseTime: 0,
    exerciceEnCours: false,
    enPause: false,
    phraseActuelle: 0,
    texteComplet: '',
    totalCaracteres: 0,
    totalErreurs: 0,
    timerInterval: null,

    // Mode et config
    mode: 'normal',
    difficulty: 'moyen',

    // Mode sprint
    sprintDuration: 60,
    sprintWordCount: 0
};

// ============================================
// INITIALISATION
// ============================================

async function init() {
    await chargerTextes();
    chargerParametres();
    afficherNiveauEtXP();
    afficherStreak();
    ThemeManager.loadSaved();

    elements.textArea.disabled = true;
    setupEventListeners();
}

// Charger les textes depuis JSON
async function chargerTextes() {
    try {
        const response = await fetch('data/textes.json');
        state.tousLesTextes = await response.json();
        mettreAJourSelecteurThemes();
    } catch (error) {
        console.error("Erreur chargement textes:", error);
        // Fallback avec quelques textes de base
        state.tousLesTextes = {
            moyen: [{
                theme: "Test",
                phrases: ["Ceci est un texte de test.", "Deuxième phrase de test."]
            }]
        };
        mettreAJourSelecteurThemes();
    }
}

// Mettre à jour le sélecteur de thèmes
function mettreAJourSelecteurThemes() {
    const difficulte = elements.difficultySelect.value;
    elements.themeSelect.innerHTML = '<option value="random">Aléatoire</option>';

    if (state.tousLesTextes[difficulte]) {
        state.tousLesTextes[difficulte].forEach((ensemble, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = ensemble.theme;
            elements.themeSelect.appendChild(option);
        });
    }
}

// Charger les paramètres sauvegardés
function chargerParametres() {
    const settings = Storage.getSettings();

    // Appliquer les paramètres
    document.body.setAttribute('data-font-size', settings.fontSize);
    document.body.setAttribute('data-font-family', settings.fontFamily);

    // Charger dans les formulaires
    if (document.querySelector('#font-size-select')) {
        document.querySelector('#font-size-select').value = settings.fontSize;
        document.querySelector('#font-family-select').value = settings.fontFamily;
        document.querySelector('#sound-enabled').checked = settings.soundEnabled;
        document.querySelector('#animations-enabled').checked = settings.animationsEnabled;
        document.querySelector('#notifications-enabled').checked = settings.notifications;
    }
}

// Afficher niveau et XP
function afficherNiveauEtXP() {
    const userLevel = Storage.getUserLevel();
    elements.userLevel.textContent = userLevel.level;

    const xpPercent = (userLevel.xp / userLevel.xpToNextLevel) * 100;
    elements.xpFill.style.width = `${xpPercent}%`;
    elements.xpText.textContent = `${userLevel.xp} / ${userLevel.xpToNextLevel} XP`;
}

// Afficher streak
function afficherStreak() {
    const streaks = Storage.getStreaks();
    elements.streakCount.textContent = streaks.currentStreak;
}

// ============================================
// GESTION DES ÉVÉNEMENTS
// ============================================

function setupEventListeners() {
    // Boutons principaux
    elements.start.addEventListener('click', demarrerExercice);
    elements.pause.addEventListener('click', togglePause);
    elements.stop.addEventListener('click', arreterExercice);

    // Configuration
    elements.difficultySelect.addEventListener('change', mettreAJourSelecteurThemes);

    // Saisie
    elements.textArea.addEventListener('input', handleInput);

    // Navigation
    elements.themeToggle.addEventListener('click', toggleDarkMode);
    elements.themeSelectorBtn.addEventListener('click', () => openModal('themeSelectorModal'));
    elements.achievementsBtn.addEventListener('click', () => {
        afficherAchievements();
        openModal('achievementsModal');
    });
    elements.historyBtn.addEventListener('click', () => {
        afficherHistorique();
        openModal('historyModal');
    });
    elements.settingsBtn.addEventListener('click', () => {
        chargerParametres();
        openModal('settingsModal');
    });

    // Fermeture modales
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('show');
        });
    });

    // Clic en dehors de la modale
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    // Modale de résultats
    document.querySelector('#btn-restart')?.addEventListener('click', () => {
        closeModal('resultsModal');
        setTimeout(() => demarrerExercice(), 100);
    });

    document.querySelector('#btn-share')?.addEventListener('click', partagerResultats);

    // Historique
    document.querySelector('#btn-clear-history')?.addEventListener('click', () => {
        if (confirm('Voulez-vous vraiment effacer tout l\'historique ?')) {
            Storage.set(Storage.keys.HISTORY, []);
            afficherHistorique();
        }
    });

    // Paramètres
    document.querySelector('#font-size-select')?.addEventListener('change', (e) => {
        document.body.setAttribute('data-font-size', e.target.value);
        Storage.updateSettings({ fontSize: e.target.value });
    });

    document.querySelector('#font-family-select')?.addEventListener('change', (e) => {
        document.body.setAttribute('data-font-family', e.target.value);
        Storage.updateSettings({ fontFamily: e.target.value });
    });

    document.querySelector('#sound-enabled')?.addEventListener('change', (e) => {
        Storage.updateSettings({ soundEnabled: e.target.checked });
    });

    document.querySelector('#animations-enabled')?.addEventListener('change', (e) => {
        Storage.updateSettings({ animationsEnabled: e.target.checked });
    });

    document.querySelector('#notifications-enabled')?.addEventListener('change', (e) => {
        Storage.updateSettings({ notifications: e.target.checked });
    });

    document.querySelector('#btn-add-custom-text')?.addEventListener('click', ajouterTextePersonnalise);

    document.querySelector('#btn-reset-all')?.addEventListener('click', () => {
        if (confirm('Voulez-vous vraiment réinitialiser toutes les données ? Cette action est irréversible.')) {
            Storage.clear();
            location.reload();
        }
    });

    // Générer les thèmes
    genererSelecteurThemes();
}

// ============================================
// GESTION DE L'EXERCICE
// ============================================

function demarrerExercice() {
    state.mode = elements.modeSelect.value;
    state.difficulty = elements.difficultySelect.value;
    const themeChoisi = elements.themeSelect.value;

    // Choisir les phrases
    if (state.difficulty === 'custom') {
        const customTexts = Storage.getCustomTexts();
        if (customTexts.length === 0) {
            alert("Aucun texte personnalisé disponible. Ajoutez-en dans les paramètres !");
            return;
        }
        const randomCustom = customTexts[Math.floor(Math.random() * customTexts.length)];
        state.ensembleChoisi = randomCustom;
        state.phrases = randomCustom.phrases;
    } else {
        if (!state.tousLesTextes[state.difficulty] || state.tousLesTextes[state.difficulty].length === 0) {
            alert("Aucun texte disponible pour cette difficulté.");
            return;
        }

        if (themeChoisi === 'random') {
            const index = Math.floor(Math.random() * state.tousLesTextes[state.difficulty].length);
            state.ensembleChoisi = state.tousLesTextes[state.difficulty][index];
        } else {
            state.ensembleChoisi = state.tousLesTextes[state.difficulty][parseInt(themeChoisi)];
        }

        state.phrases = state.ensembleChoisi.phrases;
    }

    // Adapter selon le mode
    if (state.mode === 'marathon') {
        // Répéter les phrases pour avoir 50 au total
        const original = [...state.phrases];
        while (state.phrases.length < 50) {
            state.phrases.push(...original);
        }
        state.phrases = state.phrases.slice(0, 50);
    }

    // Afficher le thème
    elements.themeTexte.textContent = `Thème : ${state.ensembleChoisi.theme} (${state.mode})`;
    elements.themeAffichage.style.display = 'block';

    // UI
    elements.configPanel.style.display = 'none';
    elements.statsPanel.style.display = 'flex';
    elements.progressBarContainer.style.display = 'block';
    elements.textArea.disabled = false;

    elements.start.style.display = 'none';
    elements.pause.style.display = 'inline-block';
    elements.stop.style.display = 'inline-block';

    // État
    state.startTime = Date.now();
    state.totalPauseTime = 0;
    state.exerciceEnCours = true;
    state.enPause = false;
    state.phraseActuelle = 0;
    state.totalCaracteres = 0;
    state.totalErreurs = 0;
    state.sprintWordCount = 0;

    // Démarrer
    demarrerChronometre();
    afficherPhrase();

    // Mode sprint : timer de 60s
    if (state.mode === 'sprint') {
        setTimeout(() => {
            if (state.exerciceEnCours) {
                terminerExercice();
            }
        }, state.sprintDuration * 1000);
    }
}

function afficherPhrase() {
    if (state.phraseActuelle < state.phrases.length) {
        state.texteComplet = state.phrases[state.phraseActuelle];

        elements.textRef.innerHTML = state.texteComplet.split('').map((char, index) => {
            return `<span id="char-${index}" class="${index === 0 ? 'current' : ''}">${char}</span>`;
        }).join('');

        elements.textArea.value = '';
        elements.textArea.focus();

        elements.progress.textContent = `${state.phraseActuelle + 1}/${state.phrases.length}`;

        // Barre de progression
        const progressPercent = ((state.phraseActuelle + 1) / state.phrases.length) * 100;
        elements.progressFill.style.width = `${progressPercent}%`;
    } else {
        terminerExercice();
    }
}

function handleInput() {
    if (!state.exerciceEnCours || state.enPause) return;

    const texteSaisi = elements.textArea.value;

    // Colorier les caractères
    for (let i = 0; i < texteSaisi.length; i++) {
        const span = document.getElementById(`char-${i}`);
        if (!span) continue;

        if (texteSaisi[i] === state.texteComplet[i]) {
            span.classList.remove('incorrect', 'current');
            span.classList.add('correct');
        } else {
            span.classList.remove('correct', 'current');
            span.classList.add('incorrect');
        }
    }

    // Caractère suivant
    const prochainIndex = texteSaisi.length;
    if (prochainIndex < state.texteComplet.length) {
        const prochainSpan = document.getElementById(`char-${prochainIndex}`);
        if (prochainSpan) prochainSpan.classList.add('current');
    }

    // Réinitialiser les suivants
    for (let i = texteSaisi.length + 1; i < state.texteComplet.length; i++) {
        const span = document.getElementById(`char-${i}`);
        if (span) span.classList.remove('correct', 'incorrect', 'current');
    }

    // Stats temps réel
    mettreAJourPrecision();

    // Mode perfectionniste : arrêt sur erreur
    if (state.mode === 'perfectionniste') {
        for (let i = 0; i < texteSaisi.length; i++) {
            if (texteSaisi[i] !== state.texteComplet[i]) {
                alert("Mode Perfectionniste : Vous avez fait une erreur ! L'exercice est terminé.");
                terminerExercice();
                return;
            }
        }
    }

    // Phrase complétée
    if (texteSaisi.length === state.texteComplet.length && state.exerciceEnCours) {
        // Compter erreurs
        let erreursPhrase = 0;
        for (let i = 0; i < state.texteComplet.length; i++) {
            if (elements.textArea.value[i] !== state.texteComplet[i]) {
                erreursPhrase++;
            }
        }

        state.totalCaracteres += state.texteComplet.length;
        state.totalErreurs += erreursPhrase;

        // Mode sprint : compter les mots
        if (state.mode === 'sprint') {
            state.sprintWordCount += state.texteComplet.split(' ').length;
        }

        // Particules si animations activées
        const settings = Storage.getSettings();
        if (settings.animationsEnabled) {
            creerParticules(elements.textArea);
        }

        state.phraseActuelle++;

        setTimeout(() => {
            afficherPhrase();
        }, 300);
    }
}

function togglePause() {
    if (!state.enPause) {
        state.enPause = true;
        state.pauseTime = Date.now();
        elements.textArea.disabled = true;
        elements.pause.textContent = '▶ Reprendre';
    } else {
        state.enPause = false;
        state.totalPauseTime += Date.now() - state.pauseTime;
        elements.textArea.disabled = false;
        elements.textArea.focus();
        elements.pause.textContent = '⏸ Pause';
    }
}

function arreterExercice() {
    if (!confirm('Voulez-vous vraiment arrêter l\'exercice ?')) return;

    state.exerciceEnCours = false;
    state.enPause = false;
    clearInterval(state.timerInterval);

    resetUI();
}

function terminerExercice() {
    state.exerciceEnCours = false;
    clearInterval(state.timerInterval);

    // Calculer stats finales
    const tempsEcoule = (Date.now() - state.startTime - state.totalPauseTime) / 1000;
    const nombreMots = state.totalCaracteres / 5;
    const vitesse = Math.round((nombreMots / tempsEcoule) * 60);
    const precision = Math.round(((state.totalCaracteres - state.totalErreurs) / state.totalCaracteres) * 100);

    // Données de session
    const sessionData = {
        date: new Date().toISOString(),
        mode: state.mode,
        difficulty: state.difficulty,
        theme: state.ensembleChoisi.theme,
        time: tempsEcoule,
        wpm: vitesse,
        accuracy: precision,
        errors: state.totalErreurs,
        characters: state.totalCaracteres,
        phrasesCount: state.phraseActuelle,
        wordCount: state.sprintWordCount || Math.floor(state.totalCaracteres / 5)
    };

    // Sauvegarder
    Storage.addHistory(sessionData);
    const stats = Storage.updateStats(sessionData);
    const streaks = Storage.updateStreaks();

    // XP
    const xpEarned = Storage.calculateXP(sessionData);
    const levelResult = Storage.addXP(xpEarned);

    // Achievements
    const newAchievements = AchievementsSystem.checkAchievements(sessionData, stats, streaks);

    // Afficher modale de résultats
    afficherResultats(sessionData, xpEarned, levelResult, newAchievements);

    // Mettre à jour l'UI
    afficherNiveauEtXP();
    afficherStreak();

    resetUI();
}

function resetUI() {
    elements.textArea.disabled = true;
    elements.textArea.value = '';

    elements.configPanel.style.display = 'flex';
    elements.statsPanel.style.display = 'none';
    elements.progressBarContainer.style.display = 'none';
    elements.themeAffichage.style.display = 'none';

    elements.start.style.display = 'inline-block';
    elements.start.textContent = 'Commencer !';
    elements.pause.style.display = 'none';
    elements.pause.textContent = '⏸ Pause';
    elements.stop.style.display = 'none';

    elements.textRef.textContent = 'Cliquez sur "Commencer" pour démarrer l\'exercice !';

    elements.timer.textContent = '00:00';
    elements.progress.textContent = '0/0';
    elements.wpm.innerHTML = '0 <span class="stat-unit">mpm</span>';
    elements.accuracy.textContent = '100%';
    elements.progressFill.style.width = '0%';
}

// ============================================
// CHRONOMÈTRE ET STATS
// ============================================

function demarrerChronometre() {
    state.timerInterval = setInterval(() => {
        if (!state.enPause && state.exerciceEnCours) {
            const tempsEcoule = Math.floor((Date.now() - state.startTime - state.totalPauseTime) / 1000);
            const minutes = Math.floor(tempsEcoule / 60);
            const secondes = tempsEcoule % 60;
            elements.timer.textContent = `${String(minutes).padStart(2, '0')}:${String(secondes).padStart(2, '0')}`;

            mettreAJourWPM();
        }
    }, 100);
}

function mettreAJourWPM() {
    const tempsEcoule = (Date.now() - state.startTime - state.totalPauseTime) / 1000;
    if (tempsEcoule > 0) {
        const caracteresTotaux = state.totalCaracteres + elements.textArea.value.length;
        const nombreMots = caracteresTotaux / 5;
        const vitesse = Math.round((nombreMots / tempsEcoule) * 60);

        elements.wpm.className = 'stat-value';
        if (vitesse < 30) elements.wpm.classList.add('slow');
        else if (vitesse < 50) elements.wpm.classList.add('medium');
        else elements.wpm.classList.add('fast');

        elements.wpm.innerHTML = `${vitesse} <span class="stat-unit">mpm</span>`;
    }
}

function mettreAJourPrecision() {
    const texteSaisi = elements.textArea.value;
    let erreursCourantes = 0;

    for (let i = 0; i < texteSaisi.length; i++) {
        if (texteSaisi[i] !== state.texteComplet[i]) {
            erreursCourantes++;
        }
    }

    const caracteresTotaux = state.totalCaracteres + texteSaisi.length;
    const erreursTotales = state.totalErreurs + erreursCourantes;

    if (caracteresTotaux > 0) {
        const precision = Math.round(((caracteresTotaux - erreursTotales) / caracteresTotaux) * 100);
        elements.accuracy.textContent = `${precision}%`;
    }
}

// ============================================
// MODALES
// ============================================

function openModal(modalName) {
    elements[modalName].classList.add('show');
}

function closeModal(modalName) {
    elements[modalName].classList.remove('show');
}

function afficherResultats(sessionData, xpEarned, levelResult, newAchievements) {
    // Remplir les stats
    document.querySelector('#result-time').textContent = `${sessionData.time.toFixed(1)}s`;
    document.querySelector('#result-wpm').textContent = `${sessionData.wpm} mpm`;
    document.querySelector('#result-accuracy').textContent = `${sessionData.accuracy}%`;
    document.querySelector('#result-errors').textContent = sessionData.errors;

    // XP
    document.querySelector('#xp-amount').textContent = xpEarned;

    // Message motivant
    let message = '';
    if (sessionData.accuracy >= 95 && sessionData.wpm >= 50) {
        message = '🏆 Excellent ! Vous êtes un expert !';
    } else if (sessionData.accuracy >= 90 && sessionData.wpm >= 40) {
        message = '👍 Très bon ! Continuez comme ça !';
    } else if (sessionData.accuracy >= 80) {
        message = '💪 Bien joué ! Continuez à pratiquer !';
    } else {
        message = '📚 Bon début ! La pratique fait le maître !';
    }
    document.querySelector('#motivation-message').textContent = message;

    // Nouveaux achievements
    if (newAchievements.length > 0) {
        const achievementsList = document.querySelector('#achievements-list');
        achievementsList.innerHTML = newAchievements.map(ach => `
            <div class="achievement-item">
                <span>${ach.icon}</span>
                <strong>${ach.name}</strong>: ${ach.description}
            </div>
        `).join('');
        document.querySelector('#new-achievements').style.display = 'block';
    } else {
        document.querySelector('#new-achievements').style.display = 'none';
    }

    // Level up
    if (levelResult.levelsGained.length > 0) {
        document.querySelector('#new-level').textContent = levelResult.userLevel.level;
        document.querySelector('#level-up').style.display = 'block';
    } else {
        document.querySelector('#level-up').style.display = 'none';
    }

    openModal('resultsModal');
}

function afficherAchievements() {
    const achievements = AchievementsSystem.getAllAchievements();
    const percentage = AchievementsSystem.getCompletionPercentage();

    document.querySelector('#achievements-percentage').textContent = `${percentage}%`;

    const grid = document.querySelector('#achievements-grid');
    grid.innerHTML = achievements.map(ach => `
        <div class="achievement-card ${ach.unlocked ? 'unlocked' : ''}">
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-name">${ach.name}</div>
            <div class="achievement-description">${ach.description}</div>
            <div class="achievement-xp">+${ach.xpReward} XP</div>
        </div>
    `).join('');
}

function afficherHistorique() {
    const stats = Storage.getStats();
    const streaks = Storage.getStreaks();
    const history = Storage.getHistory(10);

    document.querySelector('#total-sessions').textContent = stats.totalSessions;
    document.querySelector('#best-wpm').textContent = stats.bestWPM;
    document.querySelector('#avg-accuracy').textContent = `${stats.averageAccuracy}%`;
    document.querySelector('#longest-streak').textContent = `${streaks.longestStreak}🔥`;

    const list = document.querySelector('#history-list');
    if (history.length === 0) {
        list.innerHTML = '<p style="text-align:center; opacity:0.7;">Aucune session enregistrée</p>';
    } else {
        list.innerHTML = history.map(session => {
            const date = new Date(session.date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
            return `
                <div class="history-item">
                    <div>
                        <div><strong>${session.theme}</strong> (${session.mode})</div>
                        <div class="history-date">${date}</div>
                    </div>
                    <div class="history-stats">
                        <span>⚡${session.wpm} mpm</span>
                        <span>🎯${session.accuracy}%</span>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function genererSelecteurThemes() {
    const grid = document.querySelector('#themes-grid');
    const currentTheme = ThemeManager.currentTheme;

    grid.innerHTML = ThemeManager.getAll().map(theme => {
        const bgStyle = theme.colors.bgPrimary.includes('gradient')
            ? `background: ${theme.colors.bgPrimary}`
            : `background-color: ${theme.colors.bgPrimary}`;

        return `
            <div class="theme-card ${theme.id === currentTheme ? 'active' : ''}"
                 style="${bgStyle}; color: ${theme.colors.textPrimary};"
                 onclick="ThemeManager.apply('${theme.id}'); genererSelecteurThemes();">
                ${theme.name}
            </div>
        `;
    }).join('');
}

function toggleDarkMode() {
    const isLight = document.body.classList.toggle('light-mode');
    Storage.updateSettings({ theme: isLight ? 'light' : 'dark' });
}

// ============================================
// TEXTES PERSONNALISÉS
// ============================================

function ajouterTextePersonnalise() {
    const theme = prompt("Nom du thème :");
    if (!theme) return;

    const phrasesText = prompt("Entrez les phrases séparées par des points-virgules (;) :");
    if (!phrasesText) return;

    const phrases = phrasesText.split(';').map(p => p.trim()).filter(p => p);
    if (phrases.length === 0) {
        alert("Aucune phrase valide !");
        return;
    }

    Storage.addCustomText({ theme, phrases });
    alert(`Texte "${theme}" ajouté avec ${phrases.length} phrases !`);
    afficherTextesPersonnalises();
}

function afficherTextesPersonnalises() {
    const customTexts = Storage.getCustomTexts();
    const list = document.querySelector('#custom-texts-list');

    if (customTexts.length === 0) {
        list.innerHTML = '<p style="opacity:0.7;">Aucun texte personnalisé</p>';
    } else {
        list.innerHTML = customTexts.map(text => `
            <div class="custom-text-item">
                <div>
                    <strong>${text.theme}</strong>
                    <div style="font-size:0.8rem;opacity:0.7;">${text.phrases.length} phrases</div>
                </div>
                <button class="btn btn-danger" style="padding:0.3rem 0.8rem;font-size:0.8rem;"
                        onclick="supprimerTextePersonnalise(${text.id})">Supprimer</button>
            </div>
        `).join('');
    }
}

function supprimerTextePersonnalise(id) {
    Storage.removeCustomText(id);
    afficherTextesPersonnalises();
}

// ============================================
// PARTAGE
// ============================================

function partagerResultats() {
    const stats = document.querySelector('#result-wpm').textContent + ' - ' +
                  document.querySelector('#result-accuracy').textContent;

    const text = `🎯 DactyloApp\n${stats}\nAméliorez votre vitesse de frappe !`;

    if (navigator.share) {
        navigator.share({
            title: 'Mes résultats DactyloApp',
            text: text
        });
    } else {
        navigator.clipboard.writeText(text);
        alert('Résultats copiés dans le presse-papiers !');
    }
}

// ============================================
// EFFETS VISUELS
// ============================================

function creerParticules(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#f093fb', '#f5576c', '#667eea', '#ffd700'];

    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${rect.left + Math.random() * rect.width}px`;
        particle.style.top = `${rect.top + Math.random() * rect.height}px`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 1000);
    }
}

// ============================================
// SERVICE WORKER (PWA)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
            registration => console.log('SW registered:', registration.scope),
            err => console.log('SW registration failed:', err)
        );
    });
}

// ============================================
// LANCEMENT
// ============================================

// Mode Zen
if (state.mode === 'zen') {
    elements.timer.style.display = 'none';
}

init();
