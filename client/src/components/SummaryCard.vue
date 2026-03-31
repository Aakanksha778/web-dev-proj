<template>
  <div class="summary-card">
    <div class="summary-card-top">
      <div class="summary-copy">
        <p class="summary-label">{{ title }}</p>
        <h3 class="summary-value">{{ value }}</h3>
      </div>

      <div class="summary-icon-wrap">
        <span class="summary-icon">{{ icon }}</span>
      </div>
    </div>

    <div class="summary-bottom">
      <p class="summary-subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  subtitle: String,
  icon: String,
})
</script>