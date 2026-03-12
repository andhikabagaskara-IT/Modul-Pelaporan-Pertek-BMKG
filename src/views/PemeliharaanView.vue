<template>
  <div>
    <div class="page-header d-flex align-center" style="justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title"><span class="icon">🛠️</span> Pemeliharaan</div>
        <div class="page-subtitle">Rekap laporan kegiatan pemeliharaan peralatan</div>
      </div>
      <button class="btn btn-success" @click="$router.push('/pemeliharaan/input')">➕ Input Pemeliharaan</button>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon blue">📋</div><div><div class="stat-value">{{ store.records.length }}</div><div class="stat-label">Total Laporan</div></div></div>
      <div class="stat-card"><div class="stat-icon green">📅</div><div><div class="stat-value">{{ thisMonthCount }}</div><div class="stat-label">Bulan Ini</div></div></div>
      <div class="stat-card"><div class="stat-icon warning">📆</div><div><div class="stat-value">{{ thisYearCount }}</div><div class="stat-label">Tahun Ini</div></div></div>
    </div>

    <!-- Filter -->
    <div class="card mb-3">
      <div class="card-body" style="padding:14px 20px">
        <div class="filter-bar">
          <div>
            <label class="form-label" style="margin-bottom:4px">Tahun</label>
            <select class="form-control" style="width:110px" v-model.number="filterYear">
              <option :value="null">Semua</option>
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
          <div>
            <label class="form-label" style="margin-bottom:4px">Bulan</label>
            <select class="form-control" style="width:150px" v-model.number="filterMonth">
              <option :value="null">Semua</option>
              <option v-for="(m,i) in MONTHS" :key="i" :value="i+1">{{ m }}</option>
            </select>
          </div>
          <div style="display:flex;align-items:flex-end">
            <button class="btn btn-outline" @click="filterYear=null;filterMonth=null">Reset</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <div class="card-header">
        <div class="section-title" style="margin:0">📊 Rekap Pemeliharaan</div>
        <span class="text-sm text-muted">{{ filtered.length }} laporan</span>
      </div>
      <div class="card-body" style="padding:0">
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>No</th><th>Tanggal</th><th>Alat</th><th>Lokasi</th><th>Teknisi</th><th>Catatan</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filtered.length===0">
                <td colspan="7" class="text-center text-muted" style="padding:32px">Tidak ada data</td>
              </tr>
              <tr v-for="(r, i) in filtered" :key="r.id">
                <td>{{ i+1 }}</td>
                <td>{{ formatDate(r.tanggal) }}</td>
                <td><strong>{{ r.alat }}</strong><br/><span class="badge badge-info text-xs">{{ r.kategori }}</span></td>
                <td>{{ r.lokasi }}</td>
                <td>
                  <div class="d-flex" style="flex-wrap:wrap; gap:4px">
                    <div class="table-teknisi-badge" v-for="tn in (Array.isArray(r.teknisi)?r.teknisi:[r.teknisi])" :key="tn">
                      <img :src="getTeknisiPhoto(tn)" />
                      <span>{{ tn.split(',')[0] }}</span>
                    </div>
                  </div>
                </td>
                <td class="text-xs">{{ r.catatan }}</td>
                <td>
                  <div class="d-flex gap-2" style="gap:4px;flex-wrap:wrap">
                    <button class="btn btn-xs btn-primary" @click="showDetail(r)">👁 Detail</button>
                    <button class="btn btn-xs btn-warning" @click="editRecord(r)">✏️ Edit</button>
                    <button class="btn btn-xs" style="background:#6366f1;color:white" @click="printRecord(r)">🖨 Print</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Detail / Edit Modal -->
    <div class="modal-overlay" v-if="modalRecord" @click.self="modalRecord=null">
      <div class="modal-box">
        <div class="modal-header">
          <h3>{{ editMode ? '✏️ Edit Pemeliharaan' : '👁 Detail Pemeliharaan' }}</h3>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white" @click="modalRecord=null">✕</button>
        </div>
        <div class="modal-body" id="print-area">
          <div v-if="!editMode">
            <div class="grid-2">
              <div class="detail-row"><div class="detail-label">Tanggal</div><div class="detail-val">{{ formatDate(modalRecord.tanggal) }}</div></div>
              <div class="detail-row"><div class="detail-label">Kategori</div><div class="detail-val">{{ modalRecord.kategori }}</div></div>
              <div class="detail-row"><div class="detail-label">Alat</div><div class="detail-val">{{ modalRecord.alat }}</div></div>
              <div class="detail-row"><div class="detail-label">Lokasi</div><div class="detail-val">{{ modalRecord.lokasi }}</div></div>
              <div class="detail-row" style="grid-column:1/-1">
                <div class="detail-label">Teknisi</div>
                <div class="detail-val">
                  <div class="d-flex" style="flex-wrap:wrap; gap:4px; margin-top:4px">
                    <div class="table-teknisi-badge" v-for="tn in (Array.isArray(modalRecord.teknisi)?modalRecord.teknisi:[modalRecord.teknisi])" :key="tn">
                      <img :src="getTeknisiPhoto(tn)" />
                      <span>{{ tn.split(',')[0] }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="detail-row"><div class="detail-label">Ketua Tim</div><div class="detail-val">{{ modalRecord.ketuaTim }}</div></div>
              <div class="detail-row" style="grid-column:1/-1"><div class="detail-label">Catatan</div><div class="detail-val">{{ modalRecord.catatan }}</div></div>
            </div>
          </div>
          <div v-else>
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Tanggal</label><input type="date" class="form-control" v-model="editForm.tanggal" /></div>
              <div class="form-group"><label class="form-label">Alat</label><input class="form-control" v-model="editForm.alat" /></div>
              <div class="form-group"><label class="form-label">Lokasi</label><input class="form-control" v-model="editForm.lokasi" /></div>
              <div class="form-group"><label class="form-label">Catatan</label><input class="form-control" v-model="editForm.catatan" /></div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="modalRecord=null">Tutup</button>
          <button v-if="editMode" class="btn btn-success" @click="saveEdit">💾 Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { usePemeliharaanStore } from '../stores/pemeliharaanStore'
import { useTeknisiStore } from '../stores/teknisiStore'
import { MONTHS } from '../data/masterData'

const store = usePemeliharaanStore()
const teknisiStore = useTeknisiStore()
const filterYear = ref(null)
const filterMonth = ref(null)
const modalRecord = ref(null)
const editMode = ref(false)
const editForm = reactive({})

const today = new Date()
const years = computed(() => {
  const ys = new Set(store.records.map(r => new Date(r.tanggal).getFullYear()))
  ys.add(today.getFullYear())
  return [...ys].sort((a, b) => b - a)
})
const thisMonthCount = computed(() => store.records.filter(r => {
  const d = new Date(r.tanggal); return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
}).length)
const thisYearCount = computed(() => store.records.filter(r => new Date(r.tanggal).getFullYear() === today.getFullYear()).length)
const filtered = computed(() => store.getFiltered(filterYear.value, filterMonth.value))

function formatDate(d) {
  if (!d) return '-'; return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
function getTeknisiPhoto(name) {
  if (!name) return ''
  const t = teknisiStore.teknisiList.find(x => x.name === name)
  return t ? t.photo : 'https://ui-avatars.com/api/?name=' + name.split(' ')[0]
}
function showDetail(r) { modalRecord.value = r; editMode.value = false }
function editRecord(r) {
  modalRecord.value = r; editMode.value = true
  Object.assign(editForm, { ...r })
}
function saveEdit() {
  store.update(modalRecord.value.id, { ...editForm })
  modalRecord.value = null
}
function printRecord(r) {
  const w = window.open('', '_blank')
  w.document.write(`<html><head><title>Print Pemeliharaan</title><style>body{font-family:sans-serif;padding:20px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:8px}</style></head><body>`)
  w.document.write(`<h2>Laporan Pemeliharaan</h2>`)
  w.document.write(`<table><tr><th>Tanggal</th><td>${formatDate(r.tanggal)}</td></tr><tr><th>Alat</th><td>${r.alat}</td></tr><tr><th>Lokasi</th><td>${r.lokasi}</td></tr><tr><th>Kategori</th><td>${r.kategori}</td></tr><tr><th>Teknisi</th><td>${Array.isArray(r.teknisi)?r.teknisi.join(', '):r.teknisi}</td></tr><tr><th>Ketua Tim</th><td>${r.ketuaTim||'-'}</td></tr><tr><th>Catatan</th><td>${r.catatan}</td></tr></table>`)
  w.document.write(`</body></html>`); w.document.close(); w.print()
}
</script>

<style scoped>
.detail-row { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
.detail-label { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
.detail-val { font-size: 0.875rem; color: #1e293b; font-weight: 500; margin-top: 2px; }
</style>
