/**
 * Profession data: Perawat (Nurse)
 * Building: Rumah Sakit
 * Type: Reality Check ONLY (no simulation)
 *
 * ⚠️ needs expert review — salary data and career pathway details
 *     should be verified by a nursing professional.
 */

import type { Profession } from '../../types';

const perawat: Profession = {
  id: 'perawat',
  nama: 'Perawat',
  gedung: 'rumah-sakit',
  bendaPemicu: {
    id: 'papan-pasien',
    nama: 'Papan Data Pasien',
    label: 'Perawat',
    posisi: { x: 65, y: 45 },
  },
  riasec: ['Social', 'Realistic'],
  hasSimulation: true,
  simulasi: {
    judul: 'Sehari Jadi Perawat (Shift Pagi)',
    intro:
      'Selamat datang di bangsal rawat inap Rumah Sakit! Kenakan seragam dinasmu, pantau tanda vital, pastikan prinsip 5 Benar pemberian obat, dan jaga komunikasi empatik bersama pasien.',
    langkah: [],
  },
  realityCheck: {
    tugasHarian: [
      'Memantau kondisi vital pasien (tekanan darah, suhu, detak jantung)',
      'Memberikan obat dan perawatan sesuai instruksi dokter',
      'Mendampingi pasien dan keluarga — memberikan dukungan emosional',
      'Mendokumentasikan perkembangan pasien di rekam medis',
    ],
    sisiTidakEnak: [
      'Shift malam dan akhir pekan sangat sering — jam kerja tidak teratur',
      'Menghadapi pasien yang kesakitan atau meninggal — beban emosional berat',
      'Pekerjaan fisik yang melelahkan — berdiri berjam-jam, mengangkat pasien',
    ],
    keterampilan: [
      { nama: 'Biologi & anatomi dasar', jenis: 'teknis', kategori: 'wajib sejak awal' },
      { nama: 'Keterampilan klinis (infus, injeksi, wound care)', jenis: 'teknis', kategori: 'bisa dipelajari sambil jalan' },
      { nama: 'Empati dan kesabaran tinggi', jenis: 'non-teknis', kategori: 'wajib sejak awal' },
      { nama: 'Komunikasi dengan pasien dan tim medis', jenis: 'non-teknis', kategori: 'wajib sejak awal' },
      { nama: 'Ketahanan fisik dan mental', jenis: 'non-teknis', kategori: 'wajib sejak awal' },
    ],
    jurusanKuliah: {
      utama: ['Ilmu Keperawatan (S1 + Profesi Ners)'],
      alternatif: ['Kebidanan', 'Kesehatan Masyarakat'],
      mataKuliahInti: [
        'Keperawatan Dasar', 'Anatomi', 'Farmakologi',
        'Keperawatan Medikal Bedah', 'Keperawatan Anak', 'Keperawatan Jiwa',
      ],
    },
    jalurAlternatif: [
      {
        jenis: 'D3/D4 Vokasi',
        deskripsi: 'D3 Keperawatan — jalur lebih cepat (3 tahun) untuk menjadi perawat terregistrasi',
        contoh: ['Poltekkes Kemenkes di berbagai kota'],
      },
      {
        jenis: 'SMK',
        deskripsi: 'SMK Kesehatan jurusan Keperawatan — bisa langsung kerja sebagai asisten perawat',
      },
      {
        jenis: 'Sertifikasi',
        deskripsi: 'STR (Surat Tanda Registrasi) wajib untuk praktik. Bisa ambil sertifikasi spesialis tambahan.',
      },
    ],
    prospek: {
      // TODO_VERIFY — salary data needs verification
      rentangGaji: 'Rp 3.500.000 - Rp 8.000.000/bulan (tergantung RS dan daerah)',
      sumber: 'Estimasi berdasarkan data Indeed Indonesia & PPNI',
      tahun: 2024,
      permintaan: 'Tinggi — rasio perawat per penduduk Indonesia masih di bawah standar WHO',
    },
  },
  terakhirDitinjau: '2024-12-01',
  gajiMin: 3500000,
  gajiMax: 8000000,
  gajiRingkas: 'Rp 3,5 - 8 jt',
  prospekRingkas: 'Tinggi',
  jurusanUtama: 'Ilmu Keperawatan',
  jalurTercepat: 'D3 Keperawatan, 3 tahun',
  tantanganUtama: 'Shift malam dan beban fisik mengangkat pasien',
  seruUtama: 'Dukungan emosional dan mendampingi kesembuhan pasien',
};

export default perawat;
