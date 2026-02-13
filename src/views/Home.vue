<template>
  <div>
    <Navbar />
    
    <!-- Botón flotante para móviles -->
    <div class="floating-menu d-md-none">
      <button class="btn-floating" @click="toggleMobileMenu" :class="{ active: showMobileMenu }">
        <i class="bi" :class="showMobileMenu ? 'bi-x' : 'bi-list'"></i>
      </button>
      <div class="floating-menu-items" :class="{ active: showMobileMenu }">
        <router-link to="/generar-qr" class="floating-item">
          <i class="bi bi-qr-code"></i>
        </router-link>
        <router-link to="/historial" class="floating-item">
          <i class="bi bi-clock-history"></i>
        </router-link>
        <router-link to="/admin/trabajadores" class="floating-item" v-if="authStore.isAdmin">
          <i class="bi bi-people"></i>
        </router-link>
        <router-link to="/admin/reportes" class="floating-item" v-if="authStore.isAdmin">
          <i class="bi bi-file-earmark-bar-graph"></i>
        </router-link>
      </div>
    </div>
    
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
            <div class="card restaurant-card h-100 text-center p-4">
              <div class="card-body">
                <i class="bi bi-qr-code" style="font-size: 4rem; color: #c62d42"></i>
                <h5 class="card-title mt-3">Generar QR</h5>
                <p class="card-text">Genera tu código QR para marcar asistencia</p>
                <router-link to="/generar-qr" class="btn restaurant-btn btn-lg">
                  Generar QR
                </router-link>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card restaurant-card h-100 text-center p-4">
              <div class="card-body">
                <i class="bi bi-clock-history" style="font-size: 4rem; color: #6c757d"></i>
                <h5 class="card-title mt-3">Mis Asistencias</h5>
                <p class="card-text">Revisa tu historial de marcaciones</p>
                <router-link to="/historial" class="btn btn-outline-dark btn-lg">
                  Ver Historial
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard de Administrador -->
      <div v-if="authStore.isAdmin">
        <div class="row mb-4">
          <div class="col">
            <h3>Panel de Administración</h3>
            <p class="text-muted">{{ authStore.nombreCompleto }} - Administrador</p>
          </div>
        </div>

        <!-- Estadísticas del día -->
        <div v-if="estadisticas" class="row g-3 mb-4">
          <div class="col-md-3">
            <div class="card restaurant-stat-card">
              <div class="card-body">
                <h6 class="text-muted">Total Usuarios</h6>
                <h2 class="stat-number">{{ estadisticas.total_trabajadores }}</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card restaurant-stat-card">
              <div class="card-body">
                <h6 class="text-muted">Presentes Hoy</h6>
                <h2 class="stat-number text-success">{{ estadisticas.presentes }}</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card restaurant-stat-card">
              <div class="card-body">
                <h6 class="text-muted">Ausentes</h6>
                <h2 class="stat-number text-danger">{{ estadisticas.ausentes }}</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card restaurant-stat-card">
              <div class="card-body">
                <h6 class="text-muted">Tardanzas</h6>
                <h2 class="stat-number text-warning">{{ estadisticas.tardanzas }}</h2>
              </div>
            </div>
          </div>
        </div>

        <!-- Accesos rápidos -->
        <div class="row g-3">
          <!-- QR y Asistencias propias del admin -->
          <div class="col-md-6">
            <div class="card restaurant-card h-100 text-center p-4">
              <div class="card-body">
                <i class="bi bi-qr-code" style="font-size: 3rem; color: #c62d42"></i>
                <h6 class="card-title mt-3">Generar QR</h6>
                <p class="card-text small">Marca tu propia asistencia</p>
                <router-link to="/generar-qr" class="btn restaurant-btn">
                  Generar QR
                </router-link>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card restaurant-card h-100 text-center p-4">
              <div class="card-body">
                <i class="bi bi-clock-history" style="font-size: 3rem; color: #17a2b8"></i>
                <h6 class="card-title mt-3">Mis Asistencias</h6>
                <p class="card-text small">Revisa tus marcaciones</p>
                <router-link to="/historial" class="btn btn-outline-info">
                  Ver Historial
                </router-link>
              </div>
            </div>
          </div>

          <!-- Separador visual -->
          <div class="col-12 mt-3">
            <hr class="my-2" style="border-color: #c62d42; opacity: 0.3;">
            <h6 class="text-muted mb-2"><i class="bi bi-gear me-1"></i> Administración</h6>
          </div>

          <div class="col-md-4">
            <div class="card restaurant-card h-100 text-center p-3">
              <div class="card-body">
                <i class="bi bi-people" style="font-size: 3rem; color: #c62d42"></i>
                <h6 class="card-title mt-3">Usuarios</h6>
                <router-link to="/admin/trabajadores" class="btn restaurant-outline-btn">
                  Ver Lista
                </router-link>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card restaurant-card h-100 text-center p-3">
              <div class="card-body">
                <i class="bi bi-file-earmark-bar-graph" style="font-size: 3rem; color: #28a745"></i>
                <h6 class="card-title mt-3">Reportes</h6>
                <router-link to="/admin/reportes" class="btn btn-outline-success">
                  Generar Reporte
                </router-link>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card restaurant-card h-100 text-center p-3">
              <div class="card-body">
                <i class="bi bi-person-plus" style="font-size: 3rem; color: #6c757d"></i>
                <h6 class="card-title mt-3">Nuevo Usuario</h6>
                <router-link to="/admin/crear-trabajador" class="btn btn-outline-dark">
                  Agregar
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Espacio inferior -->
        <div class="mb-5 pb-4"></div>
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
const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

