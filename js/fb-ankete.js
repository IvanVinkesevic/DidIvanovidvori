const firebaseConfig = {
  projectId: "studio-4123987260-2ceeb",
  appId: "1:1032474933263:web:1b57df0d47ae28debe0b7a",
  apiKey: "AIzaSyC30FdtehvYgcwyo9pNw3sLU7GPLHyP7l0",
  authDomain: "studio-4123987260-2ceeb.firebaseapp.com",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let pieChart = null;

// 🔹 Dohvati sve ankete iz Firestore-a
async function loadSurveys() {
  const lista = document.getElementById("ankete");
  const snapshot = await db
    .collection("surveys")
    .orderBy("createdAt", "desc")
    .get();

  if (snapshot.empty) {
    lista.innerHTML = "<li>Nema dostupnih anketa.</li>";
    return;
  }

  const surveys = [];
  snapshot.forEach((doc) => {
    surveys.push({ id: doc.id, ...doc.data() });
  });

  // Popuni listu anketa
  lista.innerHTML = "";
  surveys.forEach((survey, index) => {
    const li = document.createElement("li");
    const naslov = survey.title || "Bez naslova";
    const datum = survey.createdAt
      ? survey.createdAt.toDate().toLocaleDateString("hr-HR")
      : "Nepoznat datum";

    li.textContent = `${naslov} (${datum})`;
    li.style.cursor = "pointer";
    li.style.padding = "8px";
    li.style.borderBottom = "1px solid #ccc";

    li.addEventListener("click", () => {
      showSurveyResults(survey);
    });

    // Automatski prikaži prvu anketu
    if (index === 0) {
      showSurveyResults(survey);
    }

    lista.appendChild(li);
  });
}

// 🔹 Dohvati rezultate za specifičnu anketu
async function getSurveyResults(surveyId) {
  try {
    // Dohvati sve odgovore za ovu anketu
    const responsesSnapshot = await db
      .collection("surveyResponses")
      .where("surveyId", "==", surveyId)
      .get();

    // Dohvati podatke ankete
    const surveyDoc = await db.collection("surveys").doc(surveyId).get();
    const surveyData = surveyDoc.data();

    if (!surveyData.questions) return null;

    // Inicijaliziraj rezultate
    const results = surveyData.questions.map((question, index) => {
      return {
        text: question,
        options: ["Slažem se", "Ne znam", "Ne slažem se"],
        results: [0, 0, 0], // Početni brojači
      };
    });

    // Prebroji odgovore
    responsesSnapshot.forEach((doc) => {
      const response = doc.data();
      Object.entries(response.answers).forEach(([questionIndex, answer]) => {
        const qIndex = parseInt(questionIndex);
        if (results[qIndex]) {
          const answerIndex = results[qIndex].options.indexOf(answer);
          if (answerIndex !== -1) {
            results[qIndex].results[answerIndex]++;
          }
        }
      });
    });

    return {
      id: surveyId,
      title: surveyData.title,
      questions: results,
      createdAt: surveyData.createdAt,
    };
  } catch (error) {
    console.error("Greška pri dohvaćanju rezultata:", error);
    return null;
  }
}

// 🔹 Izračunaj ukupne glasove za pitanje
function getTotalVotes(question) {
  if (!question.results) return 0;
  return question.results.reduce((sum, votes) => sum + votes, 0);
}

// 🔹 Prikaži rezultate odabrane ankete
async function showSurveyResults(survey) {
  const naslovElement = document.getElementById("naslov-ankete");
  const rezultatiElement = document.getElementById("rezultati-ankete");

  naslovElement.textContent = survey.title || "Anketa bez naslova";
  rezultatiElement.innerHTML = "<p>Učitavanje rezultata...</p>";

  // Dohvati stvarne rezultate iz surveyResponses
  const surveyWithResults = await getSurveyResults(survey.id);

  if (!surveyWithResults) {
    rezultatiElement.innerHTML = "<p>Nema rezultata za ovu anketu.</p>";
    return;
  }

  // Prikaži pitanja i odgovore
  let html = "";

  if (surveyWithResults.questions && surveyWithResults.questions.length > 0) {
    surveyWithResults.questions.forEach((question, qIndex) => {
      html += `<div class="pitanje">
                <h3>${qIndex + 1}. ${question.text}</h3>
                <div class="pitanje-sadrzaj">
                  <div class="odgovori">`;

      if (question.options && question.options.length > 0) {
        question.options.forEach((option, oIndex) => {
          const votes = question.results ? question.results[oIndex] || 0 : 0;
          const totalVotes = getTotalVotes(question);
          const percentage =
            totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0;

          const colors = ["#4e4cafff", "#FFC107", "#F44336"]; // Plava, Žuta, Crvena
          const color = colors[oIndex] || "#CCCCCC";

          html += `<div class="option-result">
                     <span class="option-text">${option}</span>
                    <span class="option-stats">${votes} glasova (${percentage}%)</span>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${percentage}%; background-color: ${color};"> </div>
                    </div>
                  </div>`;
        });
      }

      html += `</div>
                <div class="mini-chart-container">
                  <canvas id="miniChart-${qIndex}" width="120" height="120"></canvas>
                </div>
                
              </div> <br/>  <hr/>   </div>`;
    });
  } else {
    html = "<p>Nema pitanja u ovoj anketi.</p>";
  }

  rezultatiElement.innerHTML = html;

  // Kreiraj mini pie chartove za svako pitanje
  createMiniCharts(surveyWithResults);
}
// 🔹 Kreiraj mini pie chartove za svako pitanje
function createMiniCharts(survey) {
  // Uništi sve prethodne chartove
  if (pieChart) {
    pieChart.destroy();
  }

  if (!survey.questions || survey.questions.length === 0) {
    return;
  }

  // Kreiraj chart za svako pitanje
  survey.questions.forEach((question, qIndex) => {
    if (!question.options || question.options.length === 0) {
      return;
    }

    const ctx = document.getElementById(`miniChart-${qIndex}`).getContext("2d");
    const votes = question.results || Array(question.options.length).fill(0);

    // Boje za mini chart - iste kao u progress barovima
    const backgroundColors = ["#4e4cafff", "#FFC107", "#F44336"]; // Plava, Žuta, Crvena

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: question.options,
        datasets: [
          {
            data: votes,
            backgroundColor: backgroundColors.slice(0, question.options.length),
            borderWidth: 1,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Sakrij legendu za mini chartove
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage =
                  total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  });
}
document.getElementById("datum-analize").textContent =
  new Date().toLocaleDateString("hr-HR");

// Pokreni kada se stranica učita
document.addEventListener("DOMContentLoaded", loadSurveys);
