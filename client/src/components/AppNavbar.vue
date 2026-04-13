<template>
  <nav class="navbar navbar-expand-lg app-navbar centsora-navbar">
    <div class="container">
      <router-link class="navbar-brand centsora-brand" to="/">
        <div class="brand-mark" aria-hidden>
          <img :src="logo" alt="CentSora logo" class="centsora-logo" />
        </div>
        <div class="brand-copy">
          <span class="brand-name">CentSora</span>
          <span class="brand-tagline">Budget with intention</span>
        </div>
      </router-link>

      <button
        class="navbar-toggler centsora-toggler"
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
        <ul class="navbar-nav align-items-center centsora-nav-list">
          <template v-if="user">
            <li class="nav-item"><router-link class="nav-link centsora-nav-link" to="/dashboard">Dashboard</router-link></li>
            <li class="nav-item"><router-link class="nav-link centsora-nav-link" to="/transactions">Transactions</router-link></li>
            <li class="nav-item"><router-link class="nav-link centsora-nav-link" to="/budgets">Budgets</router-link></li>
            <li class="nav-item"><router-link class="nav-link centsora-nav-link" to="/goals">Goals</router-link></li>
            <li class="nav-item"><router-link class="nav-link centsora-nav-link" to="/settings">Settings</router-link></li>
            <li class="nav-item ms-lg-3 mt-3 mt-lg-0">
              <span class="nav-link centsora-nav-link me-2 d-none d-lg-inline">{{ user.name }}</span>
            </li>
            <li class="nav-item mt-2 mt-lg-0">
              <button class="btn btn-outline-secondary btn-sm" @click="handleLogout">Sign Out</button>
            </li>
          </template>
          <template v-else>
            <li class="nav-item"><router-link class="nav-link centsora-nav-link" to="/">Home</router-link></li>
            <li class="nav-item ms-lg-3 mt-3 mt-lg-0">
              <router-link class="btn btn-primary nav-cta-btn" to="/login">Sign In</router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import logo from '../assets/pictures/logo.png'
import { useAuth } from '../stores/auth'

const router = useRouter()
const { user, logout } = useAuth()

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>