onMounted(async () => {
  if (authStore.isAdmin) {
    try {
      estadisticas.value = await adminService.getEstadisticasHoy()
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
    }
  }
})
</script>

<style scoped>
.restaurant-card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.restaurant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.restaurant-stat-card {
  border: none;
  border-radius: 15px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-left: 4px solid #c62d42;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.restaurant-stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(198, 45, 66, 0.15);
}

.stat-number {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 2.5rem;
  font-weight: bold;
  color: #c62d42;
}

.restaurant-btn {
  background: linear-gradient(135deg, #c62d42 0%, #dc3545 100%);
  border: none;
  border-radius: 25px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  color: white;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(198, 45, 66, 0.2);
}

.restaurant-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(198, 45, 66, 0.3);
  color: white;
  text-decoration: none;
}

.restaurant-outline-btn {
  border: 2px solid #c62d42;
  color: #c62d42;
  background: transparent;
  border-radius: 25px;
  padding: 0.4rem 1.2rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.restaurant-outline-btn:hover {
  background: #c62d42;
  color: white;
  transform: translateY(-2px);
  text-decoration: none;
}

.card-title {
  color: #495057;
  font-weight: 600;
}

.card-text {
  color: #6c757d;
}

h3 {
  color: #c62d42;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-weight: bold;
}

.text-muted {
  color: #6c757d !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .stat-number {
    font-size: 2rem;
  }
  
  .restaurant-card {
    margin-bottom: 1rem;
  }
  
  .card-title {
    font-size: 1rem;
  }
  
  .card-body {
    padding: 1.5rem !important;
  }
}

@media (max-width: 576px) {
  .stat-number {
    font-size: 1.5rem;
  }
  
  .restaurant-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .restaurant-outline-btn {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }
  
  .card-body {
    padding: 1rem !important;
  }
  
  h3 {
    font-size: 1.5rem;
  }
  
  .container {
    padding: 0 1rem;
  }
}

/* Floating mobile menu */
.floating-menu {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.btn-floating {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c62d42 0%, #dc3545 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(198, 45, 66, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.btn-floating:hover,
.btn-floating.active {
  background: linear-gradient(135deg, #a02332 0%, #b02a37 100%);
  transform: scale(1.1) rotate(45deg);
}

.floating-menu-items {
  position: absolute;
  bottom: 70px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: 0;
  visibility: hidden;
  transform: translateX(20px);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.floating-menu-items.active {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
}

.floating-item {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  color: #c62d42;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.floating-item:hover {
  background: #c62d42;
  color: white;
  transform: scale(1.1);
  text-decoration: none;
}

/* Add space for floating menu on mobile */
@media (max-width: 767px) {
  .container {
    padding-bottom: 120px;
  }
}
</style>
