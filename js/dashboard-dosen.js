/* eslint-disable */
// =============================================
// js/dashboard-dosen.js — Logika Dosen
// =============================================

let dosenData = null;
let allMahasiswa = [];
let classBarChart = null;
let scoreDistChart = null;

function initDosenDashboard(data) {
  dosenData = data;
  loadAllMahasiswaData();
}

// ── Load semua data mahasiswa ──
async function loadAllMahasiswaData() {
  const snap = await db.ref("users").orderByChild("role").equalTo("mahasiswa").once("value");
  allMahasiswa = [];
  snap.forEach((child) => allMahasiswa.push(child.val()));

  document.getElementById("stat-total-mhs").textContent = allMahasiswa.length;
  const diagDone = allMahasiswa.filter((m) => m.diagnostic_done).length;
  document.getElementById("stat-active-mhs").textContent = diagDone;

  renderClassStats();
  renderClassBarChart();
  renderWeakTopics();
  renderAIIntervensi();
}

function renderClassStats() {
  if (!allMahasiswa.length) return;

  // Rata-rata kelas per topik
  const topics = ["logika", "relasi", "graf", "kombinatorik"];
  const topicAvgs = {};
  topics.forEach((t) => {
    const scores = allMahasiswa.map((m) => (m.scores && m.scores[t]) || 0);
    topicAvgs[t] = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  });

  const weakest = Object.entries(topicAvgs).reduce((a, b) => (a[1] < b[1] ? a : b));
  const avgAll = Math.round(Object.values(topicAvgs).reduce((a, b) => a + b, 0) / 4);

  document.getElementById("stat-weak-topic").textContent = TOPICS[weakest[0]].name;
  document.getElementById("stat-avg-score").textContent = avgAll + "%";
}

function renderClassBarChart() {
  if (!allMahasiswa.length) return;
  const topics = ["logika", "relasi", "graf", "kombinatorik"];
  const avgs = topics.map((t) => {
    const scores = allMahasiswa.map((m) => (m.scores && m.scores[t]) || 0);
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  });

  const ctx = document.getElementById("class-bar-chart");
  if (!ctx) return;
  if (classBarChart) classBarChart.destroy();

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  classBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Logika", "Relasi", "Graf", "Kombinatorik"],
      datasets: [
        {
          label: "Rata-rata Skor Kelas (%)",
          data: avgs,
          backgroundColor: ["rgba(59,130,246,0.7)", "rgba(16,185,129,0.7)", "rgba(139,92,246,0.7)", "rgba(245,158,11,0.7)"],
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: { color: isDark ? "#94a3b8" : "#64748b" },
          grid: { color: isDark ? "#334155" : "#e2e8f0" },
        },
        x: {
          ticks: { color: isDark ? "#94a3b8" : "#64748b" },
          grid: { display: false },
        },
      },
    },
  });
}

function renderWeakTopics() {
  const topics = ["logika", "relasi", "graf", "kombinatorik"];
  const container = document.getElementById("weak-topics-list");

  const topicData = topics
    .map((t) => {
      const scores = allMahasiswa.map((m) => (m.scores && m.scores[t]) || 0);
      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const weakCount = scores.filter((s) => s < 60).length;
      return { topic: t, avg, weakCount };
    })
    .sort((a, b) => a.avg - b.avg);

  container.innerHTML = topicData
    .map(({ topic, avg, weakCount }) => {
      const severity = avg < 40 ? "critical" : avg < 60 ? "warning" : "";
      const icon = avg < 40 ? "🔴" : avg < 60 ? "🟡" : "🟢";
      return `
      <div class="weak-topic-card ${severity}">
        <h4>${icon} ${TOPICS[topic].name}</h4>
        <p>Rata-rata: <strong>${avg}%</strong></p>
        <p>${weakCount} mahasiswa butuh bantuan</p>
        <div class="progress-bar" style="margin-top:.5rem">
          <div class="progress-fill" style="width:${avg}%;background:${TOPICS[topic].gradient}"></div>
        </div>
      </div>
    `;
    })
    .join("");
}

