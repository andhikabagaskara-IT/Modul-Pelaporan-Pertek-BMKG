import { defineStore } from 'pinia'
import { ref } from 'vue'

let nextId = 1

export const usePerbaikanStore = defineStore('perbaikan', () => {
  const records = ref([
    {
      id: nextId++, kategori: 'Radar cuaca', site: 'Gedung Observasi',
      namaAlat: 'Radar Cuaca Doppler', merk: 'EEC', tipe: 'DWSR-2001C', sn: 'EEC20210001',
      tanggalRusak: '2024-05-20', tanggalPerbaikan: '2024-05-22',
      namaPelapor: 'Ahmad Fauzan, S.T.', teknisi: ['SHOWAN BANGKIT SUSENA, S.Tr.Inst'],
      ketuaTim: 'Dr. Bambang Setiawan, S.T., M.T.',
      kondisiAwal: 'Transmitter tidak berfungsi',
      tindakan: 'Penggantian komponen fuse dan reset sistem',
      kondisiAkhir: 'Baik, radar kembali beroperasi normal',
      catatan: 'Penyebab: lonjakan tegangan listrik',
      foto: null, tahunPerolehan: '2021',
    },
  ])

  function add(record) { records.value.push({ id: nextId++, ...record }) }
  function update(id, data) {
    const idx = records.value.findIndex(r => r.id === id)
    if (idx !== -1) records.value[idx] = { ...records.value[idx], ...data }
  }
  function remove(id) { records.value = records.value.filter(r => r.id !== id) }
  function getFiltered(year, month) {
    return records.value.filter(r => {
      const d = new Date(r.tanggalPerbaikan)
      return (!year || d.getFullYear() === year) && (!month || d.getMonth() + 1 === month)
    })
  }

  return { records, add, update, remove, getFiltered }
})
