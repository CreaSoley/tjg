/*************************************************
 * IMPORTS
 *************************************************/

import assauts from "./assauts.json";
import techniquesDeBase from "./techniquesDeBase.js";

/*************************************************
 * CONSTANTES ROUE
 *************************************************/

const TYPES_ASSAUTS = [
  "Saisie",
  "Encerclement",
  "Étranglement",
  "Atemi",
  "Arme"
];

const COULEURS_TYPES = {
  "Saisie": "#ff595e",
  "Encerclement": "#ffca3a",
  "Étranglement": "#8ac926",
  "Atemi": "#1982c4",
  "Arme": "#6a4c93"
};

const MAX_HISTORY = 3;

/*************************************************
 * ÉTAT
 *************************************************/

let rotationActuelle = 0;
let enRotation = false;

let derniersAssauts = [];
let dernieresTechniques = [];

/*************************************************
 * DOM
 *************************************************/

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

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
 * DESSIN DE LA ROUE
 *************************************************/

const center = canvas.width / 2;
const radius = center - 10;
const angleParSegment = (2 * Math.PI) / TYPES_ASSAUTS.length;

function dessinerRoue(rotation = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  TYPES_ASSAUTS.forEach((type, i) => {
    const startAngle = rotation + i * angleParSegment;
    const endAngle = startAngle + angleParSegment;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.fillStyle = COULEURS_TYPES[type];
    ctx.fill();
    ctx.strokeStyle = "#111";
    ctx.stroke();

    // Texte
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(startAngle + angleParSegment / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#111";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(type, radius - 15, 5);
    ctx.restore();
  });
}

/*************************************************
 * ROTATION DE LA ROUE
 *************************************************/

function tournerRoue() {
  if (enRotation) return;
  enRotation = true;

  if (soundToggle.checked) {
    spinSound.currentTime = 0;
    spinSound.play();
  }

  const tours = 5;
  const angleFinal = Math.random() * 2 * Math.PI;
  const rotationTotale = tours * 2 * Math.PI + angleFinal;

  const duree = 3000;
  const debut = performance.now();

  function animer(t) {
    const progression = Math.min((t - debut) / duree, 1);
    const easing = 1 - Math.pow(1 - progression, 3);

    rotationActuelle = easing * rotationTotale;
    dessinerRoue(rotationActuelle);

    if (progression < 1) {
      requestAnimationFrame(animer);
    } else {
      enRotation = false;
      determinerResultat(rotationActuelle);
    }
  }

  requestAnimationFrame(animer);
}

/*************************************************
 * CALCUL DU SEGMENT GAGNANT
 *************************************************/

function determinerResultat(rotation) {
  const angle =
    (2 * Math.PI - (rotation % (2 * Math.PI)) + Math.PI / 2) %
    (2 * Math.PI);

  const index = Math.floor(angle / angleParSegment);
  const typeSelectionne = TYPES_ASSAUTS[index];

  const assaut = tirerAssautParType(typeSelectionne);
  const technique = tirerTechnique();

  afficherResultat(assaut, technique);
}

/*************************************************
 * TIRAGE ASSAUT
 *************************************************/

function tirerAssautParType(type) {
  let pool = assauts.filter(a => a.type_attaque === type);

  if (excludeArme.checked) {
    pool = pool.filter(a => a.type_attaque !== "Arme");
  }

  if (excludeAtemi.checked) {
    pool = pool.filter(a => a.type_attaque !== "Atemi");
  }

  pool = sansRepetition(pool, derniersAssauts, "nom");

  const assaut = randomItem(pool);
  derniersA
