<template>
  <div>
    <div class="page-header d-flex align-center" style="justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title"><span class="icon">🔧</span> Daftar Peralatan</div>
        <div class="page-subtitle">Manajemen inventaris peralatan meteorologi BMKG</div>
      </div>
      <div class="d-flex gap-2" style="flex-wrap:wrap">
        <button class="btn btn-success" @click="$router.push('/daftar-peralatan/tambah')">➕ Tambah Data Alat</button>
        <button class="btn btn-warning" @click="$router.push('/daftar-peralatan/update-kondisi')">🔄 Update Kondisi</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">📦</div>
        <div><div class="stat-value">{{ peralatanStore.peralatan.length }}</div><div class="stat-label">Total Peralatan</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">✅</div>
        <div><div class="stat-value">{{ countStatus('Aktif') }}</div><div class="stat-label">Aktif</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning">⚠️</div>
        <div><div class="stat-value">{{ countKondisi('Rusak ringan') }}</div><div class="stat-label">Rusak Ringan</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon danger">🔴</div>
        <div><div class="stat-value">{{ countKondisi('Rusak berat') }}</div><div class="stat-label">Rusak Berat</div></div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="card mb-3">
      <div class="card-body" style="padding:16px 20px">
        <div class="filter-bar">
          <div style="flex:1;min-width:200px">
            <label class="form-label" style="margin-bottom:4px">Filter Kategori</label>
            <select class="form-control" v-model="selectedKategori" @change="onKategoriChange">
              <option value="">Semua Kategori</option>
              <option v-for="k in KATEGORI_LIST" :key="k">{{ k }}</option>
            </select>
          </div>
          <div style="flex:1;min-width:160px">
            <label class="form-label" style="margin-bottom:4px">Cari Alat</label>
            <input class="form-control" v-model="search" placeholder="🔍 Cari nama alat..." />
          </div>
          <div style="display:flex;align-items:flex-end;gap:8px">
            <button class="btn btn-primary" @click="exportExcel">📊 Export Excel</button>
            <button class="btn btn-outline" @click="selectedKategori='';search=''">Reset</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs for Sites -->
    <div class="tab-list">
      <button class="tab-btn" :class="{active:activeTab==='taman'}" @click="activeTab='taman'">🌿 Taman Alat ({{ tamanData.length }})</button>
      <button class="tab-btn" :class="{active:activeTab==='gedung'}" @click="activeTab='gedung'">🏢 Gedung Observasi ({{ gedungData.length }})</button>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="section-title" style="margin:0">
          {{ activeTab === 'taman' ? '🌿 Taman Alat' : '🏢 Gedung Observasi' }}
        </div>
        <span class="text-sm text-muted">{{ currentData.length }} peralatan</span>
      </div>
      <div class="card-body" style="padding:0">
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Kode</th>
                <th>Kalibrasi</th>
                <th>Nama Alat</th>
                <th>Merk/Tipe/SN</th>
                <th>Pengadaan</th>
                <th>Tgl Install</th>
                <th>Kondisi</th>
                <th>Update</th>
                <th>Keterangan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="currentData.length === 0">
                <td colspan="12" class="text-center text-muted" style="padding:32px">Tidak ada data peralatan</td>
              </tr>
              <tr v-for="(item, i) in currentData" :key="item.id">
                <td>{{ i + 1 }}</td>
                <td><span class="badge badge-info">{{ item.kode }}</span></td>
                <td>{{ formatDate(item.kalibrasi) }}</td>
                <td><strong>{{ item.namaAlat }}</strong></td>
                <td class="text-xs">{{ item.merk }} / {{ item.tipe }} / {{ item.sn }}</td>
                <td>{{ item.pengadaan }}</td>
                <td>{{ formatDate(item.tanggalInstal) }}</td>
                <td>
                  <span class="badge" :class="kondisiClass(item.kondisi)">{{ item.kondisi }}</span>
                </td>
                <td class="text-xs">{{ formatDate(item.update) }}</td>
                <td class="text-xs">{{ item.keterangan }}</td>
                <td>
                  <span class="badge" :class="item.status === 'Aktif' ? 'badge-success' : 'badge-gray'">{{ item.status }}</span>
                </td>
                <td>
                  <button class="btn btn-xs btn-primary" @click="showDetail(item)">Detail</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div class="modal-overlay" v-if="detailItem" @click.self="detailItem=null">
      <div class="modal-box">
        <div class="modal-header">
          <h3>🔍 Detail Peralatan</h3>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white" @click="detailItem=null">✕</button>
        </div>
        <div class="modal-body">
          <div class="grid-2">
            <div v-for="(val, key) in detailFields" :key="key" class="detail-row">
              <div class="detail-label">{{ key }}</div>
              <div class="detail-val">{{ val }}</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="detailItem=null">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePeralatanStore } from '../stores/peralatanStore'
