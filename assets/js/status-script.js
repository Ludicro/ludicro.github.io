document.addEventListener("DOMContentLoaded", () => {
  const swimStatusValue = document.getElementById("swim-status-value");
  const swimRefreshButton = document.getElementById("swim-refresh-button");

  const napStatusValue = document.getElementById("nap-status-value");
  const napToggleButton = document.getElementById("nap-toggle-button");
  const napRefreshButton = document.getElementById("nap-refresh-button");

  const bikeStatusValue = document.getElementById("bike-status-value");
  const bikeRefreshButton = document.getElementById("bike-refresh-button");

  async function refreshSwimStatus() {
    try {
      const res = await fetch("https://status.glyphforge.net/api/getSwimStatus");
      if (!res.ok) throw new Error("Failed to fetch");
      const text = await res.text();
      const clean = text.trim().toLowerCase();

      swimStatusValue.textContent =
        clean === "engaged" ? "I'm Swimming 🏊" :
        clean === "disengaged" ? "Not Swimming" :
        "Unknown";

      swimStatusValue.className =
        clean === "engaged" ? "status-engaged" :
        clean === "disengaged" ? "status-disengaged" :
        "status-error";
    } catch (err) {
      swimStatusValue.textContent = "Status Error";
      swimStatusValue.className = "status-error";
    }
  }

  async function refreshNapStatus() {
    try {
      const res = await fetch("https://status.glyphforge.net/api/napStatus");
      if (!res.ok) throw new Error("Failed to fetch");
      const text = await res.text();
      const clean = text.trim().toLowerCase();

      napStatusValue.textContent =
        clean === "engaged" ? "Napping 😴" :
        clean === "disengaged" ? "Awake" :
        "Unknown";

      napStatusValue.className =
        clean === "engaged" ? "status-engaged" :
        clean === "disengaged" ? "status-disengaged" :
        "status-error";
    } catch (err) {
      napStatusValue.textContent = "Status Error";
      napStatusValue.className = "status-error";
    }
  }

  async function toggleNapStatus() {
    try {
      const currentText = napStatusValue.textContent.toLowerCase();
      const newValue = currentText.includes("napping") ? "disengaged" : "engaged";
      const res = await fetch(`https://status.glyphforge.net/api/setNapStatus?value=${newValue}`);
      if (!res.ok) throw new Error("Failed to set status");
      await refreshNapStatus();
    } catch (err) {
      napStatusValue.textContent = "Toggle Error";
      napStatusValue.className = "status-error";
    }
  }

  async function refreshBikeStatus() {
    try {
      const res = await fetch("https://status.glyphforge.net/api/getBikeStatus");
      if (!res.ok) throw new Error("Failed to fetch");
      const text = await res.text();
      const clean = text.trim().toLowerCase();

      bikeStatusValue.textContent =
        clean === "engaged" ? "Riding" :
        clean === "disengaged" ? "Not Riding" :
        "Unknown";

      bikeStatusValue.className =
        clean === "engaged" ? "status-engaged" :
        clean === "disengaged" ? "status-disengaged" :
        "status-error";
    } catch (err) {
      bikeStatusValue.textContent = "Status Error";
      bikeStatusValue.className = "status-error";
    }
  }

  swimRefreshButton.addEventListener("click", refreshSwimStatus);
  napRefreshButton.addEventListener("click", refreshNapStatus);
  napToggleButton.addEventListener("click", toggleNapStatus);
  bikeRefreshButton.addEventListener("click", refreshBikeStatus)

  // Initial fetch
  refreshSwimStatus();
  refreshNapStatus();
});
