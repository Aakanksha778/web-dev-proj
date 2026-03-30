<template>
  <nav class="navbar navbar-expand-lg topbar">
    <div class="container">
      <router-link class="navbar-brand" to="/">FinTrack</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navMenu"
        aria-controls="navMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end" id="navMenu">
        <ul class="navbar-nav align-items-center">
          <li class="nav-item"><router-link class="nav-link" to="/">Home</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/dashboard">Dashboard</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/transactions">Transactions</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/budgets">Budgets</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/goals">Goals</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/insights">Insights</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/settings">Settings</router-link></li>
          <li class="nav-item ms-3"><router-link class="btn btn-outline-light btn-sm" to="/login">Sign In</router-link></li>
        </ul>
      </div>
    </div>
  </nav>
</template>
