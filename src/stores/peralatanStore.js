import { defineStore } from 'pinia'
import { ref } from 'vue'

let nextId = 1

export const usePeralatanStore = defineStore('peralatan', () => {
  const peralatan = ref([
    {
      id: nextId++, kode: 'ADG-001', kalibrasi: '2024-01-15', namaAlat: 'AWS Station Otomatis',
      merk: 'Vaisala', tipe: 'WXT536', sn: 'K8741023', pengadaan: '2022',
      tanggalInstal: '2022-03-10', kondisi: 'Baik', update: '2024-06-01',
      keterangan: '-', status: 'Aktif', kategori: 'AWS Digitalisasi', site: ['Taman Alat', 'Gedung Observasi'],
      jenis: 'Teknologi canggih/modern', teknisi: ['Ahmad Fauzan, S.T.'],
    },
    {
      id: nextId++, kode: 'RC-001', kalibrasi: '2023-07-20', namaAlat: 'Radar Cuaca Doppler',
      merk: 'EEC', tipe: 'DWSR-2001C', sn: 'EEC20210001', pengadaan: '2021',
      tanggalInstal: '2021-11-05', kondisi: 'Baik', update: '2024-05-15',
      keterangan: '-', status: 'Aktif', kategori: 'Radar cuaca', site: ['Gedung Radar', 'Client'],
      jenis: 'Teknologi canggih/modern', teknisi: ['Budi Santoso, S.T.'],
    },
    {
      id: nextId++, kode: 'AWOS-001', kalibrasi: '2024-02-10', namaAlat: 'AWOS System',
      merk: 'Vaisala', tipe: 'AWS430', sn: 'V430-20220099', pengadaan: '2022',
      tanggalInstal: '2022-06-15', kondisi: 'Baik', update: '2024-06-10',
      keterangan: '-', status: 'Aktif', kategori: 'AWOS', site: ['Runway10', 'Runway28'],
      jenis: 'Teknologi canggih/modern', teknisi: ['Cahyo Nugroho, S.Kom.'],
    },
  ])

  function addAlat(alat) {
    peralatan.value.push({ id: nextId++, ...alat })
  }

  function updateKondisi(id, data) {
    const idx = peralatan.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      peralatan.value[idx] = { ...peralatan.value[idx], ...data, update: new Date().toISOString().slice(0, 10) }
    }
  }

  function getByKategori(kategori) {
    if (!kategori) return peralatan.value
    return peralatan.value.filter(p => p.kategori === kategori)
  }

  function getBySite(site) {
    return peralatan.value.filter(p => p.site === site || (Array.isArray(p.site) && p.site.includes(site)))
  }

  return { peralatan, addAlat, updateKondisi, getByKategori, getBySite }
})
