<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Request history</h1>
        <p>Review your recent approval requests and status updates.</p>
      </div>
    </div>

    <div class="card page-card p-4">
      <h2 class="h5 mb-4">Past requests</h2>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong>Budget increase</strong>
              <p class="mb-0 text-muted">March 20 · Utilities</p>
            </div>
            <span class="status-pill status-paid">Approved</span>
          </div>
        </li>
        <li class="list-group-item">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong>Savings transfer</strong>
              <p class="mb-0 text-muted">March 12 · Savings</p>
            </div>
            <span class="status-pill status-pending">Pending</span>
          </div>
        </li>
        <li class="list-group-item">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong>Expense review</strong>
              <p class="mb-0 text-muted">March 5 · Entertainment</p>
            </div>
            <span class="status-pill status-paid">Completed</span>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
