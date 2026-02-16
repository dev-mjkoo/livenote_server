async function loadUpdates() {
  const list = document.getElementById("updates-list");
  list.innerHTML = "<li>Loading updates...</li>";

  try {
    const res = await fetch("/api/updates");
    const data = await res.json();
    const updates = Array.isArray(data.updates) ? data.updates : [];

    if (updates.length === 0) {
      list.innerHTML = "<li>No updates yet.</li>";
      return;
    }

    list.innerHTML = updates
      .map((item) => {
        const date = item.date ? `(${item.date})` : "";
        const text = item.text || "";
        return `<li><strong>${date}</strong> ${text}</li>`;
      })
      .join("");
  } catch (_err) {
    list.innerHTML = "<li>Could not load updates.</li>";
  }
}

function setupAskForm() {
  const form = document.getElementById("ask-form");
  const nameInput = document.getElementById("name-input");
  const messageInput = document.getElementById("message-input");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Sending...";

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput.value,
          message: messageInput.value
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        status.textContent = body.error || "Failed to send message.";
        return;
      }

      messageInput.value = "";
      status.textContent = "Thanks. Your message was sent.";
    } catch (_err) {
      status.textContent = "Network error. Please retry.";
    }
  });
}

loadUpdates();
setupAskForm();
