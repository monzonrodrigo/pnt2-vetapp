import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useDuenosStore = defineStore('duenos', () => {
  const duenos = ref([])

  async function cargar() {
    const res = await api.get('/duenos')
    duenos.value = res.data
  }

  async function crear(data) {
    const res = await api.post('/duenos', data)
    duenos.value.push(res.data)
  }

  async function actualizar(id, data) {
    const res = await api.put(`/duenos/${id}`, data)
    const idx = duenos.value.findIndex(d => d._id === id)
    if (idx !== -1) duenos.value[idx] = res.data
  }

  async function eliminar(id) {
    await api.delete(`/duenos/${id}`)
    duenos.value = duenos.value.filter(d => d._id !== id)
  }

  return { duenos, cargar, crear, actualizar, eliminar }
})