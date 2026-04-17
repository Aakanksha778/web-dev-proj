<template>
  <section>
    <div class="page-header page-header-with-action">
      <div>
        <h1>Goals</h1>
        <p>Track your milestones and stay motivated with measurable progress updates.</p>
      </div>
      <button
        type="button"
        class="btn btn-primary"
        @click="showAddGoalModal = true"
      >
        + Add Goal
      </button>
    </div>

    <div class="goal-card">
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
            >
              <div class="goal-flip-card-inner">
                <article class="goal-flip-face goal-flip-front" :class="{ complete: goal.saved >= goal.target }" @click="toggleCard(goal.id)">
                  <div class="goal-item-top">
                    <div class="goal-actions goal-actions-start" @click.stop>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary goal-edit-btn"
                        @click="editGoal(goal)"
                      >
                        Edit
                      </button>
                    </div>

                    <div class="goal-actions" @click.stop>
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

                  <div class="goal-progress-summary">
                    <h2 class="goal-front-title" :class="priorityClass(goal.priority)">{{ goal.title }}</h2>
                    <template v-if="goal.progress >= 100">
                      <div class="goal-complete-center">Complete</div>
                    </template>
                    <template v-else>
                      <div class="goal-progress-percentage">{{ goal.progress }}%</div>
                      <div class="goal-progress-track">
                        <span class="goal-progress-fill" :style="{ width: `${goal.progress}%` }"></span>
                      </div>
                    </template>
                  </div>

                  <p class="goal-description-cell">{{ goal.description || 'No description added yet.' }}</p>

                  <div class="goal-card-footer">
                    <span class="goal-target">Target: {{ formatCurrency(goal.target) }}</span>
                    <div class="goal-card-actions">
                      <button type="button" class="goal-detail-btn" @click.stop.prevent="toggleCard(goal.id)">
                        View budget details <span class="goal-detail-icon">→</span>
                      </button>
                    </div>
                  </div>
                </article>

                <article class="goal-flip-face goal-flip-back" @click="toggleCard(goal.id)">
                  <div class="goal-back-header">
                    <div>
                      <div class="goal-item-cell">
                        <span class="goal-item-name" :class="priorityClass(goal.priority)">{{ goal.title }}</span>
                      </div>
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
  padding: 0.6rem 0.9rem 1.1rem;
}

.goal-priority-section {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 0 0.75rem;
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
  color: var(--text);
}

.priority-pill.priority-high,
.goal-section-priority-badge.priority-high {
  background: #fee2e2;
  color: #b91c1c;
}

.priority-pill.priority-medium,
.goal-section-priority-badge.priority-medium {
  background: #fef3c7;
  color: #b45309;
}

.priority-pill.priority-low,
.goal-section-priority-badge.priority-low {
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
  min-height: 360px;
  cursor: pointer;
}

.goal-flip-card-inner {
  position: relative;
  width: 100%;
  min-height: 360px;
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
  padding: 1.25rem;
  border-radius: 1rem;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border: 1px solid var(--border);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.goal-flip-face.complete {
  border-color: rgba(16, 185, 129, 0.35);
  box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.12), 0 16px 40px rgba(18, 56, 45, 0.15);
}

.goal-flip-card.goal-add-placeholder,
.goal-flip-card {
  min-height: 320px;
}

.goal-flip-front {
  background: linear-gradient(180deg, var(--panel-strong) 0%, var(--bg-elevated) 100%);
}

.goal-flip-back {
  transform: rotateY(180deg);
  background: linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-soft) 100%);
}

.goal-item-top,
.goal-back-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.goal-actions-start {
  justify-content: flex-start;
}

.goal-actions button.goal-edit-btn,
.goal-actions button.goal-delete-btn {
  border: 1px solid var(--border);
  background: var(--panel-strong);
  color: var(--text);
  box-shadow: none;
  transition: border-color 0.16s ease, background 0.16s ease, transform 0.16s ease;
}

.goal-actions button.goal-edit-btn:hover,
.goal-actions button.goal-delete-btn:hover {
  border-color: var(--accent);
  background: var(--bg-elevated);
  transform: translateY(-1px);
}

.goal-actions button.goal-delete-btn {
  color: #b91c1c;
}

.goal-item-cell {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.goal-front-title {
  font-size: 1.75rem;
  line-height: 1.05;
  font-weight: 800;
  color: var(--text);
  margin: 0;
  text-align: center;
}

.goal-front-title.priority-high {
  color: #ef4444;
}

.goal-front-title.priority-medium {
  color: #d97706;
}

.goal-front-title.priority-low {
  color: #15803d;
}

.goal-item-name.priority-high {
  color: #b91c1c;
}

.goal-item-name.priority-medium {
  color: #d97706;
}

.goal-item-name.priority-low {
  color: #15803d;
}

.goal-front-title.priority-medium,
.goal-item-name.priority-medium {
  color: #d97706;
}

.goal-front-title.priority-low,
.goal-item-name.priority-low {
  color: #15803d;
}

.goal-item-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
}