function renderAIIntervensi() {
  const topics = ["logika", "relasi", "graf", "kombinatorik"];
  const topicAvgs = {};
  topics.forEach((t) => {
    const scores = allMahasiswa.map((m) => (m.scores && m.scores[t]) || 0);
    topicAvgs[t] = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  });

  const sorted = Object.entries(topicAvgs).sort((a, b) => a[1] - b[1]);
  const [weakest, weak2] = sorted;
  const avgAll = Math.round(Object.values(topicAvgs).reduce((a, b) => a + b, 0) / 4);
  const diagDone = allMahasiswa.filter((m) => m.diagnostic_done).length;
  const diagPct = allMahasiswa.length ? Math.round((diagDone / allMahasiswa.length) * 100) : 0;

  const container = document.getElementById("ai-intervensi");
  container.innerHTML = `
    <div class="ai-card warning">
      <p>⚠️ <strong>AI Alert:</strong> Topik <strong>${TOPICS[weakest[0]].name}</strong> memiliki rata-rata ${weakest[1]}%. 
      Disarankan untuk mengadakan sesi remedial atau tutorial tambahan.</p>
    </div>
    <div class="ai-card">
      <p>📊 <strong>Rata-rata kelas:</strong> ${avgAll}% — 
      ${avgAll >= 70 ? "Kelas secara keseluruhan dalam kondisi baik." : "Masih ada ruang perbaikan yang signifikan."}</p>
    </div>
    <div class="ai-card">
      <p>📝 <strong>${diagPct}% mahasiswa</strong> sudah menyelesaikan tes diagnostik. 
      ${diagPct < 70 ? "Dorong mahasiswa lain untuk segera menyelesaikannya." : "Partisipasi sangat baik!"}</p>
    </div>
    ${
      weak2
        ? `<div class="ai-card">
      <p>🎯 Intervensi prioritas: <strong>${TOPICS[weakest[0]].name}</strong> dan <strong>${TOPICS[weak2[0]].name}</strong></p>
    </div>`
        : ""
    }
  `;
}

// ─────────────────────────────
// MONITOR MAHASISWA
// ─────────────────────────────
function renderMonitorPage() {
  renderMahasiswaTable(allMahasiswa);
}

function renderMahasiswaTable(data) {
  const tbody = document.getElementById("mahasiswa-tbody");
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center" style="color:var(--text3)">Belum ada mahasiswa terdaftar.</td></tr>';
    return;
  }

  tbody.innerHTML = data
    .map((m) => {
      const scores = m.scores || { logika: 0, relasi: 0, graf: 0, kombinatorik: 0 };
      const avg = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 4);
      const statusClass = m.diagnostic_done ? "status-done" : "status-pending";
      const statusText = m.diagnostic_done ? "Diagnostik ✓" : "Belum Diagnostik";

      const scoreCell = (s) => {
        const cls = s >= 70 ? "score-high" : s >= 40 ? "score-mid" : "score-low";
        return `<td class="score-cell ${cls}">${s}%</td>`;
      };

      return `
      <tr>
        <td><strong>${m.name}</strong></td>
        <td style="color:var(--text2)">${m.nim || "-"}</td>
        ${scoreCell(scores.logika || 0)}
        ${scoreCell(scores.relasi || 0)}
        ${scoreCell(scores.graf || 0)}
        ${scoreCell(scores.kombinatorik || 0)}
        ${scoreCell(avg)}
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
      </tr>
    `;
    })
    .join("");
}

function filterMahasiswa(query) {
  const filtered = allMahasiswa.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()) || (m.nim && m.nim.toLowerCase().includes(query.toLowerCase())));
  renderMahasiswaTable(filtered);
}

// ─────────────────────────────
// AKTIVITAS
// ─────────────────────────────
function renderAktivitasPage() {
  renderActivityLog();
  renderLeaderboard();
  renderScoreDistChart();
}

