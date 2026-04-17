<template>
  <Teleport to="body">
    <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-panel-header">
          <div>
            <p class="modal-kicker">New entry</p>
            <h2 id="modal-title" class="modal-panel-title">Add transaction</h2>
          </div>
          <button class="modal-close-btn" @click="$emit('close')" aria-label="Close">&times;</button>
        </div>

        <div v-if="error" class="alert alert-danger py-2 mb-3">{{ error }}</div>

        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="form-label">Description</label>
            <input v-model="form.description" type="text" class="form-control" placeholder="e.g. Grocery run" required />
          </div>

          <div class="row g-3 mb-3">
            <div class="col-6">
              <label class="form-label">Type</label>
              <select v-model="form.type" class="form-select" required>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div class="col-6">
              <label class="form-label">Status</label>
              <select v-model="form.status" class="form-select" required>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-6">
              <label class="form-label">Amount ($)</label>
              <input v-model.number="form.amount" type="number" class="form-control" placeholder="0.00" min="0.01" step="0.01" required />
            </div>
            <div class="col-6">
              <label class="form-label">Date</label>
              <input v-model="form.date" type="date" class="form-control" required />
            </div>
          </div>

          <div class="mb-4 category-dropdown">
            <label class="form-label">Category</label>
            <div class="category-input-wrap">
              <input
                ref="categoryInputRef"
                v-model="categoryQuery"
                type="text"
                class="form-control"
                placeholder="Choose a category"
                required
                @focus="openCategoryDropdown"
                @input="onCategoryQueryInput"
                @keydown.down.prevent="focusNextCategoryOption"
                @keydown.up.prevent="focusPrevCategoryOption"
                @keydown.enter.prevent="chooseHighlightedCategory"
                @blur="closeCategoryDropdown"
              />
              <span class="category-toggle">▾</span>
            </div>
            <div v-show="dropdownOpen" :class="['category-options', { 'open-up': openUpwards }]">
              <button
                v-for="(option, index) in filteredCategories"
                :key="option"
                type="button"
                class="category-option"
                :class="{ selected: option === form.category, highlighted: index === highlightedIndex }"
                @mousedown.prevent="selectCategory(option)"
              >
                {{ option }}
              </button>
              <div v-if="filteredCategories.length === 0" class="category-option empty">
                No matching categories
              </div>
            </div>
          </div>

          <div class="d-flex gap-2 justify-content-end">
            <button type="button" class="btn btn-ghost" @click="$emit('close')">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Saving…' : 'Save transaction' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import api from '../services/api'

const props = defineProps({
  show: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'saved'])

const expenseCategories = [
  'Education (tuition, books, courses)',
  'Entertainment (streaming, movies, concerts, hobbies)',
  'Food & Dining (groceries, restaurants, coffee)',
  'Gifts & Donations',
  'Health (pharmacy, gym, doctor visits)',
  'Housing (rent, mortgage, utilities, insurance)',
  'Personal Care (haircuts, skincare)',
  'Pets (food, vet, grooming)',
  'Shopping (clothing, electronics, household goods)',
  'Subscriptions (software, memberships)',
  'Transport (gas, transit, parking, car maintenance)',
  'Travel (flights, hotels, vacation)',
]

const incomeCategories = [
  'Business income',
  'Dividends / Investments',
  'Freelance / Side hustle',
  'Gifts received',
  'Government benefits (e.g. tax refund, pension)',
  'Interest (savings account)',
  'Rental income',
  'Salary / Wages',
]

const neutralCategories = [
  'Bank transfer',
  'Credit card payment',
  'Savings deposit/withdrawal',
]

const defaultForm = () => ({
  description: '',
  type:        'expense',
  status:      'paid',
  amount:      '',
  date:        new Date().toISOString().slice(0, 10),
  category:    '',
})

const form    = ref(defaultForm())
const categoryQuery = ref('')
const dropdownOpen = ref(false)
const openUpwards = ref(false)
const highlightedIndex = ref(0)
const loading = ref(false)
const error   = ref('')
const categoryInputRef = ref(null)

const categoryOptions = computed(() => {
  const base = form.value.type === 'income'
    ? [...incomeCategories, ...neutralCategories]
    : [...expenseCategories, ...neutralCategories]
  return base.sort((a, b) => a.localeCompare(b))
})

