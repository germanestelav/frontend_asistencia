import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

console.log('🚀 [DEBUG] Iniciando aplicación...')
console.log('🌐 [DEBUG] URL actual:', window.location.href)
console.log('📁 [DEBUG] Base URL:', import.meta.env.BASE_URL)

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/styles.css'

console.log('✅ [DEBUG] Estilos cargados')

const app = createApp(App)
const pinia = createPinia()

console.log('🔧 [DEBUG] Configurando Pinia...')
app.use(pinia)

console.log('🛣️ [DEBUG] Configurando Router...')
console.log('📍 [DEBUG] Rutas disponibles:', router.getRoutes().map(r => r.path))
app.use(router)

console.log('🎯 [DEBUG] Montando aplicación en #app...')
app.mount('#app')

console.log('✅ [DEBUG] Aplicación montada exitosamente!')
