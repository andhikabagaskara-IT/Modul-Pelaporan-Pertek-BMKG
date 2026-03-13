<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="sidebar-logo">
      <img src="../assets/img/bmkg.png" alt="BMKG Logo" class="img-logo" />
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
        :to="item.to" class="nav-item" :class="{ 'active': isActive(item.to) && item.to !== '/', 'dashboard-active': item.to === '/' && route.path === '/' }">
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
  { to: '/', icon: '📊', label: 'Dashboard' },
  { to: '/daftar-peralatan', icon: '🔧', label: 'Daftar Peralatan' },
  { to: '/jadwal-pemeliharaan', icon: '📅', label: 'Jadwal Pemeliharaan' },
  { to: '/pemeliharaan', icon: '🛠️', label: 'Pemeliharaan' },
  { to: '/perbaikan', icon: '🔩', label: 'Perbaikan' },
  { to: '/instalasi', icon: '📦', label: 'Instalasi' },
]

function isActive(to) {
  if (to === '/') return false; // Handled separately
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
  background: linear-gradient(180deg, rgba(26,58,110,0.75) 0%, rgba(15,36,71,0.85) 60%, rgba(7,24,48,0.9) 100%);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  overflow: hidden;
  box-shadow: 4px 0 30px rgba(0,0,0,0.3);
  border-right: 1px solid rgba(255,255,255,0.05);
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
}
.sidebar::after {
  content: '';
  position: absolute;
  top: -50%; left: -50%; width: 200%; height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
  animation: sweep 15s infinite linear;
}
@keyframes sweep {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.sidebar::before {
  content: '';
  position: absolute;
  top: 0; left: -100%; width: 50%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.06), transparent);
  transform: skewX(-20deg);
  animation: luxShimmer 8s infinite cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
@keyframes luxShimmer {
  0% { left: -100%; }
  25% { left: 200%; }
  100% { left: 200%; }
}
.sidebar.collapsed { width: 72px; }
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  position: relative;
}
.img-logo {
  width: 40px;
  height: auto;
  flex-shrink: 0;
  border-radius: 8px;
}
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
  border-radius: 12px;
  text-decoration: none;
  color: rgba(255,255,255,0.7);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 6px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid transparent;
  width: 100%;
  background: none;
  font-family: 'Inter', sans-serif;
  position: relative;
}
.nav-item:hover { 
  background: rgba(255,255,255,0.1); 
  color: white; 
  transform: translateX(4px) scale(1.02);
  border-color: rgba(255,255,255,0.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.nav-item.active {
  background: linear-gradient(135deg, rgba(99,165,255,0.25), rgba(34,197,94,0.15));
  color: white;
  border: 1px solid rgba(99,165,255,0.3);
  font-weight: 600;
}
.nav-item.dashboard-active {
  background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
  color: white;
  border: 1px solid #6ee7b7;
  font-weight: 800;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4), inset 0 2px 4px rgba(255,255,255,0.2);
  transform: scale(1.05);
  animation: pulse-border 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
}
.nav-item.dashboard-active:hover {
  transform: scale(1.08) translateX(2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.6), inset 0 2px 4px rgba(255,255,255,0.4);
  filter: brightness(1.1);
}
@keyframes pulse-border {
  0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.5); }
  70% { box-shadow: 0 0 0 8px rgba(52, 211, 153, 0); }
  100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
}
.nav-icon { font-size: 1.1rem; flex-shrink: 0; }
.nav-label { flex: 1; text-align: left; }
.logout-btn .nav-label { flex: none; width: 100%; text-align: center; }
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
.logout-btn { 
  color: rgba(255, 255, 255, 0.8); 
  background: rgba(239, 68, 68, 0.15); 
  border: 1px solid rgba(239, 68, 68, 0.2); 
  justify-content: center;
  text-align: center;
}
.logout-btn:hover { 
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
  color: white; 
  border-color: #f87171;
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.5);
  transform: scale(1.03);
}
.sidebar-version {
  text-align: center;
  font-size: 0.68rem;
  color: rgba(255,255,255,0.25);
  margin-top: 8px;
}
</style>
