<template>
    <div>
      <div class="page-header">
        <h1>Turnos</h1>
        <button class="btn-primary" @click="abrirModal()">+ Nuevo turno</button>
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
            <tr v-for="turno in turnosStore.turnos" :key="turno._id">
              <td>{{ formatFecha(turno.fecha) }}</td>
              <td>{{ turno.hora }}</td>
              <td>{{ nombreMascota(turno.mascota_id) }}</td>
              <td>{{ turno.motivo }}</td>
              <td><span :class="['badge', turno.estado]">{{ turno.estado }}</span></td>
              <td class="acciones">
                <button class="btn-edit" @click="abrirModal(turno)">Editar</button>
                <button class="btn-delete" @click="eliminar(turno._id)">Eliminar</button>
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
            <option v-for="m in mascotasStore.mascotas" :key="m._id" :value="m._id">
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
  
  const turnosStore = useTurnosStore()
  const mascotasStore = useMascotasStore()
  const modalVisible = ref(false)
  const editando = ref(null)
  const form = ref({ fecha: '', hora: '', mascota_id: '', motivo: '', estado: 'pendiente' })
  
  function formatFecha(fecha) {
    if (!fecha) return '-'
    return new Date(fecha).toLocaleDateString('es-AR')
  }
  
  function nombreMascota(id) {
    const m = mascotasStore.mascotas.find(m => m._id === id)
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
    if (editando.value) {
      await turnosStore.actualizar(editando.value._id, form.value)
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