<template>
  <div class="transaction-card">
    <div class="transaction-card-header">
      <div>
        <p class="panel-kicker">Activity</p>
        <h2 class="transaction-title">Recent Transactions</h2>
        <p class="transaction-subtitle">Track expenses and income at a glance.</p>
      </div>

      <button class="btn btn-primary btn-sm transaction-add-btn">
        Add transaction
      </button>
    </div>

    <div class="transaction-table-wrap">
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

              <td>
                <span class="transaction-category">{{ txn.category }}</span>
              </td>

              <td class="transaction-date">{{ txn.date }}</td>

              <td
                class="text-end transaction-amount"
                :class="txn.type === 'expense' ? 'amount-negative' : 'amount-positive'"
              >
                {{ txn.amount }}
              </td>

              <td>
                <span :class="['status-pill', txn.statusClass]">
                  {{ txn.status }}
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
const transactions = [
  { id: 1, description: 'Freelance invoice', category: 'Income', date: 'Mar 28', amount: '+$1,280', status: 'Paid', statusClass: 'status-paid', type: 'income' },
  { id: 2, description: 'Groceries', category: 'Food', date: 'Mar 27', amount: '-$92', status: 'Paid', statusClass: 'status-paid', type: 'expense' },
  { id: 3, description: 'Electric bill', category: 'Utilities', date: 'Mar 25', amount: '-$68', status: 'Pending', statusClass: 'status-pending', type: 'expense' },
  { id: 4, description: 'Gym membership', category: 'Health', date: 'Mar 22', amount: '-$45', status: 'Paid', statusClass: 'status-paid', type: 'expense' },
]
</script>