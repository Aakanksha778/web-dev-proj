<template>
  <div class="chart-box p-4">
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div>
        <p class="text-muted mb-1">Budget health</p>
        <h3 class="h5 mb-0">Budget vs actual</h3>
      </div>
      <span class="badge bg-light text-dark">On track</span>
    </div>
    <div class="budget-bars">
      <div class="budget-row">
        <span>Food</span>
        <div class="budget-track"><span style="width: 72%"></span></div>
        <strong>$420</strong>
      </div>
      <div class="budget-row">
        <span>Transport</span>
        <div class="budget-track"><span style="width: 58%"></span></div>
        <strong>$140</strong>
      </div>
      <div class="budget-row">
        <span>Entertainment</span>
        <div class="budget-track"><span style="width: 49%"></span></div>
        <strong>$95</strong>
      </div>
      <div class="budget-row">
        <span>Savings</span>
        <div class="budget-track"><span style="width: 84%"></span></div>
        <strong>$1,050</strong>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.budget-bars {
  display: grid;
  gap: 1rem;
}

.budget-row {
  display: grid;
  grid-template-columns: 1.2fr 3fr auto;
  align-items: center;
  gap: 1rem;
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
  background: linear-gradient(90deg, rgba(92, 106, 196, 1), rgba(16, 185, 129, 1));
}
</style>
