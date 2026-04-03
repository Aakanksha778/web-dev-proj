import { ref } from 'vue'
import api from '../services/api'

const user = ref(null)
const checked = ref(false)

async function checkAuth() {
  try {
    const res = await api.get('/auth/me')
    user.value = res.data.data.user
  } catch {
    user.value = null
  } finally {
    checked.value = true
  }
}

async function logout() {
  try {
    await api.post('/auth/logout')
  } finally {
    user.value = null
  }
}

export function useAuth() {
  return { user, checked, checkAuth, logout }
}
