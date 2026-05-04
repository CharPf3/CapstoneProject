import { createRouter, createWebHashHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import AddBookView from '../views/AddBookView.vue'
import BookDetailView from '../views/BookDetailView.vue'
import EditBookView from '../views/EditBookView.vue'
import RecommendationsView from '../views/RecommendationsView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  { path: '/', component: LandingView },
  { path: '/register', component: RegisterView },
  { path: '/login', component: LoginView },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/books/add', component: AddBookView, meta: { requiresAuth: true } },
  { path: '/books/:id', component: BookDetailView, meta: { requiresAuth: true } },
  { path: '/books/:id/edit', component: EditBookView, meta: { requiresAuth: true } },
  { path: '/recommendations', component: RecommendationsView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', component: NotFoundView }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
