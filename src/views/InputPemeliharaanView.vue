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
            <div class="detail-row"><div class="detail-label">Site</div><div class="detail-val">{{ form.site }}</div></div>
            <div class="detail-row"><div class="detail-label">Teknisi</div><div class="detail-val">{{ form.teknisi.join(', ') }}</div></div>
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
            <div class="check-group">
              <label class="check-item" :class="{selected: form.site===s}" v-for="s in SITE_LIST" :key="s" @click="form.site=s">
                <input type="radio" :value="s" v-model="form.site" /> {{ s }}
              </label>
            </div>
          </div>

          <!-- Teknisi -->
          <div class="form-group">
            <label class="form-label">Teknisi (1-5 orang)</label>
            <div class="check-group">
              <label class="check-item" :class="{selected: form.teknisi.includes(t)}" v-for="t in TEKNISI_LIST" :key="t">
                <input type="checkbox" :value="t" v-model="form.teknisi" :disabled="form.teknisi.length >= 5 && !form.teknisi.includes(t)" />
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { usePemeliharaanStore } from '../stores/pemeliharaanStore'
import { KATEGORI_LIST, SITE_LIST, TEKNISI_LIST, KETUA_TIM_LIST, KOORDINATOR_DI_LIST } from '../data/masterData'

const router = useRouter()
const store = usePemeliharaanStore()
const showPreview = ref(false)
const successMsg = ref('')

const form = reactive({
  tanggal: '', kategori: '', site: '', teknisi: [],
  ketuaTim: '', koordinator: '', catatan: '',
})

function formatDate(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
function handlePreview() { showPreview.value = true }
function simpan() {
  store.add({
    ...form,
    alat: form.kategori,
    lokasi: form.site,
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
