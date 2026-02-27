import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(localStorage.getItem('bmkg_logged_in') === 'true')
  const currentUser = ref(JSON.parse(localStorage.getItem('bmkg_user') || 'null'))

  function login(email, password) {
    // Simple demo login
    if (email && password) {
      isLoggedIn.value = true
      currentUser.value = { email, name: 'User BMKG' }
      localStorage.setItem('bmkg_logged_in', 'true')
      localStorage.setItem('bmkg_user', JSON.stringify(currentUser.value))
      return true
    }
    return false
  }

  function logout() {
    isLoggedIn.value = false
    currentUser.value = null
    localStorage.removeItem('bmkg_logged_in')
    localStorage.removeItem('bmkg_user')
  }

  return { isLoggedIn, currentUser, login, logout }
})
