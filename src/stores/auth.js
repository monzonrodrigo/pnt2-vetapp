import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const perfil = ref(null)

  const isAuthenticated = computed(() => !!session.value)
  const isAdmin = computed(() => perfil.value?.rol === 'admin')
  const isVeterinario = computed(() => perfil.value?.rol === 'veterinario')
  const isDueno = computed(() => perfil.value?.rol === 'dueno')

  const initialized = ref(false)

  async function init() {
    if (initialized.value) return
  
    const { data } = await supabase.auth.getSession()
  
    session.value = data.session
    user.value = data.session?.user ?? null
  
    if (user.value) {
      await cargarPerfil()
    }
  
    supabase.auth.onAuthStateChange(async (_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user ?? null
  
      if (user.value) {
        await cargarPerfil()
      } else {
        perfil.value = null
      }
    })
  
    initialized.value = true
  }

  async function cargarPerfil() {
    const { data } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', user.value.id)
      .single()
    perfil.value = data
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    session.value = data.session
    user.value = data.user
    await cargarPerfil()
  }

  async function register(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }

  async function logout() {
    await supabase.auth.signOut()
    session.value = null
    user.value = null
    perfil.value = null
  }

  return {
    user,
    session,
    perfil,
    initialized,
    isAuthenticated,
    isAdmin,
    isVeterinario,
    isDueno,
    init,
    login,
    register,
    logout
  }
})