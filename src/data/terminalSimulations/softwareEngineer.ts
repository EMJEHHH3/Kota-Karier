import type { TerminalSimulation } from '../../types/terminalSimulation';

export const softwareEngineerTerminalSim: TerminalSimulation = {
  profesi: 'software-engineer',
  namaProfesi: 'Software Engineer',
  appTitle: 'KOTA-OS // TERMINAL',
  jamMulai: '08.00',
  jamSelesai: '16.00',
  deskripsi:
    'Masuki terminal kerja seorang Software Engineer di startup teknologi. Kerjakan tugas pemrograman, hadapi dinamika kerja, dan simpan hasilnya ke Git.',
  urutan: [
    // --- TUGAS 1 ---
    {
      tipe: 'tugas',
      data: {
        id: 'se-task-1',
        jam: '08.00',
        judul: 'Halo Dunia',
        penjelasan: 'Tampilkan teks "Halo Dunia" ke layar terminal.',
        panduan:
          'Tampilkan teks "Halo Dunia" ke layar terminal menggunakan fungsi print.',
        prompt: 'dev@kantor:~/project$ ',
        contohPerintah: 'print("Halo Dunia")',
        polaJawabanBenar: [
          '^print\\s*\\(\\s*"halo dunia"\\s*\\)\\s*;?$',
          '^echo\\s*"halo dunia"\\s*;?$',
        ],
        hint: 'Ketik persis seperti ini: print("Halo Dunia")',
        outputBenar: 'Halo Dunia',
        pesanError: 'Perintah belum tepat. Gunakan: print("Halo Dunia")',
      },
    },

    // --- TUGAS 2 ---
    {
      tipe: 'tugas',
      data: {
        id: 'se-task-2',
        jam: '09.30',
        judul: 'Variabel',
        penjelasan: 'Simpan nama "Budi" ke variabel lalu cetak isinya.',
        panduan:
          'Buat variabel nama = "Budi" lalu cetak dengan print(nama).',
        prompt: 'dev@kantor:~/project$ ',
        contohPerintah: 'nama = "Budi"; print(nama)',
        polaJawabanBenar: [
          '^nama\\s*=\\s*"budi"\\s*(;|&&|\\n)?\\s*print\\s*\\(\\s*nama\\s*\\)\\s*;?$',
          '^nama\\s*=\\s*"budi"\\s*;?$',
        ],
        hint: 'Ketik: nama = "Budi"; print(nama)',
        outputBenar: 'Budi',
        pesanError: 'Belum sesuai. Coba ketik: nama = "Budi"; print(nama)',
        subLangkah: {
          polaAwal: ['^nama\\s*=\\s*"budi"\\s*;?$'],
          outputAwal: '> Variabel nama berhasil disimpan.',
          panduanLanjutan: 'Cetak isi variabel dengan perintah: print(nama)',
          promptLanjutan: '>>> ',
          polaLanjutan: ['^print\\s*\\(\\s*nama\\s*\\)\\s*;?$'],
          outputLanjutan: 'Budi',
        },
      },
    },

    // --- WORLD EVENT 1 ---
    {
      tipe: 'event',
      data: {
        id: 'se-event-1',
        jam: '10.00',
        karakter: 'Bos Hendra (Engineering Lead)',
        avatar: '👨‍💼',
        judul: 'Permintaan Darurat dari Tim Lead',
        cerita:
          'Bos kamu datang ke mejamu: "Eh, bisa tolong bantu cek bug di modul login sekarang? Klien VIP lagi komplain tidak bisa masuk dashboard."',
        pilihan: [
          {
            teks: 'Bantu sekarang juga — prioritaskan kepuasan klien dan langsung cek log server.',
            dampak: {
              interest: 1,
              ability: 2,
              resilience: 1,
              workStyle: { analytical: 1, social: 2, creative: 0, technical: 2 },
            },
            konsekuensi:
              'Bos Hendra sangat terkesan dengan kesigapanmu! Bug berhasil kamu isolasi dalam 30 menit. Reputasimu di mata tim melesat.',
            jamBaru: '10.30',
          },
          {
            teks: 'Minta waktu 30 menit — selesaikan tugas variabel saat ini agar fokus tidak terpecah.',
            dampak: {
              interest: 0,
              ability: 1,
              resilience: 2,
              workStyle: { analytical: 2, social: 0, creative: 0, technical: 1 },
            },
            konsekuensi:
              'Bos mengangguk setuju: "Bagus, manajemen waktu yang tegas." Kamu menuntaskan pekerjaanmu lalu membantu dengan kepala dingin.',
            jamBaru: '10.30',
          },
          {
            teks: 'Delegasikan ke rekan tim senior yang memegang modul otentikasi login sebelumnya.',
            dampak: {
              interest: 0,
              ability: 1,
              resilience: 0,
              workStyle: { analytical: 1, social: 2, creative: 1, technical: 0 },
            },
            konsekuensi:
              'Rekan senior segera mengambil alih karena sudah hafal kodenya. Masalah beres cepat dan koordinasi tim berjalan efisien.',
            jamBaru: '10.15',
          },
        ],
      },
    },

    // --- TUGAS 3 ---
    {
      tipe: 'tugas',
      data: {
        id: 'se-task-3',
        jam: '11.00',
        judul: 'Perbaiki Bug',
        penjelasan: 'Angka tidak bisa digabung langsung dengan teks.',
        panduan:
          'Perbaiki TypeError! Ubah kode agar angka 5 dibungkus str(5): print("Total: " + str(5))',
        prompt: 'dev@kantor:~/project$ ',
        contohPerintah: 'print("Total: " + str(5))',
        polaJawabanBenar: [
          '^print\\s*\\(\\s*"total:\\s*"\\s*\\+\\s*str\\s*\\(\\s*5\\s*\\)\\s*\\)\\s*;?$',
          '^print\\s*\\(\\s*f?"total:\\s*5"\\s*\\)\\s*;?$',
          '^print\\s*\\(\\s*"total:",\\s*5\\s*\\)\\s*;?$',
        ],
        hint: 'Perbaiki menjadi: print("Total: " + str(5))',
        outputBenar: 'Total: 5',
        pesanError: 'Pastikan angka 5 dibungkus str(5): print("Total: " + str(5))',
      },
    },

    // --- WORLD EVENT 2 ---
    {
      tipe: 'event',
      data: {
        id: 'se-event-2',
        jam: '12.30',
        karakter: 'Dika (Frontend Engineer)',
        avatar: '👩‍💻',
        judul: 'Code Review & Waktu Makan Siang',
        cerita:
          'Dika menepuk pundakmu: "Halo! Pull Request (PR) baruku untuk halaman checkout sudah siap di-review. Sekalian mau makan siang bareng ke kantin gak?"',
        pilihan: [
          {
            teks: 'Review kodenya 15 menit sekarang, setelah itu baru pergi makan siang bersama.',
            dampak: {
              interest: 1,
              ability: 2,
              resilience: 1,
              workStyle: { analytical: 2, social: 2, creative: 0, technical: 1 },
            },
            konsekuensi:
              'Dika sangat senang PR-nya cepat ditinjau. Kamu menemukan 1 typo kecil di button. Setelah itu kalian makan siang dengan tenang.',
            jamBaru: '13.30',
          },
          {
            teks: 'Makan siang dulu untuk recharge energi, review kode dilakukan setelah kembali ke meja.',
            dampak: {
              interest: 1,
              ability: 1,
              resilience: 2,
              workStyle: { analytical: 1, social: 1, creative: 0, technical: 0 },
            },
            konsekuensi:
              'Pikiranmu kembali jernih setelah makan siang soto ayam. Saat review jam 13.00, analisismu jadi jauh lebih tajam.',
            jamBaru: '13.30',
          },
          {
            teks: 'Bawa laptop ke kantin dan review kodenya sambil makan bersama.',
            dampak: {
              interest: 0,
              ability: 1,
              resilience: 0,
              workStyle: { analytical: 0, social: 2, creative: 2, technical: 1 },
            },
            konsekuensi:
              'Diskusi arsitektur kode berlangsung santai dan penuh tawa. Untungnya tidak ada kuah soto yang menetes ke keyboard!',
            jamBaru: '13.30',
          },
        ],
      },
    },

    // --- TUGAS 4 ---
    {
      tipe: 'tugas',
      data: {
        id: 'se-task-4',
        jam: '14.00',
        judul: 'Simpan Kode',
        penjelasan: 'Simpan pekerjaanmu ke sistem version control Git.',
        panduan:
          'Simpan pekerjaanmu ke Git dengan perintah: git commit -m "fix bug total"',
        prompt: 'dev@kantor:~/project$ ',
        contohPerintah: 'git commit -m "fix bug total"',
        polaJawabanBenar: [
          '^git\\s+commit\\s+-m\\s+"fix bug total"\\s*;?$',
        ],
        hint: 'Ketik: git commit -m "fix bug total"',
        outputBenar:
          '[main 7b31e9a] fix bug total\n 2 files changed, 4 insertions(+), 1 deletion(-)',
        pesanError: 'Perintah git belum tepat. Ketik: git commit -m "fix bug total"',
      },
    },
  ],
};
