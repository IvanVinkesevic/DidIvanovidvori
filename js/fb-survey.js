document.addEventListener("DOMContentLoaded", () => {
  loadSurvey();
});

//  Firebase konfiguracija
const firebaseConfig = {
  projectId: "studio-4123987260-2ceeb",
  appId: "1:1032474933263:web:1b57df0d47ae28debe0b7a",
  apiKey: "AIzaSyC30FdtehvYgcwyo9pNw3sLU7GPLHyP7l0",
  authDomain: "studio-4123987260-2ceeb.firebaseapp.com",
};

//  Inicijalizacija Firebase-a
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

//  Učitavanje ankete
async function loadSurvey() {
  const form = document.getElementById("responseForm");
  const thankYou = document.getElementById("thankYou");

  try {
    const snapshot = await db
      .collection("surveys")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      form.innerHTML = "<p>Nema dostupnih anketa.</p>";
      return;
    }

    const survey = snapshot.docs[0];
    const surveyId = survey.id;
    const data = survey.data();

    form.innerHTML = ""; // očisti formu (ako postoji stari sadržaj)

    //  Generiraj pitanja
    data.questions.forEach((q, i) => {
      form.innerHTML += `
        <fieldset>
          <legend>${i + 1}. ${q}</legend>
          <label><input type="radio" name="q${i}" value="Slažem se" required> Slažem se</label><br>
          <label><input type="radio" name="q${i}" value="Ne znam"> Ne znam</label><br>
          <label><input type="radio" name="q${i}" value="Ne slažem se"> Ne slažem se</label><br>
        </fieldset><br>
      `;
    });

    form.innerHTML += `<button type="submit">Pošalji odgovore</button>`;

    //  Slanje odgovora
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const answers = {};
      data.questions.forEach((_, i) => {
        const selected = form.querySelector(`input[name='q${i}']:checked`);
        answers[i] = selected ? selected.value : "";
      });

      await db.collection("surveyResponses").add({
        surveyId: survey.id,
        answers,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      form.classList.remove("visible");
      form.classList.add("hidden");

      setTimeout(() => {
        thankYou.classList.remove("hidden");
        thankYou.classList.add("visible");
      }, 400);
    });
  } catch (error) {
    console.error("Greška pri učitavanju ankete:", error);
    form.innerHTML = "<p>Došlo je do pogreške pri učitavanju ankete.</p>";
  }
}
