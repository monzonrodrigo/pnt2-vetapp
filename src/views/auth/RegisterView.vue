<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h1>🐾 VetTech</h1>
      <p>Crear cuenta</p>
      <input v-model="nombre" type="text" placeholder="Nombre completo" />
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Contraseña (mín. 6 caracteres)" />
      <button @click="handleRegister">Registrarse</button>
      <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
      <p v-if="error" class="error">{{ error }}</p>
      <RouterLink to="/login">¿Ya tenés cuenta? Ingresá</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/services/supabase'

const nombre = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const mensaje = ref('')
const authStore = useAuthStore()

async function handleRegister() {
  if (!nombre.value || !email.value || !password.value) {
    error.value = 'Completá todos los campos'
    return
  }
  try {
    const data = await authStore.register(email.value, password.value)
    if (data.user) {
      await supabase
        .from('perfiles')
        .update({ nombre: nombre.value })
        .eq('id', data.user.id)
    }
    mensaje.value = 'Cuenta creada. Revisá tu email para confirmar.'
    error.value = ''
  } catch (e) {
    error.value = 'Error al registrarse: ' + e.message
  }
}
</script>

<style scoped>
.login-wrapper { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f1f5f9; }
.login-card { background: white; padding: 2rem; border-radius: 12px; display: flex; flex-direction: column; gap: 1rem; width: 320px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
h1 { font-size: 1.8rem; font-weight: 700; color: #1e293b; }
p { color: #64748b; font-size: 0.95rem; }
button { background: #2563eb; color: white; border: none; padding: 0.75rem; border-radius: 6px; cursor: pointer; font-size: 1rem; }
.error { color: #ef4444; font-size: 0.85rem; }
.mensaje { color: #16a34a; font-size: 0.85rem; }
</style>