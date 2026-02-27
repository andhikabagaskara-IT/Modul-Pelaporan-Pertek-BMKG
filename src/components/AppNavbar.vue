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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const menuOpen = ref(false)
const menuRef = ref(null)

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

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function handleClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) menuOpen.value = false
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
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
.header-date { font-size: 0.78rem; color: #64748b; background: #f0f7ff; padding: 6px 12px; border-radius: 20px; }
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
