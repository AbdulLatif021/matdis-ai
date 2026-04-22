/* eslint-disable */
// =============================================
// js/questions.js — Bank Soal Lengkap
// 4 Topik × 20 Soal + 8 Soal Diagnostik
// =============================================

const TOPICS = {
  logika: {
    name: "Logika",
    icon: "fas fa-project-diagram",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg,#3b82f6,#2563eb)",
    desc: "Proposisi, konjungsi, disjungsi, implikasi, dan tautologi.",
    tags: ["Proposisi", "Konjungsi", "Implikasi", "Tautologi", "Inferensi"],
  },
  relasi: {
    name: "Relasi & Fungsi",
    icon: "fas fa-link",
    color: "#10b981",
    gradient: "linear-gradient(135deg,#10b981,#059669)",
    desc: "Himpunan, relasi, fungsi, komposisi, dan invers.",
    tags: ["Himpunan", "Relasi", "Fungsi", "Komposisi", "Invers"],
  },
  graf: {
    name: "Teori Graf",
    icon: "fas fa-share-alt",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
    desc: "Graf, lintasan, pohon, dan pewarnaan graf.",
    tags: ["Graf", "Lintasan", "Pohon", "Euler", "Pewarnaan"],
  },
  kombinatorik: {
    name: "Kombinatorik",
    icon: "fas fa-dice",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
    desc: "Permutasi, kombinasi, peluang, dan prinsip kotak.",
    tags: ["Permutasi", "Kombinasi", "Peluang", "Rekursi", "Pigeonhole"],
  },
};

// ── SOAL DIAGNOSTIK (8 SOAL — 2 per topik) ──
const DIAGNOSTIC_QUESTIONS = [
  {
    topic: "logika",
    q: 'Negasi dari pernyataan "Semua mahasiswa lulus ujian" adalah...',
    opts: ["Tidak semua mahasiswa lulus ujian", "Semua mahasiswa tidak lulus ujian", "Ada mahasiswa yang lulus ujian", "Tidak ada mahasiswa yang lulus ujian"],
    ans: 0,
    exp: "Negasi dari 'Semua A adalah B' adalah 'Ada A yang bukan B', yaitu 'Tidak semua mahasiswa lulus ujian.'",
  },
  {
    topic: "logika",
    q: "Jika p = Benar dan q = Salah, maka nilai kebenaran dari p → q adalah...",
    opts: ["Benar", "Salah", "Tidak tentu", "Bergantung konteks"],
    ans: 1,
    exp: "Implikasi p→q bernilai Salah hanya ketika p=Benar dan q=Salah.",
  },
  {
    topic: "relasi",
    q: "Relasi R pada himpunan A disebut transitif jika...",
    opts: ["Untuk semua a,b: jika (a,b)∈R maka (b,a)∈R", "Untuk semua a: (a,a)∈R", "Untuk semua a,b,c: jika (a,b)∈R dan (b,c)∈R maka (a,c)∈R", "Untuk semua a,b: (a,b)∉R atau (b,a)∉R"],
    ans: 2,
    exp: "Definisi transitif: jika (a,b)∈R dan (b,c)∈R maka harus (a,c)∈R.",
  },
  {
    topic: "relasi",
    q: "Fungsi f: A→B disebut injektif (satu-satu) jika...",
    opts: ["Setiap elemen B punya preimage", "f(a₁)=f(a₂) mengimplikasikan a₁=a₂", "f(a₁)≠f(a₂) untuk semua a₁,a₂", "Range f = B"],
    ans: 1,
    exp: "Injektif (one-to-one): jika f(a₁)=f(a₂) maka a₁=a₂. Artinya tidak ada dua elemen berbeda yang dipetakan ke hasil yang sama.",
  },
  {
    topic: "graf",
    q: "Graf G memiliki 6 simpul (vertex). Jumlah maksimum sisi (edge) pada graf sederhana tersebut adalah...",
    opts: ["12", "15", "18", "21"],
    ans: 1,
    exp: "Graf sederhana lengkap dengan n simpul memiliki C(n,2) = n(n-1)/2 = 6×5/2 = 15 sisi.",
  },
  {
    topic: "graf",
    q: "Suatu graf dikatakan memiliki lintasan Euler jika...",
    opts: ["Semua simpul berderajat genap", "Tepat dua simpul berderajat ganjil", "Semua simpul berderajat ganjil", "Tidak ada simpul berderajat ganjil"],
    ans: 1,
    exp: "Teorema Euler: lintasan Euler (bukan sirkuit) ada jika dan hanya jika tepat dua simpul berderajat ganjil.",
  },
  {
    topic: "kombinatorik",
    q: "Berapa banyak cara memilih 3 orang dari kelompok 7 orang?",
    opts: ["21", "35", "42", "210"],
    ans: 1,
    exp: "C(7,3) = 7!/(3!×4!) = (7×6×5)/(3×2×1) = 35 cara.",
  },
  {
    topic: "kombinatorik",
    q: "Berapa banyak susunan huruf berbeda dari kata 'MATEMATIKA'?",
    opts: ["10!", "10!/2!²", "10!/(2!×2!×2!)", "10!/2!³"],
    ans: 2,
    exp: "Kata MATEMATIKA: M=2, A=3, T=2, E=1, I=1, K=1. Jumlah susunan = 10!/(2!×3!×2!) = 151200.",
  },
];

