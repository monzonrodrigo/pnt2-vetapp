<template>
  <div class="wrapper">
    <div class="card">
      <h1>🚫 Sin acceso</h1>
      <p>No tenés permisos para ver esta página.</p>
      <RouterLink to="/dashboard">Volver al dashboard</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.wrapper { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f1f5f9; }
.card { background: white; padding: 2rem; border-radius: 12px; text-align: center; display: flex; flex-direction: column; gap: 1rem; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
h1 { font-size: 1.8rem; font-weight: 700; color: #1e293b; }
p { color: #64748b; }
a { color: #2563eb; }
</style>