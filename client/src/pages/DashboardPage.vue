<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>Review your balances, spending habits, and budget performance in one clean view.</p>
      </div>
      <button class="btn btn-brand">New transaction</button>
    </div>

    <div class="row g-4">
      <div class="col-12 col-md-6 col-xl-3" v-for="card in summaries" :key="card.title">
        <SummaryCard :title="card.title" :value="card.value" :subtitle="card.subtitle" :icon="card.icon" />
      </div>
    </div>

    <div class="row g-4 mt-3">
      <div class="col-12 col-lg-7">
        <div class="card page-card p-4">
          <h2 class="h5 mb-4">Spending trend</h2>
          <SpendingLineChart />
        </div>
      </div>
      <div class="col-12 col-lg-5">
        <div class="card page-card p-4 mb-4">
          <h2 class="h5 mb-4">Budget insight</h2>
          <BudgetVsActualChart />
        </div>
        <div class="card page-card p-4">
          <h2 class="h5 mb-4">Category split</h2>
          <SpendingPieChart />
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
