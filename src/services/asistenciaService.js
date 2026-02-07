import api from './api'

export const asistenciaService = {
  getMisRegistros: async () => {
    const response = await api.get('/asistencias/mis-registros')
    return response.data
  }
}
