import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useTurnosStore = defineStore('turnos', () => {
  const turnos = ref([])

  async function cargar() {
    const res = await api.get('/turnos')
    turnos.value = res.data
  }

  async function crear(data) {
    const res = await api.post('/turnos', data)
    turnos.value.push(res.data)
  }

  async function actualizar(id, data) {
    const res = await api.put(`/turnos/${id}`, data)
    const idx = turnos.value.findIndex(t => t._id === id)
    if (idx !== -1) turnos.value[idx] = res.data
  }

  async function eliminar(id) {
    await api.delete(`/turnos/${id}`)
    turnos.value = turnos.value.filter(t => t._id !== id)
  }

  return { turnos, cargar, crear, actualizar, eliminar }
})