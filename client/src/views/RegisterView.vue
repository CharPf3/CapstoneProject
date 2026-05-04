<template>
  <div class="auth-page">
    <div class="card auth-card">
      <h1 class="auth-title">Create Account</h1>
      <p class="auth-subtitle">Join BookNook and start tracking your reading.</p>
      <div v-if="authStore.error" class="alert alert-error">{{ authStore.error }}</div>
      <form @submit.prevent="submit">
        <div class="form-group">
          <label class="form-label">Username</label>
          <input class="form-input" v-model="form.username" type="text" placeholder="yourname" required autocomplete="username" />
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" v-model="form.email" type="email" placeholder="you@example.com" required autocomplete="email" />
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input class="form-input" v-model="form.password" type="password" placeholder="At least 6 characters" required autocomplete="new-password" minlength="6" />
        </div>
        <button class="btn btn-primary" type="submit" style="width: 100%;" :disabled="authStore.loading">
          {{ authStore.loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>
      <p class="auth-footer">Already have an account? <RouterLink to="/login">Log in</RouterLink></p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'RegisterView',
  data() {
    return {
      form: { username: '', email: '', password: '' }
    }
  },
  computed: {
    authStore() { return useAuthStore() }
  },
  methods: {
    async submit() {
      const ok = await this.authStore.register(this.form.username, this.form.email, this.form.password)
      if (ok) this.$router.push('/dashboard')
    }
  }
}
</script>
