# 🏙️ Kota Karier

> Platform web retro 2D pixel-art untuk eksplorasi minat, simulasi satu hari kerja, *Reality Check* karier yang jujur, dan **Roadmap Karier** yang dipersonalisasi — untuk siswa SMA/SMK di Indonesia.

---

## 📌 Latar Belakang & Masalah
Banyak siswa SMA di Indonesia merasa bingung dan cemas saat memilih jurusan kuliah dan arah karier. Tes minat konvensional umumnya hanya berupa kuesioner panjang yang membosankan dan menghasilkan label abstrak (misal: "Anda cocok di bidang sosial") tanpa memberikan gambaran nyata tentang:
1. **Bagaimana rasanya menjalani satu hari kerja** dalam profesi tersebut.
2. **Sisi tidak enak** (beban kerja, tekanan, rutinitas melelahkan) yang jarang diungkapkan di brosur kampus.
3. **Pilihan alternatif selain S1** (D3/D4 vokasi, SMK, sertifikasi, bootcamp).
4. **Roadmap konkret** dari SMA → Kuliah → Pengalaman → Karier Awal yang bisa langsung diikuti.
5. **Alat kolaborasi dengan guru BK** yang mudah dibagikan tanpa registrasi rumit.

**Kota Karier** hadir sebagai solusinya: alih-alih sekadar tes teks, siswa diajak menjelajahi kota pixel 2D, masuk ke gedung-gedung, mencoba simulasi interaktif "Sehari Jadi...", membaca Reality Check yang transparan, dan melihat Roadmap Karier personal dari SMA sampai siap bekerja.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🗺️ **Peta Kota Pixel** | Navigasi kota 2D bergaya retro dengan bangunan-bangunan interaktif |
| 🧠 **Tes Minat 4 Bagian** | 35 soal berbasis kerangka RIASEC: Aktivitas, Skenario Magang, Pelajaran, Gaya Kerja |
| 🏢 **Interior Gedung** | Setiap gedung punya ruangan interior sendiri dengan profesi yang bisa dijelajahi |
| 🎮 **Simulasi Kerja** | Simulasi interaktif "Sehari Jadi..." untuk Software Engineer & Dokter/Perawat |
| ⚖️ **Reality Check** | Kartu transparan: ekspektasi vs realita, jam kerja nyata, dan sisi berat profesi |
| 🗺️ **Roadmap Karier** | Jalur terstruktur 4 tahap: SMA → Kuliah → Pengalaman → Karier Awal — per profesi |
| 📊 **Halaman Hasil** | Top 3 profesi, perbandingan Ekspektasi vs Realita, Roadmap, dan ekspor PDF |
| 🔁 **Bandingkan Profesi** | Tampilan berdampingan untuk 2 profesi sekaligus |
| 🔖 **Daftar Kandidat** | Simpan profesi favorit untuk dibandingkan nanti |
| 🔐 **Autentikasi Supabase** | Login opsional untuk sinkronisasi progres lintas perangkat |
| ⚙️ **Pengaturan Aksesibilitas** | Toggle scanlines, animasi, dan reset data |

---

## 🗺️ Roadmap Karier (Fitur Baru)

Setelah menyelesaikan tes minat, siswa mendapatkan **Roadmap Karier** yang dipersonalisasi sesuai hasil RIASEC mereka. Setiap profesi memiliki jalur 4 tahap:

1. **Di SMA Sekarang** — Skill dasar, mini project, ekskul/lomba, platform belajar gratis
2. **Kuliah / Jalur Pendidikan** — Jurusan relevan, alternatif (D3/D4, politeknik, bootcamp), contoh kampus, jalur masuk
3. **Bangun Pengalaman** — Magang, portofolio, sertifikasi, komunitas, bootcamp
4. **Karier Awal** — Posisi entry-level, gambaran gaji, jalur perkembangan karier

Siswa bisa berpindah antar roadmap profesi untuk membandingkan jalur karier yang berbeda.

---

## 🧱 Arsitektur & Struktur Direktori

