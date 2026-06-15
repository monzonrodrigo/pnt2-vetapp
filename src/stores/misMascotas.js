import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/services/supabase'

export const useMisMascotasStore = defineStore('misMascotas', () => {
  const mascotas = ref([])

  async function cargar() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('mascotas')
      .select('*')
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: false })
    if (error) throw error
    mascotas.value = data
  }

  async function crear(data) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: nueva, error } = await supabase
      .from('mascotas')
      .insert({ ...data, usuario_id: user.id })
      .select()
      .single()
    if (error) throw error
    mascotas.value.unshift(nueva)
  }

  async function actualizar(id, data) {
    const { data: actualizada, error } = await supabase
      .from('mascotas')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    const idx = mascotas.value.findIndex(m => m.id === id)
    if (idx !== -1) mascotas.value[idx] = actualizada
  }

  async function eliminar(id) {
    const { error } = await supabase.from('mascotas').delete().eq('id', id)
    if (error) throw error
    mascotas.value = mascotas.value.filter(m => m.id !== id)
  }

  return { mascotas, cargar, crear, actualizar, eliminar }
})