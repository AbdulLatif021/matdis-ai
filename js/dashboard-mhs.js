/* eslint-disable */
// =============================================
// js/dashboard-mhs.js — Logika Mahasiswa
// =============================================

let userData = null;
let radarChart = null;

// ── INIT ──
function initDashboard(data) {
  userData = data;
  document.getElementById("welcome-name").textContent = data.name.split(" ")[0];
  renderStats();
  renderLearningPath();
  renderAIInsightDashboard();
  renderRecentActivity();
  renderTopicsGrid();
  renderTopicDetailList();
  renderProfileInfo();
}

// ── STATS ──
function renderStats() {
  const scores = userData.scores || { logika: 0, relasi: 0, graf: 0, kombinatorik: 0 };
  const vals = Object.values(scores);
  const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  const level = avg >= 80 ? "Mahir" : avg >= 60 ? "Menengah" : avg >= 40 ? "Dasar" : "Pemula";

  document.getElementById("stat-score").textContent = avg + "%";
  document.getElementById("stat-done").textContent = userData.latihan_count || 0;
  document.getElementById("stat-streak").textContent = (userData.streak || 0) + " hari";
  document.getElementById("stat-level").textContent = level;
}

// ── LEARNING PATH ──
function renderLearningPath() {
  const scores = userData.scores || {};
  const order = ["logika", "relasi", "graf", "kombinatorik"];
  const container = document.getElementById("learning-path");
  container.innerHTML = order
    .map((t) => {
      const score = scores[t] || 0;
      const topic = TOPICS[t];
      const status = score >= 70 ? "Selesai" : score > 0 ? "Sedang" : "Belum";
      const statusColor = status === "Selesai" ? "#10b981" : status === "Sedang" ? "#f59e0b" : "#94a3b8";
      const badgeClass = status === "Selesai" ? "badge-green" : status === "Sedang" ? "badge-orange" : "badge-gray";
      return `
      <div class="path-item">
        <div class="path-dot" style="background:${topic.color}"></div>
        <div class="path-info">
          <strong>${topic.name}</strong>
          <small>${score}% dikuasai</small>
        </div>
        <span class="path-badge" style="background:${statusColor}22;color:${statusColor}">${status}</span>
      </div>
    `;
    })
    .join("");
}

// ── AI INSIGHT DASHBOARD ──
function renderAIInsightDashboard() {
  const scores = userData.scores || {};
  const topicNames = Object.keys(scores);
  const weakest = topicNames.reduce((a, b) => (scores[a] < scores[b] ? a : b));
  const strongest = topicNames.reduce((a, b) => (scores[a] > scores[b] ? a : b));
  const avgScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / topicNames.length);

  const insights = [
    avgScore < 50
      ? `<div class="ai-card warning"><p>🧠 <strong>AI Insight:</strong> Skor rata-ratamu masih ${avgScore}%. Mulai dari tes diagnostik untuk mendapatkan jalur belajar personal.</p></div>`
      : `<div class="ai-card success"><p>🎉 <strong>AI Insight:</strong> Rata-rata skormu ${avgScore}% — kamu dalam jalur yang baik!</p></div>`,
    `<div class="ai-card"><p>📌 Topik yang perlu perhatian lebih: <strong>${TOPICS[weakest].name}</strong> (${scores[weakest]}%).</p></div>`,
    `<div class="ai-card"><p>⭐ Topik terkuatmu: <strong>${TOPICS[strongest].name}</strong> (${scores[strongest]}%). Pertahankan!</p></div>`,
  ];
  document.getElementById("ai-insight-dashboard").innerHTML = insights.join("");
}

