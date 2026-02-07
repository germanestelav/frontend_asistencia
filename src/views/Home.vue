<template>
  <div>
    <Navbar />
    
    <div class="container mt-4">
      <!-- Dashboard de Trabajador -->
      <div v-if="authStore.isTrabajador">
        <div class="row mb-4">
          <div class="col">
            <h3>Bienvenido, {{ authStore.nombreCompleto }}</h3>
            <p class="text-muted">
              Horario: {{ authStore.user.hora_entrada }} - {{ authStore.user.hora_salida }}
            </p>
          </div>
        </div>

        <div class="row g-3">
          <div class="col-md-6">
            <div class="card h-100 text-center p-4">
              <div class="card-body">
                <i class="bi bi-qr-code" style="font-size: 4rem; color: var(--primary)"></i>
                <h5 class="card-title mt-3">Generar QR</h5>
                <p class="card-text">Genera tu código QR para marcar asistencia</p>
                <router-link to="/generar-qr" class="btn btn-primary btn-lg">
                  Generar QR
                </router-link>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card h-100 text-center p-4">
              <div class="card-body">
                <i class="bi bi-clock-history" style="font-size: 4rem; color: var(--info)"></i>
                <h5 class="card-title mt-3">Mis Asistencias</h5>
                <p class="card-text">Revisa tu historial de marcaciones</p>
                <router-link to="/historial" class="btn btn-info btn-lg text-white">
                  Ver Historial
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard de Administrador -->
      <div v-if="authStore.isDueno">
        <div class="row mb-4">
          <div class="col">
            <h3>Panel de Administración</h3>
            <p class="text-muted">{{ authStore.nombreCompleto }} - Dueño</p>
          </div>
        </div>

        <!-- Estadísticas del día -->
        <div v-if="estadisticas" class="row g-3 mb-4">
          <div class="col-md-3">
            <div class="card stat-card">
              <div class="card-body">
                <h6 class="text-muted">Total Trabajadores</h6>
                <h2>{{ estadisticas.total_trabajadores }}</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card stat-card">
              <div class="card-body">
                <h6 class="text-muted">Presentes Hoy</h6>
                <h2 class="text-success">{{ estadisticas.presentes }}</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card stat-card">
              <div class="card-body">
                <h6 class="text-muted">Ausentes</h6>
                <h2 class="text-danger">{{ estadisticas.ausentes }}</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card stat-card">
              <div class="card-body">
                <h6 class="text-muted">Tardanzas</h6>
                <h2 class="text-warning">{{ estadisticas.tardanzas }}</h2>
              </div>
            </div>
          </div>
        </div>

        <!-- Accesos rápidos -->
        <div class="row g-3">
          <div class="col-md-4">
            <div class="card h-100 text-center p-3">
              <div class="card-body">
                <i class="bi bi-people" style="font-size: 3rem; color: var(--primary)"></i>
                <h6 class="card-title mt-3">Trabajadores</h6>
                <router-link to="/admin/trabajadores" class="btn btn-outline-primary">
                  Ver Lista
                </router-link>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card h-100 text-center p-3">
              <div class="card-body">
                <i class="bi bi-file-earmark-bar-graph" style="font-size: 3rem; color: var(--success)"></i>
                <h6 class="card-title mt-3">Reportes</h6>
                <router-link to="/admin/reportes" class="btn btn-outline-success">
                  Generar Reporte
                </router-link>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card h-100 text-center p-3">
              <div class="card-body">
                <i class="bi bi-person-plus" style="font-size: 3rem; color: var(--info)"></i>
                <h6 class="card-title mt-3">Nuevo Trabajador</h6>
                <router-link to="/admin/crear-trabajador" class="btn btn-outline-info">
                  Agregar
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { adminService } from '@/services/adminService'
import Navbar from '@/components/Navbar.vue'

const authStore = useAuthStore()
const estadisticas = ref(null)

onMounted(async () => {
  if (authStore.isDueno) {
    try {
      estadisticas.value = await adminService.getEstadisticasHoy()
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
    }
  }
})
</script>
