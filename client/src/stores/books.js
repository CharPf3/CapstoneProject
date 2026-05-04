import { defineStore } from 'pinia'
import api from '../api'

export const useBooksStore = defineStore('books', {
  state: () => ({
    books: [],
    currentBook: null,
    quotes: [],
    recommendations: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchBooks(filters = {}) {
      this.loading = true
      this.error = null
      try {
        const params = new URLSearchParams(filters).toString()
        const { data } = await api.get(`/books${params ? '?' + params : ''}`)
        this.books = data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load books'
      } finally {
        this.loading = false
      }
    },
    async fetchBook(id) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get(`/books/${id}`)
        this.currentBook = data
      } catch (err) {
        this.error = err.response?.data?.message || 'Book not found'
      } finally {
        this.loading = false
      }
    },
    async createBook(bookData) {
      const { data } = await api.post('/books', bookData)
      this.books.unshift(data)
      return data
    },
    async updateBook(id, bookData) {
      const { data } = await api.put(`/books/${id}`, bookData)
      const i = this.books.findIndex(b => b._id === id)
      if (i !== -1) this.books[i] = data
      this.currentBook = data
      return data
    },
    async deleteBook(id) {
      await api.delete(`/books/${id}`)
      this.books = this.books.filter(b => b._id !== id)
    },
    async fetchQuotes(bookId) {
      this.loading = true
      try {
        const { data } = await api.get(`/books/${bookId}/quotes`)
        this.quotes = data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load quotes'
      } finally {
        this.loading = false
      }
    },
    async createQuote(bookId, quoteData) {
      const { data } = await api.post(`/books/${bookId}/quotes`, quoteData)
      this.quotes.unshift(data)
      return data
    },
    async updateQuote(quoteId, quoteData) {
      const { data } = await api.put(`/quotes/${quoteId}`, quoteData)
      const i = this.quotes.findIndex(q => q._id === quoteId)
      if (i !== -1) this.quotes[i] = data
      return data
    },
    async deleteQuote(quoteId) {
      await api.delete(`/quotes/${quoteId}`)
      this.quotes = this.quotes.filter(q => q._id !== quoteId)
    },
    async fetchRecommendations() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/recommendations')
        this.recommendations = data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load recommendations'
      } finally {
        this.loading = false
      }
    }
  }
})
