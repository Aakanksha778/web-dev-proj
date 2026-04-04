<template>
  <div class="modal fade" :class="{ show: modelValue }" :style="{ display: modelValue ? 'block' : 'none' }" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Create New Goal</h1>
          <button type="button" class="btn-close" @click="$emit('update:modelValue', false)" aria-label="Close"></button>
        </div>
        <div class="modal-body">
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

            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="$emit('update:modelValue', false)">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Creating...' : 'Create Goal' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-if="modelValue" class="modal-backdrop fade show"></div>
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

    emit('goal-created', response.data.data.goal)
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
  }
}
</script>
