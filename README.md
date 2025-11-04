# DactyloApp - Application d'entraînement de frappe

🎯 Application web complète pour améliorer votre vitesse et précision de frappe au clavier.

## ✨ Fonctionnalités

### 🎮 Modes de jeu
- **Normal** : Mode standard avec chronomètre et stats
- **Zen** : Mode sans chronomètre pour pratiquer en toute tranquillité
- **Sprint** : 60 secondes pour taper un maximum de mots
- **Perfectionniste** : Aucune erreur autorisée
- **Marathon** : 50 phrases d'affilée pour l'endurance

### 📊 Statistiques en temps réel
- Chronomètre précis
- Vitesse (mots par minute) avec code couleur
- Taux de précision en pourcentage
- Progression (phrase actuelle / total)
- Barre de progression visuelle

### 🏆 Système de progression
- **Niveaux et XP** : Gagnez de l'XP et montez de niveau
- **14 Achievements** déblocables :
  - Premier Pas, Rapide, Très Rapide, Vitesse Lumière
  - Perfection, Semaine Productive, Mois Dévoué
  - Pratiquant, Assidu, Maître
  - Marathonien, Perfectionniste, Démon de Vitesse, Dévoué
- **Streaks** : Suivez vos jours consécutifs de pratique

### 📚 Contenu varié
- **15 ensembles de textes** répartis sur 4 niveaux :
  - **Facile** : Animaux, Quotidien, Couleurs
  - **Moyen** : Programmation, Motivation, Technologie, Science
  - **Difficile** : Philosophie, Littérature, Histoire, Voyage
  - **English** : Technology, Nature
- **Textes personnalisés** : Ajoutez vos propres textes

### 🎨 Personnalisation
- **9 thèmes de couleurs** :
  - Forêt Sombre (par défaut)
  - Océan, Coucher de Soleil, Forêt Enchantée
  - Dracula, Nord, Clair, Cyberpunk, Sakura
- **Mode sombre/clair** global
- **4 polices** au choix : Courier New, Consolas, Monaco, Roboto Mono
- **3 tailles de police** : Petite, Moyenne, Grande

### 📈 Historique et analyse
- Sauvegarde des 50 dernières sessions
- Statistiques globales :
  - Total de sessions
  - Meilleur WPM et précision
  - Moyenne de WPM et précision
  - Plus long streak
- Visualisation détaillée de l'historique

### 🎭 Effets visuels
- Particules lors de la complétion de phrases
- Animations fluides
- Feedback visuel immédiat sur les erreurs/succès
- Surbrillance du caractère actuel

### 🔧 Fonctionnalités avancées
- Modale de résultats stylée (pas d'alert())
- Boutons Pause/Reprise et Arrêter
- Partage des résultats
- Export de données
- PWA (Progressive Web App) - Installable hors ligne

## 🚀 Installation

### Installation simple
1. Téléchargez tous les fichiers du projet
2. Ouvrez `index.html` dans votre navigateur
3. C'est tout ! Aucune installation requise.

### Installation PWA (optionnelle)
Pour profiter de l'application hors ligne :
1. Ouvrez l'application dans Chrome, Edge ou Safari
2. Cliquez sur l'icône d'installation dans la barre d'adresse
3. L'application sera installée comme une app native

**Note** : Pour que la PWA fonctionne, vous devez servir l'app via HTTPS ou localhost.

## 📁 Structure du projet

```
DactyloApp/
├── index.html                # Page principale
├── manifest.json            # Configuration PWA
├── sw.js                    # Service Worker
├── css/
│   └── style.css           # Styles (1042 lignes)
├── js/
│   ├── app.js              # Application principale (845 lignes)
│   ├── storage.js          # Gestion localStorage
│   ├── achievements.js     # Système d'achievements
│   └── themes.js           # Gestion des thèmes
└── data/
    └── textes.json         # Base de textes

```

## 🎯 Comment utiliser

### Démarrage rapide
1. Choisissez un **mode de jeu**
2. Sélectionnez une **difficulté**
3. Choisissez un **thème** (ou laissez "Aléatoire")
4. Cliquez sur **"Commencer !"**
5. Tapez les phrases qui s'affichent
6. Consultez vos résultats à la fin !

### Pendant l'exercice
- **Pause** : Met l'exercice en pause (le temps de pause n'est pas compté)
- **Arrêter** : Arrête l'exercice (avec confirmation)
- Les caractères deviennent **verts** si corrects, **rouges** si incorrects
- Le caractère actuel est **surligné en jaune**

### Navigation
- **🎨** : Changer le thème de couleurs
- **🏆** : Voir les achievements
- **📊** : Consulter l'historique et statistiques
- **⚙️** : Paramètres (police, taille, sons, etc.)
- **☀️/🌙** : Basculer entre mode sombre/clair

## 🎨 Thèmes de couleurs

- **Forêt Sombre** : Vert foncé, thème par défaut
- **Océan** : Bleu violet avec dégradé
- **Coucher de Soleil** : Rose et orange
- **Forêt Enchantée** : Vert émeraude
- **Dracula** : Violet sombre (inspiré du thème Dracula)
- **Nord** : Bleu grisé (inspiré du thème Nord)
- **Clair** : Thème clair pour les environnements lumineux
- **Cyberpunk** : Violet foncé avec accents néon
- **Sakura** : Rose pastel japonais

