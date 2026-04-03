<template>
  <div class="chart-box p-4">
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div>
        <p class="text-muted mb-1">Category breakdown</p>
        <h3 class="h5 mb-0">Spending distribution</h3>
      </div>
      <span class="badge bg-light text-dark">{{ totalLabel }}</span>
    </div>

    <div class="pie-wrapper d-flex justify-content-center align-items-center">
      <div class="pie-chart" :style="{ background: gradient }"></div>
      <div class="pie-label">
        <span class="fs-4 fw-semibold">{{ totalLabel }}</span>
        <p class="mb-0 text-muted small">This month</p>
      </div>
    </div>

    <div class="pie-legend mt-3">
      <div v-for="(cat, i) in categories" :key="cat.name" class="pie-legend-item">
        <span class="legend-swatch" :style="{ background: COLORS[i % COLORS.length] }"></span>
        <span class="legend-name">{{ cat.name }}</span>
        <span class="legend-pct text-muted">{{ cat.percent }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const COLORS = ['#5c6ac4', '#f97316', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const props = defineProps({
  categories: { type: Array, default: () => [] },
  total:      { type: Number, default: 0 },
})

const totalLabel = computed(() => {
  if (!props.total) return '—'
  return props.total >= 1000
    ? `$${(props.total / 1000).toFixed(1)}k`
    : `$${props.total}`
})

const gradient = computed(() => {
  if (!props.categories.length) return '#e2e8f0'
  let pos = 0
  const stops = props.categories.map((cat, i) => {
    const start = pos
    pos += cat.percent
    return `${COLORS[i % COLORS.length]} ${start}% ${Math.min(pos, 100)}%`
  })
  return `conic-gradient(${stops.join(', ')})`
})
</script>

<style scoped>
.pie-wrapper {
  min-height: 180px;
  position: relative;
}

.pie-chart {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 40px #f6f8fb;
  flex-shrink: 0;
}

.pie-label {
  position: absolute;
  inset: auto auto 1rem auto;
  width: 100%;
  text-align: center;
  left: 0;
}

.pie-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}

.pie-legend-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
}

.legend-swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-name {
  color: #374151;
}

.legend-pct {
  font-size: 0.75rem;
}
</style>
