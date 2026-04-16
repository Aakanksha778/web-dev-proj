<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Goals</h1>
        <p>Track your milestones and stay motivated with measurable progress updates.</p>
      </div>
    </div>

    <div class="goal-card">
      <div class="goal-card-header">
        <div>
          <p class="panel-kicker">Progress</p>
          <h2 class="goal-title">Your Goals</h2>
          <p class="goal-subtitle">High priority goals stay at the top, then medium, then low.</p>
        </div>
        <button class="btn btn-primary btn-sm goal-add-btn" @click="showAddGoalModal = true">
          Add goal
        </button>
      </div>

      <div v-if="loading" class="text-center py-4 text-muted">Loading goals...</div>

      <div v-else-if="goals.length === 0" class="text-center py-4 text-muted">
        No goals yet. Create one to get started.
      </div>

      <div v-else class="goal-sections">
        <div
          v-for="group in priorityGroups"
          :key="group.priority"
          v-show="group.goals.length"
          class="goal-priority-section"
        >
          <div class="goal-section-header">
            <div class="goal-section-title-row">
              <span class="goal-section-priority-badge" :class="'priority-' + String(group.priority).toLowerCase()">
                {{ group.priority }}
              </span>
              <h3>{{ group.goals.length }} {{ group.goals.length === 1 ? 'goal' : 'goals' }}</h3>
            </div>
          </div>

          <div class="goal-grid">
            <div
              v-for="goal in group.goals"
              :key="goal.id"
              class="goal-flip-card"
              :class="{ 'is-flipped': flippedGoalIds.includes(goal.id) }"
              @click="toggleCard(goal.id)"
            >
              <div class="goal-flip-card-inner">
                <article class="goal-flip-face goal-flip-front">
                  <div class="goal-item-top">
                    <div>
                      <div class="goal-item-cell">
                        <span class="goal-item-name">{{ goal.title }}</span>
                        <span v-if="goal.saved >= goal.target" class="goal-complete-badge">Complete!</span>
                      </div>
                      <span class="priority-pill" :class="priorityClass(goal.priority)">{{ goal.priority }}</span>
                    </div>

                    <div class="goal-actions" @click.stop>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary goal-edit-btn"
                        @click="editGoal(goal)"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-danger goal-delete-btn"
                        @click="deleteGoal(goal)"
                        title="Delete goal"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <p class="goal-description-cell">{{ goal.description || 'No description added yet.' }}</p>

                  <div class="goal-progress-cell">
                    <div class="goal-progress-percentage">{{ goal.progress }}%</div>
                  </div>

                  <div class="goal-card-footer">
                    <span class="goal-target">Target: {{ formatCurrency(goal.target) }}</span>
                    <span class="goal-flip-hint">Click to view budget details</span>
                  </div>
                </article>

                <article class="goal-flip-face goal-flip-back">
                  <div class="goal-back-header">
                    <div>
                      <div class="goal-item-cell">
                        <span class="goal-item-name">{{ goal.title }}</span>
                        <span v-if="goal.saved >= goal.target" class="goal-complete-badge">Complete!</span>
                      </div>
                      <span class="priority-pill" :class="priorityClass(goal.priority)">{{ goal.priority }}</span>
                    </div>
                    <span class="goal-flip-hint">Click to flip back</span>
                  </div>

                  <div class="goal-budget-stats">
                    <div class="goal-budget-stat">
                      <span class="goal-budget-label">Budget target</span>
                      <strong>{{ formatCurrency(goal.target) }}</strong>
                    </div>
                    <div class="goal-budget-stat">
                      <span class="goal-budget-label">Saved so far</span>
                      <strong>{{ formatCurrency(goal.saved || 0) }}</strong>
                    </div>
                    <div class="goal-budget-stat">
                      <span class="goal-budget-label">Remaining</span>
                      <strong>{{ formatCurrency(getRemaining(goal)) }}</strong>
                    </div>
                    <div class="goal-budget-stat">
                      <span class="goal-budget-label">Progress</span>
                      <strong>{{ goal.progress }}%</strong>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
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
const PRIORITY_LIST = ['High', 'Medium', 'Low']
const LOCAL_STORAGE_KEY = 'goalPriorities'
const defaultPriority = 'Medium'

const goals = ref([])
const loading = ref(false)
const showAddGoalModal = ref(false)
const showEditGoalModal = ref(false)
const showConfetti = ref(false)
const selectedGoal = ref(null)
const flippedGoalIds = ref([])

const goalPriorities = ref(loadGoalPriorities())

const sortedGoals = computed(() => {
  return [...goals.value].sort((a, b) => {
    const orderA = PRIORITY_ORDER[a.priority || defaultPriority] ?? PRIORITY_ORDER[defaultPriority]
    const orderB = PRIORITY_ORDER[b.priority || defaultPriority] ?? PRIORITY_ORDER[defaultPriority]

    if (orderA !== orderB) return orderA - orderB

    return new Date(b.created_at || 0) - new Date(a.created_at || 0)
  })
})

