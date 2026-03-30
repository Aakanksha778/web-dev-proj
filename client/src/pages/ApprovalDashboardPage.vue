<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Approval dashboard</h1>
        <p>Manage approvals and review requests from team members or shared accounts.</p>
      </div>
      <button class="btn btn-brand">Review requests</button>
    </div>

    <div class="row g-4">
      <div class="col-12 col-md-6" v-for="item in approvals" :key="item.title">
        <div class="card page-card p-4">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 class="mb-1">{{ item.title }}</h5>
              <p class="text-muted mb-0">{{ item.description }}</p>
            </div>
            <span :class="['status-pill', item.statusClass]">{{ item.status }}</span>
          </div>
          <p class="text-muted mb-0">Requested on {{ item.date }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const approvals = [
  { title: 'Travel budget change', description: 'Approve increased travel allowance.', status: 'Pending', statusClass: 'status-pending', date: 'Mar 23' },
  { title: 'Project bonus transfer', description: 'Confirm transfer to savings goal.', status: 'Approved', statusClass: 'status-paid', date: 'Mar 18' },
]
</script>