.goal-progress-percentage {
  text-align: center;
  font-weight: 800;
  font-size: 2.2rem;
  line-height: 1;
  color: #13b38e;
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

.priority-pill.priority-high,
.goal-section-priority-badge.priority-high {
  background: #fee2e2;
  color: #b91c1c;
}

.priority-pill.priority-medium,
.goal-section-priority-badge.priority-medium {
  background: #fef3c7;
  color: #b45309;
}

.priority-pill.priority-low,
.goal-section-priority-badge.priority-low {
  background: #dcfce7;
  color: #15803d;
}

.goal-description-cell {
  margin: 0;
  min-height: 44px;
  color: var(--muted);
  line-height: 1.5;
}

.goal-progress-cell {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.goal-progress-percentage {
  text-align: center;
  font-weight: 700;
  font-size: 2rem;
  line-height: 1;
  color: #334155;
}

.goal-progress-summary {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.goal-complete-center {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 56px;
  background: rgba(19, 179, 142, 0.12);
  color: #0f8b6e;
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  padding: 0.75rem 1rem;
}

.goal-progress-track {
  width: 100%;
  height: 14px;
  border-radius: 999px;
  background: var(--bg-elevated);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid var(--border);
}

.goal-progress-fill {
  display: block;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #0f766e 0%, #115e59 100%);
  border-radius: 999px;
  transition: width 0.35s ease;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.35);
}

.goal-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.88rem;
  color: var(--muted);
  flex-wrap: wrap;
}

.goal-detail-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: none;
  background: rgba(82, 183, 136, 0.14);
  color: var(--accent);
  padding: 0.75rem 1rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.16s ease, transform 0.16s ease;
}

.goal-detail-btn:hover {
  background: rgba(82, 183, 136, 0.2);
  transform: translateY(-1px);
}

.goal-detail-icon {
  display: inline-block;
  font-size: 1rem;
}

.goal-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.goal-flip-hint,
.goal-budget-label {
  font-size: 0.88rem;
  color: var(--muted);
}

.goal-add-placeholder .goal-flip-face {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 100%;
  padding: 1.25rem;
  background: var(--bg-elevated);
  border: 1px dashed var(--border);
  border-radius: 1rem;
  box-shadow: none;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  text-align: center;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
}

.placeholder-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(82, 183, 136, 0.18);
  color: var(--accent);
  font-size: 2.2rem;
}

.goal-add-placeholder h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text);
}

.goal-add-placeholder p {
  margin: 0;
  color: var(--muted);
  font-size: 0.98rem;
  line-height: 1.6;
}

.goal-add-placeholder .btn-ghost {
  padding: 1rem 1.4rem;
  font-size: 1rem;
  font-weight: 700;
}

.goal-progress-labels {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--muted);
}

.goal-budget-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  flex: 1;
}

.goal-budget-stat {
  padding: 1rem;
  border-radius: 1rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  min-height: 110px;
}

.goal-budget-stat strong {
  font-size: 1rem;
  color: var(--text);
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

[data-theme="dark"] .goal-front-title.priority-high,
[data-theme="dark"] .goal-item-name.priority-high {
  color: #f87171;
}

[data-theme="dark"] .goal-front-title.priority-medium,
[data-theme="dark"] .goal-item-name.priority-medium {
  color: #fdba74;
}

[data-theme="dark"] .goal-front-title.priority-low,
[data-theme="dark"] .goal-item-name.priority-low {
  color: #6ee7b7;
}

[data-theme="dark"] .goal-item-name,
[data-theme="dark"] .goal-item-name,
[data-theme="dark"] .goal-front-title {
  color: var(--text);
}

[data-theme="dark"] .goal-front-title.priority-low,
[data-theme="dark"] .goal-item-name.priority-low {
  color: #7dd3fc;
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

[data-theme="dark"] .priority-pill.priority-high,
[data-theme="dark"] .goal-section-priority-badge.priority-high {
  background: rgba(185, 28, 28, 0.18);
  color: #fca5a5;
}

[data-theme="dark"] .priority-pill.priority-medium,
[data-theme="dark"] .goal-section-priority-badge.priority-medium {
  background: rgba(180, 83, 9, 0.18);
  color: #fcd34d;
}

[data-theme="dark"] .priority-pill.priority-low,
[data-theme="dark"] .goal-section-priority-badge.priority-low {
  background: rgba(21, 128, 61, 0.18);
  color: #86efac;
}
</style>
