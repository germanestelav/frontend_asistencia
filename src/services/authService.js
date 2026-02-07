import api from './api'

export const authService = {
  login: async (usuario, contrasena) => {
    const response = await api.post('/auth/login', { usuario, contrasena })
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  getToken: () => {
    return localStorage.getItem('token')
  },

  setAuth: (token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }
}
