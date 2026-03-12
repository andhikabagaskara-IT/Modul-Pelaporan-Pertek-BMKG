<template>
  <div>
    <div class="page-header d-flex align-center" style="justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title"><span class="icon">🔩</span> Perbaikan</div>
        <div class="page-subtitle">Rekap laporan kegiatan perbaikan peralatan</div>
      </div>
      <button class="btn btn-success" @click="$router.push('/perbaikan/input')">➕ Input Perbaikan</button>
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
          <div><label class="form-label" style="margin-bottom:4px">Tahun</label>
            <select class="form-control" style="width:110px" v-model.number="filterYear">
              <option :value="null">Semua</option>
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
          <div><label class="form-label" style="margin-bottom:4px">Bulan</label>
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
        <div class="section-title" style="margin:0">📊 Rekap Perbaikan</div>
        <span class="text-sm text-muted">{{ filtered.length }} laporan</span>
      </div>
      <div class="card-body" style="padding:0">
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>No</th><th>Tgl Rusak</th><th>Tgl Perbaikan</th><th>Teknisi</th><th>Alat</th>
                <th>Merk/Type/SN</th><th>Kondisi Awal</th><th>Tindakan</th><th>Kondisi Akhir</th>
                <th>Catatan</th><th>Th. Perolehan</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filtered.length===0">
                <td colspan="12" class="text-center text-muted" style="padding:32px">Tidak ada data</td>
              </tr>
              <tr v-for="(r, i) in filtered" :key="r.id">
                <td>{{ i+1 }}</td>
                <td class="text-xs">{{ formatDate(r.tanggalRusak) }}</td>
                <td class="text-xs">{{ formatDate(r.tanggalPerbaikan) }}</td>
                <td>
                  <div class="d-flex" style="flex-wrap:wrap; gap:4px">
                    <div class="table-teknisi-badge" v-for="tn in (Array.isArray(r.teknisi)?r.teknisi:[r.teknisi])" :key="tn">
                      <img :src="getTeknisiPhoto(tn)" />
                      <span>{{ tn.split(',')[0] }}</span>
                    </div>
                  </div>
                </td>
                <td><strong>{{ r.namaAlat }}</strong><br/><span class="badge badge-info text-xs">{{ r.kategori }}</span></td>
                <td class="text-xs">{{ r.merk }}/{{ r.tipe }}/{{ r.sn }}</td>
                <td class="text-xs">{{ r.kondisiAwal }}</td>
                <td class="text-xs">{{ r.tindakan }}</td>
                <td class="text-xs">{{ r.kondisiAkhir }}</td>
                <td class="text-xs">{{ r.catatan }}</td>
                <td>{{ r.tahunPerolehan }}</td>
                <td>
                  <div class="d-flex" style="gap:4px;flex-wrap:wrap">
                    <button class="btn btn-xs btn-primary" @click="showDetail(r)">👁</button>
                    <button class="btn btn-xs btn-warning" @click="editRecord(r)">✏️</button>
                    <button class="btn btn-xs" style="background:#6366f1;color:white" @click="printRecord(r)">🖨</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal-overlay" v-if="modalRecord" @click.self="modalRecord=null">
      <div class="modal-box">
        <div class="modal-header">
          <h3>{{ editMode ? '✏️ Edit Perbaikan' : '👁 Detail Perbaikan' }}</h3>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white" @click="modalRecord=null">✕</button>
        </div>
        <div class="modal-body">
          <div v-if="!editMode">
            <div class="grid-2">
              <div class="detail-row"><div class="detail-label">Kategori</div><div class="detail-val">{{ modalRecord.kategori }}</div></div>
              <div class="detail-row"><div class="detail-label">Site</div><div class="detail-val">{{ modalRecord.site }}</div></div>
              <div class="detail-row"><div class="detail-label">Nama Alat</div><div class="detail-val">{{ modalRecord.namaAlat }}</div></div>
              <div class="detail-row"><div class="detail-label">Merk/Tipe/SN</div><div class="detail-val">{{ modalRecord.merk }}/{{ modalRecord.tipe }}/{{ modalRecord.sn }}</div></div>
              <div class="detail-row"><div class="detail-label">Tgl Rusak</div><div class="detail-val">{{ formatDate(modalRecord.tanggalRusak) }}</div></div>
              <div class="detail-row"><div class="detail-label">Tgl Perbaikan</div><div class="detail-val">{{ formatDate(modalRecord.tanggalPerbaikan) }}</div></div>
              <div class="detail-row"><div class="detail-label">Pelapor</div><div class="detail-val">{{ modalRecord.namaPelapor }}</div></div>
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
              <div class="detail-row"><div class="detail-label">Tahun Perolehan</div><div class="detail-val">{{ modalRecord.tahunPerolehan }}</div></div>
              <div class="detail-row" style="grid-column:1/-1"><div class="detail-label">Kondisi Awal</div><div class="detail-val">{{ modalRecord.kondisiAwal }}</div></div>
              <div class="detail-row" style="grid-column:1/-1"><div class="detail-label">Tindakan</div><div class="detail-val">{{ modalRecord.tindakan }}</div></div>
              <div class="detail-row" style="grid-column:1/-1"><div class="detail-label">Kondisi Akhir</div><div class="detail-val">{{ modalRecord.kondisiAkhir }}</div></div>
              <div class="detail-row" style="grid-column:1/-1"><div class="detail-label">Catatan</div><div class="detail-val">{{ modalRecord.catatan }}</div></div>
            </div>
            <div v-if="modalRecord.foto" style="margin-top:12px">
              <div class="detail-label">Dokumentasi</div>
              <img :src="modalRecord.foto" style="max-width:100%;border-radius:8px;margin-top:6px" />
            </div>
          </div>
          <div v-else>
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Nama Alat</label><input class="form-control" v-model="editForm.namaAlat" /></div>
              <div class="form-group"><label class="form-label">Tgl Rusak</label><input type="date" class="form-control" v-model="editForm.tanggalRusak" /></div>
              <div class="form-group"><label class="form-label">Tgl Perbaikan</label><input type="date" class="form-control" v-model="editForm.tanggalPerbaikan" /></div>
              <div class="form-group"><label class="form-label">Tindakan</label><input class="form-control" v-model="editForm.tindakan" /></div>
              <div class="form-group" style="grid-column:1/-1"><label class="form-label">Kondisi Akhir</label><textarea class="form-control" v-model="editForm.kondisiAkhir" /></div>
              <div class="form-group" style="grid-column:1/-1"><label class="form-label">Catatan</label><textarea class="form-control" v-model="editForm.catatan" /></div>
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
import { usePerbaikanStore } from '../stores/perbaikanStore'
import { useTeknisiStore } from '../stores/teknisiStore'
import { MONTHS } from '../data/masterData'

