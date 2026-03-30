<template>
  <section class="hero-card">
    <div class="hero-grid align-items-center">
      <div>
        <p class="badge bg-primary text-white mb-3">Personal finance made simple</p>
        <h1>Turn your spending into smart saving.</h1>
        <p class="text-muted">Track income, manage budgets, monitor financial goals and explore personalized insights with a modern dashboard experience.</p>
        <div class="mt-4 d-flex flex-wrap gap-3">
          <router-link class="btn btn-brand" to="/register">Start free</router-link>
          <router-link class="btn btn-outline-secondary" to="/login">View demo</router-link>
        </div>
      </div>
      <div class="feature-list">
        <div class="feature-card">
          <h5>Organize budgets</h5>
          <p class="text-muted mb-0">Plan monthly spending and avoid surprises with clear budget summaries.</p>
        </div>
        <div class="feature-card">
          <h5>Monitor transactions</h5>
          <p class="text-muted mb-0">See all income and expenses in one place with payment status and categories.</p>
        </div>
        <div class="feature-card">
          <h5>Reach your goals</h5>
          <p class="text-muted mb-0">Save toward your goals with progress breakdowns and smart targets.</p>
        </div>
        <div class="feature-card">
          <h5>Actionable insights</h5>
          <p class="text-muted mb-0">Discover trends across spending categories and keep budgets on track.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="row g-4 mt-4">
    <div class="col-12 col-lg-4">
      <div class="card page-card p-4">
        <h3>Trusted insights</h3>
        <p class="text-muted">Get prioritized spending recommendations the moment you log in.</p>
      </div>
    </div>
    <div class="col-12 col-lg-4">
      <div class="card page-card p-4">
        <h3>Easy budgets</h3>
        <p class="text-muted">Create your budget categories and watch actual spending update automatically.</p>
      </div>
    </div>
    <div class="col-12 col-lg-4">
      <div class="card page-card p-4">
        <h3>Goal driven</h3>
        <p class="text-muted">Stay motivated with savings milestones and progress tracking.</p>
      </div>
    </div>
  </section>
</template>
