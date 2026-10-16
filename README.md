# 🏙️ Kota Karier (Career City)

> Platform web retro 2D pixel-art untuk eksplorasi minat, simulasi satu hari kerja, dan *Reality Check* karier yang jujur bagi siswa SMA/SMK di Indonesia.

---

## 📌 Latar Belakang & Masalah
Banyak siswa SMA di Indonesia merasa bingung dan cemas saat memilih jurusan kuliah dan arah karier. Tes minat konvensional umumnya hanya berupa kuesioner panjang yang membosankan dan menghasilkan label abstrak (misal: "Anda cocok di bidang sosial") tanpa memberikan gambaran nyata tentang:
1. **Bagaimana rasanya menjalani satu hari kerja** dalam profesi tersebut.
2. **Sisi tidak enak** (beban kerja, tekanan, rutinitas melelahkan) yang jarang diungkapkan di brosur kampus.
3. **Pilihan alternatif selain S1** (D3/D4 vokasi, SMK, sertifikasi, bootcamp).
4. **Alat kolaborasi dengan guru BK** yang mudah dibagikan tanpa registrasi rumit.

**Kota Karier** hadir sebagai solusinya: alih-alih sekadar tes teks, siswa diajak menjelajahi kota pixel 2D, masuk ke gedung-gedung, mencoba simulasi interaktif "Sehari Jadi...", membaca Reality Check yang transparan, dan mengekspor rencana aksi konkret 6 bulan.

---

## 🧱 Arsitektur & Struktur Direktori

```text
src/
├── assets/             # Aset statis & logo
├── data/               # Data deklaratif & konten
│   ├── city.ts         # Data posisi gedung, hotspot, dan tema interior
│   ├── tes-minat.ts    # 18 skenario pertanyaan orisinal (RIASEC framework)
│   └── professions/    # Data profesi modular (1 file = 1 profesi)
│       ├── dokter.ts             # Simulasi + Reality Check lengkap
│       ├── software-engineer.ts  # Simulasi + Reality Check lengkap
│       ├── perawat.ts            # Reality Check
│       ├── akuntan.ts            # Reality Check
│       └── index.ts              # Registry profesi
├── lib/                # Logika bisnis murni & utilitas
│   ├── scoring.ts      # Pure functions: agregasi RIASEC, bobot ranking, deteksi speed
│   ├── scoring.test.ts # Vitest unit tests untuk scoring & share code
│   ├── shareCode.ts    # Enkoder & dekoder kode hasil 8 karakter (Base32 offline)
│   ├── storage.ts      # Pembungkus localStorage dengan try/catch & versioning
│   └── context.tsx     # React Context untuk state aplikasi global
├── pages/              # Halaman rute
│   ├── HomePage.tsx            # Peta kota scrollable & visual hotspot gedung
│   ├── BuildingInteriorPage.tsx# Ruang interior 2D dengan benda pemicu profesi
│   ├── InterestTestPage.tsx    # Skenario tes minat & pacing controller
│   ├── ProfessionPage.tsx      # Mesin simulasi jam kerja & kartu Reality Check
│   ├── ResultPage.tsx          # Top 3, Ekspektasi vs Realita, PDF export, aksi 6 bulan
│   ├── CandidatePage.tsx       # Daftar kandidat profesi tersimpan
│   ├── ComparePage.tsx         # Perbandingan 2 profesi berdampingan
│   └── SettingsPage.tsx        # Toggles scanlines, animasi, dan reset data
├── types/              # Deklarasi TypeScript
└── index.css           # Token desain, palette pixel 24 warna, & styling cetak PDF
```

---

## 🚀 Cara Menambah Profesi Baru (Zero Code Changes)
Kota Karier dirancang dengan arsitektur **data-driven**:
1. Buat file baru di `src/data/professions/<id>.ts` (misal: `arsitek.ts`).
2. Implementasikan antarmuka `Profession` dari `src/types/profession.ts`.
3. Buka `src/data/professions/index.ts` dan tambahkan ke array `PROFESSIONS`.

Sistem UI, interior ruangan, pencarian rute, perbandingan, dan mesin Reality Check akan langsung mengenali profesi baru secara otomatis tanpa mengubah kode komponen.

---

## 💻 Menjalankan Proyek Secara Lokal

### Prasyarat
- Node.js versi 18+ atau yang lebih baru
- npm

### Langkah Instalasi
```bash
# 1. Masuk ke direktori proyek
cd kota-karier

# 2. Instal dependensi
npm install

# 3. Jalankan server pengembangan lokal (Vite)
npm run dev

# 4. Jalankan unit test (Vitest)
npm test

# 5. Uji build produksi
npm run build
```

---

## ⚙️ Deploy ke Vercel / Netlify
Aplikasi ini 100% statis. Rute SPA telah didukung dengan konfigurasi pengalihan `_redirects` atau `vercel.json` untuk semua rute React Router (`/`, `/gedung/:id`, `/profesi/:id`, `/tes-minat`, `/hasil`, `/bandingkan`, `/kandidat`, `/pengaturan`).
