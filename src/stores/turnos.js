import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/services/supabase'

export const useTurnosStore = defineStore('turnos', () => {
  const turnos = ref([])

  async function cargar() {
    const { data, error } = await supabase.from('turnos').select('*').order('fecha', { ascending: true })
    if (error) throw error
    turnos.value = data
  }

  async function crear(data) {
    const { data: nuevo, error } = await supabase.from('turnos').insert(data).select().single()
    if (error) throw error
    turnos.value.push(nuevo)
  }

  async function actualizar(id, data) {
    const { data: actualizado, error } = await supabase.from('turnos').update(data).eq('id', id).select().single()
    if (error) throw error
    const idx = turnos.value.findIndex(t => t.id === id)
    if (idx !== -1) turnos.value[idx] = actualizado
  }

  async function eliminar(id) {
    const { error } = await supabase.from('turnos').delete().eq('id', id)
    if (error) throw error
    turnos.value = turnos.value.filter(t => t.id !== id)
  }

  return { turnos, cargar, crear, actualizar, eliminar }
})