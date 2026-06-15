<template>
  <div v-if="cargando" class="loading">Cargando...</div>
  <div v-else>
    <AppLayout v-if="authStore.isAuthenticated" />
    <RouterView v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'

const authStore = useAuthStore()
const cargando = ref(true)

onMounted(async () => {
  await authStore.init()
  cargando.value = false
})
</script>

<style scoped>
.loading {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 1rem;
}
</style>