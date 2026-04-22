/* eslint-disable */
// =============================================
// js/auth-guard.js — Auth Guard (Satpam)
// Harus diload di setiap dashboard page
// =============================================

let currentUser = null;
let currentUserData = null;

// Deteksi halaman mana yang sedang aktif
const PAGE_ROLE = {
  "dashboard-mhs.html": "mahasiswa",
  "dashboard-dosen.html": "dosen",
};

const currentPage = window.location.pathname.split("/").pop();
const requiredRole = PAGE_ROLE[currentPage];

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    // Belum login — redirect ke login
    window.location.href = "index.html";
    return;
  }

  const snap = await db.ref(`users/${user.uid}`).get();
  if (!snap.exists()) {
    auth.signOut();
    window.location.href = "index.html";
    return;
  }

  const userData = snap.val();

  // Cek role
  if (requiredRole && userData.role !== requiredRole) {
    // Role tidak sesuai — redirect ke dashboard yang benar
    if (userData.role === "dosen") window.location.href = "dashboard-dosen.html";
    else window.location.href = "dashboard-mhs.html";
    return;
  }

  currentUser = user;
  currentUserData = userData;

  // Isi navbar
  const initial = userData.name ? userData.name.charAt(0).toUpperCase() : "U";
  document.getElementById("nav-avatar").textContent = initial;
  document.getElementById("nav-username").textContent = userData.name.split(" ")[0];
  document.getElementById("drop-avatar").textContent = initial;
  document.getElementById("drop-name").textContent = userData.name;
  document.getElementById("drop-email").textContent = userData.email;

  // Trigger init function jika ada
  if (typeof initDashboard === "function") initDashboard(userData);
  if (typeof initDosenDashboard === "function") initDosenDashboard(userData);
});

// ── Logout ──
async function handleLogout() {
  if (currentUser && currentUserData) {
    await db.ref("activities").push({
      uid: currentUser.uid,
      name: currentUserData.name,
      nim: currentUserData.nim || "-",
      role: currentUserData.role,
      action: "logout",
      timestamp: new Date().toISOString(),
    });
  }
  await auth.signOut();
  window.location.href = "index.html";
}

// ── Theme Toggle ──
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", isDark ? "light" : "dark");
  document.getElementById("theme-icon").className = isDark ? "fas fa-moon" : "fas fa-sun";
  localStorage.setItem("theme", isDark ? "light" : "dark");
}

// Apply saved theme
(function () {
  const saved = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  const icon = document.getElementById("theme-icon");
  if (icon) icon.className = saved === "dark" ? "fas fa-sun" : "fas fa-moon";
})();

// ── Profile Dropdown ──
function toggleProfileMenu() {
  document.getElementById("profile-dropdown").classList.toggle("open");
}
document.addEventListener("click", (e) => {
  const dropdown = document.getElementById("profile-dropdown");
  const navProfile = document.querySelector(".nav-profile");
  if (dropdown && navProfile && !navProfile.contains(e.target)) {
    dropdown.classList.remove("open");
  }
});

// ── Mobile Nav ──
function toggleMobileNav() {
  document.getElementById("nav-menu").classList.toggle("mobile-open");
}

// ── Page Navigation (Mahasiswa) ──
function showPage(pageId, btn) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("active"));
  const page = document.getElementById("page-" + pageId);
  if (page) page.classList.add("active");
  if (btn) btn.classList.add("active");
  document.getElementById("nav-menu").classList.remove("mobile-open");

  // Trigger lazy loads
  if (pageId === "profil-penguasaan" && typeof renderRadarChart === "function") renderRadarChart();
  if (pageId === "rekomendasi" && typeof renderAIRekomendasi === "function") renderAIRekomendasi();
}

// ── Page Navigation (Dosen) ──
function showDosenPage(pageId, btn) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("active"));
  const page = document.getElementById("page-" + pageId);
  if (page) page.classList.add("active");
  if (btn) btn.classList.add("active");
  document.getElementById("nav-menu").classList.remove("mobile-open");

  if (pageId === "dosen-aktivitas" && typeof renderAktivitasPage === "function") renderAktivitasPage();
  if (pageId === "dosen-monitor" && typeof renderMonitorPage === "function") renderMonitorPage();
}
