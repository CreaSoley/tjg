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

fetch("assauts.json")
  .then(r => r.json())
  .then(data => {
    assauts = data;
    drawWheel();
  });

function drawWheel() {
  const colors = ["#ff2a2a","#ffb703","#00f5d4","#8338ec","#ff006e","#3a86ff","#80ed99","#ffd166"];
  const slice = (Math.PI * 2) / 8;

  ctx.clearRect(0,0,320,320);

  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(160,160);
    ctx.arc(160,160,160,i*slice,(i+1)*slice);
    ctx.fillStyle = colors[i];
    ctx.fill();

    // Numéro
    ctx.save();
    ctx.translate(160,160);
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

  // 1️⃣ Tirage de l’assaut
  const assautObj = assauts[Math.floor(Math.random() * assauts.length)];
  const assaut = assautObj.label || assautObj.nom || assautObj.name || assautObj;

  const assautText = `Assaut : ${assaut}`;

  resultBox.innerHTML = `<strong>${assautText}</strong>`;
  if (voiceOn) speak(assautText);

  // 2️⃣ Petite pause avant la roue
  setTimeout(() => {

    // Tirage technique de base (1 à 8)
    const num = Math.ceil(Math.random() * 8);
    const types = ["Atemi","Clé","Projection"];
    const type = types[Math.floor(Math.random() * 3)];
    const tech = techniques[num][type];

    // Préparation du son
    spinSound.currentTime = 0;

    // Calcul rotation
    const segmentAngle = 360 / 8;
    const targetAngle = 360 - (num - 1) * segmentAngle - segmentAngle / 2;
    const spins = 6 * 360;
    const finalRotation = spins + targetAngle;

    wheel.style.transition = "none";
  wheel.style.transform = "rotate(0deg)";
  wheel.offsetHeight; // 👈 force le navigateur à recalculer

  wheel.style.transition = "transform 6s cubic-bezier(0.1, 0.9, 0.2, 1)";
  wheel.style.transform = `rotate(${finalRotation}deg)`;


    if (soundOn) spinSound.play();

    // 3️⃣ Résultat APRÈS l'arrêt complet
    setTimeout(() => {
      const text = `Technique de base ${num} par ${type} : ${tech}`;

      resultBox.innerHTML += `
        <hr>
        <strong>Technique de base ${num}</strong><br>
        ➜ ${type}<br>
        ${tech}
      `;

      if (voiceOn) speak(text);

      history.push({ assaut, num, type, tech });

    }, 6000);

  }, 1200);
}

function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "fr-FR";
  u.rate = 0.95;
  u.pitch = 1.05;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
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
