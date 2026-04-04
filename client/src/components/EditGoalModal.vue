<template>
  <div class="modal fade" :class="{ show: modelValue }" :style="{ display: modelValue ? 'block' : 'none' }" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">{{ goal?.title }}</h1>
          <button type="button" class="btn-close" @click="$emit('update:modelValue', false)" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Target Amount</label>
              <p class="form-text">${{ goal?.target }}</p>
            </div>

            <div class="mb-3">
              <label for="savedAmount" class="form-label">Amount Saved ($)</label>
              <input
                v-model.number="form.saved"
                type="number"
                class="form-control"
                id="savedAmount"
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div class="mb-3">
              <div class="progress" style="height: 25px;">
                <div
                  class="progress-bar"
                  role="progressbar"
                  :style="{ width: savedProgress + '%' }"
                  :aria-valuenow="savedProgress"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {{ savedProgress }}%
                </div>
              </div>
              <small class="form-text text-muted">
                ${{ form.saved }} of ${{ goal?.target }}
              </small>
            </div>

            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="$emit('update:modelValue', false)">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Updating...' : 'Update Progress' }}
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
import { ref, watch, computed } from 'vue'
import api from '../services/api'

const props = defineProps({
  modelValue: Boolean,
  goal: Object,
})

const emit = defineEmits(['update:modelValue', 'goal-updated'])

const form = ref({
  saved: 0,
})

const loading = ref(false)
const error = ref('')

const savedProgress = computed(() => {
  if (!props.goal) return 0
  return Math.round((form.value.saved / props.goal.target) * 100)
})

watch(
  () => props.goal,
  (newGoal) => {
    if (newGoal) {
      form.value.saved = newGoal.saved || 0
    }
  },
  { immediate: true }
)

async function submitForm() {
  if (!props.goal) return

  error.value = ''
  loading.value = true

  try {
    const response = await api.put(`/goals/${props.goal.id}`, {
      saved: form.value.saved,
    })

    emit('goal-updated', response.data.data.goal)
    emit('update:modelValue', false)
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to update goal'
  } finally {
    loading.value = false
  }
}
</script>
