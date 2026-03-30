<template>
  <div class="card page-card p-4">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h2 class="h5 mb-1">Recent Transactions</h2>
        <p class="text-muted mb-0">Track expenses and income at a glance.</p>
      </div>
      <button class="btn btn-brand btn-sm">Add transaction</button>
    </div>
    <div class="table-responsive">
      <table class="table align-middle mb-0">
        <thead>
          <tr>
            <th>Item</th>
            <th>Category</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="txn in transactions" :key="txn.id">
            <td>{{ txn.description }}</td>
            <td>{{ txn.category }}</td>
            <td>{{ txn.date }}</td>
            <td :class="txn.type === 'expense' ? 'text-danger' : 'text-success'">{{ txn.amount }}</td>
            <td><span :class="['status-pill', txn.statusClass]">{{ txn.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const transactions = [
  { id: 1, description: 'Freelance invoice', category: 'Income', date: 'Mar 28', amount: '+$1,280', status: 'Paid', statusClass: 'status-paid', type: 'income' },
  { id: 2, description: 'Groceries', category: 'Food', date: 'Mar 27', amount: '-$92', status: 'Paid', statusClass: 'status-paid', type: 'expense' },
  { id: 3, description: 'Electric bill', category: 'Utilities', date: 'Mar 25', amount: '-$68', status: 'Pending', statusClass: 'status-pending', type: 'expense' },
  { id: 4, description: 'Gym membership', category: 'Health', date: 'Mar 22', amount: '-$45', status: 'Paid', statusClass: 'status-paid', type: 'expense' },
]
</script>
