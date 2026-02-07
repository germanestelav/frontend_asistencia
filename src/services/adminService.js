import api from './api'

export const adminService = {
  // Trabajadores
  getTrabajadores: async () => {
    const response = await api.get('/admin/trabajadores')
    return response.data
  },
  
  crearTrabajador: async (datos) => {
    const response = await api.post('/admin/usuarios/crear', datos)
    return response.data
  },
  
  cambiarContrasena: async (usuario_id, nueva_contrasena) => {
    const response = await api.post('/admin/usuarios/cambiar-contrasena', {
      usuario_id,
      nueva_contrasena
    })
    return response.data
  },
  
  actualizarEstado: async (usuario_id, activo) => {
    const response = await api.post('/admin/usuarios/actualizar-estado', {
      usuario_id,
      activo
    })
    return response.data
  },
  
  editarUsuario: async (usuario_id, datos) => {
    const response = await api.put('/admin/usuarios/editar', {
      usuario_id,
      ...datos
    })
    return response.data
  },
  
  // Estadísticas
  getEstadisticasHoy: async () => {
    const response = await api.get('/admin/estadisticas/hoy')
    return response.data
  },
  
  // Reportes
  getReporteSemanal: async (fecha = null) => {
    const url = fecha ? `/admin/reportes/semanal?fecha=${fecha}` : '/admin/reportes/semanal'
    const response = await api.get(url)
    return response.data
  },
  
  getReporteQuincenal: async (fecha = null) => {
    const url = fecha ? `/admin/reportes/quincenal?fecha=${fecha}` : '/admin/reportes/quincenal'
    const response = await api.get(url)
    return response.data
  },
  
  getReporteMensual: async (mes = null, anio = null) => {
    let url = '/admin/reportes/mensual'
    if (mes && anio) {
      url += `?mes=${mes}&anio=${anio}`
    }
    const response = await api.get(url)
    return response.data
  },
  
  getReportePeriodo: async (fecha_inicio, fecha_fin) => {
    const response = await api.get('/admin/reportes/periodo', {
      params: { fecha_inicio, fecha_fin }
    })
    return response.data
  }
}
