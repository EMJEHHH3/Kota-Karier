/**
 * interestQuestions.js — Bank Pertanyaan Tes Minat Karier Berbasis Tugas Nyata.
 * Terbagi dalam 4 Bagian (Total 35 pertanyaan/langkah):
 * - Bagian 1: 24 kartu Aktivitas Kerja (4 per tipe RIASEC)
 * - Bagian 2: 6 skenario Hari Pertama Magang (pilih 1 dari 4 tugas)
 * - Bagian 3: 1 pertanyaan Mapel Favorit (pilih maksimal 3)
 * - Bagian 4: 4 pilihan A/B Gaya Kerja
 *
 * Tiap item punya id, teks, tipe (R/I/A/S/E/C), dan ikon.
 * Label tipe TIDAK PERNAH ditampilkan langsung ke pengguna.
 */

/**
 * BAGIAN 1: Aktivitas Kerja (24 kartu, 4 kartu per tipe RIASEC)
 */
export const BAGIAN_1_CARDS = [
  // Realistic (R)
  {
    id: 'act_r1',
    teks: 'Memperbaiki mesin atau alat elektronik yang rusak',
    tipe: 'Realistic',
    ikon: 'wrench',
  },
  {
    id: 'act_r2',
    teks: 'Merakit dan memasang peralatan atau perabot',
    tipe: 'Realistic',
    ikon: 'hammer',
  },
  {
    id: 'act_r3',
    teks: 'Bekerja di lapangan atau luar ruangan dengan peralatan',
    tipe: 'Realistic',
    ikon: 'compass',
  },
  {
    id: 'act_r4',
    teks: 'Mengoperasikan mesin atau alat khusus',
    tipe: 'Realistic',
    ikon: 'gears',
  },

  // Investigative (I)
  {
    id: 'act_i1',
    teks: 'Menganalisis data untuk menemukan pola atau penyebab masalah',
    tipe: 'Investigative',
    ikon: 'chart-line',
  },
  {
    id: 'act_i2',
    teks: 'Melakukan eksperimen atau penelitian dan mencatat hasilnya',
    tipe: 'Investigative',
    ikon: 'flask',
  },
  {
    id: 'act_i3',
    teks: 'Mencari penyebab error pada program atau sistem',
    tipe: 'Investigative',
    ikon: 'bug',
  },
  {
    id: 'act_i4',
    teks: 'Membaca penelitian untuk memahami topik yang rumit',
    tipe: 'Investigative',
    ikon: 'book-open',
  },

  // Artistic (A)
  {
    id: 'act_a1',
    teks: 'Mendesain poster, logo, atau tampilan aplikasi',
    tipe: 'Artistic',
    ikon: 'palette',
  },
  {
    id: 'act_a2',
    teks: 'Menulis cerita, naskah, atau konten kreatif',
    tipe: 'Artistic',
    ikon: 'pen-nib',
  },
  {
    id: 'act_a3',
    teks: 'Membuat atau mengedit video, foto, atau musik',
    tipe: 'Artistic',
    ikon: 'video',
  },
  {
    id: 'act_a4',
    teks: 'Merancang ruangan, produk, atau busana yang unik',
    tipe: 'Artistic',
    ikon: 'sparkles',
  },

  // Social (S)
  {
    id: 'act_s1',
    teks: 'Merawat dan mendampingi orang yang sedang sakit',
    tipe: 'Social',
    ikon: 'heart-pulse',
  },
  {
    id: 'act_s2',
    teks: 'Mengajar atau menjelaskan materi ke orang lain',
    tipe: 'Social',
    ikon: 'chalkboard-user',
  },
  {
    id: 'act_s3',
    teks: 'Mendengarkan curhat dan membantu orang menyelesaikan masalahnya',
    tipe: 'Social',
    ikon: 'hands-holding-child',
  },
  {
    id: 'act_s4',
    teks: 'Menjalankan program sukarela untuk masyarakat',
    tipe: 'Social',
    ikon: 'hand-holding-heart',
  },

  // Enterprising (E)
  {
    id: 'act_e1',
    teks: 'Menjual produk dan meyakinkan pelanggan',
    tipe: 'Enterprising',
    ikon: 'bullhorn',
  },
  {
    id: 'act_e2',
    teks: 'Memimpin tim untuk mencapai target',
    tipe: 'Enterprising',
    ikon: 'users',
  },
  {
    id: 'act_e3',
    teks: 'Memulai usaha sendiri dan berani ambil keputusan berisiko',
    tipe: 'Enterprising',
    ikon: 'rocket',
  },
  {
    id: 'act_e4',
    teks: 'Bernegosiasi atau mempresentasikan ide ke klien',
    tipe: 'Enterprising',
    ikon: 'handshake',
  },

  // Conventional (C)
  {
    id: 'act_c1',
    teks: 'Mencatat keuangan dan memastikan angkanya tepat',
    tipe: 'Conventional',
    ikon: 'calculator',
  },
  {
    id: 'act_c2',
    teks: 'Menyusun arsip dan dokumen agar rapi dan mudah dicari',
    tipe: 'Conventional',
    ikon: 'folder-tree',
  },
  {
    id: 'act_c3',
    teks: 'Memeriksa laporan dan memastikan tidak ada kesalahan',
    tipe: 'Conventional',
    ikon: 'clipboard-check',
  },
  {
    id: 'act_c4',
    teks: 'Mengikuti prosedur dan jadwal yang jelas setiap hari',
    tipe: 'Conventional',
    ikon: 'clock',
  },
];

