<template>
  <div class="landing">
    <header class="landing-hero">
      <div class="container">
        <h1 class="landing-title">BookNook</h1>
        <p class="landing-tagline">Track your reading, save your favourite quotes, and discover what to read next.</p>
        <div class="landing-actions">
          <RouterLink to="/register" class="btn btn-lg" style="background: #fff; color: var(--primary);">Get Started</RouterLink>
          <RouterLink to="/login" class="btn btn-lg btn-outline" style="border-color: rgba(255,255,255,0.7); color: #fff;">Log In</RouterLink>
        </div>
      </div>
    </header>
    <section class="landing-features">
      <div class="container">
        <div class="features-grid">
          <div class="feature-card">
            <span class="feature-icon">&#128218;</span>
            <h3>Track Your Books</h3>
            <p>Add books, set reading status, and rate them as you go.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">&#128172;</span>
            <h3>Save Quotes</h3>
            <p>Capture your favourite passages and personal notes alongside each book.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">&#11088;</span>
            <h3>Get Recommendations</h3>
            <p>Discover new books based on the genres and authors you love.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'LandingView'
}
</script>
