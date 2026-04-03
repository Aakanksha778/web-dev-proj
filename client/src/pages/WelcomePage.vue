<template>
  <section class="welcome-page">
    <div class="welcome-card" :class="{ 'welcome-card--visible': visible }">
      <div class="welcome-icon">👋</div>
      <p class="welcome-kicker">You're in</p>
      <h1 class="welcome-title">Welcome back, {{ firstName }}.</h1>
      <p class="welcome-subtitle">Taking you to your dashboard…</p>
      <div class="welcome-bar">
        <div class="welcome-bar-fill" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const router = useRouter()
const { user } = useAuth()

const visible  = ref(false)
const progress = ref(0)

const firstName = computed(() => user.value?.name?.split(' ')[0] ?? 'there')

onMounted(() => {
  // Trigger fade-in on next tick
  setTimeout(() => { visible.value = true }, 50)

  // Animate progress bar over 2 seconds
  const duration = 2000
  const interval = 30
  const step = (interval / duration) * 100
  const timer = setInterval(() => {
    progress.value = Math.min(progress.value + step, 100)
    if (progress.value >= 100) {
      clearInterval(timer)
      setTimeout(() => router.push('/dashboard'), 200)
    }
  }, interval)
})
</script>

<style scoped>
.welcome-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg, #f6f8fb);
}

.welcome-card {
  text-align: center;
  max-width: 420px;
  padding: 3rem 2.5rem;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 32px rgba(15, 23, 42, 0.08);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.welcome-card--visible {
  opacity: 1;
  transform: translateY(0);
}

.welcome-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.welcome-kicker {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-brand, #2d6a4f);
  margin-bottom: 0.5rem;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.welcome-subtitle {
  color: #64748b;
  margin-bottom: 2rem;
}

.welcome-bar {
  height: 6px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.welcome-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #2d6a4f, #52b788);
  transition: width 0.03s linear;
}
</style>
