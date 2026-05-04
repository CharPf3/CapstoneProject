<template>
  <div class="container not-found">
    <div class="not-found-code">404</div>
    <h2>Page not found</h2>
    <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
      The page you are looking for does not exist.
    </p>
    <RouterLink to="/" class="btn btn-primary">Go Home</RouterLink>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView'
}
</script>
