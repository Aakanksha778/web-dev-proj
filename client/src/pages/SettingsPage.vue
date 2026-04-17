<template>
  <section class="settings-page">
    <div class="page-header">
      <div>
        <h1>Settings</h1>
        <p>Manage your profile, notifications, privacy, and account preferences.</p>
      </div>

      <div class="settings-header-actions">
        <span v-if="hasLocalChanges" class="settings-unsaved-pill">Unsaved changes</span>
        <button class="btn btn-brand" @click="saveAll" :disabled="saving">
          {{ saving ? 'Saving…' : 'Save settings' }}
        </button>
      </div>
    </div>

    <div v-if="successMsg" class="alert alert-success py-2 mb-3">{{ successMsg }}</div>
    <div v-if="errorMsg" class="alert alert-danger py-2 mb-3">{{ errorMsg }}</div>

    <div class="settings-hero card page-card p-4 mb-4">
      <div class="settings-hero-grid">
        <div class="settings-hero-copy">
          <p class="settings-kicker">Personal workspace</p>
          <h2 class="settings-hero-title">Make CentSora feel more like your own.</h2>
          <p class="settings-hero-subtitle">
            Fine-tune how you plan, review, and protect your money habits without changing the look and feel of the app.
          </p>
        </div>

        <div class="settings-hero-panel">
          <div class="settings-hero-panel-top">
            <div>
              <p class="settings-hero-panel-label">Your setup</p>
              <h3>{{ profile.name || 'Your account' }}</h3>
            </div>
            <div class="settings-hero-panel-badge">
              {{ mindsetPrefs.review_style }}
            </div>
          </div>

          <div class="settings-hero-panel-grid">
            <div class="settings-mini-stat">
              <span>Notifications</span>
              <strong>{{ enabledNotificationCount }}/5 on</strong>
            </div>
            <div class="settings-mini-stat">
              <span>Currency</span>
              <strong>{{ appPrefs.currency }}</strong>
            </div>
            <div class="settings-mini-stat">
              <span>Default view</span>
              <strong>{{ appPrefs.default_landing }}</strong>
            </div>
          </div>

          <div class="settings-message-preview">
            <p class="settings-message-preview-label">Review tone</p>
            <h4>{{ reviewMessageTitle }}</h4>
            <p>{{ reviewMessageText }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-12 col-xl-6">
        <div class="card page-card p-4 settings-card h-100">
          <div class="settings-card-head">
            <div>
              <h2 class="h5 mb-1">Profile</h2>
              <p class="settings-section-copy">Basic details used across your account.</p>
            </div>
          </div>

          <form @submit.prevent>
            <div class="mb-3">
              <label class="form-label">Full name</label>
              <input v-model="profile.name" type="text" class="form-control" placeholder="Enter your full name" />
            </div>

            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="profile.email" type="email" class="form-control" placeholder="Enter your email" />
            </div>

            <div class="row g-3 mb-3">
              <div class="col-12 col-md-6">
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

              <div class="col-12 col-md-6">
                <label class="form-label">Currency</label>
                <select v-model="appPrefs.currency" class="form-select">
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Date format</label>
              <select v-model="appPrefs.date_format" class="form-select">
                <option value="MMM D, YYYY">MMM D, YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div class="settings-subpanel mt-4">
              <div class="settings-subpanel-head">
                <div>
                  <h3 class="settings-subpanel-title">Password</h3>
                  <p class="settings-helper-text mb-0">Manage your password in a separate secure popup.</p>
                </div>

                <button
                  type="button"
                  class="btn btn-primary settings-password-btn"
                  @click="openPasswordModal"
                >
                  Change password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="col-12 col-xl-6">
        <div class="card page-card p-4 settings-card h-100">
          <div class="settings-card-head">
            <div>
              <h2 class="h5 mb-1">App preferences</h2>
              <p class="settings-section-copy">Control how the app looks and behaves day to day.</p>
            </div>
          </div>

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
              v-model="darkMode"
              class="form-check-input"
              type="checkbox"
              id="darkmode"
            />
            <label class="form-check-label" for="darkmode">Dark mode</label>
          </div>

          <div class="form-check form-switch mb-4">
            <input
              v-model="appPrefs.show_tips"
              class="form-check-input"
              type="checkbox"
              id="showtips"
            />
            <label class="form-check-label" for="showtips">Show smart saving tips</label>
          </div>

          <div class="mt-4">
            <label class="form-label">Money review tone</label>
            <select v-model="mindsetPrefs.review_style" class="form-select">
              <option value="Gentle">Gentle</option>
              <option value="Focused">Focused</option>
              <option value="Motivating">Motivating</option>
            </select>
            <p class="settings-helper-text mt-2 mb-0">
              This shapes the tone of your review messages and summary prompts across the app.
            </p>
          </div>
        </div>
      </div>


    </div>

    <div
      v-if="showPasswordModal"
      class="settings-modal-backdrop"
      @click.self="closePasswordModal"
    >
      <div class="settings-modal-card">
        <div class="settings-modal-head">
          <div>
            <h2 class="settings-modal-title">Change password</h2>
            <p class="settings-helper-text mb-0">
              Update your password here as part of your account security.
            </p>
          </div>

          <button
            type="button"
            class="settings-modal-close"
            @click="closePasswordModal"
            aria-label="Close password modal"
          >
            ×
          </button>
        </div>

        <div class="mb-3">
          <label class="form-label">Current password</label>
          <div class="password-field">
            <input
              v-model="passwordForm.current_password"
              :type="showCurrentPassword ? 'text' : 'password'"
              class="form-control password-input"
              placeholder="Enter current password"
            />
            <button
              type="button"
              class="password-toggle-btn"
              @click="showCurrentPassword = !showCurrentPassword"
            >
              {{ showCurrentPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <div class="row g-3">
          <div class="col-12 col-md-6">
            <label class="form-label">New password</label>
            <div class="password-field">
              <input
                v-model="passwordForm.new_password"
                :type="showNewPassword ? 'text' : 'password'"
                class="form-control password-input"
                placeholder="Enter new password"
              />
              <button
                type="button"
                class="password-toggle-btn"
                @click="showNewPassword = !showNewPassword"
              >
                {{ showNewPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label">Confirm new password</label>
            <div class="password-field">
              <input
                v-model="passwordForm.confirm_password"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-control password-input"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                class="password-toggle-btn"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>
        </div>

        <p class="settings-helper-text mt-3 mb-0">
          Use at least 8 characters and choose something hard to guess.
        </p>

        <div class="settings-modal-actions">
          <button
            type="button"
            class="btn btn-ghost"
            @click="closePasswordModal"
          >
            Cancel
          </button>

          <button
            type="button"
            class="btn btn-brand"
            @click="submitPasswordDraft"
          >
            Update password
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import api from '../services/api'
import { useDarkMode } from '../stores/darkMode'

const { darkMode } = useDarkMode()

const profile = ref({
  name: '',
  email: '',
  timezone: 'America/New_York',
})

const prefs = ref({
  notifications: true,
  auto_budget: false,
})

const appPrefs = ref({
  currency: 'CAD',
  date_format: 'MMM D, YYYY',
  week_start: 'Monday',
  compact_mode: false,
  show_tips: true,
  default_landing: 'Dashboard',
})

const notifyPrefs = ref({
  weekly_summary: true,
  budget_alerts: true,
  goal_updates: true,
  bill_reminders: false,
  login_alerts: true,
  alert_threshold: 80,
})

const privacyPrefs = ref({
  hide_balances: false,
  mask_dashboard: false,
  remember_device: true,
  session_timeout: '30 minutes',
  export_reminder: 'Monthly',
})

const mindsetPrefs = ref({
  review_style: 'Focused',
})

const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: '',
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const showPasswordModal = ref(false)

const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')
const hasLocalChanges = ref(false)

const LOCAL_KEY = 'centsora_settings_plus'

const enabledNotificationCount = computed(() => {
  return [
    prefs.value.notifications,
    notifyPrefs.value.weekly_summary,
    notifyPrefs.value.budget_alerts,
    notifyPrefs.value.goal_updates,
    notifyPrefs.value.login_alerts,
  ].filter(Boolean).length
})

const reviewMessageTitle = computed(() => {
  const name = profile.value.name?.trim() || 'there'
  return `${mindsetPrefs.value.review_style} review style for ${name}`
})

const reviewMessageText = computed(() => {
  const styleMap = {
    Gentle: 'A softer, calmer tone that keeps your financial check-ins low-stress and encouraging.',
    Focused: 'A clear and practical tone that helps you catch overspending early and stay on track.',
    Motivating: 'A more energetic tone that pushes progress, celebrates wins, and keeps momentum high.',
  }

  return styleMap[mindsetPrefs.value.review_style]
})

function loadLocalSettings() {
  const saved = localStorage.getItem(LOCAL_KEY)
  if (!saved) return

  try {
    const parsed = JSON.parse(saved)

    appPrefs.value = { ...appPrefs.value, ...(parsed.appPrefs || {}) }
    notifyPrefs.value = { ...notifyPrefs.value, ...(parsed.notifyPrefs || {}) }
    privacyPrefs.value = { ...privacyPrefs.value, ...(parsed.privacyPrefs || {}) }
    mindsetPrefs.value = { ...mindsetPrefs.value, ...(parsed.mindsetPrefs || {}) }
  } catch {
    // ignore malformed local settings
  }
}

function saveLocalSettings() {
  const payload = {
    appPrefs: appPrefs.value,
    notifyPrefs: notifyPrefs.value,
    privacyPrefs: privacyPrefs.value,
    mindsetPrefs: mindsetPrefs.value,
  }

  localStorage.setItem(LOCAL_KEY, JSON.stringify(payload))
}

function openPasswordModal() {
  showPasswordModal.value = true
}

function closePasswordModal() {
  showPasswordModal.value = false
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

function submitPasswordDraft() {
  errorMsg.value = ''
  successMsg.value = ''

  if (
    !passwordForm.value.current_password ||
    !passwordForm.value.new_password ||
    !passwordForm.value.confirm_password
  ) {
    errorMsg.value = 'Please complete all password fields.'
    return
  }

  if (passwordForm.value.new_password.length < 8) {
    errorMsg.value = 'New password must be at least 8 characters.'
    return
  }

  if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
    errorMsg.value = 'New password and confirm password must match.'
    return
  }

  closePasswordModal()
  hasLocalChanges.value = true
  successMsg.value = 'Password details look good. Connect this action to your backend password endpoint next.'
  setTimeout(() => {
    successMsg.value = ''
  }, 3000)
}

onMounted(async () => {
  loadLocalSettings()

  try {
    const [profileRes, prefsRes] = await Promise.all([
      api.get('/settings/profile'),
      api.get('/settings/preferences'),
    ])

    profile.value = {
      ...profile.value,
      ...profileRes.data.data.profile,
    }

    const p = prefsRes.data.data.preferences || {}

    prefs.value = {
      notifications: !!p.notifications,
      auto_budget: !!p.auto_budget,
    }

    if (typeof p.dark_mode === 'boolean') {
      darkMode.value = p.dark_mode
    }
  } catch (err) {
    errorMsg.value = 'Failed to load settings.'
  }
})

watch(
  [appPrefs, notifyPrefs, privacyPrefs, mindsetPrefs, passwordForm, profile, prefs, darkMode],
  () => {
    hasLocalChanges.value = true
  },
  { deep: true }
)

async function saveAll() {
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''

  try {
    await Promise.all([
      api.put('/settings/profile', profile.value),
      api.put('/settings/preferences', {
        notifications: prefs.value.notifications,
        auto_budget: prefs.value.auto_budget,
        dark_mode: darkMode.value,
      }),
    ])

    saveLocalSettings()

    passwordForm.value = {
      current_password: '',
      new_password: '',
      confirm_password: '',
    }

    showCurrentPassword.value = false
    showNewPassword.value = false
    showConfirmPassword.value = false
    showPasswordModal.value = false

    hasLocalChanges.value = false
    successMsg.value = 'Settings saved.'
    setTimeout(() => {
      successMsg.value = ''
    }, 3000)
  } catch (err) {
    errorMsg.value = err.response?.data?.error || 'Failed to save settings.'
  } finally {
    saving.value = false
  }
}
</script>