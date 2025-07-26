document.addEventListener("DOMContentLoaded", () => {
  const statusValue = document.getElementById("status-value");
  const refreshButton = document.getElementById("refresh-button");

  async function refreshStatus() {
    try {
      const res = await fetch("https://status.glyphforge.net/api/getStatus");
      if (!res.ok) throw new Error("Failed to fetch");
      const text = await res.text();
      const clean = text.trim().toLowerCase();

      statusValue.textContent = (clean === "engaged") ? "I'm Swimming 🏊" :
                                (clean === "disengaged") ? "Not Swimming" :
                                "Unknown";
      statusValue.className = clean === "engaged" ? "status-engaged"
                            : clean === "disengaged" ? "status-disengaged"
                            : "status-error";
    } catch (err) {
      statusValue.textContent = "Status Error";
      statusValue.className = "status-error";
    }
  }

  refreshButton.addEventListener("click", refreshStatus);
  refreshStatus();
});
