// script.js - ČISTA I ORGANIZIRANA VERZIJA

document.addEventListener("DOMContentLoaded", () => {
  initPopupLinks(); // 1. Popup sistemi (4 popupa iz aside-a)
  initFirebase(); // 2. Firebase forma za članove
  initHamburgerMenu(); // 3. Responsivni hamburger menu
});

/* ==============================
   1) POPUP SISTEM
   (za aside1, aside2, aside3, aside4)
================================= */

function initPopupLinks() {
  // Delegacija eventova - jedan listener na body umjesto mnogo
  document.body.addEventListener("click", (e) => {
    const link = e.target.closest("[data-popup]");
    if (link) {
      e.preventDefault();
      const id = link.dataset.popup;
      openPopup(id);
      return;
    }

    const close = e.target.closest("[data-close]");
    if (close) {
      closePopup(close.dataset.close);
    }
  });

  // ESC zatvara sve aktivne popupove (pristupačnost)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document
        .querySelectorAll(".popup.active")
        .forEach((p) => closePopup(p.id));
    }
  });
}

function openPopup(id) {
  const popup = document.getElementById(id);
  if (!popup) return;
  popup.classList.add("active");
  popup.setAttribute("aria-hidden", "false");

  // Fokus na prvi input za bolju pristupačnost
  const firstInput = popup.querySelector("input, button, textarea, select");
  if (firstInput) firstInput.focus();
}

function closePopup(id) {
  const popup = document.getElementById(id);
  if (!popup) return;
  popup.classList.remove("active");
  popup.setAttribute("aria-hidden", "true");
}

/* ==============================
   2) FIREBASE FORMA ZA ČLANOVE
   (forma u aside1 popupu)
================================= */

function initFirebase() {
  // Firebase konfiguracija (podaci iz Firebase konzole)
  const firebaseConfig = {
    projectId: "studio-4123987260-2ceeb",
    appId: "1:1032474933263:web:1b57df0d47ae28debe0b7a",
    apiKey: "AIzaSyC30FdtehvYgcwyo9pNw3sLU7GPLHyP7l0",
    authDomain: "studio-4123987260-2ceeb.firebaseapp.com",
  };

  // Inicijalizacija Firebase servisa
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Anonimna prijava - gosti mogu slati podatke
  auth
    .signInAnonymously()
    .then(() => console.log("Prijavljen kao gost!"))
    .catch((err) => console.error("Auth greška:", err));

  // Dohvaćanje sljedećeg rednog broja člana
  const getNextMemberNumber = async () => {
    try {
      const querySnapshot = await db
        .collection("members")
        .orderBy("memberNumber", "desc")
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        return 1; // Prvi član
      } else {
        const lastMember = querySnapshot.docs[0].data();
        return (lastMember.memberNumber || 0) + 1;
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju sljedećeg broja:", error);
      return 1;
    }
  };

  // Obrada forme za prijavu člana
  const form = document.getElementById("memberForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const nextMemberNumber = await getNextMemberNumber();

      const newMember = {
        firstName: form.firstName.value.trim(),
        lastName: form.lastName.value.trim(),
        oib: form.oib.value.trim(),
        tel: form.tel.value.trim(),
        dob: form.dob.value,
        email: form.email.value.trim(),
        address: form.address.value.trim(),
        city: form.city.value.trim(),
        role: "member",
        uid: firebase.auth().currentUser.uid,
        memberNumber: nextMemberNumber,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection("members").add(newMember);

      console.log("Član dodan s rednim brojem:", nextMemberNumber);
      form.reset();
      closePopup("aside1");
      alert(`Član uspješno dodan s rednim brojem: ${nextMemberNumber}!`);
    } catch (err) {
      console.error("Greška:", err);
      alert("Došlo je do greške pri spremanju!");
    }
  });
}

/* ==============================
   3) HAMBURGER MENU ZA RESPONSIVNOST
   (mobile navigation)
================================= */

function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");
  const dropdowns = document.querySelectorAll(".dropdown");

  // Hamburger toggle
  hamburger.addEventListener("click", function () {
    this.classList.toggle("active");
    nav.classList.toggle("active");
    this.setAttribute("aria-expanded", this.classList.contains("active"));
  });

  // Dropdown za mobilne (samo na ekranima ≤ 768px)
  dropdowns.forEach((dropdown) => {
    const btn = dropdown.querySelector(".btn");
    btn.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle("active");
      }
    });
  });

  // Zatvori menu kada se klikne van njega
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".desno") && window.innerWidth <= 768) {
      hamburger.classList.remove("active");
      nav.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
}