const filteredCategories = computed(() => {
  const query = categoryQuery.value.trim().toLowerCase()
  if (!query) return categoryOptions.value
  return categoryOptions.value.filter((option) => option.toLowerCase().includes(query))
})

watch(() => form.value.type, () => {
  if (!categoryOptions.value.includes(form.value.category)) {
    form.value.category = ''
    categoryQuery.value = ''
  }
})

// Reset form whenever modal opens
watch(() => props.show, (val) => {
  if (val) {
    form.value = defaultForm()
    categoryQuery.value = ''
    dropdownOpen.value = false
    highlightedIndex.value = 0
    error.value = ''
  }
})

async function handleSubmit() {
  if (!categoryOptions.value.includes(categoryQuery.value.trim())) {
    form.value.category = categoryQuery.value.trim()
  }

  error.value = ''
  loading.value = true
  try {
    await api.post('/transactions', form.value)
    emit('saved')
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.error
      || err.response?.data?.errors?.[0]?.msg
      || 'Failed to save transaction.'
  } finally {
    loading.value = false
  }
}

function openCategoryDropdown() {
  dropdownOpen.value = true
  updateDropdownDirection()
}

function closeCategoryDropdown() {
  setTimeout(() => {
    dropdownOpen.value = false
  }, 120)
}

function onCategoryQueryInput() {
  dropdownOpen.value = true
  highlightedIndex.value = 0
  form.value.category = categoryQuery.value
  updateDropdownDirection()
}

function updateDropdownDirection() {
  requestAnimationFrame(() => {
    const input = categoryInputRef.value
    if (!input || typeof window === 'undefined') return

    const rect = input.getBoundingClientRect()
    const dropdownHeight = 10 * 40 // estimate 10 options height
    const availableBelow = window.innerHeight - rect.bottom
    const availableAbove = rect.top

    openUpwards.value = availableBelow < dropdownHeight && availableAbove > dropdownHeight
  })
}

function selectCategory(option) {
  form.value.category = option
  categoryQuery.value = option
  dropdownOpen.value = false
}

function chooseHighlightedCategory() {
  if (!filteredCategories.value.length) return
  selectCategory(filteredCategories.value[highlightedIndex.value])
}

function focusNextCategoryOption() {
  if (!dropdownOpen.value) {
    dropdownOpen.value = true
    return
  }
  if (!filteredCategories.value.length) return
  highlightedIndex.value = (highlightedIndex.value + 1) % filteredCategories.value.length
}

function focusPrevCategoryOption() {
  if (!dropdownOpen.value) {
    dropdownOpen.value = true
    return
  }
  if (!filteredCategories.value.length) return
  highlightedIndex.value = (highlightedIndex.value - 1 + filteredCategories.value.length) % filteredCategories.value.length
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.modal-panel {
  background: #fff;
  border-radius: 1.25rem;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 8px 48px rgba(15, 23, 42, 0.16);
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.modal-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.modal-kicker {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-brand, #2d6a4f);
  margin-bottom: 0.25rem;
}

.modal-panel-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: #94a3b8;
  cursor: pointer;
  padding: 0 0.25rem;
}

.modal-close-btn:hover {
  color: #0f172a;
}

.category-dropdown {
  position: relative;
}

.category-input-wrap {
  position: relative;
}

.category-input-wrap .form-control {
  width: 100%;
  padding-right: 2.5rem;
}

.category-toggle {
  position: absolute;
  right: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
  font-size: 0.9rem;
}

.category-options {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 0.5rem);
  bottom: auto;
  max-height: 10rem;
  overflow-y: auto;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 0.85rem;
  background: #fff;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
  z-index: 20;
}

.category-options.open-up {
  top: auto;
  bottom: calc(100% + 0.5rem);
}

.category-option {
  width: 100%;
  display: block;
  text-align: left;
  padding: 0.85rem 1rem;
  background: transparent;
  border: none;
  color: #0f172a;
  cursor: pointer;
}

.category-option:hover,
.category-option.highlighted {
  background: #f8fafc;
}

.category-option.selected {
  font-weight: 700;
}

.category-option.empty {
  color: #64748b;
  cursor: default;
}
</style>
