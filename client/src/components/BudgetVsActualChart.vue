<template>
  <div class="chart-box p-4">
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div>
        <p class="text-muted mb-1">Budget health</p>
        <h3 class="h5 mb-0">Budget vs actual</h3>
      </div>
      <span class="badge bg-light text-dark">{{ overallStatus }}</span>
    </div>

    <div v-if="items.length" class="budget-bars">
      <div v-for="item in items" :key="item.category" class="budget-row">
        <span class="budget-label">{{ item.category }}</span>
        <div class="budget-track">
          <span :style="{ width: `${Math.min(item.percent, 100)}%`, background: barColor(item.percent) }"></span>
        </div>
        <strong class="budget-amount">${{ Math.round(item.actual) }}</strong>
      </div>
    </div>

    <p v-else class="text-muted small mt-2">No budgets set up yet.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
})

function barColor(percent) {
  if (percent >= 90) return '#ef4444'
  if (percent >= 70) return '#f97316'
  return 'linear-gradient(90deg, #5c6ac4, #10b981)'
}

const overallStatus = computed(() => {
  if (!props.items.length) return '—'
  const over = props.items.filter((i) => i.percent >= 100).length
  if (over > 0) return `${over} over budget`
  const avg = props.items.reduce((s, i) => s + i.percent, 0) / props.items.length
  return avg < 70 ? 'On track' : 'Watch spending'
})
</script>

<style scoped>
.budget-bars {
  display: grid;
  gap: 0.9rem;
}

.budget-row {
  display: grid;
  grid-template-columns: 1.4fr 3fr auto;
  align-items: center;
  gap: 0.75rem;
}

.budget-label {
  font-size: 0.85rem;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.budget-amount {
  font-size: 0.85rem;
  white-space: nowrap;
}

.budget-track {
  height: 10px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.budget-track span {
  display: block;
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}
</style>
