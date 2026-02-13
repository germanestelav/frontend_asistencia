import { defineStore } from 'pinia'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authService.getCurrentUser(),
    token: authService.getToken(),
    isAuthenticated: !!authService.getToken()
  }),

  getters: {
    isAdmin: (state) => state.user?.rol === 'ADMINISTRADOR',
    isDueno: (state) => state.user?.rol === 'ADMINISTRADOR',
    isTrabajador: (state) => state.user?.rol === 'TRABAJADOR',
    nombreCompleto: (state) => {
      if (!state.user) return ''
      return `${state.user.nombre} ${state.user.apellido_paterno} ${state.user.apellido_materno}`
    }
  },

  actions: {
    async login(usuario, contrasena) {
      try {
        const data = await authService.login(usuario, contrasena)
        this.token = data.access_token
        this.user = data.usuario
        this.isAuthenticated = true
        authService.setAuth(data.access_token, data.usuario)
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.detail || 'Error al iniciar sesión' 
        }
      }
    },

    logout() {
      authService.logout()
      this.user = null
      this.token = null
      this.isAuthenticated = false
    }
  }
})
