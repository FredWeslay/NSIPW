let lastStep = localStorage.getItem("lastStep") || 0;
const introText = document.getElementById("intro-text");
const corruptedText = document.getElementById("corrupted-text");
const audio = document.getElementById("distorted-voice");
//barre d'outil
var lastSource = " " 
const returnButton = document.getElementById("return-button")
//Step_1
const badButton = document.getElementById('badButton');
const goodButton = document.getElementById('goodButton');


function init(){
    if (lastStep !== 0) {
        document.getElementById("GameE0").classList.add("hidden")
        suivant(lastStep);
        return;
    }else{
        messageintro()
    }
    
}

function messageintro(){
    let messages = [
        "Booting system...",
        "Loading security protocols...",
        "ERROR: Critical failure detected.",
        "Rebooting in emergency mode...",
        "System Rebooting Success...",
        "Emergency mode Activated...",
        "Please, tape the code to enter..."
    ];

    let index = 0;
    function showMessages() {
        if (index < messages.length) {
            introText.textContent = messages[index];
            index++;
            if (index === 2){
                corruptedText.classList.remove("hidden"); // Affiche le code glitché
                setTimeout(() => {
                    corruptedText.classList.add("hidden");
                }, 5000);
            }
            setTimeout(showMessages, 1500);
        }else {
            showPopup("Merci de nous excusez, nous avons eu un problème, cependant c'est réglé vous pouvez continuer votre visite")
            document.getElementById("ErrorRep").textContent = "Bienvenue dans votre espace"
        }
    }
    showMessages();
}

function checkCode() {
    let input = document.getElementById("code-input").value;
    if (input === "7X42") {
        showPopup("Accès autorisé. Ouverture du terminal...");
        setTimeout(() => {
            suivant(1);// On passe à l'énigme 1
        }, 2000);
    } else {
        showPopup("Code incorrect. Veuillez réessayer.");
    }
}

function showPopup(message) {
    if (document.getElementById("popup-message")){
        document.getElementById("popup-message").textContent = message;
        document.getElementById("popup").classList.remove("hidden");
        setTimeout(() => {
            closePopup()
        }, 5000);
    }else{
        window.parent.document.getElementById("popup-message").textContent = message;
        window.parent.document.getElementById("popup").classList.remove("hidden");
        setTimeout(() => {
            closePopup()
        }, 5000);
    }
}

function closePopup() {
    if (document.getElementById("popup")){
        document.getElementById("popup").classList.add("hidden");
    }else{
        window.parent.document.getElementById("popup").classList.add("hidden");
    }
}

function OpenIfram(src){
    if (document.getElementById("iframe")){
        document.getElementById("iframe").classList.remove("hidden");
        document.getElementById("game-iframe").src = src;
    }else{
        window.parent.document.getElementById("iframe").classList.remove("hidden");
        window.parent.document.getElementById("game-iframe").src = src;
    }
}

function CloseIfram(){
    if(document.getElementById("iframe")){
        document.getElementById("iframe").classList.add("hidden");
        document.getElementById("game-iframe").src = "";
    }else {
        window.parent.document.getElementById("iframe").classList.add("hidden");
        window.parent.document.getElementById("game-iframe").src = "";
    }
}

function suivant(what){
    localStorage.setItem("lastStep", Number(what))
    lastStep = localStorage.getItem("lastStep")
    affichage(what)
}

function affichage(nb){
    CloseIfram()
    OpenIfram("Step_" + Number(nb) + ".html")
}

//Script pour la barre d'outil et les outils : 
function openTool(toolPage) {
    lastSource = window.parent.document.getElementById("game-iframe").src
    CloseIfram()
    OpenIfram(toolPage)
    returnButton.classList.remove("hidden")
}

function closeTool() {
    CloseIfram()
    OpenIfram(lastSource)
    returnButton.classList.add("hidden")
}

let currentPartIndex = 0;

function decodeBase64() {
    let input = document.getElementById("inputText").value;
    showNextMessage(atob(input)); // Décoder le message et l'afficher
}

