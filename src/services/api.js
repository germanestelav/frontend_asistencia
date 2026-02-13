import axios from 'axios'

// URL del backend - usar variable de entorno o detectar automáticamente
const API_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(/:\d+$/, ':8000')

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
})

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
