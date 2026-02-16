const updatesList = document.getElementById("updates-list");
const refreshButton = document.getElementById("refresh-btn");

async function loadUpdates() {
  updatesList.innerHTML = "<li>불러오는 중...</li>";

  try {
    const response = await fetch("./updates.json", { cache: "no-store" });
    const updates = await response.json();

    if (!Array.isArray(updates) || updates.length === 0) {
      updatesList.innerHTML = "<li>업데이트가 아직 없습니다.</li>";
      return;
    }

    updatesList.innerHTML = updates
      .map((item) => {
        const date = item.date ? `[${item.date}]` : "";
        const text = item.text || "";
        return `<li><strong>${date}</strong> ${text}</li>`;
      })
      .join("");
  } catch (_error) {
    updatesList.innerHTML = "<li>업데이트를 불러오지 못했습니다.</li>";
  }
}

refreshButton.addEventListener("click", loadUpdates);
loadUpdates();
