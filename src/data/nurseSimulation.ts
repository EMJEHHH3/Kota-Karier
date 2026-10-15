import type { NurseSimulationData } from '../types/nurseSimulation';

export const perawatNurseSimulation: NurseSimulationData = {
  profesi: 'perawat',
  namaProfesi: 'Perawat (Nurse)',
  jamMulai: '07.00',
  jamSelesai: '14.00',
  disclaimer:
    'Simulasi edukatif untuk mengenal profesi perawat, bukan panduan medis.',
  urutan: [
    {
      tipe: 'misi',
      id: 'vital',
      jam: '07.00',
      judul: 'Misi 1: Cek Tanda Vital',
      deskripsi:
        'Periksa monitor tanda vital pasien. Ketuk nilai yang berada di luar rentang normal, lalu kirimkan laporanmu.',
    },
    {
      tipe: 'misi',
      id: 'obat',
      jam: '08.30',
      judul: 'Misi 2: Pemberian Obat 5 Benar',
      deskripsi:
        'Cocokkan kartu resep dengan label obat berdasarkan 5 Benar (Pasien, Obat, Dosis, Rute, Waktu). Temukan ketidakcocokan sebelum bertindak.',
    },
    {
      tipe: 'event',
      id: 'igd',
      jam: '09.30',
      judul: 'Panggilan Darurat IGD',
    },
    {
      tipe: 'misi',
      id: 'triase',
      jam: '10.30',
      judul: 'Misi 3: Triase Pasien',
      deskripsi:
        'Urutkan prioritas penanganan pasien dari yang paling kritis (Segera) hingga yang stabil (Biasa).',
    },
    {
      tipe: 'event',
      id: 'keluarga',
      jam: '11.30',
      judul: 'Keluhan Keluarga Pasien',
    },
    {
      tipe: 'misi',
      id: 'komunikasi',
      jam: '12.30',
      judul: 'Misi 4: Menenangkan Pasien',
      deskripsi:
        'Pasien cemas sebelum prosedur pengambilan darah. Berikan respons terapeutik yang empatik dan menenangkan.',
    },
  ],
  misi: {
    vital: {
      pasien: {
        nama: 'Tn. Bambang',
        usia: 54,
        kamar: 'Kamar 204 Bed B',
        keluhan: 'Pasca operasi hernia hari ke-2, mengeluhkan badan terasa meriang dan gerah.',
      },
      tandaVital: [
        {
          id: 'suhu',
          label: 'Suhu Tubuh',
          nilai: '38,6',
          unit: '°C',
          isAbnormal: true,
          alasan: 'Suhu 38,6 °C mengindikasikan demam (febris), di atas batas normal 37,5 °C.',
        },
        {
          id: 'nadi',
          label: 'Denyut Nadi',
          nilai: 82,
          unit: 'x/menit',
          isAbnormal: false,
          alasan: 'Nadi 82 x/menit normal (rentang normal 60 - 100 x/menit).',
        },
        {
          id: 'tensi',
          label: 'Tekanan Darah',
          nilai: '118/76',
          unit: 'mmHg',
          isAbnormal: false,
          alasan: 'Tekanan darah 118/76 mmHg normal (rentang normal 90/60 - 120/80 mmHg).',
        },
        {
          id: 'saturasi',
          label: 'Saturasi Oksigen (SpO2)',
          nilai: 97,
          unit: '%',
          isAbnormal: false,
          alasan: 'Saturasi oksigen 97% sangat baik (rentang normal 95 - 100%).',
        },
      ],
      rentangNormal: [
        { parameter: 'Suhu Tubuh', rujukan: '36,5 - 37,5 °C' },
        { parameter: 'Denyut Nadi', rujukan: '60 - 100 x/menit' },
        { parameter: 'Tekanan Darah', rujukan: '90/60 - 120/80 mmHg' },
        { parameter: 'Saturasi O2', rujukan: '95 - 100%' },
      ],
      hint: 'Bandingkan suhu tubuh 38,6 °C dengan rentang normal (36,5 - 37,5 °C). Angka tersebut lebih tinggi dari normal!',
    },

    obat: {
      resep: {
        pasien: 'Ny. Siti Rahma (Kmr 204)',
        obat: 'Kapsul Cefadro (Antibiotik Fiktif)',
        dosis: '1 kapsul (500 mg)',
        rute: 'Oral (Minum)',
        waktu: '08.30 WIB (Pagi)',
      },
      labelObat: {
        pasien: 'Ny. Sri Rahayu (Kmr 205)',
        obat: 'Kapsul Cefadro (Antibiotik Fiktif)',
        dosis: '1 kapsul (500 mg)',
        rute: 'Oral (Minum)',
        waktu: '08.30 WIB (Pagi)',
      },
      mismatchedAspect: 'pasien',
      penjelasanMismatched:
        'Nama pasien pada resep adalah "Ny. Siti Rahma", namun label obat tertera "Ny. Sri Rahayu". Salah pasien adalah potensi kesalahan fatal dalam farmakoterapi!',
      hint: 'Perhatikan nama pasien di kartu resep ("Ny. Siti Rahma") dan di label obat ("Ny. Sri Rahayu"). Keduanya berbeda orang!',
    },

    triase: {
      pasienList: [
        {
          id: 'pasien-1',
          nama: 'Tn. Aris (46 thn)',
          usia: 46,
          keluhan: 'Sesak napas mendadak, napas cepat dan bibir tampak kebiruan (sianosis).',
          prioritas: 'Segera',
          urutanBenar: 1,
          penjelasan:
            'Prioritas Segera (Gawat Darurat): Gangguan oksigenasi dan jalan napas mengancam nyawa dalam hitungan menit.',
        },
        {
          id: 'pasien-2',
          nama: 'An. Dani (8 thn)',
          usia: 8,
          keluhan: 'Demam tinggi 39,2 °C sejak kemarin, tampak sangat lemas dan tidak mau minum.',
          prioritas: 'Cepat',
          urutanBenar: 2,
          penjelasan:
            'Prioritas Cepat (Mendesak): Demam tinggi pada anak dengan tanda dehidrasi berisiko kejang demam bila tidak segera ditangani.',
        },
        {
          id: 'pasien-3',
          nama: 'Sdr. Rian (20 thn)',
          usia: 20,
          keluhan: 'Luka lecet di lutut dan siku setelah jatuh dari sepeda kayuh, perdarahan minimal.',
          prioritas: 'Biasa',
          urutanBenar: 3,
          penjelasan:
            'Prioritas Biasa (Non-Akut): Tanda vital stabil, luka superfisial tanpa ancaman komplikasi segera.',
        },
      ],
      hint: 'Prioritaskan pasien dengan gangguan pernapasan/oksigen (Tn. Aris) paling atas, lalu demam tinggi anak (An. Dani), dan luka ringan (Sdr. Rian) di akhir.',
    },

    komunikasi: {
      pasien: {
        nama: 'Ibu Ratna',
        usia: 38,
        kondisi: 'Akan diambil sampel darah vena untuk evaluasi hemoglobin pra-tindakan.',
        dialog:
          'Suster... saya dari kecil trauma jarum suntik. Tanganku dingin banget, sakit banget gak ya sus?',
      },
      pilihan: [
        {
          id: 'opt-empatik',
          tipe: 'empatik',
          teks:
            'Saya mengerti kekhawatiran Ibu, sangat wajar merasa cemas. Tarik napas panjang perlahan ya Bu, saya gunakan jarum paling kecil dan lakukan selembut mungkin. Saya temani sampai selesai.',
          responPasien:
            '"Terima kasih ya suster... mendengarnya bikin saya merasa jauh lebih tenang dan siap."',
          dampakTrust: 25,
          umpanBalik:
            'Komunikasi terapeutik yang sangat baik! Memvalidasi perasaan cemas pasien dan menjelaskan prosedur secara tenang terbukti menurunkan ambang rasa nyeri.',
        },
        {
          id: 'opt-cuek',
          tipe: 'cuek',
          teks:
            'Tenang aja Bu, gak usah lebay, cuma sebentar kok kayak digigit semut. Jangan tegang biar cepat selesai.',
          responPasien:
            '"Oh... iya suster..." (Pasien terlihat semakin tegang dan menarik lengannya ke belakang).',
          dampakTrust: -10,
          umpanBalik:
            'Menganggap remeh rasa takut pasien menurunkan rasa percaya (trust) dan membuat otot vena justru menegang sehingga penusukan jarum lebih sulit.',
        },
        {
          id: 'opt-jargon',
          tipe: 'jargon',
          teks:
            'Prosedur flebotomi vena mediana cubiti hanya memicu stimulasi nosiseptif minimal pada nosiseptor kutaneus dermal Ibu.',
          responPasien:
            '"Hah...? Maksudnya gimana sus? Saya malah bingung dan tambah takut..."',
          dampakTrust: 0,
          umpanBalik:
            'Menggunakan jargon medis ilmiah yang rumit pada pasien yang sedang cemas justru membingungkan dan tidak meredakan ketakutan emosional mereka.',
        },
      ],
      hint: 'Pilihlah jawaban yang mengakui rasa takut pasien, memberikan petunjuk relaksasi napas, dan menenangkan dengan kata-kata hangat yang mudah dipahami.',
    },
  },
  event: {
    igd: {
      id: 'igd',
      jam: '09.30',
      judul: 'Pasien Gawat Masuk IGD',
      karakter: 'Ners Dewi (Perawat Senior)',
      avatar: '👩‍⚕️',
      cerita:
        'Seorang rekan perawat memanggil dari lorong: "Suster, tolong bantu di IGD sekarang! Ada rujukan pasien baru dengan sesak napas berat dan tim IGD sedang kekurangan tangan!"',
      pilihan: [
        {
          teks: 'Titip tugas bangsal ke rekan yang ada, lalu segera meluncur membantu IGD.',
          dampak: {
            prioritas: 2,
            kolaborasi: 2,
            empati: 1,
            manajemenWaktu: 1,
          },
          konsekuensi:
            'Kamu sigap membantu resusitasi oksigen di IGD dan pasien tertolong cepat. Rekan bangsalmu menyelesaikan operan tugas dengan lancar.',
          jamBaru: '10.00',
          menitTambahan: 30,
        },
        {
          teks: 'Selesaikan pencatatan rekam medis bangsal dulu secara lengkap, baru bergegas ke IGD.',
          dampak: {
            ketelitian: 2,
            prioritas: -1,
            manajemenWaktu: 0,
          },
          konsekuensi:
            'Pencatatan rekam medismu sangat rapi, namun tim IGD sempat kewalahan menstabilkan pasien beberapa menit sebelum bantuanmu tiba.',
          jamBaru: '10.15',
          menitTambahan: 45,
        },
        {
          teks: 'Minta rekan lain yang sedang luang untuk ke IGD agar kamu tetap fokus menjaga bangsal.',
          dampak: {
            kolaborasi: 0,
            manajemenWaktu: 1,
            ketelitian: 1,
          },
          konsekuensi:
            'Rekan lain bergegas ke IGD. Bangsal rawat inap tetap stabil terjaga, meskipun tim IGD berharap kamu yang turun tangan.',
          jamBaru: '09.45',
          menitTambahan: 15,
        },
      ],
    },

    keluarga: {
      id: 'keluarga',
      jam: '11.30',
      judul: 'Keluarga Pasien Emosi di Nurse Station',
      karakter: 'Keluarga Pasien Kamar 202',
      avatar: '👨‍💼',
      cerita:
        'Keluarga pasien mendatangi nurse station dengan suara keras: "Suster! Dari pagi kami menunggu dokter visite mana ya?! Kenapa belum datang juga? Pelayanan di sini lambat sekali!"',
      pilihan: [
        {
          teks:
            'Dengarkan dulu dengan tenang, minta maaf atas penantian mereka, dan jelaskan bahwa dokter sedang menangani operasi darurat yang tak terduga.',
          dampak: {
            empati: 2,
            komunikasi: 2,
            kolaborasi: 1,
            manajemenWaktu: 1,
          },
          konsekuensi:
            'Keluarga mulai tenang setelah keluhannya didengar dengan empati. Mereka berterima kasih atas penjelasan yang transparan dan bersedia menunggu.',
          jamBaru: '11.50',
          menitTambahan: 20,
        },
        {
          teks:
            'Jelaskan bahwa ini sudah sesuai prosedur rumah sakit dan minta mereka untuk tetap menunggu di kamar pasien.',
          dampak: {
            empati: -1,
            komunikasi: 0,
            manajemenWaktu: 1,
          },
          konsekuensi:
            'Keluarga kembali ke kamar dengan perasaan kesal dan kecewa. Suasana pelayanan menjadi tegang.',
          jamBaru: '11.40',
          menitTambahan: 10,
        },
        {
          teks:
            'Panggil petugas keamanan untuk menertibkan keluarga pasien agar tidak mengganggu operasional bangsal.',
          dampak: {
            komunikasi: -2,
            empati: -2,
            kolaborasi: 1,
          },
          konsekuensi:
            'Nurse station kembali hening, namun ketegangan emosional antara keluarga pasien dan staf medis semakin meruncing.',
          jamBaru: '11.45',
          menitTambahan: 15,
        },
      ],
    },
  },
};
