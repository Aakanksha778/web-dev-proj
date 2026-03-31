<template>
  <div class="budget-goal-card budget-card-shell">
    <div class="budget-goal-top">
      <div>
        <p class="budget-goal-kicker">Budget category</p>
        <h3 class="budget-goal-title">{{ title }}</h3>
        <p class="budget-goal-meta">{{ category }}</p>
      </div>

      <span class="budget-progress-badge">
        {{ progress }}%
      </span>
    </div>

    <div class="budget-progress-track">
      <span class="budget-progress-fill" :style="{ width: progress + '%' }"></span>
    </div>

    <div class="budget-goal-stats">
      <div>
        <span>Spent</span>
        <strong>{{ used }}</strong>
      </div>
      <div>
        <span>Remaining</span>
        <strong>{{ remaining }}</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  category: String,
  progress: Number,
  used: String,
  remaining: String,
})
</script>