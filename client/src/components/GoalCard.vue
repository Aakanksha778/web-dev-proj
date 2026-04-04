<template>
  <div class="budget-goal-card goal-card-shell" @click="$emit('edit')" style="cursor: pointer;">
    <div class="budget-goal-top">
      <div>
        <p class="budget-goal-kicker">Savings goal</p>
        <h3 class="budget-goal-title">{{ title }}</h3>
        <p class="budget-goal-meta">Target: {{ target }}</p>
      </div>

      <span class="budget-progress-badge">
        {{ progress }}%
      </span>
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
})

defineEmits(['edit'])
</script>