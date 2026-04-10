<template>
  <div class="budget-goal-card goal-card-shell">
    <div class="budget-goal-top">
      <div>
        <p class="budget-goal-kicker">Savings goal</p>
        <div class="goal-title-row">
          <h3 class="budget-goal-title">{{ title }}</h3>
          <span v-if="completed" class="goal-complete-badge">Goal complete!</span>
        </div>
        <p class="budget-goal-meta">Target: {{ target }}</p>
        <div class="goal-meta-row">
          <span class="priority-pill">Priority: {{ priority }}</span>
        </div>
      </div>

      <div class="goal-card-actions">
        <button type="button" class="btn btn-sm btn-outline-danger goal-delete-btn" @click.stop="$emit('delete')">
          Delete
        </button>
        <button type="button" class="btn btn-sm btn-outline-secondary goal-edit-btn" @click.stop="$emit('edit')">
          Edit
        </button>
      </div>
    </div>

    <div class="budget-progress-track">
      <span class="budget-progress-fill goal-progress-fill" :style="{ width: progress + '%' }"></span>
    </div>

    <p class="goal-description">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  target: String,
  progress: Number,
  description: String,
  completed: Boolean,
  priority: {
    type: String,
    default: 'Medium',
  },
})

defineEmits(['edit', 'delete'])
</script>