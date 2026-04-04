<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Goals</h1>
        <p>Track your milestones and stay motivated with measurable progress updates.</p>
      </div>
      <button class="btn btn-brand" @click="showAddGoalModal = true">New goal</button>
    </div>

    <div v-if="loading" class="text-center">
      <p>Loading goals...</p>
    </div>

    <div v-else-if="goals.length === 0" class="alert alert-info">
      <p>No goals yet. Create one to get started!</p>
    </div>

    <div v-else class="row g-4">
      <div class="col-12 col-md-6" v-for="goal in goals" :key="goal.id">
        <GoalCard
          :title="goal.title"
          :target="`$${goal.target}`"
          :progress="goal.progress"
          :description="goal.description"
          @edit="editGoal(goal)"
        />
      </div>
    </div>

    <AddGoalModal v-model="showAddGoalModal" @goal-created="onGoalCreated" />
    <EditGoalModal v-model="showEditGoalModal" :goal="selectedGoal" @goal-updated="onGoalUpdated" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GoalCard from '../components/GoalCard.vue'
import AddGoalModal from '../components/AddGoalModal.vue'
import EditGoalModal from '../components/EditGoalModal.vue'
import api from '../services/api'

const goals = ref([])
const loading = ref(false)
const showAddGoalModal = ref(false)
const showEditGoalModal = ref(false)
const selectedGoal = ref(null)

onMounted(async () => {
  await fetchGoals()
})

async function fetchGoals() {
  loading.value = true
  try {
    const response = await api.get('/goals')
    goals.value = response.data.data.goals
  } catch (error) {
    console.error('Failed to fetch goals:', error)
  } finally {
    loading.value = false
  }
}

function onGoalCreated(newGoal) {
  goals.value.unshift(newGoal)
}

function editGoal(goal) {
  selectedGoal.value = goal
  showEditGoalModal.value = true
}

function onGoalUpdated(updatedGoal) {
  const index = goals.value.findIndex(g => g.id === updatedGoal.id)
  if (index !== -1) {
    goals.value[index] = updatedGoal
  }
}
</script>
