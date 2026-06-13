import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/services/supabase'

export const useDuenosStore = defineStore('duenos', () => {
  const duenos = ref([])

  async function cargar() {
    const { data, error } = await supabase.from('duenos').select('*').order('created_at', { ascending: false })
    if (error) throw error
    duenos.value = data
  }

  async function crear(data) {
    const { data: nuevo, error } = await supabase.from('duenos').insert(data).select().single()
    if (error) throw error
    duenos.value.unshift(nuevo)
  }

  async function actualizar(id, data) {
    const { data: actualizado, error } = await supabase.from('duenos').update(data).eq('id', id).select().single()
    if (error) throw error
    const idx = duenos.value.findIndex(d => d.id === id)
    if (idx !== -1) duenos.value[idx] = actualizado
  }

  async function eliminar(id) {
    const { error } = await supabase.from('duenos').delete().eq('id', id)
    if (error) throw error
    duenos.value = duenos.value.filter(d => d.id !== id)
  }

  return { duenos, cargar, crear, actualizar, eliminar }
})