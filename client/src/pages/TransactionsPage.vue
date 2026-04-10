<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Transactions</h1>
        <p>Browse recent income and expense records. Filter by category, date, and status.</p>
      </div>
    </div>

    <TransactionTable ref="tableRef" @add="showModal = true" @delete="deleteTransaction" />

    <AddTransactionModal
      :show="showModal"
      @close="showModal = false"
      @saved="onSaved"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import TransactionTable from '../components/TransactionTable.vue'
import AddTransactionModal from '../components/AddTransactionModal.vue'
import api from '../services/api'

const showModal = ref(false)
const tableRef  = ref(null)

function onSaved() {
  tableRef.value?.refresh()
}

async function deleteTransaction(transaction) {
  if (!window.confirm('Delete this transaction? This cannot be undone.')) return

  try {
    await api.delete(`/transactions/${transaction.id}`)
    tableRef.value?.refresh()
  } catch (error) {
    console.error('Failed to delete transaction:', error)
  }
}
</script>