// ── RECENT ACTIVITY ──
function renderRecentActivity() {
  if (!currentUser) return;
  db.ref("activities")
    .orderByChild("uid")
    .equalTo(currentUser.uid)
    .limitToLast(5)
    .once("value", (snap) => {
      const items = [];
      snap.forEach((child) => items.unshift(child.val()));
      const container = document.getElementById("recent-activity");
      if (items.length === 0) {
        container.innerHTML = '<p class="empty-state">Belum ada aktivitas. Mulai latihan sekarang!</p>';
        return;
      }
      container.innerHTML = items
        .map((act) => {
          const icon = act.action === "quiz" ? "fa-pen" : act.action === "diagnostic" ? "fa-stethoscope" : "fa-sign-in-alt";
          const iconBg = act.action === "quiz" ? "#dbeafe" : act.action === "diagnostic" ? "#ede9fe" : "#d1fae5";
          const iconColor = act.action === "quiz" ? "#3b82f6" : act.action === "diagnostic" ? "#8b5cf6" : "#10b981";
          const time = new Date(act.timestamp).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
          return `
          <div class="activity-item">
            <div class="activity-icon" style="background:${iconBg};color:${iconColor}">
              <i class="fas ${icon}"></i>
            </div>
            <div class="activity-info">
              <strong>${act.action === "quiz" ? "Latihan " + (act.topic ? TOPICS[act.topic]?.name : "") : act.action === "diagnostic" ? "Tes Diagnostik" : "Login"}</strong>
              <small>${time}</small>
            </div>
            ${act.score !== undefined ? `<span class="activity-score">${act.score}%</span>` : ""}
          </div>
        `;
        })
        .join("");
    });
}

// ── TOPICS GRID ──
function renderTopicsGrid() {
  const scores = userData.scores || {};
  const container = document.getElementById("topics-grid");
  container.innerHTML = Object.entries(TOPICS)
    .map(([key, t]) => {
      const score = scores[key] || 0;
      return `
      <div class="topic-card" onclick="showPage('latihan', null); startLatihan('${key}')">
        <div class="topic-card-top">
          <div class="topic-big-icon" style="background:${t.gradient}"><i class="${t.icon}"></i></div>
          <div>
            <h3>${t.name}</h3>
            <p>${t.desc}</p>
          </div>
        </div>
        <div class="topic-card-body">
          <div class="topic-progress-label"><span>Penguasaan</span><span>${score}%</span></div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${score}%;background:${t.gradient}"></div>
          </div>
          <div class="topic-tags">${t.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        </div>
        <div class="topic-footer">
          <span><i class="fas fa-question-circle"></i> 20 soal tersedia</span>
          <button class="btn-sm btn-blue" style="background:${t.color}22;color:${t.color}">Latihan →</button>
        </div>
      </div>
    `;
    })
    .join("");
}

// ─────────────────────────────
// DIAGNOSTIC
// ─────────────────────────────
let diagAnswers = {};
let diagCurrentQ = 0;
const diagQuestions = DIAGNOSTIC_QUESTIONS;

function startDiagnostic() {
  diagAnswers = {};
  diagCurrentQ = 0;
  document.getElementById("diag-intro").style.display = "none";
  document.getElementById("diag-quiz").style.display = "block";
  renderDiagQ();
}

function renderDiagQ() {
  const q = diagQuestions[diagCurrentQ];
  document.getElementById("diag-q-num").textContent = `Soal ${diagCurrentQ + 1} dari ${diagQuestions.length}`;
  document.getElementById("diag-topic-tag").textContent = TOPICS[q.topic].name;
  document.getElementById("diag-progress").style.width = `${(diagCurrentQ / diagQuestions.length) * 100}%`;
  document.getElementById("diag-question").textContent = q.q;

  const letters = ["A", "B", "C", "D"];
  document.getElementById("diag-options").innerHTML = q.opts
    .map(
      (opt, i) => `
    <button class="option-btn ${diagAnswers[diagCurrentQ] === i ? "selected" : ""}" onclick="selectDiagOpt(${i})">
      <span class="option-letter">${letters[i]}</span> ${opt}
    </button>
  `,
    )
    .join("");

  const isLast = diagCurrentQ === diagQuestions.length - 1;
  document.getElementById("diag-next-btn").textContent = isLast ? "Selesai & Lihat Hasil" : "Selanjutnya →";
  document.getElementById("diag-next-btn").innerHTML = isLast ? 'Selesai & Lihat Hasil <i class="fas fa-check"></i>' : 'Selanjutnya <i class="fas fa-arrow-right"></i>';
}

