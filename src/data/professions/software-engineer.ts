/**
 * Profession data: Software Engineer
 * Building: Kantor Teknologi
 * Type: Full simulation + Reality Check
 *
 * ⚠️ needs expert review — salary ranges and technology stack relevance
 *     should be verified by industry professionals.
 */

import type { Profession } from '../../types';

const softwareEngineer: Profession = {
  id: 'software-engineer',
  nama: 'Software Engineer',
  gedung: 'kantor-teknologi',
  bendaPemicu: {
    id: 'monitor-code',
    nama: 'Monitor Kode',
    label: 'Software Engineer',
    posisi: { x: 35, y: 50 },
  },
  riasec: ['Investigative', 'Realistic'],
  hasSimulation: true,
  simulasi: {
    judul: 'Sehari Jadi Software Engineer',
    intro:
      'Kamu adalah software engineer junior di sebuah startup teknologi di Jakarta. Hari ini kamu akan mengerjakan fitur baru untuk aplikasi mobile perusahaan. Siap ngoding?',
    langkah: [
      {
        jam: '09.00',
        narasi:
          'Daily standup meeting. Tim lead bertanya tentang progresmu kemarin. Kamu sebenarnya masih stuck di bug yang sulit ditemukan.',
        pilihan: [
          {
            teks: 'Jujur bilang masih stuck dan minta bantuan — "Aku butuh pair programming untuk bug ini"',
            dampak: {
              interest: 0,
              ability: 1,
              resilience: 1,
              workStyle: { analytical: 0, social: 2, creative: 0, technical: 0 },
            },
            umpanBalik:
              'Tim lead menghargai kejujuranmu. Senior engineer menawarkan bantuan setelah standup.',
          },
          {
            teks: 'Bilang sudah ada progress dan targetkan selesai hari ini — biar kamu punya tekanan untuk fokus',
            dampak: {
              interest: 0,
              ability: 0,
              resilience: 1,
              workStyle: { analytical: 0, social: 0, creative: 0, technical: 1 },
            },
            umpanBalik:
              'Tim lead mengangguk. Tapi kamu tahu tekanan ini bisa backfire kalau sore belum kelar.',
          },
          {
            teks: 'Jelaskan secara teknis apa yang sudah kamu coba dan analisismu tentang root cause-nya',
            dampak: {
              interest: 1,
              ability: 2,
              resilience: 0,
              workStyle: { analytical: 2, social: 1, creative: 0, technical: 1 },
            },
            umpanBalik:
              'Tim terkesan dengan analisismu. CTO bilang: "Analisis bagus — coba cek dari sisi database query."',
          },
          {
            teks: 'Skip detail, pindah ke topik lain — nanti saja debug sendiri setelah meeting',
            dampak: {
              interest: -1,
              ability: -1,
              resilience: 0,
              workStyle: { analytical: 0, social: -1, creative: 0, technical: 0 },
            },
            umpanBalik:
              'Meeting selesai cepat tapi kamu kehilangan kesempatan minta insight dari tim.',
          },
        ],
      },
      {
        jam: '10.30',
        narasi:
          'Waktunya ngoding! Kamu harus membangun fitur notifikasi push untuk pengguna baru. Ada dua pendekatan: menggunakan library yang sudah ada (cepat tapi kurang fleksibel) atau build dari scratch.',
        isMiniTask: true,
        pilihan: [
          {
            teks: 'Riset dulu 30 menit — bandingkan library yang ada, baca dokumentasinya, lalu putuskan',
            dampak: {
              interest: 1,
              ability: 2,
              resilience: 0,
              workStyle: { analytical: 2, social: 0, creative: 0, technical: 2 },
            },
            umpanBalik:
              'Kamu menemukan library yang pas dengan kebutuhan. Riset awal menghemat banyak waktu debugging nanti.',
          },
          {
            teks: 'Langsung pakai library populer — Stack Overflow bilang ini yang paling banyak dipakai',
            dampak: {
              interest: 0,
              ability: 0,
              resilience: 1,
              workStyle: { analytical: 0, social: 0, creative: 0, technical: 1 },
            },
            umpanBalik:
              'Library terpasang cepat, tapi ternyata ada limitasi yang baru ketahuan setelah integrasi.',
          },
          {
            teks: 'Build dari scratch — lebih sulit tapi kamu kontrol 100% dan bisa belajar lebih dalam',
            dampak: {
              interest: 2,
              ability: 1,
              resilience: 0,
              workStyle: { analytical: 1, social: 0, creative: 2, technical: 2 },
            },
            umpanBalik:
              'Kode kamu rapi dan fleksibel, tapi makan waktu 3x lebih lama. Tim lead tanya: "Worth it nggak?"',
          },
          {
            teks: 'Tanya senior engineer mana yang dia rekomendasikan — belajar dari pengalaman orang lain',
            dampak: {
              interest: 0,
              ability: 1,
              resilience: 0,
              workStyle: { analytical: 0, social: 1, creative: 0, technical: 1 },
            },
            umpanBalik:
              'Senior engineer share pengalaman dan kasih rekomendasi berdasarkan project sebelumnya. Efisien!',
          },
        ],
      },
      {
        jam: '13.00',
        narasi:
          'Setelah makan siang, QA engineer menemukan bug kritis di fitur yang kamu push kemarin. User data bisa hilang kalau bug ini sampai ke production. Kamu harus fix sebelum jam 5.',
        isUnpleasantMoment: true,
        pilihan: [
          {
            teks: 'Tenang, reproduksi bug-nya dulu, tulis unit test untuk case ini, baru fix',
            dampak: {
              interest: 1,
              ability: 2,
              resilience: 2,
              workStyle: { analytical: 2, social: 0, creative: 0, technical: 2 },
            },
            umpanBalik:
              'Fix-nya solid dan kamu menambah test coverage. CTO bilang: "Ini cara yang benar." Bug fixed jam 3.',
          },
          {
            teks: 'Panik — langsung hotfix tanpa banyak testing, yang penting cepat selesai',
            dampak: {
              interest: -1,
              ability: -1,
              resilience: -1,
              workStyle: { analytical: -1, social: 0, creative: 0, technical: 0 },
            },
            umpanBalik:
              'Hotfix-nya malah create bug baru. Kamu harus revert dan mulai ulang. Waktu terbuang.',
          },
          {
            teks: 'Minta pair programming dengan senior — dua kepala lebih baik dari satu untuk bug kritis',
            dampak: {
              interest: 0,
              ability: 1,
              resilience: 1,
              workStyle: { analytical: 1, social: 2, creative: 0, technical: 1 },
            },
            umpanBalik:
              'Dengan senior, bug ditemukan lebih cepat. Kamu juga belajar teknik debugging baru.',
          },
          {
            teks: 'Analisis root cause secara mendalam — mungkin ini gejala dari masalah arsitektur yang lebih besar',
            dampak: {
              interest: 2,
              ability: 1,
              resilience: 0,
              workStyle: { analytical: 2, social: 0, creative: 1, technical: 1 },
            },
            umpanBalik:
              'Analisismu benar — ada masalah desain database. Tapi fix-nya jadi terlalu besar untuk hari ini. Dilemma.',
          },
        ],
      },
      {
        jam: '15.00',
        narasi:
          'Code review time. Senior engineer me-review kode kamu dan meninggalkan 8 komentar. Beberapa kritiknya cukup tajam: "Ini bisa jadi memory leak" dan "Naming convention-nya tidak konsisten."',
        isUnpleasantMoment: true,
        pilihan: [
          {
            teks: 'Terima semua feedback dengan profesional — baca satu per satu, tanya yang tidak jelas',
            dampak: {
              interest: 1,
              ability: 2,
              resilience: 2,
              workStyle: { analytical: 1, social: 1, creative: 0, technical: 1 },
            },
            umpanBalik:
              'Senior engineer terkesan dengan responsmu. Kamu memperbaiki semua issue dan kode jadi lebih baik.',
          },
          {
            teks: 'Defensif — jelaskan kenapa kamu menulis kode seperti itu, argumen balik',
            dampak: {
              interest: 0,
              ability: 0,
              resilience: -1,
              workStyle: { analytical: 0, social: -1, creative: 0, technical: 0 },
            },
            umpanBalik:
              'Senior engineer diam tapi suasana jadi canggung. Beberapa kritiknya memang valid.',
          },
          {
            teks: 'Fix yang mudah, tapi berdiskusi soal arsitektur yang kamu anggap lebih baik',
            dampak: {
              interest: 1,
              ability: 1,
              resilience: 1,
              workStyle: { analytical: 1, social: 1, creative: 1, technical: 1 },
            },
            umpanBalik:
              'Diskusi yang produktif! Beberapa ide kamu ternyata dipakai. Code review jadi learning moment.',
          },
          {
            teks: 'Merasa down — mungkin kamu memang belum cukup jago untuk pekerjaan ini',
            dampak: {
              interest: -1,
              ability: -1,
              resilience: -2,
              workStyle: { analytical: 0, social: 0, creative: 0, technical: 0 },
            },
            umpanBalik:
              'Rekan satu tim bilang: "Semua orang pernah dapat code review brutal di awal. Ini proses belajar."',
          },
        ],
      },
      {
        jam: '17.00',
        narasi:
          'Hari kerja selesai. Kamu merenungkan apa yang sudah terjadi hari ini — dari standup, ngoding, bug fixing, sampai code review.',
        pilihan: [
          {
            teks: '"Capek tapi puas — problem solving itu adiktif, apalagi pas bug akhirnya fixed"',
            dampak: {
              interest: 2,
              ability: 1,
              resilience: 1,
              workStyle: { analytical: 1, social: 0, creative: 0, technical: 1 },
            },
            umpanBalik:
              'Kamu pulang dengan senyum. Besok ada fitur baru yang menarik untuk dikerjakan.',
          },
          {
            teks: '"Seru bisa kolaborasi dengan tim — software engineering bukan kerja sendiri"',
            dampak: {
              interest: 1,
              ability: 1,
              resilience: 0,
              workStyle: { analytical: 0, social: 2, creative: 0, technical: 0 },
            },
            umpanBalik:
              'Kamu sadar bahwa aspek sosial di tech lebih besar dari yang kamu bayangkan.',
          },
          {
            teks: '"Honestly agak overwhelmed. Banyak hal teknis yang aku belum paham"',
            dampak: {
              interest: 0,
              ability: -1,
              resilience: 0,
              workStyle: { analytical: 0, social: 0, creative: 0, technical: 0 },
            },
            umpanBalik:
              '"Itu normal di awal. Yang penting kamu punya kemauan belajar," kata senior engineer lewat chat.',
          },
          {
            teks: '"Kayaknya profesi ini bukan untukku — duduk di depan layar seharian bukan gaya hidupku"',
            dampak: {
              interest: -2,
              ability: 0,
              resilience: -1,
              workStyle: { analytical: 0, social: 0, creative: 0, technical: 0 },
            },
            umpanBalik:
              '"Tidak semua orang cocok di depan kode. Mungkin kamu lebih cocok di product atau design?"',
          },
        ],
      },
    ],
  },
  realityCheck: {
    tugasHarian: [
      'Menulis, menguji, dan me-review kode program',
      'Meeting harian (standup) dan kolaborasi dengan tim (product, design, QA)',
      'Debugging — mencari dan memperbaiki error di kode yang sudah ada',
      'Belajar teknologi baru — field ini berkembang sangat cepat',
    ],
    sisiTidakEnak: [
      'Duduk di depan layar 8+ jam per hari — masalah kesehatan mata dan postur',
      'Bug yang sangat sulit ditemukan bisa bikin frustrasi berjam-jam',
      'Tekanan deadline ketat, terutama di startup — lembur bukan hal langka',
    ],
    keterampilan: [
      { nama: 'Logika & matematika dasar', jenis: 'teknis', kategori: 'wajib sejak awal' },
      { nama: 'Bahasa pemrograman (Python/JavaScript/dll)', jenis: 'teknis', kategori: 'bisa dipelajari sambil jalan' },
      { nama: 'Problem solving & debugging', jenis: 'teknis', kategori: 'wajib sejak awal' },
      { nama: 'Bahasa Inggris (reading)', jenis: 'non-teknis', kategori: 'wajib sejak awal' },
      { nama: 'Komunikasi teknis', jenis: 'non-teknis', kategori: 'bisa dipelajari sambil jalan' },
      { nama: 'Version control (Git)', jenis: 'teknis', kategori: 'bisa dipelajari sambil jalan' },
    ],
    jurusanKuliah: {
      utama: ['Teknik Informatika', 'Ilmu Komputer', 'Sistem Informasi'],
      alternatif: ['Teknik Elektro', 'Matematika', 'Fisika Komputasi'],
      mataKuliahInti: [
        'Algoritma & Struktur Data', 'Basis Data', 'Pemrograman Web',
        'Rekayasa Perangkat Lunak', 'Jaringan Komputer', 'Sistem Operasi',
      ],
    },
    jalurAlternatif: [
      {
        jenis: 'Bootcamp',
        deskripsi: 'Coding bootcamp intensif 3-6 bulan — banyak lulusan yang diterima kerja',
        contoh: ['Hacktiv8', 'Purwadhika', 'Binar Academy'],
      },
      {
        jenis: 'D3/D4 Vokasi',
        deskripsi: 'D3/D4 Teknik Informatika — fokus praktik, waktu lebih singkat',
      },
      {
        jenis: 'Otodidak',
        deskripsi: 'Belajar sendiri via online courses (freeCodeCamp, Coursera, YouTube) + portfolio project',
      },
      {
        jenis: 'Sertifikasi',
        deskripsi: 'AWS, Google Cloud, atau Meta certifications — menambah kredibilitas tanpa gelar',
      },
    ],
    prospek: {
      // TODO_VERIFY — salary range needs verification
      rentangGaji: 'Rp 5.000.000 - Rp 20.000.000/bulan (junior, tergantung kota & perusahaan)',
      sumber: 'Estimasi berdasarkan data Glassdoor & Jobstreet Indonesia',
      tahun: 2024,
      permintaan: 'Sangat tinggi — hampir semua industri butuh software engineer, terutama fintech & e-commerce',
    },
  },
  terakhirDitinjau: '2024-12-01',
};

export default softwareEngineer;
