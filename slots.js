const deplacements = ["Ayumi ashi", "Hiki ashi", "Tsugi ashi", "Yori ashi"];
const positions = ["Zenkutsu dashi", "Kokutsu dashi", "Neko dashi", "Fudo dashi", "Kiba dashi"];
const techniques = ["Gyaku tsuki", "Kizami tsuki", "Uraken uchi", "Shuto uchi", "Teisho uchi", "Yoko geri", "Mawashi geri", "Gedan barai", "Uchi uke", "Jodan age uke", "Soto uke"];

const slot1 = document.getElementById("slot1");
const slot2 = document.getElementById("slot2");
const slot3 = document.getElementById("slot3");
const spinBtn = document.getElementById("spinBtn");
const voiceBtn = document.getElementById("voiceBtn");
const resultDiv = document.getElementById("result");

let voiceEnabled = true;

// Fonction pour choisir un élément aléatoire
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Fonction d’animation "spin avec easing"
function spinSlotSmooth(slot, values, totalTime) {
  return new Promise(resolve => {
    let startTime = null;
    const spinSpeed = 100; // ms entre changements au début

    function animate(time) {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;

      // Ease out: plus on avance, plus le temps entre changements augmente
      const progress = Math.min(elapsed / totalTime, 1);
      const ease = Math.pow(1 - progress, 2); // carré pour ralentir doucement
      const interval = 50 + 200 * ease; // intervalle entre changements

      if (!slot.lastUpdate || time - slot.lastUpdate >= interval) {
        slot.textContent = randomFrom(values);
        slot.lastUpdate = time;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Valeur finale
        const finalValue = randomFrom(values);
        slot.textContent = finalValue;
        resolve(finalValue);
      }
    }

    requestAnimationFrame(animate);
  });
}

// Bouton spin
spinBtn.addEventListener("click", async () => {
  resultDiv.textContent = "🎰 Tirage en cours...";

  // Durées en cascade pour effet machine à sous
  const duration1 = 1200; // premier rouleau
  const duration2 = 1800; // deuxième
  const duration3 = 2500; // troisième

  const dPromise = spinSlotSmooth(slot1, deplacements, duration1);
  const pPromise = spinSlotSmooth(slot2, positions, duration2);
  const tPromise = spinSlotSmooth(slot3, techniques, duration3);

  const d = await dPromise;
  const p = await pPromise;
  const t = await tPromise;

  const finalText = `${d} – ${p} – ${t}`;
  resultDiv.textContent = finalText;

  if (voiceEnabled) {
    speakResult(d, p, t);
  }
});

// Bouton voix
voiceBtn.addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  voiceBtn.textContent = voiceEnabled ? "🗣️ Voix" : "🔇 Voix";
});

// Synthèse vocale
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
