<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Settings</h1>
        <p>Manage your profile, notifications, and budgeting preferences.</p>
      </div>
      <button class="btn btn-brand" @click="saveAll" :disabled="saving">
        {{ saving ? 'Saving…' : 'Save settings' }}
      </button>
    </div>

    <div v-if="successMsg" class="alert alert-success py-2 mb-3">{{ successMsg }}</div>
    <div v-if="errorMsg"   class="alert alert-danger  py-2 mb-3">{{ errorMsg }}</div>

    <div class="row g-4">
      <div class="col-12 col-lg-6">
        <div class="card page-card p-4">
          <h2 class="h5 mb-4">Profile</h2>
          <form @submit.prevent>
            <div class="mb-3">
              <label class="form-label">Full name</label>
              <input v-model="profile.name" type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="profile.email" type="email" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Timezone</label>
              <select v-model="profile.timezone" class="form-select">
                <option value="America/New_York">America/New_York</option>
                <option value="America/Chicago">America/Chicago</option>
                <option value="America/Denver">America/Denver</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="Asia/Singapore">Asia/Singapore</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="Australia/Sydney">Australia/Sydney</option>
              </select>
            </div>
          </form>
        </div>
      </div>

      <div class="col-12 col-lg-6">
        <div class="card page-card p-4">
          <h2 class="h5 mb-4">Preferences</h2>

          <div class="form-check form-switch mb-3">
            <input
              v-model="prefs.notifications"
              class="form-check-input"
              type="checkbox"
              id="notifications"
            />
            <label class="form-check-label" for="notifications">Email notifications</label>
          </div>

          <div class="form-check form-switch mb-3">
            <input
              v-model="prefs.auto_budget"
              class="form-check-input"
              type="checkbox"
              id="autobudget"
            />
            <label class="form-check-label" for="autobudget">Auto-adjust budgets</label>
          </div>

          <div class="form-check form-switch">
            <input
              v-model="darkMode"
              class="form-check-input"
              type="checkbox"
              id="darkmode"
            />
            <label class="form-check-label" for="darkmode">Dark mode</label>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useDarkMode } from '../stores/darkMode'

const { darkMode } = useDarkMode()

const profile    = ref({ name: '', email: '', timezone: 'America/New_York' })
const prefs      = ref({ notifications: true, auto_budget: false })
const saving     = ref(false)
const successMsg = ref('')
const errorMsg   = ref('')

onMounted(async () => {
  try {
    const [profileRes, prefsRes] = await Promise.all([
      api.get('/settings/profile'),
      api.get('/settings/preferences'),
    ])
    profile.value = profileRes.data.data.profile
    const p = prefsRes.data.data.preferences
    prefs.value = { notifications: !!p.notifications, auto_budget: !!p.auto_budget }
  } catch (err) {
    errorMsg.value = 'Failed to load settings.'
  }
})

async function saveAll() {
  saving.value  = true
  successMsg.value = ''
  errorMsg.value   = ''
  try {
    await Promise.all([
      api.put('/settings/profile', profile.value),
      api.put('/settings/preferences', {
        notifications: prefs.value.notifications,
        auto_budget:   prefs.value.auto_budget,
        dark_mode:     darkMode.value,
      }),
    ])
    successMsg.value = 'Settings saved.'
    setTimeout(() => { successMsg.value = '' }, 3000)
  } catch (err) {
    errorMsg.value = err.response?.data?.error || 'Failed to save settings.'
  } finally {
    saving.value = false
  }
}
</script>
