<template>
  <nav class="navbar">
    <div class="container">
      <RouterLink to="/dashboard" class="nav-brand">BookNook</RouterLink>
      <div class="nav-links">
        <RouterLink to="/dashboard" class="nav-link" active-class="active">My Books</RouterLink>
        <RouterLink to="/recommendations" class="nav-link" active-class="active">Discover</RouterLink>
        <span class="nav-user">{{ user?.username }}</span>
        <button class="btn btn-ghost btn-sm" @click="logout">Log out</button>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'NavBar',
  computed: {
    user() {
      return useAuthStore().user
    }
  },
  methods: {
    logout() {
      useAuthStore().logout()
      this.$router.push('/')
    }
  }
}
</script>
