<template>
  <div>
    <Navbar />
    
    <div class="container mt-4">
      <div class="row mb-4">
        <div class="col">
          <h3>Gestión de Trabajadores</h3>
        </div>
        <div class="col-auto">
          <router-link to="/admin/crear-trabajador" class="btn btn-primary">
            <i class="bi bi-person-plus"></i> Agregar Trabajador
          </router-link>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-if="!loading && trabajadores.length > 0" class="row g-3">
        <div 
          v-for="trabajador in trabajadores" 
          :key="trabajador.id" 
          class="col-md-6"
        >
          <div class="card" :class="trabajador.activo ? 'card-activo' : 'card-inactivo'">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 class="card-title mb-1">
                    {{ trabajador.nombre }} {{ trabajador.apellido_paterno }} {{ trabajador.apellido_materno }}
                  </h5>
                  <span :class="trabajador.activo ? 'badge bg-success' : 'badge bg-danger'">
                    {{ trabajador.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>
              
              <p class="mb-1"><strong>DNI:</strong> {{ trabajador.dni }}</p>
              <p class="mb-1"><strong>Usuario:</strong> {{ trabajador.usuario }}</p>
              <p class="mb-1"><strong>Teléfono:</strong> {{ trabajador.telefono }}</p>
              <p class="mb-1"><strong>Horario:</strong> {{ trabajador.hora_entrada }} - {{ trabajador.hora_salida }}</p>
              
              <div class="mt-3">
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

      <div class="mt-4">
        <router-link to="/" class="btn btn-secondary">
          Volver al Inicio
        </router-link>
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
              Trabajador: <strong>{{ trabajadorSeleccionado.nombre }} {{ trabajadorSeleccionado.apellido_paterno }}</strong>
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
            <h5 class="modal-title">Editar Trabajador</h5>
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
import { ref, onMounted } from 'vue'
import { adminService } from '@/services/adminService'
import Navbar from '@/components/Navbar.vue'
import { Modal } from 'bootstrap'

const trabajadores = ref([])
const loading = ref(true)
const error = ref('')
const trabajadorSeleccionado = ref(null)
const nuevaContrasena = ref('')
const modalContrasenaElement = ref(null)
const modalEditarElement = ref(null)
let modalContrasenaInstance = null
let modalEditarInstance = null

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
    error.value = 'Error al cargar trabajadores'
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
    alert('Trabajador actualizado exitosamente')
    modalEditarInstance.hide()
    await cargarTrabajadores()
  } catch (err) {
    alert(err.response?.data?.detail || 'Error al editar trabajador')
  }
}

const cambiarEstado = async (id, activo) => {
  const accion = activo ? 'reactivar' : 'dar de baja'
  if (!confirm(`¿Estás seguro de ${accion} este trabajador?`)) return
  
  try {
    await adminService.actualizarEstado(id, activo)
    await cargarTrabajadores()
  } catch (err) {
    alert(err.response?.data?.detail || 'Error al actualizar estado')
  }
}
</script>

<style scoped>
.card-activo {
  background-color: #d4edda;
  border: 2px solid #28a745;
}

.card-activo .card-body {
  background-color: #d4edda;
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
