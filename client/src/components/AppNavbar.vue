<template>
  <nav class="navbar navbar-expand-lg app-navbar budmon-navbar">
    <div class="container">
      <router-link class="navbar-brand budmon-brand" to="/">
        <div class="brand-mark" aria-hidden>
          <img :src="logo" alt="BUDMON logo" class="budmon-logo" />
        </div>
        <div class="brand-copy">
          <span class="brand-name">BUDMON</span>
          <span class="brand-tagline">Budget with intention</span>
        </div>
      </router-link>

      <button
        class="navbar-toggler budmon-toggler"
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
        <ul class="navbar-nav align-items-center budmon-nav-list">
          <li class="nav-item"><router-link class="nav-link budmon-nav-link" to="/">Home</router-link></li>
          <li class="nav-item"><router-link class="nav-link budmon-nav-link" to="/dashboard">Dashboard</router-link></li>
          <li class="nav-item"><router-link class="nav-link budmon-nav-link" to="/transactions">Transactions</router-link></li>
          <li class="nav-item"><router-link class="nav-link budmon-nav-link" to="/budgets">Budgets</router-link></li>
          <li class="nav-item"><router-link class="nav-link budmon-nav-link" to="/goals">Goals</router-link></li>
          <li class="nav-item"><router-link class="nav-link budmon-nav-link" to="/insights">Insights</router-link></li>
          <li class="nav-item"><router-link class="nav-link budmon-nav-link" to="/settings">Settings</router-link></li>
          <li class="nav-item ms-lg-3 mt-3 mt-lg-0">
            <router-link class="btn btn-primary nav-cta-btn" to="/login">
              Sign In
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import logo from '../assets/pictures/logo.png'
</script>