function showNextMessage(inputt) {
    const messageParts = inputt.split("////");

    if (currentPartIndex < messageParts.length) {
        // Ajouter la nouvelle partie du message au container
        const messagesDecod = document.getElementById("messagesDecod");
        messagesDecod.innerHTML += `<p>${messageParts[currentPartIndex]}</p>`;
        
        // Avancer à la prochaine partie
        currentPartIndex++;

        // Définir le délai d'affichage en fonction de la partie
        let delay = (currentPartIndex === 4) ? 20000 : 7000; // 20s pour la 4ème partie, 7s pour les autres
        
        // Utiliser setTimeout correctement en passant la fonction, pas son résultat
        setTimeout(() => showNextMessage(inputt), delay);
    }
}


function decodeROT13() {
    let input = document.getElementById("inputText").value;
    let output = input.replace(/[A-Za-z]/g, function(c) {
        return String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() < 'n' ? 13 : -13));
    });
    document.getElementById("outputText").textContent = output;
}

//hashing : 
function generateMD5() {
    let input = document.getElementById("hashInput").value;
    let hash = CryptoJS.MD5(input);
    document.getElementById("hashOutput").textContent = hash;
}

// Fréquence : 
function analyzeFrequency() {
    if (document.getElementById("freqInput").value === "BASE-789"){
        CloseIfram()
        suivant(Number(lastStep) + 1)
    }else{
        let text = document.getElementById("freqInput").value.toLowerCase();
        let freq = {};
        
        for (let char of text) {
            if (char.match(/[a-z]/)) {
                freq[char] = (freq[char] || 0) + 1;
            }
        }
        
        let sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
        document.getElementById("freqOutput").textContent = JSON.stringify(sorted);
    }
}

// Script énigme 1
function VerifCommand(Command) {
    if (Command === "good"){
        showPopup('Félicitations, vous avez validé l’accès !');
        suivant(Number(lastStep) + 1)
        closePopup()
    }else {
        // Afficher l'écran bleu
        document.getElementById('blueScreen').style.display = 'flex';
        setTimeout(() => localStorage.clear(), 5000)
    }    
}

// Script enigme 3
function verificationStep3() {
    if (localStorage.getItem("foundPieces")) {
        // Charger les pièces trouvées
        let foundPieces = JSON.parse(localStorage.getItem("foundPieces"));
        loadFoundPieces(foundPieces);
    } else {
        let clicked = false;
        document.getElementById("codeSection").addEventListener("click", function () {
            clicked = true;
            scatterCodePieces();
        });

        setTimeout(function () {
            if (!clicked) {
                console.log("30 secondes");
            }
        }, 30000);
    }
}

// Fonction pour éparpiller les pièces du code
const code = "B 3 U X G 0 5 5 E ! !".split(" "); // Découper le code
function scatterCodePieces() {
    const piecesPlace = document.getElementById("piecesPlace");
    let foundPieces = JSON.parse(localStorage.getItem("foundPieces")) || []; // Charger les pièces trouvées
    let discoverLetter = document.getElementById("discoverLetter");

    discoverLetter.innerHTML = ""; // Réinitialiser l'affichage des lettres trouvées

    // Afficher les lettres déjà trouvées
    foundPieces.forEach(index => {
        if (index < code.length) {
            let piece = code[index];
            let letterSpan = document.createElement("span");
            letterSpan.textContent = piece;
            letterSpan.classList.add("found-letter");
            discoverLetter.appendChild(letterSpan);
        }
    });

    // Afficher les pièces restantes
    let index = 0;
    code.forEach((piece, i) => {
        if (!foundPieces.includes(i)) { // Si la pièce n'est pas déjà trouvée
            let pieceDiv = document.createElement("p");
            pieceDiv.classList.add("piece");
            pieceDiv.style.top = `${Math.random() * 350}px`;
            pieceDiv.style.left = `${Math.random() * 750}px`;
            pieceDiv.style.background = "white";
            pieceDiv.style.color = "red";
            pieceDiv.style.fontSize = "20px";
            pieceDiv.id = i;
            pieceDiv.textContent = piece;

            pieceDiv.addEventListener("click", function () {
                saveFoundPiece(i);
                location.reload(); // Recharger la page pour mettre à jour l'affichage
            });

            piecesPlace.appendChild(pieceDiv);
        }
        index++;
    });

    // Ajouter la fausse pièce
    let fakePiece = document.createElement("div");
    fakePiece.classList.add("piece", "fake-piece");
    fakePiece.style.top = `${Math.random() * 350}px`;
    fakePiece.style.left = `${Math.random() * 750}px`;
    fakePiece.textContent = "?";
    fakePiece.addEventListener("mouseover", function () {
        fakePiece.style.top = `${Math.random() * 350}px`;
        fakePiece.style.left = `${Math.random() * 750}px`;
    });
    fakePiece.style.background = "white";
    fakePiece.style.color = "red";
    fakePiece.style.fontSize = "20px";
    piecesPlace.appendChild(fakePiece);

    createShapes();
}

