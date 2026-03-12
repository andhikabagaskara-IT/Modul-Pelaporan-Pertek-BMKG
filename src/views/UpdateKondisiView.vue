<template>
  <div>
    <div class="page-header d-flex align-center" style="justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div>
        <div class="page-title"><span class="icon">🔄</span> Update Kondisi Alat</div>
        <div class="page-subtitle">Perbarui kondisi terkini peralatan meteorologi</div>
      </div>
      <button class="btn btn-outline" @click="$router.push('/daftar-peralatan')">← Kembali ke Dashboard</button>
    </div>

    <div v-if="successMsg" class="alert alert-success">✅ {{ successMsg }}</div>

    <div class="card">
      <div class="card-header"><div class="section-title" style="margin:0">📝 Formulir Update Kondisi</div></div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Kategori <span class="required">*</span></label>
              <select class="form-control" v-model="form.kategori">
                <option value="">-- Pilih Kategori --</option>
                <option v-for="k in KATEGORI_LIST_WITH_OTHER" :key="k">{{ k }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Site <span class="required">*</span></label>
              <div v-if="availableSites.length > 0" class="check-group" style="padding:10px; border:1px solid #e2e8f0; border-radius:8px; background:#f8fafc; max-height:160px; overflow-y:auto">
                <label v-for="s in availableSites" :key="s" class="check-item-simple" style="display:flex; align-items:center; gap:8px; margin-bottom:6px">
                  <input type="checkbox" :value="s" v-model="form.site" />
                  <span style="font-size:0.875rem">{{ s }}</span>
                </label>
              </div>
              <div v-else class="text-sm text-muted" style="padding:10px; border:1px dashed #cbd5e1; border-radius:8px">Pilih kategori terlebih dahulu untuk melihat daftar site.</div>
              <div v-if="errors.site" class="invalid-feedback d-block">{{ errors.site }}</div>

              <div class="mt-2 text-xs">
                <a href="#" @click.prevent="customSite = !customSite" style="color:#3b82f6; text-decoration:none">
                  {{ customSite ? 'Batal tambah site khusus' : '+ Tambah Site Khusus' }}
                </a>
              </div>
              <input v-if="customSite" class="form-control mt-1" v-model="form.customSiteName" placeholder="Nama site khusus (opsional)..." />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Nama Alat <span class="required">*</span></label>
            <input class="form-control" :class="{'is-invalid':errors.namaAlat}" v-model="form.namaAlat" placeholder="Tulis (-) jika kosong" />
            <div v-if="errors.namaAlat" class="invalid-feedback">{{ errors.namaAlat }}</div>
          </div>

          <div class="form-group">
            <label class="form-label">Tanggal Kerusakan <span class="required">*</span></label>
            <input type="date" class="form-control" v-model="form.tanggalKerusakan" />
          </div>

          <div class="form-group">
            <label class="form-label">Kondisi Akhir <span class="required">*</span></label>
            <textarea class="form-control" v-model="form.kondisiAkhir" rows="3"
              placeholder="Deskripsikan kondisi akhir peralatan..."></textarea>
          </div>

          <!-- Foto Upload -->
          <div class="form-group">
            <label class="form-label">Foto Kondisi (JPG, JPEG, PNG)</label>
            <div class="upload-area" :class="{'has-file': form.fotoName}" @click="triggerUpload" @dragover.prevent @drop.prevent="onDrop">
              <input type="file" ref="fileRef" accept=".jpg,.jpeg,.png" @change="onFileChange" style="display:none" />
              <div v-if="!form.fotoName">
                <div style="font-size:2rem;margin-bottom:8px">📷</div>
                <div style="font-weight:600;color:#2563eb">Klik atau drag & drop foto di sini</div>
                <div class="text-xs text-muted mt-1">Format: JPG, JPEG, PNG · Maks 5MB</div>
              </div>
              <div v-else>
                <img v-if="form.fotoPreview" :src="form.fotoPreview" style="max-height:120px;border-radius:8px;margin-bottom:8px" />
                <div style="font-weight:600;color:#16a34a">✅ {{ form.fotoName }}</div>
                <button type="button" class="btn btn-xs btn-danger mt-1" @click.stop="clearFoto">Hapus</button>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Keterangan</label>
            <textarea class="form-control" v-model="form.keterangan" rows="3" placeholder="Keterangan tambahan..."></textarea>
          </div>

          <div class="d-flex gap-2" style="justify-content:flex-end;flex-wrap:wrap">
            <button type="button" class="btn btn-outline" @click="$router.push('/daftar-peralatan')">Batal</button>
            <button type="submit" class="btn btn-success">💾 Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { KATEGORI_LIST_WITH_OTHER, KATEGORI_SITE_MAP } from '../data/masterData'

const router = useRouter()
const successMsg = ref('')
const customSite = ref(false)
const fileRef = ref(null)
const errors = reactive({})

const form = reactive({
  kategori: '', site: [], customSiteName: '',
  namaAlat: '', tanggalKerusakan: '',
  kondisiAkhir: '', keterangan: '',
  fotoName: '', fotoPreview: null, fotoFile: null,
})

const availableSites = computed(() => {
  if (form.kategori && KATEGORI_SITE_MAP[form.kategori]) {
    return KATEGORI_SITE_MAP[form.kategori];
  }
  return [];
});

watch(() => form.kategori, (newVal) => {
  if (newVal && KATEGORI_SITE_MAP[newVal]) {
    form.site = [...KATEGORI_SITE_MAP[newVal]];
  } else {
    form.site = [];
  }
});

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.namaAlat) errors.namaAlat = 'Nama alat wajib diisi, tulis (-) jika tidak ada'
  if (form.site.length === 0 && !form.customSiteName) errors.site = 'Pilih minimal satu site atau tambah site khusus'
  return Object.keys(errors).length === 0
}

function triggerUpload() { fileRef.value?.click() }

function onFileChange(e) {
  const f = e.target.files[0]
  if (f) processFile(f)
}
function onDrop(e) {
  const f = e.dataTransfer.files[0]
  if (f) processFile(f)
}
function processFile(f) {
  if (!['image/jpeg', 'image/jpg', 'image/png'].includes(f.type)) {
    alert('Format file harus JPG, JPEG, atau PNG'); return
  }
  if (f.size > 5 * 1024 * 1024) { alert('Ukuran file maksimal 5MB'); return }
  form.fotoName = f.name
  form.fotoFile = f
  const reader = new FileReader()
  reader.onload = (e) => { form.fotoPreview = e.target.result }
  reader.readAsDataURL(f)
}
function clearFoto() {
  form.fotoName = ''; form.fotoPreview = null; form.fotoFile = null
  if (fileRef.value) fileRef.value.value = ''
}

function handleSubmit() {
  if (!validate()) return
  successMsg.value = 'Kondisi alat berhasil diperbarui!'
  setTimeout(() => router.push('/daftar-peralatan'), 1500)
}
</script>
