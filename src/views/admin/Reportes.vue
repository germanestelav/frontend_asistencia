<template>
  <div>
    <Navbar />
    
    <div class="container mt-4">
      <h3 class="mb-4">Reportes de Asistencia</h3>

      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <label class="form-label">Tipo de Reporte</label>
              <select v-model="tipoReporte" class="form-select" @change="resetFechas">
                <option value="semanal">Semanal</option>
                <option value="quincenal">Quincenal</option>
                <option value="mensual">Mensual</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="tipoReporte === 'semanal' || tipoReporte === 'quincenal'" class="col-md-4">
          <div class="card">
            <div class="card-body">
              <label class="form-label">Fecha de Referencia</label>
              <input v-model="fechaReferencia" type="date" class="form-control">
            </div>
          </div>
        </div>

        <div v-if="tipoReporte === 'mensual'" class="col-md-4">
          <div class="card">
            <div class="card-body">
              <label class="form-label">Mes</label>
              <select v-model="mes" class="form-select">
                <option v-for="m in 12" :key="m" :value="m">{{ getNombreMes(m) }}</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="tipoReporte === 'mensual'" class="col-md-4">
          <div class="card">
            <div class="card-body">
              <label class="form-label">Año</label>
              <select v-model="anio" class="form-select">
                <option v-for="a in anios" :key="a" :value="a">{{ a }}</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="tipoReporte === 'personalizado'" class="col-md-4">
          <div class="card">
            <div class="card-body">
              <label class="form-label">Fecha Inicio</label>
              <input v-model="fechaInicio" type="date" class="form-control">
            </div>
          </div>
        </div>

        <div v-if="tipoReporte === 'personalizado'" class="col-md-4">
          <div class="card">
            <div class="card-body">
              <label class="form-label">Fecha Fin</label>
              <input v-model="fechaFin" type="date" class="form-control">
            </div>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <button 
          @click="generarReporte" 
          class="btn restaurant-primary-btn btn-lg"
          :disabled="loading"
        >
          <i class="bi bi-file-earmark-bar-graph me-2"></i>
          <span v-if="loading">
            <span class="spinner-border spinner-border-sm me-2"></span>
            Generando...
          </span>
          <span v-else>GENERAR REPORTE</span>
        </button>
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-if="reporte" class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5>Reporte {{ tipoReporte.toUpperCase() }}</h5>
            <p class="mb-0 text-muted">
              Periodo: {{ reporte.fecha_inicio }} al {{ reporte.fecha_fin }}
            </p>
          </div>

          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-light">
                <tr>
                  <th>Trabajador</th>
                  <th>Total Días</th>
                  <th>Asistidos</th>
                  <th>Faltados</th>
                  <th>Tardanzas</th>
                  <th>A Tiempo</th>
                  <th>Sal. Anticipadas</th>
                  <th>% Asistencia</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="trabajador in reporte.trabajadores" :key="trabajador.trabajador_id">
                  <td><strong>{{ trabajador.trabajador_nombre }}</strong></td>
                  <td>{{ trabajador.total_dias }}</td>
                  <td><span class="badge bg-success">{{ trabajador.dias_asistidos }}</span></td>
                  <td><span class="badge bg-danger">{{ trabajador.dias_faltados }}</span></td>
                  <td><span class="badge bg-warning text-dark">{{ trabajador.tardanzas }}</span></td>
                  <td><span class="badge bg-info">{{ trabajador.a_tiempo }}</span></td>
                  <td><span class="badge bg-secondary">{{ trabajador.salidas_anticipadas }}</span></td>
                  <td><strong>{{ trabajador.porcentaje_asistencia }}%</strong></td>
                  <td>
                    <button 
                      @click="verDetalle(trabajador)" 
                      class="btn btn-sm btn-outline-primary"
                      title="Ver detalle de asistencias"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="mt-4 mb-5 pb-3">
        <router-link to="/" class="btn restaurant-secondary-btn">
          <i class="bi bi-house me-2"></i>
          Volver al Inicio
        </router-link>
      </div>
    </div>

    <!-- Modal Detalle de Asistencias -->
    <div 
      class="modal fade" 
      id="detalleModal" 
      tabindex="-1"
      ref="detalleModalElement"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Detalle de Asistencias - {{ trabajadorSeleccionado?.trabajador_nombre }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div v-if="loadingDetalle" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>

            <div v-if="errorDetalle" class="alert alert-danger">
              {{ errorDetalle }}
            </div>

            <div v-if="asistenciasDetalle.length > 0" class="table-responsive">
              <table class="table table-bordered">
                <thead class="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Entrada</th>
                    <th>Estado Entrada</th>
                    <th>Salida</th>
                    <th>Estado Salida</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="asistencia in asistenciasDetalle" :key="asistencia.fecha">
                    <td>
                      <strong>{{ formatearFecha(asistencia.fecha) }}</strong>
                    </td>
                    <td>
                      <span v-if="asistencia.hora_entrada">
                        {{ formatearHora(asistencia.hora_entrada) }}
                      </span>
                      <span v-else class="text-muted">Sin registro</span>
                    </td>
                    <td>
                      <span 
                        v-if="asistencia.estado_entrada" 
                        class="badge" 
                        :class="getBadgeClassEntrada(asistencia.estado_entrada)"
                      >
                        {{ formatearEstado(asistencia.estado_entrada) }}
                      </span>
                    </td>
                    <td>
                      <span v-if="asistencia.hora_salida">
                        {{ formatearHora(asistencia.hora_salida) }}
                      </span>
                      <span v-else class="text-muted">Sin registro</span>
                    </td>
                    <td>
                      <span 
                        v-if="asistencia.estado_salida" 
                        class="badge" 
                        :class="getBadgeClassSalida(asistencia.estado_salida)"
                      >
                        {{ formatearEstado(asistencia.estado_salida) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="!loadingDetalle && asistenciasDetalle.length === 0" class="alert alert-info">
              No hay registros de asistencia para este trabajador en el período seleccionado.
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminService } from '@/services/adminService'
import Navbar from '@/components/Navbar.vue'
import { Modal } from 'bootstrap'
import axios from 'axios'

const tipoReporte = ref('semanal')
const fechaReferencia = ref('')
const mes = ref(new Date().getMonth() + 1)
const anio = ref(new Date().getFullYear())
const fechaInicio = ref('')
const fechaFin = ref('')
const reporte = ref(null)
const loading = ref(false)
const error = ref('')

// Variables para el detalle
const detalleModalElement = ref(null)
let detalleModalInstance = null
const trabajadorSeleccionado = ref(null)
const asistenciasDetalle = ref([])
const loadingDetalle = ref(false)
const errorDetalle = ref('')

const anios = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)
})

