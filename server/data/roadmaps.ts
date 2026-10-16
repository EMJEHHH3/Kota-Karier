import type { ProfessionRoadmap, RoadmapProfessionSummary } from '../../src/types/roadmap.ts';

export const ROADMAP_SEED: Record<string, ProfessionRoadmap> = {
  'software-engineer': {
    professionId: 'software-engineer',
    professionName: 'Software Engineer',
    isGeneric: false,
    tagline: 'Membangun aplikasi, website, dan sistem komputasi berdaya guna tinggi.',
    phases: [
      {
        id: 'se-tahap-1',
        phaseNumber: 1,
        title: 'Tahap 1: Di SMA — Fondasi & Eksplorasi Awal',
        subtitle: 'Mulai bangun logika komputasi dan coba coding langsung tanpa biaya.',
        badge: 'Masa SMA',
        steps: [
          {
            id: 'se-s1',
            title: 'Asah Logika Matematika & Algoritma Dasar',
            description: 'Sebagai calon Software Engineer, latih pemecahan masalah komputasi lewat logika matematika, flowchart, dan pengenalan konsep perulangan serta percabangan.',
            tips: 'Mulai dengan bahasa yang ramah pemula seperti Python atau JavaScript.',
            links: [
              { label: 'freeCodeCamp (Responsive Web & JS)', url: 'https://www.freecodecamp.org' },
              { label: 'CS50x Harvard (Pengantar Ilmu Komputer)', url: 'https://cs50.harvard.edu/x' },
            ],
          },
          {
            id: 'se-s2',
            title: 'Ekskul Komputer / Robotik & Ikut Kompetisi IT',
            description: 'Gabung ekskul IT, club coding, atau tim robotik sekolah untuk melatih kerja sama tim dan bersiap mengikuti Olimpiade Sains Nasional (OSN) bidang Informatika.',
            tips: 'Ikut lomba bukan cuma soal juara, tapi membiasakan diri menghadapi problem solving di bawah batas waktu.',
            links: [
              { label: 'TOKI / TLX Training Gate (Latihan Soal OSN)', url: 'https://tlx.toki.id' },
            ],
          },
          {
            id: 'se-s3',
            title: 'Bangun Mini Project Web / Aplikasi Sederhana',
            description: 'Buat proyek nyata pertama untuk membuktikan kemampuan awal Software Engineer: website portofolio profil diri, kalkulator interaktif, atau bot pengingat tugas kelas.',
            tips: 'Unggah kodinganmu ke GitHub agar mulai terbiasa menggunakan version control.',
            links: [
              { label: 'The Odin Project (Web Dev Mandiri)', url: 'https://www.theodinproject.com' },
            ],
          },
        ],
      },
      {
        id: 'se-tahap-2',
        phaseNumber: 2,
        title: 'Tahap 2: Kuliah / Jalur Pendidikan — Menguasai Rekayasa Perangkat Lunak',
        subtitle: 'Pilih jurusan kuliah yang sesuai atau jalur alternatif berbasis industri.',
        badge: 'Pendidikan',
        steps: [
          {
            id: 'se-s4',
            title: 'Pilih Program Studi Sarjana (S1) Relevan',
            description: 'Jurusan utama untuk Software Engineer meliputi Teknik Informatika, Ilmu Komputer, Sistem Informasi, atau Rekayasa Perangkat Lunak (RPL).',
            tips: 'Contoh PTN/PTS rujukan: UI, ITB, ITS, UGM, Binus University, Telkom University.',
          },
          {
            id: 'se-s5',
            title: 'Jalur Alternatif: Vokasi (D3/D4 Politeknik) atau Bootcamp',
            description: 'Jika lebih menyukai banyak praktik langsung dibanding teori kalkulus murni, pertimbangkan D4 Teknik Informatika di Politeknik Elektronika Negeri Surabaya (PENS) atau Polban. Alternatif lain adalah Coding Bootcamp intensif (3-6 bulan) yang berfokus langsung pada stack teknologi industri.',
            tips: 'Vokasi memiliki porsi praktikum hingga 60-70% yang sangat relevan untuk portofolio software.',
          },
          {
            id: 'se-s6',
            title: 'Strategi Jalur Masuk (SNBP / SNBT / Mandiri)',
            description: 'Untuk SNBP, pertahankan nilai stabil tinggi pada Matematika Wajib & Peminatan. Untuk SNBT (UTBK), latih drill soal Penalaran Umum, Penalaran Matematika, dan Pemahaman Bacaan & Menulis.',
          },
        ],
      },
      {
        id: 'se-tahap-3',
        phaseNumber: 3,
        title: 'Tahap 3: Bangun Pengalaman — Portofolio, Magang & Komunitas',
        subtitle: 'Koneksikan teori akademik dengan ekosistem software engineering profesional.',
        badge: 'Pengalaman',
        steps: [
          {
            id: 'se-s7',
            title: 'Ikuti Program Magang (Internship)',
            description: 'Lamar program Software Engineer Intern di semester 5-6 pada tech startup atau software house. Pengalaman menangani kodingan production dan code review dari senior developer sangat bernilai tinggi.',
          },
          {
            id: 'se-s8',
            title: 'Kembangkan Portofolio Nyata di GitHub & Open Source',
            description: 'Publish 2-3 proyek aplikasi full-stack yang berjalan langsung di internet (bukan hanya tugas kuliah). Berkontribusilah pada repositori open source untuk menunjukkan etos kolaborasi.',
            links: [
              { label: 'GitHub Guides & Open Source', url: 'https://opensource.guide' },
            ],
          },
          {
            id: 'se-s9',
            title: 'Sertifikasi Global & Aktif di Komunitas Developer',
            description: 'Ambil sertifikasi cloud dasar seperti AWS Certified Cloud Practitioner atau sertifikasi Google Cloud. Bergabunglah dengan Google Developer Student Clubs (GDSC) atau komunitas lokal seperti SurabayaDev/JakartaJS.',
          },
        ],
      },
      {
        id: 'se-tahap-4',
        phaseNumber: 4,
        title: 'Tahap 4: Karier Awal — Masuk Industri & Jenjang Karier',
        subtitle: 'Mulai dari peran entry-level hingga memimpin arsitektur sistem perangkat lunak.',
        badge: 'Dunia Kerja',
        steps: [
          {
            id: 'se-s10',
            title: 'Posisi Entry-Level: Junior Software Engineer',
            description: 'Peran awal meliputi Junior Frontend Developer, Junior Backend Developer, Mobile Developer, atau QA/Automation Engineer yang bertugas menulis kode fitur terisolasi dan perbaikan bug.',
          },
          {
            id: 'se-s11',
            title: 'Gambaran Gaji Awal (Perkiraan)',
            description: 'Perkiraan gaji awal untuk Junior Software Engineer di Indonesia berkisar antara Rp6.000.000 – Rp11.000.000/bulan (bervariasi tergantung lokasi, skala startup/korporasi, dan keahlian spesifik).',
            tips: 'Label: Perkiraan pasar kerja Indonesia. Penguasaan problem solving dan bahasa Inggris membuka peluang remote kerja luar negeri dengan kompensasi lebih tinggi.',
          },
          {
            id: 'se-s12',
            title: 'Jalur Naik Jabatan (Career Ladder)',
            description: 'Junior Software Engineer (1-2 thn) ➔ Mid-Level Engineer (2-4 thn) ➔ Senior Software Engineer (5+ thn). Dari level senior, kamu bisa memilih jalur Individual Contributor (Staff Engineer / Principal Architect) atau jalur manajemen (Engineering Manager / Head of Engineering).',
          },
        ],
      },
    ],
  },

  dokter: {
    professionId: 'dokter',
    professionName: 'Dokter Umum',
    isGeneric: false,
    tagline: 'Mendiagnosis penyakit, mengobati pasien, dan mengawal kesehatan masyarakat.',
    phases: [
      {
        id: 'dr-tahap-1',
        phaseNumber: 1,
        title: 'Tahap 1: Di SMA — Penguatan Sains Hayati & Jiwa Kemanusiaan',
        subtitle: 'Perkuat fondasi sains dan biasakan diri dengan pelayanan sosial kesehatan.',
        badge: 'Masa SMA',
        steps: [
          {
            id: 'dr-s1',
            title: 'Perbanyak & Kuasai Biologi serta Kimia',
            description: 'Sebagai calon Dokter, kuasai konsep anatomi tubuh manusia, biologi sel, biokimia, dan genetika. Ketelitian membaca diagram medis dan penalaran ilmiah dimulai dari kedua mapel ini.',
            tips: 'Gunakan video animasi 3D anatomi untuk membayangkan mekanisme organ tubuh.',
            links: [
              { label: 'Khan Academy Medicine & Anatomy', url: 'https://www.khanacademy.org/science/health-and-medicine' },
            ],
          },
          {
            id: 'dr-s2',
            title: 'Aktif di Palang Merah Remaja (PMR) & Karya Ilmiah Remaja (KIR)',
            description: 'Ikuti PMR untuk melatih refleks pertolongan pertama, pembalutan luka, dan empati saat menghadapi orang cedera. Ikuti KIR untuk membiasakan penulisan riset ilmiah kedokteran.',
            tips: 'Menjadi sukarelawan bakti sosial melatih komunikasi interpersonal yang krusial bagi dokter.',
          },
          {
            id: 'dr-s3',
            title: 'Ikut Lomba & Olimpiade Kedokteran Pelajar',
            description: 'Ikuti ajang olimpiade sains bidang Biologi (OSN) atau Medical Olympiad antar-SMA yang diselenggarakan fakultas kedokteran (seperti MEDSPIN Unair, MIMS UI).',
          },
        ],
      },
      {
        id: 'dr-tahap-2',
        phaseNumber: 2,
        title: 'Tahap 2: Kuliah / Jalur Pendidikan — Program Sarjana Kedokteran',
        subtitle: 'Wajib melalui pendidikan akademik S1 Kedokteran yang berfokus klinis.',
        badge: 'Pendidikan',
        steps: [
          {
            id: 'dr-s4',
            title: 'Wajib Sarjana Kedokteran (S.Ked)',
            description: 'Profesi Dokter tidak memiliki jalur alternatif bootcamp atau politeknik karena regulasi keselamatan nyawa pasien. Kuliah S1 Kedokteran ditempuh sekitar 3.5 - 4 tahun untuk meraih gelar Sarjana Kedokteran (S.Ked).',
            tips: 'Contoh Fakultas Kedokteran terakreditasi Unggul: FK UI, FK UGM, FK Unair, FK Unpad, FK Undip, FK Hasanuddin.',
          },
          {
            id: 'dr-s5',
            title: 'Jalur Masuk: SNBP, SNBT, dan Ujian Mandiri',
            description: 'Persaingan FK sangat ketat. Di SNBP, nilai Biologi, Kimia, dan Bahasa Inggris harus konsisten di peringkat atas paralel. Di SNBT, skor UTBK pada subtes Penalaran Matematika dan Literasi harus berada di persentil tertinggi.',
          },
          {
            id: 'dr-s6',
            title: 'Persiapan Mental & Biaya Pendidikan',
            description: 'Riset Uang Kuliah Tunggal (UKT) berkeadilan dan Iuran Pengembangan Institusi (IPI). Siapkan mental belajar dengan metode Problem-Based Learning (PBL) dan praktikum anatomi kadaver sejak semester awal.',
          },
        ],
      },
      {
        id: 'dr-tahap-3',
        phaseNumber: 3,
        title: 'Tahap 3: Bangun Pengalaman — Koas, UKMPPD & Internship',
        subtitle: 'Praktik rotasi bangsal rumah sakit hingga berstatus dokter resmi berlisensi.',
        badge: 'Pengalaman',
        steps: [
          {
            id: 'dr-s7',
            title: 'Pendidikan Profesi Dokter (Koas / Dokter Muda)',
            description: 'Setelah S1, jalani program Koasistensi (1.5 - 2 tahun) di Rumah Sakit Pendidikan, berotasi di stase Penyakit Dalam, Bedah, Anak, Kebidanan (Obgyn), Jiwa, Mata, hingga THT.',
          },
          {
            id: 'dr-s8',
            title: 'Lulus Ujian Kompetensi (UKMPPD) & Sumpah Dokter',
            description: 'Ikuti Ujian Kompetensi Mahasiswa Program Profesi Dokter (CBT dan OSCE nasional). Setelah lulus, ikuti prosesi angkat Sumpah Dokter (Hippocratic Oath) dan memperoleh ijazah dokter.',
          },
          {
            id: 'dr-s9',
            title: 'Program Internship Kemenkes & STR Definitif',
            description: 'Menjalani dinas magang penempatan resmi Kementerian Kesehatan selama 1 tahun di Puskesmas dan RSUD daerah untuk mematangkan kemandirian klinis sebelum mendapatkan Surat Tanda Registrasi (STR) definitif.',
            links: [
              { label: 'Portal Kemenkes RI (Info Internship Dokter)', url: 'https://kemkes.go.id' },
            ],
          },
        ],
      },
      {
        id: 'dr-tahap-4',
        phaseNumber: 4,
        title: 'Tahap 4: Karier Awal — Praktik Dokter Umum & Spesialisasi',
        subtitle: 'Mengabdi sebagai dokter mandiri dan bersiap melanjutkan jenjang keahlian lanjut.',
        badge: 'Dunia Kerja',
        steps: [
          {
            id: 'dr-s10',
            title: 'Posisi Entry-Level: Dokter Umum (General Practitioner)',
            description: 'Bekerja sebagai dokter jaga IGD rumah sakit, dokter puskesmas, dokter klinik pratama, atau dokter perusahaan (Hiperkes) yang menangani triase, diagnosis awal, dan rujukan pasien.',
          },
          {
            id: 'dr-s11',
            title: 'Gambaran Gaji Awal (Perkiraan)',
            description: 'Perkiraan penghasilan dokter umum berkisar antara Rp5.500.000 – Rp10.000.000/bulan (bergantung pada lokasi, status ASN/non-ASN, jasa medik per pasien, serta jumlah jadwal jaga malam/shift IGD).',
            tips: 'Label: Perkiraan gaji dokter umum di fasilitas kesehatan Indonesia.',
          },
          {
            id: 'dr-s12',
            title: 'Jalur Naik Jabatan & Pendidikan Spesialis (PPDS)',
            description: 'Dokter Umum ➔ Dokter Penanggung Jawab Pelayanan / Kepala Puskesmas ➔ Melanjutkan Program Pendidikan Dokter Spesialis (PPDS) seperti Spesialis Bedah (Sp.B), Anak (Sp.A), Penyakit Dalam (Sp.PD) ➔ Konsultan / Subspesialis.',
          },
        ],
      },
    ],
  },

  'data-analyst': {
    professionId: 'data-analyst',
    professionName: 'Data Analyst',
    isGeneric: false,
    tagline: 'Mengolah kumpulan data mentah menjadi wawasan strategis keputusan bisnis.',
    phases: [
      {
        id: 'da-tahap-1',
        phaseNumber: 1,
        title: 'Tahap 1: Di SMA — Matematika Terapan & Eksplorasi Spreadsheet',
        subtitle: 'Pahami logika angka, statistika deskriptif, dan pengolahan data awal.',
        badge: 'Masa SMA',
        steps: [
          {
            id: 'da-s1',
            title: 'Kuasai Statistika Dasar & Spreadsheet Tingkat Lanjut',
            description: 'Sebagai calon Data Analyst, biasakan menggunakan Microsoft Excel / Google Sheets untuk formula VLOOKUP, XLOOKUP, INDEX/MATCH, dan Pivot Table.',
            tips: 'Cobalah mengolah data absensi atau rekap kas kelas menjadi grafik tren.',
            links: [
              { label: 'Kaggle Learn (Pandas, SQL, Intro to Data)', url: 'https://www.kaggle.com/learn' },
            ],
          },
          {
            id: 'da-s2',
            title: 'Coba Dasar Bahasa SQL & Python Sederhana',
            description: 'Mulai memahami konsep basis data relational (SELECT, WHERE, GROUP BY) serta library visualisasi data dasar seperti Matplotlib di Google Colab tanpa perlu instalasi rumit.',
            links: [
              { label: 'Mode Analytics SQL Tutorial (Gratis)', url: 'https://mode.com/sql-tutorial' },
            ],
          },
          {
            id: 'da-s3',
            title: 'Ikut Lomba Riset Sains / Statistika Pelajar',
            description: 'Ikuti lomba karya tulis ilmiah yang menggunakan olah data survei atau lomba analisis data pelajar SMA untuk mengasah cara mengkomunikasikan temuan angka ke orang awam.',
          },
        ],
      },
      {
        id: 'da-tahap-2',
        phaseNumber: 2,
        title: 'Tahap 2: Kuliah / Jalur Pendidikan — Memperdalam Sains Data & Bisnis',
        subtitle: 'Pilih jurusan analitik atau program diploma terapan yang aplikatif.',
        badge: 'Pendidikan',
        steps: [
          {
            id: 'da-s4',
            title: 'Pilihan Jurusan Kuliah S1 Relevan',
            description: 'Jurusan utama bagi Data Analyst adalah Statistika, Sains Data, Matematika Terapan, Sistem Informasi, atau Teknik Industri.',
            tips: 'Contoh kampus: ITS, IPB University, Unair, ITB, Universitas Airlangga, Telkom University.',
          },
          {
            id: 'da-s5',
            title: 'Jalur Alternatif: Vokasi D4 Sains Data atau Bootcamp',
            description: 'Politeknik kini menyediakan program D4 Rekayasa Sains Data yang berorientasi kerja. Selain itu, Bootcamp Data Analytics (seperti RevoU, Binar, Hacktiv8) melatih pembuatan dashboard bisnis nyata dalam tempo singkat.',
          },
          {
            id: 'da-s6',
            title: 'Jalur Masuk: SNBP & SNBT',
            description: 'Fokuskan nilai rapor pada Matematika dan Bahasa Inggris di SNBP. Di UTBK SNBT, tingkatkan nilai subtes Penalaran Matematika dan Pemecahan Masalah Kuantitatif.',
          },
        ],
      },
      {
        id: 'da-tahap-3',
        phaseNumber: 3,
        title: 'Tahap 3: Bangun Pengalaman — Portofolio Dashboard & Magang',
        subtitle: 'Tunjukkan kemampuan mengubah data menjadi visualisasi rekomendasi bisnis.',
        badge: 'Pengalaman',
        steps: [
          {
            id: 'da-s7',
            title: 'Bikin Portofolio Interaktif (Tableau Public / Power BI)',
            description: 'Buat 2-3 dashboard interaktif dari dataset publik (misal: analisis tren e-commerce, pola transportasi kota, atau churn pelanggan) dan publikasikan link Tableau Public milikmu.',
          },
          {
            id: 'da-s8',
            title: 'Magang Data Analyst di Perusahaan',
            description: 'Ikuti program magang Data Analyst Intern untuk merasakan langsung query data gudang (data warehouse), membersihkan data kotor, dan presentasi hasil ke tim marketing/manajemen.',
          },
          {
            id: 'da-s9',
            title: 'Sertifikasi Internasional',
            description: 'Ambil Google Data Analytics Professional Certificate atau Microsoft Certified: Power BI Data Analyst Associate untuk memperkuat profil CV.',
            links: [
              { label: 'Google Data Analytics Certificate (Coursera)', url: 'https://grow.google/certificates/data-analytics' },
            ],
          },
        ],
      },
      {
        id: 'da-tahap-4',
        phaseNumber: 4,
        title: 'Tahap 4: Karier Awal — Posisi Junior & Pengembangan Karier',
        subtitle: 'Menjadi mitra strategi bisnis hingga pimpinan analitik perusahaan.',
        badge: 'Dunia Kerja',
        steps: [
          {
            id: 'da-s10',
            title: 'Posisi Entry-Level: Junior Data Analyst / BI Analyst',
            description: 'Tugas mencakup automasi laporan harian, penarikan data via SQL, membuat visualisasi performa penjualan, serta deteksi anomali metric operasional.',
          },
          {
            id: 'da-s11',
            title: 'Gambaran Gaji Awal (Perkiraan)',
            description: 'Perkiraan gaji awal untuk Junior Data Analyst di Indonesia adalah Rp5.500.000 – Rp9.500.000/bulan (tergantung industri, misal perbankan, fintech, atau e-commerce).',
            tips: 'Label: Perkiraan entry-level industri teknologi dan korporasi.',
          },
          {
            id: 'da-s12',
            title: 'Jalur Naik Jabatan (Career Ladder)',
            description: 'Junior Data Analyst ➔ Senior Data Analyst ➔ Analytics Manager / Head of Business Intelligence, atau beralih cabang menuju Data Scientist / Data Engineer.',
          },
        ],
      },
    ],
  },

  perawat: {
    professionId: 'perawat',
    professionName: 'Perawat Medis',
    isGeneric: false,
    tagline: 'Garda terdepan perawatan pasien, triase gawat darurat, dan pendampingan pemulihan klinis.',
    phases: [
      {
        id: 'ns-tahap-1',
        phaseNumber: 1,
        title: 'Tahap 1: Di SMA — Membangun Empati & Pengetahuan Biologi',
        subtitle: 'Asah kepekaan sosial, ketahanan fisik, dan dasar sains manusia.',
        badge: 'Masa SMA',
        steps: [
          {
            id: 'ns-s1',
            title: 'Fokus pada Biologi & Fisiologi Dasar',
            description: 'Sebagai calon Perawat Medis, pelajari mekanisme organ tubuh manusia, sistem sirkulasi darah, kekebalan tubuh, dan sanitasi pencegahan infeksi mikroba.',
            tips: 'Kuasai konsep dasar tanda-tanda vital (tekanan darah, suhu tubuh, denyut nadi).',
          },
          {
            id: 'ns-s2',
            title: 'Aktif di PMR (Palang Merah Remaja) & Relawan Sosial',
            description: 'Ikuti PMR untuk mempraktikkan pertolongan pertama, evakuasi tandu, dan penanganan luka darurat. Latih ketenangan menghadapi orang yang cemas atau kesakitan.',
          },
          {
            id: 'ns-s3',
            title: 'Latih Keterampilan Komunikasi Interpersonal',
            description: 'Profesi perawat menuntut komunikasi terapeutik yang menenangkan dan santun. Latih berbicara jelas dan mendengarkan keluhan orang lain secara aktif.',
          },
        ],
      },
      {
        id: 'ns-tahap-2',
        phaseNumber: 2,
        title: 'Tahap 2: Kuliah / Jalur Pendidikan — Program Vokasi D3 atau S1 + Profesi Ners',
        subtitle: 'Pilih jalur vokasi praktis siap kerja atau sarjana akademik keperawatan.',
        badge: 'Pendidikan',
        steps: [
          {
            id: 'ns-s4',
            title: 'Jalur D3 Keperawatan (Ahli Madya Keperawatan / A.Md.Kep)',
            description: 'Pilihan pendidikan 3 tahun yang sangat menekankan praktik langsung di rumah sakit. Cocok untuk siswa yang ingin segera langsung bekerja di layanan kesehatan.',
            tips: 'Contoh institusi: Poltekkes Kemenkes di berbagai provinsi di seluruh Indonesia.',
          },
          {
            id: 'ns-s5',
            title: 'Jalur S1 Keperawatan + Profesi Ners (S.Kep., Ns)',
            description: 'Pendidikan 4 tahun S1 ditambah 1 tahun pendidikan profesi Ners di rumah sakit. Jalur ini membuka jenjang karier manajerial, perawat spesialis, dan karier keperawatan internasional.',
            tips: 'Contoh universitas: UI, Unpad, Unhas, Undip, UGM.',
          },
          {
            id: 'ns-s6',
            title: 'Jalur Masuk: SIMAMA Poltekkes & SNBP/SNBT',
            description: 'Poltekkes memiliki jalur tes mandiri serentak (SIMAMA Poltekkes) selain jalur SNBP dan SNBT untuk universitas negeri.',
          },
        ],
      },
      {
        id: 'ns-tahap-3',
        phaseNumber: 3,
        title: 'Tahap 3: Bangun Pengalaman — Praktik Klinik, Uji Kompetensi & STR',
        subtitle: 'Lengkapi lisensi resmi dan sertifikasi tindakan darurat klinis.',
        badge: 'Pengalaman',
        steps: [
          {
            id: 'ns-s7',
            title: 'Praktik Klinik Lapangan (PKL) di Berbagai Bangsal',
            description: 'Selama kuliah, kamu akan rotasi praktik di ruang rawat inap, Intensive Care Unit (ICU), Instalasi Gawat Darurat (IGD), dan kamar operasi (kamar bedah).',
          },
          {
            id: 'ns-s8',
            title: 'Lulus Uji Kompetensi Ners / D3 (UKNI) & Buat STR',
            description: 'Lulusan keperawatan wajib lulus ujian kompetensi nasional untuk memperoleh Surat Tanda Registrasi (STR) dari Konsil Tenaga Kesehatan Indonesia (KTKI) sebagai syarat legal praktik.',
          },
          {
            id: 'ns-s9',
            title: 'Sertifikasi Tambahan Penunjang Karier',
            description: 'Ambil sertifikasi BTCLS (Basic Trauma Cardiac Life Support) untuk penanganan henti jantung dan cedera darurat sebelum melamar ke rumah sakit besar.',
          },
        ],
      },
      {
        id: 'ns-tahap-4',
        phaseNumber: 4,
        title: 'Tahap 4: Karier Awal — Perawat Klinis & Jalur Spesialisasi',
        subtitle: 'Melayani di fasilitas kesehatan dengan jenjang perawat klinis terstruktur.',
        badge: 'Dunia Kerja',
        steps: [
          {
            id: 'ns-s10',
            title: 'Posisi Entry-Level: Perawat Pelaksana (Staff Nurse)',
            description: 'Bertugas memberikan asuhan keperawatan, memantau kondisi pasien, menjalankan instruksi obat dokter, dan mendokumentasikan rekam medis keperawatan.',
          },
          {
            id: 'ns-s11',
            title: 'Gambaran Gaji Awal (Perkiraan)',
            description: 'Perkiraan penghasilan berkisar antara Rp4.500.000 – Rp7.500.000/bulan (bervariasi menurut tipe rumah sakit swasta/negeri, UMR daerah, dan tunjangan shift malam).',
            tips: 'Label: Perkiraan gaji awal perawat pelaksana di fasilitas kesehatan.',
          },
          {
            id: 'ns-s12',
            title: 'Jenjang Karier Profesional Keperawatan',
            description: 'Perawat Klinis I (PK I) ➔ PK II ➔ PK III ➔ Kepala Ruangan (Head Nurse) ➔ Manajer Keperawatan Rumah Sakit, atau melanjutkan Spesialis Keperawatan Jiwa, Medikal Bedah, atau Perawat Anestesi.',
          },
        ],
      },
    ],
  },

  akuntan: {
    professionId: 'akuntan',
    professionName: 'Akuntan',
    isGeneric: false,
    tagline: 'Mengelola pembukuan keuangan, memastikan kepatuhan pajak, dan mengaudit kesehatan finansial organisasi.',
    phases: [
      {
        id: 'ak-tahap-1',
        phaseNumber: 1,
        title: 'Tahap 1: Di SMA — Fondasi Akuntansi & Ketelitian Finansial',
        subtitle: 'Pahami siklus akuntansi dasar, persamaan debit-kredit, dan hitung dagang.',
        badge: 'Masa SMA',
        steps: [
          {
            id: 'ak-s1',
            title: 'Pahami Dasar Akuntansi & Persamaan Dasar Keuangan',
            description: 'Sebagai calon Akuntan, pelajari konsep Harta = Utang + Modal, jurnal umum, buku besar, neraca saldo, dan laporan laba rugi sederhana.',
            tips: 'Ketelitian pada angka dan kerapian pencatatan adalah modal utama.',
            links: [
              { label: 'Khan Academy Finance & Capital Markets', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance' },
            ],
          },
          {
            id: 'ak-s2',
            title: 'Kuasai Spreadsheet & Praktik Kelola Keuangan Organisasi',
            description: 'Latih kemampuan Microsoft Excel untuk mengelola kas OSIS, ekstrakurikuler, atau pembukuan usaha kecil milik keluarga.',
          },
          {
            id: 'ak-s3',
            title: 'Ikuti Lomba Olimpiade Ekonomi & Akuntansi Pelajar',
            description: 'Ikuti ajang Accounting Competition tingkat SMA yang diselenggarakan universitas untuk membiasakan diri dengan studi kasus laporan keuangan.',
          },
        ],
      },
      {
        id: 'ak-tahap-2',
        phaseNumber: 2,
        title: 'Tahap 2: Kuliah / Jalur Pendidikan — Program Sarjana atau Politeknik Keuangan',
        subtitle: 'Kuliah Akuntansi di PTN/PTS atau ikatan dinas politeknik keuangan negara.',
        badge: 'Pendidikan',
        steps: [
          {
            id: 'ak-s4',
            title: 'Program Sarjana S1 Akuntansi',
            description: 'Mempelajari akuntansi keuangan menengah, akuntansi biaya, audit forensik, sistem informasi akuntansi, dan perpajakan korporasi.',
            tips: 'Contoh kampus: UI, UGM, Unair, Undip, Binus, Universitas Brawijaya.',
          },
          {
            id: 'ak-s5',
            title: 'Jalur Politeknik Kedinasan / Vokasi (PKN STAN atau D4 Akuntansi)',
            description: 'Politeknik Keuangan Negara (PKN STAN) menyediakan jalur kuliah vokasi dengan penempatan instansi negara. Politeknik negeri lain juga membuka D4 Akuntansi Perpajakan siap kerja.',
          },
          {
            id: 'ak-s6',
            title: 'Jalur Masuk: SNBP, SNBT, dan SPMB PKN STAN',
            description: 'Untuk SNBP, perkuat nilai Matematika dan Ekonomi. Untuk STAN, latih Tes Kemampuan Dasar (TKD), Tes Potensi Akademik (TPA), dan Tes Bahasa Inggris.',
          },
        ],
      },
      {
        id: 'ak-tahap-3',
        phaseNumber: 3,
        title: 'Tahap 3: Bangun Pengalaman — Magang KAP, Sertifikasi Brevet & Organisasi',
        subtitle: 'Raih jam terbang audit dan lengkapi kualifikasi profesional akuntan.',
        badge: 'Pengalaman',
        steps: [
          {
            id: 'ak-s7',
            title: 'Magang di Kantor Akuntan Publik (KAP) atau Korporasi',
            description: 'Magang sebagai Junior Auditor di KAP (Big 4 maupun KAP lokal) atau Staff Accounting di korporasi pada libur semester untuk memahami audit lapangan.',
          },
          {
            id: 'ak-s8',
            title: 'Sertifikasi Pajak Brevet A & B',
            description: 'Ambil kursus dan ujian Brevet Pajak A & B resmi untuk menguasai tata cara pelaporan SPT Tahunan, PPh 21, PPh 23, dan PPN yang sangat dicari industri.',
          },
          {
            id: 'ak-s9',
            title: 'Persiapan Sertifikasi Profesi (CA & CPA)',
            description: 'Persiapkan diri mengikuti ujian Chartered Accountant (CA Indonesia) dari IAI atau Certified Public Accountant (CPA) untuk mendapatkan izin tanda tangan laporan audit independen.',
            links: [
              { label: 'Ikatan Akuntan Indonesia (IAI)', url: 'https://iaiglobal.or.id' },
            ],
          },
        ],
      },
      {
        id: 'ak-tahap-4',
        phaseNumber: 4,
        title: 'Tahap 4: Karier Awal — Masuk Industri & Jenjang Puncak Finansial',
        subtitle: 'Mengawali langkah dari junior auditor hingga menjadi pimpinan keuangan (CFO).',
        badge: 'Dunia Kerja',
        steps: [
          {
            id: 'ak-s10',
            title: 'Posisi Entry-Level: Junior Auditor / Staff Accounting / Tax Officer',
            description: 'Tugas meliputi rekonsiliasi bank, penyusunan jurnal penyesuaian, pemeriksaan bukti transaksi, verifikasi invoice, dan pengarsipan bukti potong pajak.',
          },
          {
            id: 'ak-s11',
            title: 'Gambaran Gaji Awal (Perkiraan)',
            description: 'Perkiraan gaji awal untuk Junior Auditor / Accounting Staff adalah Rp5.000.000 – Rp8.500.000/bulan (bervariasi berdasarkan skala KAP, industri perbankan/multinasional, dan tunjangan dinas luar kota).',
            tips: 'Label: Perkiraan awal fresh graduate akuntansi di Indonesia.',
          },
          {
            id: 'ak-s12',
            title: 'Jalur Naik Jabatan (Career Ladder)',
            description: 'Junior Auditor / Staff ➔ Senior Auditor / Senior Accountant (2-4 thn) ➔ Accounting / Tax Manager (5-7 thn) ➔ Financial Controller ➔ Chief Financial Officer (CFO) atau Partner di Kantor Akuntan Publik.',
          },
        ],
      },
    ],
  },
};

/**
 * Generate a clean, structured generic fallback roadmap for any profession
 * that does not have a dedicated hand-crafted roadmap yet.
 */
export function generateGenericRoadmap(professionId: string, professionName?: string): ProfessionRoadmap {
  const name = professionName || professionId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    professionId,
    professionName: name,
    isGeneric: true,
    tagline: `Kerangka umum tahapan persiapan karier menuju profesi ${name}.`,
    note: 'Roadmap ini merupakan kerangka umum dan panduan dasar. Karena profesi ini belum memiliki kurasi modul khusus, kamu bisa mengembangkannya bersama guru BK atau mencari tahu lebih lanjut ke praktisi di bidang ini.',
    phases: [
      {
        id: `${professionId}-gen-1`,
        phaseNumber: 1,
        title: `Tahap 1: Di SMA — Membangun Minat & Skill Dasar ${name}`,
        subtitle: `Eksplorasi mata pelajaran yang relevan dan kenali seluk-beluk profesi ${name}.`,
        badge: 'Masa SMA',
        steps: [
          {
            id: `${professionId}-gen-s1`,
            title: `Identifikasi Mata Pelajaran Kunci untuk ${name}`,
            description: `Cari tahu mata pelajaran sekolah yang paling sering digunakan dalam profesi ${name}. Perkuat pemahaman konsep dasarnya dan konsultasikan dengan guru bidang terkait.`,
            tips: 'Tonton video wawancara "Day in the Life" praktisi di YouTube untuk melihat tugas hariannya.',
          },
          {
            id: `${professionId}-gen-s2`,
            title: 'Ekskul & Kegiatan Pengorganisasian Sekolah',
            description: `Ikuti ekstrakurikuler atau kepanitiaan yang melatih soft skill pendukung profesi ${name}, seperti komunikasi, manajemen waktu, kerja tim, dan ketelitian.`,
          },
          {
            id: `${professionId}-gen-s3`,
            title: `Coba Mini Project Mandiri Bidang ${name}`,
            description: `Buat proyek sederhana atau karya kecil yang mencerminkan karya seorang ${name} untuk menguji apakah kamu benar-benar menikmati proses kerjanya.`,
          },
        ],
      },
      {
        id: `${professionId}-gen-2`,
        phaseNumber: 2,
        title: `Tahap 2: Kuliah / Jalur Pendidikan — Studi Relevan untuk ${name}`,
        subtitle: `Riset program studi, kampus rujukan, dan alternatif pendidikan yang tepat.`,
        badge: 'Pendidikan',
        steps: [
          {
            id: `${professionId}-gen-s4`,
            title: `Pilih Program Studi Terkait Profesi ${name}`,
            description: `Petakan jurusan sarjana (S1) maupun vokasi (D3/D4) yang kurikulumnya mencetak lulusan berkualifikasi sebagai ${name}.`,
          },
          {
            id: `${professionId}-gen-s5`,
            title: 'Pertimbangkan Jalur Alternatif (Politeknik, Sertifikasi, Pelatihan)',
            description: `Jika bidang ini memiliki opsi pendidikan diploma praktis atau sertifikasi keahlian terstandar, bandingkan efisiensi waktu studi dan ketersediaan relasi industrinya.`,
          },
          {
            id: `${professionId}-gen-s6`,
            title: 'Susun Target Jalur Masuk (SNBP / SNBT / Mandiri)',
            description: `Cari data daya tampung dan tingkat keketatan kampus impian untuk program studi pilihanmu, lalu siapkan strategi belajar yang terukur.`,
          },
        ],
      },
      {
        id: `${professionId}-gen-3`,
        phaseNumber: 3,
        title: `Tahap 3: Bangun Pengalaman — Magang & Penguatan Portofolio`,
        subtitle: `Bangun rekam jejak nyata sebelum resmi menyelesaikan masa studi.`,
        badge: 'Pengalaman',
        steps: [
          {
            id: `${professionId}-gen-s7`,
            title: `Ikuti Magang Kerja di Bidang Terkait ${name}`,
            description: `Dapatkan pengalaman kerja di tempat magang untuk memahami alur kerja nyata, tantangan operasional harian, dan etika profesional sebagai ${name}.`,
          },
          {
            id: `${professionId}-gen-s8`,
            title: 'Dokumentasikan Portofolio Karya Nyata',
            description: `Kumpulkan contoh karya, laporan analisis, atau dokumentasi pencapaian selama kuliah ke dalam portofolio digital yang siap dibagikan ke rekruter.`,
          },
          {
            id: `${professionId}-gen-s9`,
            title: 'Jalin Relasi di Komunitas Profesional',
            description: `Bergabunglah ke asosiasi profesi atau komunitas praktisi untuk mendapatkan informasi lowongan tersembunyi dan tren industri terbaru.`,
          },
        ],
      },
      {
        id: `${professionId}-gen-4`,
        phaseNumber: 4,
        title: `Tahap 4: Karier Awal — Posisi Pemula Menuju Profesional Matang`,
        subtitle: `Memulai peran entry-level dan merencanakan tangga karier jangka panjang.`,
        badge: 'Dunia Kerja',
        steps: [
          {
            id: `${professionId}-gen-s10`,
            title: `Peran Entry-Level untuk Fresh Graduate ${name}`,
            description: `Awali dari posisi junior, staf, asisten analis, atau program Management Trainee (MT) untuk mengasah kompetensi dasar dan memahami budaya kerja.`,
          },
          {
            id: `${professionId}-gen-s11`,
            title: 'Perkiraan Rentang Gaji Awal',
            description: `Perkiraan kompensasi awal menyesuaikan Upah Minimum Regional (UMR) setempat hingga skala perusahaan, biasanya berada di rentang standar fresh graduate nasional.`,
            tips: 'Label: Perkiraan kasar berdasarkan rata-rata pasar kerja.',
          },
          {
            id: `${professionId}-gen-s12`,
            title: 'Pengembangan Karier & Spesialisasi Lanjut',
            description: `Setelah 2-3 tahun, pertimbangkan sertifikasi lanjutan, peningkatan peran ke level senior/manajerial, atau melanjutkan studi pascasarjana.`,
          },
        ],
      },
    ],
  };
}

export function getAllAvailableProfessionsList(): RoadmapProfessionSummary[] {
  return [
    { id: 'software-engineer', nama: 'Software Engineer', kategori: 'Teknologi & Komputasi' },
    { id: 'dokter', nama: 'Dokter Umum', kategori: 'Kesehatan & Medis' },
    { id: 'data-analyst', nama: 'Data Analyst', kategori: 'Bisnis & Sains Data' },
    { id: 'perawat', nama: 'Perawat Medis', kategori: 'Kesehatan & Pelayanan' },
    { id: 'akuntan', nama: 'Akuntan', kategori: 'Ekonomi & Keuangan' },
  ];
}
