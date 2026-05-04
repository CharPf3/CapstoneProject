<template>
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">Discover Books</h1>
    </div>
    <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
      Recommendations based on your highest-rated books.
    </p>

    <div v-if="booksStore.loading" class="loading-wrap"><div class="spinner"></div></div>

    <div v-else-if="booksStore.error" class="alert alert-error">{{ booksStore.error }}</div>

    <div v-else-if="booksStore.recommendations.length === 0" class="empty-state">
      <h3>No recommendations yet</h3>
      <p>Rate some books 4 or 5 stars to get personalised suggestions.</p>
      <RouterLink to="/dashboard" class="btn btn-primary">My Books</RouterLink>
    </div>

    <div v-else class="books-grid">
      <div v-for="(rec, i) in booksStore.recommendations" :key="i" class="card rec-card">
        <div class="rec-card-genre">{{ rec.genre }}</div>
        <div class="rec-card-title">{{ rec.title }}</div>
        <div class="rec-card-author">{{ rec.author }}</div>
        <p class="rec-card-desc">{{ rec.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useBooksStore } from '../stores/books'

export default {
  name: 'RecommendationsView',
  computed: {
    booksStore() { return useBooksStore() }
  },
  mounted() {
    useBooksStore().fetchRecommendations()
  }
}
</script>
