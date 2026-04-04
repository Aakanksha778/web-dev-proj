<template>
  <section class="auth-page">
    <div class="auth-shell">
      <div class="auth-showcase">
        <div class="auth-brand-row">
          <img :src="logo" alt="CentSora logo" class="auth-logo" />
          <div>
            <p class="auth-kicker">Welcome back</p>
            <h1>CentSora</h1>
          </div>
        </div>

        <h2 class="auth-showcase-title">
          Track spending, protect your budget, and grow your goals.
        </h2>

        <p class="auth-showcase-subtitle">
          A cleaner money dashboard for students, families, and anyone trying to budget with more clarity.
        </p>

        <div class="auth-benefits">
          <div class="auth-benefit-card">
            <span>📈</span>
            <div>
              <h3>Real visibility</h3>
              <p>See how your spending changes over time.</p>
            </div>
          </div>

          <div class="auth-benefit-card">
            <span>🎯</span>
            <div>
              <h3>Goal progress</h3>
              <p>Stay motivated with clear savings milestones.</p>
            </div>
          </div>

          <div class="auth-benefit-card">
            <span>🧾</span>
            <div>
              <h3>Simple tracking</h3>
              <p>Keep budgets and transactions in one place.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="auth-form-panel">
        <div class="auth-form-card">
          <p class="auth-form-kicker">Sign in</p>
          <h2 class="auth-form-title">Access your dashboard</h2>
          <p class="auth-form-subtitle">
            Pick up where you left off and stay on top of your money.
          </p>

          <div v-if="error" class="alert alert-danger py-2" role="alert">
            {{ error }}
          </div>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input
                v-model="form.email"
                type="email"
                class="form-control"
                placeholder="name@example.com"
                required
                autocomplete="email"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <div class="input-group">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="••••••••"
                  required
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                >{{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 auth-submit-btn"
              :disabled="loading"
            >
              {{ loading ? 'Signing in…' : 'Sign In' }}
            </button>
          </form>

          <div class="text-center muted mt-4">
            New here? <router-link to="/register">Create an account</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logo from '../assets/pictures/logo.png'
import api from '../services/api'
import { useAuth } from '../stores/auth'

const router = useRouter()
const { checkAuth } = useAuth()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await api.post('/auth/login', form.value)
    await checkAuth()
    router.push('/welcome')
  } catch (err) {
    error.value = err.response?.data?.error || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
