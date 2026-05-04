<template>
  <div class="card quote-card">
    <div v-if="!editing">
      <p class="quote-text">"{{ quote.text }}"</p>
      <div class="quote-meta">
        <span v-if="quote.pageNumber">p. {{ quote.pageNumber }}</span>
        <span v-if="quote.note"> &mdash; {{ quote.note }}</span>
      </div>
      <div class="quote-actions">
        <button class="btn btn-ghost btn-sm" @click="startEdit">Edit</button>
        <button class="btn btn-ghost btn-sm" style="color: var(--error);" @click="$emit('delete', quote._id)">Delete</button>
      </div>
    </div>
    <div v-else>
      <div class="form-group">
        <textarea class="form-textarea" v-model="form.text" rows="3"></textarea>
      </div>
      <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
        <input class="form-input" v-model.number="form.pageNumber" type="number" placeholder="Page #" style="width: 100px;" />
        <input class="form-input" v-model="form.note" type="text" placeholder="Note (optional)" />
      </div>
      <div class="quote-actions">
        <button class="btn btn-primary btn-sm" @click="save" :disabled="saving">Save</button>
        <button class="btn btn-ghost btn-sm" @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuoteCard',
  props: {
    quote: { type: Object, required: true }
  },
  emits: ['update', 'delete'],
  data() {
    return {
      editing: false,
      saving: false,
      form: { text: '', pageNumber: null, note: '' }
    }
  },
  methods: {
    startEdit() {
      this.form = { text: this.quote.text, pageNumber: this.quote.pageNumber || null, note: this.quote.note || '' }
      this.editing = true
    },
    cancel() {
      this.editing = false
    },
    async save() {
      if (!this.form.text.trim()) return
      this.saving = true
      this.$emit('update', this.quote._id, { ...this.form })
      this.saving = false
      this.editing = false
    }
  }
}
</script>
