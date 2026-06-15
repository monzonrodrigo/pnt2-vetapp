<template>
  <div>
    <div class="page-header">
      <h1>Mascotas</h1>
      <button v-if="authStore.isAdmin" class="btn-primary" @click="abrirModal()">+ Nueva mascota</button>
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
          <tr v-for="mascota in mascotasFiltradas" :key="mascota.id">
            <td>{{ mascota.nombre }}</td>
            <td>{{ mascota.especie }}</td>
            <td>{{ mascota.raza }}</td>
            <td>{{ nombreDueno(mascota.dueno_id) }}</td>
            <td class="acciones">
              <button v-if="authStore.isAdmin" class="btn-edit" @click="abrirModal(mascota)">Editar</button>
              <button v-if="authStore.isAdmin" class="btn-delete" @click="eliminar(mascota.id)">Eliminar</button>
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
          <option v-for="d in duenosStore.duenos" :key="d.id" :value="d.id">
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
import { useAuthStore } from '@/stores/auth'

const store = useMascotasStore()
const authStore = useAuthStore()
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
  const d = duenosStore.duenos.find(d => d.id === id)
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
  if (
    !String(form.value.nombre).trim() || 
    !String(form.value.especie).trim() || 
    !String(form.value.raza).trim() || 
    !String(form.value.edad).trim() ||
    !String(form.value.dueno_id).trim()
  ) {
    alert('Por favor, completá todos los campos obligatorios y seleccioná un dueño.')
    return
  }
  if (editando.value) {
    await store.actualizar(editando.value.id, form.value)
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