/**
 * BAGIAN 2: Hari Pertama Magang (6 skenario, pilih 1 dari 4)
 */
export const BAGIAN_2_SCENARIOS = [
  {
    id: 'intern_1',
    tempat: 'Magang di Rumah Sakit',
    gedungId: 'rumah-sakit',
    pertanyaan: 'Tugas mana yang paling kamu mau?',
    opsi: [
      {
        id: 's1_s',
        teks: 'Mendampingi dan menenangkan pasien',
        tipe: 'Social',
        ikon: 'heart-pulse',
      },
      {
        id: 's1_i',
        teks: 'Membaca hasil lab untuk mencari penyebab keluhan',
        tipe: 'Investigative',
        ikon: 'flask',
      },
      {
        id: 's1_c',
        teks: 'Merapikan data pasien dan jadwal kontrol',
        tipe: 'Conventional',
        ikon: 'clipboard-check',
      },
      {
        id: 's1_r',
        teks: 'Merawat dan mengecek alat medis agar berfungsi',
        tipe: 'Realistic',
        ikon: 'wrench',
      },
    ],
  },
  {
    id: 'intern_2',
    tempat: 'Magang di Startup Aplikasi',
    gedungId: 'kantor-teknologi',
    pertanyaan: 'Tugas mana yang paling kamu mau?',
    opsi: [
      {
        id: 's2_a',
        teks: 'Merancang tampilan layar aplikasi',
        tipe: 'Artistic',
        ikon: 'palette',
      },
      {
        id: 's2_i',
        teks: 'Mencari bug dan memperbaikinya',
        tipe: 'Investigative',
        ikon: 'bug',
      },
      {
        id: 's2_e',
        teks: 'Mempresentasikan aplikasi ke calon pengguna dan investor',
        tipe: 'Enterprising',
        ikon: 'bullhorn',
      },
      {
        id: 's2_c',
        teks: 'Menyusun jadwal dan laporan kerja tim',
        tipe: 'Conventional',
        ikon: 'folder-tree',
      },
    ],
  },
  {
    id: 'intern_3',
    tempat: 'Magang di Sekolah',
    gedungId: 'pusat-informasi',
    pertanyaan: 'Tugas mana yang paling kamu mau?',
    opsi: [
      {
        id: 's3_s',
        teks: 'Mengajar kelas kecil',
        tipe: 'Social',
        ikon: 'chalkboard-user',
      },
      {
        id: 's3_a',
        teks: 'Membuat poster dan materi belajar yang menarik',
        tipe: 'Artistic',
        ikon: 'image',
      },
      {
        id: 's3_c',
        teks: 'Mengurus data nilai dan absensi',
        tipe: 'Conventional',
        ikon: 'clipboard-check',
      },
      {
        id: 's3_e',
        teks: 'Memimpin panitia acara sekolah',
        tipe: 'Enterprising',
        ikon: 'users',
      },
    ],
  },
  {
    id: 'intern_4',
    tempat: 'Magang di Bengkel atau Pabrik',
    gedungId: 'kantor-teknologi',
    pertanyaan: 'Tugas mana yang paling kamu mau?',
    opsi: [
      {
        id: 's4_r',
        teks: 'Membongkar dan memperbaiki mesin',
        tipe: 'Realistic',
        ikon: 'wrench',
      },
      {
        id: 's4_i',
        teks: 'Menyelidiki penyebab produk cacat',
        tipe: 'Investigative',
        ikon: 'magnifying-glass',
      },
      {
        id: 's4_c',
        teks: 'Mengatur stok dan dokumen pengiriman',
        tipe: 'Conventional',
        ikon: 'boxes-stacked',
      },
      {
        id: 's4_e',
        teks: 'Menawar harga dengan pemasok',
        tipe: 'Enterprising',
        ikon: 'handshake',
      },
    ],
  },
  {
    id: 'intern_5',
    tempat: 'Magang di Studio Media Kreatif',
    gedungId: 'kantor-teknologi',
    pertanyaan: 'Tugas mana yang paling kamu mau?',
    opsi: [
      {
        id: 's5_a',
        teks: 'Mengedit video atau desain untuk klien',
        tipe: 'Artistic',
        ikon: 'clapperboard',
      },
      {
        id: 's5_e',
        teks: 'Mem-pitching ide ke klien',
        tipe: 'Enterprising',
        ikon: 'lightbulb',
      },
      {
        id: 's5_i',
        teks: 'Meneliti tren dan data penonton',
        tipe: 'Investigative',
        ikon: 'chart-line',
      },
      {
        id: 's5_s',
        teks: 'Memandu peserta dan tamu di acara',
        tipe: 'Social',
        ikon: 'comments',
      },
    ],
  },
  {
    id: 'intern_6',
    tempat: 'Magang di Bank atau Toko UMKM',
    gedungId: 'kantor-teknologi',
    pertanyaan: 'Tugas mana yang paling kamu mau?',
    opsi: [
      {
        id: 's6_c',
        teks: 'Mencatat transaksi dan mencocokkan angka',
        tipe: 'Conventional',
        ikon: 'calculator',
      },
      {
        id: 's6_e',
        teks: 'Menawarkan produk ke pelanggan',
        tipe: 'Enterprising',
        ikon: 'rocket',
      },
      {
        id: 's6_i',
        teks: 'Menganalisis laporan keuangan untuk mencari pola',
        tipe: 'Investigative',
        ikon: 'chart-pie',
      },
      {
        id: 's6_s',
        teks: 'Membantu pelanggan memahami produk dengan sabar',
        tipe: 'Social',
        ikon: 'hands-holding-child',
      },
    ],
  },
];

