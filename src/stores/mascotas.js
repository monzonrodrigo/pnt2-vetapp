import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useMascotasStore = defineStore('mascotas', () => {
  const mascotas = ref([])

  async function cargar() {
    const res = await api.get('/mascotas')
    mascotas.value = res.data
  }

  async function crear(data) {
    const res = await api.post('/mascotas', data)
    mascotas.value.push(res.data)
  }

  async function actualizar(id, data) {
    const res = await api.put(`/mascotas/${id}`, data)
    const idx = mascotas.value.findIndex(m => m._id === id)
    if (idx !== -1) mascotas.value[idx] = res.data
  }

  async function eliminar(id) {
    await api.delete(`/mascotas/${id}`)
    mascotas.value = mascotas.value.filter(m => m._id !== id)
  }

  return { mascotas, cargar, crear, actualizar, eliminar }
})