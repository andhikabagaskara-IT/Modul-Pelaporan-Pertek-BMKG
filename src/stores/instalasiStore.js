import { defineStore } from 'pinia'
import { ref } from 'vue'

let nextId = 1

export const useInstalasiStore = defineStore('instalasi', () => {
  const records = ref([
    {
      id: nextId++, kategori: 'AWS Digitalisasi', kodePeralatan: 'ADG-002',
      tanggalInstalasi: '2024-06-01', waktuInstalasi: '09:00',
      teknisi: ['Ahmad Fauzan, S.T.', 'Cahyo Nugroho, S.Kom.'],
      ketuaTim: 'Ir. Suharto Wibowo, M.T.',
      koordinatorObs: 'Drs. Hendra Kusuma, M.Si.',
      namaAlat: 'AWS Station Baru', merk: 'Vaisala', tipe: 'WXT520', sn: 'K99012345',
      kegiatan: 'Instalasi dan konfigurasi awal unit AWS baru di taman alat',
      catatan: 'Semua sensor terpasang dengan baik, komunikasi data stabil',
      foto: null,
    },
  ])

  function add(record) { records.value.push({ id: nextId++, ...record }) }
  function update(id, data) {
    const idx = records.value.findIndex(r => r.id === id)
    if (idx !== -1) records.value[idx] = { ...records.value[idx], ...data }
  }
  function remove(id) { records.value = records.value.filter(r => r.id !== id) }

  return { records, add, update, remove }
})
