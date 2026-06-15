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