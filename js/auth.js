/* eslint-disable */
// =============================================
// js/auth.js — Login & Register Logic
// =============================================

function switchTab(tab) {
  document.getElementById("form-login").classList.toggle("hidden", tab !== "login");
  document.getElementById("form-register").classList.toggle("hidden", tab !== "register");
  document.getElementById("tab-login").classList.toggle("active", tab === "login");
  document.getElementById("tab-register").classList.toggle("active", tab === "register");
}

function togglePass(id, icon) {
  const input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

function showLoading(show) {
  document.getElementById("auth-loading").style.display = show ? "flex" : "none";
}

function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(() => {
    el.style.display = "none";
  }, 4000);
}

function showSuccess(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = "block";
}

// ── LOGIN ──
async function handleLogin() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email || !password) return showError("login-error", "Email dan password wajib diisi.");

  showLoading(true);
  try {
    const cred = await auth.signInWithEmailAndPassword(email, password);
    const uid = cred.user.uid;

    // Ambil data user dari Realtime DB
    const snap = await db.ref(`users/${uid}`).get();
    if (!snap.exists()) throw new Error("Data user tidak ditemukan.");

    const userData = snap.val();

    // Update last_login
    await db.ref(`users/${uid}`).update({
      last_login: new Date().toISOString(),
    });

    // Log aktivitas
    await db.ref("activities").push({
      uid,
      name: userData.name,
      nim: userData.nim || "-",
      role: userData.role,
      action: "login",
      timestamp: new Date().toISOString(),
    });

    // Redirect berdasarkan role
    if (userData.role === "dosen") {
      window.location.href = "dashboard-dosen.html";
    } else {
      window.location.href = "dashboard-mhs.html";
    }
  } catch (err) {
    showLoading(false);
    let msg = "Login gagal. Periksa email dan password.";
    if (err.code === "auth/user-not-found") msg = "Akun tidak ditemukan.";
    if (err.code === "auth/wrong-password") msg = "Password salah.";
    if (err.code === "auth/invalid-email") msg = "Format email tidak valid.";
    if (err.code === "auth/too-many-requests") msg = "Terlalu banyak percobaan. Coba lagi nanti.";
    showError("login-error", msg);
  }
}

// ── REGISTER ──
async function handleRegister() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const nim = document.getElementById("reg-nim").value.trim();
  const role = document.getElementById("reg-role").value;
  const password = document.getElementById("reg-password").value;

  if (!name || !email || !nim || !role || !password) return showError("reg-error", "Semua field wajib diisi.");
  if (password.length < 6) return showError("reg-error", "Password minimal 6 karakter.");

  showLoading(true);
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    const uid = cred.user.uid;

    // Simpan ke Realtime DB
    await db.ref(`users/${uid}`).set({
      uid,
      name,
      email,
      nim,
      role,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      scores: { logika: 0, relasi: 0, graf: 0, kombinatorik: 0 },
      diagnostic_done: false,
      latihan_count: 0,
      streak: 0,
    });

    showLoading(false);
    showSuccess("reg-success", "Akun berhasil dibuat! Silakan login.");
    setTimeout(() => switchTab("login"), 2000);
  } catch (err) {
    showLoading(false);
    let msg = "Registrasi gagal.";
    if (err.code === "auth/email-already-in-use") msg = "Email sudah terdaftar.";
    if (err.code === "auth/invalid-email") msg = "Format email tidak valid.";
    if (err.code === "auth/weak-password") msg = "Password terlalu lemah.";
    showError("reg-error", msg);
  }
}

// ── Check if already logged in ──
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const snap = await db.ref(`users/${user.uid}`).get();
    if (snap.exists()) {
      const role = snap.val().role;
      if (role === "dosen") window.location.href = "dashboard-dosen.html";
      else window.location.href = "dashboard-mhs.html";
    }
  }
});

// ── Enter key support ──
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const loginForm = document.getElementById("form-login");
    const regForm = document.getElementById("form-register");
    if (!loginForm.classList.contains("hidden")) handleLogin();
    else if (!regForm.classList.contains("hidden")) handleRegister();
  }
});