// ── BANK SOAL LATIHAN ──
const LATIHAN_QUESTIONS = {
  logika: [
    {
      q: "Tautologi adalah proposisi majemuk yang selalu...",
      opts: ["Bernilai Benar", "Bernilai Salah", "Bergantung variabel", "Tidak dapat ditentukan"],
      ans: 0,
      exp: "Tautologi selalu bernilai Benar untuk semua kombinasi nilai kebenaran variabelnya.",
    },
    {
      q: "Kontraposisi dari 'Jika hujan maka jalanan basah' adalah...",
      opts: ["Jika jalanan basah maka hujan", "Jika tidak hujan maka jalanan tidak basah", "Jika jalanan tidak basah maka tidak hujan", "Jika tidak hujan maka jalanan basah"],
      ans: 2,
      exp: "Kontraposisi dari p→q adalah ¬q→¬p: 'Jika jalanan tidak basah maka tidak hujan.'",
    },
    { q: "Nilai kebenaran (T∧F)∨T adalah...", opts: ["T", "F", "T∧F", "Tidak tentu"], ans: 0, exp: "(T∧F)=F, kemudian F∨T=T." },
    { q: "Operator logika yang menghasilkan TRUE hanya jika kedua operan TRUE disebut...", opts: ["Disjungsi", "Konjungsi", "Implikasi", "Biimplikasi"], ans: 1, exp: "Konjungsi (AND) hanya bernilai TRUE jika kedua operan TRUE." },
    { q: "Pernyataan p↔q setara dengan...", opts: ["(p→q)∧(q→p)", "(p→q)∨(q→p)", "(p∧q)∨(¬p∧¬q)", "Pilihan A dan C"], ans: 3, exp: "Biimplikasi p↔q setara dengan (p→q)∧(q→p) dan juga dengan (p∧q)∨(¬p∧¬q)." },
    { q: "De Morgan menyatakan ¬(p∨q) setara dengan...", opts: ["¬p∨¬q", "¬p∧¬q", "p∧¬q", "¬p∨q"], ans: 1, exp: "Hukum De Morgan: ¬(p∨q) ≡ ¬p∧¬q." },
    { q: "Modus Ponens adalah aturan inferensi: jika p→q dan p benar, maka...", opts: ["q benar", "¬q benar", "¬p benar", "p→¬q benar"], ans: 0, exp: "Modus Ponens: dari p→q dan p, disimpulkan q." },
    { q: "Pernyataan 'Beberapa mahasiswa tidak hadir' dalam logika predikat...", opts: ["∀x P(x)", "∃x ¬P(x)", "¬∃x P(x)", "∀x ¬P(x)"], ans: 1, exp: "Beberapa mahasiswa tidak hadir = ada mahasiswa yang tidak hadir = ∃x ¬P(x)." },
    { q: "Fallacy of affirming the consequent: dari p→q dan q, disimpulkan...", opts: ["p (ini fallacy)", "¬p", "¬q", "q→p"], ans: 0, exp: "Menyimpulkan p dari p→q dan q adalah fallacy (kesalahan). Ini bukan valid secara logika." },
    { q: "Nilai (p∧¬p) untuk setiap nilai p adalah...", opts: ["Selalu T", "Selalu F (kontradiksi)", "T jika p=T", "F jika p=T"], ans: 1, exp: "p∧¬p selalu Salah — ini disebut kontradiksi." },
  ],
  relasi: [
    { q: "Himpunan A={1,2,3} dan B={a,b}. Jumlah elemen A×B adalah...", opts: ["5", "6", "8", "9"], ans: 1, exp: "|A×B| = |A|×|B| = 3×2 = 6." },
    {
      q: "Relasi ekuivalensi harus memenuhi sifat...",
      opts: ["Refleksif, Simetris, Antisimetris", "Refleksif, Simetris, Transitif", "Refleksif, Antisimetris, Transitif", "Simetris, Antisimetris, Transitif"],
      ans: 1,
      exp: "Relasi ekuivalensi: Refleksif + Simetris + Transitif.",
    },
    {
      q: "Fungsi f: ℝ→ℝ dengan f(x)=x² adalah...",
      opts: ["Injektif dan surjektif", "Injektif saja", "Surjektif saja", "Tidak injektif dan tidak surjektif"],
      ans: 3,
      exp: "f(x)=x² tidak injektif (f(2)=f(-2)=4) dan tidak surjektif ke ℝ (tidak ada preimage untuk -1).",
    },
    { q: "Komposisi fungsi (g∘f)(x) berarti...", opts: ["f(g(x))", "g(f(x))", "f(x)+g(x)", "f(x)×g(x)"], ans: 1, exp: "(g∘f)(x) = g(f(x)) — f diterapkan dulu, lalu g." },
    {
      q: "Jika f: A→B bijektif, maka f memiliki...",
      opts: ["Fungsi invers f⁻¹: B→A", "Fungsi invers f⁻¹: A→B", "Tidak punya invers", "Invers hanya jika A=B"],
      ans: 0,
      exp: "Fungsi bijektif (injektif+surjektif) selalu memiliki fungsi invers f⁻¹: B→A.",
    },
    { q: "Jumlah relasi yang dapat dibentuk dari himpunan A={1,2} ke dirinya sendiri adalah...", opts: ["4", "8", "16", "32"], ans: 2, exp: "|A×A|=4, sehingga jumlah subhimpunan (relasi) = 2⁴ = 16." },
    {
      q: "Relasi R={(1,1),(2,2),(3,3)} pada A={1,2,3} adalah...",
      opts: ["Hanya refleksif", "Refleksif, simetris, dan transitif", "Simetris saja", "Antisimetris saja"],
      ans: 1,
      exp: "Relasi identitas adalah refleksif, simetris, dan transitif (juga ekuivalensi).",
    },
    { q: "Fungsi floor ⌊3.7⌋ = ...", opts: ["3", "4", "3.7", "−3"], ans: 0, exp: "⌊3.7⌋ = 3 (bilangan bulat terbesar ≤ 3.7)." },
    {
      q: "Suatu fungsi f: A→B surjektif berarti...",
      opts: ["Setiap a∈A punya tepat satu pasangan", "Setiap b∈B punya minimal satu preimage", "f(a₁)=f(a₂)⟹a₁=a₂", "Range f ⊂ B"],
      ans: 1,
      exp: "Surjektif (onto): setiap elemen kodomain b∈B memiliki minimal satu preimage di A.",
    },
    {
      q: "Jika R relasi antisimetris dan simetris pada A, maka...",
      opts: ["R adalah relasi kosong", "R hanya berisi pasangan (a,a)", "R adalah relasi universal", "R tidak bisa ada"],
      ans: 1,
      exp: "Jika R antisimetris dan simetris, maka (a,b)∈R dan (b,a)∈R hanya mungkin jika a=b.",
    },
  ],
  graf: [
    { q: "Graf K₄ (komplit dengan 4 simpul) memiliki berapa sisi?", opts: ["4", "6", "8", "12"], ans: 1, exp: "K₄: C(4,2) = 4×3/2 = 6 sisi." },
    { q: "Pohon (tree) dengan n simpul memiliki berapa sisi?", opts: ["n", "n-1", "n+1", "2n-1"], ans: 1, exp: "Pohon dengan n simpul selalu memiliki tepat n-1 sisi." },
    { q: "Jumlah derajat semua simpul dalam sebuah graf sama dengan...", opts: ["Jumlah simpul", "Jumlah sisi", "Dua kali jumlah sisi", "Setengah jumlah sisi"], ans: 2, exp: "Handshaking Lemma: Σdeg(v) = 2|E|." },
    {
      q: "Graf bipartit adalah graf yang simpulnya dapat dibagi menjadi...",
      opts: ["Dua himpunan, sisi hanya dalam satu himpunan", "Dua himpunan, sisi hanya antar himpunan", "Dua himpunan sama besar", "Himpunan dengan jumlah genap"],
      ans: 1,
      exp: "Graf bipartit: simpul dibagi dua himpunan, semua sisi menghubungkan simpul dari himpunan berbeda.",
    },
    {
      q: "Sirkuit Euler adalah...",
      opts: ["Lintasan yang melewati setiap simpul tepat sekali", "Lintasan yang melewati setiap sisi tepat sekali dan kembali ke awal", "Lintasan terpendek antar dua simpul", "Lintasan yang melewati semua simpul"],
      ans: 1,
      exp: "Sirkuit Euler: melewati setiap sisi tepat sekali dan kembali ke simpul awal.",
    },
    { q: "Chromatic number graf K₃ adalah...", opts: ["1", "2", "3", "4"], ans: 2, exp: "K₃ adalah segitiga; butuh 3 warna agar tidak ada dua simpul bertetangga berwarna sama." },
    { q: "Graf yang tidak memiliki siklus disebut...", opts: ["Graf lengkap", "Graf bipartit", "Pohon (acyclic)", "Graf planar"], ans: 2, exp: "Graf tanpa siklus disebut acyclic graph atau forest; jika terhubung disebut pohon (tree)." },
    {
      q: "Algoritma Dijkstra digunakan untuk mencari...",
      opts: ["Pohon rentang minimum", "Lintasan terpendek dari satu sumber", "Sirkuit Euler", "Pewarnaan graf minimum"],
      ans: 1,
      exp: "Dijkstra: algoritma untuk mencari lintasan terpendek dari satu simpul sumber ke semua simpul lain.",
    },
    {
      q: "Graf planar adalah graf yang dapat digambar...",
      opts: ["Tanpa simpul berulang", "Pada bidang datar tanpa sisi berpotongan", "Dengan semua simpul berderajat sama", "Dengan jumlah sisi minimum"],
      ans: 1,
      exp: "Graf planar: dapat digambar di bidang datar (2D) tanpa ada sisi yang saling berpotongan.",
    },
    { q: "Jika sebuah pohon memiliki 10 simpul daun (leaf), maka pohon biner penuh memiliki berapa simpul internal?", opts: ["9", "10", "11", "19"], ans: 0, exp: "Pohon biner penuh: jumlah simpul internal = jumlah daun - 1 = 10-1 = 9." },
  ],
  kombinatorik: [
    { q: "Berapa nilai P(6,3) (permutasi 6 diambil 3)?", opts: ["20", "120", "720", "36"], ans: 1, exp: "P(6,3) = 6!/(6-3)! = 6×5×4 = 120." },
    { q: "Dari 10 siswa akan dipilih ketua dan wakil ketua. Berapa cara?", opts: ["10", "20", "45", "90"], ans: 3, exp: "Memilih ketua dan wakil (urutan penting): P(10,2) = 10×9 = 90 cara." },
    { q: "Berapa banyak cara menyusun 4 buku berbeda di rak?", opts: ["4", "12", "24", "48"], ans: 2, exp: "4! = 4×3×2×1 = 24 cara." },
    { q: "Koefisien binomial C(8,3) = ...", opts: ["56", "24", "336", "8"], ans: 0, exp: "C(8,3) = 8!/(3!×5!) = (8×7×6)/(3×2×1) = 56." },
    {
      q: "Prinsip Pigeonhole menyatakan: jika n+1 objek dimasukkan ke n kotak, maka...",
      opts: ["Ada kotak yang kosong", "Ada kotak dengan minimal 2 objek", "Setiap kotak terisi tepat 1", "Ada 2 kotak kosong"],
      ans: 1,
      exp: "Pigeonhole: jika n+1 objek dalam n kotak, paling sedikit satu kotak berisi ≥2 objek.",
    },
    { q: "Berapa banyak password 3 digit (0-9) yang semua digitnya berbeda?", opts: ["27", "729", "720", "10"], ans: 2, exp: "P(10,3) = 10×9×8 = 720 password." },
    { q: "Binomial Theorem: koefisien x³y² dalam ekspansi (x+y)⁵ adalah...", opts: ["5", "10", "20", "15"], ans: 1, exp: "Koefisien x³y² = C(5,3) = C(5,2) = 10." },
    { q: "Relasi rekurensi Fibonacci: F(n) = F(n-1) + F(n-2). Jika F(1)=1, F(2)=1, maka F(6)=...", opts: ["8", "13", "5", "21"], ans: 0, exp: "F(3)=2, F(4)=3, F(5)=5, F(6)=8." },
    { q: "Berapa cara membagi 5 bola identik ke 3 kotak berbeda?", opts: ["15", "21", "35", "10"], ans: 1, exp: "Stars and Bars: C(5+3-1, 3-1) = C(7,2) = 21 cara." },
    { q: "Peluang mendapat angka genap pada pelemparan dadu tunggal adalah...", opts: ["1/6", "1/3", "1/2", "2/3"], ans: 2, exp: "Angka genap: {2,4,6} → 3 dari 6 kemungkinan = 1/2." },
  ],
};

// ── Helper: shuffle array ──
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Get random N questions from a topic ──
function getRandomQuestions(topic, n = 10) {
  return shuffleArray(LATIHAN_QUESTIONS[topic]).slice(0, n);
}
