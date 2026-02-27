import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useJadwalStore = defineStore('jadwal', () => {
  // keyCodes per date string 'YYYY-MM-DD'
  const schedules = ref({
    '2024-06-03': ['RC', 'AD'],
    '2024-06-05': ['AD', 'UP'],
    '2024-06-10': ['LL', 'DC'],
    '2024-06-12': ['UA', 'AO'],
    '2024-06-17': ['TU', 'DI'],
    '2024-06-19': ['OB', 'PT'],
    '2024-06-24': ['AE', 'FC'],
    '2024-06-26': ['JK'],
  })

  function addCode(dateStr, kode) {
    if (!schedules.value[dateStr]) schedules.value[dateStr] = []
    if (!schedules.value[dateStr].includes(kode)) schedules.value[dateStr].push(kode)
  }

  function removeCode(dateStr, kode) {
    if (schedules.value[dateStr]) {
      schedules.value[dateStr] = schedules.value[dateStr].filter(k => k !== kode)
    }
  }

  function getForDate(dateStr) {
    return schedules.value[dateStr] || []
  }

  return { schedules, addCode, removeCode, getForDate }
})
