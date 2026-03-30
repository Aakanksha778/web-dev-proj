<template>
  <div class="card page-card p-4">
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div>
        <h5 class="mb-1">{{ title }}</h5>
        <p class="text-muted mb-0">Target: {{ target }}</p>
      </div>
      <span class="badge bg-primary badge-pill">{{ progress }}%</span>
    </div>
    <div class="progress-bar-custom mb-3">
      <span :style="{ width: progress + '%' }"></span>
    </div>
    <p class="mb-0 text-muted">{{ description }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  target: String,
  progress: Number,
  description: String,
})
</script>
