<template>
  <div>
    <Navbar />
    
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card restaurant-qr-card">
            <div class="card-body text-center p-5">
              <div class="restaurant-header mb-4">
                <h3 class="restaurant-title">
                  <i class="bi bi-qr-code me-2" style="color: #c62d42;"></i>
                  Tu Código QR
                </h3>
                <p class="restaurant-subtitle">Sabor & Gusto - Sistema de Asistencia</p>
              </div>
              
              <div v-if="qrData" class="restaurant-qr-container mb-4">
                <QRCode :value="qrData.token" :size="300" />
                
                <div class="mt-3">
                  <h4 :class="timeColor" class="restaurant-timer">
                    {{ formatTime(timeRemaining) }}
                  </h4>
                  <p class="text-muted">Tiempo restante</p>
                </div>
              </div>

              <div v-if="loading" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2">Generando QR...</p>
              </div>

              <div v-if="error" class="alert alert-danger">
                {{ error }}
              </div>

              <div v-if="expired" class="alert alert-warning">
                El código QR ha expirado
              </div>

              <button 
                v-if="!qrData || expired" 
                @click="generarQR" 
                class="btn restaurant-primary-btn btn-lg"
                :disabled="loading"
              >
                <i class="bi bi-arrow-clockwise me-2"></i>
                {{ expired ? 'Generar Nuevo QR' : 'Generar QR' }}
              </button>

              <router-link to="/" class="btn restaurant-secondary-btn btn-lg ms-2">
                <i class="bi bi-house me-2"></i>
                Volver al Inicio
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { qrService } from '@/services/qrService'
import Navbar from '@/components/Navbar.vue'
import QRCode from '@/components/QRCode.vue'

const qrData = ref(null)
const loading = ref(false)
const error = ref('')
const timeRemaining = ref(180) // 3 minutos en segundos
const expired = ref(false)
let interval = null

const timeColor = computed(() => {
  if (timeRemaining.value > 120) return 'text-success'
  if (timeRemaining.value > 60) return 'text-warning'
  return 'text-danger'
})

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const startCountdown = () => {
  timeRemaining.value = 180
  expired.value = false
  
  interval = setInterval(() => {
    timeRemaining.value--
    
    if (timeRemaining.value <= 0) {
      clearInterval(interval)
      expired.value = true
    }
  }, 1000)
}

const generarQR = async () => {
  loading.value = true
  error.value = ''
  
  try {
    qrData.value = await qrService.generar()
    startCountdown()
  } catch (err) {
    error.value = err.response?.data?.detail || 'Error al generar QR'
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<style scoped>
.restaurant-qr-card {
  border: none;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(198, 45, 66, 0.2);
  background: white;
  overflow: hidden;
}

.restaurant-header {
  font-family: 'Georgia', 'Times New Roman', serif;
}

.restaurant-title {
  color: #c62d42;
  font-weight: bold;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.restaurant-subtitle {
  color: #6c757d;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0;
  font-style: italic;
}

.restaurant-qr-container {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 2rem;
  border-radius: 15px;
  border: 3px solid #c62d42;
  box-shadow: 0 8px 25px rgba(198, 45, 66, 0.15);
  position: relative;
}

.restaurant-qr-container::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #c62d42, #dc3545, #e74c3c);
  border-radius: 17px;
  z-index: -1;
}

.restaurant-timer {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-weight: bold;
  font-size: 2.5rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

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
  padding: 0.8rem 2rem;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .restaurant-title {
    font-size: 1.5rem;
  }
  
  .restaurant-timer {
    font-size: 2rem;
  }
  
  .restaurant-qr-container {
    padding: 1.5rem;
  }
  
  .restaurant-primary-btn,
  .restaurant-secondary-btn {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
