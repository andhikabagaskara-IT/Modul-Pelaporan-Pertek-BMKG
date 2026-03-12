<template>
  <div>
    <div class="page-header d-flex align-center" style="justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title"><span class="icon">📦</span> Instalasi</div>
        <div class="page-subtitle">Rekap laporan kegiatan instalasi peralatan</div>
      </div>
      <button class="btn btn-success" @click="$router.push('/instalasi/input')">➕ Input Instalasi</button>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon blue">📋</div><div><div class="stat-value">{{ store.records.length }}</div><div class="stat-label">Total Instalasi</div></div></div>
      <div class="stat-card"><div class="stat-icon green">📅</div><div><div class="stat-value">{{ thisMonthCount }}</div><div class="stat-label">Bulan Ini</div></div></div>
      <div class="stat-card"><div class="stat-icon warning">📆</div><div><div class="stat-value">{{ thisYearCount }}</div><div class="stat-label">Tahun Ini</div></div></div>
    </div>

    <!-- Table -->
    <div class="card">
      <div class="card-header">
        <div class="section-title" style="margin:0">📊 Rekap Instalasi</div>
        <span class="text-sm text-muted">{{ store.records.length }} laporan</span>
      </div>
      <div class="card-body" style="padding:0">
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>No</th><th>Tgl Instalasi</th><th>Jam</th><th>Teknisi</th><th>Kategori</th>
                <th>Alat</th><th>Kegiatan</th><th>Catatan</th><th>Dokumentasi</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="store.records.length===0">
                <td colspan="10" class="text-center text-muted" style="padding:32px">Tidak ada data</td>
              </tr>
              <tr v-for="(r,i) in store.records" :key="r.id">
                <td>{{ i+1 }}</td>
                <td class="text-xs">{{ formatDate(r.tanggalInstalasi) }}</td>
                <td class="text-xs">{{ r.waktuInstalasi }}</td>
                <td>
                  <div class="d-flex" style="flex-wrap:wrap; gap:4px">
                    <div class="table-teknisi-badge" v-for="tn in (Array.isArray(r.teknisi)?r.teknisi:[r.teknisi])" :key="tn">
                      <img :src="getTeknisiPhoto(tn)" />
                      <span>{{ tn.split(',')[0] }}</span>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-info text-xs">{{ r.kategori }}</span></td>
                <td><strong>{{ r.namaAlat }}</strong></td>
                <td class="text-xs" style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ r.kegiatan }}</td>
                <td class="text-xs">{{ r.catatan }}</td>
                <td>
                  <div v-if="r.foto"><img :src="r.foto" style="width:40px;height:40px;object-fit:cover;border-radius:6px;cursor:pointer" @click="viewImg=r.foto" /></div>
                  <span v-else class="text-xs text-muted">—</span>
                </td>
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

    <!-- Image Viewer -->
    <div class="modal-overlay" v-if="viewImg" @click.self="viewImg=null">
      <div style="background:white;border-radius:12px;padding:16px;max-width:600px;width:100%">
        <img :src="viewImg" style="width:100%;border-radius:8px" />
        <button class="btn btn-outline mt-2 w-100" @click="viewImg=null">Tutup</button>
      </div>
    </div>

    <!-- Detail / Edit Modal -->
    <div class="modal-overlay" v-if="modalRecord" @click.self="modalRecord=null">
      <div class="modal-box" style="max-width:680px">
        <div class="modal-header">
          <h3>{{ editMode ? '✏️ Edit Instalasi' : '👁 Detail Instalasi' }}</h3>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white" @click="modalRecord=null">✕</button>
        </div>
        <div class="modal-body">
          <div v-if="!editMode">
            <div class="grid-2">
              <div class="detail-row"><div class="detail-label">Kategori</div><div class="detail-val">{{ modalRecord.kategori }}</div></div>
              <div class="detail-row"><div class="detail-label">Kode Peralatan</div><div class="detail-val">{{ modalRecord.kodePeralatan }}</div></div>
              <div class="detail-row"><div class="detail-label">Tgl Instalasi</div><div class="detail-val">{{ formatDate(modalRecord.tanggalInstalasi) }}</div></div>
              <div class="detail-row"><div class="detail-label">Waktu</div><div class="detail-val">{{ modalRecord.waktuInstalasi }}</div></div>
              <div class="detail-row"><div class="detail-label">Nama Alat</div><div class="detail-val">{{ modalRecord.namaAlat }}</div></div>
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
              <div class="detail-row"><div class="detail-label">Koordinator Obs.</div><div class="detail-val">{{ modalRecord.koordinatorObs }}</div></div>
              <div class="detail-row" style="grid-column:1/-1"><div class="detail-label">Kegiatan</div><div class="detail-val">{{ modalRecord.kegiatan }}</div></div>
              <div class="detail-row" style="grid-column:1/-1"><div class="detail-label">Catatan</div><div class="detail-val">{{ modalRecord.catatan }}</div></div>
            </div>
            <div v-if="modalRecord.foto" style="margin-top:12px">
              <div class="detail-label mb-1">Dokumentasi</div>
              <img :src="modalRecord.foto" style="max-width:100%;border-radius:8px" />
            </div>
          </div>
          <div v-else>
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Nama Alat</label><input class="form-control" v-model="editForm.namaAlat" /></div>
              <div class="form-group"><label class="form-label">Tgl Instalasi</label><input type="date" class="form-control" v-model="editForm.tanggalInstalasi" /></div>
              <div class="form-group"><label class="form-label">Waktu</label><input type="time" class="form-control" v-model="editForm.waktuInstalasi" /></div>
              <div class="form-group"><label class="form-label">Kode Peralatan</label><input class="form-control" v-model="editForm.kodePeralatan" /></div>
              <div class="form-group" style="grid-column:1/-1"><label class="form-label">Kegiatan</label><textarea class="form-control" v-model="editForm.kegiatan" /></div>
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
import { useInstalasiStore } from '../stores/instalasiStore'
import { useTeknisiStore } from '../stores/teknisiStore'

