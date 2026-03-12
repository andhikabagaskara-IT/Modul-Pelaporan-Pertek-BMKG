<template>
  <div class="modal-overlay" v-if="show" @click.self="close">
    <div class="modal-box" style="max-width: 450px">
      <div class="modal-header">
        <h3> Tambah Teknisi Baru</h3>
        <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white" @click="close">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Nama Lengkap & Gelar <span class="required">*</span></label>
          <input class="form-control" v-model="form.name" placeholder="Misal: BUDI SANTOSO, S.T." required />
        </div>
        <div class="form-group">
          <label class="form-label">Upload Foto Profil <span class="required">*</span></label>
          <div class="upload-area" :class="{'has-file': form.photoName}" @click="fileRef?.click()" @dragover.prevent @drop.prevent="onDrop">
            <input type="file" ref="fileRef" accept=".jpg,.jpeg,.png" @change="onFileChange" style="display:none" />
            <div v-if="!form.photoPreview">
               <div style="font-size:2.5rem;margin-bottom:8px">📷</div>
               <div style="font-weight:600;color:#2563eb">Klik atau Drag Foto Kemari</div>
               <div class="text-xs text-muted mt-1">Format: JPG, JPEG, PNG · Maks 2MB</div>
            </div>
            <div v-else>
               <img :src="form.photoPreview" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 8px; border: 3px solid #60a5fa" />
               <div style="font-weight:600;color:#16a34a">✅ {{ form.photoName }}</div>
               <button type="button" class="btn btn-xs btn-danger mt-1" @click.stop="clearFoto">Ganti Foto</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" @click="close">Batal</button>
        <button class="btn btn-success" @click="simpan">💾 Simpan Teknisi</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps(['show'])
const emit = defineEmits(['close', 'save'])
const fileRef = ref(null)

const form = reactive({ name: '', photoName: '', photoPreview: null })

function onFileChange(e) { handleFile(e.target.files[0]) }
function onDrop(e) { handleFile(e.dataTransfer.files[0]) }

function handleFile(file) {
  if (!file) return
  if (!['image/jpeg','image/jpg','image/png'].includes(file.type)) {
    alert('Format foto wajib JPG/PNG'); return
  }
  if (file.size > 2*1024*1024) {
    alert('Maksimal ukuran file 2MB'); return
  }
  form.photoName = file.name
  const reader = new FileReader()
  reader.onload = ev => { form.photoPreview = ev.target.result }
  reader.readAsDataURL(file)
}

function clearFoto() {
  form.photoName = ''; form.photoPreview = null;
  if(fileRef.value) fileRef.value.value = ''
}

function close() { emit('close') }
function simpan() {
  if (!form.name || !form.photoPreview) {
    alert('Nama dan foto wajib diisi!'); return
  }
  emit('save', { name: form.name.toUpperCase(), photo: form.photoPreview })
  form.name = ''; form.photoName = ''; form.photoPreview = null;
}
</script>
