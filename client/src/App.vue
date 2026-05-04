<template>
  <div>
    <NavBar v-if="isAuthenticated && $route.path !== '/'" />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import { useAuthStore } from './stores/auth'

export default {
  name: 'App',
  components: { NavBar },
  computed: {
    isAuthenticated() {
      return useAuthStore().isAuthenticated
    }
  }
}
</script>
