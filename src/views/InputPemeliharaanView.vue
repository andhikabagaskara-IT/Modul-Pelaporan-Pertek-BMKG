<template>
  <div>
    <div class="page-header d-flex align-center" style="justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div>
        <div class="page-title"><span class="icon">🛠️</span> Input Pemeliharaan</div>
        <div class="page-subtitle">Isi formulir pemeliharaan, review, lalu simpan</div>
      </div>
      <button class="btn btn-outline" @click="$router.push('/pemeliharaan')">← Kembali</button>
    </div>

    <!-- Preview panel -->
    <div class="modal-overlay" v-if="showPreview" @click.self="showPreview=false">
      <div class="modal-box">
        <div class="modal-header"><h3>👁 Preview Input Pemeliharaan</h3><button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white" @click="showPreview=false">✕</button></div>
        <div class="modal-body">
          <div class="grid-2">
            <div class="detail-row"><div class="detail-label">Tanggal</div><div class="detail-val">{{ formatDate(form.tanggal) }}</div></div>
            <div class="detail-row"><div class="detail-label">Kategori</div><div class="detail-val">{{ form.kategori }}</div></div>
            <div class="detail-row"><div class="detail-label">Site</div><div class="detail-val">{{ Array.isArray(form.site) ? form.site.join(', ') : form.site }}</div></div>
            <div class="detail-row" style="grid-column:1/-1"><div class="detail-label">Teknisi</div>
              <div class="detail-val">
                <div class="d-flex gap-2" style="flex-wrap:wrap; margin-top:6px">
                  <div class="teknisi-badge" v-for="tn in form.teknisi" :key="tn">
                    <img :src="getTeknisiPhoto(tn)" />
                    <span>{{ tn.split(',')[0] }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="detail-row"><div class="detail-label">Ketua Tim</div><div class="detail-val">{{ form.ketuaTim }}</div></div>
            <div class="detail-row"><div class="detail-label">Koordinator</div><div class="detail-val">{{ form.koordinator }}</div></div>
            <div class="detail-row" style="grid-column:1/-1"><div class="detail-label">Catatan</div><div class="detail-val">{{ form.catatan || '-' }}</div></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showPreview=false">✏️ Ubah</button>
          <button class="btn btn-success" @click="simpan">💾 Simpan</button>
        </div>
      </div>
    </div>

    <TambahTeknisiModal :show="showTeknisiModal" @close="showTeknisiModal=false" @save="onSaveTeknisi" />

    <div v-if="successMsg" class="alert alert-success">✅ {{ successMsg }}</div>

    <div class="card">
      <div class="card-header"><div class="section-title" style="margin:0">📋 Formulir Pemeliharaan</div></div>
      <div class="card-body">
        <form @submit.prevent="handlePreview">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Tanggal Pemeliharaan <span class="required">*</span></label>
              <input type="date" class="form-control" v-model="form.tanggal" required />
            </div>
            <div class="form-group">
              <label class="form-label">Pilih Alat / Kategori <span class="required">*</span></label>
              <select class="form-control" v-model="form.kategori" required>
                <option value="">-- Pilih Kategori --</option>
                <option v-for="k in KATEGORI_LIST" :key="k">{{ k }}</option>
              </select>
            </div>
          </div>

          <!-- Site Checkbox -->
          <div class="form-group">
            <label class="form-label">Site <span class="required">*</span></label>
            <div v-if="availableSites.length > 0" class="check-group" style="padding:10px; border:1px solid #e2e8f0; border-radius:8px; background:#f8fafc; max-height:160px; overflow-y:auto">
              <label v-for="s in availableSites" :key="s" class="check-item-simple" style="display:flex; align-items:center; gap:8px; margin-bottom:6px">
                <input type="checkbox" :value="s" v-model="form.site" />
                <span style="font-size:0.875rem">{{ s }}</span>
              </label>
            </div>
            <div v-else class="text-sm text-muted" style="padding:10px; border:1px dashed #cbd5e1; border-radius:8px">Pilih kategori terlebih dahulu untuk melihat daftar site.</div>

            <div class="mt-2 text-xs">
              <a href="#" @click.prevent="customSite = !customSite" style="color:#3b82f6; text-decoration:none">
                {{ customSite ? 'Batal tambah site khusus' : '+ Tambah Site Khusus' }}
              </a>
            </div>
            <input v-if="customSite" class="form-control mt-1" v-model="form.customSiteName" placeholder="Nama site khusus (opsional)..." />
          </div>

          <!-- Teknisi -->
          <div class="form-group">
            <label class="form-label">Teknisi (1-5 orang) <button type="button" class="btn btn-xs btn-outline" style="margin-left:8px" @click="showTeknisiModal = true">+ Tambah Baru</button></label>
            <div class="check-group">
              <label class="check-item" :class="{selected: form.teknisi.includes(t.name)}" v-for="t in teknisiStore.teknisiList" :key="t.name">
                <input type="checkbox" :value="t.name" v-model="form.teknisi" :disabled="form.teknisi.length >= 5 && !form.teknisi.includes(t.name)" />
                <img :src="t.photo" class="teknisi-photo" />
                <span>{{ t.name.split(',')[0] }}</span>
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
              <label class="form-label">Koordinator Bidang Data & Informasi</label>
              <select class="form-control" v-model="form.koordinator">
                <option value="">-- Pilih Koordinator --</option>
                <option v-for="k in KOORDINATOR_DI_LIST" :key="k">{{ k }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Catatan</label>
            <textarea class="form-control" v-model="form.catatan" rows="3" placeholder="Catatan kegiatan pemeliharaan..."></textarea>
          </div>

          <div class="d-flex gap-2" style="justify-content:flex-end;flex-wrap:wrap">
            <button type="button" class="btn btn-outline" @click="$router.push('/pemeliharaan')">Batal</button>
            <button type="submit" class="btn btn-primary">👁 Preview & Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePemeliharaanStore } from '../stores/pemeliharaanStore'
import { useTeknisiStore } from '../stores/teknisiStore'
import TambahTeknisiModal from '../components/TambahTeknisiModal.vue'
import { KATEGORI_LIST, KATEGORI_SITE_MAP, KETUA_TIM_LIST, KOORDINATOR_DI_LIST } from '../data/masterData'

const router = useRouter()
const store = usePemeliharaanStore()
const teknisiStore = useTeknisiStore()
const showPreview = ref(false)
const showTeknisiModal = ref(false)
const successMsg = ref('')
const customSite = ref(false)

const form = reactive({
  tanggal: '', kategori: '', site: [], customSiteName: '', teknisi: [],
  ketuaTim: '', koordinator: '', catatan: '',
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

function onSaveTeknisi(t) {
  teknisiStore.addTeknisi(t)
  showTeknisiModal.value = false
}

function formatDate(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
function getTeknisiPhoto(name) {
  const t = teknisiStore.teknisiList.find(x => x.name === name)
  return t ? t.photo : 'https://ui-avatars.com/api/?name=' + name.split(' ')[0]
}
function handlePreview() { showPreview.value = true }
function simpan() {
  const finalSites = [...form.site]
  if (customSite.value && form.customSiteName.trim()) finalSites.push(form.customSiteName.trim())

  store.add({
    ...form,
    alat: form.kategori,
    lokasi: finalSites,
  })
  showPreview.value = false
  successMsg.value = 'Data pemeliharaan berhasil disimpan!'
  setTimeout(() => router.push('/pemeliharaan'), 1500)
}
</script>

<style scoped>
.detail-row { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
.detail-label { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
.detail-val { font-size: 0.875rem; color: #1e293b; font-weight: 500; margin-top: 2px; }
</style>
