<template>
  <div class="container" style="max-width: 760px;">
    <div v-if="booksStore.loading" class="loading-wrap">
      <div class="spinner"></div>
    </div>

    <div v-else-if="booksStore.error" class="alert alert-error">{{ booksStore.error }}</div>

    <div v-else-if="booksStore.currentBook">
      <div class="book-detail-header">
        <RouterLink to="/dashboard" style="font-size: 0.9rem; color: var(--text-muted);">&#8592; My Books</RouterLink>
        <h1 class="book-detail-title" style="margin-top: 0.75rem;">{{ booksStore.currentBook.title }}</h1>
        <div class="book-detail-author">by {{ booksStore.currentBook.author }}</div>
        <div class="book-detail-meta">
          <span :class="statusBadgeClass">{{ statusLabel }}</span>
          <span v-if="booksStore.currentBook.genre" class="badge" style="background: var(--surface-alt); color: var(--text-muted);">
            {{ booksStore.currentBook.genre }}
          </span>
          <div class="stars">
            <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= booksStore.currentBook.rating }">&#9733;</span>
          </div>
        </div>
        <div v-if="booksStore.currentBook.review" class="review-section">
          <div class="review-label">Review</div>
          <p style="margin: 0; font-size: 0.95rem;">{{ booksStore.currentBook.review }}</p>
        </div>
        <div class="book-detail-actions">
          <RouterLink :to="`/books/${booksStore.currentBook._id}/edit`" class="btn btn-outline btn-sm">Edit</RouterLink>
          <button class="btn btn-danger btn-sm" @click="confirmDelete" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>

      <div class="add-quote-form">
        <h2 class="section-title">Add a Quote</h2>
        <div v-if="quoteError" class="alert alert-error">{{ quoteError }}</div>
        <form @submit.prevent="addQuote">
          <div class="form-group">
            <textarea class="form-textarea" v-model="quoteForm.text" placeholder="Enter the quote text..." rows="3" required></textarea>
          </div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <input class="form-input" v-model.number="quoteForm.pageNumber" type="number" placeholder="Page #" style="width: 110px;" />
            <input class="form-input" v-model="quoteForm.note" type="text" placeholder="Note (optional)" style="flex: 1;" />
          </div>
          <button class="btn btn-primary btn-sm" type="submit" style="margin-top: 0.75rem;" :disabled="addingQuote">
            {{ addingQuote ? 'Saving...' : 'Save Quote' }}
          </button>
        </form>
      </div>

      <h2 class="section-title">Saved Quotes</h2>

      <div v-if="booksStore.loading" class="loading-wrap"><div class="spinner"></div></div>

      <div v-else-if="booksStore.quotes.length === 0" class="empty-state" style="padding: 1.5rem 0;">
        <p>No quotes saved yet. Add your first quote above.</p>
      </div>

      <div v-else>
        <QuoteCard
          v-for="quote in booksStore.quotes"
          :key="quote._id"
          :quote="quote"
          @update="updateQuote"
          @delete="deleteQuote"
        />
      </div>
    </div>
  </div>
</template>

<script>
import QuoteCard from '../components/QuoteCard.vue'
import { useBooksStore } from '../stores/books'

export default {
  name: 'BookDetailView',
  components: { QuoteCard },
  data() {
    return {
      deleting: false,
      addingQuote: false,
      quoteError: null,
      quoteForm: { text: '', pageNumber: null, note: '' }
    }
  },
  computed: {
    booksStore() { return useBooksStore() },
    statusLabel() {
      const labels = { 'want-to-read': 'Want to read', reading: 'Reading', finished: 'Finished' }
      return labels[this.booksStore.currentBook?.status] || ''
    },
    statusBadgeClass() {
      const map = { 'want-to-read': 'badge badge-want', reading: 'badge badge-reading', finished: 'badge badge-finished' }
      return map[this.booksStore.currentBook?.status] || 'badge'
    }
  },
  mounted() {
    const id = this.$route.params.id
    useBooksStore().fetchBook(id)
    useBooksStore().fetchQuotes(id)
  },
  methods: {
    async addQuote() {
      this.addingQuote = true
      this.quoteError = null
      try {
        await useBooksStore().createQuote(this.$route.params.id, this.quoteForm)
        this.quoteForm = { text: '', pageNumber: null, note: '' }
      } catch (err) {
        this.quoteError = err || 'Failed to save quote'
      } finally {
        this.addingQuote = false
      }
    },
    async updateQuote(quoteId, data) {
      try {
        await useBooksStore().updateQuote(quoteId, data)
      } catch { /* handled in component */ }
    },
    async deleteQuote(quoteId) {
      if (!confirm('Delete this quote?')) return
      try {
        await useBooksStore().deleteQuote(quoteId)
      } catch { /* handled in component */ }
    },
    async confirmDelete() {
      if (!confirm('Delete this book and all its quotes?')) return
      this.deleting = true
      try {
        await useBooksStore().deleteBook(this.$route.params.id)
        this.$router.push('/dashboard')
      } catch {
        this.deleting = false
      }
    }
  }
}
</script>
