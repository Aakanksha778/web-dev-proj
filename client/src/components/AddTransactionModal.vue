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

          <div class="mb-4">
            <label class="form-label">Category</label>
            <input v-model="form.category" type="text" class="form-control" placeholder="e.g. Food, Transport, Income" required list="category-suggestions" />
            <datalist id="category-suggestions">
              <option v-for="c in categories" :key="c" :value="c" />
            </datalist>
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
import { ref, watch } from 'vue'
import api from '../services/api'

const props = defineProps({
  show: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'saved'])

const categories = ['Food', 'Transport', 'Entertainment', 'Health', 'Utilities', 'Dining', 'Savings', 'Income', 'Other']

const defaultForm = () => ({
  description: '',
  type:        'expense',
  status:      'paid',
  amount:      '',
  date:        new Date().toISOString().slice(0, 10),
  category:    '',
})

const form    = ref(defaultForm())
const loading = ref(false)
const error   = ref('')

// Reset form whenever modal opens
watch(() => props.show, (val) => {
  if (val) {
    form.value = defaultForm()
    error.value = ''
  }
})

async function handleSubmit() {
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
</style>