import { KATEGORI_LIST } from '../data/masterData'
import * as XLSX from 'xlsx'

const peralatanStore = usePeralatanStore()
const selectedKategori = ref('')
const search = ref('')
const activeTab = ref('taman')
const detailItem = ref(null)

function formatDate(d) {
  if (!d) return '-'
  const dt = new Date(d)
  return dt.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
function kondisiClass(k) {
  if (k === 'Baik') return 'badge-success'
  if (k === 'Rusak ringan') return 'badge-warning'
  return 'badge-danger'
}
function countStatus(s) { return peralatanStore.peralatan.filter(p => p.status === s).length }
function countKondisi(k) { return peralatanStore.peralatan.filter(p => p.kondisi === k).length }

function onKategoriChange() {}

const filteredAll = computed(() => {
  return peralatanStore.peralatan.filter(p => {
    const matchKat = !selectedKategori.value || p.kategori === selectedKategori.value
    const matchSearch = !search.value || p.namaAlat.toLowerCase().includes(search.value.toLowerCase())
    return matchKat && matchSearch
  })
})
const tamanData = computed(() => filteredAll.value.filter(p => p.site === 'Taman Alat'))
const gedungData = computed(() => filteredAll.value.filter(p => p.site === 'Gedung Observasi'))
const currentData = computed(() => activeTab.value === 'taman' ? tamanData.value : gedungData.value)

function showDetail(item) { detailItem.value = item }
const detailFields = computed(() => {
  if (!detailItem.value) return {}
  const d = detailItem.value
  return {
    'Kode Peralatan': d.kode, 'Kategori': d.kategori, 'Site': d.site,
    'Nama Alat': d.namaAlat, 'Merek': d.merk, 'Tipe': d.tipe,
    'Serial Number': d.sn, 'Pengadaan': d.pengadaan,
    'Tanggal Instalasi': formatDate(d.tanggalInstal),
    'Kalibrasi': formatDate(d.kalibrasi), 'Kondisi': d.kondisi,
    'Status': d.status, 'Keterangan': d.keterangan,
    'Teknisi': Array.isArray(d.teknisi) ? d.teknisi.join(', ') : d.teknisi,
  }
})

function exportExcel() {
  const data = filteredAll.value.map((p, i) => ({
    No: i + 1, Kode: p.kode, Kategori: p.kategori, 'Nama Alat': p.namaAlat,
    Merek: p.merk, Tipe: p.tipe, 'Serial Number': p.sn,
    Site: p.site, Pengadaan: p.pengadaan,
    'Tgl Instalasi': formatDate(p.tanggalInstal),
    Kalibrasi: formatDate(p.kalibrasi), Kondisi: p.kondisi,
    Status: p.status, Keterangan: p.keterangan
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Daftar Peralatan')
  const nama = selectedKategori.value || 'Semua'
  XLSX.writeFile(wb, `Daftar_Peralatan_${nama}_${new Date().toLocaleDateString('id-ID')}.xlsx`)
}
</script>

<style scoped>
.detail-row { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
.detail-label { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
.detail-val { font-size: 0.875rem; color: #1e293b; font-weight: 500; margin-top: 2px; }
</style>