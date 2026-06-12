<template>
    <div class="asistente">
      <div class="page-header">
        <h1>🤖 Asistente Veterinario</h1>
        <p class="subtitle">Consultá sobre salud, síntomas y cuidados de tu mascota</p>
      </div>
  
      <div class="chat-wrapper">
        <div class="messages" ref="messagesRef">
          <div v-if="mensajes.length === 0" class="empty-chat">
            <p>👋 ¡Hola! Soy tu asistente veterinario.</p>
            <p>Preguntame sobre síntomas, alimentación, cuidados o cualquier duda sobre tu mascota.</p>
            <div class="sugerencias">
              <button v-for="s in sugerencias" :key="s" @click="enviarSugerencia(s)">{{ s }}</button>
            </div>
          </div>
  
          <div v-for="(msg, i) in mensajes" :key="i" :class="['message', msg.role]">
            <div class="bubble">{{ msg.text }}</div>
          </div>
  
          <div v-if="cargando" class="message model">
            <div class="bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
  
        <div class="input-area">
          <input
            v-model="input"
            placeholder="Escribí tu consulta..."
            @keyup.enter="enviar"
            :disabled="cargando"
          />
          <button @click="enviar" :disabled="cargando || !input.trim()">Enviar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue'
  import { preguntarGemini } from '@/services/gemini'
  
  const input = ref('')
  const mensajes = ref([])
  const cargando = ref(false)
  const messagesRef = ref(null)
  
  const sugerencias = [
    '¿Qué vacunas necesita un cachorro?',
    'Mi perro no quiere comer, ¿qué hago?',
    '¿Cada cuánto desparasitar a un gato?',
    '¿Qué alimentos son tóxicos para perros?'
  ]
  
  function buildHistorial() {
    return mensajes.value.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }))
  }
  
  async function enviar() {
    const texto = input.value.trim()
    if (!texto || cargando.value) return
  
    mensajes.value.push({ role: 'user', text: texto })
    input.value = ''
    cargando.value = true
    await scrollAbajo()
  
    try {
      const historial = buildHistorial().slice(0, -1)
      const respuesta = await preguntarGemini(texto, historial)
      mensajes.value.push({ role: 'model', text: respuesta })
    } catch (e) {
      mensajes.value.push({ role: 'model', text: 'Error al conectar con el asistente. Verificá tu API key.' })
    } finally {
      cargando.value = false
      await scrollAbajo()
    }
  }
  
  async function enviarSugerencia(texto) {
    input.value = texto
    await enviar()
  }
  
  async function scrollAbajo() {
    await nextTick()
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  }
  </script>
  
  <style scoped>
  .page-header { margin-bottom: 1.5rem; }
  h1 { font-size: 1.6rem; font-weight: 700; color: #1e293b; }
  .subtitle { color: #64748b; margin-top: 0.25rem; }
  .chat-wrapper { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); display: flex; flex-direction: column; height: calc(100vh - 220px); }
  .messages { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .empty-chat { text-align: center; color: #64748b; margin: auto; display: flex; flex-direction: column; gap: 0.75rem; }
  .sugerencias { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-top: 0.5rem; }
  .sugerencias button { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; padding: 0.4rem 0.8rem; border-radius: 999px; cursor: pointer; font-size: 0.85rem; }
  .message { display: flex; }
  .message.user { justify-content: flex-end; }
  .message.model { justify-content: flex-start; }
  .bubble { max-width: 70%; padding: 0.75rem 1rem; border-radius: 12px; font-size: 0.95rem; line-height: 1.5; white-space: pre-wrap; }
  .message.user .bubble { background: #2563eb; color: white; border-bottom-right-radius: 4px; }
  .message.model .bubble { background: #f1f5f9; color: #1e293b; border-bottom-left-radius: 4px; }
  .typing { display: flex; gap: 4px; align-items: center; padding: 0.75rem 1rem; }
  .typing span { width: 8px; height: 8px; background: #94a3b8; border-radius: 50%; animation: bounce 1s infinite; }
  .typing span:nth-child(2) { animation-delay: 0.15s; }
  .typing span:nth-child(3) { animation-delay: 0.3s; }
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
  .input-area { display: flex; gap: 0.75rem; padding: 1rem 1.5rem; border-top: 1px solid #e2e8f0; }
  .input-area input { flex: 1; }
  .input-area button { background: #2563eb; color: white; border: none; padding: 0.6rem 1.25rem; border-radius: 6px; cursor: pointer; font-size: 0.95rem; }
  .input-area button:disabled { background: #93c5fd; cursor: not-allowed; }
  </style>