```text
src/
├── assets/                     # Aset statis & logo
├── components/                 # Komponen UI reusable
│   ├── BuildingSprite.tsx       # Sprite SVG gedung-gedung kota
│   ├── CareerRoadmap.tsx        # Komponen roadmap karier bertahap
│   ├── CitySkyline.tsx          # Dekorasi skyline latar belakang
│   ├── GuestSyncBanner.tsx      # Banner ajakan sinkronisasi akun
│   ├── NavbarAuth.tsx           # Komponen autentikasi navbar
│   ├── NightSky.tsx             # Animasi langit malam berbintang
│   ├── NurseWardSimulation.tsx  # Simulasi sif jaga perawat
│   ├── RealityCheckCard.tsx     # Kartu Reality Check interaktif
│   ├── RetroMonitorSimulation.tsx # Simulasi terminal komputer retro
│   ├── SpecializedEducationModal.tsx # Modal jalur pendidikan khusus
│   └── StreetLamp.tsx           # Dekorasi lampu jalan kota
├── data/                       # Data deklaratif & konten
│   ├── city.ts                  # Posisi gedung, hotspot, dan tema interior
│   ├── tes-minat.ts             # 35 soal RIASEC orisinal (4 bagian)
│   ├── interestQuestions.js     # Bank soal tambahan tes minat
│   ├── nurseSimulation.ts       # Data skenario simulasi perawat
│   └── professions/             # Data profesi modular (1 file = 1 profesi)
│       ├── software-engineer.ts  # Simulasi + Reality Check + Roadmap
│       ├── dokter.ts             # Simulasi + Reality Check + Roadmap
│       ├── perawat.ts            # Reality Check + Roadmap
│       ├── akuntan.ts            # Reality Check + Roadmap
│       ├── data-analyst.ts       # Reality Check + Roadmap
│       └── index.ts              # Registry profesi
├── lib/                        # Logika bisnis murni & utilitas
│   ├── scoring.ts               # Pure functions: agregasi RIASEC, bobot ranking
│   ├── roadmapApi.ts            # API roadmap karier per profesi
│   ├── shareCode.ts             # Enkoder kode hasil 8 karakter (Base32 offline)
│   ├── terminalMatcher.ts       # Pencocok input terminal simulasi
│   ├── sound.ts                 # Efek suara retro (opsional)
│   ├── storage.ts               # localStorage dengan try/catch & versioning
│   ├── context.tsx              # React Context untuk state aplikasi global
│   ├── AuthContext.tsx          # Context autentikasi Supabase
│   └── supabase.js              # Klien Supabase
├── pages/                      # Halaman rute
│   ├── HomePage.tsx             # Peta kota scrollable & visual hotspot gedung
│   ├── BuildingInteriorPage.tsx # Interior gedung 2D dengan pemicu profesi
│   ├── InterestTestPage.tsx     # Tes minat 4 bagian + controller pacing
│   ├── ProfessionPage.tsx       # Mesin simulasi & kartu Reality Check
│   ├── ResultPage.tsx           # Top 3, Roadmap Karier, PDF export
│   ├── CandidatePage.tsx        # Daftar kandidat profesi tersimpan
│   ├── ComparePage.tsx          # Perbandingan 2 profesi berdampingan
│   └── SettingsPage.tsx         # Toggle aksesibilitas & reset data
├── types/                      # Deklarasi TypeScript
└── index.css                   # Token desain, palette retro, & styling PDF
```

---

## 🚀 Cara Menambah Profesi Baru

Kota Karier dirancang dengan arsitektur **data-driven**:

1. Buat file baru di `src/data/professions/<id>.ts` (misal: `arsitek.ts`).
2. Implementasikan antarmuka `Profession` dari `src/types/profession.ts`.
3. Tambahkan data `roadmap` dengan 4 tahap (`sma`, `kuliah`, `pengalaman`, `karierAwal`).
4. Buka `src/data/professions/index.ts` dan tambahkan ke array `PROFESSIONS`.

Sistem UI, interior ruangan, pencarian rute, Roadmap, perbandingan, dan mesin Reality Check akan langsung mengenali profesi baru secara otomatis.

---

## 💻 Menjalankan Proyek Secara Lokal

### Prasyarat
- Node.js versi 18+ atau yang lebih baru
- npm

### Langkah Instalasi
```bash
# 1. Clone & masuk ke direktori proyek
git clone <repo-url>
cd kota-karier

# 2. Instal dependensi
npm install

# 3. Salin .env dan isi konfigurasi Supabase (opsional, untuk fitur login)
cp .env.example .env

# 4. Jalankan server pengembangan lokal (Vite)
npm run dev

# 5. Jalankan unit test (Vitest, 58 tests)
npm test

# 6. Uji build produksi
npm run build
```

### Variabel Lingkungan (Opsional)
```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxx
```

Tanpa variabel ini, aplikasi tetap berjalan 100% offline menggunakan `localStorage`.

---

## ⚙️ Deploy ke Vercel / Netlify

Aplikasi ini 100% statis. Rute SPA telah dikonfigurasi di:
- `public/_redirects` — untuk Netlify
- `vercel.json` — untuk Vercel

Rute yang tersedia: `/`, `/gedung/:id`, `/profesi/:id`, `/tes-minat`, `/hasil`, `/bandingkan`, `/kandidat`, `/pengaturan`

---

## 🧪 Unit Tests

```bash
npm test
```

**58 tests** mencakup:
- `src/lib/scoring.test.ts` — Fungsi skoring RIASEC & share code
- `src/lib/roadmap.test.ts` — Logika Roadmap Karier per profesi
- `src/lib/terminalMatcher.test.ts` — Pencocok input terminal simulasi
- `src/data/nurseSimulation.test.ts` — Skenario simulasi perawat
- `src/data/specializedEducation.test.ts` — Data jalur pendidikan khusus
- `src/components/RetroMonitorSimulation.test.tsx` — Komponen simulasi monitor
- `src/components/SpecializedEducationModal.test.tsx` — Modal pendidikan
- `src/pages/BuildingInteriorPage.test.tsx` — Halaman interior gedung
- `src/pages/HomePage.test.tsx` — Halaman utama peta kota

---

## 🎯 Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | React 18 + TypeScript (Vite) |
| Routing | React Router v6 |
| Styling | Vanilla CSS + Custom Design System |
| Font | Press Start 2P (pixel) + Inter (body) |
| State | React Context + localStorage |
| Auth | Supabase (opsional) |
| Testing | Vitest + Testing Library |
| Deploy | Vercel / Netlify (static) |

---

## 🎨 Design System

- **Palette retro**: Dark cyberpunk (`#0a0e1a` bg, `#22d3ee` cyan accent, `#fbbf24` gold)
- **Typography**: `Press Start 2P` untuk heading & tombol; `Inter` untuk body text
- **Komponen**: Border cyan 1–2px, border-radius 4–6px (retro angular), glow shadow
- **Animasi**: Scanlines CRT opsional, micro-animations hover, reduced-motion support
- **Responsive**: Mobile-first, minimum 360px lebar
