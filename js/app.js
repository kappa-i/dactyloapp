const start = document.querySelector("#btn-commencer");
const textRef = document.querySelector("#texte-reference > p");
const textArea = document.querySelector("#input-utilisateur");

const texteComplet = textRef.textContent.trim();

textRef.innerHTML = texteComplet.split('').map((char, index) => {
    return `<span id="char-${index}">${char}</span>`;
}).join('');


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