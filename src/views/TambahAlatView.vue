<template>
  <div>
    <div class="page-header d-flex align-center" style="justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div>
        <div class="page-title"><span class="icon">➕</span> Tambah Data Alat</div>
        <div class="page-subtitle">Isi formulir di bawah ini untuk menambahkan peralatan baru</div>
      </div>
      <button class="btn btn-outline" @click="$router.push('/daftar-peralatan')">← Kembali ke Dashboard</button>
    </div>

    <TambahTeknisiModal :show="showTeknisiModal" @close="showTeknisiModal=false" @save="onSaveTeknisi" />

    <div v-if="successMsg" class="alert alert-success">✅ {{ successMsg }}</div>

    <div class="card">
      <div class="card-header"><div class="section-title" style="margin:0">📋 Data Peralatan Baru</div></div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Kode Peralatan <span class="required">*</span></label>
              <input class="form-control" :class="{' is-invalid':errors.kode}" v-model="form.kode" placeholder="Contoh: ADG-003" />
              <div v-if="errors.kode" class="invalid-feedback">{{ errors.kode }}</div>
            </div>
            <div class="form-group">
              <label class="form-label">Kategori <span class="required">*</span></label>
              <select class="form-control" :class="{'is-invalid':errors.kategori}" v-model="form.kategori">
                <option value="">-- Pilih Kategori --</option>
                <option v-for="k in KATEGORI_LIST_WITH_OTHER" :key="k">{{ k }}</option>
              </select>
              <div v-if="errors.kategori" class="invalid-feedback">{{ errors.kategori }}</div>
            </div>
          </div>

          <div class="grid-2">
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
              <input v-if="customSite" class="form-control mt-1" v-model="form.customSiteName" placeholder="Masukkan nama form site khusus (opsional)..." />
            </div>
            <div class="form-group">
              <label class="form-label">Jenis Alat <span class="required">*</span></label>
              <select class="form-control" v-model="form.jenis">
                <option value="">-- Pilih Jenis --</option>
                <option v-for="j in JENIS_ALAT_LIST" :key="j">{{ j }}</option>
              </select>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Nama Alat <span class="required">*</span></label>
              <input class="form-control" :class="{'is-invalid':errors.namaAlat}" v-model="form.namaAlat" placeholder="Tulis (-) jika kosong" />
              <div v-if="errors.namaAlat" class="invalid-feedback">{{ errors.namaAlat }}</div>
            </div>
            <div class="form-group">
              <label class="form-label">Merek <span class="required">*</span></label>
              <input class="form-control" :class="{'is-invalid':errors.merk}" v-model="form.merk" placeholder="Tulis (-) jika kosong" />
              <div v-if="errors.merk" class="invalid-feedback">{{ errors.merk }}</div>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Tipe <span class="required">*</span></label>
              <input class="form-control" :class="{'is-invalid':errors.tipe}" v-model="form.tipe" placeholder="Tulis (-) jika kosong" />
              <div v-if="errors.tipe" class="invalid-feedback">{{ errors.tipe }}</div>
            </div>
            <div class="form-group">
              <label class="form-label">Serial Number <span class="required">*</span></label>
              <input class="form-control" :class="{'is-invalid':errors.sn}" v-model="form.sn" placeholder="Tulis (-) jika kosong" />
              <div v-if="errors.sn" class="invalid-feedback">{{ errors.sn }}</div>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Tanggal Instalasi</label>
              <input class="form-control" type="date" v-model="form.tanggalInstal" />
            </div>
            <div class="form-group">
              <label class="form-label">Tahun Pengadaan</label>
              <input class="form-control" type="text" v-model="form.pengadaan" placeholder="Contoh: 2023" />
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Tanggal Kalibrasi</label>
              <input class="form-control" type="date" v-model="form.kalibrasi" />
            </div>
            <div class="form-group">
              <label class="form-label">Status Alat</label>
              <select class="form-control" v-model="form.status">
                <option v-for="s in STATUS_ALAT_LIST" :key="s">{{ s }}</option>
              </select>
            </div>
          </div>

          <!-- Teknisi Multi-Select -->
          <div class="form-group">
            <label class="form-label">Teknisi (Pilih 1-5 orang) <button type="button" class="btn btn-xs btn-outline" style="margin-left:8px" @click="showTeknisiModal = true">+ Tambah Baru</button></label>
            <div class="check-group">
              <label class="check-item" :class="{selected: form.teknisi.includes(t.name)}" v-for="t in teknisiStore.teknisiList" :key="t.name">
                <input type="checkbox" :value="t.name" v-model="form.teknisi" :disabled="form.teknisi.length >= 5 && !form.teknisi.includes(t.name)" />
                <img :src="t.photo" class="teknisi-photo" />
                <span>{{ t.name.split(',')[0] }}</span>
              </label>
            </div>
          </div>

          <!-- Kondisi -->
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Kondisi</label>
              <select class="form-control" v-model="form.kondisi">
                <option v-for="k in KONDISI_LIST" :key="k">{{ k }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Keterangan Kondisi</label>
              <input class="form-control" v-model="form.keterangan" placeholder="Keterangan tambahan..." />
            </div>
          </div>

          <!-- PC/Komputer Extra Fields -->
          <div class="card" style="background:#f0f7ff;border:1px dashed #60a5fa;margin-bottom:20px">
            <div class="card-header" style="cursor:pointer" @click="showPC = !showPC">
              <div class="section-title" style="margin:0;font-size:0.875rem">💻 Detail Khusus Komputer/PC (opsional)</div>
              <span>{{ showPC ? '▲' : '▼' }}</span>
            </div>
            <div class="card-body" v-if="showPC">
              <div class="grid-2">
                <div class="form-group">
                  <label class="form-label">OS</label>
                  <input class="form-control" v-model="form.pc.os" placeholder="Windows 10, Ubuntu, dll." />
                </div>
                <div class="form-group">
                  <label class="form-label">Processor</label>
                  <input class="form-control" v-model="form.pc.processor" placeholder="Intel Core i5, AMD Ryzen 5, dll." />
                </div>
                <div class="form-group">
                  <label class="form-label">RAM</label>
                  <input class="form-control" v-model="form.pc.ram" placeholder="8 GB, 16 GB, dll." />
                </div>
                <div class="form-group">
                  <label class="form-label">ROM / Storage</label>
                  <input class="form-control" v-model="form.pc.rom" placeholder="256 GB SSD, 1 TB HDD, dll." />
                </div>
                <div class="form-group">
                  <label class="form-label">Monitor</label>
                  <input class="form-control" v-model="form.pc.monitor" placeholder="24 inch, LG, dll." />
                </div>
                <div class="form-group">
                  <label class="form-label">Software Office</label>
                  <input class="form-control" v-model="form.pc.office" placeholder="Microsoft Office 2019, dll." />
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex gap-2" style="justify-content:flex-end;flex-wrap:wrap">
            <button type="button" class="btn btn-outline" @click="$router.push('/daftar-peralatan')">Batal</button>
            <button type="submit" class="btn btn-success">✅ Tambah Data</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { usePeralatanStore } from '../stores/peralatanStore'
import { useTeknisiStore } from '../stores/teknisiStore'
import TambahTeknisiModal from '../components/TambahTeknisiModal.vue'
import { KATEGORI_LIST_WITH_OTHER, KATEGORI_SITE_MAP, JENIS_ALAT_LIST, KONDISI_LIST, STATUS_ALAT_LIST } from '../data/masterData'

const router = useRouter()
const peralatanStore = usePeralatanStore()
const teknisiStore = useTeknisiStore()
const successMsg = ref('')
const showPC = ref(false)
const showTeknisiModal = ref(false)
const customSite = ref(false)
const errors = reactive({})

function onSaveTeknisi(t) {
  teknisiStore.addTeknisi(t)
  showTeknisiModal.value = false
}

const form = reactive({
  kode: '', kategori: '', site: [], customSiteName: '',
  namaAlat: '', merk: '', tipe: '', sn: '',
  jenis: '', teknisi: [], tanggalInstal: '', pengadaan: '',
  kalibrasi: '', kondisi: 'Baik', status: 'Aktif', keterangan: '',
  pc: { os: '', processor: '', ram: '', rom: '', monitor: '', office: '' }
})

import { computed, watch } from 'vue'

const availableSites = computed(() => {
  if (form.kategori && KATEGORI_SITE_MAP[form.kategori]) {
    return KATEGORI_SITE_MAP[form.kategori];
  }
  return [];
});

watch(() => form.kategori, (newVal) => {
  // Auto checklist all available sites for the selected category
  if (newVal && KATEGORI_SITE_MAP[newVal]) {
    form.site = [...KATEGORI_SITE_MAP[newVal]];
  } else {
    form.site = [];
  }
});

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.kode) errors.kode = 'Kode wajib diisi, tulis (-) jika tidak ada'
  if (!form.kategori) errors.kategori = 'Pilih kategori terlebih dahulu'
  if (form.site.length === 0 && !form.customSiteName) errors.site = 'Pilih minimal satu site atau tambah site khusus'
  if (!form.namaAlat) errors.namaAlat = 'Nama alat wajib diisi, tulis (-) jika tidak ada'
  if (!form.merk) errors.merk = 'Merek wajib diisi, tulis (-) jika tidak ada'
  if (!form.tipe) errors.tipe = 'Tipe wajib diisi, tulis (-) jika tidak ada'
  if (!form.sn) errors.sn = 'Serial number wajib diisi, tulis (-) jika tidak ada'
  return Object.keys(errors).length === 0
}

function handleSubmit() {
  if (!validate()) return
  
  // Combine checked sites and custom site if any
  let finalSites = [...form.site];
  if (customSite.value && form.customSiteName.trim()) {
    finalSites.push(form.customSiteName.trim());
  }
  
  peralatanStore.addAlat({ ...form, site: finalSites, update: new Date().toISOString().slice(0, 10) })
  successMsg.value = 'Data peralatan berhasil ditambahkan!'
  setTimeout(() => router.push('/daftar-peralatan'), 1500)
}
</script>
