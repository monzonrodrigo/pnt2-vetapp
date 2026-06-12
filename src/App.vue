<template>
  <div>
    <AppLayout v-if="authStore.isAuthenticated" />
    <RouterView v-else />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'

const authStore = useAuthStore()
</script>
