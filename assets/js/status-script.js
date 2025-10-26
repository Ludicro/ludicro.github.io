document.addEventListener("DOMContentLoaded", () => {
  // Swim elements
  const swimStatusValue = document.getElementById("swim-status-value");
  const swimRefreshButton = document.getElementById("swim-refresh-button");
  const swimDurationEl = document.getElementById("swim-duration");

  // Nap elements
  const napStatusValue = document.getElementById("nap-status-value");
  const napToggleButton = document.getElementById("nap-toggle-button");
  const napRefreshButton = document.getElementById("nap-refresh-button");
  const napDurationEl = document.getElementById("nap-duration");

  // Bike elements
  const bikeStatusValue = document.getElementById("bike-status-value");
  const bikeRefreshButton = document.getElementById("bike-refresh-button");
  const bikeDurationEl = document.getElementById("bike-duration");

  // Small helper to add a timeout to fetch
  async function fetchWithTimeout(url, ms = 3000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), ms);
    try {
      const res = await fetch(url, { signal: controller.signal });
      return res;
    } finally {
      clearTimeout(id);
    }
  }

  function formatSeconds(s) {
    const sec = Math.max(0, Number(s) || 0);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const r = sec % 60;
    return `${h}h ${m}m ${r}s`;
  }

  function applyStatus(el, status) {
    const clean = (status || "").toLowerCase();
    el.textContent =
      clean === "engaged" ? (el === napStatusValue ? "Napping 😴" : el === bikeStatusValue ? "Riding" : "I'm Swimming 🏊") :
      clean === "disengaged" ? (el === napStatusValue ? "Awake" : el === bikeStatusValue ? "Not Riding" : "Not Swimming") :
      "Unknown";

    el.className =
      clean === "engaged" ? "status-engaged" :
      clean === "disengaged" ? "status-disengaged" :
      "status-error";
  }


  async function refreshSwimStatus() {
    try {
      const res = await fetchWithTimeout("https://status.glyphforge.net/api/getSwimStatus", 3000);
      if (!res.ok) throw new Error("Failed to fetch");
      const { status, elapsed_seconds } = await res.json();

      applyStatus(swimStatusValue, status);
      if (status && status.toLowerCase() === "engaged") {
        if (swimDurationEl) {
          swimDurationEl.textContent = `Time: ${formatSeconds(elapsed_seconds)}`;
          swimDurationEl.style.display = "";
        }
      } else if (swimDurationEl) {
        swimDurationEl.textContent = "";
        swimDurationEl.style.display = "none";
      }
    } 
    catch (err) {
      swimStatusValue.textContent = "Status Error";
      swimStatusValue.className = "status-error";
      if (swimDurationEl) {
        swimDurationEl.textContent = "";
        swimDurationEl.style.display = "none";
      }
    }
  }

  async function refreshNapStatus() {
    try {
      const res = await fetchWithTimeout("https://status.glyphforge.net/api/getNapStatus", 3000);
      if (!res.ok) throw new Error("Failed to fetch");
      const { status, elapsed_seconds } = await res.json();

      applyStatus(napStatusValue, status);

      if (status && status.toLowerCase() == "engaged") {
        if (napDurationEl) {
          napDurationEl.textContent = `Time: ${formatSeconds(elapsed_seconds)}`;
          napDurationEl.style.display = "";
        }
      }
      else if (napDurationEl) {
        napDurationEl.textContent = "";
        napDurationEl.style.display = "none";
      }
    }
    catch {
      napStatusValue.textContent = "Status Error";
      napStatusValue.className = "status-error";
      if (napDurationEl) {
        napDurationEl.textContent = "";
        napDurationEl.style.display = "none";
      }
    }
  }

  async function toggleNapStatus() {
    try {
      const current = (napStatusValue.textContent || "").toLowerCase();
      const next = current.includes("napping") ? "disengaged" : "engaged";
      const res = await fetchWithTimeout(`https://status.glyphforge.net/api/setNapStatus?value=${encodeURIComponent(next)}`, 3000);
      if (!res.ok) throw new Error("Failed to set status");
      await refreshNapStatus();
    } catch (err) {
      napStatusValue.textContent = "Toggle Error";
      napStatusValue.className = "status-error";
    }
  }

  async function refreshBikeStatus() {
    try {
      const res = await fetchWithTimeout("https://status.glyphforge.net/api/getBikeStatus", 3000);
      if (!res.ok) throw new Error("Failed to fetch");
      const { status, elapsed_seconds } = await res.json();

      applyStatus(bikeStatusValue, status);
      if (status && status.toLowerCase() === "engaged") {
        if (bikeDurationEl) {
          bikeDurationEl.textContent = `Time: ${formatSeconds(elapsed_seconds)}`;
          bikeDurationEl.style.display = "";
        }
      } else if (bikeDurationEl) {
        bikeDurationEl.textContent = "";
        bikeDurationEl.style.display = "none";
      }
    } catch (err) {
      bikeStatusValue.textContent = "Status Error";
      bikeStatusValue.className = "status-error";
      if (bikeDurationEl) {
        bikeDurationEl.textContent = "";
        bikeDurationEl.style.display = "none";
      }
    }
  }

  swimRefreshButton.addEventListener("click", refreshSwimStatus);
  napRefreshButton.addEventListener("click", refreshNapStatus);
  napToggleButton.addEventListener("click", toggleNapStatus);
  bikeRefreshButton.addEventListener("click", refreshBikeStatus)

  // Initial fetch
  refreshSwimStatus();
  refreshNapStatus();
  refreshBikeStatus();
});
