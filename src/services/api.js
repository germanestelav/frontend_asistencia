import axios from 'axios'

// Usar variable de entorno o IP local en desarrollo
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

console.log('🔧 [API] Configurando API...')
console.log('🌐 [API] VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('🎯 [API] API_URL final:', API_URL)

const api = axios.create({
  baseURL: API_URL
})

console.log('📡 [API] Axios configurado con baseURL:', API_URL)

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log('📤 [API] Request:', config.method?.toUpperCase(), config.url, config)
  return config
})

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    console.log('📥 [API] Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('❌ [API] Error:', error.response?.status, error.config?.url, error.message)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
