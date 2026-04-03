<template>
  <div class="transaction-card">
    <div class="transaction-card-header">
      <div>
        <p class="panel-kicker">Activity</p>
        <h2 class="transaction-title">Recent Transactions</h2>
        <p class="transaction-subtitle">Track expenses and income at a glance.</p>
      </div>
      <button class="btn btn-primary btn-sm transaction-add-btn" @click="$emit('add')">
        Add transaction
      </button>
    </div>

    <div v-if="loading" class="text-center py-4 text-muted">Loading…</div>

    <div v-else-if="!transactions.length" class="text-center py-4 text-muted">
      No transactions yet. Add one to get started.
    </div>

    <div v-else class="transaction-table-wrap">
      <div class="table-responsive">
        <table class="table align-middle mb-0 transaction-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Date</th>
              <th class="text-end">Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="txn in transactions" :key="txn.id">
              <td>
                <div class="transaction-item-cell">
                  <div class="transaction-dot" :class="txn.type === 'expense' ? 'expense-dot' : 'income-dot'"></div>
                  <span class="transaction-item-name">{{ txn.description }}</span>
                </div>
              </td>
              <td><span class="transaction-category">{{ txn.category }}</span></td>
              <td class="transaction-date">{{ formatDate(txn.date) }}</td>
              <td class="text-end transaction-amount" :class="txn.type === 'expense' ? 'amount-negative' : 'amount-positive'">
                {{ txn.type === 'expense' ? '-' : '+' }}${{ txn.amount.toFixed(2) }}
              </td>
              <td>
                <span :class="['status-pill', txn.status === 'paid' ? 'status-paid' : 'status-pending']">
                  {{ txn.status.charAt(0).toUpperCase() + txn.status.slice(1) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

defineEmits(['add'])

const transactions = ref([])
const loading = ref(true)

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function refresh() {
  loading.value = true
  try {
    const res = await api.get('/transactions', { params: { limit: 50 } })
    transactions.value = res.data.data.transactions
  } catch (err) {
    console.error('Failed to load transactions:', err)
  } finally {
    loading.value = false
  }
}

onMounted(refresh)
defineExpose({ refresh })
</script>
