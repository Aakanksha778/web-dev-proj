<template>
  <section class="auth-page auth-page--register">
    <div class="auth-shell auth-shell--enhanced">
      <div class="auth-showcase">
        <div class="auth-showcase-inner auth-fade-up">
          <div class="auth-brand-row">
            <div class="auth-logo-wrap">
              <img :src="logo" alt="CentSora logo" class="auth-logo" />
            </div>

            <div>
              <p class="auth-kicker">Create your account</p>
              <h1 class="auth-brand-title">CentSora</h1>
            </div>
          </div>

          <div class="auth-copy-block">
            <p class="auth-eyebrow">Built for real life</p>

            <h2 class="auth-showcase-title auth-showcase-title--dynamic">
              Build better money habits,
              <span class="auth-typed-line">
                {{ typedText }}<span class="auth-caret"></span>
              </span>
            </h2>

            <p class="auth-showcase-subtitle">
              Start tracking budgets, organizing transactions, and growing your savings goals
              with a cleaner and more motivating financial experience.
            </p>

            <div class="auth-trust-row">
              <span>Takes less than a minute</span>
              <span>Secure account setup</span>
              <span>Clear financial tracking</span>
            </div>
          </div>

          <div class="auth-benefits">
            <div class="auth-benefit-card auth-benefit-card--delay-1">
              <div class="auth-benefit-icon-wrap">
                <span class="auth-benefit-icon">💰</span>
              </div>
              <div>
                <h3>Stronger budgeting</h3>
                <p>Set practical limits and stay aware of what you have left.</p>
              </div>
            </div>

            <div class="auth-benefit-card auth-benefit-card--delay-2">
              <div class="auth-benefit-icon-wrap">
                <span class="auth-benefit-icon">📊</span>
              </div>
              <div>
                <h3>Clearer visibility</h3>
                <p>See your balances, spending, and progress in one organized place.</p>
              </div>
            </div>

            <div class="auth-benefit-card auth-benefit-card--delay-3">
              <div class="auth-benefit-icon-wrap">
                <span class="auth-benefit-icon">🌱</span>
              </div>
              <div>
                <h3>Growth-focused goals</h3>
                <p>Stay consistent with savings targets that feel motivating, not overwhelming.</p>
              </div>
            </div>
          </div>

          <div class="auth-floating-card auth-floating-card--register">
            <p class="auth-floating-label">Getting started</p>
            <strong>Create your space for clearer, more intentional budgeting.</strong>
          </div>
        </div>
      </div>

      <div class="auth-form-panel">
        <div class="auth-form-card auth-fade-up auth-fade-up--delay">
          <p class="auth-form-kicker">Register</p>
          <h2 class="auth-form-title">Create your CentSora account</h2>
          <p class="auth-form-subtitle">
            A secure, simple place to manage money and move toward your goals.
          </p>

          <div v-if="error" class="alert alert-danger py-2 auth-alert" role="alert">
            {{ error }}
          </div>

          <form class="auth-form" @submit.prevent="handleRegister">
            <div class="mb-3">
              <label class="form-label">Full name</label>
              <input
                v-model="form.name"
                type="text"
                class="form-control auth-input"
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
                  placeholder="Create password (min. 8 characters)"
                  required
                  minlength="8"
                  autocomplete="new-password"
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
              {{ loading ? 'Creating account…' : 'Create Account' }}
            </button>
          </form>

          <p class="auth-form-note">
            Get started with a clean dashboard built around budgeting and savings goals.
          </p>

          <div class="text-center muted mt-4 auth-switch-copy">
            Already have an account? <router-link to="/login">Sign in</router-link>
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

const form = ref({ name: '', email: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const words = ['with a dashboard made for real life.', 'with a cleaner financial routine.', 'with more clarity and control.']
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

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await api.post('/auth/register', form.value)
    await checkAuth()
    router.push('/welcome?isNew=true')
  } catch (err) {
    error.value = err.response?.data?.error
      || err.response?.data?.errors?.[0]?.msg
      || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>