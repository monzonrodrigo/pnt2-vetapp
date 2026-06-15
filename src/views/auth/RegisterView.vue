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
    let mensajeTraducido = 'Ocurrió un error inesperado.'

    if (e.message.includes('User already registered')) {
      mensajeTraducido = 'El correo electrónico ya está registrado.'
    } else if (e.message.includes('Password should be at least 6 characters')) {
      mensajeTraducido = 'La contraseña debe tener al menos 6 caracteres.'
    } else if (e.message.includes('Invalid login credentials')) {
      mensajeTraducido = 'Credenciales inválidas.'
    } else if (e.message.includes('Unable to validate email address')) {
      mensajeTraducido = 'El formato del correo es inválido.'
    } else {
      mensajeTraducido = e.message 
    }
    error.value = 'Error: ' + mensajeTraducido
  }
}
</script>