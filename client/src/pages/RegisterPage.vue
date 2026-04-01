<template>
  <section class="auth-page">
    <div class="auth-shell">
      <div class="auth-showcase">
        <div class="auth-brand-row">
          <img :src="logo" alt="CentSora logo" class="auth-logo" />
          <div>
            <p class="auth-kicker">Create your account</p>
            <h1>CentSora</h1>
          </div>
        </div>

        <h2 class="auth-showcase-title">
          Build better money habits with a dashboard made for real life.
        </h2>

        <p class="auth-showcase-subtitle">
          Start tracking budgets, organizing transactions, and growing your savings goals
          with a cleaner and more motivating financial experience.
        </p>

        <div class="auth-benefits">
          <div class="auth-benefit-card">
            <span>💰</span>
            <div>
              <h3>Stronger budgeting</h3>
              <p>Set practical limits and stay aware of what you have left.</p>
            </div>
          </div>

          <div class="auth-benefit-card">
            <span>📊</span>
            <div>
              <h3>Clearer visibility</h3>
              <p>See your balances, spending, and progress in one organized place.</p>
            </div>
          </div>

          <div class="auth-benefit-card">
            <span>🌱</span>
            <div>
              <h3>Growth-focused goals</h3>
              <p>Stay consistent with savings targets that feel motivating, not overwhelming.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="auth-form-panel">
        <div class="auth-form-card">
          <p class="auth-form-kicker">Register</p>
          <h2 class="auth-form-title">Create your CentSora account</h2>
          <p class="auth-form-subtitle">
            A secure, simple place to manage money and move toward your goals.
          </p>

          <form>
            <div class="mb-3">
              <label class="form-label">Full name</label>
              <input type="text" class="form-control" placeholder="Jane Doe" />
            </div>

            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input type="email" class="form-control" placeholder="name@example.com" />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" placeholder="Create password" />
            </div>

            <button type="button" class="btn btn-primary w-100 auth-submit-btn">
              Create Account
            </button>
          </form>

          <div class="text-center muted mt-4">
            Already have an account? <router-link to="/login">Sign in</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import logo from '../assets/pictures/logo.png'
</script>