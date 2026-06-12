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
import axios from 'axios'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const authStore = useAuthStore()

async function handleLogin() {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
      email: email.value,
      password: password.value
    })
    authStore.setAuth(res.data.token, res.data.user)
    router.push('/dashboard')
  } catch (e) {
    error.value = 'Email o contraseña incorrectos'
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
</style>