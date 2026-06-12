import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: () => import('@/views/auth/LoginView.vue') },
  { path: '/register', component: () => import('@/views/auth/RegisterView.vue') },
  { path: '/dashboard', component: () => import('@/views/DashboardView.vue'), meta: { requiresAuth: true } },
  { path: '/duenos', component: () => import('@/views/duenos/DuenosView.vue'), meta: { requiresAuth: true } },
  { path: '/mascotas', component: () => import('@/views/mascotas/MascotasView.vue'), meta: { requiresAuth: true } },
  { path: '/turnos', component: () => import('@/views/turnos/TurnosView.vue'), meta: { requiresAuth: true } },
  { path: '/asistente', component: () => import('@/views/AsistenteView.vue'), meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router