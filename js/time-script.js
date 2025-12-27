document.addEventListener("DOMContentLoaded", () => {
  initClock();
});

/* 1) Sat u zagrebačkoj zoni */
function initClock() {
  const el = document.getElementById("datetime");
  if (!el) return;
  const update = () => {
    const now = new Date();
    el.textContent = now.toLocaleString("hr-HR", {
      timeZone: "Europe/Zagreb",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  update();
  setInterval(update, 60000);
}
console.log(
  "Vrijeme postavljeno na:",
  document.getElementById("datetime")?.textContent
);
