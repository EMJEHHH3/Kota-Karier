/**
 * Profession data: Dokter (Doctor)
 * Building: Rumah Sakit
 * Type: Full simulation + Reality Check
 *
 * ⚠️ needs expert review — salary data and curriculum details
 *     should be verified by a medical professional or career counselor.
 */

import type { Profession } from '../../types';

const dokter: Profession = {
  id: 'dokter',
  nama: 'Dokter',
  gedung: 'rumah-sakit',
  bendaPemicu: {
    id: 'stetoskop',
    nama: 'Stetoskop',
    label: 'Dokter',
    posisi: { x: 30, y: 55 },
  },
  riasec: ['Investigative', 'Social'],
  hasSimulation: true,
  butuhGelar: true,
  pendidikanKhusus: {
    judulDialog: 'Kamu perlu gelar untuk pekerjaan ini',
    penjelasan:
      'Dokter tidak bisa dicoba sehari seperti profesi lain karena membutuhkan pendidikan dan lisensi khusus. Tapi kamu tetap bisa mengenal jalurnya.',
    durasiUmum: 'Butuh waktu bertahun-tahun pendidikan formal dan klinis intensif',
    langkah: [
      {
        nomor: 1,
        tahap: 'Pendidikan S1 Kedokteran',
        keterangan: 'Mempelajari ilmu biomedis dasar, anatomi, biokimia, patologi, dan farmakologi di universitas.',
      },
      {
        nomor: 2,
        tahap: 'Pendidikan Profesi / Koas',
        keterangan: 'Praktik rotasi klinis langsung di berbagai departemen rumah sakit di bawah bimbingan dokter konsulen.',
      },
      {
        nomor: 3,
        tahap: 'Internship',
        keterangan: 'Praktik mandiri di fasilitas kesehatan primer dan sekunder untuk mematangkan kemandirian klinis serta mendapatkan STR.',
      },
      {
        nomor: 4,
        tahap: 'Spesialisasi (Opsional)',
        keterangan: 'Program Pendidikan Dokter Spesialis (PPDS) jika memilih mendalami cabang medis spesifik (seperti Bedah, Anak, atau Jantung).',
      },
    ],
    alternatifProfesiId: 'perawat',
    alternatifNama: 'Perawat',
    alternatifLabelTombol: 'Coba Simulasi Perawat',
  },
  simulasi: {
    judul: 'Sehari Jadi Dokter',
    intro:
      'Dokter membutuhkan kualifikasi gelar profesi dan lisensi medis resmi sebelum berpraktik. Kamu bisa mempelajari jalurnya atau mencoba simulasi profesi kesehatan lain.',

    langkah: [
      {
        jam: '08.00',
        narasi:
          'Kamu tiba di rumah sakit. Ada antrean pasien panjang di poli umum. Perawat menyerahkan 12 berkas pasien hari ini. Pasien pertama: seorang ibu bawa anaknya yang demam 3 hari.',
        pilihan: [
          {
            teks: 'Periksa dengan teliti — cek suhu, tenggorokan, telinga, dan tanya riwayat lengkap',
            dampak: {
              interest: 1,
              ability: 2,
              resilience: 0,
              workStyle: { analytical: 2, social: 1, creative: 0, technical: 1 },
            },
            umpanBalik:
              'Ibunya lega karena kamu thorough. Kamu menemukan infeksi telinga yang terlewat sebelumnya.',
          },
          {
            teks: 'Langsung periksa cepat — kemungkinan besar flu biasa, resep obat standar',
            dampak: {
              interest: 0,
              ability: -1,
              resilience: 1,
              workStyle: { analytical: 0, social: 0, creative: 0, technical: 1 },
            },
            umpanBalik:
              'Pasien pulang cepat, tapi kamu agak ragu — bagaimana kalau bukan flu biasa?',
          },
          {
            teks: 'Ajak ibunya ngobrol dulu — tanya soal pola makan, tidur, dan kondisi rumah',
            dampak: {
              interest: 1,
              ability: 1,
              resilience: 0,
              workStyle: { analytical: 1, social: 2, creative: 0, technical: 0 },
            },
            umpanBalik:
              'Ibunya cerita anaknya susah makan. Kamu bisa memberi saran nutrisi juga selain obat.',
          },
          {
            teks: 'Minta bantuan dokter senior untuk konsultasi — kamu masih belajar',
            dampak: {
              interest: 0,
              ability: 0,
              resilience: -1,
              workStyle: { analytical: 0, social: 1, creative: 0, technical: 0 },
            },
            umpanBalik:
              'Dokter senior membantu, tapi bilang kasus ini harusnya bisa kamu tangani sendiri.',
          },
        ],
      },
      {
        jam: '10.30',
        narasi:
          'Pasien ke-5: seorang bapak paruh baya mengeluh nyeri dada. Kamu harus cepat menilai apakah ini darurat atau bukan.',
        isMiniTask: true,
        pilihan: [
          {
            teks: 'Lakukan penilaian cepat: EKG, tensi, saturasi oksigen — sambil tetap tenang ajak pasien bicara',
            dampak: {
              interest: 2,
              ability: 2,
              resilience: 1,
              workStyle: { analytical: 2, social: 1, creative: 0, technical: 2 },
            },
            umpanBalik:
              'EKG menunjukkan tanda awal serangan jantung. Kamu langsung rujuk ke IGD. Tindakan tepatmu menyelamatkan pasien.',
          },
          {
            teks: 'Langsung panggil tim IGD — lebih aman tidak mengambil risiko',
            dampak: {
              interest: 0,
              ability: 0,
              resilience: 0,
              workStyle: { analytical: 0, social: 0, creative: 0, technical: 0 },
            },
            umpanBalik:
              'Tim IGD datang dan ternyata memang darurat. Keputusan tepat, tapi kamu belajar sedikit dari prosesnya.',
          },
          {
            teks: 'Periksa dan simpulkan ini mungkin masuk angin — kasih obat maag dan suruh pulang',
            dampak: {
              interest: -1,
              ability: -2,
              resilience: -1,
              workStyle: { analytical: -1, social: 0, creative: 0, technical: -1 },
            },
            umpanBalik:
              'Untungnya perawat senior menyela dan minta EKG dulu. Ternyata ini serangan jantung ringan. Hampir fatal.',
          },
          {
            teks: 'Tenangkan pasien dulu, lalu periksa bertahap sambil cari tahu riwayat penyakit keluarga',
            dampak: {
              interest: 1,
              ability: 1,
              resilience: 1,
              workStyle: { analytical: 1, social: 2, creative: 0, technical: 1 },
            },
            umpanBalik:
              'Pendekatanmu baik tapi agak lambat untuk kasus darurat. Dokter senior bilang: "Di kasus darurat, kecepatan juga penting."',
          },
        ],
      },
      {
        jam: '12.00',
        narasi:
          'Istirahat makan siang. Tapi baru 10 menit duduk, HP berbunyi — ada pasien UGD butuh bantuan. Kamu belum makan.',
        isUnpleasantMoment: true,
        pilihan: [
          {
            teks: 'Langsung ke UGD — pasien lebih penting dari makan siang',
            dampak: {
              interest: 1,
              ability: 1,
              resilience: 2,
              workStyle: { analytical: 0, social: 1, creative: 0, technical: 1 },
            },
            umpanBalik:
              'Kamu bantu stabilkan pasien. Perutmu keroncongan tapi ada rasa puas. Ini kenyataan hidup dokter.',
          },
          {
            teks: 'Minta waktu 5 menit habiskan makanan, lalu langsung ke UGD',
            dampak: {
              interest: 0,
              ability: 0,
              resilience: 1,
              workStyle: { analytical: 0, social: 0, creative: 0, technical: 0 },
            },
            umpanBalik:
              'Kamu sampai sedikit terlambat tapi masih bisa membantu. Belajar: kadang 5 menit itu krusial.',
          },
          {
            teks: 'Bilang sedang istirahat dan minta dokter lain yang bantu',
            dampak: {
              interest: -1,
              ability: 0,
              resilience: -1,
              workStyle: { analytical: 0, social: -1, creative: 0, technical: 0 },
            },
            umpanBalik:
              'Dokter lain menggantikan, tapi kepala departemen mencatat ini. Di dunia medis, pasien selalu prioritas.',
          },
          {
            teks: 'Tanya dulu detail kasusnya — kalau bukan kritis, selesaikan makan dulu',
            dampak: {
              interest: 0,
              ability: 1,
              resilience: 0,
              workStyle: { analytical: 1, social: 0, creative: 0, technical: 0 },
            },
            umpanBalik:
              'Ternyata memang bukan kritis. Keputusan logis, tapi beberapa perawat menganggap kamu kurang responsif.',
          },
        ],
      },
      {
        jam: '14.00',
        narasi:
          'Pasien terakhir sesi siang: seorang remaja yang takut disuntik dan menangis di ruang periksa. Ibunya juga panik.',
        pilihan: [
          {
            teks: 'Ajak ngobrol santai tentang hobinya dulu — baru jelaskan prosedur pelan-pelan',
            dampak: {
              interest: 1,
              ability: 1,
              resilience: 0,
              workStyle: { analytical: 0, social: 2, creative: 1, technical: 0 },
            },
            umpanBalik:
              'Remajanya pelan-pelan tenang. Ternyata dia suka game — kamu ajak cerita soal itu. Suntikan lancar!',
          },
          {
            teks: 'Jelaskan secara ilmiah kenapa suntik tidak berbahaya — edukasi itu penting',
            dampak: {
              interest: 0,
              ability: 0,
              resilience: 0,
              workStyle: { analytical: 2, social: 0, creative: 0, technical: 1 },
            },
            umpanBalik:
              'Penjelasanmu benar tapi remaja itu malah makin takut mendengar detail medis.',
          },
          {
            teks: 'Minta ibunya keluar dulu, biar kamu bicara berdua — kadang orang tua bikin anak makin panik',
            dampak: {
              interest: 1,
              ability: 1,
              resilience: 1,
              workStyle: { analytical: 0, social: 1, creative: 1, technical: 0 },
            },
            umpanBalik:
              'Tanpa ibunya, remaja itu lebih tenang. Kamu berhasil suntik dengan cepat. Intuisi yang bagus!',
          },
          {
            teks: 'Langsung suntik saja — semakin lama ditunda, semakin panik',
            dampak: {
              interest: -1,
              ability: 0,
              resilience: 1,
              workStyle: { analytical: 0, social: -1, creative: 0, technical: 1 },
            },
            umpanBalik:
              'Suntikan selesai tapi remajanya trauma dan ibunya marah. Bukan pendekatan terbaik.',
          },
        ],
      },
      {
        jam: '16.00',
        narasi:
          'Shift selesai. Kepala departemen memanggilmu untuk review: "Bagaimana hari pertamamu?" Kamu merenungkan semua yang terjadi hari ini.',
        pilihan: [
          {
            teks: '"Berat tapi seru — saya suka tantangan diagnosis dan interaksi dengan pasien"',
            dampak: {
              interest: 2,
              ability: 1,
              resilience: 1,
              workStyle: { analytical: 1, social: 1, creative: 0, technical: 0 },
            },
            umpanBalik:
              'Kepala departemen tersenyum: "Semangat yang bagus. Kamu akan butuh itu bertahun-tahun ke depan."',
          },
          {
            teks: '"Jujur, saya kelelahan. Tapi senang bisa membantu orang"',
            dampak: {
              interest: 1,
              ability: 0,
              resilience: 0,
              workStyle: { analytical: 0, social: 1, creative: 0, technical: 0 },
            },
            umpanBalik:
              '"Itu respons yang jujur. Burnout itu nyata di profesi ini — jaga kesehatanmu juga."',
          },
          {
            teks: '"Saya merasa kurang siap untuk beberapa situasi darurat"',
            dampak: {
              interest: 0,
              ability: -1,
              resilience: 1,
              workStyle: { analytical: 0, social: 0, creative: 0, technical: 0 },
            },
            umpanBalik:
              '"Mengakui kelemahan adalah langkah pertama untuk berkembang. Kamu bisa belajar dari pengalaman."',
          },
          {
            teks: '"Kayaknya profesi ini bukan untuk saya — terlalu banyak tekanan"',
            dampak: {
              interest: -2,
              ability: 0,
              resilience: -1,
              workStyle: { analytical: 0, social: 0, creative: 0, technical: 0 },
            },
            umpanBalik:
              '"Tidak apa-apa. Lebih baik tahu sekarang daripada setelah 6 tahun kuliah. Eksplorasi lagi ya."',
          },
        ],
      },
    ],
  },
  realityCheck: {
    tugasHarian: [
      'Memeriksa dan mendiagnosis pasien di poli/UGD',
      'Menulis resep dan rekam medis',
      'Berkomunikasi dengan pasien dan keluarganya tentang kondisi & rencana pengobatan',
      'Berkoordinasi dengan perawat, spesialis, dan tenaga medis lain',
    ],
    sisiTidakEnak: [
      'Jam kerja sangat panjang dan tidak teratur — shift malam, akhir pekan, dan hari libur adalah hal biasa',
      'Menghadapi kematian pasien dan harus menyampaikan berita buruk ke keluarga',
      'Risiko burnout tinggi — tekanan emosional dan fisik terus-menerus',
    ],
    keterampilan: [
      { nama: 'Biologi & Kimia dasar', jenis: 'teknis', kategori: 'wajib sejak awal' },
      { nama: 'Kemampuan diagnosis klinis', jenis: 'teknis', kategori: 'bisa dipelajari sambil jalan' },
      { nama: 'Komunikasi empatik', jenis: 'non-teknis', kategori: 'wajib sejak awal' },
      { nama: 'Manajemen stres', jenis: 'non-teknis', kategori: 'wajib sejak awal' },
      { nama: 'Kerja tim multidisiplin', jenis: 'non-teknis', kategori: 'bisa dipelajari sambil jalan' },
      { nama: 'Keterampilan prosedur medis', jenis: 'teknis', kategori: 'bisa dipelajari sambil jalan' },
    ],
    jurusanKuliah: {
      utama: ['Pendidikan Dokter (Kedokteran)'],
      alternatif: ['Kedokteran Gigi', 'Farmasi', 'Ilmu Keperawatan'],
      mataKuliahInti: [
        'Anatomi', 'Fisiologi', 'Biokimia', 'Patologi',
        'Farmakologi', 'Ilmu Penyakit Dalam', 'Bedah',
      ],
    },
    jalurAlternatif: [
      {
        jenis: 'D3/D4 Vokasi',
        deskripsi: 'D3 Keperawatan atau D4 Kebidanan — menjadi tenaga medis tanpa gelar S1 Kedokteran',
        contoh: ['Poltekkes Kemenkes'],
      },
      {
        jenis: 'Sertifikasi',
        deskripsi: 'Asisten medis atau teknisi laboratorium medis',
      },
    ],
    prospek: {
      // TODO_VERIFY — salary data needs verification from reliable source
      rentangGaji: 'Rp 5.000.000 - Rp 15.000.000/bulan (dokter umum awal karier)',
      sumber: 'Estimasi berdasarkan data Glassdoor Indonesia & survei IDI',
      tahun: 2024,
      permintaan: 'Tinggi — Indonesia masih kekurangan dokter, terutama di daerah terpencil',
    },
  },
  terakhirDitinjau: '2024-12-01',
  gajiMin: 5000000,
  gajiMax: 15000000,
  gajiRingkas: 'Rp 5 - 15 jt',
  prospekRingkas: 'Tinggi',
  jurusanUtama: 'Kedokteran',
  jalurTercepat: 'D3 Keperawatan/Vokasi, 3 tahun',
  tantanganUtama: 'Jam kerja panjang dan beban emosional',
  seruUtama: 'Mendiagnosis dan menolong kesembuhan pasien',
};

export default dokter;
