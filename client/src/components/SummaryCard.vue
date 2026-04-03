<template>
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to || undefined"
    class="summary-card"
    :class="{ 'summary-card--link': to }"
  >
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
  </component>
</template>

<script setup>
defineProps({
  title:    String,
  value:    String,
  subtitle: String,
  icon:     String,
  to:       { type: String, default: null },
})
</script>

<style scoped>
.summary-card--link {
  display: block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.summary-card--link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.1);
}
</style>
