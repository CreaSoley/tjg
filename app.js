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
  "Uraken uchi": "ou-ra-kèn ou-tchi",
  "Kote gaeshi": "ko-té ga-é-chi",
  "O soto gari": "o so-to ga-ri",
  "Mae hiza geri": "ma-é hi-za gué-ri",
  "Waki gatame": "wa-ki ga-ta-mé",
  "Taï otoshi": "ta-i o-to-chi",
  "Yoko empi": "yo-ko èn-pi",
  "Juji ude gatame": "djou-dji ou-dé ga-ta-mé",
  "Ippon seoi nage": "ip-pon sé-o-i na-gué",
  "Chudan mae geri": "tchou-dane ma-é gué-ri",
  "Yuki shigae": "you-ki chi-ga-é",
  "Waki otoshi": "wa-ki o-to-chi",
  "Jodan shuto uchi": "djo-dane chou-to ou-tchi",
  "Hiji dori ura": "hi-dji do-ri ou-ra",
  "Uki waza": "ou-ki wa-za",
  "Chudan mawashi geri": "tchou-dane ma-wa-chi gué-ri",
  "Shiho nage": "chi-ho na-gué",
  "Haraï goshi": "ha-ra-ï go-chi",
  "Chudan kizami tsuki": "tchou-dane ki-za-mi tsou-ki",
  "Tembin": "tèm-bine",
  "Ushiro goshi": "ou-chi-ro go-chi",
  "Yoko fumikomi": "yo-ko fou-mi-ko-mi",
  "Hashi mawashi": "ha-chi ma-wa-chi",
  "Kata hizaguruma": "ka-ta hi-za-gou-rou-ma"
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

  // Tirage assaut (gestion objet ou string)
  const assautObj = assauts[Math.floor(Math.random() * assauts.length)];
  const assaut = assautObj.label || assautObj.nom || assautObj.name || assautObj;
  const phoneticTech = phonetics[tech] || tech;

  // On prépare l'affichage sans révéler encore
  resultBox.innerHTML = `
    <div id="assautReveal" class="assaut-reveal">
      Assaut : ${assaut}
    </div>
  `;

  // Préparation technique de base
  const num = Math.ceil(Math.random() * 8);
  const types = ["Atemi","Clé","Projection"];
  const type = types[Math.floor(Math.random() * 3)];
  const tech = techniques[num][type];

  // Préparation son
  spinSound.currentTime = 0;

  const segmentAngle = 360 / 8;
const pointerAngle = 270; // 12h en degrés (repère CSS)

const targetAngle =
  360 * 6 +                      // 6 tours complets
  pointerAngle -                // position du pointeur
  (num - 0.5) * segmentAngle;   // centre du segment

  const spins = 6 * 360;
 const finalRotation = targetAngle;

  // Reset animation pour éviter les bugs
  wheel.style.transition = "none";
  wheel.style.transform = "rotate(0deg)";
  wheel.offsetHeight;

  wheel.style.transition = "transform 6s cubic-bezier(0.1, 0.9, 0.2, 1)";
  wheel.style.transform = `rotate(${finalRotation}deg)`;

  if (soundOn) spinSound.play();

  // Après arrêt de la roue
  setTimeout(() => {

    // 🎭 Révélation assaut avec animation
    const reveal = document.getElementById("assautReveal");
    reveal.classList.add("open");

    if (voiceOn) speak(`Assaut : ${assaut}`);

    // Petite pause dramatique avant la technique
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

    }, 1200);

  }, 6000);
}

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
