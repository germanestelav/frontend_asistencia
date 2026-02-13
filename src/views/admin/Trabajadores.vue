<template>
  <div>
    <Navbar />
    
    <div class="sticky-header">
      <div class="container">
        <div class="row align-items-center py-3">
          <div class="col">
            <h3 class="mb-0">Gestión de Usuarios</h3>
          </div>
          <div class="col-auto d-flex gap-2">
            <router-link to="/" class="btn restaurant-secondary-btn">
              <i class="bi bi-house me-1"></i>Inicio
            </router-link>
            <router-link to="/admin/crear-trabajador" class="btn restaurant-primary-btn">
              <i class="bi bi-person-plus me-1"></i>Agregar Usuario
            </router-link>
          </div>
        </div>

        <!-- Filtro por rol -->
        <div class="row pb-3">
          <div class="col-auto">
            <div class="btn-group" role="group">
              <button 
                type="button" 
                class="btn" 
                :class="filtroRol === 'TODOS' ? 'btn-dark' : 'btn-outline-dark'"
                @click="filtroRol = 'TODOS'"
              >
                Todos
              </button>
              <button 
                type="button" 
                class="btn" 
                :class="filtroRol === 'ADMINISTRADOR' ? 'btn-danger' : 'btn-outline-danger'"
                @click="filtroRol = 'ADMINISTRADOR'"
              >
                <i class="bi bi-shield-check me-1"></i> Administradores
              </button>
              <button 
                type="button" 
                class="btn" 
                :class="filtroRol === 'TRABAJADOR' ? 'btn-primary' : 'btn-outline-primary'"
                @click="filtroRol = 'TRABAJADOR'"
              >
                <i class="bi bi-person me-1"></i> Trabajadores
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container" style="padding-top: 1rem;">

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-if="!loading && usuariosFiltrados.length > 0" class="row g-3">
        <div 
          v-for="trabajador in usuariosFiltrados" 
          :key="trabajador.id" 
          class="col-md-6"
        >
          <div class="card" :class="[trabajador.activo ? 'card-activo' : 'card-inactivo', trabajador.rol === 'ADMINISTRADOR' ? 'card-admin' : '']">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 class="card-title mb-1">
                    {{ trabajador.nombre }} {{ trabajador.apellido_paterno }} {{ trabajador.apellido_materno }}
                  </h5>
                  <span :class="trabajador.activo ? 'badge bg-success' : 'badge bg-danger'">
                    {{ trabajador.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                  <span 
                    class="badge ms-1" 
                    :class="trabajador.rol === 'ADMINISTRADOR' ? 'badge-admin-gold' : 'bg-primary'"
                  >
                    <i :class="trabajador.rol === 'ADMINISTRADOR' ? 'bi bi-shield-check' : 'bi bi-person'" class="me-1"></i>
                    {{ trabajador.rol === 'ADMINISTRADOR' ? 'Admin' : 'Trabajador' }}
                  </span>
                </div>
              </div>
              
              <p class="mb-1"><strong>DNI:</strong> {{ trabajador.dni }}</p>
              <p class="mb-1"><strong>Usuario:</strong> {{ trabajador.usuario || trabajador.username || '-' }}</p>
              <p class="mb-1"><strong>Teléfono:</strong> {{ trabajador.telefono || '-' }}</p>
              <p class="mb-1"><strong>Horario:</strong> {{ trabajador.hora_entrada && trabajador.hora_salida ? trabajador.hora_entrada + ' - ' + trabajador.hora_salida : '-' }}</p>
              
              <div class="mt-3">
                <button 
                  @click="openCambiarRol(trabajador)" 
                  class="btn btn-sm btn-outline-dark me-2"
                >
                  <i class="bi bi-arrow-repeat"></i> Cambiar Rol
                </button>
                
                <button 
                  @click="openEditarTrabajador(trabajador)" 
                  class="btn btn-sm btn-info me-2"
                >
                  <i class="bi bi-pencil"></i> Editar
                </button>
                
                <button 
                  @click="openCambiarContrasena(trabajador)" 
                  class="btn btn-sm btn-warning me-2"
                >
                  <i class="bi bi-key"></i> Cambiar Contraseña
                </button>
                
                <button 
                  v-if="trabajador.activo"
                  @click="cambiarEstado(trabajador.id, false)" 
                  class="btn btn-sm btn-danger"
                  :disabled="loading"
                >
                  <i class="bi bi-x-circle"></i> Dar de Baja
                </button>
                
                <button 
                  v-else
                  @click="cambiarEstado(trabajador.id, true)" 
                  class="btn btn-sm btn-success"
                  :disabled="loading"
                >
                  <i class="bi bi-check-circle"></i> Reactivar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Espacio inferior -->
      <div class="mb-5 pb-4"></div>
    </div>

    <!-- Modal Cambiar Rol -->
    <div 
      class="modal fade" 
      id="cambiarRolModal" 
      tabindex="-1"
      ref="modalRolElement"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Cambiar Rol de Usuario</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div v-if="trabajadorSeleccionado">
              <p>
                Usuario: <strong>{{ trabajadorSeleccionado.nombre }} {{ trabajadorSeleccionado.apellido_paterno }}</strong>
              </p>
              <p>
                Rol actual: 
                <span 
                  class="badge" 
                  :class="trabajadorSeleccionado.rol === 'ADMINISTRADOR' ? 'badge-admin-gold' : 'bg-primary'"
                >
                  {{ trabajadorSeleccionado.rol === 'ADMINISTRADOR' ? 'Administrador' : 'Trabajador' }}
                </span>
              </p>
              <div class="mb-3">
                <label class="form-label">Nuevo Rol</label>
                <select v-model="nuevoRol" class="form-select">
                  <option value="TRABAJADOR">Trabajador</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
              </div>
              <div v-if="nuevoRol !== trabajadorSeleccionado.rol" class="alert alert-warning">
                <i class="bi bi-exclamation-triangle me-1"></i>
                <span v-if="nuevoRol === 'TRABAJADOR'">
                  Este usuario <strong>perderá acceso administrativo</strong> y solo podrá marcar asistencia.
                </span>
                <span v-else>
                  Este usuario <strong>obtendrá acceso de administrador</strong> y podrá gestionar usuarios y reportes.
                </span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="guardarCambioRol"
              :disabled="!nuevoRol || nuevoRol === trabajadorSeleccionado?.rol"
            >
              Guardar Cambio
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Cambiar Contraseña -->
    <div 
      class="modal fade" 
      id="cambiarContrasenaModal" 
      tabindex="-1"
      ref="modalContrasenaElement"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Cambiar Contraseña</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p v-if="trabajadorSeleccionado">
              Usuario: <strong>{{ trabajadorSeleccionado.nombre }} {{ trabajadorSeleccionado.apellido_paterno }}</strong>
            </p>
            <div class="mb-3">
              <label class="form-label">Nueva Contraseña</label>
              <input 
                v-model="nuevaContrasena" 
                type="password" 
                class="form-control"
                required
              >
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="guardarContrasena"
              :disabled="!nuevaContrasena"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar Trabajador -->
    <div 
      class="modal fade" 
      id="editarTrabajadorModal" 
      tabindex="-1"
      ref="modalEditarElement"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Usuario</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarEdicion">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Nombre</label>
                  <input 
                    v-model="formEditar.nombre" 
                    type="text" 
                    class="form-control"
                  >
                </div>
                <div class="col-md-6">
                  <label class="form-label">Apellido Paterno</label>
                  <input 
                    v-model="formEditar.apellido_paterno" 
                    type="text" 
                    class="form-control"
                  >
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Apellido Materno</label>
                  <input 
                    v-model="formEditar.apellido_materno" 
                    type="text" 
                    class="form-control"
                  >
                </div>
                <div class="col-md-6">
                  <label class="form-label">Teléfono</label>
                  <input 
                    v-model="formEditar.telefono" 
                    type="text" 
                    class="form-control"
                  >
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Hora Entrada</label>
                  <input 
                    v-model="formEditar.hora_entrada" 
                    type="time" 
                    step="1"
                    class="form-control"
                  >
                  <small class="text-muted">Formato: HH:MM:SS</small>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Hora Salida</label>
                  <input 
                    v-model="formEditar.hora_salida" 
                    type="time" 
                    step="1"
                    class="form-control"
                  >
                  <small class="text-muted">Formato: HH:MM:SS</small>
                </div>
              </div>

              <div class="alert alert-info">
                <small>
                  <i class="bi bi-info-circle"></i>
                  <strong>Nota:</strong> No se pueden editar el DNI ni el nombre de usuario (son identificadores únicos).
                </small>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="guardarEdicion"
              :disabled="!formEditar.nombre"
            >
              Guardar Cambios
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
import { useAuthStore } from '@/stores/authStore'
import Navbar from '@/components/Navbar.vue'
import { Modal } from 'bootstrap'

const authStore = useAuthStore()
const trabajadores = ref([])
const loading = ref(true)
const error = ref('')
const trabajadorSeleccionado = ref(null)
const nuevaContrasena = ref('')
const nuevoRol = ref('')
const filtroRol = ref('TODOS')
const modalContrasenaElement = ref(null)
const modalEditarElement = ref(null)
const modalRolElement = ref(null)
let modalContrasenaInstance = null
let modalEditarInstance = null
let modalRolInstance = null

const usuariosFiltrados = computed(() => {
  if (filtroRol.value === 'TODOS') return trabajadores.value
  return trabajadores.value.filter(t => t.rol === filtroRol.value)
})

const formEditar = ref({
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  telefono: '',
  hora_entrada: '',
  hora_salida: ''
})

onMounted(async () => {
  await cargarTrabajadores()
})

const cargarTrabajadores = async () => {
  loading.value = true
  try {
    trabajadores.value = await adminService.getTrabajadores()
  } catch (err) {
    error.value = 'Error al cargar usuarios'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const openCambiarContrasena = (trabajador) => {
  trabajadorSeleccionado.value = trabajador
  nuevaContrasena.value = ''
  
  if (!modalContrasenaInstance) {
    modalContrasenaInstance = new Modal(modalContrasenaElement.value)
  }
  modalContrasenaInstance.show()
}

const guardarContrasena = async () => {
  try {
    await adminService.cambiarContrasena(trabajadorSeleccionado.value.id, nuevaContrasena.value)
    alert('Contraseña actualizada exitosamente')
    modalContrasenaInstance.hide()
  } catch (err) {
    alert(err.response?.data?.detail || 'Error al cambiar contraseña')
  }
}

const openCambiarRol = (trabajador) => {
  // No permitir que el admin se cambie su propio rol
  if (trabajador.id === authStore.user?.id) {
    if (!confirm('¿Estás seguro? Si cambias tu propio rol a Trabajador perderás acceso administrativo.')) {
      return
    }
  }
  trabajadorSeleccionado.value = trabajador
  nuevoRol.value = trabajador.rol || 'TRABAJADOR'
  
  if (!modalRolInstance) {
    modalRolInstance = new Modal(modalRolElement.value)
  }
  modalRolInstance.show()
}

const guardarCambioRol = async () => {
  try {
    await adminService.cambiarRol(trabajadorSeleccionado.value.id, nuevoRol.value)
    alert('Rol actualizado exitosamente')
    modalRolInstance.hide()
    await cargarTrabajadores()
  } catch (err) {
    alert(err.response?.data?.detail || 'Error al cambiar rol')
  }
}

const openEditarTrabajador = (trabajador) => {
  trabajadorSeleccionado.value = trabajador
  
  // Llenar formulario con datos actuales
  formEditar.value = {
    nombre: trabajador.nombre,
    apellido_paterno: trabajador.apellido_paterno,
    apellido_materno: trabajador.apellido_materno,
    telefono: trabajador.telefono,
    hora_entrada: trabajador.hora_entrada || '',
    hora_salida: trabajador.hora_salida || ''
  }
  
  if (!modalEditarInstance) {
    modalEditarInstance = new Modal(modalEditarElement.value)
  }
  modalEditarInstance.show()
}

const guardarEdicion = async () => {
  if (!formEditar.value.nombre) {
    alert('El nombre es requerido')
    return
  }
  
  try {
    // Preparar datos para enviar (solo los que se modificaron)
    const datos = {}
    
    if (formEditar.value.nombre !== trabajadorSeleccionado.value.nombre) {
      datos.nombre = formEditar.value.nombre
    }
    if (formEditar.value.apellido_paterno !== trabajadorSeleccionado.value.apellido_paterno) {
      datos.apellido_paterno = formEditar.value.apellido_paterno
    }
    if (formEditar.value.apellido_materno !== trabajadorSeleccionado.value.apellido_materno) {
      datos.apellido_materno = formEditar.value.apellido_materno
    }
    if (formEditar.value.telefono !== trabajadorSeleccionado.value.telefono) {
      datos.telefono = formEditar.value.telefono
    }
    
    // Agregar segundos si solo tiene HH:MM
    if (formEditar.value.hora_entrada) {
      const horaEntrada = formEditar.value.hora_entrada.length === 5 
        ? formEditar.value.hora_entrada + ':00' 
        : formEditar.value.hora_entrada
      if (horaEntrada !== trabajadorSeleccionado.value.hora_entrada) {
        datos.hora_entrada = horaEntrada
      }
    }
    
    if (formEditar.value.hora_salida) {
      const horaSalida = formEditar.value.hora_salida.length === 5 
        ? formEditar.value.hora_salida + ':00' 
        : formEditar.value.hora_salida
      if (horaSalida !== trabajadorSeleccionado.value.hora_salida) {
        datos.hora_salida = horaSalida
      }
    }
    
    await adminService.editarUsuario(trabajadorSeleccionado.value.id, datos)
    alert('Usuario actualizado exitosamente')
    modalEditarInstance.hide()
    await cargarTrabajadores()
  } catch (err) {
    alert(err.response?.data?.detail || 'Error al editar trabajador')
  }
}

const cambiarEstado = async (id, activo) => {
  const accion = activo ? 'reactivar' : 'dar de baja'
  if (!confirm(`¿Estás seguro de ${accion} este usuario?`)) return
  
  try {
    await adminService.actualizarEstado(id, activo)
    await cargarTrabajadores()
  } catch (err) {
    alert(err.response?.data?.detail || 'Error al actualizar estado')
  }
}
</script>

<style scoped>
/* Sticky header */
.sticky-header {
  position: sticky;
  top: 80px;
  z-index: 100;
  background: white;
  border-bottom: 2px solid rgba(198, 45, 66, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding-top: 0.5rem;
  margin-top: -1px;
}

.sticky-header::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  height: 10px;
  background: white;
}

.sticky-header h3 {
  color: #c62d42;
  font-family: 'Georgia', 'Times New Roman', serif;
}

/* Restaurant branding styles */
.restaurant-primary-btn {
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

.card-activo {
  border-left: 4px solid #28a745;
}

.card-inactivo {
  border-left: 4px solid #dc3545;
  opacity: 0.8;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .restaurant-primary-btn,
  .restaurant-secondary-btn {
    padding: 0.5rem 1.2rem;
    font-size: 0.9rem;
  }
}

.card-activo {
  background-color: #d4edda;
  border: 2px solid #28a745;
}

.card-activo .card-body {
  background-color: #d4edda;
}

/* Tarjeta dorada para administradores */
.card-admin.card-activo {
  background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 50%, #ffeeba 100%);
  border: 2px solid #d4a017;
  box-shadow: 0 2px 8px rgba(212, 160, 23, 0.25);
}

.card-admin.card-activo .card-body {
  background: transparent;
}

.card-admin.card-activo h5 {
  color: #856404;
}

/* Badge dorado para admin */
.badge-admin-gold {
  background: linear-gradient(135deg, #d4a017, #c49000) !important;
  color: #fff !important;
  font-weight: 600;
}

.card-inactivo {
  background-color: #f8d7da;
  border: 2px solid #dc3545;
}

.card-inactivo .card-body {
  background-color: #f8d7da;
}

.card-inactivo h5 {
  color: #721c24;
}
</style>
