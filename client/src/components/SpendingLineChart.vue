<template>
  <div class="chart-box d-flex flex-column justify-content-between p-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <p class="text-muted mb-1">Weekly trend</p>
        <h3 class="h5 mb-0">Spending activity</h3>
      </div>
      <span class="badge bg-light text-dark">+12% last week</span>
    </div>
    <div class="chart-line"></div>
    <div class="legend-list">
      <div class="legend-item"><span class="legend-swatch" style="background: #5c6ac4"></span> Expenses</div>
      <div class="legend-item"><span class="legend-swatch" style="background: #10b981"></span> Income</div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.chart-line {
  position: relative;
  min-height: 180px;
  display: grid;
  align-items: end;
  gap: 1rem;
}

.chart-line::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(92, 106, 196, 0.08), transparent 60%);
  border-radius: 1rem;
}

.chart-line::after {
  content: '';
  position: absolute;
  left: 10%;
  bottom: 18%;
  width: 80%;
  height: 8px;
  background: linear-gradient(90deg, #5c6ac4 0%, #10b981 100%);
  border-radius: 999px;
  transform: skewX(-15deg);
}
</style>
