/**
 * Tes Minat & Gaya Kerja — 18 original scenario-based questions.
 * Based on the RIASEC (Holland) framework as theory only.
 * All questions are ORIGINAL — not copied from any licensed test.
 *
 * Each question presents a Saturday scenario with 4 options,
 * each mapping to different RIASEC types.
 */

import type { TestQuestion } from '../types';

export const TEST_QUESTIONS: TestQuestion[] = [
  {
    id: 'q1',
    pertanyaan: 'Hari Sabtu kosong, kamu pilih ngapain?',
    opsi: [
      { teks: 'Bongkar laptop lama dan coba rakit ulang', riasec: ['Realistic'] },
      { teks: 'Baca artikel sains tentang luar angkasa', riasec: ['Investigative'] },
      { teks: 'Gambar atau desain poster buat event sekolah', riasec: ['Artistic'] },
      { teks: 'Bantu adik kelas belajar matematika', riasec: ['Social'] },
    ],
  },
  {
    id: 'q2',
    pertanyaan: 'Di kelompok tugas, posisi yang paling kamu suka?',
    opsi: [
      { teks: 'Yang bikin presentasi bagus — slide, layout, animasi', riasec: ['Artistic'] },
      { teks: 'Yang riset dan cari data — pastikan semuanya akurat', riasec: ['Investigative'] },
      { teks: 'Yang atur jadwal dan bagi tugas ke anggota', riasec: ['Enterprising'] },
      { teks: 'Yang rapiin dokumen, format, dan cek ulang sebelum dikumpulin', riasec: ['Conventional'] },
    ],
  },
  {
    id: 'q3',
    pertanyaan: 'Kalau boleh magang di mana saja, kamu pilih?',
    opsi: [
      { teks: 'Bengkel atau workshop yang bikin barang dari nol', riasec: ['Realistic'] },
      { teks: 'Lab penelitian di universitas', riasec: ['Investigative'] },
      { teks: 'Kantor startup yang lagi berkembang pesat', riasec: ['Enterprising'] },
      { teks: 'Rumah sakit atau klinik kesehatan', riasec: ['Social'] },
    ],
  },
  {
    id: 'q4',
    pertanyaan: 'Kamu nemuin masalah yang belum ada solusinya. Reaksi pertamamu?',
    opsi: [
      { teks: 'Coba pecahkan sendiri — analisis dari berbagai sisi', riasec: ['Investigative'] },
      { teks: 'Cari orang yang bisa diajak diskusi bareng', riasec: ['Social'] },
      { teks: 'Pikirin solusi kreatif yang belum pernah dicoba', riasec: ['Artistic'] },
      { teks: 'Cari cara yang sudah proven works dan terapkan', riasec: ['Conventional'] },
    ],
  },
  {
    id: 'q5',
    pertanyaan: 'Channel YouTube favoritmu paling mirip yang mana?',
    opsi: [
      { teks: 'Tutorial DIY — cara bikin/benerin barang sendiri', riasec: ['Realistic'] },
      { teks: 'Video essay tentang psikologi, sejarah, atau ekonomi', riasec: ['Investigative'] },
      { teks: 'Content creator yang bikin sketsa, musik, atau film pendek', riasec: ['Artistic'] },
      { teks: 'Motivator atau business vlogger', riasec: ['Enterprising'] },
    ],
  },
  {
    id: 'q6',
    pertanyaan: 'Kamu diminta handle event sekolah besar. Mau handle bagian apa?',
    opsi: [
      { teks: 'Sound system, lighting, dan teknis panggung', riasec: ['Realistic'] },
      { teks: 'Konsep acara dan konten kreatif', riasec: ['Artistic'] },
      { teks: 'Sponsorship dan negosiasi budget', riasec: ['Enterprising'] },
      { teks: 'Administrasi — surat izin, absensi, laporan pertanggungjawaban', riasec: ['Conventional'] },
    ],
  },
  {
    id: 'q7',
    pertanyaan: 'Teman curhat punya masalah berat. Kamu lebih cenderung...',
    opsi: [
      { teks: 'Dengerin dengan sabar, baru kasih perspektif', riasec: ['Social'] },
      { teks: 'Bantu analisis masalahnya dan carikan opsi solusi', riasec: ['Investigative'] },
      { teks: 'Ajakin kegiatan seru biar pikirannya teralihkan', riasec: ['Artistic'] },
      { teks: 'Kasih saran langkah konkret yang actionable', riasec: ['Enterprising'] },
    ],
  },
  {
    id: 'q8',
    pertanyaan: 'Di pelajaran mana kamu paling "hidup" di kelas?',
    opsi: [
      { teks: 'Prakarya atau olahraga — yang ada gerak fisiknya', riasec: ['Realistic'] },
      { teks: 'Matematika atau fisika — yang butuh logika', riasec: ['Investigative'] },
      { teks: 'Seni atau bahasa — yang butuh ekspresi', riasec: ['Artistic'] },
      { teks: 'Ekonomi atau kewirausahaan — yang ada unsur strategi', riasec: ['Enterprising'] },
    ],
  },
  {
    id: 'q9',
    pertanyaan: 'Kamu menang undian dan boleh beli satu barang. Pilih yang mana?',
    opsi: [
      { teks: 'Toolkit lengkap (obeng, solder, multimeter)', riasec: ['Realistic'] },
      { teks: 'Buku non-fiksi langka atau langganan jurnal ilmiah', riasec: ['Investigative'] },
      { teks: 'Tablet gambar atau kamera profesional', riasec: ['Artistic'] },
      { teks: 'Planner mewah lengkap dengan sistem organisasi', riasec: ['Conventional'] },
    ],
  },
  {
    id: 'q10',
    pertanyaan: 'Di dunia game atau RPG, kamu biasanya pilih role apa?',
    opsi: [
      { teks: 'Tank atau builder — yang konstruksi atau pegang alat berat', riasec: ['Realistic'] },
      { teks: 'Healer atau support — bantu tim tetap hidup', riasec: ['Social'] },
      { teks: 'Strategist atau leader — yang atur formasi dan taktik', riasec: ['Enterprising'] },
      { teks: 'Mage atau crafter — yang pakai kreativitas dan riset', riasec: ['Artistic', 'Investigative'] },
    ],
  },
  {
    id: 'q11',
    pertanyaan: 'Guru minta kamu bikin project bebas. Kamu bikin apa?',
    opsi: [
      { teks: 'Prototipe alat sederhana yang menyelesaikan masalah nyata', riasec: ['Realistic', 'Investigative'] },
      { teks: 'Film dokumenter pendek tentang isu sosial', riasec: ['Artistic', 'Social'] },
      { teks: 'Business plan untuk usaha yang bisa dijalankan anak SMA', riasec: ['Enterprising'] },
      { teks: 'Spreadsheet analisis data dari survei kelas', riasec: ['Conventional', 'Investigative'] },
    ],
  },
  {
    id: 'q12',
    pertanyaan: 'Kamu lihat berita tentang bencana alam. Yang pertama terlintas?',
    opsi: [
      { teks: '"Gimana cara kirim bantuan logistik yang efisien?"', riasec: ['Conventional', 'Realistic'] },
      { teks: '"Kenapa bisa terjadi? Apa yang bisa dipelajari dari data?"', riasec: ['Investigative'] },
      { teks: '"Kasihan korbannya — aku mau volunteering"', riasec: ['Social'] },
      { teks: '"Aku bisa galang dana lewat social media campaign"', riasec: ['Enterprising'] },
    ],
  },
  {
    id: 'q13',
    pertanyaan: 'Cara belajar yang paling efektif buat kamu?',
    opsi: [
      { teks: 'Langsung praktik — belajar sambil ngerjain', riasec: ['Realistic'] },
      { teks: 'Baca dan pahami teori dulu, baru praktik', riasec: ['Investigative'] },
      { teks: 'Diskusi kelompok — belajar dari perspektif orang lain', riasec: ['Social'] },
      { teks: 'Buat catatan rapi, mind map, atau ringkasan terstruktur', riasec: ['Conventional'] },
    ],
  },
  {
    id: 'q14',
    pertanyaan: 'Kalau bisa ubah satu hal di sekolahmu, apa yang kamu ubah?',
    opsi: [
      { teks: 'Tambah lab dan workshop buat eksperimen praktis', riasec: ['Realistic'] },
      { teks: 'Tambah program mentoring untuk siswa yang kesulitan', riasec: ['Social'] },
      { teks: 'Buat kurikulum kewirausahaan yang real — bukan cuma teori', riasec: ['Enterprising'] },
      { teks: 'Perbagus perpustakaan dan akses ke jurnal/penelitian', riasec: ['Investigative'] },
    ],
  },
  {
    id: 'q15',
    pertanyaan: 'Orang lain biasanya minta tolong kamu untuk apa?',
    opsi: [
      { teks: 'Benerin barang elektronik atau teknis lainnya', riasec: ['Realistic'] },
      { teks: 'Jelasin konsep yang rumit dengan bahasa sederhana', riasec: ['Investigative', 'Social'] },
      { teks: 'Desain poster, edit video, atau hal kreatif', riasec: ['Artistic'] },
      { teks: 'Ngatur acara, jadwal, atau koordinasi kelompok', riasec: ['Enterprising', 'Conventional'] },
    ],
  },
  {
    id: 'q16',
    pertanyaan: 'Saat presentasi di depan kelas, yang kamu paling enjoy?',
    opsi: [
      { teks: 'Demo langsung — tunjukin cara kerja sesuatu', riasec: ['Realistic'] },
      { teks: 'Jelaskan proses berpikir dan analisis di balik kesimpulan', riasec: ['Investigative'] },
      { teks: 'Penampilan yang menarik — desain slide keren, storytelling', riasec: ['Artistic'] },
      { teks: 'Ngajak audiens interaksi dan diskusi', riasec: ['Social', 'Enterprising'] },
    ],
  },
  {
    id: 'q17',
    pertanyaan: 'Kamu harus kerja di satu tempat selama sebulan. Pilih mana?',
    opsi: [
      { teks: 'Kebun atau peternakan — kerja fisik di alam terbuka', riasec: ['Realistic'] },
      { teks: 'Perpustakaan atau museum — tenang dan penuh ilmu', riasec: ['Investigative', 'Conventional'] },
      { teks: 'Studio musik, teater, atau gallery seni', riasec: ['Artistic'] },
      { teks: 'Panti asuhan atau organisasi kemanusiaan', riasec: ['Social'] },
    ],
  },
  {
    id: 'q18',
    pertanyaan: 'Mimpi terbesarmu 10 tahun lagi?',
    opsi: [
      { teks: 'Punya workshop atau lab sendiri — bikin sesuatu yang nyata', riasec: ['Realistic'] },
      { teks: 'Jadi pakar di bidang tertentu — dikenal karena keahlian', riasec: ['Investigative'] },
      { teks: 'Punya bisnis sendiri yang mengubah industri', riasec: ['Enterprising'] },
      { teks: 'Membuat dampak sosial nyata — membantu banyak orang', riasec: ['Social'] },
    ],
  },
];