const priorityGroups = computed(() => {
  return PRIORITY_LIST.map((priority) => ({
    priority,
    goals: sortedGoals.value.filter((goal) => (goal.priority || defaultPriority) === priority),
  }))
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

function toggleCard(goalId) {
  if (flippedGoalIds.value.includes(goalId)) {
    flippedGoalIds.value = flippedGoalIds.value.filter((id) => id !== goalId)
    return
  }

  flippedGoalIds.value.push(goalId)
}

function priorityClass(priority) {
  return `priority-${String(priority || defaultPriority).toLowerCase()}`
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

function getRemaining(goal) {
  return Math.max((Number(goal.target) || 0) - (Number(goal.saved) || 0), 0)
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
    flippedGoalIds.value = flippedGoalIds.value.filter((id) => id !== goal.id)
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

<style scoped>
.goal-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.goal-priority-section {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.goal-section-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  padding: 0.5rem 0;
}

.goal-section-title-row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.goal-section-priority-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.goal-section-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}

.priority-high {
  background: #fee2e2;
  color: #b91c1c;
}

.priority-medium {
  background: #fef3c7;
  color: #b45309;
}

.priority-low {
  background: #dcfce7;
  color: #15803d;
}

.goal-section-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}

.goal-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.goal-flip-card {
  perspective: 1200px;
  min-height: 320px;
  cursor: pointer;
}

.goal-flip-card-inner {
  position: relative;
  width: 100%;
  min-height: 320px;
  transition: transform 0.7s;
  transform-style: preserve-3d;
}

.goal-flip-card.is-flipped .goal-flip-card-inner {
  transform: rotateY(180deg);
}

.goal-flip-face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem;
  border-radius: 1rem;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.goal-flip-front {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.goal-flip-back {
  transform: rotateY(180deg);
  background: linear-gradient(180deg, #f8fffb 0%, #eefaf4 100%);
}

.goal-item-top,
.goal-back-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.goal-item-cell {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.goal-item-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}

.goal-complete-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
  background: rgba(19, 179, 142, 0.12);
  color: #0f8b6e;
  font-size: 0.76rem;
  font-weight: 700;
}

.priority-pill {
  display: inline-flex;
  align-items: center;
  margin-top: 0.55rem;
  padding: 0.28rem 0.72rem;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
}

.priority-high {
  background: #fee2e2;
  color: #b91c1c;
}

.priority-medium {
  background: #fef3c7;
  color: #b45309;
}

.priority-low {
  background: #dcfce7;
  color: #15803d;
}

.goal-description-cell {
  margin: 0;
  min-height: 44px;
  color: #475569;
  line-height: 1.5;
}

.goal-progress-cell {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.goal-progress-percentage {
  text-align: center;
  font-weight: 700;
  font-size: 2.5rem;
  line-height: 1;
  color: #13b38e;
}

.goal-progress-percentage-back {
  font-size: 2.2rem;
}

.goal-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.88rem;
  color: #64748b;
}

.goal-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.goal-flip-hint,
.goal-budget-label {
  font-size: 0.88rem;
  color: #64748b;
}

.goal-progress-labels {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #64748b;
}

.goal-budget-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.goal-budget-stat {
  padding: 0.9rem;
  border-radius: 0.85rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.15);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.goal-budget-stat strong {
  font-size: 1rem;
  color: #0f172a;
}

@media (max-width: 768px) {
  .goal-grid,
  .goal-budget-stats {
    grid-template-columns: 1fr;
  }

  .goal-item-top,
  .goal-back-header,
  .goal-card-footer,
  .goal-progress-labels,
  .goal-section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* ── Dark mode ────────────────────────────────────────────────── */
[data-theme="dark"] .goal-section-header h3 {
  color: var(--text);
}

[data-theme="dark"] .goal-flip-face {
  border-color: var(--border);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .goal-flip-front {
  background: linear-gradient(180deg, var(--panel-strong) 0%, var(--bg-elevated) 100%);
}

[data-theme="dark"] .goal-flip-back {
  background: linear-gradient(180deg, rgba(30, 51, 35, 0.98) 0%, rgba(24, 42, 28, 0.97) 100%);
}

[data-theme="dark"] .goal-item-name {
  color: var(--text);
}

[data-theme="dark"] .goal-description-cell {
  color: var(--muted);
}

[data-theme="dark"] .goal-card-footer,
[data-theme="dark"] .goal-flip-hint,
[data-theme="dark"] .goal-budget-label,
[data-theme="dark"] .goal-progress-labels {
  color: var(--muted);
}

[data-theme="dark"] .goal-budget-stat {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--border);
}

[data-theme="dark"] .goal-budget-stat strong {
  color: var(--text);
}

[data-theme="dark"] .priority-high {
  background: rgba(185, 28, 28, 0.18);
  color: #fca5a5;
}

[data-theme="dark"] .priority-medium {
  background: rgba(180, 83, 9, 0.18);
  color: #fcd34d;
}

[data-theme="dark"] .priority-low {
  background: rgba(21, 128, 61, 0.18);
  color: #86efac;
}
</style>
