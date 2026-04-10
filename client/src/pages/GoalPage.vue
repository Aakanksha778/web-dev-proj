<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Goals</h1>
        <p>Track your milestones and stay motivated with measurable progress updates.</p>
      </div>
      <button class="btn btn-brand" @click="showAddGoalModal = true">New goal</button>
    </div>

    <div class="goal-card">
      <div class="goal-card-header">
        <div>
          <p class="panel-kicker">Progress</p>
          <h2 class="goal-title">Your Goals</h2>
          <p class="goal-subtitle">Track savings goals and stay motivated.</p>
        </div>
        <button class="btn btn-primary btn-sm goal-add-btn" @click="showAddGoalModal = true">
          Add goal
        </button>
      </div>

      <div v-if="loading" class="text-center py-4 text-muted">Loading goals...</div>

      <div v-else-if="goals.length === 0" class="text-center py-4 text-muted">
        No goals yet. Create one to get started.
      </div>

      <div v-else class="goal-table-wrap">
        <div class="table-responsive">
          <table class="table align-middle mb-0 goal-table">
            <thead>
              <tr>
                <th>Goal</th>
                <th>Target</th>
                <th>Progress</th>
                <th>Priority</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="goal in sortedGoals" :key="goal.id">
                <td>
                  <div class="goal-item-cell">
                    <span class="goal-item-name">{{ goal.title }}</span>
                    <span v-if="goal.saved >= goal.target" class="goal-complete-badge">Complete!</span>
                  </div>
                </td>
                <td class="goal-target">${{ goal.target }}</td>
                <td>
                  <div class="goal-progress-cell">
                    <div class="goal-progress-track">
                      <span class="goal-progress-fill" :style="{ width: goal.progress + '%' }"></span>
                    </div>
                    <span class="goal-progress-text">{{ goal.progress }}%</span>
                  </div>
                </td>
                <td>
                  <span class="priority-pill">{{ goal.priority }}</span>
                </td>
                <td class="goal-description-cell">{{ goal.description }}</td>
                <td>
                  <div class="goal-actions">
                    <button type="button" class="btn btn-sm btn-outline-secondary goal-edit-btn" @click="editGoal(goal)">
                      Edit
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger goal-delete-btn" @click="deleteGoal(goal)" title="Delete goal">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <AddGoalModal v-model="showAddGoalModal" @goal-created="onGoalCreated" />
    <EditGoalModal
      v-model="showEditGoalModal"
      :goal="selectedGoal"
      @goal-updated="onGoalUpdated"
      @goal-completed="onGoalCompleted"
    />
    <ConfettiBurst v-if="showConfetti" @finished="showConfetti = false" />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AddGoalModal from '../components/AddGoalModal.vue'
import EditGoalModal from '../components/EditGoalModal.vue'
import ConfettiBurst from '../components/ConfettiBurst.vue'
import api from '../services/api'

const PRIORITY_ORDER = { High: 1, Medium: 2, Low: 3 }
const LOCAL_STORAGE_KEY = 'goalPriorities'
const defaultPriority = 'Medium'

const goals = ref([])
const loading = ref(false)
const showAddGoalModal = ref(false)
const showEditGoalModal = ref(false)
const showConfetti = ref(false)
const selectedGoal = ref(null)

const goalPriorities = ref(loadGoalPriorities())

const sortedGoals = computed(() => {
  return [...goals.value].sort((a, b) => {
    const orderA = PRIORITY_ORDER[a.priority || defaultPriority]
    const orderB = PRIORITY_ORDER[b.priority || defaultPriority]
    if (orderA !== orderB) return orderA - orderB
    return new Date(b.created_at) - new Date(a.created_at)
  })
})

function loadGoalPriorities() {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveGoalPriorities() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(goalPriorities.value))
}

function assignPriority(goal, priority = null) {
  const selectedPriority = priority || goal.priority || goalPriorities.value[goal.id] || defaultPriority
  goal.priority = selectedPriority
  goalPriorities.value[goal.id] = selectedPriority
  saveGoalPriorities()
  return goal
}

function removeGoalPriority(goalId) {
  delete goalPriorities.value[goalId]
  saveGoalPriorities()
}

function triggerConfetti() {
  showConfetti.value = true
}

onMounted(async () => {
  await fetchGoals()
})

async function fetchGoals() {
  loading.value = true
  try {
    const response = await api.get('/goals')
    goals.value = response.data.data.goals.map((goal) => assignPriority(goal))
  } catch (error) {
    console.error('Failed to fetch goals:', error)
  } finally {
    loading.value = false
  }
}

function onGoalCreated(payload) {
  const { goal, priority } = payload
  const assigned = assignPriority(goal, priority)
  goals.value.unshift(assigned)
}

function editGoal(goal) {
  selectedGoal.value = goal
  showEditGoalModal.value = true
}

function onGoalUpdated(payload) {
  const { goal, priority } = payload
  const assigned = assignPriority(goal, priority)
  const index = goals.value.findIndex((g) => g.id === assigned.id)
  if (index !== -1) {
    goals.value[index] = assigned
  }
}

async function deleteGoal(goal) {
  if (!window.confirm('Delete this goal? This cannot be undone.')) return

  try {
    await api.delete(`/goals/${goal.id}`)
    goals.value = goals.value.filter((g) => g.id !== goal.id)
    removeGoalPriority(goal.id)
    if (selectedGoal.value?.id === goal.id) {
      selectedGoal.value = null
      showEditGoalModal.value = false
    }
  } catch (error) {
    console.error('Failed to delete goal:', error)
  }
}

function onGoalCompleted() {
  triggerConfetti()
}
</script>
