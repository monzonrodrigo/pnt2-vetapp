<template>
  <div>
    <div class="page-header">
      <h1>Mascotas</h1>
      <button class="btn-primary" @click="abrirModal()">+ Nueva mascota</button>
    </div>

    <div class="search-bar">
      <input v-model="busqueda" placeholder="Buscar por nombre o especie..." />
    </div>

    <div class="tabla-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Especie</th>
            <th>Raza</th>
            <th>Dueño</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mascota in mascotasFiltradas" :key="mascota._id">
            <td>{{ mascota.nombre }}</td>
            <td>{{ mascota.especie }}</td>
            <td>{{ mascota.raza }}</td>
            <td>{{ nombreDueno(mascota.dueno_id) }}</td>
            <td class="acciones">
              <button class="btn-edit" @click="abrirModal(mascota)">Editar</button>
              <button class="btn-delete" @click="eliminar(mascota._id)">Eliminar</button>
            </td>
          </tr>
          <tr v-if="mascotasFiltradas.length === 0">
            <td colspan="5" class="empty">No hay mascotas registradas</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modalVisible" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal">
        <h2>{{ editando ? 'Editar mascota' : 'Nueva mascota' }}</h2>
        <input v-model="form.nombre" placeholder="Nombre" />
        <input v-model="form.especie" placeholder="Especie (perro, gato...)" />
        <input v-model="form.raza" placeholder="Raza" />
        <input v-model="form.edad" placeholder="Edad (años)" type="number" />
        <select v-model="form.dueno_id">
          <option value="">Seleccionar dueño</option>
          <option v-for="d in duenosStore.duenos" :key="d._id" :value="d._id">
            {{ d.nombre }}
          </option>
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
import { useMascotasStore } from '@/stores/mascotas'
import { useDuenosStore } from '@/stores/duenos'

const store = useMascotasStore()
const duenosStore = useDuenosStore()
const busqueda = ref('')
const modalVisible = ref(false)
const editando = ref(null)
const form = ref({ nombre: '', especie: '', raza: '', edad: '', dueno_id: '' })

const mascotasFiltradas = computed(() =>
  store.mascotas.filter(m =>
    m.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
    m.especie.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

function nombreDueno(id) {
  const d = duenosStore.duenos.find(d => d._id === id)
  return d ? d.nombre : '-'
}

function abrirModal(mascota = null) {
  editando.value = mascota
  form.value = mascota
    ? { nombre: mascota.nombre, especie: mascota.especie, raza: mascota.raza, edad: mascota.edad, dueno_id: mascota.dueno_id }
    : { nombre: '', especie: '', raza: '', edad: '', dueno_id: '' }
  modalVisible.value = true
}

function cerrarModal() {
  modalVisible.value = false
  editando.value = null
}

async function guardar() {
  if (editando.value) {
    await store.actualizar(editando.value._id, form.value)
  } else {
    await store.crear(form.value)
  }
  cerrarModal()
}

async function eliminar(id) {
  if (confirm('¿Eliminar esta mascota?')) await store.eliminar(id)
}

onMounted(() => {
  store.cargar()
  duenosStore.cargar()
})
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
h1 { font-size: 1.6rem; font-weight: 700; color: #1e293b; }
.search-bar { margin-bottom: 1rem; }
.search-bar input { width: 100%; max-width: 360px; }
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
</style>