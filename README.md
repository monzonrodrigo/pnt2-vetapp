# 🐾 VetTech - Sistema de Gestión Veterinaria

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-2.0-F6D365?style=for-the-badge&logo=vue.js&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

VetTech es una Single Page Application (SPA) desarrollada como Trabajo Práctico Final para la asignatura **Programación en Nuevas Tecnologías 2**. La plataforma digitaliza la gestión de una clínica veterinaria, permitiendo administrar dueños, el historial de mascotas y la asignación de turnos médicos en una interfaz moderna, reactiva e instalable.

---

## 🎯 Cumplimiento de Requisitos Técnicos

El proyecto fue diseñado aplicando arquitectura modular y Separation of Concerns, cumpliendo estrictamente con la consigna:

- ✅ **Framework Base:** Desarrollo en **Vue 3** (Composition API / `<script setup>`) empaquetado con **Vite** para un entorno de desarrollo veloz.
- ✅ **Enrutamiento (SPA):** Implementación de **Vue Router** con *Navigation Guards* (`beforeEach`) para proteger rutas privadas y garantizar navegación sin recargas.
- ✅ **Gestión de Estado Global:** Uso intensivo de **Pinia** con stores modulares (`auth`, `duenos`, `mascotas`, `turnos`) para evitar el *prop-drilling* y centralizar la lógica de negocio y llamadas asíncronas.
- ✅ **Capacidades de PWA:** Integración de `vite-plugin-pwa` con manifiesto configurado, permitiendo la instalación de la app (móvil/desktop) y soporte offline básico.
- ✅ **Backend & Autenticación (BaaS):** Conexión a un backend real mediante el SDK de **Supabase**. Incluye flujos completos de Registro, Login y persistencia de tablas relacionales.
- ✅ **Despliegue en Producción:** Sistema desplegado mediante CI/CD. Accesible de forma pública (ver enlace más abajo).

---

## 🚀 Funcionalidades Destacadas

* **Seguridad y Roles (RBAC):** Renderizado condicional de la interfaz (botones de Alta, Baja y Modificación) dependiendo de si el usuario logueado es Administrador/Veterinario o un Dueño cliente.
* **JavaScript ES6 Avanzado:** Aplicación de funciones de primer nivel y métodos de Array (`.filter()`, `.find()`, `.map()`) para el cruce de datos relacionales en el frontend y filtrado en tiempo real.
* **Asistente de IA (Extra):** Integración asíncrona con la API de **Google Gemini** para un chatbot de triaje veterinario que asiste en consultas sobre síntomas y cuidados.
* **Modularización UI:** Extracción y encapsulamiento de estilos (Principio DRY) utilizando un esquema de CSS global y vistas 100% limpias.

---

## ⚙️ Instalación y Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/TU_USUARIO/pnt2-vetapp.git](https://github.com/TU_USUARIO/pnt2-vetapp.git)
   cd pnt2-vetapp
Instalar dependencias:

Bash
npm install
Configurar Variables de Entorno:
Duplicar el archivo .env.example, renombrarlo a .env y completar las credenciales del BaaS y la IA:

Fragmento de código
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
VITE_GEMINI_API_KEY=tu_api_key_de_gemini
Ejecutar el servidor de desarrollo:

Bash
npm run dev
La aplicación estará disponible en http://localhost:5173.

🌐 Despliegue (Deployment)
El proyecto se encuentra desplegado de forma pública y es completamente accesible en el siguiente enlace:

🔗 URL de Producción: https://pnt2-vetapp.vercel.app?_vercel_share=zPrHBJ48RtbX9qnZQ1z16qNAXgskTRQY

👥 Equipo de Desarrollo
Rodrigo: Setup base Vite/PWA, configuración de Supabase Auth, Router Guards y Layout.

Justina: Maquetación base, Dashboard interactivo con métricas reactivas y estado global.

Mariano: Lógica relacional, control de roles en frontend y CRUD de Dueños y Mascotas.

Mateo: Gestión de Turnos, control de estados dinámicos y conexión con API de Gemini (Asistente IA).