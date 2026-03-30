<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-6">
      <div class="card page-card p-4">
        <h1 class="h3 mb-3">Sign in to FinTrack</h1>
        <p class="text-muted mb-4">Access your dashboard, update budgets, and discover growth opportunities.</p>
        <form>
          <div class="mb-3">
            <label class="form-label">Email address</label>
            <input type="email" class="form-control" placeholder="name@example.com" />
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" placeholder="••••••••" />
          </div>
          <button type="button" class="btn btn-brand w-100">Sign In</button>
        </form>
        <p class="text-center text-muted mt-4 mb-0">New here? <router-link to="/register">Create an account</router-link></p>
      </div>
    </div>
  </div>
</template>