/**
 * BAGIAN 3: Mapel Favoritmu (Pilih maksimal 3)
 */
export const BAGIAN_3_MAPEL = [
  { id: 'matematika', nama: 'Matematika', ikon: 'calculator' },
  { id: 'fisika', nama: 'Fisika', ikon: 'atom' },
  { id: 'kimia', nama: 'Kimia', ikon: 'flask' },
  { id: 'biologi', nama: 'Biologi', ikon: 'dna' },
  { id: 'informatika', nama: 'Informatika', ikon: 'laptop-code' },
  { id: 'ekonomi', nama: 'Ekonomi', ikon: 'coins' },
  { id: 'akuntansi', nama: 'Akuntansi', ikon: 'receipt' },
  { id: 'ips', nama: 'IPS (Sosiologi/Geografi/Sejarah)', ikon: 'earth-asia' },
  { id: 'bahasa_indonesia', nama: 'Bahasa Indonesia', ikon: 'book' },
  { id: 'bahasa_inggris', nama: 'Bahasa Inggris', ikon: 'language' },
  { id: 'seni_budaya', nama: 'Seni Budaya', ikon: 'palette' },
  { id: 'pjok', nama: 'PJOK', ikon: 'person-running' },
  { id: 'prakarya', nama: 'Prakarya/Kejuruan', ikon: 'wrench' },
];

/**
 * BAGIAN 4: Gaya Kerja (4 pilihan A/B)
 */
