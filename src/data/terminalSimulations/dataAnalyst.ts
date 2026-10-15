import type { TerminalSimulation } from '../../types/terminalSimulation';

export const dataAnalystTerminalSim: TerminalSimulation = {
  profesi: 'data-analyst',
  namaProfesi: 'Data Analyst',
  appTitle: 'KOTA-OS // TERMINAL',
  jamMulai: '08.00',
  jamSelesai: '16.00',
  deskripsi:
    'Masuki peran Data Analyst. Tarik data penjualan dengan query SQL, analisis anomali, bantu tim bisnis mengambil keputusan berbasis data!',
  urutan: [
    // --- TUGAS 1 ---
    {
      tipe: 'tugas',
      data: {
        id: 'da-task-1',
        jam: '08.00',
        judul: 'Tarik Transaksi',
        penjelasan: 'Ambil seluruh data transaksi dari tabel penjualan.',
        panduan:
          'Ambil seluruh data transaksi penjualan dengan query SELECT * FROM penjualan;',
        prompt: 'analyst@db-warehouse:~$ sql> ',
        contohPerintah: 'SELECT * FROM penjualan;',
        polaJawabanBenar: [
          '^select\\s+\\*\\s+from\\s+penjualan\\s*;?$',
        ],
        hint: 'Ketik query SQL: SELECT * FROM penjualan;',
        outputBenar:
          ' id | nama_produk | kota     | total_rp  \n----+-------------+----------+-----------\n  1 | Laptop Pro  | Jakarta  | 15000000  \n  2 | Mouse X     | Surabaya |   250000  \n  3 | Keyboard Z  | Jakarta  |   850000  \n(3 baris)',
        pesanError: 'Query belum tepat. Gunakan: SELECT * FROM penjualan;',
      },
    },

    // --- TUGAS 2 ---
    {
      tipe: 'tugas',
      data: {
        id: 'da-task-2',
        jam: '09.30',
        judul: 'Filter Jakarta',
        penjelasan: 'Saring transaksi khusus yang berada di kota Jakarta.',
        panduan:
          'Filter data penjualan khusus transaksi Jakarta: SELECT * FROM penjualan WHERE kota = \'Jakarta\';',
        prompt: 'analyst@db-warehouse:~$ sql> ',
        contohPerintah: "SELECT * FROM penjualan WHERE kota = 'Jakarta';",
        polaJawabanBenar: [
          '^select\\s+\\*\\s+from\\s+penjualan\\s+where\\s+kota\\s*=\\s*"jakarta"\\s*;?$',
        ],
        hint: "Ketik: SELECT * FROM penjualan WHERE kota = 'Jakarta';",
        outputBenar:
          ' id | nama_produk | kota    | total_rp  \n----+-------------+---------+-----------\n  1 | Laptop Pro  | Jakarta | 15000000  \n  3 | Keyboard Z  | Jakarta |   850000  \n(2 baris)',
        pesanError: "Query filter belum tepat. Ketik: SELECT * FROM penjualan WHERE kota = 'Jakarta';",
      },
    },

    // --- WORLD EVENT 1 ---
    {
      tipe: 'event',
      data: {
        id: 'da-event-1',
        jam: '10.00',
        karakter: 'Rina (Head of Marketing)',
        avatar: '👩‍💼',
        judul: 'Permintaan Data Mendadak untuk Rapat Investor',
        cerita:
          'Rina mendatangi mejamu dengan wajah cemas: "Bisa minta tolong siapkan ringkasan tren transaksi 3 bulan terakhir? Rapat dadakan dengan calon investor dimulai jam 11!"',
        pilihan: [
          {
            teks: 'Buatkan ringkasan kilat 3 metrik inti (Total Penjualan, Rata-rata Keranjang, Kota Terlaris) dalam 20 menit.',
            dampak: {
              interest: 1,
              ability: 2,
              resilience: 1,
              workStyle: { analytical: 2, social: 2, creative: 1, technical: 1 },
            },
            konsekuensi:
              'Rina sangat terbantu! Investor kagum dengan angka yang disajikan secara ringkas dan lugas. Kamu mendapat pujian di slack channel perusahaan.',
            jamBaru: '10.45',
          },
          {
            teks: 'Minta waktu 45 menit agar data divalidasi silang secara mendalam dan bebas anomali.',
            dampak: {
              interest: 0,
              ability: 2,
              resilience: 2,
              workStyle: { analytical: 3, social: 0, creative: 0, technical: 2 },
            },
            konsekuensi:
              'Data selesai tepat sebelum rapat dibuka. Akurasinya 100% sempurna tanpa ada keraguan dari dewan investor.',
            jamBaru: '11.00',
          },
          {
            teks: 'Buka dashboard BI internal dan tunjukkan cara Rina memfilter chart sesuai kebutuhannya.',
            dampak: {
              interest: 0,
              ability: 1,
              resilience: 0,
              workStyle: { analytical: 1, social: 3, creative: 1, technical: 0 },
            },
            konsekuensi:
              'Rina belajar menarik insight sendiri. Ke depan, tim marketing menjadi jauh lebih mandiri dalam membaca data!',
            jamBaru: '10.30',
          },
        ],
      },
    },

    // --- TUGAS 3 ---
    {
      tipe: 'tugas',
      data: {
        id: 'da-task-3',
        jam: '11.30',
        judul: 'Hitung Omzet',
        penjelasan: 'Hitung total omzet menggunakan fungsi agregasi SUM.',
        panduan:
          'Hitung total pendapatan dengan fungsi SUM: SELECT SUM(total_rp) FROM penjualan;',
        prompt: 'analyst@db-warehouse:~$ sql> ',
        contohPerintah: 'SELECT SUM(total_rp) FROM penjualan;',
        polaJawabanBenar: [
          '^select\\s+sum\\s*\\(\\s*total_rp\\s*\\)\\s+from\\s+penjualan\\s*;?$',
        ],
        hint: 'Ketik: SELECT SUM(total_rp) FROM penjualan;',
        outputBenar:
          '   sum_total   \n---------------\n  16100000  \n(1 baris)',
        pesanError: 'Fungsi agregasi belum tepat. Ketik: SELECT SUM(total_rp) FROM penjualan;',
      },
    },

    // --- WORLD EVENT 2 ---
    {
      tipe: 'event',
      data: {
        id: 'da-event-2',
        jam: '12.30',
        karakter: 'Sistem Deteksi Anomali',
        avatar: '🤖',
        judul: 'Peringatan: Transaksi Mencurigakan Rp 0',
        cerita:
          'Saat membersihkan dataset, kamu menemukan 3 transaksi bernilai Rp 0 yang terjadi pada tengah malam kemarin.',
        pilihan: [
          {
            teks: 'Investigasi log database dan koordinasi dengan tim backend untuk verifikasi.',
            dampak: {
              interest: 1,
              ability: 2,
              resilience: 1,
              workStyle: { analytical: 2, social: 1, creative: 0, technical: 2 },
            },
            konsekuensi:
              'Ternyata itu adalah automated test akun internal yang belum di-flag. Berkat kamu, integritas data gudang tetap steril!',
            jamBaru: '13.30',
          },
          {
            teks: 'Filter keluar transaksi Rp 0 dari laporan sementara dan beri catatan kaki di analisa.',
            dampak: {
              interest: 1,
              ability: 1,
              resilience: 2,
              workStyle: { analytical: 1, social: 0, creative: 1, technical: 1 },
            },
            konsekuensi:
              'Laporan bulanan tidak terdistorsi dan tim audit mengapresiasi catatan kakimu yang jujur dan transparan.',
            jamBaru: '13.30',
          },
          {
            teks: 'Diskusikan bersama rekan data analyst senior saat makan siang bersama di kantin.',
            dampak: {
              interest: 0,
              ability: 1,
              resilience: 1,
              workStyle: { analytical: 1, social: 2, creative: 0, technical: 0 },
            },
            konsekuensi:
              'Senior analyst memberikan trik query pembersih data otomatis (data hygiene pipeline). Ilmu barumu bertambah!',
            jamBaru: '13.30',
          },
        ],
      },
    },

    // --- TUGAS 4 ---
    {
      tipe: 'tugas',
      data: {
        id: 'da-task-4',
        jam: '14.00',
        judul: 'Urutkan Omzet',
        penjelasan: 'Urutkan data transaksi dari omzet terbesar (DESC).',
        panduan:
          'Urutkan data penjualan dari nilai terbesar: SELECT * FROM penjualan ORDER BY total_rp DESC;',
        prompt: 'analyst@db-warehouse:~$ sql> ',
        contohPerintah: 'SELECT * FROM penjualan ORDER BY total_rp DESC;',
        polaJawabanBenar: [
          '^select\\s+\\*\\s+from\\s+penjualan\\s+order\\s+by\\s+total_rp\\s+desc\\s*;?$',
        ],
        hint: 'Ketik: SELECT * FROM penjualan ORDER BY total_rp DESC;',
        outputBenar:
          ' id | nama_produk | kota     | total_rp  \n----+-------------+----------+-----------\n  1 | Laptop Pro  | Jakarta  | 15000000  \n  3 | Keyboard Z  | Jakarta  |   850000  \n  2 | Mouse X     | Surabaya |   250000  \n(3 baris)',
        pesanError: 'Klausa pengurutan belum tepat. Ketik: SELECT * FROM penjualan ORDER BY total_rp DESC;',
      },
    },
  ],
};
