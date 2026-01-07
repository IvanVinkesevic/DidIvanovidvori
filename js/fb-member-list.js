document.addEventListener("DOMContentLoaded", () => {
  const firebaseConfig = {
    projectId: "studio-4123987260-2ceeb",
    appId: "1:1032474933263:web:1b57df0d47ae28debe0b7a",
    apiKey: "AIzaSyC30FdtehvYgcwyo9pNw3sLU7GPLHyP7l0",
    authDomain: "studio-4123987260-2ceeb.firebaseapp.com",
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  const tbody = document.getElementById("membersTableBody");

  // 🆕 FUNKCIJA ZA DOHVAĆANJE SLJEDEĆEG REDNOG BROJA
  const getNextMemberNumber = async () => {
    try {
      const querySnapshot = await db
        .collection("members")
        .orderBy("memberNumber", "desc")
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        return 10;
      } else {
        const lastMember = querySnapshot.docs[0].data();
        return (lastMember.memberNumber || 0) + 1;
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju sljedećeg broja:", error);
      return 10;
    }
  };

  // 🆕 FUNKCIJA ZA DODAVANJE NOVOG ČLANA
  window.dodajNovogClana = async (memberData) => {
    try {
      const nextNumber = await getNextMemberNumber();

      const noviClan = {
        ...memberData,
        memberNumber: nextNumber,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection("members").add(noviClan);
      console.log(`Novi član dodan s rednim brojem: ${nextNumber}`);
      return nextNumber;
    } catch (error) {
      console.error("Greška pri dodavanju člana:", error);
      throw error;
    }
  };

  // 🔁 Real-time listener — automatski osvježava tablicu
  db.collection("members")
    .orderBy("memberNumber", "asc")
    .onSnapshot(
      (snapshot) => {
        tbody.innerHTML = "";

        if (snapshot.empty) {
          tbody.innerHTML =
            "<tr><td colspan='6'>Trenutno nema članova.</td></tr>";
          return;
        }

        snapshot.forEach((doc) => {
          const data = doc.data();
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${data.memberNumber || ""}</td>
            <td>${data.firstName || ""}</td>
            <td>${data.lastName || ""}</td>
            <td>${data.city || "Nije uneseno"}</td>
            <td>${data.email || ""}</td>
            <td>
              <button onclick="showMemberDetails('${
                doc.id
              }')" class="btn-details">
                Detalji
              </button>
            </td>
          `;
          tbody.appendChild(tr);
          console.log(doc.id);
        });
      },
      (error) => {
        console.error("Greška pri dohvaćanju članova:", error);
        tbody.innerHTML =
          "<tr><td colspan='6'>Greška pri učitavanju podataka.</td></tr>";
      }
    );

  // 🆕 FUNKCIJA ZA PRIKAZ DETALJA (SA LOZINKOM)
  window.showMemberDetails = async function (memberId) {
    const password = prompt("Unesite administratorsku lozinku:");
    if (password === "Deep1964see!") {
      try {
        const doc = await db.collection("members").doc(memberId).get();
        if (doc.exists) {
          const member = doc.data();
          alert(`
📋 PUNI PODACI ČLANA:
👤 Ime: ${member.firstName}
👤 Prezime: ${member.lastName}
🔒 OIB: ${member.oib}
📞 Telefon: ${member.tel}
🎂 Datum rođenja: ${member.dob}
📧 Email: ${member.email}
🏠 Adresa: ${member.address}
🏙️ Grad: ${member.city}
🔢 Redni broj: ${member.memberNumber}
          `);
        }
      } catch (error) {
        console.error("Greška pri dohvaćanju detalja:", error);
        alert("Greška pri dohvaćanju podataka!");
      }
    } else {
      alert("❌ Neispravna lozinka!");
    }
  };
});
