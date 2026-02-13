<template>
  <div class="login-page min-vh-100 d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card restaurant-card">
            <div class="card-body p-5">
              <div class="restaurant-header text-center mb-4">
                <div class="logo-container">
                  <div class="logo-text">
                    <span class="sabor">Sabor</span>
                    <span class="heart">♡</span>
                    <span class="gusto">Gusto</span>
                  </div>
                  <div class="slogan">COMIDA HECHA CON AMOR</div>
                </div>
                <div class="system-title mt-3">
                  <strong>Sistema de Asistencia</strong>
                </div>
              </div>
              
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label class="form-label">Usuario</label>
                  <input 
                    v-model="usuario" 
                    type="text" 
                    class="form-control form-control-lg restaurant-input" 
                    required
                    :disabled="loading"
                  >
                </div>
                
                <div class="mb-4">
                  <label class="form-label">Contraseña</label>
                  <input 
                    v-model="contrasena" 
                    type="password" 
                    class="form-control form-control-lg restaurant-input" 
                    required
                    :disabled="loading"
                  >
                </div>

                <div v-if="error" class="alert alert-danger restaurant-alert">
                  {{ error }}
                </div>
                
                <button 
                  type="submit" 
                  class="btn btn-lg w-100 restaurant-btn"
                  :disabled="loading"
                >
                  <span v-if="loading">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Iniciando sesión...
                  </span>
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

<style scoped>
.login-page {
  background: linear-gradient(135deg, #c62d42 0%, #dc3545 30%, #e74c3c 70%, #f8f9fa 100%);
}

.restaurant-card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  background: white;
  overflow: hidden;
}

.restaurant-header {
  font-family: 'Georgia', 'Times New Roman', serif;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-text {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 2.5rem;
  font-weight: bold;
  color: #c62d42;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  letter-spacing: 1px;
}

.sabor {
  font-style: italic;
}

.heart {
  font-size: 2.8rem;
  color: #dc3545;
  animation: heartbeat 2s infinite;
  margin: 0 0.2rem;
}

.gusto {
  font-style: italic;
}

.slogan {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 600;
  letter-spacing: 2px;
  margin-top: 5px;
  text-align: center;
}

.system-title {
  color: #495057;
  font-size: 1.2rem;
  font-weight: 600;
}

.restaurant-input {
  border: 2px solid #e9ecef;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.restaurant-input:focus {
  border-color: #c62d42;
  box-shadow: 0 0 0 0.2rem rgba(198, 45, 66, 0.25);
}

.restaurant-btn {
  background: linear-gradient(135deg, #c62d42 0%, #dc3545 100%);
  border: none;
  border-radius: 25px;
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(198, 45, 66, 0.3);
}

.restaurant-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(198, 45, 66, 0.4);
  background: linear-gradient(135deg, #a02332 0%, #b02a37 100%);
}

.restaurant-btn:disabled {
  opacity: 0.7;
  transform: none;
  box-shadow: 0 4px 15px rgba(198, 45, 66, 0.2);
}

.restaurant-alert {
  border: none;
  border-radius: 10px;
  background-color: #f8d7da;
  border-left: 4px solid #dc3545;
  color: #721c24;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Responsive design */
@media (max-width: 768px) {
  .logo-text {
    font-size: 2rem;
  }
  
  .heart {
    font-size: 2.2rem;
  }
  
  .slogan {
    font-size: 0.65rem;
    letter-spacing: 1.5px;
  }
  
  .system-title {
    font-size: 1rem;
  }
  
  .restaurant-card {
    margin: 0.5rem;
  }
  
  .card-body {
    padding: 2rem !important;
  }
}

@media (max-width: 576px) {
  .logo-text {
    font-size: 1.7rem;
  }
  
  .heart {
    font-size: 1.9rem;
  }
  
  .slogan {
    font-size: 0.6rem;
    letter-spacing: 1px;
  }
  
  .system-title {
    font-size: 0.9rem;
  }
  
  .restaurant-card {
    margin: 0.5rem;
  }
  
  .card-body {
    padding: 1.5rem !important;
  }
  
  .restaurant-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
  
  .form-control {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}
</style>
