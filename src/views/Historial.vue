<template>
  <div>
    <Navbar />
    
    <div class="container mt-4">
      <div class="row">
        <div class="col">
          <h3 class="mb-4">Mis Asistencias</h3>
          
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <div v-if="!loading && asistencias.length === 0" class="alert alert-info">
            No tienes registros de asistencia todavía
          </div>

          <div v-if="!loading && asistencias.length > 0" class="row g-3">
            <div 
              v-for="asistencia in asistencias" 
              :key="asistencia.id" 
              class="col-md-6"
            >
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">{{ formatDate(asistencia.fecha) }}</h5>
                  
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span><strong>Entrada:</strong> {{ asistencia.hora_entrada || 'Sin registro' }}</span>
                    <span 
                      v-if="asistencia.estado_entrada" 
                      :class="getBadgeClass(asistencia.estado_entrada)"
                      class="badge"
                    >
                      {{ formatEstado(asistencia.estado_entrada) }}
                    </span>
                  </div>

                  <div class="d-flex justify-content-between align-items-center">
                    <span><strong>Salida:</strong> {{ asistencia.hora_salida || 'Sin registro' }}</span>
                    <span 
                      v-if="asistencia.estado_salida" 
                      :class="getBadgeClass(asistencia.estado_salida)"
                      class="badge"
                    >
                      {{ formatEstado(asistencia.estado_salida) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <router-link to="/" class="btn restaurant-secondary-btn">
              <i class="bi bi-house me-2"></i>
              Volver al Inicio
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { asistenciaService } from '@/services/asistenciaService'
import Navbar from '@/components/Navbar.vue'

const asistencias = ref([])
const loading = ref(true)
const error = ref('')

const formatDate = (dateStr) => {
  // Parsear como fecha local (no UTC) para evitar desfase de un día
  const parts = dateStr.split('-')
  const date = new Date(parts[0], parts[1] - 1, parts[2])
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

const formatEstado = (estado) => {
  const estados = {
    'A_TIEMPO': 'A Tiempo',
    'TARDANZA': 'Tardanza',
    'SIN_HORARIO': 'Sin Horario',
    'SALIDA_OK': 'Salida OK',
    'SALIDA_ANTICIPADA': 'Salida Anticipada',
    'SIN_SALIDA': 'Sin Salida'
  }
  return estados[estado] || estado
}

const getBadgeClass = (estado) => {
  const classes = {
    'A_TIEMPO': 'badge-a-tiempo',
    'TARDANZA': 'badge-tardanza',
    'SIN_HORARIO': 'bg-secondary',
    'SALIDA_OK': 'badge-salida-ok',
    'SALIDA_ANTICIPADA': 'badge-salida-anticipada',
    'SIN_SALIDA': 'badge-sin-salida'
  }
  return classes[estado] || 'bg-secondary'
}

onMounted(async () => {
  try {
    const datos = await asistenciaService.getMisRegistros()
    // Ordenar por fecha más reciente primero
    asistencias.value = datos.sort((a, b) => b.fecha.localeCompare(a.fecha))
  } catch (err) {
    error.value = err.response?.data?.detail || 'Error al cargar asistencias'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Restaurant branding styles */
.restaurant-secondary-btn {
  background: #6c757d;
  border: none;
  border-radius: 25px;
  padding: 0.8rem 1.5rem;
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.card-title {
  color: #495057;
  font-weight: 600;
}

.alert-info {
  background-color: #d1ecf1;
  border-left: 4px solid #17a2b8;
  border-radius: 10px;
}

.alert-danger {
  background-color: #f8d7da;
  border-left: 4px solid #dc3545;
  border-radius: 10px;
}

.badge {
  border-radius: 20px;
  padding: 0.5rem 0.8rem;
  font-weight: 600;
  font-size: 0.75rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .restaurant-secondary-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
  
  .card-body {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .restaurant-secondary-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    width: 100%;
    text-align: center;
  }
  
  .card {
    margin-bottom: 1rem;
  }
}
</style>