const getNombreMes = (m) => {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return meses[m - 1]
}

const resetFechas = () => {
  fechaReferencia.value = ''
  fechaInicio.value = ''
  fechaFin.value = ''
  reporte.value = null
  error.value = ''
}

const generarReporte = async () => {
  loading.value = true
  error.value = ''
  reporte.value = null
  
  try {
    let data
    
    switch (tipoReporte.value) {
      case 'semanal':
        data = await adminService.getReporteSemanal(fechaReferencia.value || null)
        break
      case 'quincenal':
        data = await adminService.getReporteQuincenal(fechaReferencia.value || null)
        break
      case 'mensual':
        data = await adminService.getReporteMensual(mes.value, anio.value)
        break
      case 'personalizado':
        if (!fechaInicio.value || !fechaFin.value) {
          error.value = 'Debe seleccionar ambas fechas'
          loading.value = false
          return
        }
        data = await adminService.getReportePeriodo(fechaInicio.value, fechaFin.value)
        break
    }
    
    reporte.value = data
  } catch (err) {
    error.value = err.response?.data?.detail || 'Error al generar reporte'
  } finally {
    loading.value = false
  }
}

const verDetalle = async (trabajador) => {
  trabajadorSeleccionado.value = trabajador
  asistenciasDetalle.value = []
  loadingDetalle.value = true
  errorDetalle.value = ''
  
  if (!detalleModalInstance) {
    detalleModalInstance = new Modal(detalleModalElement.value)
  }
  detalleModalInstance.show()
  
  try {
    // Obtener asistencias del trabajador en el rango de fechas del reporte
    const token = localStorage.getItem('token')
    const response = await axios.get(`http://localhost:8000/asistencias/trabajador/${trabajador.trabajador_id}`, {
      params: {
        fecha_inicio: reporte.value.fecha_inicio,
        fecha_fin: reporte.value.fecha_fin
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    asistenciasDetalle.value = response.data
  } catch (err) {
    errorDetalle.value = err.response?.data?.detail || 'Error al cargar detalle de asistencias'
  } finally {
    loadingDetalle.value = false
  }
}

const formatearFecha = (fecha) => {
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', opciones)
}

const formatearHora = (hora) => {
  // Quitar milisegundos - formato HH:MM:SS
  if (!hora) return ''
  return hora.split('.')[0]
}

const formatearEstado = (estado) => {
  const estados = {
    'A_TIEMPO': 'A Tiempo',
    'TARDANZA': 'Tardanza',
    'SALIDA_OK': 'Salida OK',
    'SALIDA_ANTICIPADA': 'Salida Anticipada',
    'SIN_SALIDA': 'Sin Salida',
    'SIN_HORARIO': 'Sin Horario'
  }
  return estados[estado] || estado
}

const getBadgeClassEntrada = (estado) => {
  switch (estado) {
    case 'A_TIEMPO': return 'bg-success'
    case 'TARDANZA': return 'bg-danger'
    default: return 'bg-secondary'
  }
}

const getBadgeClassSalida = (estado) => {
  switch (estado) {
    case 'SALIDA_OK': return 'bg-success'
    case 'SALIDA_ANTICIPADA': return 'bg-warning text-dark'
    case 'SIN_SALIDA': return 'bg-secondary'
    default: return 'bg-secondary'
  }
}

onMounted(() => {
  // Inicializar modal si es necesario
})
</script>

<style scoped>
/* Restaurant branding styles */
.restaurant-primary-btn {
  background: linear-gradient(135deg, #c62d42 0%, #dc3545 100%);
  border: none;
  border-radius: 25px;
  padding: 0.8rem 2rem;
  font-weight: 600;
  color: white;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(198, 45, 66, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.restaurant-primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(198, 45, 66, 0.4);
  color: white;
  text-decoration: none;
  background: linear-gradient(135deg, #a02332 0%, #b02a37 100%);
}

.restaurant-primary-btn:disabled {
  opacity: 0.7;
  transform: none;
  box-shadow: 0 4px 15px rgba(198, 45, 66, 0.2);
}

.restaurant-secondary-btn {
  background: #6c757d;
  border: none;
  border-radius: 25px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  color: white;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
}

.restaurant-secondary-btn:hover {
  background: #5c6268;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
  color: white;
  text-decoration: none;
}

h3 {
  color: #c62d42;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-weight: bold;
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background: white;
}

.table-hover tbody tr:hover {
  background-color: rgba(198, 45, 66, 0.05);
}

.alert-info {
  background-color: #d1ecf1;
  border-left: 4px solid #17a2b8;
  border-radius: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .restaurant-primary-btn {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
  
  .restaurant-secondary-btn {
    padding: 0.5rem 1.2rem;
    font-size: 0.9rem;
  }
  
  .table {
    font-size: 0.85rem;
  }
}

@media (max-width: 576px) {
  .restaurant-primary-btn {
    padding: 0.5rem 1.2rem;
    font-size: 0.85rem;
  }
  
  .restaurant-secondary-btn {
    padding: 0.4rem 1rem;
    font-size: 0.85rem;
  }
  
  .table {
    font-size: 0.8rem;
  }
}
</style>
