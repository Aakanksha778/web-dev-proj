<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
      <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="goal-modal-title">
        <div class="modal-panel-header">
          <div>
            <p class="modal-kicker">Create goal</p>
            <h1 id="goal-modal-title" class="modal-panel-title">Create New Goal</h1>
          </div>
          <button type="button" class="modal-close-btn" @click="$emit('update:modelValue', false)" aria-label="Close">×</button>
        </div>

        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="goalName" class="form-label">Goal Name</label>
            <input
              v-model="form.title"
              type="text"
              class="form-control"
              id="goalName"
              placeholder="e.g., Vacation fund"
              required
            />
          </div>

          <div class="mb-3">
            <label for="targetAmount" class="form-label">Target Amount ($)</label>
            <input
              v-model.number="form.target"
              type="number"
              class="form-control"
              id="targetAmount"
              placeholder="e.g., 5000"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div class="mb-3">
            <label for="description" class="form-label">Description (Optional)</label>
            <textarea
              v-model="form.description"
              class="form-control"
              id="description"
              rows="3"
              placeholder="What's this goal for?"
            ></textarea>
          </div>

          <div class="mb-3">
            <label for="priorityLevel" class="form-label">Priority</label>
            <select v-model="form.priority" id="priorityLevel" class="form-select">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>

          <div class="d-flex gap-2 justify-content-end">
            <button type="button" class="btn btn-ghost" @click="$emit('update:modelValue', false)">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Creating...' : 'Create Goal' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue', 'goal-created'])

const form = ref({
  title: '',
  target: '',
  description: '',
  priority: 'Medium',
})

const loading = ref(false)
const error = ref('')

async function submitForm() {
  error.value = ''
  loading.value = true

  try {
    const response = await api.post('/goals', {
      title: form.value.title,
      target: form.value.target,
      description: form.value.description,
    })

    emit('goal-created', {
      goal: response.data.data.goal,
      priority: form.value.priority,
    })
    resetForm()
    emit('update:modelValue', false)
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to create goal'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.value = {
    title: '',
    target: '',
    description: '',
    priority: 'Medium',
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
  background: var(--panel-strong);
  color: var(--text);
  border-radius: 1.25rem;
  padding: 1.75rem;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 8px 48px rgba(15, 23, 42, 0.16);
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
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
  color: var(--accent);
  margin-bottom: 0.25rem;
}

.modal-panel-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0;
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--muted);
  cursor: pointer;
  padding: 0;
}

.modal-close-btn:hover {
  color: var(--text);
}
</style>
