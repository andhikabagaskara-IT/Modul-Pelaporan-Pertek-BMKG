<template>
  <div>
    <div class="page-header">
      <div class="page-title"><span class="icon">📅</span> Jadwal Pemeliharaan</div>
      <div class="page-subtitle">Kalender jadwal pemeliharaan peralatan BMKG</div>
    </div>

    <!-- Kalender Nav -->
    <div class="card mb-3">
      <div class="card-body" style="padding:16px 20px">
        <div class="d-flex align-center gap-2" style="flex-wrap:wrap;justify-content:space-between">
          <div class="d-flex align-center gap-2">
            <button class="btn btn-outline btn-sm" @click="prevMonth">◀ Prev</button>
            <div style="display:flex;gap:8px">
              <select class="form-control" style="width:140px" v-model="currentMonth">
                <option v-for="(m,i) in MONTHS" :key="i" :value="i">{{ m }}</option>
              </select>
              <input class="form-control" style="width:90px" type="number" v-model.number="currentYear" min="2000" max="2100" />
            </div>
            <button class="btn btn-outline btn-sm" @click="nextMonth">Next ▶</button>
          </div>
          <button class="btn btn-primary btn-sm" @click="showAddModal = true">➕ Tambah Jadwal</button>
        </div>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="card mb-3">
      <div class="card-header">
        <div class="section-title" style="margin:0">📆 {{ MONTHS[currentMonth] }} {{ currentYear }}</div>
      </div>
      <div class="card-body">
        <div class="calendar-wrapper" style="overflow-x: auto; padding-bottom: 8px;">
          <div style="min-width: 600px;">
            <!-- Day Headers -->
            <div class="calendar-grid" style="margin-bottom:6px">
              <div class="cal-day-header" v-for="d in DAYS_SHORT" :key="d">{{ d }}</div>
            </div>
            <!-- Day Cells -->
            <div class="calendar-grid">
              <div v-for="(cell, i) in calendarCells" :key="i"
                class="cal-day" :class="{today: cell.isToday, 'other-month': !cell.currentMonth}">
                <div class="cal-date">{{ cell.day }}</div>
                <div style="display:flex;flex-wrap:wrap;gap:2px;margin-top:2px">
                  <span v-for="kode in cell.codes" :key="kode" class="badge-kode" :title="getKodeLabel(kode)">{{ kode }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="card">
      <div class="card-header"><div class="section-title" style="margin:0">📌 Keterangan Kode Dinas</div></div>
      <div class="card-body" style="padding:16px">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:8px">
          <div v-for="k in KODE_DINAS" :key="k.kode" class="kode-row">
            <span class="badge-kode">{{ k.kode }}</span>
            <span class="kode-desc">{{ k.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Schedule Modal -->
    <div class="modal-overlay" v-if="showAddModal" @click.self="showAddModal=false">
      <div class="modal-box" style="max-width:460px">
        <div class="modal-header">
          <h3>➕ Tambah Jadwal</h3>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white" @click="showAddModal=false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Tanggal</label>
            <input type="date" class="form-control" v-model="newSchedule.date" />
          </div>
          <div class="form-group">
            <label class="form-label">Kode Dinas</label>
            <div class="check-group">
              <label class="check-item" :class="{selected: newSchedule.codes.includes(k.kode)}" v-for="k in KODE_DINAS" :key="k.kode">
                <input type="checkbox" :value="k.kode" v-model="newSchedule.codes" />
                {{ k.kode }}
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showAddModal=false">Batal</button>
          <button class="btn btn-primary" @click="saveSchedule">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useJadwalStore } from '../stores/jadwalStore'
import { MONTHS, DAYS_SHORT, KODE_DINAS } from '../data/masterData'

const jadwalStore = useJadwalStore()
const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())
const showAddModal = ref(false)
const newSchedule = reactive({ date: '', codes: [] })

function prevMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
}
function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
}

const calendarCells = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  const cells = []

  // Prev month padding
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const m = month === 0 ? 11 : month - 1
    const y = month === 0 ? year - 1 : year
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    cells.push({ day, currentMonth: false, isToday: false, codes: jadwalStore.getForDate(dateStr), dateStr })
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    cells.push({ day: d, currentMonth: true, isToday, codes: jadwalStore.getForDate(dateStr), dateStr })
  }
  // Next month padding
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 0 : month + 1
    const y = month === 11 ? year + 1 : year
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, currentMonth: false, isToday: false, codes: jadwalStore.getForDate(dateStr), dateStr })
  }
  return cells
})

function getKodeLabel(kode) {
  return KODE_DINAS.find(k => k.kode === kode)?.label || kode
}

function saveSchedule() {
  if (!newSchedule.date || newSchedule.codes.length === 0) return
  newSchedule.codes.forEach(k => jadwalStore.addCode(newSchedule.date, k))
  showAddModal.value = false
  newSchedule.date = ''; newSchedule.codes = []
}
</script>

<style scoped>
.kode-row {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 8px 12px; background: #f8fafc; border-radius: 8px;
  border: 1px solid #e2e8f0;
}
.kode-desc { font-size: 0.8rem; color: #475569; line-height: 1.4; }
</style>
