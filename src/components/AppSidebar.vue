<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="sidebar-logo">
      <div class="logo-icon">🌤️</div>
      <transition name="fade">
        <div v-if="!collapsed" class="logo-text">
          <div class="logo-title">BMKG</div>
          <div class="logo-sub">Sistem Pelaporan</div>
        </div>
      </transition>
      <button class="collapse-btn" @click="collapsed = !collapsed">
        {{ collapsed ? '›' : '‹' }}
      </button>
    </div>

    <nav class="sidebar-nav">
      <router-link v-for="item in navItems" :key="item.to"
        :to="item.to" class="nav-item" :class="{ active: isActive(item.to) }">
        <span class="nav-icon">{{ item.icon }}</span>
        <transition name="fade">
          <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
        </transition>
        <transition name="fade">
          <span v-if="!collapsed && item.badge" class="nav-badge">{{ item.badge }}</span>
        </transition>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button class="nav-item logout-btn" @click="handleLogout">
        <span class="nav-icon">🚪</span>
        <transition name="fade">
          <span v-if="!collapsed" class="nav-label">Keluar</span>
        </transition>
      </button>
      <transition name="fade">
        <div v-if="!collapsed" class="sidebar-version">v1.0.0 · BMKG 2025</div>
      </transition>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const collapsed = ref(false)
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  { to: '/daftar-peralatan', icon: '🔧', label: 'Daftar Peralatan' },
  { to: '/jadwal-pemeliharaan', icon: '📅', label: 'Jadwal Pemeliharaan' },
  { to: '/pemeliharaan', icon: '🛠️', label: 'Pemeliharaan' },
  { to: '/perbaikan', icon: '🔩', label: 'Perbaikan' },
  { to: '/instalasi', icon: '📦', label: 'Instalasi' },
]

function isActive(to) {
  return route.path.startsWith(to)
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  position: sticky;
  top: 0;
  background: linear-gradient(180deg, #1a3a6e 0%, #0f2447 60%, #071830 100%);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  z-index: 100;
  overflow: hidden;
  box-shadow: 4px 0 24px rgba(0,0,0,0.18);
}
.sidebar.collapsed { width: 72px; }
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  position: relative;
}
.logo-icon { font-size: 1.8rem; flex-shrink: 0; }
.logo-text { flex: 1; min-width: 0; }
.logo-title { font-size: 1.1rem; font-weight: 800; color: #fff; letter-spacing: 0.05em; }
.logo-sub { font-size: 0.7rem; color: rgba(255,255,255,0.55); font-weight: 500; white-space: nowrap; }
.collapse-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
  margin-left: auto;
}
.collapse-btn:hover { background: rgba(255,255,255,0.25); }
.sidebar-nav { flex: 1; padding: 12px 10px; overflow-y: auto; overflow-x: hidden; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 10px;
  text-decoration: none;
  color: rgba(255,255,255,0.7);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 4px;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  border: none;
  width: 100%;
  background: none;
  font-family: 'Inter', sans-serif;
}
.nav-item:hover { background: rgba(255,255,255,0.1); color: white; }
.nav-item.active {
  background: linear-gradient(135deg, rgba(99,165,255,0.25), rgba(34,197,94,0.15));
  color: white;
  border: 1px solid rgba(99,165,255,0.3);
  font-weight: 600;
}
.nav-icon { font-size: 1.1rem; flex-shrink: 0; }
.nav-label { flex: 1; text-align: left; }
.nav-badge {
  background: #22c55e;
  color: white;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
}
.sidebar-footer {
  padding: 12px 10px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.logout-btn { color: rgba(255,100,100,0.85); }
.logout-btn:hover { background: rgba(239,68,68,0.15); color: #ff6b6b; }
.sidebar-version {
  text-align: center;
  font-size: 0.68rem;
  color: rgba(255,255,255,0.25);
  margin-top: 8px;
}
</style>
