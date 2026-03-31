<template>
  <section class="dashboard-page">
    <div class="dashboard-hero">
      <div>
        <p class="dashboard-kicker">Financial overview</p>
        <h1 class="dashboard-title">Welcome back, Aakanksha.</h1>
        <p class="dashboard-subtitle">
          Here’s a quick look at your balances, budgets, and savings progress for this month.
        </p>
      </div>

      <div class="dashboard-actions">
        <button class="btn btn-ghost">Export report</button>
        <button class="btn btn-primary">Add transaction</button>
      </div>
    </div>

    <div class="dashboard-highlight">
      <div class="dashboard-highlight-card">
        <div>
          <p class="highlight-label">Monthly snapshot</p>
          <h2>You’re spending more intentionally this month.</h2>
          <p class="muted mb-0">
            Spending is down 8% compared to last month and your savings goal is moving in the right direction.
          </p>
        </div>
        <span class="highlight-pill">Healthy trend</span>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-12 col-md-6 col-xl-3" v-for="card in summaries" :key="card.title">
        <SummaryCard :title="card.title" :value="card.value" :subtitle="card.subtitle" :icon="card.icon" />
      </div>
    </div>

    <div class="row g-4 mt-2">
      <div class="col-12 col-lg-8">
        <div class="card page-card dashboard-panel p-4">
          <div class="panel-heading">
            <div>
              <p class="panel-kicker">Trend analysis</p>
              <h2 class="h5 mb-1">Spending trend</h2>
            </div>
            <span class="panel-badge">Last 6 months</span>
          </div>
          <SpendingLineChart />
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card page-card dashboard-panel p-4 h-100">
          <div class="panel-heading">
            <div>
              <p class="panel-kicker">Budget status</p>
              <h2 class="h5 mb-1">Budget insight</h2>
            </div>
            <span class="panel-badge">Live</span>
          </div>
          <BudgetVsActualChart />
        </div>
      </div>
    </div>

    <div class="row g-4 mt-2">
      <div class="col-12 col-lg-5">
        <div class="card page-card dashboard-panel p-4 h-100">
          <div class="panel-heading">
            <div>
              <p class="panel-kicker">Breakdown</p>
              <h2 class="h5 mb-1">Category split</h2>
            </div>
            <span class="panel-badge">This month</span>
          </div>
          <SpendingPieChart />
        </div>
      </div>

      <div class="col-12 col-lg-7">
        <div class="card page-card dashboard-tip-card p-4 h-100">
          <p class="panel-kicker">Quick insight</p>
          <h2 class="dashboard-tip-title">Your discretionary spending is improving.</h2>
          <p class="muted">
            Dining and entertainment costs are slightly lower this month, which is helping you stay aligned
            with your savings target. Keep that momentum and redirect any extra room toward your emergency fund.
          </p>

          <div class="dashboard-tip-grid">
            <div class="tip-mini-card">
              <span>Needs</span>
              <strong>Within target</strong>
            </div>
            <div class="tip-mini-card">
              <span>Wants</span>
              <strong>Trending down</strong>
            </div>
            <div class="tip-mini-card">
              <span>Savings</span>
              <strong>56% complete</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import SummaryCard from '../components/SummaryCard.vue'
import SpendingLineChart from '../components/SpendingLineChart.vue'
import SpendingPieChart from '../components/SpendingPieChart.vue'
import BudgetVsActualChart from '../components/BudgetVsActualChart.vue'

const summaries = [
  { title: 'Net balance', value: '$12,480', subtitle: 'Available after expenses', icon: '💰' },
  { title: 'Monthly spend', value: '$3,760', subtitle: 'Down 8% from last month', icon: '📉' },
  { title: 'Savings goal', value: '$8,900', subtitle: '56% complete', icon: '🥅' },
  { title: 'Active budgets', value: '7 budgets', subtitle: 'Three due this week', icon: '📊' },
]
</script>