// Charger les pièces retrouvées
function loadFoundPieces(foundPieces) {
    scatterCodePieces(); // Appel à scatterCodePieces pour afficher les pièces
}

// Enregistrer une pièce trouvée
function saveFoundPiece(pieceIndex) {
    let foundPieces = JSON.parse(localStorage.getItem("foundPieces")) || [];
    if (!foundPieces.includes(pieceIndex)) {
        foundPieces.push(pieceIndex);
        foundPieces.sort((a, b) => a - b); // Trier dans l'ordre des index
        localStorage.setItem("foundPieces", JSON.stringify(foundPieces));
    }

    // Vérifier si toutes les pièces ont été trouvées
    if (foundPieces.length === code.length) {
        console.log("Toutes les pièces ont été trouvées !");
        showPopup("Vous avez trouvé toutes les pièces du code et reconstitué la clé magnétique ! Vous pouvez accéder à la suite.");
        suivant(Number(lastStep) + 1);
        CloseIfram();
        setTimeout(closePopup(),3000)
    }
}

// Fonction pour créer des formes aléatoires
function createShapes() {
    const puzzleBox = document.getElementById("puzzleBox");

    for (let i = 0; i < 15; i++) {
        let shape = document.createElement("div");
        shape.classList.add("forme");

        let size = Math.random() * 100 + 50;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.top = `${Math.random() * 300}px`;
        shape.style.left = `${Math.random() * 700}px`;
        shape.style.background = "blue";
        shape.style.zIndex = 1;

        if (Math.random() > 0.5) {
            shape.style.borderRadius = "50%";
        }

        makeMoveable(shape);
        puzzleBox.appendChild(shape);
    }
    puzzleBox.style.display = "block";
}

// Fonction pour rendre un élément déplaçable
function makeMoveable(element) {
    let offsetX, offsetY, isDragging = false;

    element.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        element.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        element.style.cursor = "grab";
    });
}

//Script enigme 4
const keyboardMapping = {
    'A': 'B',
    'B': 'C',
    'C': 'D',
    'D': 'E',
    'E': 'F',
    'F': 'G',
    'G': 'H',
    'H': 'I',
    'I': 'J',
    'J': 'K',
    'K': 'L',
    'L': 'M',
    'M': 'N',
    'N': 'O',
    'O': 'P',
    'P': 'Q',
    'Q': 'R',
    'R': 'S',
    'S': 'T',
    'T': 'U',
    'U': 'V',
    'V': 'W',
    'W': 'X',
    'X': 'Y',
    'Y': 'Z',
    'Z': 'A', // Retour à A après Z
};

// Fonction pour transformer uniquement le dernier caractère de l'input
function transformInput(event) {
    let input = event.target.value.toUpperCase(); // Récupérer l'input et le mettre en majuscule
    let transformedInput = input.slice(0, -1); // Garder tous les caractères sauf le dernier
    let lastChar = input[input.length - 1]; // Dernier caractère

    if (/[A-Z]/.test(lastChar)) {
        // Appliquer le mappage uniquement si le caractère est une lettre
        lastChar = keyboardMapping[lastChar] || lastChar;
    }

    // Ajouter le dernier caractère transformé à la fin
    transformedInput += lastChar;

    // Mettre la valeur modifiée dans le champ de texte
    event.target.value = transformedInput;
}

