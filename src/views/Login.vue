<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card">
            <div class="card-body p-5">
              <h2 class="text-center mb-4" style="color: var(--primary)">
                <strong>Sistema de Asistencia</strong>
              </h2>
              
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label class="form-label">Usuario</label>
                  <input 
                    v-model="usuario" 
                    type="text" 
                    class="form-control form-control-lg" 
                    required
                    :disabled="loading"
                  >
                </div>
                
                <div class="mb-4">
                  <label class="form-label">Contraseña</label>
                  <input 
                    v-model="contrasena" 
                    type="password" 
                    class="form-control form-control-lg" 
                    required
                    :disabled="loading"
                  >
                </div>

                <div v-if="error" class="alert alert-danger">
                  {{ error }}
                </div>
                
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg w-100"
                  :disabled="loading"
                >
                  <span v-if="loading">Iniciando sesión...</span>
                  <span v-else>Iniciar Sesión</span>
                </button>
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
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const usuario = ref('')
const contrasena = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  const result = await authStore.login(usuario.value, contrasena.value)
  
  loading.value = false
  
  if (result.success) {
    router.push('/')
  } else {
    error.value = result.message
  }
}
</script>
