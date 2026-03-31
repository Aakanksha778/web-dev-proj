<template>
  <section class="auth-page">
    <div class="auth-shell">
      <div class="auth-showcase">
        <div class="auth-brand-row">
          <img :src="logo" alt="BUDMON logo" class="auth-logo" />
          <div>
            <p class="auth-kicker">Welcome back</p>
            <h1>BUDMON</h1>
          </div>
        </div>

        <h2 class="auth-showcase-title">
          Track spending, protect your budget, and grow your goals.
        </h2>

        <p class="auth-showcase-subtitle">
          A cleaner money dashboard for students, families, and anyone trying to budget with more clarity.
        </p>

        <div class="auth-benefits">
          <div class="auth-benefit-card">
            <span>📈</span>
            <div>
              <h3>Real visibility</h3>
              <p>See how your spending changes over time.</p>
            </div>
          </div>

          <div class="auth-benefit-card">
            <span>🎯</span>
            <div>
              <h3>Goal progress</h3>
              <p>Stay motivated with clear savings milestones.</p>
            </div>
          </div>

          <div class="auth-benefit-card">
            <span>🧾</span>
            <div>
              <h3>Simple tracking</h3>
              <p>Keep budgets and transactions in one place.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="auth-form-panel">
        <div class="auth-form-card">
          <p class="auth-form-kicker">Sign in</p>
          <h2 class="auth-form-title">Access your dashboard</h2>
          <p class="auth-form-subtitle">
            Pick up where you left off and stay on top of your money.
          </p>

          <form>
            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input type="email" class="form-control" placeholder="name@example.com" />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" placeholder="••••••••" />
            </div>

            <button type="button" class="btn btn-primary w-100 auth-submit-btn">
              Sign In
            </button>
          </form>

          <div class="text-center muted mt-4">
            New here? <router-link to="/register">Create an account</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import logo from '../assets/pictures/logo.png'
</script>