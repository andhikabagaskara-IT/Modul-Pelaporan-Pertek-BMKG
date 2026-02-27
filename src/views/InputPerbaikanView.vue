<template>
  <div>
    <div class="page-header d-flex align-center" style="justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div>
        <div class="page-title"><span class="icon">🔩</span> Input Perbaikan</div>
        <div class="page-subtitle">Isi formulir perbaikan, review, lalu simpan</div>
      </div>
      <button class="btn btn-outline" @click="$router.push('/perbaikan')">← Kembali</button>
    </div>

    <!-- Preview Modal -->
    <div class="modal-overlay" v-if="showPreview" @click.self="showPreview=false">
      <div class="modal-box" style="max-width:720px">
        <div class="modal-header"><h3>👁 Preview Input Perbaikan</h3><button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white" @click="showPreview=false">✕</button></div>
        <div class="modal-body">
          <div class="grid-2">
            <div class="detail-row"><div class="detail-label">Kategori</div><div class="detail-val">{{ form.kategori }}</div></div>
            <div class="detail-row"><div class="detail-label">Site</div><div class="detail-val">{{ form.site }}</div></div>
            <div class="detail-row"><div class="detail-label">Nama Alat</div><div class="detail-val">{{ form.namaAlat }}</div></div>
            <div class="detail-row"><div class="detail-label">Tgl Rusak</div><div class="detail-val">{{ formatDate(form.tanggalRusak) }}</div></div>
            <div class="detail-row"><div class="detail-label">Tgl Perbaikan</div><div class="detail-val">{{ formatDate(form.tanggalPerbaikan) }}</div></div>
            <div class="detail-row"><div class="detail-label">Pelapor</div><div class="detail-val">{{ form.namaPelapor }}</div></div>
            <div class="detail-row"><div class="detail-label">Teknisi</div><div class="detail-val">{{ form.teknisi.join(', ') }}</div></div>
            <div class="detail-row"><div class="detail-label">Ketua Tim</div><div class="detail-val">{{ form.ketuaTim }}</div></div>
            <div class="detail-row" style="grid-column:1/-1"><div class="detail-label">Kondisi Awal</div><div class="detail-val">{{ form.kondisiAwal }}</div></div>
            <div class="detail-row" style="grid-column:1/-1"><div class="detail-label">Tindakan</div><div class="detail-val">{{ form.tindakan }}</div></div>
            <div class="detail-row" style="grid-column:1/-1"><div class="detail-label">Kondisi Akhir</div><div class="detail-val">{{ form.kondisiAkhir }}</div></div>
            <div class="detail-row" style="grid-column:1/-1"><div class="detail-label">Catatan</div><div class="detail-val">{{ form.catatan }}</div></div>
          </div>
          <div v-if="form.fotoPreview" style="margin-top:12px">
            <div class="detail-label mb-1">Foto Kegiatan</div>
            <img :src="form.fotoPreview" style="max-height:160px;border-radius:8px" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showPreview=false">✏️ Ubah</button>
          <button class="btn btn-success" @click="simpan">💾 Simpan</button>
        </div>
      </div>
    </div>

    <div v-if="successMsg" class="alert alert-success">✅ {{ successMsg }}</div>

    <div class="card">
      <div class="card-header"><div class="section-title" style="margin:0">📋 Formulir Perbaikan</div></div>
      <div class="card-body">
        <form @submit.prevent="handlePreview">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Kategori <span class="required">*</span></label>
              <select class="form-control" v-model="form.kategori" required>
                <option value="">-- Pilih Kategori --</option>
                <option v-for="k in KATEGORI_LIST" :key="k">{{ k }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Site <span class="required">*</span></label>
              <select class="form-control" v-model="form.site" @change="onSiteChange">
                <option value="">-- Pilih Site --</option>
                <option v-for="s in SITE_LIST" :key="s">{{ s }}</option>
                <option value="__custom__">+ Tambah Site Baru</option>
              </select>
              <input v-if="customSite" class="form-control mt-1" v-model="form.customSiteName" placeholder="Nama site baru..." />
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Nama Alat <span class="required">*</span></label>
              <input class="form-control" v-model="form.namaAlat" placeholder="Nama alat yang diperbaiki" required />
            </div>
            <div class="form-group">
              <label class="form-label">Nama Pelapor <span class="required">*</span></label>
              <input class="form-control" v-model="form.namaPelapor" placeholder="Nama pelapor kerusakan" required />
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Tanggal Rusak</label>
              <input type="date" class="form-control" v-model="form.tanggalRusak" />
            </div>
            <div class="form-group">
              <label class="form-label">Tanggal Perbaikan</label>
              <input type="date" class="form-control" v-model="form.tanggalPerbaikan" />
            </div>
          </div>

          <!-- Teknisi -->
          <div class="form-group">
            <label class="form-label">Teknisi (1-5 orang)</label>
            <div class="check-group">
              <label class="check-item" :class="{selected: form.teknisi.includes(t)}" v-for="t in TEKNISI_LIST" :key="t">
                <input type="checkbox" :value="t" v-model="form.teknisi" :disabled="form.teknisi.length>=5 && !form.teknisi.includes(t)" />
                {{ t.split(',')[0] }}
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Ketua Tim Supporting Engineering</label>
            <select class="form-control" v-model="form.ketuaTim">
              <option value="">-- Pilih Ketua Tim --</option>
              <option v-for="k in KETUA_TIM_LIST" :key="k">{{ k }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Kondisi Awal <span class="required">*</span></label>
            <textarea class="form-control" v-model="form.kondisiAwal" rows="2" placeholder="Deskripsikan kondisi awal sebelum perbaikan..." required></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Tindakan Perbaikan <span class="required">*</span></label>
            <textarea class="form-control" v-model="form.tindakan" rows="2" placeholder="Deskripsikan tindakan yang dilakukan..." required></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Kondisi Akhir <span class="required">*</span></label>
            <textarea class="form-control" v-model="form.kondisiAkhir" rows="2" placeholder="Deskripsikan kondisi setelah perbaikan..." required></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Catatan Perbaikan</label>
            <textarea class="form-control" v-model="form.catatan" rows="2" placeholder="Catatan tambahan..."></textarea>
          </div>

          <!-- Foto Upload -->
          <div class="form-group">
            <label class="form-label">Foto Kegiatan (JPG, JPEG, PNG)</label>
            <div class="upload-area" :class="{'has-file':form.fotoName}" @click="fileRef?.click()" @dragover.prevent @drop.prevent="onDrop">
              <input type="file" ref="fileRef" accept=".jpg,.jpeg,.png" @change="onFileChange" style="display:none" />
              <div v-if="!form.fotoName"><div style="font-size:2rem;margin-bottom:8px">📷</div><div style="font-weight:600;color:#2563eb">Klik atau drag & drop foto</div><div class="text-xs text-muted mt-1">JPG, JPEG, PNG · Maks 5MB</div></div>
              <div v-else><img v-if="form.fotoPreview" :src="form.fotoPreview" style="max-height:120px;border-radius:8px;margin-bottom:8px" /><div style="font-weight:600;color:#16a34a">✅ {{ form.fotoName }}</div><button type="button" class="btn btn-xs btn-danger mt-1" @click.stop="clearFoto">Hapus</button></div>
            </div>
          </div>

          <div class="d-flex gap-2" style="justify-content:flex-end;flex-wrap:wrap">
            <button type="button" class="btn btn-outline" @click="$router.push('/perbaikan')">Batal</button>
            <button type="submit" class="btn btn-primary">👁 Preview & Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { usePerbaikanStore } from '../stores/perbaikanStore'
import { KATEGORI_LIST, SITE_LIST, TEKNISI_LIST, KETUA_TIM_LIST } from '../data/masterData'

const router = useRouter()
const store = usePerbaikanStore()
const showPreview = ref(false)
const successMsg = ref('')
const fileRef = ref(null)
const customSite = ref(false)

const form = reactive({
  kategori: '', site: '', customSiteName: '',
  namaAlat: '', namaPelapor: '', tanggalRusak: '', tanggalPerbaikan: '',
  teknisi: [], ketuaTim: '', kondisiAwal: '', tindakan: '', kondisiAkhir: '',
  catatan: '', fotoName: '', fotoPreview: null, fotoFile: null, tahunPerolehan: '',
  merk: '-', tipe: '-', sn: '-',
})

function formatDate(d) { if (!d) return '-'; return new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit',year:'numeric'}) }
function onSiteChange() { customSite.value = form.site === '__custom__' }
function onFileChange(e) { const f = e.target.files[0]; if (f) processFile(f) }
function onDrop(e) { const f = e.dataTransfer.files[0]; if (f) processFile(f) }
function processFile(f) {
  if (!['image/jpeg','image/jpg','image/png'].includes(f.type)) { alert('Format harus JPG/JPEG/PNG'); return }
  form.fotoName = f.name; form.fotoFile = f
  const reader = new FileReader()
  reader.onload = (e) => { form.fotoPreview = e.target.result }
  reader.readAsDataURL(f)
}
function clearFoto() { form.fotoName=''; form.fotoPreview=null; form.fotoFile=null; if(fileRef.value) fileRef.value.value='' }
function handlePreview() { showPreview.value = true }
function simpan() {
  const siteVal = customSite.value ? form.customSiteName : form.site
  store.add({ ...form, site: siteVal, foto: form.fotoPreview })
  showPreview.value = false
  successMsg.value = 'Data perbaikan berhasil disimpan!'
  setTimeout(() => router.push('/perbaikan'), 1500)
}
</script>

<style scoped>
.detail-row { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
.detail-label { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
.detail-val { font-size: 0.875rem; color: #1e293b; font-weight: 500; margin-top: 2px; }
</style>
