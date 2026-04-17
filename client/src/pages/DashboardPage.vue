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
        <div class="col-12 col-lg-4">
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

        <div class="col-12 col-lg-8">
          <div class="card page-card dashboard-tip-card p-4 h-100">
            <p class="panel-kicker">Quick insight</p>
            <h2 class="dashboard-tip-title">{{ tipHeadline }}</h2>
            <p class="muted">{{ tipBody }}</p>

            <div class="dashboard-summary-row">
              <div v-for="stat in summaryStats" :key="stat.title" class="stat-card">
                <div class="stat-icon" :class="stat.accent">{{ stat.icon }}</div>
                <div class="stat-copy">
                  <span class="stat-label">{{ stat.title }}</span>
                  <strong>{{ stat.value }}</strong>
                  <p class="stat-meta">{{ stat.subtitle }}</p>
                </div>
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

const summaryStats = computed(() => [
  {
    title:    'Income',
    value:    `$${fmt(summary.value.monthly_income)}`,
    subtitle: 'This month',
    icon:     '💵',
    accent:   'income',
  },
  {
    title:    'Spent',
    value:    `$${fmt(summary.value.monthly_spend)}`,
    subtitle: 'This month',
    icon:     '📉',
    accent:   'spent',
  },
  {
    title:    'Savings',
    value:    `${summary.value.savings_goal?.progress ?? 0}%`,
    subtitle: 'Goal progress',
    icon:     '🥅',
    accent:   'savings',
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

<style scoped>
.dashboard-panel {
  min-height: 340px;
}
.dashboard-tip-card {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.dashboard-summary-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.stat-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border-radius: 20px;
  background: var(--panel-strong, #ffffff);
  border: 1px solid rgba(31, 107, 87, 0.08);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
}
.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 1.05rem;
  flex-shrink: 0;
}
.stat-icon.income {
  background: rgba(16, 185, 129, 0.14);
  color: #10b981;
}
.stat-icon.spent {
  background: rgba(239, 68, 68, 0.14);
  color: #ef4444;
}
.stat-icon.savings {
  background: rgba(59, 130, 246, 0.14);
  color: #3b82f6;
}
.stat-copy {
  min-width: 0;
}
.stat-label {
  display: block;
  color: var(--muted);
  font-size: 0.82rem;
  margin-bottom: 0.35rem;
}
.stat-card strong {
  display: block;
  font-size: 1.18rem;
  color: var(--text);
  margin-bottom: 0.35rem;
}
.stat-meta {
  margin: 0;
  color: var(--muted);
  font-size: 0.86rem;
}
@media (max-width: 900px) {
  .dashboard-summary-row {
    grid-template-columns: 1fr;
  }
}
</style>
