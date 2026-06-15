<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h1>🐾 VetTech</h1>
      <p>Iniciá sesión para continuar</p>
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Contraseña" />
      <button @click="handleLogin">Ingresar</button>
      <p v-if="error" class="error">{{ error }}</p>
      <RouterLink to="/register">¿No tenés cuenta? Registrate</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const authStore = useAuthStore()

async function handleLogin() {
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = 'Email o contraseña incorrectos'
  }
}
</script>