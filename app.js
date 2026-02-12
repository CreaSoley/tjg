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
    drawWheel(assauts);
  });

function drawWheel(data) {
  const colors = ["#ff2a2a","#ffb703","#00f5d4","#8338ec","#ff006e","#3a86ff"];
  const slice = (Math.PI * 2) / data.length;

  data.forEach((a, i) => {
    ctx.beginPath();
    ctx.moveTo(160,160);
    ctx.arc(160,160,160,i*slice,(i+1)*slice);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
  });
}

function getFilters() {
  return [...document.querySelectorAll(".filters input:checked")].map(c => c.value);
}

function spin() {
  const filters = getFilters();
  const pool = assauts.filter(a => filters.includes(a.type_attaque));

  if (!pool.length) {
    resultBox.textContent = "Aucun assaut sélectionné 😅";
    return;
  }

  let pick;
  let tries = 0;
  do {
    pick = pool[Math.floor(Math.random() * pool.length)];
    tries++;
  } while (history.includes(pick.nom) && tries < 10);

  history.push(pick.nom);
  if (history.length > 5) history.shift();

  const num = Math.ceil(Math.random() * 8);
  const types = ["Atemi","Clé","Projection"];
  const type = types[Math.floor(Math.random() * 3)];
  const tech = techniques[num][type];

  resultBox.innerHTML = `
    <strong>${pick.type_attaque} – ${pick.nom}</strong><br>
    ⬇️<br>
    Technique ${num} – ${type}<br>
    ${tech}
  `;

  if (soundOn) spinSound.play();
  if (voiceOn) speak(`${pick.type_attaque} ${pick.nom}. Technique ${num} ${type}. ${tech}`);

  wheel.style.transition = "transform 2s cubic-bezier(.2,.8,.2,1)";
  wheel.style.transform = `rotate(${720 + Math.random()*360}deg)`;
  setTimeout(() => wheel.style.transition = "", 2000);
}

function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "fr-FR";
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

spinBtn.onclick = spin;

soundBtn.onclick = () => {
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? "🔊 Son" : "🔇 Son";
};

voiceBtn.onclick = () => {
  voiceOn = !voiceOn;
  voiceBtn.textContent = voiceOn ? "🗣️ Voix" : "🤐 Voix";
};
