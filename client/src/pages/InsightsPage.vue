<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Insights</h1>
        <p>Discover spending patterns and smart opportunities to save more.</p>
      </div>
      <button class="btn btn-brand">Refresh data</button>
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-6">
        <div class="card page-card p-4">
          <h2 class="h5 mb-3">Top spending category</h2>
          <p class="text-muted mb-4">Food & dining accounts for most of your monthly expenses.</p>
          <div class="progress-bar-custom mb-3"><span style="width: 68%"></span></div>
          <p class="mb-0"><strong>68%</strong> of your variable spending</p>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="card page-card p-4">
          <h2 class="h5 mb-3">Savings momentum</h2>
          <p class="text-muted mb-4">Your savings contributions increased 14% this month.</p>
          <div class="chart-box p-4">
            <div class="legend-list">
              <div class="legend-item"><span class="legend-swatch" style="background: #10b981"></span> Saved</div>
              <div class="legend-item"><span class="legend-swatch" style="background: #f97316"></span> Spent</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mt-3">
      <div class="col-12 col-lg-6">
        <div class="card page-card p-4">
          <h2 class="h5 mb-3">Opportunity</h2>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Reduce dining delivery by 20% and save an extra $120 each month.</li>
            <li class="list-group-item">Move subscriptions to an annual plan to lower recurring costs.</li>
            <li class="list-group-item">Automatically allocate 8% more to your emergency fund.</li>
          </ul>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="card page-card p-4">
          <h2 class="h5 mb-3">Monthly activity</h2>
          <p class="text-muted mb-4">Your income-to-spend ratio is healthy, with steady progress toward your savings goals.</p>
          <div class="row text-center">
            <div class="col-6 border-end">
              <h3 class="mb-1">$4.2k</h3>
              <p class="text-muted mb-0">Income</p>
            </div>
            <div class="col-6">
              <h3 class="mb-1">$3.1k</h3>
              <p class="text-muted mb-0">Expenses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
