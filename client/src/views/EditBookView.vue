<template>
  <div class="container" style="max-width: 600px;">
    <div class="page-header">
      <h1 class="page-title">Edit Book</h1>
    </div>

    <div v-if="booksStore.loading" class="loading-wrap"><div class="spinner"></div></div>

    <div v-else-if="booksStore.error" class="alert alert-error">{{ booksStore.error }}</div>

    <div v-else class="card" style="padding: 2rem;">
      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <form @submit.prevent="submit">
        <div class="form-group">
          <label class="form-label">Title *</label>
          <input class="form-input" v-model="form.title" type="text" required />
        </div>
        <div class="form-group">
          <label class="form-label">Author *</label>
          <input class="form-input" v-model="form.author" type="text" required />
        </div>
        <div class="form-group">
          <label class="form-label">Genre</label>
          <input class="form-input" v-model="form.genre" type="text" />
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" v-model="form.status">
            <option value="want-to-read">Want to read</option>
            <option value="reading">Reading</option>
            <option value="finished">Finished</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Rating</label>
          <div class="stars" style="cursor: pointer; font-size: 1.5rem; gap: 4px;">
            <span
              v-for="n in 5" :key="n"
              class="star"
              :class="{ filled: n <= form.rating }"
              @click="form.rating = n"
            >&#9733;</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Review</label>
          <textarea class="form-textarea" v-model="form.review"></textarea>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-primary" type="submit" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
          <RouterLink :to="`/books/${$route.params.id}`" class="btn btn-outline">Cancel</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useBooksStore } from '../stores/books'

export default {
  name: 'EditBookView',
  data() {
    return {
      saving: false,
      error: null,
      form: { title: '', author: '', genre: '', status: 'want-to-read', rating: 0, review: '' }
    }
  },
  computed: {
    booksStore() { return useBooksStore() }
  },
  async mounted() {
    const store = useBooksStore()
    await store.fetchBook(this.$route.params.id)
    if (store.currentBook) {
      const b = store.currentBook
      this.form = { title: b.title, author: b.author, genre: b.genre || '', status: b.status, rating: b.rating, review: b.review || '' }
    }
  },
  methods: {
    async submit() {
      this.saving = true
      this.error = null
      try {
        await useBooksStore().updateBook(this.$route.params.id, this.form)
        this.$router.push(`/books/${this.$route.params.id}`)
      } catch (err) {
        this.error = err || 'Failed to update book'
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
