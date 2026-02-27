// masterData.js - All shared dropdown data

export const KATEGORI_LIST = [
  "AWS Digitalisasi",
  "AWOS",
  "Sinoptik",
  "Radar cuaca",
  "LLWAS",
  "Aerologi",
  "Display cuaca",
  "Aero Visual Weather",
  "Server dan Jaringan Komputer",
  "Elektronik tata usaha",
  "Elektronik Data dan informasi",
  "Elektronik observasi",
  "Elektronik peralatan dan teknis",
  "Elektronik Aerologi",
  "Elektronik forecaster",
  "Jaringan listrik",
];

export const KATEGORI_LIST_WITH_OTHER = [...KATEGORI_LIST, "Lain-lain"];

export const SITE_LIST = ["Taman Alat", "Gedung Observasi"];

export const JENIS_ALAT_LIST = [
  "Teknologi canggih/modern",
  "Sederhana elektronik",
  "Sederhana mekanik",
];

export const KONDISI_LIST = ["Baik", "Rusak ringan", "Rusak berat"];

export const STATUS_ALAT_LIST = ["Aktif", "Non-Aktif"];

export const TEKNISI_LIST = [
  "Ahmad Fauzan, S.T.",
  "Budi Santoso, S.T.",
  "Cahyo Nugroho, S.Kom.",
  "Dewi Rahmawati, S.T.",
  "Eko Prasetyo, S.T.",
  "Fajar Hidayat, S.T.",
  "Galih Permana, S.Kom.",
  "Hesti Wahyuni, S.T.",
];

export const KETUA_TIM_LIST = [
  "Ir. Suharto Wibowo, M.T.",
  "Dr. Bambang Setiawan, S.T., M.T.",
  "Ir. Rudi Hartono, M.Eng.",
];

export const KOORDINATOR_DI_LIST = [
  "Drs. Agus Supriyanto, M.Si.",
  "Dr. Lestari Indah, S.Si., M.T.",
  "Ir. Wawan Hermanto, M.T.",
];

export const KOORDINATOR_OBS_LIST = [
  "Drs. Hendra Kusuma, M.Si.",
  "Dr. Siti Nurjanah, S.Si., M.T.",
  "Ir. Joko Susilo, M.Met.",
];

export const KODE_DINAS = [
  { kode: "RC", label: "Pemeliharaan peralatan Radar Cuaca" },
  { kode: "LL", label: "Pemeliharaan peralatan LLWAS" },
  { kode: "AD", label: "Pemeliharaan peralatan AWS Digitalisasi" },
  { kode: "DC", label: "Pemeliharaan Display Cuaca indoor" },
  { kode: "UA", label: "Pemeliharaan peralatan obs. Udara Atas / Aerologi" },
  {
    kode: "UP",
    label: "Pemeliharaan peralatan obs. Udara Permukaan / Sinoptik",
  },
  { kode: "AO", label: "Pemeliharaan peralatan AWOS, client dan server" },
  {
    kode: "TU",
    label: "Pemeliharaan komputer & elektronik penunjang Gedung Tata Usaha",
  },
  {
    kode: "DI",
    label:
      "Pemeliharaan komputer & elektronik penunjang Gedung Data & Informasi",
  },
  {
    kode: "OB",
    label: "Pemeliharaan komputer & elektronik penunjang obs. Udara Permukaan",
  },
  {
    kode: "PT",
    label: "Pemeliharaan komputer & elektronik penunjang Supporting Eng.",
  },
  {
    kode: "AE",
    label: "Pemeliharaan komputer & elektronik penunjang obs. Udara Atas",
  },
  {
    kode: "FC",
    label: "Pemeliharaan komputer & elektronik penunjang Forecaster",
  },
  {
    kode: "JK",
    label: "Pemeliharaan peralatan Server dan Jaringan Komunikasi",
  },
];

export const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