const store = usePerbaikanStore()
const teknisiStore = useTeknisiStore()
const filterYear = ref(null)
const filterMonth = ref(null)
const modalRecord = ref(null)
const editMode = ref(false)
const editForm = reactive({})

const today = new Date()
const years = computed(() => {
  const ys = new Set(store.records.map(r => new Date(r.tanggalPerbaikan).getFullYear()))
  ys.add(today.getFullYear()); return [...ys].sort((a,b)=>b-a)
})
const thisMonthCount = computed(() => store.records.filter(r => {
  const d = new Date(r.tanggalPerbaikan); return d.getMonth()===today.getMonth() && d.getFullYear()===today.getFullYear()
}).length)
const thisYearCount = computed(() => store.records.filter(r => new Date(r.tanggalPerbaikan).getFullYear()===today.getFullYear()).length)
const filtered = computed(() => store.getFiltered(filterYear.value, filterMonth.value))

function formatDate(d) { if (!d) return '-'; return new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit',year:'numeric'}) }
function getTeknisiPhoto(name) {
  if (!name) return ''
  const t = teknisiStore.teknisiList.find(x => x.name === name)
  return t ? t.photo : 'https://ui-avatars.com/api/?name=' + name.split(' ')[0]
}
function showDetail(r) { modalRecord.value = r; editMode.value = false }
function editRecord(r) { modalRecord.value = r; editMode.value = true; Object.assign(editForm, {...r}) }
function saveEdit() { store.update(modalRecord.value.id, {...editForm}); modalRecord.value = null }
function printRecord(r) {
  const w = window.open('','_blank')
  w.document.write(`<html><head><title>Print Perbaikan</title><style>body{font-family:sans-serif;padding:20px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:8px}</style></head><body>`)
  w.document.write(`<h2>Laporan Perbaikan</h2><table>`)
  const rows = [['Kategori',r.kategori],['Nama Alat',r.namaAlat],['Merk/Tipe/SN',`${r.merk}/${r.tipe}/${r.sn}`],['Tgl Rusak',formatDate(r.tanggalRusak)],['Tgl Perbaikan',formatDate(r.tanggalPerbaikan)],['Teknisi',Array.isArray(r.teknisi)?r.teknisi.join(', '):r.teknisi],['Kondisi Awal',r.kondisiAwal],['Tindakan',r.tindakan],['Kondisi Akhir',r.kondisiAkhir],['Catatan',r.catatan]]
  rows.forEach(([k,v])=>w.document.write(`<tr><th>${k}</th><td>${v||'-'}</td></tr>`))
  w.document.write(`</table></body></html>`); w.document.close(); w.print()
}
</script>

<style scoped>
.detail-row { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
.detail-label { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
.detail-val { font-size: 0.875rem; color: #1e293b; font-weight: 500; margin-top: 2px; }
</style>
