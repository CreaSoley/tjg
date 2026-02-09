/*************************************************
 * DONNÉES
 *************************************************/

// Assauts (ton JSON, inchangé)
import assauts from "./assauts.json";
import techniquesDeBase from "./techniquesDeBase.js";

/*************************************************
 * ÉTAT
 *************************************************/

let derniersAssauts = [];
let dernieresTechniques = [];

const MAX_HISTORY = 3;

/*************************************************
 * DOM
 *************************************************/

const spinBtn = document.getElementById("spinBtn");
const resultText = document.getElementById("resultText");

const soundToggle = document.getElementById("soundToggle");
const speechToggle = document.getElementById("speechToggle");
const excludeArme = document.getElementById("excludeArme");
const excludeAtemi = document.getElementById("excludeAtemi");

const spinSound = document.getElementById("spinSound");

/*************************************************
 * UTILITAIRES
 *************************************************/

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function sansRepetition(liste, historique, cle) {
  return liste.filter(item =>
    !historique.slice(-MAX_HISTORY).some(h => h[cle] === item[cle])
  );
}

/*************************************************
 * TIRAGE ASSAUT
 *************************************************/

function tirerAssaut() {
  let pool = [...assauts];

  if (excludeArme.checked) {
    pool = pool.filter(a => a.type_attaque !== "Arme");
  }

  if (excludeAtemi.checked) {
    pool = pool.filter(a => a.type_attaque !== "Atemi");
  }

  pool = sansRepetition(pool, derniersAssauts, "nom");

  const assaut = randomItem(pool);

  derniersAssauts.push(assaut);
  return assaut;
}

/*************************************************
 * TIRAGE TECHNIQUE
 *************************************************/

function tirerTechnique() {
  let pool = sansRepetition(
    techniquesDeBase,
    dernieresTechniques,
    "nom"
  );

  const technique = randomItem(pool);

  dernieresTechniques.push(technique);
  return technique;
}

/*************************************************
 * SYNTHÈSE VOCALE
 *************************************************/

function parler(texte) {
  if (!speechToggle.checked) return;

  speechSynthesis.cancel();

  const voix = new SpeechSynthesisUtterance(texte);
  voix.lang = "fr-FR";
  voix.rate = 0.95;
  voix.pitch = 1;

  speechSynthesis.speak(voix);
}

/*************************************************
 * AFFICHAGE
 *************************************************/

function afficherResultat(assaut, technique) {
  const texteAffiche = `
${assaut.type_attaque} – ${assaut.nom}
→ Technique n°${technique.technique} par ${technique.type}
${technique.nom}
  `;

  resultText.innerText = texteAffiche;

  const texteVoix = `
${assaut.type_attaque} ${assaut.nom}.
Technique numéro ${technique.technique}, par ${technique.type}.
${technique.nom}.
  `;

  parler(texteVoix);
}

/*************************************************
 * ACTION PRINCIPALE
 *************************************************/

function lancerRoue() {
  if (soundToggle.checked) {
    spinSound.currentTime = 0;
    spinSound.play();
  }

  // délai pour laisser la roue tourner
  setTimeout(() => {
    const assaut = tirerAssaut();
    const technique = tirerTechnique();
    afficherResultat(assaut, technique);
  }, 2500);
}

/*************************************************
 * ÉVÉNEMENTS
 *************************************************/

spinBtn.addEventListener("click", lancerRoue);