// Fonction pour vérifier si la solution est correcte
function checkSolution() {
    const userInput = document.getElementById("user-input").value.toUpperCase();

    if (userInput === "HELLO WORD") {
        suivant(Number(lastStep) + 1)
        showPopup("Bravo! Vous avez déchiffré le code.");
        location.reload()
    } else {
        showPopup("Désolé, essayez encore!");
        setTimeout(() => location.reload(), 3000)
    }
}

// Fonction de décodage basée sur le mappage
function decodeMessage(message) {
    let decoded = "";
    for (let i = 0; i < message.length; i++) {
        const char = message[i].toUpperCase();
        decoded += getDecodedChar(char);
    }
    return decoded;
}

// Obtenir la lettre déchiffrée en fonction du mappage A → B, B → C, etc.
function getDecodedChar(char) {
    if (keyboardMapping[char]) {
        return keyboardMapping[char];
    }
    return char;
}

// Script enigme 5 
// Fonction pour valider le questionnaire
function validateQuiz() {
    let q1 = document.querySelector('input[name="q1"]:checked');
    let q2 = document.querySelector('input[name="q2"]:checked');
    let q3 = document.querySelector('input[name="q3"]:checked');
    let q4 = document.querySelector('input[name="q4"]:checked');

    if (q1 && q2 && q3 && q4) {
        let foundDate = `19${q3.value}-${q2.value}-0${q1.value}`;
        showPopup(`Tu as trouvé la date : ${foundDate}. Essaie-la dans le champ ci-dessous.`);
    } else {
        showPopup("Réponds à toutes les questions !");
    }
}

// Fonction pour vérifier si la date est correcte
function checkDate() {
    let dateInput = document.getElementById("date-input").value;
    if (dateInput === "1988-11-02") {
        showPopup("Bravo ! C'est la bonne date ! 🏆\nLe 2 novembre 1988, le ver Morris a marqué l'histoire du hacking.");
        suivant(Number(lastStep) + 1);
    } else {
        showPopup("Mauvaise date, réessaye !");
    }
}

// Fin de l'énigme : const output = document.getElementById("output");
const gameOverScreen = document.getElementById("game-over-screen");
const gameOverMessage = document.getElementById("game-over-message");
const correctCode = "6789";

// Messages avant l'entrée du code
const messages = [
    "SYSTEM ERROR - Rebooting...",
    "Verifying system integrity...",
    "Warning: Data corruption detected.",
    "Attempting recovery...",
    "System restored. Running diagnostics...",
    "Connecting to external terminal...",
    "Unauthorized access detected. Logging...",
    "== INCOMING MESSAGE ==",
    "Salut, je suis revenu, j'ai réussi à hacker le système, mais j'ai pas beaucoup de temps...",
    "Le code c'est.....",
    "ERROR: Communication lost.",
    "6789",
    "Mais fais gaffe, je crois qu'ils t'ont trouvé !",
    "== CONNECTION TERMINATED =="
];

let index = 0;

function displayNextMessage() {
    if (index < messages.length) {
        output.innerHTML += messages[index] + "\n";
        index++;
        let delay = Math.random() * 1000 + 500;
        setTimeout(displayNextMessage, delay);
    }
}

setTimeout(displayNextMessage, 1500);

// Vérifier si le code est correct
function checkCode() {
    let userInput = document.getElementById("code-input").value;
    if (userInput === correctCode) {
        triggerGameOver();
    }
}

// Passer en mode écran bleu et afficher le message final
function triggerGameOver() {
    document.body.requestFullscreen(); // Met en plein écran
    gameOverScreen.style.display = "flex";
    
    let finalMessage = "Aha, on t'a retrouvé toi et ta petite amie...\n";
    finalMessage += "Vous avez été pris la main dans le sac...\n";
    finalMessage += "Dommage, elle avait trouvé le bon code...\n";
    finalMessage += "Mais trop tard, tu es capturé maintenant...\n";
    finalMessage += "Et tu ne sortiras pas.";

    let charIndex = 0;
    
    typeMessage();
    function typeMessage() {
        if (charIndex < finalMessage.length) {
            gameOverMessage.innerHTML += finalMessage[charIndex];
            charIndex++;
            setTimeout(typeMessage, 50);
        }
    }
}