function selectDiagOpt(i) {
  diagAnswers[diagCurrentQ] = i;
  renderDiagQ();
}

function nextDiagQ() {
  if (diagAnswers[diagCurrentQ] === undefined) {
    alert("Pilih jawaban terlebih dahulu.");
    return;
  }
  if (diagCurrentQ < diagQuestions.length - 1) {
    diagCurrentQ++;
    renderDiagQ();
  } else {
    submitDiagnostic();
  }
}

function prevDiagQ() {
  if (diagCurrentQ > 0) {
    diagCurrentQ--;
    renderDiagQ();
  }
}

async function submitDiagnostic() {
  // Hitung skor per topik
  const topicScores = { logika: [], relasi: [], graf: [], kombinatorik: [] };
  diagQuestions.forEach((q, i) => {
    const correct = diagAnswers[i] === q.ans ? 1 : 0;
    topicScores[q.topic].push(correct);
  });

  const finalScores = {};
  Object.keys(topicScores).forEach((t) => {
    const arr = topicScores[t];
    finalScores[t] = arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) : 0;
  });

  const totalCorrect = Object.values(diagAnswers).filter((ans, i) => ans === diagQuestions[i].ans).length;
  const totalScore = Math.round((totalCorrect / diagQuestions.length) * 100);

  // Simpan ke Firebase
  await db.ref(`users/${currentUser.uid}`).update({
    scores: finalScores,
    diagnostic_done: true,
    diagnostic_score: totalScore,
    diagnostic_date: new Date().toISOString(),
  });

  await db.ref("activities").push({
    uid: currentUser.uid,
    name: userData.name,
    nim: userData.nim || "-",
    role: "mahasiswa",
    action: "diagnostic",
    score: totalScore,
    scores: finalScores,
    timestamp: new Date().toISOString(),
  });

  userData.scores = finalScores;
  renderDiagResult(finalScores, totalCorrect, totalScore);
}

function renderDiagResult(finalScores, correct, total) {
  document.getElementById("diag-quiz").style.display = "none";
  const result = document.getElementById("diag-result");
  result.style.display = "block";

  const weakest = Object.entries(finalScores).reduce((a, b) => (a[1] < b[1] ? a : b));
  const ai =
    total >= 75
      ? "Hasilmu sangat baik! AI merekomendasikan untuk memperdalam topik-topik yang masih di bawah 70% dan menjaga konsistensi belajar."
      : total >= 50
        ? `Kamu sudah memiliki dasar yang cukup. Fokuskan latihan pada <strong>${TOPICS[weakest[0]].name}</strong> yang masih ${weakest[1]}%.`
        : `AI mendeteksi beberapa area yang perlu diperkuat, terutama <strong>${TOPICS[weakest[0]].name}</strong>. Mulailah dari materi dasar topik ini.`;

  result.innerHTML = `
    <div class="result-header">
      <div class="result-score-circle">${total}<small>/ 100</small></div>
      <h3>Tes Diagnostik Selesai!</h3>
      <p style="color:var(--text2)">${correct} dari ${DIAGNOSTIC_QUESTIONS.length} soal benar</p>
    </div>
    <h4 style="margin-bottom:.75rem;font-size:.95rem">Peta Kelemahan per Topik</h4>
    <div class="weakness-map">
      ${Object.entries(finalScores)
        .map(
          ([t, s]) => `
        <div class="weakness-item">
          <span class="weakness-label">${TOPICS[t].name}</span>
          <div class="weakness-bar">
            <div class="weakness-fill" style="width:${s}%;background:${TOPICS[t].color}"></div>
          </div>
          <span class="weakness-pct" style="color:${TOPICS[t].color}">${s}%</span>
        </div>
      `,
        )
        .join("")}
    </div>
    <div class="ai-card" style="margin-top:1.25rem">
      <p>🤖 <strong>Analisis AI:</strong> ${ai}</p>
    </div>
    <div style="display:flex;gap:1rem;margin-top:1.5rem;flex-wrap:wrap">
      <button class="btn-primary" onclick="showPage('rekomendasi', null); document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active')); document.querySelector('[data-page=rekomendasi]').classList.add('active')">
        <i class="fas fa-robot"></i> Lihat Rekomendasi AI
      </button>
      <button class="btn-outline" onclick="location.reload()">
        <i class="fas fa-redo"></i> Ulangi Tes
      </button>
    </div>
  `;

  renderStats();
  renderLearningPath();
  renderAIInsightDashboard();
}