## 🏅 Liste complète des Achievements

| Icon | Nom | Description | XP |
|------|-----|-------------|-----|
| 🎯 | Premier Pas | Complétez votre premier exercice | 10 |
| ⚡ | Rapide | Atteignez 50 mots/minute | 25 |
| 🚀 | Très Rapide | Atteignez 70 mots/minute | 50 |
| ⚡ | Vitesse Lumière | Atteignez 100 mots/minute | 100 |
| 💯 | Perfection | Terminez avec 100% de précision | 50 |
| 🔥 | Semaine Productive | Pratiquez 7 jours consécutifs | 75 |
| 🏆 | Mois Dévoué | Pratiquez 30 jours consécutifs | 200 |
| 📚 | Pratiquant | Complétez 10 exercices | 30 |
| 📖 | Assidu | Complétez 50 exercices | 100 |
| 👑 | Maître | Complétez 100 exercices | 250 |
| 🏃 | Marathonien | Complétez un mode Marathon | 75 |
| ✨ | Perfectionniste | Réussissez le mode Perfectionniste | 100 |
| 👹 | Démon de Vitesse | Tapez 200 mots en mode Sprint | 50 |
| 💪 | Dévoué | Pratiquez 5 exercices en un jour | 40 |

## 📊 Système de niveaux

L'XP est gagné selon :
- **Performance de vitesse** : +10 à +50 XP selon WPM
- **Performance de précision** : +10 à +50 XP selon %
- **Difficulté** : +10 à +20 XP selon le niveau
- **Mode** : +15 à +30 XP selon le mode

### Titres de niveau
- Niveau 1-4 : **Débutant**
- Niveau 5-9 : **Apprenti**
- Niveau 10-14 : **Intermédiaire**
- Niveau 15-19 : **Avancé**
- Niveau 20-29 : **Expert**
- Niveau 30-49 : **Maître**
- Niveau 50+ : **Légende**

## ⚙️ Paramètres

### Apparence
- Taille de police (Petite / Moyenne / Grande)
- Police (Courier New / Consolas / Monaco / Roboto Mono)

### Fonctionnalités
- **Sons** : Activer/désactiver les effets sonores (à venir)
- **Animations** : Activer/désactiver les particules et animations
- **Notifications** : Notifications de rappel (à venir)

### Textes personnalisés
- Ajouter vos propres textes
- Format : Nom du thème + phrases séparées par point-virgule
- Les textes sont sauvegardés dans localStorage

### Données
- Réinitialiser toutes les données (supprime historique, achievements, etc.)

## 💾 Stockage des données

Toutes les données sont stockées dans **localStorage** :
- Historique des sessions (50 dernières)
- Achievements débloqués
- Niveau et XP
- Streaks
- Paramètres personnalisés
- Textes personnalisés
- Statistiques globales

**Note** : Les données sont stockées localement dans votre navigateur. En effaçant les données de navigation, vous perdrez votre progression.

## 🌐 Compatibilité

### Navigateurs supportés
- Chrome / Edge (recommandé)
- Firefox
- Safari
- Opera

### Fonctionnalités PWA
- ✅ Installation comme app
- ✅ Fonctionne hors ligne
- ✅ Icône sur l'écran d'accueil
- ✅ Mode plein écran

## 🎯 Conseils pour progresser

1. **Pratiquez régulièrement** : 10-15 minutes par jour suffisent
2. **Commencez avec "Facile"** : Ne vous découragez pas
3. **Visez la précision avant la vitesse** : 95%+ de précision
4. **Utilisez le mode Zen** : Pour apprendre sans stress
5. **Essayez le mode Perfectionniste** : Pour la concentration
6. **Maintenez votre streak** : Pratiquez quotidiennement

## 🔧 Développement

### Technologies utilisées
- **HTML5** : Structure
- **CSS3** : Styles avec variables CSS pour les thèmes
- **Vanilla JavaScript** : Logique (pas de framework)
- **LocalStorage API** : Sauvegarde des données
- **Service Worker API** : PWA et cache hors ligne
- **Web Share API** : Partage des résultats

### Ajout de nouveaux textes
Éditez `data/textes.json` :

```json
{
  "moyen": [
    {
      "theme": "Nouveau Thème",
      "langue": "fr",
      "phrases": [
        "Première phrase ici.",
        "Deuxième phrase ici.",
        ...
      ]
    }
  ]
}
```

### Ajout de nouveaux thèmes
Éditez `js/themes.js` :

```javascript
nouveauTheme: {
  name: 'Mon Thème',
  id: 'montheme',
  colors: {
    bgPrimary: '#color',
    textPrimary: '#color',
    // ...
  }
}
```

## 📝 Changelog

### Version 2.0 (Actuelle)
- ✨ TOUTES les fonctionnalités implémentées
- 5 modes de jeu
- 9 thèmes de couleurs
- 14 achievements
- Système de niveaux et XP
- Historique et statistiques
- Textes personnalisés
- PWA complète
- Interface entièrement refaite

## 📄 Licence

Ce projet est libre d'utilisation à des fins personnelles et éducatives.

---

**🎯 Bon entraînement et amusez-vous bien !**
