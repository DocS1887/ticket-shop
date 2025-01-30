export const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("de-DE", options);
};

export const formatTime = (time) => {
  // Wenn time ein String ist, extrahiere nur Stunden und Minuten
  if (typeof time === "string") {
    // Teile den String bei ':' und nimm nur die ersten zwei Teile
    return time.split(":").slice(0, 2).join(":");
  }

  // Fallback für ungültige Zeiten
  return "--:--";
};
