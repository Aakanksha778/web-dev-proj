<template>
  <section class="dashboard-page">
    <div class="dashboard-hero">
      <div>
        <p class="dashboard-kicker">Financial overview</p>
        <h1 class="dashboard-title">Welcome back, {{ user?.name?.split(' ')[0] ?? 'there' }}.</h1>
        <p class="dashboard-subtitle">
          Here's a quick look at your balances, budgets, and savings progress for this month.
        </p>
      </div>

      <div class="dashboard-actions">
        <button class="btn btn-ghost">Export report</button>
        <button class="btn btn-primary" @click="showModal = true">Add transaction</button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5 text-muted">Loading dashboard…</div>

    <template v-else>
      <div class="dashboard-highlight">
        <div class="dashboard-highlight-card">
          <div>
            <p class="highlight-label">Monthly snapshot</p>
            <h2>{{ highlightHeadline }}</h2>
            <p class="muted mb-0">{{ highlightBody }}</p>
          </div>
          <span class="highlight-pill">{{ highlightPill }}</span>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-12 col-lg-4" v-for="card in summaryCards" :key="card.title">
          <SummaryCard :title="card.title" :value="card.value" :subtitle="card.subtitle" :icon="card.icon" :to="card.to" />
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
            <SpendingLineChart :trend="trend" />
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
            <BudgetVsActualChart :items="budgetVsActual" />
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
            <SpendingPieChart :categories="categories" :total="categoryTotal" />
          </div>
        </div>

        <div class="col-12 col-lg-7">
          <div class="card page-card dashboard-tip-card p-4 h-100">
            <p class="panel-kicker">Quick insight</p>
            <h2 class="dashboard-tip-title">{{ tipHeadline }}</h2>
            <p class="muted">{{ tipBody }}</p>

            <div class="dashboard-tip-grid">
              <div class="tip-mini-card">
                <span>Income</span>
                <strong>${{ fmt(summary.monthly_income) }}</strong>
              </div>
              <div class="tip-mini-card">
                <span>Spent</span>
                <strong>${{ fmt(summary.monthly_spend) }}</strong>
              </div>
              <div class="tip-mini-card">
                <span>Savings</span>
                <strong>{{ summary.savings_goal?.progress ?? 0 }}% complete</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <AddTransactionModal
      :show="showModal"
      @close="showModal = false"
      @saved="onSaved"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SummaryCard from '../components/SummaryCard.vue'
import SpendingLineChart from '../components/SpendingLineChart.vue'
import SpendingPieChart from '../components/SpendingPieChart.vue'
import BudgetVsActualChart from '../components/BudgetVsActualChart.vue'
import api from '../services/api'
import { useAuth } from '../stores/auth'
import AddTransactionModal from '../components/AddTransactionModal.vue'

const { user } = useAuth()

const showModal    = ref(false)
const loading      = ref(true)
const summary      = ref({})
const trend        = ref([])
const categories   = ref([])
const categoryTotal = ref(0)
const budgetVsActual = ref([])

function fmt(n) {
  if (!n) return '0'
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(Math.round(n))
}

const summaryCards = computed(() => [
  {
    title:    'Net balance',
    value:    `$${fmt(summary.value.net_balance)}`,
    subtitle: 'Total income minus expenses',
    icon:     '💰',
    to:       '/transactions',
  },
  {
    title:    'Monthly spend',
    value:    `$${fmt(summary.value.monthly_spend)}`,
    subtitle: 'Expenses this month',
    icon:     '📉',
    to:       '/transactions',
  },
  {
    title:    'Savings goal',
    value:    `$${fmt(summary.value.savings_goal?.total_saved)}`,
    subtitle: `${summary.value.savings_goal?.progress ?? 0}% of target reached`,
    icon:     '🥅',
    to:       '/goals',
  }
])

const highlightHeadline = computed(() => {
  const progress = summary.value.savings_goal?.progress ?? 0
  if (progress >= 70) return "You're well ahead on your savings goal."
  if (progress >= 40) return "You're making steady progress this month."
  return "Let's keep an eye on spending this month."
})

const highlightBody = computed(() => {
  const spend = summary.value.monthly_spend ?? 0
  const income = summary.value.monthly_income ?? 0
  if (!income) return 'Add some transactions to see your monthly summary.'
  const ratio = Math.round((spend / income) * 100)
  return `You've spent ${ratio}% of your income so far this month. Your savings goal is ${summary.value.savings_goal?.progress ?? 0}% complete.`
})

const highlightPill = computed(() => {
  const progress = summary.value.savings_goal?.progress ?? 0
  return progress >= 50 ? 'Healthy trend' : 'Keep going'
})

const tipHeadline = computed(() => {
  if (!categories.value.length) return 'No spending data yet this month.'
  const top = categories.value[0]
  return `${top.name} is your top spending category this month.`
})

const tipBody = computed(() => {
  const spend = summary.value.monthly_spend ?? 0
  const income = summary.value.monthly_income ?? 0
  const saved = income - spend
  if (!income) return 'Start adding transactions to unlock insights.'
  return saved > 0
    ? `You have $${fmt(saved)} left after expenses. Keep redirecting the surplus toward your goals.`
    : `Spending exceeded income by $${fmt(Math.abs(saved))} this month. Consider reviewing your budgets.`
})

async function fetchDashboard() {
  loading.value = true
  try {
    const [summaryRes, trendRes, catRes, budgetRes] = await Promise.all([
      api.get('/dashboard/summary'),
      api.get('/dashboard/spending-trend'),
      api.get('/dashboard/category-split'),
      api.get('/dashboard/budget-vs-actual'),
    ])
    summary.value        = summaryRes.data.data
    trend.value          = trendRes.data.data.trend
    categories.value     = catRes.data.data.categories
    categoryTotal.value  = catRes.data.data.total
    budgetVsActual.value = budgetRes.data.data.items
  } catch (err) {
    console.error('Dashboard fetch error:', err)
  } finally {
    loading.value = false
  }
}

function onSaved() {
  fetchDashboard()
}

onMounted(fetchDashboard)
</script>
