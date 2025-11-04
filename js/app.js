const btnCommencer = document.querySelector("#btn-commencer");
const btnReinitialiser = document.querySelector("#btn-reinitialiser");
const textRef = document.querySelector("#texte-reference > p");
const textArea = document.querySelector("#input-utilisateur");
const tempsEcouleSpan = document.querySelector("#temps-ecoule");

const texteComplet = textRef.textContent.trim();

// Variables pour le chronomètre
let startTime = null;
let timerInterval = null;
let isStarted = false;

// Désactiver le textarea au départ
textArea.disabled = true;

textRef.innerHTML = texteComplet.split('').map((char, index) => {
    return `<span id="char-${index}">${char}</span>`;
}).join('');

// Fonction pour démarrer le chronomètre
function demarrerChronometre() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const tempsEcoule = Math.floor((Date.now() - startTime) / 1000);
        tempsEcouleSpan.textContent = tempsEcoule;
    }, 1000);
}

// Fonction pour arrêter le chronomètre
function arreterChronometre() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Fonction pour réinitialiser l'application
function reinitialiser() {
    // Arrêter le chronomètre
    arreterChronometre();

    // Réinitialiser les variables
    startTime = null;
    isStarted = false;
    tempsEcouleSpan.textContent = '0';

    // Vider le textarea et le désactiver
    textArea.value = '';
    textArea.disabled = true;

    // Réinitialiser les styles des caractères
    for (let i = 0; i < texteComplet.length; i++) {
        const span = document.getElementById(`char-${i}`);
        span.classList.remove('correct', 'incorrect');
    }

    // Afficher le bouton "Commencer" et masquer "Réinitialiser"
    btnCommencer.style.display = 'inline-block';
    btnReinitialiser.style.display = 'none';
}

// Événement pour le bouton "Commencer"
btnCommencer.addEventListener('click', function() {
    if (!isStarted) {
        isStarted = true;
        textArea.disabled = false;
        textArea.focus();
        demarrerChronometre();

        // Masquer le bouton "Commencer" et afficher "Réinitialiser"
        btnCommencer.style.display = 'none';
        btnReinitialiser.style.display = 'inline-block';
    }
});

// Événement pour le bouton "Réinitialiser"
btnReinitialiser.addEventListener('click', reinitialiser);

textArea.addEventListener('input', function() {
    const texteSaisi = textArea.value;
    
    // Parcourir chaque caractère du texte saisi
    for (let i = 0; i < texteSaisi.length; i++) {
        const span = document.getElementById(`char-${i}`); // Récupère le span du caractère
        
        if (texteSaisi[i] === texteComplet[i]) {
            // Caractère correct
            span.classList.remove('incorrect');
            span.classList.add('correct');
        } else {
            // Caractère incorrect
            span.classList.remove('correct');
            span.classList.add('incorrect');
        }
    }
    
    // Réinitialiser les caractères pas encore tapés
    for (let i = texteSaisi.length; i < texteComplet.length; i++) {
        const span = document.getElementById(`char-${i}`);
        span.classList.remove('correct', 'incorrect');
    }
});