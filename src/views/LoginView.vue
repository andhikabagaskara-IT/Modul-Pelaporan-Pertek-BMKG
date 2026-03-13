<template>
  <div class="login-bg">
    <!-- Background animated blobs -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>

    <div class="login-container">
      <!-- Left Panel: Pimpinan Photo + Info -->
      <div class="login-left">
        <div class="leader-card">
          <div class="leader-photo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
              alt="Foto Pimpinan" />
          </div>
          <div class="leader-info">
            <h3>Unit Supporting Engineering</h3>
            <h2>M. ANWAR SYAEFUDIN, S.T., M.Kom</h2>
            <p>BMKG Stamet Juanda Kelas I</p>
          </div>
          <div class="bmkg-tagline">
            "Meteorologi, Klimatologi, dan Geofisika<br/>untuk Negeri"
          </div>
          <div class="dots-decoration">
            <span v-for="i in 12" :key="i" class="dot"></span>
          </div>
        </div>
      </div>

      <!-- Right Panel: Login Form -->
      <div class="login-right">
        <div class="login-card">
          <div class="login-logo">
            <div class="logo-circle">🌤️</div>
            <div>
              <div class="login-title">BMKG</div>
              <div class="login-subtitle">Sistem Pelaporan Peralatan</div>
            </div>
          </div>

          <h2 class="form-heading">Selamat Datang!</h2>
          <p class="form-desc">Masuk untuk melanjutkan ke sistem pelaporan</p>

          <div v-if="errorMsg" class="alert alert-danger">⚠️ {{ errorMsg }}</div>

          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label class="form-label">Email / Username</label>
              <div class="input-icon-wrap">
                <span class="input-icon">✉️</span>
                <input v-model="email" type="email" class="form-control with-icon"
                  placeholder="email@bmkg.go.id" required autocomplete="email" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-icon-wrap">
                <span class="input-icon">🔒</span>
                <input v-model="password" :type="showPass ? 'text' : 'password'"
                  class="form-control with-icon" placeholder="Masukkan password" required />
                <button type="button" class="toggle-pass" @click="showPass = !showPass">
                  {{ showPass ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <div class="login-options">
              <label class="remember-me">
                <input type="checkbox" v-model="rememberMe" />
                <span>Ingat saya</span>
              </label>
              <a href="#" class="forgot-pass" @click.prevent="showForgot = true">Lupa password?</a>
            </div>

            <button type="submit" class="btn btn-primary login-btn" :disabled="loading">
              <span v-if="loading">⏳ Memuat...</span>
              <span v-else>🔐 Masuk</span>
            </button>
          </form>

          <div class="login-footer">
            <p>© 2025 BMKG · Stasiun Meteorologi</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div class="modal-overlay" v-if="showForgot" @click.self="showForgot = false">
      <div class="modal-box" style="max-width:420px">
        <div class="modal-header">
          <h3>🔑 Lupa Password</h3>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white" @click="showForgot=false">✕</button>
        </div>
        <div class="modal-body">
          <p class="text-sm text-muted mb-2">Masukkan email terdaftar Anda. Kami akan mengirim instruksi reset password.</p>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" placeholder="email@bmkg.go.id" v-model="forgotEmail" />
          </div>
          <div class="alert alert-success" v-if="forgotSent">
            ✅ Instruksi reset password telah dikirim ke email Anda.
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showForgot=false">Batal</button>
          <button class="btn btn-primary" @click="sendForgot">Kirim</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPass = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const showForgot = ref(false)
const forgotEmail = ref('')
const forgotSent = ref(false)

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''
  await new Promise(r => setTimeout(r, 700))
  const ok = authStore.login(email.value, password.value)
  if (ok) {
    router.push('/')
  } else {
    errorMsg.value = 'Email atau password salah. Coba lagi.'
  }
  loading.value = false
}

function sendForgot() {
  if (forgotEmail.value) forgotSent.value = true
}
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f2447 0%, #1a3a6e 40%, #1a5c2e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;
}
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.18;
  animation: blobFloat 8s ease-in-out infinite;
}
.blob-1 { width: 480px; height: 480px; background: #3b82f6; top: -100px; left: -100px; animation-delay: 0s; }
.blob-2 { width: 360px; height: 360px; background: #22c55e; bottom: -80px; right: -80px; animation-delay: 3s; }
.blob-3 { width: 280px; height: 280px; background: #60a5fa; top: 50%; left: 50%; animation-delay: 5s; }
@keyframes blobFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.08); }
}
.login-container {
  display: flex;
  max-width: 900px;
  width: 100%;
  gap: 0;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0,0,0,0.4);
  position: relative;
  z-index: 1;
}
/* LEFT */
.login-left {
  width: 340px;
  flex-shrink: 0;
  background: linear-gradient(160deg, #16a34a, #15803d, #0f2447);
  padding: 40px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.leader-card { text-align: center; color: white; position: relative; }
.leader-photo {
  width: 120px; height: 120px; border-radius: 50%;
  overflow: hidden; margin: 0 auto 20px;
  border: 4px solid rgba(255,255,255,0.4);
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
}
.leader-photo img { width: 100%; height: 100%; object-fit: cover; }
.leader-info h3 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.6); margin-bottom: 6px; }
.leader-info h2 { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
.leader-info p { font-size: 0.8rem; color: rgba(255,255,255,0.7); }
.bmkg-tagline {
  margin-top: 24px; font-size: 0.78rem; color: rgba(255,255,255,0.55);
  font-style: italic; line-height: 1.6;
  padding: 14px; background: rgba(255,255,255,0.08); border-radius: 10px;
}
.dots-decoration { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 20px; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.25); }
/* RIGHT */
.login-right { flex: 1; background: white; padding: 48px 40px; display: flex; align-items: center; }
.login-card { width: 100%; }
.login-logo { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
.logo-circle {
  width: 52px; height: 52px; border-radius: 14px;
  background: linear-gradient(135deg, #2563eb, #16a34a);
  display: flex; align-items: center; justify-content: center; font-size: 1.6rem;
}
.login-title { font-size: 1.4rem; font-weight: 800; color: #1e3a8a; line-height: 1; }
.login-subtitle { font-size: 0.72rem; color: #64748b; font-weight: 500; }
.form-heading { font-size: 1.3rem; font-weight: 800; color: #1e293b; margin-bottom: 4px; }
.form-desc { font-size: 0.875rem; color: #64748b; margin-bottom: 24px; }
.input-icon-wrap { position: relative; }
.input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 1rem; pointer-events: none; }
.form-control.with-icon { padding-left: 40px; }
.toggle-pass {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0;
}
.login-options { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.remember-me { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: #475569; cursor: pointer; }
.remember-me input { accent-color: #2563eb; width: 15px; height: 15px; }
.forgot-pass { font-size: 0.875rem; color: #2563eb; text-decoration: none; font-weight: 600; }
.forgot-pass:hover { color: #1d4ed8; text-decoration: underline; }
.login-btn { width: 100%; justify-content: center; padding: 12px; font-size: 0.95rem; border-radius: 10px; }
.login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.login-footer { text-align: center; margin-top: 28px; font-size: 0.75rem; color: #94a3b8; }
@media (max-width: 700px) {
  .login-left { display: none; }
  .login-right { padding: 32px 24px; }
}
</style>