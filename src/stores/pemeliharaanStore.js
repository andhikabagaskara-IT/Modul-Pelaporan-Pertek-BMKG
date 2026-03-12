import { defineStore } from 'pinia'
import { ref } from 'vue'

let nextId = 1

export const usePemeliharaanStore = defineStore('pemeliharaan', () => {
  const records = ref([
    {
      id: nextId++, tanggal: '2024-06-05', alat: 'AWS Station Otomatis',
      lokasi: 'Taman Alat', teknisi: ['MOHAMAD ANWAR SYAEFUDIN, S.T., M.Kom.'],
      ketuaTim: 'Ir. Suharto Wibowo, M.T.', koordinator: 'Drs. Agus Supriyanto, M.Si.',
      kategori: 'AWS Digitalisasi', site: 'Taman Alat',
      catatan: 'Pemeliharaan rutin bulanan, semua kondisi baik.',
    },
    {
      id: nextId++, tanggal: '2024-06-10', alat: 'Radar Cuaca Doppler',
      lokasi: 'Gedung Observasi', teknisi: ['DENI PRASETYO, S.T.', 'ARSY YUDHA PRINANTO, S.Tr., M.T.'],
      ketuaTim: 'Dr. Bambang Setiawan, S.T., M.T.', koordinator: 'Dr. Lestari Indah, S.Si., M.T.',
      kategori: 'Radar cuaca', site: 'Gedung Observasi',
      catatan: 'Kalibrasi antenna dan pengecekan receiver.',
    },
  ])

  function add(record) {
    records.value.push({ id: nextId++, ...record })
  }

  function update(id, data) {
    const idx = records.value.findIndex(r => r.id === id)
    if (idx !== -1) records.value[idx] = { ...records.value[idx], ...data }
  }

  function remove(id) {
    records.value = records.value.filter(r => r.id !== id)
  }

  function getFiltered(year, month) {
    return records.value.filter(r => {
      const d = new Date(r.tanggal)
      return (!year || d.getFullYear() === year) && (!month || d.getMonth() + 1 === month)
    })
  }

  return { records, add, update, remove, getFiltered }
})
