<template>
  <div>
    <div class="page-header d-flex align-center" style="justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div>
        <div class="page-title"><span class="icon">📦</span> Input Instalasi</div>
        <div class="page-subtitle">Isi formulir instalasi, review, lalu simpan</div>
      </div>
      <button class="btn btn-outline" @click="$router.push('/instalasi')">← Kembali</button>
    </div>

    <!-- Preview Modal -->
    <div class="modal-overlay" v-if="showPreview" @click.self="showPreview=false">
      <div class="modal-box" style="max-width:720px">
        <div class="modal-header"><h3>👁 Preview Input Instalasi</h3><button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white" @click="showPreview=false">✕</button></div>
        <div class="modal-body">
          <div class="grid-2">
            <div class="detail-row"><div class="detail-label">Kategori</div><div class="detail-val">{{ form.kategori }}</div></div>
            <div class="detail-row"><div class="detail-label">Kode Peralatan</div><div class="detail-val">{{ form.kodePeralatan }}</div></div>
            <div class="detail-row"><div class="detail-label">Tgl Instalasi</div><div class="detail-val">{{ formatDate(form.tanggalInstalasi) }}</div></div>
            <div class="detail-row"><div class="detail-label">Waktu Instalasi</div><div class="detail-val">{{ form.waktuInstalasi }}</div></div>
            <div class="detail-row"><div class="detail-label">Teknisi</div><div class="detail-val">{{ form.teknisi.join(', ') }}</div></div>
            <div class="detail-row"><div class="detail-label">Ketua Tim</div><div class="detail-val">{{ form.ketuaTim }}</div></div>
            <div class="detail-row"><div class="detail-label">Koordinator Obs.</div><div class="detail-val">{{ form.koordinatorObs }}</div></div>
            <div class="detail-row" style="grid-column:1/-1"><div class="detail-label">Kegiatan</div><div class="detail-val">{{ form.kegiatan }}</div></div>
            <div class="detail-row" style="grid-column:1/-1"><div class="detail-label">Catatan</div><div class="detail-val">{{ form.catatan || '-' }}</div></div>
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
      <div class="card-header"><div class="section-title" style="margin:0">📋 Formulir Instalasi</div></div>
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
              <label class="form-label">Kode Peralatan <span class="required">*</span></label>
              <input class="form-control" v-model="form.kodePeralatan" placeholder="Contoh: ADG-004" required />
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Tanggal Instalasi <span class="required">*</span></label>
              <input type="date" class="form-control" v-model="form.tanggalInstalasi" required />
            </div>
            <div class="form-group">
              <label class="form-label">Waktu Instalasi <span class="required">*</span></label>
              <input type="time" class="form-control" v-model="form.waktuInstalasi" required />
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

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Ketua Tim Supporting Engineering</label>
              <select class="form-control" v-model="form.ketuaTim">
                <option value="">-- Pilih Ketua Tim --</option>
                <option v-for="k in KETUA_TIM_LIST" :key="k">{{ k }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Koordinator Bidang Observasi</label>
              <select class="form-control" v-model="form.koordinatorObs">
                <option value="">-- Pilih Koordinator --</option>
                <option v-for="k in KOORDINATOR_OBS_LIST" :key="k">{{ k }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Kegiatan <span class="required">*</span></label>
            <textarea class="form-control" v-model="form.kegiatan" rows="3"
              placeholder="Deskripsikan kegiatan instalasi yang dilakukan..." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Catatan</label>
            <textarea class="form-control" v-model="form.catatan" rows="2" placeholder="Catatan tambahan..."></textarea>
          </div>

          <!-- Foto Upload -->
          <div class="form-group">
            <label class="form-label">Foto Kegiatan (JPG, JPEG, PNG)</label>
            <div class="upload-area" :class="{'has-file':form.fotoName}" @click="fileRef?.click()" @dragover.prevent @drop.prevent="onDrop">
              <input type="file" ref="fileRef" accept=".jpg,.jpeg,.png" @change="onFileChange" style="display:none" />
              <div v-if="!form.fotoName">
                <div style="font-size:2rem;margin-bottom:8px">📷</div>
                <div style="font-weight:600;color:#2563eb">Klik atau drag & drop foto</div>
                <div class="text-xs text-muted mt-1">JPG, JPEG, PNG · Maks 5MB</div>
              </div>
              <div v-else>
                <img v-if="form.fotoPreview" :src="form.fotoPreview" style="max-height:120px;border-radius:8px;margin-bottom:8px" />
                <div style="font-weight:600;color:#16a34a">✅ {{ form.fotoName }}</div>
                <button type="button" class="btn btn-xs btn-danger mt-1" @click.stop="clearFoto">Hapus</button>
              </div>
            </div>
          </div>

          <div class="d-flex gap-2" style="justify-content:flex-end;flex-wrap:wrap">
            <button type="button" class="btn btn-outline" @click="$router.push('/instalasi')">Batal</button>
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
import { useInstalasiStore } from '../stores/instalasiStore'
import { KATEGORI_LIST, TEKNISI_LIST, KETUA_TIM_LIST, KOORDINATOR_OBS_LIST } from '../data/masterData'

const router = useRouter()
const store = useInstalasiStore()
const showPreview = ref(false)
const successMsg = ref('')
const fileRef = ref(null)

const form = reactive({
  kategori: '', kodePeralatan: '', tanggalInstalasi: '', waktuInstalasi: '',
  teknisi: [], ketuaTim: '', koordinatorObs: '',
  namaAlat: '', merk: '-', tipe: '-', sn: '-',
  kegiatan: '', catatan: '',
  fotoName: '', fotoPreview: null, fotoFile: null,
})

function formatDate(d) { if (!d) return '-'; return new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit',year:'numeric'}) }
function onFileChange(e) { const f = e.target.files[0]; if (f) processFile(f) }
function onDrop(e) { const f = e.dataTransfer.files[0]; if (f) processFile(f) }
function processFile(f) {
  if (!['image/jpeg','image/jpg','image/png'].includes(f.type)) { alert('Format harus JPG/JPEG/PNG'); return }
  if (f.size > 5*1024*1024) { alert('Ukuran file maks 5MB'); return }
  form.fotoName = f.name; form.fotoFile = f
  const reader = new FileReader()
  reader.onload = e => { form.fotoPreview = e.target.result }
  reader.readAsDataURL(f)
}
function clearFoto() { form.fotoName=''; form.fotoPreview=null; form.fotoFile=null; if(fileRef.value) fileRef.value.value='' }
function handlePreview() { showPreview.value = true }
function simpan() {
  store.add({ ...form, namaAlat: form.kodePeralatan, foto: form.fotoPreview })
  showPreview.value = false
  successMsg.value = 'Data instalasi berhasil disimpan!'
  setTimeout(() => router.push('/instalasi'), 1500)
}
</script>

<style scoped>
.detail-row { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
.detail-label { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
.detail-val { font-size: 0.875rem; color: #1e293b; font-weight: 500; margin-top: 2px; }
</style>
