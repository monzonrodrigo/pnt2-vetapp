<template>
    <div>
      <div class="page-header">
        <h1>Turnos</h1>
        <button v-if="authStore.isAdmin" class="btn-primary" @click="abrirModal()">+ Nuevo turno</button>
      </div>
  
      <div class="tabla-wrapper">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Mascota</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="turno in turnosStore.turnos" :key="turno.id">
              <td>{{ formatFecha(turno.fecha) }}</td>
              <td>{{ turno.hora }}</td>
              <td>{{ nombreMascota(turno.mascota_id) }}</td>
              <td>{{ turno.motivo }}</td>
              <td><span :class="['badge', turno.estado]">{{ turno.estado }}</span></td>
              <td class="acciones">
                <button class="btn-edit" @click="abrirModal(turno)">Editar</button>
                <button class="btn-delete" @click="eliminar(turno.id)">Eliminar</button>
              </td>
            </tr>
            <tr v-if="turnosStore.turnos.length === 0">
              <td colspan="6" class="empty">No hay turnos registrados</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-if="modalVisible" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal">
          <h2>{{ editando ? 'Editar turno' : 'Nuevo turno' }}</h2>
          <input v-model="form.fecha" type="date" />
          <input v-model="form.hora" type="time" />
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
  import { ref, onMounted } from 'vue'
  import { useTurnosStore } from '@/stores/turnos'
  import { useMascotasStore } from '@/stores/mascotas'
  import { useAuthStore } from '@/stores/auth'
  
  const turnosStore = useTurnosStore()
  const mascotasStore = useMascotasStore()
  const authStore = useAuthStore()
  const modalVisible = ref(false)
  const editando = ref(null)
  const form = ref({ fecha: '', hora: '', mascota_id: '', motivo: '', estado: 'pendiente' })
  
  function formatFecha(fecha) {
    if (!fecha) return '-'
    return new Date(fecha).toLocaleDateString('es-AR')
  }
  
  function nombreMascota(id) {
    const m = mascotasStore.mascotas.find(m => m.id === id)
    return m ? m.nombre : '-'
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
    !String(form.value.mascota_id).trim() || 
    !String(form.value.motivo).trim()
  ) {
    alert('Por favor, completá todos los datos del turno.')
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
  .badge { padding: 0.25rem 0.65rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; text-transform: capitalize; }
  .badge.pendiente { background: #fef9c3; color: #854d0e; }
  .badge.confirmado { background: #dcfce7; color: #166534; }
  .badge.cancelado { background: #fee2e2; color: #991b1b; }
  </style>