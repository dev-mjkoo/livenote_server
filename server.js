const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const PUBLIC_DIR = path.join(__dirname, "public");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const UPDATES_FILE = path.join(DATA_DIR, "updates.json");

app.use(express.json());

function readJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf8");
    return raw ? JSON.parse(raw) : fallback;
  } catch (_err) {
    return fallback;
  }
}

function writeJson(filePath, value) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
}

app.get("/api/updates", (_req, res) => {
  const updates = readJson(UPDATES_FILE, []);
  res.json({ updates });
});

app.get("/api/messages", (_req, res) => {
  const messages = readJson(MESSAGES_FILE, []);
  res.json({ messages });
});

app.post("/api/messages", (req, res) => {
  const { name, message } = req.body || {};
  const trimmedName = String(name || "").trim().slice(0, 60);
  const trimmedMessage = String(message || "").trim().slice(0, 1000);

  if (!trimmedMessage) {
    return res.status(400).json({ error: "message is required" });
  }

  const messages = readJson(MESSAGES_FILE, []);
  const newMessage = {
    id: Date.now(),
    name: trimmedName || "anonymous",
    message: trimmedMessage,
    createdAt: new Date().toISOString()
  };

  messages.unshift(newMessage);
  writeJson(MESSAGES_FILE, messages.slice(0, 200));

  return res.status(201).json({ ok: true, message: newMessage });
});

app.get(["/updates", "/updates/"], (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "updates", "index.html"));
});

app.get(["/updates/:version", "/updates/:version/"], (req, res) => {
  const version = String(req.params.version || "");

  if (!/^[0-9A-Za-z._-]+$/.test(version)) {
    return res.status(404).send("Not found");
  }

  const detailFile = path.join(PUBLIC_DIR, "updates", version, "index.html");

  if (!fs.existsSync(detailFile)) {
    return res.status(404).send("Not found");
  }

  return res.sendFile(detailFile);
});

app.use(express.static(PUBLIC_DIR));

app.get("*", (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
