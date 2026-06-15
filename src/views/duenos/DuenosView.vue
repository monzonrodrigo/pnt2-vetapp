<template>
  <div>
    <div class="page-header">
      <h1>Dueños</h1>
      <button v-if="authStore.isAdmin" class="btn-primary" @click="abrirModal()">+ Nuevo dueño</button>
    </div>

    <div class="search-bar">
      <input v-model="busqueda" placeholder="Buscar por nombre o email..." />
    </div>

    <div class="tabla-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dueno in duenosFiltrados" :key="dueno.id">
            <td>{{ dueno.nombre }}</td>
            <td>{{ dueno.email }}</td>
            <td>{{ dueno.telefono }}</td>
            <td class="acciones">
              <button v-if="authStore.isAdmin" class="btn-edit" @click="abrirModal(dueno)">Editar</button>
              <button v-if="authStore.isAdmin" class="btn-delete" @click="eliminar(dueno.id)">Eliminar</button>
            </td>
          </tr>
          <tr v-if="duenosFiltrados.length === 0">
            <td colspan="4" class="empty">No hay dueños registrados</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modalVisible" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal">
        <h2>{{ editando ? 'Editar dueño' : 'Nuevo dueño' }}</h2>
        <input v-model="form.nombre" placeholder="Nombre completo" />
        <input v-model="form.email" placeholder="Email" type="email" />
        <input v-model="form.telefono" placeholder="Teléfono" />
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
import { useDuenosStore } from '@/stores/duenos'
import { useAuthStore } from '@/stores/auth'

const store = useDuenosStore()
const authStore = useAuthStore()
const busqueda = ref('')
const modalVisible = ref(false)
const editando = ref(null)
const form = ref({ nombre: '', email: '', telefono: '' })

const duenosFiltrados = computed(() =>
  store.duenos.filter(d =>
    d.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
    d.email.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

function abrirModal(dueno = null) {
  editando.value = dueno
  form.value = dueno
    ? { nombre: dueno.nombre, email: dueno.email, telefono: dueno.telefono }
    : { nombre: '', email: '', telefono: '' }
  modalVisible.value = true
}

function cerrarModal() {
  modalVisible.value = false
  editando.value = null
}

async function guardar() {
  if (editando.value) {
    await store.actualizar(editando.value.id, form.value)
  } else {
    await store.crear(form.value)
  }
  cerrarModal()
}

async function eliminar(id) {
  if (confirm('¿Eliminar este dueño?')) await store.eliminar(id)
}

onMounted(() => store.cargar())
</script>