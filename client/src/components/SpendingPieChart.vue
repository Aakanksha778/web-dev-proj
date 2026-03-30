<template>
  <div class="chart-box p-4">
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div>
        <p class="text-muted mb-1">Category breakdown</p>
        <h3 class="h5 mb-0">Spending distribution</h3>
      </div>
      <span class="badge bg-light text-dark">65% budget used</span>
    </div>
    <div class="pie-wrapper d-flex justify-content-center align-items-center">
      <div class="pie-chart"></div>
      <div class="pie-label">
        <span class="fs-4 fw-semibold">$3.8k</span>
        <p class="mb-0 text-muted small">This month</p>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.pie-wrapper {
  min-height: 200px;
  position: relative;
}

.pie-chart {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: conic-gradient(#5c6ac4 0 38%, #f97316 38% 62%, #10b981 62% 100%);
  box-shadow: inset 0 0 0 16px #f6f8fb;
}

.pie-label {
  position: absolute;
  inset: auto auto 1.5rem auto;
  width: 100%;
  text-align: center;
  left: 0;
}
</style>
