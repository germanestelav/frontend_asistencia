<template>
  <div>
    <Navbar />
    
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-8 mx-auto">
          <div class="card">
            <div class="card-body p-4">
              <h3 class="mb-4">Agregar Nuevo Trabajador</h3>
              
              <form @submit.prevent="handleSubmit">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Nombre *</label>
                    <input v-model="form.nombre" type="text" class="form-control" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Apellido Paterno *</label>
                    <input v-model="form.apellido_paterno" type="text" class="form-control" required>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Apellido Materno *</label>
                    <input v-model="form.apellido_materno" type="text" class="form-control" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">DNI * (8 dígitos)</label>
                    <input 
                      v-model="form.dni" 
                      type="text" 
                      class="form-control" 
                      pattern="[0-9]{8}" 
                      maxlength="8"
                      required
                    >
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Teléfono *</label>
                    <input v-model="form.telefono" type="text" class="form-control" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Usuario * (nombre de usuario)</label>
                    <input v-model="form.usuario" type="text" class="form-control" required>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Contraseña *</label>
                    <input v-model="form.contrasena" type="password" class="form-control" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Rol *</label>
                    <select v-model="form.rol" class="form-select" required>
                      <option value="TRABAJADOR">Trabajador</option>
                      <option value="ADMINISTRADOR">Administrador</option>
                    </select>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Hora Entrada (HH:MM:SS)</label>
                    <input v-model="form.hora_entrada" type="time" step="1" class="form-control">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Hora Salida (HH:MM:SS)</label>
                    <input v-model="form.hora_salida" type="time" step="1" class="form-control">
                  </div>
                </div>

                <div v-if="error" class="alert alert-danger">
                  {{ error }}
                </div>

                <div v-if="success" class="alert alert-success">
                  {{ success }}
                </div>

                <div class="d-flex gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="loading"
                  >
                    <span v-if="loading">Guardando...</span>
                    <span v-else>Guardar</span>
                  </button>
                  
                  <router-link to="/admin/trabajadores" class="btn btn-secondary">
                    Cancelar
                  </router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminService } from '@/services/adminService'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()

const form = ref({
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  dni: '',
  telefono: '',
  usuario: '',
  contrasena: '',
  rol: 'TRABAJADOR',
  hora_entrada: '',
  hora_salida: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    // Convertir horas a formato HH:MM:SS si están presentes
    const datos = { ...form.value }
    if (datos.hora_entrada) datos.hora_entrada += ':00'
    if (datos.hora_salida) datos.hora_salida += ':00'
    
    await adminService.crearTrabajador(datos)
    success.value = 'Trabajador creado exitosamente'
    
    setTimeout(() => {
      router.push('/admin/trabajadores')
    }, 1500)
  } catch (err) {
    const errorMsg = err.response?.data?.detail || 'Error al crear trabajador'
    
    // Si el error es por DNI o usuario duplicado, agregar sugerencia
    if (errorMsg.includes('Ya existe un usuario con ese DNI') || 
        errorMsg.includes('Ya existe un usuario con ese nombre de usuario')) {
      error.value = errorMsg + '. Si el trabajador ya existe pero está inactivo, puedes reactivarlo desde la lista de trabajadores.'
    } else {
      error.value = errorMsg
    }
  } finally {
    loading.value = false
  }
}
</script>
