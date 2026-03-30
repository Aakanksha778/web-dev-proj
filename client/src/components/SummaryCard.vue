<template>
  <div class="card page-card p-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div>
        <p class="text-uppercase text-muted mb-1 small">{{ title }}</p>
        <h3 class="mb-0">{{ value }}</h3>
      </div>
      <div class="icon-box bg-light text-primary rounded-circle d-flex align-items-center justify-content-center">
        <span class="fs-5">{{ icon }}</span>
      </div>
    </div>
    <p class="mb-0 text-muted">{{ subtitle }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  value: String,
  subtitle: String,
  icon: String,
})
</script>
