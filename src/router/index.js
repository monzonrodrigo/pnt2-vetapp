import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/duenos',
    component: () => import('@/views/duenos/DuenosView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'veterinario'] }
  },
  {
    path: '/mascotas',
    component: () => import('@/views/mascotas/MascotasView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'veterinario'] }
  },
  {
    path: '/turnos',
    component: () => import('@/views/turnos/TurnosView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/asistente',
    component: () => import('@/views/AsistenteView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/sin-acceso',
    component: () => import('@/views/SinAccesoView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.init()
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next('/dashboard')
  }
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }

  if (to.meta.roles && !to.meta.roles.includes(authStore.perfil?.rol)) {
    return next('/sin-acceso')
  }

  next()
})

export default router