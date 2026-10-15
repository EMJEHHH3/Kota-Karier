/**
 * Profession data: Akuntan (Accountant)
 * Building: Kantor Teknologi
 * Type: Reality Check ONLY (no simulation)
 *
 * ⚠️ needs expert review — salary data and certification details
 *     should be verified by an accounting professional.
 */

import type { Profession } from '../../types';

const akuntan: Profession = {
  id: 'akuntan',
  nama: 'Akuntan',
  gedung: 'kantor-teknologi',
  bendaPemicu: {
    id: 'kalkulator-laporan',
    nama: 'Kalkulator & Laporan Keuangan',
    label: 'Akuntan',
    posisi: { x: 70, y: 55 },
  },
  riasec: ['Conventional', 'Investigative'],
  hasSimulation: false,
  simulasi: null,
  realityCheck: {
    tugasHarian: [
      'Mencatat dan mengolah transaksi keuangan perusahaan',
      'Membuat laporan keuangan (neraca, laba rugi, arus kas)',
      'Menghitung dan melaporkan pajak',
      'Audit internal — memastikan data keuangan akurat dan sesuai regulasi',
    ],
    sisiTidakEnak: [
      'Pekerjaan bisa sangat repetitif — banyak data entry dan pengecekan angka',
      'Tekanan tinggi saat tutup buku bulanan/tahunan dan deadline pelaporan pajak',
      'Kesalahan kecil bisa berdampak besar — tanggung jawab hukum nyata',
    ],
    keterampilan: [
      { nama: 'Matematika dasar & ketelitian angka', jenis: 'teknis', kategori: 'wajib sejak awal' },
      { nama: 'Software akuntansi (Accurate, SAP, dll)', jenis: 'teknis', kategori: 'bisa dipelajari sambil jalan' },
      { nama: 'Microsoft Excel (lanjutan)', jenis: 'teknis', kategori: 'bisa dipelajari sambil jalan' },
      { nama: 'Pemahaman perpajakan Indonesia', jenis: 'teknis', kategori: 'bisa dipelajari sambil jalan' },
      { nama: 'Ketelitian dan disiplin', jenis: 'non-teknis', kategori: 'wajib sejak awal' },
      { nama: 'Etika profesional', jenis: 'non-teknis', kategori: 'wajib sejak awal' },
    ],
    jurusanKuliah: {
      utama: ['Akuntansi'],
      alternatif: ['Manajemen (konsentrasi Keuangan)', 'Ekonomi', 'Perpajakan'],
      mataKuliahInti: [
        'Pengantar Akuntansi', 'Akuntansi Keuangan Menengah',
        'Perpajakan', 'Auditing', 'Akuntansi Biaya', 'Sistem Informasi Akuntansi',
      ],
    },
    jalurAlternatif: [
      {
        jenis: 'D3/D4 Vokasi',
        deskripsi: 'D3 Akuntansi — fokus praktik, bisa langsung kerja sebagai staf akuntansi',
      },
      {
        jenis: 'SMK',
        deskripsi: 'SMK Jurusan Akuntansi — dasar yang cukup untuk posisi entry-level',
      },
      {
        jenis: 'Sertifikasi',
        deskripsi: 'Sertifikasi profesional menambah nilai jual',
        contoh: ['CA (Chartered Accountant) dari IAI', 'CPA', 'Brevet Pajak A/B/C'],
      },
      {
        jenis: 'Bootcamp',
        deskripsi: 'Kursus akuntansi & perpajakan intensif online',
        contoh: ['Arkademi', 'Skill Academy'],
      },
    ],
    prospek: {
      // TODO_VERIFY — salary data needs verification
      rentangGaji: 'Rp 4.000.000 - Rp 12.000.000/bulan (tergantung pengalaman & sertifikasi)',
      sumber: 'Estimasi berdasarkan data Jobstreet & Kelly Services Indonesia',
      tahun: 2024,
      permintaan: 'Stabil — setiap perusahaan butuh akuntan, demand meningkat dengan regulasi pajak yang semakin ketat',
    },
  },
  terakhirDitinjau: '2024-12-01',
};

export default akuntan;
