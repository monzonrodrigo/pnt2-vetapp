<template>
  <div class="app-layout">
    <nav class="sidebar">
      <div class="logo">
        <h2>🐾 VetTech</h2>
      </div>
      <div class="rol-badge" :class="authStore.perfil?.rol">
        {{ authStore.perfil?.rol || 'cargando...' }}
      </div>
      <ul>
        <li><RouterLink to="/dashboard">Dashboard</RouterLink></li>
        <li v-if="authStore.isAdmin || authStore.isVeterinario">
          <RouterLink to="/duenos">Dueños</RouterLink>
        </li>
        <li v-if="authStore.isAdmin || authStore.isVeterinario">
          <RouterLink to="/mascotas">Mascotas</RouterLink>
        </li>
        <li><RouterLink to="/turnos">Turnos</RouterLink></li>
        <li><RouterLink to="/asistente">🤖 Asistente</RouterLink></li>
      </ul>
      <button @click="handleLogout">Cerrar sesión</button>
    </nav>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-layout { display: flex; height: 100vh; }
.sidebar { width: 220px; background: #1e293b; color: white; padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 1rem; }
.sidebar ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
.sidebar a { color: #cbd5e1; text-decoration: none; padding: 0.5rem 0.75rem; border-radius: 6px; display: block; }
.sidebar a.router-link-active { background: #2563eb; color: white; }
.sidebar button { background: #ef4444; color: white; border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer; }
.content { flex: 1; padding: 2rem; overflow-y: auto; background: #f8fafc; }
.rol-badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; text-transform: capitalize; text-align: center; }
.rol-badge.admin { background: #7c3aed; color: white; }
.rol-badge.veterinario { background: #0284c7; color: white; }
.rol-badge.dueno { background: #16a34a; color: white; }
</style>