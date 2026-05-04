<template>
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">My Books</h1>
      <RouterLink to="/books/add" class="btn btn-primary">+ Add Book</RouterLink>
    </div>

    <div class="filter-bar">
      <select class="form-select" v-model="filters.status" @change="load">
        <option value="">All statuses</option>
        <option value="want-to-read">Want to read</option>
        <option value="reading">Reading</option>
        <option value="finished">Finished</option>
      </select>
      <select class="form-select" v-model="filters.genre" @change="load">
        <option value="">All genres</option>
        <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
      </select>
      <button v-if="filters.status || filters.genre" class="btn btn-ghost btn-sm" @click="clearFilters">Clear</button>
    </div>

    <div v-if="booksStore.loading" class="loading-wrap">
      <div class="spinner"></div>
    </div>

    <div v-else-if="booksStore.error" class="alert alert-error">{{ booksStore.error }}</div>

    <div v-else-if="booksStore.books.length === 0" class="empty-state">
      <h3>No books yet</h3>
      <p>Start building your reading list by adding your first book.</p>
      <RouterLink to="/books/add" class="btn btn-primary">Add a Book</RouterLink>
    </div>

    <div v-else class="books-grid">
      <BookCard v-for="book in booksStore.books" :key="book._id" :book="book" />
    </div>
  </div>
</template>

<script>
import BookCard from '../components/BookCard.vue'
import { useBooksStore } from '../stores/books'

export default {
  name: 'DashboardView',
  components: { BookCard },
  data() {
    return {
      filters: { status: '', genre: '' }
    }
  },
  computed: {
    booksStore() { return useBooksStore() },
    genres() {
      const all = useBooksStore().books.map(b => b.genre).filter(Boolean)
      return [...new Set(all)].sort()
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      const f = {}
      if (this.filters.status) f.status = this.filters.status
      if (this.filters.genre) f.genre = this.filters.genre
      useBooksStore().fetchBooks(f)
    },
    clearFilters() {
      this.filters = { status: '', genre: '' }
      this.load()
    }
  }
}
</script>
