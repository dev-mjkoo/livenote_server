const lettersList = document.getElementById("letters-list");
const refreshButton = document.getElementById("refresh-btn");

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderLetters(items) {
  if (!items || items.length === 0) {
    lettersList.innerHTML = '<div class="letter-empty">아직 등록된 편지가 없습니다.</div>';
    return;
  }

  lettersList.innerHTML = items
    .map((item, index) => {
      const open = index === 0;
      const panelId = `letter-panel-${index}`;
      const body = Array.isArray(item.body) ? item.body : [];
      const bodyHtml = body.map((line) => `<p>${escapeHtml(line)}</p>`).join("");

      return `
        <article class="letter-item" data-open="${open}">
          <button class="letter-trigger" type="button" aria-expanded="${open}" aria-controls="${panelId}">
            <span>
              <div class="letter-title">${escapeHtml(item.title)}</div>
              <div class="letter-meta">${escapeHtml(item.date)}</div>
            </span>
            <span class="letter-chevron">⌄</span>
          </button>
          <div id="${panelId}" class="letter-panel" ${open ? "" : "hidden"}>
            ${bodyHtml || '<p class="letter-empty">본문이 비어 있습니다.</p>'}
          </div>
        </article>
      `;
    })
    .join("");

  lettersList.querySelectorAll(".letter-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".letter-item");
      const panel = card.querySelector(".letter-panel");
      const expanded = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
      card.dataset.open = String(!expanded);
    });
  });
}

async function loadLetters() {
  lettersList.innerHTML = '<div class="letter-empty">불러오는 중...</div>';

  try {
    const response = await fetch("./letters.json", { cache: "no-store" });
    const letters = await response.json();

    if (!Array.isArray(letters)) {
      renderLetters([]);
      return;
    }

    renderLetters(letters);
  } catch (_error) {
    lettersList.innerHTML = '<div class="letter-empty">편지를 불러오지 못했습니다.</div>';
  }
}

refreshButton.addEventListener("click", loadLetters);
loadLetters();
