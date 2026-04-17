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
      <div class="pie-chart" :style="{ background: gradient }">
        <div class="pie-center">
          <span class="fs-4 fw-semibold">{{ totalLabel }}</span>
          <p class="mb-0 text-muted small">This month</p>
        </div>
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
  min-height: 240px;
  position: relative;
}

.pie-chart {
  width: 190px;
  height: 190px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.pie-chart::after {
  content: '';
  position: absolute;
  inset: 24%;
  border-radius: 50%;
  background: var(--bg, #ffffff);
  box-shadow: inset 0 0 0 10px rgba(255, 255, 255, 0.75);
}

.pie-center {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.pie-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
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

.pie-center .text-muted {
  color: #6b7280;
}

[data-theme="dark"] .pie-center .text-muted {
  color: var(--muted);
}

[data-theme="dark"] .legend-name,
[data-theme="dark"] .legend-pct {
  color: var(--muted);
}
</style>
