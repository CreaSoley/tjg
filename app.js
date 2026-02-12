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
}
// Charge les assauts
fetch("assauts.json")
  .then(r => r.json())
  .then(data => {
    assauts = data;
    drawWheel(); // roue visible dès le départ
  });

// Dessine la roue
const wheelSegments = [
  { label: "Atemi", emoji: "🥊" },
  { label: "Étranglement", emoji: "🫱" },
  { label: "Encerclement", emoji: "🔒" },
  { label: "Saisie", emoji: "✊" },
  { label: "Atemi", emoji: "🥊" },
  { label: "Étranglement", emoji: "🫱" },
  { label: "Encerclement", emoji: "🔒" },
  { label: "Saisie", emoji: "✊" }
];

function drawWheel() {
  const colors = ["#ff2a2a","#ffb703","#00f5d4","#8338ec","#ff006e","#3a86ff","#80ed99","#ffd166"];
  const slice = (2 * Math.PI) / 8;

  ctx.clearRect(0, 0, 320, 320);

  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(160, 160);
    ctx.arc(160, 160, 160, i * slice, (i + 1) * slice);
    ctx.fillStyle = colors[i];
    ctx.fill();

    ctx.save();
    ctx.translate(160, 160);
    ctx.rotate(i * slice + slice / 2);
    ctx.textAlign = "right";

    // Texte catégorie
    ctx.font = "bold 14px Fredoka";
    ctx.fillStyle = "#000";
    ctx.fillText(wheelSegments[i].label, 145, -6);

    // Emoji avec contour blanc pour lisibilité
    ctx.font = "22px serif";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fff";
    ctx.strokeText(wheelSegments[i].emoji, 135, 18);
    ctx.fillStyle = "#000";
    ctx.fillText(wheelSegments[i].emoji, 135, 18);

    ctx.restore();
  }
}

// Récupère filtres actifs
function getFilters() {
  return [...document.querySelectorAll(".filters input:checked")].map(c => c.value);
}

// Lancer la roue
function spin() {
  if (!assauts.length) return;

  const num = Math.ceil(Math.random() * 8);
  const category = wheelSegments[num - 1].label;
  const emoji = wheelSegments[num - 1].emoji;

  const filteredAssauts = assauts.filter(a =>
    a.categories.includes(category)
  );

  if (!filteredAssauts.length) {
    resultBox.innerHTML = "❌ Aucun assaut pour cette catégorie";
    return;
  }

  const assautObj = filteredAssauts[Math.floor(Math.random() * filteredAssauts.length)];
  const assaut = assautObj.nom;

  const types = ["Atemi", "Clé", "Projection"];
  const type = types[Math.floor(Math.random() * 3)];
  const tech = techniques[num][type];
  const phoneticTech = phonetics[tech] || tech;

  resultBox.innerHTML = `
    <div id="assautReveal" class="assaut-reveal">
      ${emoji} ${category}
      <hr>
      ${assaut}
    </div>
    <div id="techReveal" class="tech-reveal" style="opacity:0;"></div>
  `;

  const segmentAngle = 360 / 8;
  const pointerAngle = 270;
  const targetAngle = 360 * 6 + pointerAngle - (num - 0.5) * segmentAngle;

  wheel.style.transition = "none";
  wheel.style.transform = "rotate(0deg)";
  wheel.offsetHeight;

  wheel.style.transition = "transform 6s cubic-bezier(0.1, 0.9, 0.2, 1)";
  wheel.style.transform = `rotate(${targetAngle}deg)`;

  if (soundOn) {
    spinSound.currentTime = 0;
    spinSound.play();
  }

  setTimeout(() => {
    document.getElementById("assautReveal").classList.add("open");

    setTimeout(() => {
      const techReveal = document.getElementById("techReveal");
      techReveal.innerHTML = `
        <strong>${type} n°${num}</strong><br>
        ${tech}
      `;
      techReveal.style.opacity = 1;
    }, 1400);

    if (voiceOn) {
     speakSequence([
  assaut,
  `Technique de base numéro ${num} par ${type} : ${phoneticTech}`
], 1600);

    }

  }, 6000);
}

// Voix
function speakSequence(texts, delay = 1500) {
  if (!voiceOn) return;

  let i = 0;
  speechSynthesis.cancel();

  function next() {
    if (i >= texts.length) return;

    const u = new SpeechSynthesisUtterance(texts[i]);
    u.lang = "fr-FR";
    u.rate = 0.8;      // 🔥 plus lent
    u.pitch = 1.0;

    u.onend = () => {
      setTimeout(next, delay); // 🔥 vraie latence entre les phrases
    };

    speechSynthesis.speak(u);
    i++;
  }

  next();
}

// Boutons
spinBtn.addEventListener("click", spin);

soundBtn.onclick = () => {
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? "🔊 Son" : "🔇 Son";
};

voiceBtn.onclick = () => {
  voiceOn = !voiceOn;
  voiceBtn.textContent = voiceOn ? "🗣️ Voix" : "🤐 Voix";
};