function renderActivityLog() {
  db.ref("activities")
    .orderByChild("timestamp")
    .limitToLast(30)
    .once("value", (snap) => {
      const logs = [];
      snap.forEach((child) => logs.unshift(child.val()));

      const container = document.getElementById("activity-log");
      if (!logs.length) {
        container.innerHTML = '<p class="empty-state">Belum ada aktivitas.</p>';
        return;
      }

      container.innerHTML = logs
        .map((log) => {
          const icon = log.action === "quiz" ? "fa-pen" : log.action === "diagnostic" ? "fa-stethoscope" : log.action === "login" ? "fa-sign-in-alt" : "fa-sign-out-alt";
          const iconBg = log.action === "quiz" ? "#dbeafe" : log.action === "diagnostic" ? "#ede9fe" : log.action === "login" ? "#d1fae5" : "#fee2e2";
          const iconColor = log.action === "quiz" ? "#3b82f6" : log.action === "diagnostic" ? "#8b5cf6" : log.action === "login" ? "#10b981" : "#ef4444";
          const time = new Date(log.timestamp).toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          });
          const actionLabel = log.action === "quiz" ? `Latihan ${log.topic ? TOPICS[log.topic]?.name : ""}` : log.action === "diagnostic" ? "Tes Diagnostik" : log.action === "login" ? "Login" : "Logout";

          return `
        <div class="log-item">
          <div class="log-icon" style="background:${iconBg};color:${iconColor}">
            <i class="fas ${icon}"></i>
          </div>
          <div class="log-info">
            <strong>${log.name || "–"} (${log.nim || "–"})</strong>
            <small>${actionLabel} ${log.score !== undefined ? `— Skor: ${log.score}%` : ""} • ${time}</small>
          </div>
        </div>
      `;
        })
        .join("");
    });
}

function renderLeaderboard() {
  const sorted = [...allMahasiswa]
    .filter((m) => m.scores)
    .map((m) => {
      const s = m.scores;
      const avg = Math.round(Object.values(s).reduce((a, b) => a + b, 0) / 4);
      return { ...m, avg };
    })
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 10);

  const medals = ["🥇", "🥈", "🥉"];
  const container = document.getElementById("leaderboard");
  container.innerHTML = sorted
    .map(
      (m, i) => `
    <div class="lb-item">
      <span class="lb-rank">${medals[i] || i + 1}</span>
      <div class="avatar" style="width:32px;height:32px;font-size:.8rem">${m.name.charAt(0)}</div>
      <span class="lb-name">${m.name} <small style="color:var(--text2)">${m.nim || ""}</small></span>
      <span class="lb-score">${m.avg}%</span>
    </div>
  `,
    )
    .join("");
}

function renderScoreDistChart() {
  const avgs = allMahasiswa.map((m) => {
    if (!m.scores) return 0;
    return Math.round(Object.values(m.scores).reduce((a, b) => a + b, 0) / 4);
  });

  const bins = { "0-39": 0, "40-59": 0, "60-79": 0, "80-100": 0 };
  avgs.forEach((s) => {
    if (s < 40) bins["0-39"]++;
    else if (s < 60) bins["40-59"]++;
    else if (s < 80) bins["60-79"]++;
    else bins["80-100"]++;
  });

  const ctx = document.getElementById("score-dist-chart");
  if (!ctx) return;
  if (scoreDistChart) scoreDistChart.destroy();

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  scoreDistChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["0-39 (Rendah)", "40-59 (Cukup)", "60-79 (Baik)", "80-100 (Sangat Baik)"],
      datasets: [
        {
          data: Object.values(bins),
          backgroundColor: ["rgba(239,68,68,0.8)", "rgba(245,158,11,0.8)", "rgba(59,130,246,0.8)", "rgba(16,185,129,0.8)"],
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: isDark ? "#f1f5f9" : "#1e293b", padding: 12, font: { size: 11 } },
        },
      },
    },
  });
}

// ── Real-time activity listener ──
function listenToActivities() {
  db.ref("activities")
    .limitToLast(1)
    .on("child_added", (snap) => {
      const log = snap.val();
      if (!log) return;
      // Re-render activity log jika halaman aktivitas aktif
      const activePage = document.querySelector(".page.active");
      if (activePage && activePage.id === "page-dosen-aktivitas") {
        renderActivityLog();
      }
    });
}

// Override initDosenDashboard to also start realtime listener
const _origInit = initDosenDashboard;
window.initDosenDashboard = function (data) {
  _origInit(data);
  listenToActivities();
};