// ─────────────────────────────
// PROFIL PENGUASAAN
// ─────────────────────────────
function renderTopicDetailList() {
  const scores = (userData && userData.scores) || { logika: 0, relasi: 0, graf: 0, kombinatorik: 0 };
  const container = document.getElementById("topic-detail-list");
  container.innerHTML = Object.entries(TOPICS)
    .map(([key, t]) => {
      const score = scores[key] || 0;
      return `
      <div class="topic-detail-item">
        <div class="topic-icon" style="background:${t.gradient}"><i class="${t.icon}"></i></div>
        <div class="detail-info">
          <strong>${t.name} — ${score}%</strong>
          <div class="mini-bar"><div class="mini-fill" style="width:${score}%;background:${t.gradient}"></div></div>
        </div>
        <span class="detail-pct" style="color:${t.color}">${score < 40 ? "🔴" : score < 70 ? "🟡" : "🟢"}</span>
      </div>
    `;
    })
    .join("");
}

function renderProfileInfo() {
  const container = document.getElementById("profile-info-box");
  if (!userData) return;
  const rows = [
    ["Nama", userData.name],
    ["Email", userData.email],
    ["NIM", userData.nim || "-"],
    ["Diagnostik", userData.diagnostic_done ? "Sudah" : "Belum"],
    ["Latihan Selesai", userData.latihan_count || 0],
  ];
  container.innerHTML = rows
    .map(
      ([k, v]) => `
    <div class="profile-row"><span>${k}</span><span>${v}</span></div>
  `,
    )
    .join("");
}

function renderRadarChart() {
  const scores = (userData && userData.scores) || { logika: 0, relasi: 0, graf: 0, kombinatorik: 0 };
  const ctx = document.getElementById("radar-chart");
  if (!ctx) return;
  if (radarChart) radarChart.destroy();
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  radarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Logika", "Relasi & Fungsi", "Teori Graf", "Kombinatorik"],
      datasets: [
        {
          label: "Penguasaan (%)",
          data: [scores.logika || 0, scores.relasi || 0, scores.graf || 0, scores.kombinatorik || 0],
          borderColor: "#6366f1",
          backgroundColor: "rgba(99,102,241,0.2)",
          pointBackgroundColor: "#6366f1",
          pointRadius: 5,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { stepSize: 20, color: isDark ? "#94a3b8" : "#64748b" },
          grid: { color: isDark ? "#334155" : "#e2e8f0" },
          pointLabels: { color: isDark ? "#f1f5f9" : "#1e293b", font: { size: 12 } },
        },
      },
      plugins: { legend: { display: false } },
    },
  });
}

