<template>
  <div class="dashboard-container">
    <div class="page-header mb-4">
      <div>
        <div class="page-title"><span class="icon">📊</span> Dashboard Utama</div>
        <div class="page-subtitle">Sistem Pelaporan Peralatan Meteorologi BMKG</div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="card summary-card primary">
        <div class="card-icon">💻</div>
        <div class="card-info">
          <div class="card-title">Total Peralatan</div>
          <div class="card-value">{{ totalAlat }}</div>
        </div>
      </div>
      <div class="card summary-card success">
        <div class="card-icon">✅</div>
        <div class="card-info">
          <div class="card-title">Kondisi Baik (Aktif)</div>
          <div class="card-value">{{ totalBaik }}</div>
        </div>
      </div>
      <div class="card summary-card warning">
        <div class="card-icon">⚠️</div>
        <div class="card-info">
          <div class="card-title">Rusak Ringan</div>
          <div class="card-value">{{ totalRusakRingan }}</div>
        </div>
      </div>
      <div class="card summary-card danger">
        <div class="card-icon">❌</div>
        <div class="card-info">
          <div class="card-title">Rusak Berat</div>
          <div class="card-value">{{ totalRusakBerat }}</div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Chart: Status Peralatan -->
      <div class="card chart-card">
        <div class="card-header"><div class="section-title" style="margin:0">Kondisi Peralatan</div></div>
        <div class="card-body d-flex justify-center align-center" style="height: 300px;">
          <Doughnut v-if="chartDataStatus" :data="chartDataStatus" :options="chartOptionsDoughnut" />
        </div>
      </div>

      <!-- Chart: Rekap Bulanan Pemeliharaan -->
      <div class="card chart-card">
        <div class="card-header"><div class="section-title" style="margin:0">Kegiatan Pemeliharaan (Bulan Ini)</div></div>
        <div class="card-body d-flex justify-center align-center" style="height: 300px;">
          <Bar v-if="chartDataPemeliharaan" :data="chartDataPemeliharaan" :options="chartOptionsBar" />
        </div>
      </div>
      
       <!-- Chart: Rekap Bulanan Perbaikan & Instalasi -->
       <div class="card chart-card" style="grid-column: 1 / -1;">
        <div class="card-header"><div class="section-title" style="margin:0">Aktivitas Perbaikan & Instalasi (Tahun Ini)</div></div>
        <div class="card-body d-flex justify-center align-center" style="height: 350px;">
          <Line v-if="chartDataAktivitas" :data="chartDataAktivitas" :options="chartOptionsLine" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut, Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement
} from 'chart.js'
import { usePeralatanStore } from '../stores/peralatanStore'
import { usePemeliharaanStore } from '../stores/pemeliharaanStore'
import { usePerbaikanStore } from '../stores/perbaikanStore'
import { useInstalasiStore } from '../stores/instalasiStore'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement)

const peralatanStore = usePeralatanStore()
const pemeliharaanStore = usePemeliharaanStore()
const perbaikanStore = usePerbaikanStore()
const instalasiStore = useInstalasiStore()

// Summary stats
const totalAlat = computed(() => peralatanStore.peralatan.length)
const totalBaik = computed(() => peralatanStore.peralatan.filter(p => ['Baik', 'BAIK', 'Aktif', 'AKTIF'].includes(p.kondisi || p.status)).length)
const totalRusakRingan = computed(() => peralatanStore.peralatan.filter(p => ['Rusak Ringan'].includes(p.kondisi)).length)
const totalRusakBerat = computed(() => totalAlat.value - totalBaik.value - totalRusakRingan.value)

// Chart 1: Doughnut (Kondisi)
const chartDataStatus = computed(() => {
  return {
    labels: ['Baik', 'Rusak Ringan', 'Rusak Berat'],
    datasets: [{
      data: [totalBaik.value, totalRusakRingan.value, totalRusakBerat.value],
      backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  }
})
const chartOptionsDoughnut = { 
  responsive: true, 
  maintainAspectRatio: false, 
  plugins: { legend: { position: 'bottom' } },
  animation: { 
    duration: 2500, 
    easing: 'easeOutElastic',
    animateScale: true,
    animateRotate: true
  },
  hover: { mode: 'nearest', intersect: true, animationDuration: 400 },
  elements: { arc: { hoverOffset: 15 } }
}

// Chart 2: Bar (Pemeliharaan Per Kategori)
const chartDataPemeliharaan = computed(() => {
  const categories = {}
  pemeliharaanStore.records.forEach(p => {
    if (categories[p.alat]) categories[p.alat]++
    else categories[p.alat] = 1
  })
  
  return {
    labels: Object.keys(categories).length ? Object.keys(categories) : ['Tidak ada data'],
    datasets: [{
      label: 'Jumlah Pemeliharaan',
      data: Object.keys(categories).length ? Object.values(categories) : [0],
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1,
      borderRadius: 4,
    }]
  }
})
const chartOptionsBar = { 
  responsive: true, 
  maintainAspectRatio: false,
  animation: { 
    duration: 2000, 
    easing: 'easeOutQuart',
    y: { from: 0 }
  },
  hover: { mode: 'index', intersect: false, animationDuration: 400 }
}

// Chart 3: Line (Perbaikan & Instalasi)
const chartDataAktivitas = computed(() => {
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
    const dataPerbaikan = new Array(12).fill(0)
    const dataInstalasi = new Array(12).fill(0)

    perbaikanStore.records.forEach(p => {
        if(p.tanggalPerbaikan) {
           const d = new Date(p.tanggalPerbaikan)
           dataPerbaikan[d.getMonth()]++
        }
    })
    instalasiStore.records.forEach(p => {
        if(p.tanggalInstalasi) {
           const d = new Date(p.tanggalInstalasi)
           dataInstalasi[d.getMonth()]++
        }
    })

    return {
        labels: months,
        datasets: [
            {
                label: 'Perbaikan',
                data: dataPerbaikan,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                tension: 0.3,
                fill: true
            },
             {
                label: 'Instalasi',
                data: dataInstalasi,
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                tension: 0.3,
                fill: true
            }
        ]
    }
})
const chartOptionsLine = { 
  responsive: true, 
  maintainAspectRatio: false,
  animation: { 
    duration: 2500, 
    easing: 'easeInOutQuart',
    y: { from: 0 }
  },
  interaction: { mode: 'index', intersect: false },
  hover: { mode: 'index', intersect: false, animationDuration: 400 },
  elements: { point: { hoverRadius: 8, hitRadius: 10 } }
}

</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-left: 4px solid transparent;
  transition: transform 0.2s;
}
.summary-card:hover { transform: translateY(-3px); }

.summary-card.primary { border-left-color: #3b82f6; }
.summary-card.success { border-left-color: #22c55e; }
.summary-card.warning { border-left-color: #f59e0b; }
.summary-card.danger { border-left-color: #ef4444; }

.card-icon {
  font-size: 2.5rem;
  background: rgba(0,0,0,0.03);
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.card-info { flex: 1; }
.card-title { font-size: 0.85rem; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
.card-value { font-size: 1.8rem; font-weight: 800; color: #1e293b; line-height: 1; }

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-card {
  display: flex;
  flex-direction: column;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s ease;
  transform-origin: center;
}
.chart-card:hover {
  transform: translateY(-8px) scale(1.02) perspective(1000px) rotateX(2deg) rotateY(-2deg);
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  z-index: 10;
}
</style>
