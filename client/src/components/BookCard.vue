<template>
  <RouterLink :to="`/books/${book._id}`" class="card book-card">
    <div class="book-card-title">{{ book.title }}</div>
    <div class="book-card-author">{{ book.author }}</div>
    <div class="book-card-meta">
      <span :class="statusBadgeClass">{{ statusLabel }}</span>
      <span v-if="book.genre" class="badge" style="background: var(--surface-alt); color: var(--text-muted);">
        {{ book.genre }}
      </span>
      <div class="stars">
        <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= book.rating }">&#9733;</span>
      </div>
    </div>
  </RouterLink>
</template>

<script>
export default {
  name: 'BookCard',
  props: {
    book: { type: Object, required: true }
  },
  computed: {
    statusLabel() {
      const labels = { 'want-to-read': 'Want to read', reading: 'Reading', finished: 'Finished' }
      return labels[this.book.status] || this.book.status
    },
    statusBadgeClass() {
      const map = { 'want-to-read': 'badge badge-want', reading: 'badge badge-reading', finished: 'badge badge-finished' }
      return map[this.book.status] || 'badge'
    }
  }
}
</script>
