# 🔢 MatDis AI — Matematika Diskrit E-Learning

Platform cerdas pembelajaran **Matematika Diskrit** berbasis AI dengan personalisasi jalur belajar.

---

## 🚀 Tech Stack

| Layer        | Teknologi                  |
| ------------ | -------------------------- |
| Frontend     | HTML, CSS, Vanilla JS      |
| Database     | Firebase Realtime Database |
| Auth         | Firebase Authentication    |
| File Storage | Cloudinary                 |
| Hosting      | Vercel (via GitHub)        |

---

## 📁 Struktur File

```
matdis-ai/
├── index.html              ← Halaman Login & Register
├── dashboard-mhs.html      ← Dashboard Mahasiswa
├── dashboard-dosen.html    ← Dashboard Dosen
├── style.css               ← Semua styling (light/dark mode)
├── vercel.json             ← Konfigurasi deploy Vercel
├── js/
│   ├── config.js           ← 🔧 Firebase & Cloudinary config (EDIT INI DULU!)
│   ├── auth.js             ← Login & Register logic
│   ├── auth-guard.js       ← Auth guard (Satpam) + navigasi
│   ├── questions.js        ← Bank soal lengkap (4 topik × 20 soal)
│   ├── dashboard-mhs.js    ← Logika mahasiswa (diagnostic, latihan, AI)
│   └── dashboard-dosen.js  ← Logika dosen (monitor kelas, aktivitas)
└── README.md
```

---

## ⚙️ Cara Setup & Deploy

### LANGKAH 1 — Setup Firebase

1. Buka [console.firebase.google.com](https://console.firebase.google.com)
2. Buat project baru (misal: `matdis-ai`)
3. **Authentication** → Sign-in method → Aktifkan **Email/Password**
4. **Realtime Database** → Buat database → Mode **Test** (untuk development)
5. **Project Settings** → Salin `firebaseConfig`

**Edit file `js/config.js`:**

```javascript
const FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",
  authDomain: "matdis-ai.firebaseapp.com",
  databaseURL: "https://matdis-ai-default-rtdb.firebaseio.com",
  projectId: "matdis-ai",
  storageBucket: "matdis-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};
```

### LANGKAH 2 — Setup Cloudinary

1. Daftar di [cloudinary.com](https://cloudinary.com) (gratis)
2. Buka **Settings → Upload**
3. Scroll ke **Upload Presets** → Tambah preset baru
4. Set **Signing Mode**: Unsigned
5. Salin Cloud Name dan Upload Preset name

**Edit `js/config.js`:**

```javascript
const CLOUDINARY_CONFIG = {
  cloudName: "your-cloud-name",
  uploadPreset: "your-preset-name",
};
```

### LANGKAH 3 — Firebase Database Rules (Penting!)

Di Firebase Console → Realtime Database → Rules, ganti dengan:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && (auth.uid == $uid || root.child('users').child(auth.uid).child('role').val() == 'dosen')",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "activities": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### LANGKAH 4 — Upload ke GitHub

```bash
git init
git add .
git commit -m "Initial commit — MatDis AI"
git branch -M main
git remote add origin https://github.com/USERNAME/matdis-ai.git
git push -u origin main
```

### LANGKAH 5 — Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → Login dengan GitHub
2. Klik **New Project** → Import repo `matdis-ai`
3. Framework Preset: **Other** (karena ini static HTML)
4. Klik **Deploy**
5. Selesai! Website kamu online otomatis setiap kali push ke GitHub.

---

## 👤 Fitur Mahasiswa

| Fitur                 | Deskripsi                                                |
| --------------------- | -------------------------------------------------------- |
| **Dashboard**         | Ringkasan jalur belajar, skor, streak                    |
| **Peta Topik**        | 4 topik (Logika, Relasi, Graf, Kombinatorik) + bank soal |
| **Diagnostik**        | 8 soal AI → peta kelemahan otomatis                      |
| **Profil Penguasaan** | Radar chart per topik                                    |
| **Rekomendasi AI**    | Rencana belajar personal + estimasi waktu                |
| **Latihan**           | 10 soal random + pembahasan instan                       |

## 👨‍🏫 Fitur Dosen

| Fitur                 | Deskripsi                                     |
| --------------------- | --------------------------------------------- |
| **Dashboard Kelas**   | Monitor semua topik, AI tandai topik terlemah |
| **Monitor Mahasiswa** | Tabel skor per mahasiswa + filter/search      |
| **Aktivitas**         | Log real-time login & kuis + leaderboard      |

---

## 🎨 Design Features

- ✅ Light / Dark Mode
- ✅ Fully Responsive (Mobile & Desktop)
- ✅ Smooth Animations
- ✅ Auth Guard (Role-based access)

---

Made with ❤️ — MatDis AI
