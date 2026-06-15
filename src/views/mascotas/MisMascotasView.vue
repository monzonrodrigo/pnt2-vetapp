<template>
  <div>
    <div class="page-header">
      <h1>Mis Mascotas</h1>
      <button class="btn-primary" @click="abrirModal()">+ Nueva mascota</button>
    </div>
    <div class="tabla-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Especie</th>
            <th>Raza</th>
            <th>Edad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mascota in store.mascotas" :key="mascota.id">
            <td>{{ mascota.nombre }}</td>
            <td>{{ mascota.especie }}</td>
            <td>{{ mascota.raza }}</td>
            <td>{{ mascota.edad }} años</td>
            <td class="acciones">
              <button class="btn-edit" @click="abrirModal(mascota)">Editar</button>
              <button class="btn-delete" @click="eliminar(mascota.id)">Eliminar</button>
            </td>
          </tr>
          <tr v-if="store.mascotas.length === 0">
            <td colspan="5" class="empty">No tenés mascotas registradas</td>
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
import { useMisMascotasStore } from '@/stores/misMascotas'

const store = useMisMascotasStore()
const modalVisible = ref(false)
const editando = ref(null)
const form = ref({ nombre: '', especie: '', raza: '', edad: '' })

function abrirModal(mascota = null) {
  editando.value = mascota
  form.value = mascota
    ? { nombre: mascota.nombre, especie: mascota.especie, raza: mascota.raza, edad: mascota.edad }
    : { nombre: '', especie: '', raza: '', edad: '' }
  modalVisible.value = true
}

function cerrarModal() { 
  modalVisible.value = false; 
  editando.value = null 
}

async function guardar() {
  if (
    !String(form.value.nombre).trim() || 
    !String(form.value.especie).trim() || 
    !String(form.value.raza).trim() || 
    !String(form.value.edad).trim()
  ) {
    alert('Por favor, completá todos los campos obligatorios.')
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

onMounted(() => store.cargar())
</script>