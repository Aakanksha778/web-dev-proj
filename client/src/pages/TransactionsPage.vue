<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Transactions</h1>
        <p>Browse recent income and expense records. Filter by category, date, and status.</p>
      </div>
      <button class="btn btn-brand">Add transaction</button>
    </div>

    <TransactionTable />
  </section>
</template>

<script setup>
import TransactionTable from '../components/TransactionTable.vue'
</script>
