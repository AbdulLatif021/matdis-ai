/* eslint-disable */
// =============================================
// js/config.js — Firebase & Cloudinary Config
// GANTI nilai ini dengan project kamu sendiri
// =============================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD6WZsxnfOpzKgGa2Z1GkrEV79xebAESCA",
  authDomain: "matdis-ai.firebaseapp.com",
  databaseURL: "https://matdis-ai-default-rtdb.firebaseio.com",
  projectId: "matdis-ai",
  storageBucket: "matdis-ai.firebasestorage.app",
  messagingSenderId: "170233460635",
  appId: "1:170233460635:web:7bf2a98592ed7ad1e6133e",
  measurementId: "G-PYF89ZY3Q4",
};

const CLOUDINARY_CONFIG = {
  cloudName: "ddyhx9a4h",
  uploadPreset: "matdis-ai", // unsigned preset
};

// ── Init Firebase ──
firebase.initializeApp(FIREBASE_CONFIG);
const auth = firebase.auth();
const db = firebase.database();

// ── Cloudinary Upload Helper ──
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`, { method: "POST", body: formData });
  const data = await res.json();
  return data.secure_url;
}
