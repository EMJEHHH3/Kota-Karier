import type { Profession } from '../../types';

const dataAnalyst: Profession = {
  id: 'data-analyst',
  nama: 'Data Analyst',
  gedung: 'kantor-teknologi',
  bendaPemicu: {
    id: 'monitor-analisis',
    nama: 'Monitor Dashboard Analitik',
    label: 'Data Analyst',
    posisi: { x: 50, y: 50 },
  },
  riasec: ['Investigative', 'Conventional'],
  hasSimulation: true,
  simulasi: {
    judul: 'Sehari Jadi Data Analyst',
    intro:
      'Kamu adalah Data Analyst di sebuah platform teknologi di Indonesia. Hari ini kamu akan menarik data transaksi via SQL, mencari anomali data, dan memberi rekomendasi untuk tim bisnis!',
    langkah: [
      {
        jam: '09.00',
        narasi:
          'Morning check-in. Manajer bisnismu menanyakan kenapa angka konversi transaksi minggu lalu terlihat turun 5%.',
        pilihan: [
          {
            teks: 'Langsung query database transaksi untuk mengisolasi kategori produk yang mengalami penurunan terbesar.',
            dampak: {
              interest: 1,
              ability: 2,
              resilience: 1,
              workStyle: { analytical: 2, social: 0, creative: 0, technical: 2 },
            },
            umpanBalik:
              'Pendekatan berbasis data! Kamu menemukan bahwa penurunan hanya terjadi pada kategori elektronik akibat promo yang sudah berakhir.',
          },
          {
            teks: 'Diskusi dulu dengan tim marketing untuk menanyakan apakah ada perubahan kampanye promo.',
            dampak: {
              interest: 0,
              ability: 1,
              resilience: 1,
              workStyle: { analytical: 1, social: 2, creative: 1, technical: 0 },
            },
            umpanBalik:
              'Tim marketing memberikan konteks jadwal kampanye yang sangat membantu analisismu.',
          },
        ],
      },
    ],
  },
  realityCheck: {
    tugasHarian: [
      'Menulis query SQL untuk mengekstrak data dari data warehouse',
      'Membuat visualisasi grafik dan dashboard interaktif (Tableau / Metabase)',
      'Mendeteksi dan membersihkan anomali atau duplikasi data (data cleaning)',
      'Mempresentasikan insight data ke manajer dan stakeholder bisnis',
    ],
    sisiTidakEnak: [
      'Hingga 70-80% waktu kerja dihabiskan untuk merapikan data mentah yang berantakan',
      'Permintaan data ad-hoc sering datang mendadak saat sedang fokus riset mendalam',
      'Kadang hasil analisis objektif kita bertentangan dengan firasat atau keinginan atasan',
    ],
    keterampilan: [
      { nama: 'SQL (Structured Query Language)', jenis: 'teknis', kategori: 'wajib sejak awal' },
      { nama: 'Statistika dasar & probabilitas', jenis: 'teknis', kategori: 'wajib sejak awal' },
      { nama: 'Excel lanjutan (Pivot, VLOOKUP/XLOOKUP)', jenis: 'teknis', kategori: 'wajib sejak awal' },
      { nama: 'Python atau R untuk analisis data', jenis: 'teknis', kategori: 'bisa dipelajari sambil jalan' },
      { nama: 'Business Intelligence (Power BI / Tableau)', jenis: 'teknis', kategori: 'bisa dipelajari sambil jalan' },
      { nama: 'Komunikasi & storytelling data', jenis: 'non-teknis', kategori: 'wajib sejak awal' },
    ],
    jurusanKuliah: {
      utama: ['Sains Data', 'Statistika', 'Teknik Informatika', 'Sistem Informasi'],
      alternatif: ['Matematika', 'Teknik Industri', 'Ekonomi Pembangunan'],
      mataKuliahInti: [
        'Basis Data & SQL',
        'Statistika Komputasi',
        'Analisis Data Eksploratif',
        'Visualisasi Data',
        'Pengantar Machine Learning',
      ],
    },
    jalurAlternatif: [
      {
        jenis: 'Bootcamp',
        deskripsi: 'Program intensif 3-6 bulan khusus data analytics berbasis portofolio proyek riil',
        contoh: ['Binar Academy Data Analytics', 'RevoU', 'Purwadhika'],
      },
      {
        jenis: 'Sertifikasi',
        deskripsi: 'Sertifikasi industri global yang diakui banyak perusahaan rekruter',
        contoh: ['Google Data Analytics Professional Certificate', 'Microsoft Certified: Power BI Data Analyst'],
      },
      {
        jenis: 'Otodidak',
        deskripsi: 'Belajar mandiri gratis melalui platform komunitas data dunia',
        contoh: ['Kaggle', 'Mode Analytics SQL Tutorial', 'freeCodeCamp'],
      },
    ],
    prospek: {
      rentangGaji: 'Rp 6.000.000 - Rp 15.000.000/bulan (level junior-mid)',
      sumber: 'Estimasi laporan talenta digital Indonesia & survei komunitas data 2024',
      tahun: 2024,
      permintaan: 'Sangat Tinggi — setiap lini perusahaan membutuhkan pengambilan keputusan berbasis data nyata',
    },
  },
  terakhirDitinjau: '2025-01-15',
  gajiMin: 6000000,
  gajiMax: 15000000,
  gajiRingkas: 'Rp 6 - 15 jt',
  prospekRingkas: 'Sangat tinggi',
  jurusanUtama: 'Sains Data',
  jalurTercepat: 'Bootcamp intensif, 3-6 bulan',
  tantanganUtama: 'Membersihkan data mentah berantakan berulang kali',
  seruUtama: 'Menemukan pola rahasia pengambil keputusan bisnis',
};

export default dataAnalyst;
