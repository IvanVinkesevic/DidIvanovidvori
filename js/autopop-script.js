document.addEventListener("DOMContentLoaded", function () {
  // Probaj oba moguća ID-a
  const autoPopup =
    document.getElementById("popup-auto") ||
    document.getElementById("popupAuto");

  if (!autoPopup) {
    console.log("Auto popup nije pronađen na ovoj stranici");
    return;
  }

  console.log("Auto popup pronađen, čekaj 1.5 sekunde...");

  // DELAY od 1.5 sekunde prije nego se pojavi
  setTimeout(() => {
    console.log("Prikazujem auto popup");

    // Pokaži s fade-in efektom
    autoPopup.style.display = "block";
    setTimeout(() => {
      autoPopup.style.opacity = "1";
    }, 10);

    // Automatsko zatvaranje nakon 5 sekundi
    setTimeout(() => {
      autoPopup.style.opacity = "0";
      setTimeout(() => {
        autoPopup.style.display = "none";
        console.log("Auto popup zatvoren");
      }, 1000); // Čeka fade-out
    }, 5000); // 6 sekundi nakon prikaza

    // Opcionalno: zatvori klikom
    autoPopup.addEventListener("click", function () {
      this.style.opacity = "0";
      setTimeout(() => {
        this.style.display = "none";
      }, 1000);
    });
  }, 1500); // ⭐ OVO JE DELAY! 1500ms = 1.5 sekunde
});
