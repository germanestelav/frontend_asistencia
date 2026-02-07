<template>
  <div>
    <Navbar />
    
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body text-center p-5">
              <h3 class="mb-4">Tu Código QR</h3>
              
              <div v-if="qrData" class="qr-container mb-4">
                <QRCode :value="qrData.token" :size="300" />
                
                <div class="mt-3">
                  <h4 :class="timeColor">
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
                class="btn btn-primary btn-lg"
                :disabled="loading"
              >
                {{ expired ? 'Generar Nuevo QR' : 'Generar QR' }}
              </button>

              <router-link to="/" class="btn btn-secondary btn-lg ms-2">
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
