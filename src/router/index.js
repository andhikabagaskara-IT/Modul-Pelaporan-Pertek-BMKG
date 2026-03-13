import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes = [
  { path: '/', name: 'Dashboard', component: () => import('../views/DashboardView.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/LoginView.vue'), meta: { public: true } },
  { path: '/daftar-peralatan', name: 'DaftarPeralatan', component: () => import('../views/DaftarPeralatanView.vue') },
  { path: '/daftar-peralatan/tambah', name: 'TambahAlat', component: () => import('../views/TambahAlatView.vue') },
  { path: '/daftar-peralatan/update-kondisi', name: 'UpdateKondisi', component: () => import('../views/UpdateKondisiView.vue') },
  { path: '/jadwal-pemeliharaan', name: 'JadwalPemeliharaan', component: () => import('../views/JadwalPemeliharaanView.vue') },
  { path: '/pemeliharaan', name: 'Pemeliharaan', component: () => import('../views/PemeliharaanView.vue') },
  { path: '/pemeliharaan/input', name: 'InputPemeliharaan', component: () => import('../views/InputPemeliharaanView.vue') },
  { path: '/perbaikan', name: 'Perbaikan', component: () => import('../views/PerbaikanView.vue') },
  { path: '/perbaikan/input', name: 'InputPerbaikan', component: () => import('../views/InputPerbaikanView.vue') },
  { path: '/instalasi', name: 'Instalasi', component: () => import('../views/InstalasiView.vue') },
  { path: '/instalasi/input', name: 'InputInstalasi', component: () => import('../views/InputInstalasiView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isLoggedIn) {
    return { name: 'Login' }
  }
  if (to.name === 'Login' && auth.isLoggedIn) {
    return { name: 'Dashboard' }
  }
})

export default router
