const updatesApp = document.getElementById("updates-app");
const pageMode = document.body.dataset.page || "updates-list";
const updatesPath = document.body.dataset.updatesPath || "/updates.json";
const detailPrefix = document.body.dataset.detailPrefix || "/updates/";
const homeLink = document.body.dataset.homeLink || "/";
const supportLink = document.body.dataset.supportLink || "/support/kr/";
const backLink = document.body.dataset.backLink || "/updates/";

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(value) {
  if (!value) return "";

  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(parsed);
}

function getReleaseVersion() {
  if (document.body.dataset.version) {
    return document.body.dataset.version;
  }

  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

function normalizeReleases(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.updates)) {
    return payload.updates;
  }

  return [];
}

function renderTags(tags) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return "";
  }

  return `
    <div class="tag-list" aria-label="Release tags">
      ${tags
        .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
        .join("")}
    </div>
  `;
}

function renderHighlightList(items, className) {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }

  return `
    <ul class="${className}">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderShowcaseEntry(entry) {
  if (!entry || entry.type === "heading") {
    return `<p class="schedule-heading${entry && entry.muted ? " is-muted" : ""}">${escapeHtml(entry ? entry.label : "")}</p>`;
  }

  const dateBadge = entry.date
    ? `<span class="schedule-date${entry.tone === "warm" ? " tone-warm" : ""}">${escapeHtml(entry.date)}</span>`
    : '<span class="schedule-placeholder" aria-hidden="true"></span>';

  const timeRow = entry.time ? `<span>${escapeHtml(entry.time)}</span>` : "";

  return `
    <div class="schedule-entry${entry.selected ? " is-selected" : ""}${entry.muted ? " is-muted" : ""}">
      ${dateBadge}
      <span class="schedule-rail${entry.selected ? "" : " is-hidden"}" aria-hidden="true"></span>
      <div class="schedule-body">
        <strong>${escapeHtml(entry.label)}</strong>
        ${timeRow}
      </div>
    </div>
  `;
}

function renderShowcase(release, compact) {
  const mockup = release.mockup || {};
  const entries = Array.isArray(mockup.entries) ? mockup.entries : [];
  const memoLines = String(mockup.memo || "")
    .split(", ")
    .filter(Boolean)
    .map((line) => escapeHtml(line))
    .join(",<br />");

  return `
    <div class="lockscreen-shell${compact ? " is-compact" : ""}" aria-hidden="true">
      <div class="lockscreen-aura lockscreen-aura-top"></div>
      <div class="lockscreen-aura lockscreen-aura-bottom"></div>

      <div class="lockscreen-panel">
        <div class="schedule-column">
          ${entries.map(renderShowcaseEntry).join("")}
        </div>

        <div class="lockscreen-divider"></div>

        <div class="memo-column">
          <p class="memo-brand">
            ${escapeHtml(mockup.brand || "LIVE NOTE")}
            <span class="memo-dot"></span>
          </p>
          <p class="memo-text">${memoLines}</p>
        </div>
      </div>

      <div class="lockscreen-home-indicator"></div>
    </div>
  `;
}

function renderReleaseCard(release) {
  const href = `${detailPrefix}${encodeURIComponent(release.version)}`;

  return `
    <a class="release-card" href="${href}">
      <div class="release-copy">
        <div class="release-meta">
          <span class="version-pill">v${escapeHtml(release.version)}</span>
          <span class="release-date">${escapeHtml(formatDate(release.date))}</span>
        </div>

        <h3 class="release-title">${escapeHtml(release.title)}</h3>
        <p class="release-summary">${escapeHtml(release.summary)}</p>
        ${renderTags(release.tags)}
      </div>

      <span class="release-arrow">Open</span>
    </a>
  `;
}

function renderSections(sections) {
  if (!Array.isArray(sections) || sections.length === 0) {
    return "";
  }

  return sections
    .map((section) => {
      const items = Array.isArray(section.items) ? section.items : [];

      return `
        <section class="detail-section">
          <h3>${escapeHtml(section.title)}</h3>
          <ul class="detail-list">
            ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>
      `;
    })
    .join("");
}

function renderFactRows(release) {
  const facts = [
    ["Version", `v${release.version || ""}`],
    ["Released", formatDate(release.date)],
    ["Focus", Array.isArray(release.tags) ? release.tags.join(" / ") : ""]
  ];

  return `
    <dl class="fact-list">
      ${facts
        .map(
          ([label, value]) => `
            <div class="fact-row">
              <dt>${escapeHtml(label)}</dt>
              <dd>${escapeHtml(value)}</dd>
            </div>
          `
        )
        .join("")}
    </dl>
  `;
}

function renderToolbar(isDetail) {
  const secondaryLink = isDetail
    ? `<a class="toolbar-link" href="${backLink}">All updates</a>`
    : `<a class="toolbar-link" href="${supportLink}">Support</a>`;

  return `
    <section class="updates-toolbar" aria-label="Page navigation">
      <a class="toolbar-link toolbar-link-strong" href="${homeLink}">LiveNote Home</a>
      ${secondaryLink}
    </section>
  `;
}

function renderListPage(releases) {
  if (!updatesApp) return;

  document.title = "LiveNote Updates";

  if (!Array.isArray(releases) || releases.length === 0) {
    updatesApp.innerHTML = `
      ${renderToolbar(false)}
      <section class="section-card empty-state">
        <p class="section-kicker">No releases yet</p>
        <h1 class="empty-title">아직 등록된 업데이트가 없습니다.</h1>
        <a class="button button-primary" href="${homeLink}">홈으로 돌아가기</a>
      </section>
    `;
    return;
  }

  const latest = releases[0];

  updatesApp.innerHTML = `
    ${renderToolbar(false)}

    <section class="section-card updates-hero">
      <div class="hero-copy">
        <p class="hero-kicker">${escapeHtml(latest.eyebrow || "Update notes")}</p>

        <div class="hero-meta-row">
          <span class="status-pill">${escapeHtml(latest.status || "Latest")}</span>
          <span class="hero-date">${escapeHtml(formatDate(latest.date))}</span>
        </div>

        <h1 class="hero-title">업데이트 내역</h1>
        <p class="hero-summary">
          새로 추가된 변화와 버전별 변경점을 한 곳에서 빠르게 확인하세요.
        </p>

        <div class="hero-feature-card">
          <span class="version-pill">v${escapeHtml(latest.version)}</span>
          <h2>${escapeHtml(latest.title)}</h2>
          <p>${escapeHtml(latest.description || latest.summary)}</p>
          ${renderHighlightList(latest.highlights, "hero-points")}
        </div>

        <div class="hero-actions">
          <a class="button button-primary" href="${detailPrefix}${encodeURIComponent(latest.version)}">최신 버전 보기</a>
          <a class="button button-secondary" href="${supportLink}">지원 페이지</a>
        </div>
      </div>

      <div class="hero-visual">
        ${renderShowcase(latest, true)}
      </div>
    </section>

    <section class="section-card archive-card">
      <div class="section-heading">
        <div>
          <p class="section-kicker">Version archive</p>
          <h2>버전별 업데이트</h2>
        </div>
        <span class="count-chip">${releases.length} release${releases.length > 1 ? "s" : ""}</span>
      </div>

      <div class="release-list">
        ${releases.map(renderReleaseCard).join("")}
      </div>
    </section>
  `;
}

function renderDetailPage(releases) {
  if (!updatesApp) return;

  const version = getReleaseVersion();
  const release = releases.find((item) => String(item.version) === String(version));

  if (!release) {
    document.title = "LiveNote Updates";
    updatesApp.innerHTML = `
      ${renderToolbar(true)}
      <section class="section-card empty-state">
        <p class="section-kicker">Version not found</p>
        <h1 class="empty-title">요청한 버전의 업데이트를 찾지 못했습니다.</h1>
        <p class="empty-text">확인하려는 버전이 아직 등록되지 않았거나 경로가 잘못되었을 수 있습니다.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="${backLink}">업데이트 목록</a>
          <a class="button button-secondary" href="${homeLink}">홈으로 이동</a>
        </div>
      </section>
    `;
    return;
  }

  document.title = `LiveNote ${release.version}`;

  updatesApp.innerHTML = `
    ${renderToolbar(true)}

    <section class="section-card updates-hero updates-hero-detail">
      <div class="hero-copy">
        <p class="hero-kicker">${escapeHtml(release.eyebrow || "Version note")}</p>

        <div class="hero-meta-row">
          <span class="status-pill">v${escapeHtml(release.version)}</span>
          <span class="hero-date">${escapeHtml(formatDate(release.date))}</span>
        </div>

        <h1 class="hero-title">${escapeHtml(release.headline || release.title)}</h1>
        <p class="hero-summary">${escapeHtml(release.description || release.summary)}</p>
        ${renderHighlightList(release.highlights, "hero-points")}

        <div class="hero-actions">
          <a class="button button-primary" href="${backLink}">업데이트 목록</a>
          <a class="button button-secondary" href="${supportLink}">지원 페이지</a>
        </div>
      </div>

      <div class="hero-visual">
        ${renderShowcase(release, false)}
      </div>
    </section>

    <section class="detail-grid">
      <article class="section-card detail-main">
        <div class="section-heading">
          <div>
            <p class="section-kicker">What changed</p>
            <h2>${escapeHtml(release.title)}</h2>
          </div>
        </div>

        ${renderSections(release.sections)}
      </article>

      <aside class="detail-side">
        <section class="section-card detail-aside-card">
          <p class="section-kicker">Release note</p>
          ${renderFactRows(release)}
        </section>

        <section class="section-card detail-aside-card">
          <p class="section-kicker">Why it matters</p>
          ${renderHighlightList(release.notes, "note-list")}
        </section>
      </aside>
    </section>
  `;
}

async function bootUpdates() {
  if (!updatesApp) return;

  try {
    const response = await fetch(updatesPath, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Could not load updates");
    }

    const payload = await response.json();
    const releases = normalizeReleases(payload);

    if (pageMode === "updates-detail") {
      renderDetailPage(releases);
      return;
    }

    renderListPage(releases);
  } catch (_error) {
    updatesApp.innerHTML = `
      ${renderToolbar(pageMode === "updates-detail")}
      <section class="section-card empty-state">
        <p class="section-kicker">Load failed</p>
        <h1 class="empty-title">업데이트를 불러오지 못했습니다.</h1>
        <p class="empty-text">잠시 후 다시 시도해 주세요.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="${homeLink}">홈으로 이동</a>
          <a class="button button-secondary" href="${supportLink}">지원 페이지</a>
        </div>
      </section>
    `;
  }
}

bootUpdates();
