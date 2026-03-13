<template>
  <header class="app-header">
    <div class="header-left">
      <div class="breadcrumb">
        <span class="breadcrumb-home">🏠</span>
        <span class="breadcrumb-sep">›</span>
        <span class="breadcrumb-current">{{ pageTitle }}</span>
      </div>
    </div>
    <div class="header-right">
      <!-- Weather Widget -->
      <div v-if="weather.loading" class="weather-widget loading">
        <span class="spinner">↻</span> Memuat cuaca...
      </div>
      <div v-else-if="weather.error" class="weather-widget error" :title="weather.error">
        ⚠️ Info Cuaca Gagal
      </div>
      <div v-else-if="weather.temp !== null" class="weather-widget">
        <span class="weather-icon">{{ weather.icon }}</span>
        <div class="weather-info">
          <span class="weather-temp">{{ weather.temp }}°C</span>
          <span class="weather-desc">{{ weather.desc }}</span>
        </div>
      </div>

      <div class="header-date">📅 {{ currentDate }}</div>
      <div class="user-menu" @click="menuOpen = !menuOpen" ref="menuRef">
        <div class="user-avatar">{{ userInitial }}</div>
        <div class="user-info">
          <div class="user-name">{{ authStore.currentUser?.name || 'User' }}</div>
          <div class="user-role">Teknisi BMKG</div>
        </div>
        <span class="chevron" :class="{ open: menuOpen }">▾</span>
        <div class="dropdown-menu" v-if="menuOpen">
          <div class="dropdown-item" @click="handleLogout">🚪 Keluar</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import axios from 'axios'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const menuOpen = ref(false)
const menuRef = ref(null)
let weatherInterval = null

const PAGE_TITLES = {
  '/daftar-peralatan': 'Daftar Peralatan',
  '/daftar-peralatan/tambah': 'Tambah Data Alat',
  '/daftar-peralatan/update-kondisi': 'Update Kondisi Alat',
  '/jadwal-pemeliharaan': 'Jadwal Pemeliharaan',
  '/pemeliharaan': 'Pemeliharaan',
  '/pemeliharaan/input': 'Input Pemeliharaan',
  '/perbaikan': 'Perbaikan',
  '/perbaikan/input': 'Input Perbaikan',
  '/instalasi': 'Instalasi',
  '/instalasi/input': 'Input Instalasi',
}

const pageTitle = computed(() => PAGE_TITLES[route.path] || 'Dashboard')

const currentDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

const userInitial = computed(() => {
  const name = authStore.currentUser?.name || 'U'
  return name.charAt(0).toUpperCase()
})

const weather = reactive({
  loading: true,
  error: null,
  temp: null,
  desc: '',
  icon: '☁️'
})

// WMO Weather interpretation codes (Open-Meteo)
function getWeatherIconAndDesc(code) {
  if (code === 0) return { icon: '☀️', desc: 'Cerah' }
  if (code === 1 || code === 2 || code === 3) return { icon: '🌤️', desc: 'Berawan' }
  if (code === 45 || code === 48) return { icon: '🌫️', desc: 'Berkabut' }
  if (code >= 51 && code <= 67) return { icon: '🌧️', desc: 'Hujan' }
  if (code >= 71 && code <= 77) return { icon: '❄️', desc: 'Salju' }
  if (code >= 80 && code <= 82) return { icon: '🌦️', desc: 'Hujan Deras' }
  if (code >= 95 && code <= 99) return { icon: '⛈️', desc: 'Badai Petir' }
  return { icon: '☁️', desc: 'Berawan' }
}

async function fetchWeather(lat, lon) {
  try {
    const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    if (res.data && res.data.current_weather) {
      const cw = res.data.current_weather
      weather.temp = cw.temperature
      const { icon, desc } = getWeatherIconAndDesc(cw.weathercode)
      weather.icon = icon
      weather.desc = desc
    }
    weather.loading = false
  } catch (err) {
    weather.error = 'Gagal mengambil data'
    weather.loading = false
  }
}

function initWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => { fetchWeather(position.coords.latitude, position.coords.longitude) },
      (error) => {
        weather.error = 'Izin lokasi ditolak'
        weather.loading = false
      }
    )
  } else {
    weather.error = 'Geolocation tidak didukung'
    weather.loading = false
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function handleClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) menuOpen.value = false
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  initWeather()
  weatherInterval = setInterval(initWeather, 60000) // 1 minute auto-refresh
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (weatherInterval) clearInterval(weatherInterval)
})
</script>

<style scoped>
.app-header {
  height: 65px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(99,165,255,0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 2px 12px rgba(30,64,175,0.07);
}
.breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; }
.breadcrumb-home { font-size: 1rem; }
.breadcrumb-sep { color: #94a3b8; }
.breadcrumb-current { font-weight: 700; color: #1e3a8a; }
.header-right { display: flex; align-items: center; gap: 20px; }
.header-date { font-size: 0.78rem; color: #64748b; background: #f0f7ff; padding: 6px 12px; border-radius: 20px; font-weight: 500;}

/* Weather Widget */
.weather-widget {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid #bbf7d0;
  box-shadow: 0 2px 8px rgba(34,197,94,0.1);
}
.weather-widget.loading { background: #f8fafc; border-color: #e2e8f0; color: #64748b; font-size: 0.75rem;}
.weather-widget.error { background: #fef2f2; border-color: #fca5a5; color: #ef4444; font-size: 0.75rem; cursor: help;}
.weather-icon { font-size: 1.1rem; }
.weather-info { display: flex; flex-direction: column; align-items: flex-start; line-height: 1.1; }
.weather-temp { font-size: 0.8rem; font-weight: 700; color: #166534; }
.weather-desc { font-size: 0.65rem; color: #15803d; font-weight: 500; text-transform: capitalize; }

.spinner { display: inline-block; animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

.user-menu {
  display: flex; align-items: center; gap: 10px;
  cursor: pointer; position: relative; padding: 6px 10px;
  border-radius: 30px; transition: background 0.2s;
}
.user-menu:hover { background: #f0f7ff; }
.user-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #16a34a);
  color: white; font-weight: 700; font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center;
}
.user-name { font-size: 0.85rem; font-weight: 600; color: #1e3a8a; line-height: 1.2; }
.user-role { font-size: 0.7rem; color: #64748b; }
.chevron { font-size: 0.75rem; color: #64748b; transition: transform 0.2s; }
.chevron.open { transform: rotate(180deg); }
.dropdown-menu {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: white; border: 1px solid #e2e8f0;
  border-radius: 10px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  min-width: 160px; overflow: hidden; z-index: 200;
}
.dropdown-item {
  padding: 11px 16px; font-size: 0.875rem; color: #ef4444;
  transition: background 0.15s; cursor: pointer; font-weight: 500;
}
.dropdown-item:hover { background: #fef2f2; }
</style>
