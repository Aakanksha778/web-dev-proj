<template>
  <section class="auth-page auth-page--signin">
    <div class="auth-shell auth-shell--enhanced">
      <div class="auth-showcase">
        <div class="auth-showcase-inner auth-fade-up">
          <div class="auth-brand-row">
            <div class="auth-logo-wrap">
              <img :src="logo" alt="CentSora logo" class="auth-logo" />
            </div>

            <div>
              <p class="auth-kicker">Welcome back</p>
              <h1 class="auth-brand-title">CentSora</h1>
            </div>
          </div>

          <div class="auth-copy-block">
            <p class="auth-eyebrow">Budget with intention</p>

            <h2 class="auth-showcase-title auth-showcase-title--dynamic">
              Track spending,
              <span class="auth-typed-line">
                {{ typedText }}<span class="auth-caret"></span>
              </span>
              and grow your goals.
            </h2>

            <p class="auth-showcase-subtitle">
              A cleaner money dashboard for students, families, and anyone trying to budget
              with more clarity.
            </p>

            <div class="auth-trust-row">
              <span>Secure sign in</span>
              <span>Clean dashboard</span>
              <span>Focused budgeting</span>
            </div>
          </div>

          <div class="auth-benefits">
            <div class="auth-benefit-card auth-benefit-card--delay-1">
              <div class="auth-benefit-icon-wrap">
                <span class="auth-benefit-icon">📈</span>
              </div>
              <div>
                <h3>Real visibility</h3>
                <p>See how your spending changes over time.</p>
              </div>
            </div>

            <div class="auth-benefit-card auth-benefit-card--delay-2">
              <div class="auth-benefit-icon-wrap">
                <span class="auth-benefit-icon">🎯</span>
              </div>
              <div>
                <h3>Goal progress</h3>
                <p>Stay motivated with clear savings milestones.</p>
              </div>
            </div>

            <div class="auth-benefit-card auth-benefit-card--delay-3">
              <div class="auth-benefit-icon-wrap">
                <span class="auth-benefit-icon">🧾</span>
              </div>
              <div>
                <h3>Simple tracking</h3>
                <p>Keep budgets and transactions in one place.</p>
              </div>
            </div>
          </div>

          <div class="auth-floating-card">
            <p class="auth-floating-label">CentSora</p>
            <strong>Designed for calm, everyday money management.</strong>
          </div>
        </div>
      </div>

      <div class="auth-form-panel">
        <div class="auth-form-card auth-fade-up auth-fade-up--delay">
          <p class="auth-form-kicker">Sign in</p>
          <h2 class="auth-form-title">Access your dashboard</h2>
          <p class="auth-form-subtitle">
            Pick up where you left off and stay on top of your money.
          </p>

          <div v-if="error" class="alert alert-danger py-2 auth-alert" role="alert">
            {{ error }}
          </div>

          <form class="auth-form" @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input
                v-model="form.email"
                type="email"
                class="form-control auth-input"
                placeholder="name@example.com"
                required
                autocomplete="email"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <div class="password-field auth-password-field">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control password-input auth-input"
                  placeholder="Enter your password"
                  required
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="password-toggle-btn auth-password-toggle"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                >
                  {{ showPassword ? 'Hide' : 'Show' }}
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

          <p class="auth-form-note">
            Simple, secure access to your budgeting workspace.
          </p>

          <div class="text-center muted mt-4 auth-switch-copy">
            New here? <router-link to="/register">Create an account</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
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

const words = ['protect your budget', 'build more clarity', 'save with intention']
const typedText = ref('')
const wordIndex = ref(0)
const isDeleting = ref(false)
let typingTimer = null

function runTypingAnimation() {
  const currentWord = words[wordIndex.value]

  if (!isDeleting.value) {
    typedText.value = currentWord.slice(0, typedText.value.length + 1)
  } else {
    typedText.value = currentWord.slice(0, typedText.value.length - 1)
  }

  let delay = isDeleting.value ? 55 : 95

  if (!isDeleting.value && typedText.value === currentWord) {
    delay = 1400
    isDeleting.value = true
  } else if (isDeleting.value && typedText.value === '') {
    isDeleting.value = false
    wordIndex.value = (wordIndex.value + 1) % words.length
    delay = 260
  }

  typingTimer = window.setTimeout(runTypingAnimation, delay)
}

onMounted(() => {
  runTypingAnimation()
})

onBeforeUnmount(() => {
  if (typingTimer) {
    clearTimeout(typingTimer)
  }
})

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