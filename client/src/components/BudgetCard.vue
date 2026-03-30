<template>
  <div class="card page-card p-4">
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div>
        <h5 class="mb-1">{{ title }}</h5>
        <p class="text-muted mb-0">{{ category }}</p>
      </div>
      <span class="badge bg-secondary badge-pill">{{ progress }}%</span>
    </div>
    <div class="progress-bar-custom mb-3">
      <span :style="{ width: progress + '%' }"></span>
    </div>
    <div class="d-flex justify-content-between text-muted small">
      <span>{{ used }} spent</span>
      <span>{{ remaining }} left</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  category: String,
  progress: Number,
  used: String,
  remaining: String,
})
</script>