export const BAGIAN_4_GAYA_KERJA = [
  {
    id: 'gw_1',
    topik: 'Kolaborasi',
    opsiA: { id: 'gw1_a', teks: 'Kerja bareng tim', ikon: 'users' },
    opsiB: { id: 'gw1_b', teks: 'Kerja sendiri', ikon: 'user' },
  },
  {
    id: 'gw_2',
    topik: 'Lingkungan Kerja',
    opsiA: { id: 'gw2_a', teks: 'Di dalam ruangan (kantor, lab)', ikon: 'building' },
    opsiB: { id: 'gw2_b', teks: 'Di lapangan, banyak bergerak', ikon: 'compass' },
  },
  {
    id: 'gw_3',
    topik: 'Dinamika Harian',
    opsiA: { id: 'gw3_a', teks: 'Rutinitas jelas', ikon: 'calendar-check' },
    opsiB: { id: 'gw3_b', teks: 'Hal baru setiap hari', ikon: 'sparkles' },
  },
  {
    id: 'gw_4',
    topik: 'Fokus Interaksi',
    opsiA: { id: 'gw4_a', teks: 'Lebih banyak berurusan dengan orang', ikon: 'comments' },
    opsiB: { id: 'gw4_b', teks: 'Lebih banyak berurusan dengan data dan benda', ikon: 'gears' },
  },
];

/**
 * Poin maksimum yang mungkin untuk tiap tipe RIASEC:
 * Bagian 1: 4 kartu * 2 poin = 8
 * Bagian 2: jumlah kemunculan tipe * 2 poin
 *   R muncul 2 kali  -> 4 poin  (Total max = 12)
 *   I muncul 5 kali  -> 10 poin (Total max = 18)
 *   A muncul 3 kali  -> 6 poin  (Total max = 14)
 *   S muncul 4 kali  -> 8 poin  (Total max = 16)
 *   E muncul 5 kali  -> 10 poin (Total max = 18)
 *   C muncul 5 kali  -> 10 poin (Total max = 18)
 */
export const RIASEC_MAX_POINTS = {
  Realistic: 12,
  Investigative: 18,
  Artistic: 14,
  Social: 16,
  Enterprising: 18,
  Conventional: 18,
};

/**
 * Fungsi pembantu untuk mengacak kartu Bagian 1
 * dengan jaminan tidak ada dua kartu bertipe sama berurutan.
 */
export function getNonAdjacentShuffledCards() {
  // Kelompokkan kartu berdasarkan tipe
  const groups = {
    Realistic: [],
    Investigative: [],
    Artistic: [],
    Social: [],
    Enterprising: [],
    Conventional: [],
  };

  BAGIAN_1_CARDS.forEach((card) => {
    groups[card.tipe].push(card);
  });

  // Acak tiap kelompok secara internal
  Object.keys(groups).forEach((type) => {
    groups[type].sort(() => Math.random() - 0.5);
  });

  // Susun kembali memastikan tidak ada dua tipe sama berurutan
  for (let attempt = 0; attempt < 100; attempt++) {
    const remaining = Object.keys(groups).flatMap((t) => [...groups[t]]);
    remaining.sort(() => Math.random() - 0.5);

    const result = [];
    let valid = true;

    while (remaining.length > 0) {
      const lastType = result.length > 0 ? result[result.length - 1].tipe : null;
      const candidates = remaining.filter((c) => c.tipe !== lastType);

      if (candidates.length === 0) {
        valid = false;
        break;
      }

      // Pilih kandidat dari tipe yang paling banyak tersisa agar tidak mentok di akhir
      const typeCounts = candidates.reduce((acc, c) => {
        acc[c.tipe] = (acc[c.tipe] || 0) + 1;
        return acc;
      }, {});

      candidates.sort((a, b) => typeCounts[b.tipe] - typeCounts[a.tipe]);
      const chosen = candidates[0];

      result.push(chosen);
      const chosenIdx = remaining.indexOf(chosen);
      remaining.splice(chosenIdx, 1);
    }

    if (valid && result.length === BAGIAN_1_CARDS.length) {
      return result;
    }
  }

  // Fallback deterministik jika loop acak gagal (interleaving 6 tipe x 4 kartu)
  const types = ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'];
  const fallback = [];
  for (let round = 0; round < 4; round++) {
    // Geser urutan per putaran agar bervariasi
    const rotatedTypes = [...types.slice(round), ...types.slice(0, round)];
    rotatedTypes.forEach((t) => {
      fallback.push(groups[t][round]);
    });
  }
  return fallback;
}

/**
 * Mengacak urutan 4 opsi magang di Bagian 2
 */
export function getShuffledScenarioOptions(scenario) {
  return [...scenario.opsi].sort(() => Math.random() - 0.5);
}
