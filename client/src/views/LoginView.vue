<template>
  <div class="auth-page">
    <div class="card auth-card">
      <h1 class="auth-title">Welcome Back</h1>
      <p class="auth-subtitle">Log in to your BookNook account.</p>
      <div v-if="authStore.error" class="alert alert-error">{{ authStore.error }}</div>
      <form @submit.prevent="submit">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" v-model="form.email" type="email" placeholder="you@example.com" required autocomplete="email" />
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input class="form-input" v-model="form.password" type="password" placeholder="Your password" required autocomplete="current-password" />
        </div>
        <button class="btn btn-primary" type="submit" style="width: 100%;" :disabled="authStore.loading">
          {{ authStore.loading ? 'Logging in...' : 'Log In' }}
        </button>
      </form>
      <p class="auth-footer">Don't have an account? <RouterLink to="/register">Sign up</RouterLink></p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'LoginView',
  data() {
    return {
      form: { email: '', password: '' }
    }
  },
  computed: {
    authStore() { return useAuthStore() }
  },
  methods: {
    async submit() {
      const ok = await this.authStore.login(this.form.email, this.form.password)
      if (ok) this.$router.push('/dashboard')
    }
  }
}
</script>
