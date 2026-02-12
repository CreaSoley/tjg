const deplacements = [
  "Ayumi ashi",
  "Hiki ashi",
  "Tsugi ashi",
  "Yori ashi"
];

const positions = [
  "Zenkutsu dashi",
  "Kokutsu dashi",
  "Neko dashi",
  "Fudo dashi",
  "Kiba dashi"
];

const techniques = [
  "Gyaku tsuki",
  "Kizami tsuki",
  "Uraken uchi",
  "Shuto uchi",
  "Teisho uchi",
  "Yoko geri",
  "Mawashi geri",
  "Gedan barai",
  "Uchi uke",
  "Jodan age uke",
  "Soto uke"
];

const slot1 = document.getElementById("slot1");
const slot2 = document.getElementById("slot2");
const slot3 = document.getElementById("slot3");
const spinBtn = document.getElementById("spinBtn");
const voiceBtn = document.getElementById("voiceBtn");
const resultDiv = document.getElementById("result");

let voiceEnabled = true;

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function spinSlot(slot, values, duration) {
  slot.classList.add("spin");

  return new Promise(resolve => {
    const interval = setInterval(() => {
      slot.textContent = randomFrom(values);
    }, 80);

    setTimeout(() => {
      clearInterval(interval);
      const finalValue = randomFrom(values);
      slot.textContent = finalValue;
      slot.classList.remove("spin");
      resolve(finalValue);
    }, duration);
  });
}

spinBtn.addEventListener("click", async () => {
  resultDiv.textContent = "🎰 Tirage en cours...";
  
  const d = await spinSlot(slot1, deplacements, 1200);
  const p = await spinSlot(slot2, positions, 1600);
  const t = await spinSlot(slot3, techniques, 2000);

  const finalText = `${d} – ${p} – ${t}`;
  resultDiv.textContent = finalText;

  if (voiceEnabled) {
    speakResult(d, p, t);
  }
});

voiceBtn.addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  voiceBtn.textContent = voiceEnabled ? "🗣️ Voix" : "🔇 Voix";
});

function speakResult(deplacement, position, technique) {
  if (!("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance(
    `Déplacement : ${deplacement}. Position : ${position}. Technique : ${technique}.`
  );
  utterance.lang = "fr-FR";
  utterance.rate = 0.95;
  utterance.pitch = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
