<template>
  <div id="app">
    <AppNavbar />
    <main class="app-shell">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
</script>
