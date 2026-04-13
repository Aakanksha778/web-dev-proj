<template>
  <section class="budget-page">
    <div v-if="isLoading" class="loading-state">
      <p>Loading budgets...</p>
    </div>

    <div v-if="error" class="error-state">
      <p>{{ error }}</p>
      <button class="btn btn-outline-secondary" @click="loadBudgets">Retry</button>
    </div>

    <template v-if="!isLoading">
      <div class="page-header">
        <div>
          <h1>Budgets</h1>
          <p>Create budgets for different categories, track your real spending, and review how closely you stay on budget.</p>
        </div>
        <button class="btn btn-brand" @click="resetActualSpending" :disabled="isSaving">Reset current spending</button>
      </div>

      <div class="budget-layout">
        <div class="budget-panel budget-builder">
          <div class="panel-header">
            <div>
              <p class="panel-kicker">Budgets</p>
              <h2>Your budget categories</h2>
            </div>
          </div>

          <div v-if="budgetCategories.length === 0" class="empty-state">
            <p>No budgets yet. Create one to get started!</p>
          </div>

          <div class="category-table">
            <div class="category-table-head">
              <span>Category</span>
              <span>Name/Title</span>
              <span>Budget Limit</span>
              <span>Actions</span>
            </div>

            <div v-for="budget in budgetCategories" :key="budget.id" class="category-row">
              <input
                v-model="budget.category"
                type="text"
                class="form-control"
                placeholder="Category"
                @blur="updateBudget(budget)"
              />
              <input
                v-model="budget.title"
                type="text"
                class="form-control"
                placeholder="Budget name"
                @blur="updateBudget(budget)"
              />
              <div class="budget-amount-input">
                <span class="money-prefix">$</span>
                <input
                  v-model.number="budget.limit_amount"
                  type="number"
                  min="0"
                  step="1"
                  class="form-control"
                  @blur="updateBudget(budget)"
                />
              </div>
              <button
                class="btn btn-outline-danger btn-sm"
                @click="removeCategory(budget.id)"
                :disabled="isSaving"
              >
                Remove
              </button>
            </div>
          </div>

          <div class="builder-actions">
            <button class="btn btn-outline-secondary" @click="addCategory" :disabled="isSaving">Add budget</button>
          </div>
        </div>

        <div class="budget-panel chart-panel">
          <div class="chart-header">
            <div>
              <p class="panel-kicker">Planned budget</p>
              <h2>Your budgets</h2>
            </div>
            <span class="chart-total">{{ formatCurrency(totalPlannedMonthlyBudget) }}/month</span>
          </div>

          <div class="pie-layout">
            <div class="pie-wrap">
              <div class="pie-chart" :style="plannedChartStyle">
                <div class="pie-chart-center">
                  <span>Budget</span>
                  <strong>{{ formatCurrency(totalPlannedMonthlyBudget) }}</strong>
                </div>
              </div>
            </div>

            <div class="legend-list">
              <div v-if="plannedLegend.length === 0" class="empty-state">
                Add budgets to see them displayed here.
              </div>
              <div v-for="item in plannedLegend" :key="item.id" class="legend-item">
                <span class="legend-dot" :style="{ backgroundColor: item.color }"></span>
                <div class="legend-text">
                  <strong>{{ item.name }}</strong>
                  <span>{{ item.percent.toFixed(0) }}% · {{ formatCurrency(item.amount) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="budget-layout second-row">
      <div class="budget-panel chart-panel">
        <div class="chart-header">
          <div>
            <p class="panel-kicker">Actual spending</p>
            <h2>Update expenses as you spend</h2>
          </div>
          <span class="chart-total">{{ formatCurrency(totalActualSpending) }} spent</span>
        </div>

        <div class="expense-entry-box">
          <div class="expense-grid">
            <div>
              <label class="field-label">Category</label>
              <select v-model="expenseForm.categoryId" class="form-control">
                <option value="">Choose category</option>
                <option v-for="budget in budgetCategories" :key="budget.id" :value="budget.id">
                  {{ budget.title || budget.category || 'Untitled' }}
                </option>
              </select>
            </div>
            <div>
              <label class="field-label">Expense amount</label>
              <div class="income-input-wrap">
                <span class="money-prefix">$</span>
                <input
                  v-model.number="expenseForm.amount"
                  type="number"
                  min="0"
                  step="1"
                  class="form-control"
                  placeholder="0"
                />
              </div>
            </div>
            <div class="expense-button-wrap">
              <button class="btn btn-brand w-100" @click="addExpense">Add expense</button>
            </div>
          </div>
        </div>

        <div class="pie-layout">
          <div class="pie-wrap">
            <div class="pie-chart" :style="actualChartStyle">
              <div class="pie-chart-center">
                <span>Actual</span>
                <strong>{{ totalActualSpending > 0 ? formatCurrency(totalActualSpending) : 'Blank' }}</strong>
              </div>
            </div>
          </div>

          <div class="legend-list">
            <div v-if="actualLegend.length === 0" class="empty-state">
              Add expenses to fill this chart.
            </div>
            <div v-for="item in actualLegend" :key="item.id" class="legend-item">
              <span class="legend-dot" :style="{ backgroundColor: item.color }"></span>
              <div class="legend-text">
                <strong>{{ item.name }}</strong>
                <span>{{ item.share.toFixed(0) }}% · {{ formatCurrency(item.amount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="budget-panel analysis-panel">
        <div class="chart-header">
          <div>
            <p class="panel-kicker">Current month analysis</p>
            <h2>How you are tracking</h2>
          </div>
        </div>

        <div class="analysis-cards">
          <div class="analysis-card">
            <span>Total planned</span>
            <strong>{{ formatCurrency(totalPlannedMonthlyBudget) }}</strong>
          </div>
          <div class="analysis-card">
            <span>Total spent</span>
            <strong>{{ formatCurrency(totalActualSpending) }}</strong>
          </div>
          <div class="analysis-card" :class="statusTone.className">
            <span>Status</span>
            <strong>{{ statusTone.title }}</strong>
          </div>
        </div>

        <div class="analysis-message">
          <p>{{ currentMonthReview }}</p>
        </div>

        <div class="comparison-list">
          <div v-for="item in analysisRows" :key="item.id" class="comparison-row">
            <div>
              <strong>{{ item.name }}</strong>
              <span>Budget {{ formatCurrency(item.planned) }}</span>
            </div>
            <div class="comparison-right">
              <strong>{{ formatCurrency(item.actual) }}</strong>
              <span :class="item.deltaClass">{{ item.deltaText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="budget-panel history-panel">
      <div class="chart-header history-header">
        <div>
          <p class="panel-kicker">Past performance</p>
          <h2>Review previous months</h2>
        </div>
        <div class="history-tabs">
          <button
            v-for="option in [1, 3, 6]"
            :key="option"
            class="history-tab"
            :class="{ active: selectedHistoryWindow === option }"
            @click="selectedHistoryWindow = option"
          >
            {{ option }} {{ option === 1 ? 'month' : 'months' }}
          </button>
        </div>
      </div>

      <div class="history-summary">
        <div class="summary-chip">
          <span>Average adherence</span>
          <strong>{{ averageAdherence.toFixed(0) }}%</strong>
        </div>
        <div class="summary-chip">
          <span>Average monthly spend</span>
          <strong>{{ formatCurrency(averageHistorySpend) }}</strong>
        </div>
        <div class="summary-chip">
          <span>Best month</span>
          <strong>{{ bestHistoryMonth }}</strong>
        </div>
      </div>

      <div class="history-list">
        <div v-for="month in visibleHistory" :key="month.label" class="history-row">
          <div>
            <strong>{{ month.label }}</strong>
            <span>{{ month.note }}</span>
          </div>
          <div class="history-metrics">
            <span>Spent {{ formatCurrency(month.actual) }}</span>
            <span>Budget {{ formatCurrency(month.planned) }}</span>
            <span :class="month.adherence >= 100 ? 'positive-text' : 'warning-text'">
              {{ month.adherence.toFixed(0) }}% adherence
            </span>
          </div>
        </div>
      </div>
    </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import api from '../services/api'

const defaultColors = ['#13b38e', '#4f46e5', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444', '#8b5cf6', '#84cc16']

const yearlyIncome = ref(0)
const selectedHistoryWindow = ref(3)

const budgetCategories = ref([])
const expenseForm = reactive({
  categoryId: '',
  amount: null,
})

const isLoading = ref(true)
const isSaving = ref(false)
const error = ref(null)
const history = ref([])

const monthlyIncome = computed(() => Number(yearlyIncome.value || 0) / 12)

const sanitizedCategories = computed(() => {
  return budgetCategories.value.map((budget, index) => ({
    id: budget.id,
    name: budget.title || budget.category || `Category ${index + 1}`,
    percent: 0,
    color: defaultColors[index % defaultColors.length],
    ...budget,
  }))
})

const totalAllocatedPercent = computed(() => {
  return 100
})

const totalPlannedMonthlyBudget = computed(() => {
  return sanitizedCategories.value.reduce((sum, category) => sum + Number(category.limit_amount || 0), 0)
})

const allocationGap = computed(() => 0)

const allocationStatusLabel = computed(() => {
  if (allocationGap.value > 0) return 'Still available'
  if (allocationGap.value < 0) return 'Over allocated'
  return 'On target'
})

const allocationStatusValue = computed(() => {
  if (allocationGap.value > 0) return `${allocationGap.value.toFixed(0)}%`
  if (allocationGap.value < 0) return `${Math.abs(allocationGap.value).toFixed(0)}%`
  return '100%'
})

const allocationStatusClass = computed(() => {
  if (allocationGap.value > 0) return 'is-neutral'
  if (allocationGap.value < 0) return 'is-danger'
  return 'is-good'
})

const plannedLegend = computed(() => {
  return sanitizedCategories.value
    .filter((category) => Number(category.limit_amount) > 0)
    .map((category) => ({
      id: category.id,
      name: category.name,
      percent: (Number(category.limit_amount) / totalPlannedMonthlyBudget.value) * 100,
      amount: Number(category.limit_amount || 0),
      color: category.color,
    }))
})

const totalActualSpending = computed(() => {
  return sanitizedCategories.value.reduce((sum, category) => sum + Number(category.used || 0), 0)
})

const actualLegend = computed(() => {
  const total = totalActualSpending.value
  return sanitizedCategories.value
    .map((category) => {
      const amount = Number(category.used || 0)
      return {
        id: category.id,
        name: category.name,
        amount,
        color: category.color,
        share: total > 0 ? (amount / total) * 100 : 0,
      }
    })
    .filter((item) => item.amount > 0)
})

const spendingDifference = computed(() => totalPlannedMonthlyBudget.value - totalActualSpending.value)

const statusTone = computed(() => {
  if (totalActualSpending.value === 0) {
    return { title: 'Not started', className: 'is-neutral' }
  }
  if (spendingDifference.value >= 0) {
    return { title: 'On track', className: 'is-good' }
  }
  return { title: 'Over budget', className: 'is-danger' }
})

const analysisRows = computed(() => {
  return sanitizedCategories.value.map((category) => {
    const planned = Number(category.limit_amount || 0)
    const actual = Number(category.used || 0)
    const delta = planned - actual
    return {
      id: category.id,
      name: category.name,
      planned,
      actual,
      deltaClass: delta >= 0 ? 'positive-text' : 'danger-text',
      deltaText: delta >= 0 ? `${formatCurrency(delta)} left` : `${formatCurrency(Math.abs(delta))} over`,
    }
  })
})

const currentMonthReview = computed(() => {
  if (totalActualSpending.value === 0) {
    return 'Your actual spending chart is still blank. Start adding expenses to see how closely your real spending matches your planned budget.'
  }

  const biggestOver = analysisRows.value
    .filter((item) => item.actual > item.planned)
    .sort((a, b) => (b.actual - b.planned) - (a.actual - a.planned))[0]

  const biggestUnder = analysisRows.value
    .filter((item) => item.actual <= item.planned)
    .sort((a, b) => (b.planned - b.actual) - (a.planned - a.actual))[0]

  if (spendingDifference.value >= 0) {
    return biggestUnder
      ? `You are currently within budget overall. Your strongest category is ${biggestUnder.name}, where you still have ${formatCurrency(biggestUnder.planned - biggestUnder.actual)} available this month.`
      : 'You are currently within budget overall and your spending is staying close to plan.'
  }

  return biggestOver
    ? `You are currently over budget. ${biggestOver.name} is driving the biggest gap, exceeding its target by ${formatCurrency(biggestOver.actual - biggestOver.planned)}.`
    : 'You are currently over budget overall, so this would be a good time to slow spending in non-essential categories.'
})

const visibleHistory = computed(() => {
  return history.value.slice(0, selectedHistoryWindow.value).map((month) => ({
    ...month,
    adherence: month.actual > 0 ? Math.min((month.planned / month.actual) * 100, 140) : 100,
  }))
})

const averageAdherence = computed(() => {
  if (visibleHistory.value.length === 0) return 0
  return visibleHistory.value.reduce((sum, month) => sum + month.adherence, 0) / visibleHistory.value.length
})

const averageHistorySpend = computed(() => {
  if (visibleHistory.value.length === 0) return 0
  return visibleHistory.value.reduce((sum, month) => sum + month.actual, 0) / visibleHistory.value.length
})

const bestHistoryMonth = computed(() => {
  if (visibleHistory.value.length === 0) return 'None'
  const best = [...visibleHistory.value].sort((a, b) => b.adherence - a.adherence)[0]
  return best?.label || 'None'
})

const plannedChartStyle = computed(() => buildPieBackground(plannedLegend.value, totalAllocatedPercent.value, false))
const actualChartStyle = computed(() => buildPieBackground(actualLegend.value, totalActualSpending.value, true))

watch(
  budgetCategories,
  (categories) => {
    if (!expenseForm.categoryId && categories.length) {
      expenseForm.categoryId = categories[0].id
    }
  },
  { immediate: true, deep: true }
)

function formatCurrency(value) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function getMonthlyAmount(percent) {
  return monthlyIncome.value * ((Number(percent) || 0) / 100)
}

async function updateBudget(budget) {
  try {
    isSaving.value = true
    await api.put(`/budgets/${budget.id}`, {
      title: budget.title,
      category: budget.category,
      limit_amount: budget.limit_amount,
      period: budget.period,
    })
  } catch (err) {
    error.value = 'Failed to update budget'
    console.error('Error updating budget:', err)
  } finally {
    isSaving.value = false
  }
}

async function loadBudgets() {
  try {
    isLoading.value = true
    error.value = null
    const response = await api.get('/budgets')
    budgetCategories.value = response.data.data.budgets || []
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to load budgets'
    console.error('Error loading budgets:', err)
  } finally {
    isLoading.value = false
  }
}

async function addCategory() {
  try {
    isSaving.value = true
    const response = await api.post('/budgets', {
      title: 'New Budget',
      category: 'Other',
      limit_amount: 100,
      period: 'monthly',
    })
    budgetCategories.value.push(response.data.data.budget)
  } catch (err) {
    error.value = 'Failed to create budget'
    console.error('Error creating budget:', err)
  } finally {
    isSaving.value = false
  }
}

async function removeCategory(categoryId) {
  try {
    isSaving.value = true
    await api.delete(`/budgets/${categoryId}`)
    budgetCategories.value = budgetCategories.value.filter((cat) => cat.id !== categoryId)
  } catch (err) {
    error.value = 'Failed to delete budget'
    console.error('Error deleting budget:', err)
  } finally {
    isSaving.value = false
  }
}

async function addExpense() {
  if (!expenseForm.categoryId || !expenseForm.amount || expenseForm.amount <= 0) return

  try {
    isSaving.value = true
    const budget = sanitizedCategories.value.find((cat) => cat.id == expenseForm.categoryId)
    const categoryName = budget?.category || 'Other'
    const budgetName = budget?.title || 'Budget'

    // Format date as YYYY-MM-DD
    const today = new Date()
    const dateString = today.toISOString().split('T')[0]

    await api.post('/transactions', {
      description: `Expense for ${budgetName}`,
      category: categoryName,
      amount: Number(expenseForm.amount),
      type: 'expense',
      status: 'paid',
      date: dateString,
    })

    expenseForm.amount = null
    expenseForm.categoryId = ''
    
    // Reload budgets to get updated spending amounts
    await loadBudgets()
  } catch (err) {
    error.value = 'Failed to add expense: ' + (err.response?.data?.error || err.message)
    console.error('Error adding expense:', err)
  } finally {
    isSaving.value = false
  }
}

async function resetActualSpending() {
  try {
    isSaving.value = true
    const currentMonth = new Date()
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    // Format as YYYY-MM-DD for consistency
    const formatDateYYYYMMDD = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const response = await api.get('/transactions', {
      params: {
        from: formatDateYYYYMMDD(monthStart),
        to: formatDateYYYYMMDD(monthEnd),
      },
    })

    const transactions = response.data.data.transactions || []
    for (const transaction of transactions) {
      if (transaction.type === 'expense') {
        try {
          await api.delete(`/transactions/${transaction.id}`)
        } catch (deleteErr) {
          console.error('Error deleting transaction:', deleteErr)
        }
      }
    }

    await loadBudgets()
  } catch (err) {
    error.value = 'Failed to reset spending: ' + (err.response?.data?.error || err.message)
    console.error('Error resetting spending:', err)
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadBudgets()
})

function buildPieBackground(items, totalValue, useAmounts) {
  if (!items.length || totalValue <= 0) {
    return {
      background: 'conic-gradient(#e2e8f0 0deg 360deg)',
    }
  }

  let start = 0
  const segments = items.map((item) => {
    const value = useAmounts ? item.amount : item.percent
    const angle = (value / totalValue) * 360
    const end = start + angle
    const segment = `${item.color} ${start}deg ${end}deg`
    start = end
    return segment
  })

  if (start < 360) {
    segments.push(`#e2e8f0 ${start}deg 360deg`)
  }

  return {
    background: `conic-gradient(${segments.join(', ')})`,
  }
}
</script>

<style scoped>
.budget-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.loading-state,
.error-state {
  padding: 2rem;
  text-align: center;
  background: #f8fafc;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
}

.error-state {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.error-state button {
  margin-top: 1rem;
}

.empty-state {
  padding: 1.5rem;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
}

.budget-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1.25rem;
}

.second-row {
  grid-template-columns: 1fr 1fr;
}

.budget-panel {
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 1.25rem;
  padding: 1.25rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.panel-header,
.chart-header,
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.panel-kicker {
  margin: 0 0 0.35rem;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #13b38e;
  font-weight: 700;
}

h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #0f172a;
}

.field-label {
  display: block;
  margin-bottom: 0.45rem;
  font-size: 0.9rem;
  color: #475569;
  font-weight: 600;
}

.income-row {
  margin-bottom: 1rem;
}

.income-input-wrap,
.percent-input-wrap {
  position: relative;
}

.money-prefix,
.percent-suffix {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 0.92rem;
}

.money-prefix {
  left: 0.9rem;
}

.percent-suffix {
  right: 0.9rem;
}

.income-input-wrap .form-control {
  padding-left: 1.75rem;
}

.percent-input-wrap .form-control {
  padding-right: 2rem;
}

.summary-strip,
.history-summary,
.analysis-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.summary-chip,
.analysis-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.summary-chip span,
.analysis-card span,
.chart-total {
  color: #64748b;
  font-size: 0.86rem;
}

.summary-chip strong,
.analysis-card strong,
.chart-total {
  color: #0f172a;
  font-weight: 700;
}

.is-good {
  background: #ecfdf5;
  border-color: #bbf7d0;
}

.is-neutral {
  background: #f8fafc;
}

.is-danger {
  background: #fef2f2;
  border-color: #fecaca;
}

.category-table {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.category-table-head,
.category-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr 1fr;
  gap: 0.75rem;
  align-items: center;
}

.category-table-head {
  padding: 0 0.15rem;
  color: #64748b;
  font-size: 0.84rem;
  font-weight: 700;
}

.category-row {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 0.75rem;
}

.category-amount {
  color: #0f172a;
  font-weight: 700;
}

.budget-amount-input {
  position: relative;
}

.budget-amount-input .form-control {
  padding-left: 1.75rem;
}

.builder-actions {
  margin-top: 1rem;
}

.pie-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 1.25rem;
  align-items: center;
}

.pie-wrap {
  display: flex;
  justify-content: center;
}

.pie-chart {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
}

.pie-chart-center {
  position: absolute;
  inset: 24%;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.5rem;
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.2);
}

.pie-chart-center span {
  font-size: 0.8rem;
  color: #64748b;
}

.pie-chart-center strong {
  font-size: 1rem;
  color: #0f172a;
}

.legend-list,
.comparison-list,
.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legend-item,
.comparison-row,
.history-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0.9rem;
  border-radius: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.legend-item {
  align-items: center;
}

.legend-dot {
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
}

.legend-text span,
.comparison-row span,
.history-row span,
.analysis-message p {
  color: #64748b;
  font-size: 0.88rem;
}

.expense-entry-box {
  margin-bottom: 1rem;
}

.expense-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr auto;
  gap: 0.75rem;
  align-items: end;
}

.expense-button-wrap {
  display: flex;
  align-items: end;
}

.empty-state {
  padding: 1rem;
  border-radius: 1rem;
  background: #f8fafc;
  color: #64748b;
  border: 1px dashed #cbd5e1;
}

.analysis-message {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 1rem;
  background: linear-gradient(180deg, #f8fffb 0%, #eefbf6 100%);
  border: 1px solid #d1fae5;
}

.analysis-message p {
  margin: 0;
  line-height: 1.6;
}

.comparison-right,
.history-metrics {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
}

.history-tabs {
  display: inline-flex;
  background: #f1f5f9;
  border-radius: 999px;
  padding: 0.2rem;
}

.history-tab {
  border: 0;
  background: transparent;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  color: #475569;
  font-weight: 600;
}

.history-tab.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.08);
}

.positive-text {
  color: #15803d !important;
}

.warning-text {
  color: #b45309 !important;
}

.danger-text {
  color: #b91c1c !important;
}

.w-100 {
  width: 100%;
}

@media (max-width: 1100px) {
  .budget-layout,
  .second-row,
  .pie-layout {
    grid-template-columns: 1fr;
  }

  .pie-wrap {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .summary-strip,
  .history-summary,
  .analysis-cards,
  .expense-grid,
  .category-table-head,
  .category-row {
    grid-template-columns: 1fr;
  }

  .legend-item,
  .comparison-row,
  .history-row,
  .history-header,
  .panel-header,
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .comparison-right,
  .history-metrics {
    align-items: flex-start;
  }
}
</style>