const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const soundBtn = document.getElementById("soundBtn");
const voiceBtn = document.getElementById("voiceBtn");
const resultBox = document.getElementById("result");
const spinSound = document.getElementById("spinSound");

let assauts = [];
let soundOn = true;
let voiceOn = true;
let history = [];

const techniques = {
  1: { Atemi: "Uraken uchi", Clé: "Kote gaeshi", Projection: "O soto gari" },
  2: { Atemi: "Mae hiza geri", Clé: "Waki gatame", Projection: "Taï otoshi" },
  3: { Atemi: "Yoko empi", Clé: "Juji ude gatame", Projection: "Ippon seoi nage" },
  4: { Atemi: "Chudan mae geri", Clé: "Yuki shigae", Projection: "Waki otoshi" },
  5: { Atemi: "Jodan shuto uchi", Clé: "Hiji dori ura", Projection: "Uki waza" },
  6: { Atemi: "Chudan mawashi geri", Clé: "Shiho nage", Projection: "Haraï goshi" },
  7: { Atemi: "Chudan kizami tsuki", Clé: "Tembin", Projection: "Ushiro goshi" },
  8: { Atemi: "Yoko fumikomi", Clé: "Hashi mawashi", Projection: "Kata hizaguruma" }
};
const phonetics = {
  "Uraken uchi": "ourakèn outchi",
  "Kote gaeshi": "koté gaé chi",
  "O soto gari": "o soto gari",
  "Mae hiza geri": "maé hiza guéri",
  "Waki gatame": "waki gata-mé",
  "Taï otoshi": "taï otochi",
  "Yoko empi": "yoko ènpi",
  "Juji ude gatame": "djoudji oudé gatamé",
  "Ippon seoi nage": "ippon séoï nagué",
  "Chudan mae geri": "tchoudane maé guéri",
  "Yuki shigae": "youki chiga-é",
  "Waki otoshi": "waki otochi",
  "Jodan shuto uchi": "djodane chouto outchi",
  "Hiji dori ura": "hiji dori oura",
  "Uki waza": "ouki waza",
  "Chudan mawashi geri": "tchoudane mawachi guéri",
  "Shiho nage": "chiho nagué",
  "Haraï goshi": "haraï gochi",
  "Chudan kizami tsuki": "tchoudane kizami tsouki",
  "Tembin": "tèm bine",
  "Ushiro goshi": "ouchiro gochi",
  "Yoko fumikomi": "yoko foumi komi",
  "Hashi mawashi": "hachi mawachi",
  "Kata hizaguruma": "kata hiza-gourou ma"
};

fetch("assauts.json")
  .then(r => r.json())
  .then(data => {
    assauts = data;
    drawWheel();
  });

function drawWheel() {
  const colors = ["#ff2a2a","#ffb703","#00f5d4","#8338ec","#ff006e","#3a86ff","#80ed99","#ffd166"];
  const slice = (Math.PI * 2) / 8;

  // Dessin du canvas
  ctx.clearRect(0, 0, wheel.width, wheel.height);

  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(160, 160);
    ctx.arc(160, 160, 160, i * slice, (i + 1) * slice);
    ctx.fillStyle = colors[i];
    ctx.fill();

    // Numéro du segment
    ctx.save();
    ctx.translate(160, 160);
    ctx.rotate(i * slice + slice / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "bold 28px Fredoka";
    ctx.fillText(i + 1, 140, 10);
    ctx.restore();
  }
}

function getFilters() {
  return [...document.querySelectorAll(".filters input:checked")].map(c => c.value);
}

function spin() {
  if (!assauts.length) return;

  // Tirage assaut
  const assautObj = assauts[Math.floor(Math.random() * assauts.length)];
  const assaut = assautObj.label || assautObj.nom || assautObj.name || assautObj;

  // Tirage technique de base
  const num = Math.ceil(Math.random() * 8);
  const types = ["Atemi","Clé","Projection"];
  const type = types[Math.floor(Math.random() * 3)];
  const tech = techniques[num][type];
  const phoneticTech = phonetics[tech] || tech;

  // Affichage assaut en "masqué" pour animation
  resultBox.innerHTML = `
    <div id="assautReveal" class="assaut-reveal">Assaut : ${assaut}</div>
    <div id="techReveal" class="tech-reveal" style="opacity:0;transition:opacity 1s;"></div>
  `;

  // Préparation son
  spinSound.currentTime = 0;
  if (soundOn) spinSound.play();

  // Calcul rotation
  const segmentAngle = 360 / 8;
  const pointerAngle = 270; // 12h
  const targetAngle = 360 * 6 + pointerAngle - (num - 0.5) * segmentAngle;

  // Reset rotation
  wheel.style.transition = "none";
  wheel.style.transform = "rotate(0deg)";
  wheel.offsetHeight; // force reflow

  // Lancer rotation
  wheel.style.transition = "transform 6s cubic-bezier(0.1, 0.9, 0.2, 1)";
  wheel.style.transform = `rotate(${targetAngle}deg)`;

  // Après fin rotation (durée du son = 6s)
// Après fin rotation
setTimeout(() => {
  const reveal = document.getElementById("assautReveal");
  reveal.classList.add("open");

  // Préparer texte à lire
  const sequence = [
    `Assaut : ${assaut}`,
    `Technique de base ${num} par ${type} : ${phoneticTech}`
  ];

  // Affichage technique après une pause
  setTimeout(() => {
    const techReveal = document.getElementById("techReveal");
    techReveal.innerHTML = `
      <hr>
      <strong>Technique de base ${num}</strong><br>
      ➜ ${type}<br>
      ${tech}
    `;
    techReveal.style.opacity = 1;
  }, 1000);

  // Lecture vocale complète en séquence
  if (voiceOn) speakSequence(sequence, 800);

  // Historique
  history.push({ assaut, num, type, tech });

}, 6000);

function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "fr-FR";
  u.rate = 0.95;
  u.pitch = 1.05;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
function speakSequence(texts, delay = 0) {
  if (!voiceOn) return;

  let i = 0;

  function next() {
    if (i >= texts.length) return;

    const u = new SpeechSynthesisUtterance(texts[i]);
    u.lang = "fr-FR";
    u.rate = 0.95;
    u.pitch = 1.05;

    u.onend = () => {
      setTimeout(next, delay);
    };

    speechSynthesis.speak(u);
    i++;
  }

  speechSynthesis.cancel();
  next();
}

spinBtn.addEventListener("click", spin);

soundBtn.onclick = () => {
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? "🔊 Son" : "🔇 Son";
};

voiceBtn.onclick = () => {
  voiceOn = !voiceOn;
  voiceBtn.textContent = voiceOn ? "🗣️ Voix" : "🤐 Voix";
};
