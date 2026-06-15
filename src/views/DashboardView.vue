<template>
  <div>
    <h1>Dashboard</h1>
    <p class="welcome">Bienvenido, {{ authStore.perfil?.nombre || authStore.user?.email }}</p>
    <p v-if="authStore.isAdmin" class="rol">Rol: <strong>{{ authStore.perfil?.rol }}</strong></p>

    <div class="cards" v-if="authStore.isAdmin || authStore.isVeterinario">
      <div class="card">
        <div class="card-icon blue">👤</div>
        <div class="card-info">
          <span class="card-value">{{ duenosStore.duenos.length }}</span>
          <span class="card-label">Dueños registrados</span>
        </div>
      </div>
      <div class="card">
        <div class="card-icon green">🐾</div>
        <div class="card-info">
          <span class="card-value">{{ mascotasStore.mascotas.length }}</span>
          <span class="card-label">Mascotas registradas</span>
        </div>
      </div>
      <div class="card">
        <div class="card-icon yellow">📅</div>
        <div class="card-info">
          <span class="card-value">{{ turnosHoy }}</span>
          <span class="card-label">Turnos hoy</span>
        </div>
      </div>
      <div class="card">
        <div class="card-icon purple">⏳</div>
        <div class="card-info">
          <span class="card-value">{{ turnosPendientes }}</span>
          <span class="card-label">Turnos pendientes</span>
        </div>
      </div>
    </div>

    <div class="cards" v-if="authStore.isDueno">
      <div class="card">
        <div class="card-icon yellow">📅</div>
        <div class="card-info">
          <span class="card-value">{{ turnosHoy }}</span>
          <span class="card-label">Mis turnos hoy</span>
        </div>
      </div>
      <div class="card">
        <div class="card-icon purple">⏳</div>
        <div class="card-info">
          <span class="card-value">{{ turnosPendientes }}</span>
          <span class="card-label">Mis turnos pendientes</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDuenosStore } from '@/stores/duenos'
import { useMascotasStore } from '@/stores/mascotas'
import { useTurnosStore } from '@/stores/turnos'

const authStore = useAuthStore()
const duenosStore = useDuenosStore()
const mascotasStore = useMascotasStore()
const turnosStore = useTurnosStore()

const hoy = new Date().toISOString().slice(0, 10)
const turnosHoy = computed(() => turnosStore.turnos.filter(t => t.fecha === hoy).length)
const turnosPendientes = computed(() => turnosStore.turnos.filter(t => t.estado === 'pendiente').length)

onMounted(async () => {
  await turnosStore.cargar()
  if (authStore.isAdmin || authStore.isVeterinario) {
    await duenosStore.cargar()
    await mascotasStore.cargar()
  }
})
</script>

<style scoped>
h1 { font-size: 1.6rem; font-weight: 700; color: #1e293b; margin-bottom: 0.25rem; }
.welcome { color: #64748b; margin-bottom: 0.25rem; }
.rol { color: #64748b; margin-bottom: 1.5rem; font-size: 0.9rem; }
.cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
.card { background: white; border-radius: 10px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); display: flex; align-items: center; gap: 1rem; }
.card-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
.card-icon.blue { background: #eff6ff; }
.card-icon.green { background: #f0fdf4; }
.card-icon.yellow { background: #fefce8; }
.card-icon.purple { background: #faf5ff; }
.card-info { display: flex; flex-direction: column; }
.card-value { font-size: 1.8rem; font-weight: 700; color: #1e293b; line-height: 1; }
.card-label { font-size: 0.8rem; color: #64748b; margin-top: 0.25rem; }
</style>