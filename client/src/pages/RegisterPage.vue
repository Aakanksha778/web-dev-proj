<template>
  <section class="auth-page">
    <div class="auth-shell">
      <div class="auth-showcase">
        <div class="auth-brand-row">
          <img :src="logo" alt="CentSora logo" class="auth-logo" />
          <div>
            <p class="auth-kicker">Create your account</p>
            <h1>CentSora</h1>
          </div>
        </div>

        <h2 class="auth-showcase-title">
          Build better money habits with a dashboard made for real life.
        </h2>

        <p class="auth-showcase-subtitle">
          Start tracking budgets, organizing transactions, and growing your savings goals
          with a cleaner and more motivating financial experience.
        </p>

        <div class="auth-benefits">
          <div class="auth-benefit-card">
            <span>💰</span>
            <div>
              <h3>Stronger budgeting</h3>
              <p>Set practical limits and stay aware of what you have left.</p>
            </div>
          </div>

          <div class="auth-benefit-card">
            <span>📊</span>
            <div>
              <h3>Clearer visibility</h3>
              <p>See your balances, spending, and progress in one organized place.</p>
            </div>
          </div>

          <div class="auth-benefit-card">
            <span>🌱</span>
            <div>
              <h3>Growth-focused goals</h3>
              <p>Stay consistent with savings targets that feel motivating, not overwhelming.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="auth-form-panel">
        <div class="auth-form-card">
          <p class="auth-form-kicker">Register</p>
          <h2 class="auth-form-title">Create your CentSora account</h2>
          <p class="auth-form-subtitle">
            A secure, simple place to manage money and move toward your goals.
          </p>

          <div v-if="error" class="alert alert-danger py-2" role="alert">
            {{ error }}
          </div>

          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label class="form-label">Full name</label>
              <input
                v-model="form.name"
                type="text"
                class="form-control"
                placeholder="Jane Doe"
                required
                autocomplete="name"
              />
            </div>

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
                  placeholder="Create password (min. 8 characters)"
                  required
                  minlength="8"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 auth-submit-btn"
              :disabled="loading"
            >
              {{ loading ? 'Creating account…' : 'Create Account' }}
            </button>
          </form>

          <div class="text-center muted mt-4">
            Already have an account? <router-link to="/login">Sign in</router-link>
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

const form = ref({ name: '', email: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await api.post('/auth/register', form.value)
    await checkAuth()
    router.push('/welcome')
  } catch (err) {
    error.value = err.response?.data?.error
      || err.response?.data?.errors?.[0]?.msg
      || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
