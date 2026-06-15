<template>
    <div>
      <div class="page-header">
        <h1>Mis Turnos</h1>
        <button class="btn-primary" @click="abrirModal()">+ Pedir turno</button>
      </div>
  
      <div class="tabs">
        <button :class="['tab', { active: tab === 'proximos' }]" @click="tab = 'proximos'">Próximos</button>
        <button :class="['tab', { active: tab === 'historial' }]" @click="tab = 'historial'">Historial</button>
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
            <tr v-for="turno in turnosFiltrados" :key="turno.id">
              <td>{{ formatFecha(turno.fecha) }}</td>
              <td>{{ turno.hora }}</td>
              <td>{{ nombreMascota(turno.mascota_id) }}</td>
              <td>{{ turno.motivo }}</td>
              <td><span :class="['badge', turno.estado]">{{ turno.estado }}</span></td>
              <td>
                <button
                  v-if="tab === 'proximos' && turno.estado === 'pendiente'"
                  class="btn-delete"
                  @click="cancelar(turno.id)"
                >
                  Cancelar
                </button>
              </td>
            </tr>
            <tr v-if="turnosFiltrados.length === 0">
              <td colspan="6" class="empty">No hay turnos</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-if="modalVisible" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal">
          <h2>Pedir turno</h2>
          <input v-model="form.fecha" type="date" :min="hoy" />
          <input v-model="form.hora" type="time" />
          <select v-model="form.mascota_id">
            <option value="">Seleccionar mascota</option>
            <option v-for="m in misMascotasStore.mascotas" :key="m.id" :value="m.id">
              {{ m.nombre }}
            </option>
          </select>
          <input v-model="form.motivo" placeholder="Motivo de la consulta" />
          <div class="modal-actions">
            <button class="btn-secondary" @click="cerrarModal">Cancelar</button>
            <button class="btn-primary" @click="guardar">Confirmar turno</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useMisTurnosStore } from '@/stores/misTurnos'
  import { useMisMascotasStore } from '@/stores/misMascotas'
  
  const store = useMisTurnosStore()
  const misMascotasStore = useMisMascotasStore()
  const tab = ref('proximos')
  const modalVisible = ref(false)
  const hoy = new Date().toISOString().slice(0, 10)
  const form = ref({ fecha: '', hora: '', mascota_id: '', motivo: '' })
  
  const turnosFiltrados = computed(() => {
    if (tab.value === 'proximos') {
      return store.turnos.filter(t => t.fecha >= hoy && t.estado !== 'cancelado')
    }
    return store.turnos.filter(t => t.fecha < hoy || t.estado === 'cancelado')
  })
  
  function nombreMascota(id) {
    const m = misMascotasStore.mascotas.find(m => m.id === id)
    return m ? m.nombre : '-'
  }
  
  function formatFecha(fecha) {
    if (!fecha) return '-'
    return new Date(fecha).toLocaleDateString('es-AR')
  }
  
  function abrirModal() { modalVisible.value = true }
  function cerrarModal() { modalVisible.value = false; form.value = { fecha: '', hora: '', mascota_id: '', motivo: '' } }
  
  async function guardar() {
    await store.crear(form.value)
    cerrarModal()
  }
  
  async function cancelar(id) {
    if (confirm('¿Cancelar este turno?')) await store.cancelar(id)
  }
  
  onMounted(() => {
    store.cargar()
    misMascotasStore.cargar()
  })
  </script>
  
  <style scoped>
  .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  h1 { font-size: 1.6rem; font-weight: 700; color: #1e293b; }
  .tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
  .tab { padding: 0.5rem 1.25rem; border-radius: 6px; border: 1px solid #e2e8f0; background: white; cursor: pointer; color: #64748b; font-size: 0.9rem; }
  .tab.active { background: #2563eb; color: white; border-color: #2563eb; }
  .tabla-wrapper { background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #f8fafc; padding: 0.85rem 1rem; text-align: left; font-size: 0.8rem; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; }
  td { padding: 0.85rem 1rem; border-bottom: 1px solid #f1f5f9; color: #334155; }
  tr:last-child td { border-bottom: none; }
  .empty { text-align: center; color: #94a3b8; padding: 2rem; }
  .btn-primary { background: #2563eb; color: white; border: none; padding: 0.55rem 1.1rem; border-radius: 6px; cursor: pointer; }
  .btn-secondary { background: #f1f5f9; color: #334155; border: none; padding: 0.55rem 1.1rem; border-radius: 6px; cursor: pointer; }
  .btn-delete { background: #fef2f2; color: #ef4444; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
  .modal { background: white; border-radius: 12px; padding: 2rem; width: 400px; display: flex; flex-direction: column; gap: 1rem; }
  .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }
  select { padding: 0.6rem 0.8rem; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 1rem; color: #1e293b; background: #f8fafc; }
  .badge { padding: 0.25rem 0.65rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; text-transform: capitalize; }
  .badge.pendiente { background: #fef9c3; color: #854d0e; }
  .badge.confirmado { background: #dcfce7; color: #166534; }
  .badge.cancelado { background: #fee2e2; color: #991b1b; }
  </style>