const store = useInstalasiStore()
const teknisiStore = useTeknisiStore()
const modalRecord = ref(null)
const editMode = ref(false)
const editForm = reactive({})
const viewImg = ref(null)

const today = new Date()
const thisMonthCount = computed(() => store.records.filter(r => {
  const d = new Date(r.tanggalInstalasi); return d.getMonth()===today.getMonth() && d.getFullYear()===today.getFullYear()
}).length)
const thisYearCount = computed(() => store.records.filter(r => new Date(r.tanggalInstalasi).getFullYear()===today.getFullYear()).length)

function formatDate(d) { if (!d) return '-'; return new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit',year:'numeric'}) }
function getTeknisiPhoto(name) {
  if (!name) return ''
  const t = teknisiStore.teknisiList.find(x => x.name === name)
  return t ? t.photo : 'https://ui-avatars.com/api/?name=' + name.split(' ')[0]
}
function showDetail(r) { modalRecord.value = r; editMode.value = false }
function editRecord(r) { modalRecord.value = r; editMode.value = true; Object.assign(editForm,{...r}) }
function saveEdit() { store.update(modalRecord.value.id, {...editForm}); modalRecord.value = null }
function printRecord(r) {
  const w = window.open('','_blank')
  w.document.write(`<html><head><title>Print Instalasi</title><style>body{font-family:sans-serif;padding:20px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:8px}</style></head><body><h2>Laporan Instalasi</h2><table>`)
  const rows=[['Kategori',r.kategori],['Kode',r.kodePeralatan],['Nama Alat',r.namaAlat],['Tgl Instalasi',formatDate(r.tanggalInstalasi)],['Waktu',r.waktuInstalasi],['Teknisi',Array.isArray(r.teknisi)?r.teknisi.join(', '):r.teknisi],['Ketua Tim',r.ketuaTim],['Koordinator Obs.',r.koordinatorObs],['Kegiatan',r.kegiatan],['Catatan',r.catatan]]
  rows.forEach(([k,v])=>w.document.write(`<tr><th>${k}</th><td>${v||'-'}</td></tr>`))
  w.document.write(`</table></body></html>`); w.document.close(); w.print()
}
</script>

<style scoped>
.detail-row { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
.detail-label { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
.detail-val { font-size: 0.875rem; color: #1e293b; font-weight: 500; margin-top: 2px; }
</style>
