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
            <router-link to="/" class="btn btn-secondary">
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
  const date = new Date(dateStr)
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
    asistencias.value = await asistenciaService.getMisRegistros()
  } catch (err) {
    error.value = err.response?.data?.detail || 'Error al cargar asistencias'
  } finally {
    loading.value = false
  }
})
</script>
