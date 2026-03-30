<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Goals</h1>
        <p>Track your milestones and stay motivated with measurable progress updates.</p>
      </div>
      <button class="btn btn-brand">New goal</button>
    </div>

    <div class="row g-4">
      <div class="col-12 col-md-6" v-for="goal in goals" :key="goal.title">
        <GoalCard
          :title="goal.title"
          :target="goal.target"
          :progress="goal.progress"
          :description="goal.description"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import GoalCard from '../components/GoalCard.vue'

const goals = [
  { title: 'Vacation fund', target: '$3,000', progress: 67, description: 'Saving for summer travel and weekend getaways.' },
  { title: 'Emergency reserve', target: '$5,000', progress: 52, description: 'Building a safety cushion for unexpected expenses.' },
  { title: 'Home upgrades', target: '$1,800', progress: 32, description: 'Set aside money for furniture and repairs.' },
]
</script>
