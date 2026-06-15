import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/services/supabase'

export const useMisTurnosStore = defineStore('misTurnos', () => {
  const turnos = ref([])

  async function cargar() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('turnos')
      .select('*')
      .eq('usuario_id', user.id)
      .order('fecha', { ascending: true })
    if (error) throw error
    turnos.value = data
  }

  async function crear(data) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: nuevo, error } = await supabase
      .from('turnos')
      .insert({ ...data, usuario_id: user.id, estado: 'pendiente' })
      .select()
      .single()
    if (error) throw error
    turnos.value.push(nuevo)
  }

  async function cancelar(id) {
    const { data: actualizado, error } = await supabase
      .from('turnos')
      .update({ estado: 'cancelado' })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    const idx = turnos.value.findIndex(t => t.id === id)
    if (idx !== -1) turnos.value[idx] = actualizado
  }

  return { turnos, cargar, crear, cancelar }
})