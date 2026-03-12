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

export const KATEGORI_SITE_MAP = {
  "Radar cuaca": ["Gedung Radar", "Client"],
  "AWS Digitalisasi": ["Taman Alat", "Gedung Observasi"],
  "AWOS": ["Runway10", "Runway28", "Runway Middle", "Server", "Client", "Penunjang", "RLIM"],
  "Sinoptik": ["Gedung Observasi", "Taman Alat"],
  "LLWAS": ["Site", "Server", "Client"],
  "Aerologi": ["Gedung Aerologi", "Ruang gas"],
  "Display cuaca": ["Terminal 1 Bandara Juanda", "Terminal 2 Bandara Juanda", "Terminal Bus Purabaya", "Airnav"],
  "Aero Visual Weather": ["Ruang Forecaster"],
  "Server dan Jaringan Komputer": ["Server", "Gedung Observasi", "Forecaster", "Tower ATC Bandara Juanda"],
  "Elektronik tata usaha": ["Komputer", "Penunjang"],
  "Elektronik Data dan informasi": ["Komputer", "Penunjang", "CCTV"],
  "Elektronik observasi": ["Komputer", "Penunjang"],
  "Elektronik peralatan dan teknis": ["Komputer", "Penunjang", "Printer"],
  "Elektronik Aerologi": ["Komputer", "Penunjang"],
  "Elektronik forecaster": ["Komputer", "Penunjang"],
  "Jaringan listrik": ["Observasi", "BMN", "Tata Usaha"]
};

// Flatten to get all unique sites for potential global use
export const SITE_LIST = [...new Set(Object.values(KATEGORI_SITE_MAP).flat())];

export const JENIS_ALAT_LIST = [
  "Teknologi canggih/modern",
  "Sederhana elektronik",
  "Sederhana mekanik",
];

export const KONDISI_LIST = ["Baik", "Rusak ringan", "Rusak berat"];

export const STATUS_ALAT_LIST = ["Aktif", "Non-Aktif"];

export const TEKNISI_LIST = [
  { name: "MOHAMAD ANWAR SYAEFUDIN, S.T., M.Kom.", photo: "/src/assets/img/ANWAR.jpg" },
  { name: "DENI PRASETYO, S.T.", photo: "/src/assets/img/DENI.jpg" },
  { name: "ARSY YUDHA PRINANTO, S.Tr., M.T.", photo: "/src/assets/img/YUDHA.jpg" },
  { name: "SHOWAN BANGKIT SUSENA, S.Tr.Inst", photo: "/src/assets/img/BANGKIT.jpg" },
  { name: "MUHAMMAD RIZZAL FAUZAN, S.Tr.", photo: "/src/assets/img/RIZZAL.jpg" },
  { name: "ALFAN ALFARISY, S.Tr.Inst, M.Kom.", photo: "/src/assets/img/ALFAN.jpg" },
  { name: "ARIF NURKHAMDI, S.Tr.Inst.", photo: "/src/assets/img/KHAMDI.jpg" },
];

export const KETUA_TIM_LIST = [
  "MOHAMAD ANWAR SYAEFUDIN, S.T., M.Kom.",
];

export const KOORDINATOR_DI_LIST = [
  "SHANAS SEPTY PRAYUDA, S.Tr., M.T.",
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
