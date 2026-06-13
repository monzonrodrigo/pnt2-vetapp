<template>
  <div>
    <AppLayout v-if="authStore.isAuthenticated" />
    <RouterView v-else />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'

const authStore = useAuthStore()
onMounted(() => authStore.init())
</script>