// ─────────────────────────────
// REKOMENDASI AI
// ─────────────────────────────
function renderAIRekomendasi() {
  const scores = (userData && userData.scores) || { logika: 0, relasi: 0, graf: 0, kombinatorik: 0 };
  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  const avg = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 4);

  setTimeout(() => {
    document.getElementById("ai-rec-loading").style.display = "none";
    const content = document.getElementById("ai-rec-content");
    content.style.display = "block";

    const plans = sorted.map(([t, s], idx) => {
      const priority = ["Sangat Tinggi", "Tinggi", "Sedang", "Rendah"][idx];
      const time = s < 30 ? "2-3 minggu" : s < 60 ? "1-2 minggu" : s < 80 ? "3-5 hari" : "Review saja";
      return { topic: t, score: s, priority, time };
    });

    content.innerHTML = `
      <div class="two-col" style="margin-bottom:1rem">
        <div class="stat-card accent-purple">
          <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
          <div class="stat-info"><h3>${avg}%</h3><p>Rata-rata Penguasaan</p></div>
        </div>
        <div class="stat-card accent-orange">
          <div class="stat-icon"><i class="fas fa-flag"></i></div>
          <div class="stat-info"><h3>${TOPICS[sorted[0][0]].name}</h3><p>Prioritas Utama</p></div>
        </div>
      </div>

      <div class="rec-plan-card">
        <h4><i class="fas fa-road"></i> Rencana Belajar Personal</h4>
        ${plans
          .map(
            (p, i) => `
          <div class="rec-step">
            <div class="step-num">${i + 1}</div>
            <div>
              <p><strong>${TOPICS[p.topic].name}</strong> — Skor saat ini: ${p.score}%</p>
              <small>Prioritas: ${p.priority} | Estimasi waktu: ${p.time}</small>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>

      <div class="rec-plan-card">
        <h4><i class="fas fa-lightbulb"></i> Tips AI untuk Kamu</h4>
        <div class="ai-card">
          <p>📅 <strong>Jadwalkan sesi belajar 30 menit per hari</strong> — konsistensi lebih efektif daripada belajar marathon.</p>
        </div>
        <div class="ai-card">
          <p>🔁 <strong>Ulangi topik lemah setiap 2 hari</strong> menggunakan teknik spaced repetition untuk memori jangka panjang.</p>
        </div>
        <div class="ai-card ${avg >= 70 ? "success" : "warning"}">
          <p>${avg >= 70 ? "🎯 Kamu sudah di atas rata-rata! Tantang dirimu dengan soal-soal tingkat lanjut." : "⚡ Mulai sekarang dengan topik paling lemah dan kerjakan minimal 5 soal per sesi."}</p>
        </div>
      </div>

      <button class="btn-primary" onclick="showPage('latihan', null); document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active')); document.querySelector('[data-page=latihan]').classList.add('active')">
        <i class="fas fa-pen-nib"></i> Mulai Latihan Sekarang
      </button>
    `;
  }, 1500);
}

// ─────────────────────────────
// LATIHAN
// ─────────────────────────────
let latihanQuestions = [];
let latihanCurrentQ = 0;
let latihanTopic = "";
let latihanAnswers = {};
let latihanScore = 0;

function startLatihan(topic) {
  latihanTopic = topic;
  latihanQuestions = getRandomQuestions(topic, 10);
  latihanCurrentQ = 0;
  latihanAnswers = {};
  latihanScore = 0;

  document.getElementById("latihan-home").style.display = "none";
  document.getElementById("latihan-result").style.display = "none";
  document.getElementById("latihan-quiz").style.display = "block";
  document.getElementById("lat-topic-title").textContent = TOPICS[topic].name;

  renderLatihanQ();
}

function renderLatihanQ() {
  const q = latihanQuestions[latihanCurrentQ];
  document.getElementById("lat-q-num").textContent = `Soal ${latihanCurrentQ + 1} dari ${latihanQuestions.length}`;
  document.getElementById("lat-progress").style.width = `${(latihanCurrentQ / latihanQuestions.length) * 100}%`;
  document.getElementById("lat-question").textContent = q.q;

  const letters = ["A", "B", "C", "D"];
  document.getElementById("lat-options").innerHTML = q.opts
    .map(
      (opt, i) => `
    <button class="option-btn" onclick="selectLatihanOpt(${i})" id="lat-opt-${i}">
      <span class="option-letter">${letters[i]}</span> ${opt}
    </button>
  `,
    )
    .join("");

  document.getElementById("lat-feedback").style.display = "none";
  document.getElementById("lat-next-btn").style.display = "none";
}

function selectLatihanOpt(chosen) {
  if (latihanAnswers[latihanCurrentQ] !== undefined) return; // sudah dijawab
  latihanAnswers[latihanCurrentQ] = chosen;

  const q = latihanQuestions[latihanCurrentQ];
  const correct = q.ans;
  const isCorrect = chosen === correct;
  if (isCorrect) latihanScore++;

  // Tandai pilihan
  document.querySelectorAll(".option-btn").forEach((btn, i) => {
    if (i === correct) btn.classList.add("correct");
    else if (i === chosen && !isCorrect) btn.classList.add("wrong");
    btn.disabled = true;
  });

  // Feedback
  const fb = document.getElementById("lat-feedback");
  fb.className = `feedback-box ${isCorrect ? "correct" : "wrong"}`;
  fb.innerHTML = `${isCorrect ? "✅ Benar!" : "❌ Salah!"}<br><strong>Pembahasan:</strong> ${q.exp}`;
  fb.style.display = "block";

  // Tombol next
  document.getElementById("lat-next-btn").style.display = "inline-flex";
  const isLast = latihanCurrentQ === latihanQuestions.length - 1;
  document.getElementById("lat-next-btn").innerHTML = isLast ? 'Lihat Hasil <i class="fas fa-trophy"></i>' : 'Soal Berikutnya <i class="fas fa-arrow-right"></i>';
}

async function nextLatihanQ() {
  if (latihanCurrentQ < latihanQuestions.length - 1) {
    latihanCurrentQ++;
    renderLatihanQ();
  } else {
    await submitLatihan();
  }
}

async function submitLatihan() {
  const total = latihanQuestions.length;
  const scorePercent = Math.round((latihanScore / total) * 100);

  // Update skor topik di Firebase
  const currentTopicScore = (userData.scores || {})[latihanTopic] || 0;
  const newScore = Math.max(scorePercent, currentTopicScore);
  const newCount = (userData.latihan_count || 0) + 1;

  await db.ref(`users/${currentUser.uid}`).update({
    [`scores/${latihanTopic}`]: newScore,
    latihan_count: newCount,
  });

  await db.ref("activities").push({
    uid: currentUser.uid,
    name: userData.name,
    nim: userData.nim || "-",
    role: "mahasiswa",
    action: "quiz",
    topic: latihanTopic,
    score: scorePercent,
    timestamp: new Date().toISOString(),
  });

  userData.scores = userData.scores || {};
  userData.scores[latihanTopic] = newScore;
  userData.latihan_count = newCount;

  document.getElementById("latihan-quiz").style.display = "none";
  renderLatihanResult(scorePercent, total);
}

function renderLatihanResult(score, total) {
  const result = document.getElementById("latihan-result");
  result.style.display = "block";
  const emoji = score >= 80 ? "🎉" : score >= 60 ? "👍" : "💪";
  const msg = score >= 80 ? "Luar biasa! Penguasaanmu sangat baik." : score >= 60 ? "Cukup baik! Terus latihan untuk meningkatkan skor." : "Jangan menyerah! Review materi dan coba lagi.";

  result.innerHTML = `
    <div class="latihan-result-card">
      <div class="result-score-circle">${score}<small>%</small></div>
      <h3>${emoji} ${msg}</h3>
      <p style="color:var(--text2);margin:.5rem 0">${latihanScore} dari ${total} soal benar</p>
      <p style="color:var(--text2);font-size:.85rem">Topik: <strong>${TOPICS[latihanTopic].name}</strong></p>
      <div style="display:flex;gap:1rem;justify-content:center;margin-top:1.5rem;flex-wrap:wrap">
        <button class="btn-primary" onclick="startLatihan('${latihanTopic}')">
          <i class="fas fa-redo"></i> Ulangi
        </button>
        <button class="btn-outline" onclick="backToLatihanHome()">
          <i class="fas fa-home"></i> Pilih Topik Lain
        </button>
      </div>
    </div>
  `;

  renderStats();
  renderTopicDetailList();
}

function backToLatihanHome() {
  document.getElementById("latihan-home").style.display = "block";
  document.getElementById("latihan-quiz").style.display = "none";
  document.getElementById("latihan-result").style.display = "none";
}
