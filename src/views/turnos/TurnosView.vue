<template>
  <div>
    <div class="page-header">
      <h1>Turnos</h1>
      <button v-if="authStore.isAdmin || authStore.isVeterinario" class="btn-primary" @click="abrirModal()">+ Nuevo turno</button>
    </div>

    <div class="tabla-wrapper">
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Mascota</th>
            <th>Dueño</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="turno in turnosStore.turnos" :key="turno.id">
            <td>{{ formatFecha(turno.fecha) }}</td>
            <td>{{ turno.hora }}</td>
            <td>{{ turno.mascotas?.nombre || '-' }}</td>
            <td>{{ turno.mascotas?.duenos?.nombre || '-' }}</td>
            <td>{{ turno.motivo }}</td>
            <td><span :class="['badge', turno.estado]">{{ turno.estado }}</span></td>
            <td class="acciones">
              <button v-if="authStore.isAdmin || authStore.isVeterinario" class="btn-edit" @click="abrirModal(turno)">Editar</button>
              <button v-if="authStore.isAdmin || authStore.isVeterinario" class="btn-delete" @click="eliminar(turno.id)">Eliminar</button>
            </td>
          </tr>
          <tr v-if="turnosStore.turnos.length === 0">
            <td colspan="7" class="empty">No hay turnos registrados</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modalVisible" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal">
        <h2>{{ editando ? 'Editar turno' : 'Nuevo turno' }}</h2>
        <input v-model="form.fecha" type="date" :min="hoy" />

        <select v-model="form.hora" :disabled="!form.fecha">
        <option value="">
        {{ form.fecha ? 'Seleccionar horario' : 'Primero elegí una fecha' }}
        </option>
        <option v-for="hora in horariosDisponibles" :key="hora" :value="hora">
        {{ hora }} hs
        </option>
        </select>

        <p v-if="form.fecha && horariosDisponibles.length === 0" style="color: #ef4444; font-size: 0.85rem; margin-top: 0.25rem;">
         No quedan turnos disponibles para esta fecha.
        </p>
        <select v-model="form.mascota_id">
          <option value="">Seleccionar mascota</option>
          <option v-for="m in mascotasStore.mascotas" :key="m.id" :value="m.id">
            {{ m.nombre }}
          </option>
        </select>
        <input v-model="form.motivo" placeholder="Motivo de la consulta" />
        <select v-model="form.estado">
          <option value="pendiente">Pendiente</option>
          <option value="confirmado">Confirmado</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <div class="modal-actions">
          <button class="btn-secondary" @click="cerrarModal">Cancelar</button>
          <button class="btn-primary" @click="guardar">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTurnosStore } from '@/stores/turnos'
import { useMascotasStore } from '@/stores/mascotas'
import { useAuthStore } from '@/stores/auth'


const turnosStore = useTurnosStore()
const mascotasStore = useMascotasStore()
const authStore = useAuthStore()
const modalVisible = ref(false)
const hoy = new Date().toISOString().slice(0, 10)
const editando = ref(null)
const form = ref({ fecha: '', hora: '', mascota_id: '', motivo: '', estado: 'pendiente' })
const todosLosHorarios = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
]

const horariosDisponibles = computed(() => {
  if (!form.value.fecha) return []

  const ahora = new Date()
  const esHoy = form.value.fecha === hoy

  return todosLosHorarios.filter(hora => {
    if (esHoy) {
      const [h, m] = hora.split(':').map(Number)
      const horaTurno = new Date()
      horaTurno.setHours(h, m, 0, 0)
      if (horaTurno < ahora) return false
    }

    const turnosAgendados = turnosStore.turnos.filter(t => 
      t.fecha === form.value.fecha && 
      t.hora === hora && 
      t.estado !== 'cancelado'
    )

    return turnosAgendados.length < 2
  })
})

function formatFecha(fecha) {
  if (!fecha) return '-'
  const [year, month, day] = fecha.split('-')
  return `${day}/${month}/${year}`
}

function abrirModal(turno = null) {
  editando.value = turno
  form.value = turno
    ? { fecha: turno.fecha?.slice(0, 10), hora: turno.hora, mascota_id: turno.mascota_id, motivo: turno.motivo, estado: turno.estado }
    : { fecha: '', hora: '', mascota_id: '', motivo: '', estado: 'pendiente' }
  modalVisible.value = true
}

function cerrarModal() {
  modalVisible.value = false
  editando.value = null
}

async function guardar() {
if (
    !String(form.value.fecha).trim() || 
    !String(form.value.hora).trim() || 
    !String(form.value.motivo).trim() || 
    !String(form.value.mascota_id).trim()
  ) {
    alert('Por favor, completá todos los campos obligatorios.')
    return
  }

  if (form.value.fecha < hoy) {
    alert('No podés agendar una fecha en el pasado.')
    return
  }

  const turnosExistentes = turnosStore.turnos.filter(t => 
    t.fecha === form.value.fecha && 
    t.hora === form.value.hora && 
    t.estado !== 'cancelado'
  )
  if (turnosExistentes.length >= 2) {
    alert('Ambas salas están ocupadas en ese horario. Por favor elegí otro.')
    return
  }

  if (editando.value) {
    await turnosStore.actualizar(editando.value.id, form.value)
  } else {
    await turnosStore.crear(form.value)
  }
  cerrarModal()
}

async function eliminar(id) {
  if (confirm('¿Eliminar este turno?')) await turnosStore.eliminar(id)
}

onMounted(() => {
  turnosStore.cargar()
  mascotasStore.cargar()
})
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
h1 { font-size: 1.6rem; font-weight: 700; color: #1e293b; }
.tabla-wrapper { background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th { background: #f8fafc; padding: 0.85rem 1rem; text-align: left; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; border-bottom: 1px solid #e2e8f0; }
td { padding: 0.85rem 1rem; border-bottom: 1px solid #f1f5f9; color: #334155; }
tr:last-child td { border-bottom: none; }
.acciones { display: flex; gap: 0.5rem; }
.empty { text-align: center; color: #94a3b8; padding: 2rem; }
.btn-primary { background: #2563eb; color: white; border: none; padding: 0.55rem 1.1rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
.btn-secondary { background: #f1f5f9; color: #334155; border: none; padding: 0.55rem 1.1rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
.btn-edit { background: #f0f9ff; color: #0284c7; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.85rem; }
.btn-delete { background: #fef2f2; color: #ef4444; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.85rem; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: white; border-radius: 12px; padding: 2rem; width: 400px; display: flex; flex-direction: column; gap: 1rem; }
.modal h2 { font-size: 1.2rem; color: #1e293b; }
.modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
select { padding: 0.6rem 0.8rem; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 1rem; color: #1e293b; background: #f8fafc; }
.badge { padding: 0.25rem 0.65rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; text-transform: capitalize; }
.badge.pendiente { background: #fef9c3; color: #854d0e; }
.badge.confirmado { background: #dcfce7; color: #166534; }
.badge.cancelado { background: #fee2e2; color: #991b1b; }
</style>