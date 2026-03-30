<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Budgets</h1>
        <p>Keep spending aligned with your priorities and avoid overages each month.</p>
      </div>
      <button class="btn btn-brand">Create budget</button>
    </div>

    <div class="row g-4">
      <div class="col-12 col-md-6 col-lg-4" v-for="budget in budgets" :key="budget.title">
        <BudgetCard
          :title="budget.title"
          :category="budget.category"
          :progress="budget.progress"
          :used="budget.used"
          :remaining="budget.remaining"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import BudgetCard from '../components/BudgetCard.vue'

const budgets = [
  { title: 'Groceries', category: 'Monthly food', progress: 72, used: '$420', remaining: '$160' },
  { title: 'Transport', category: 'Commuting', progress: 58, used: '$140', remaining: '$100' },
  { title: 'Entertainment', category: 'Leisure', progress: 49, used: '$95', remaining: '$105' },
  { title: 'Health', category: 'Fitness & care', progress: 36, used: '$72', remaining: '$128' },
  { title: 'Savings', category: 'Build emergency fund', progress: 84, used: '$1,050', remaining: '$200' },
]
</script>
