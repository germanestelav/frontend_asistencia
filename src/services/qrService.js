import api from './api'

export const qrService = {
  generar: async () => {
    const response = await api.post('/qr/generar')
    return response.data
  },

  validar: async (token) => {
    const response = await api.post('/qr/validar', { token })
    return response.data
  }
}
