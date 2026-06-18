import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

const SYSTEM_PROMPT = `Sos un asistente veterinario experto.
Ayudás a dueños de mascotas y veterinarios con preguntas sobre salud animal,
síntomas, cuidados, alimentación y tratamientos.
Respondé siempre en español, de forma clara y concisa.
Si la situación es grave, recomendá consultar a un veterinario presencialmente.`

export async function preguntarGemini(mensaje, historial = []) {
  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'Entendido, estoy listo para ayudar.' }] },
      ...historial
    ]
  })
  const result = await chat.sendMessage(mensaje)
  return result.response.text()
}