<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body p-5 text-center">
              <h2 class="mb-4">Escanear Código QR</h2>
              
              <div v-if="!scanning" class="mb-4">
                <button @click="startScanning" class="btn btn-primary btn-lg">
                  Iniciar Escáner
                </button>
              </div>

              <div v-if="scanning" class="position-relative">
                <video ref="videoElement" class="w-100 rounded" autoplay playsinline></video>
                <canvas ref="canvasElement" style="display: none;"></canvas>
                
                <div class="mt-3">
                  <button @click="stopScanning" class="btn btn-danger">
                    Detener Escáner
                  </button>
                </div>
              </div>

              <div v-if="resultado" class="alert mt-4" :class="resultadoClass">
                <h4>{{ resultado.mensaje }}</h4>
                <p class="mb-0">
                  <strong>Tipo:</strong> {{ resultado.tipo_registro }}<br>
                  <strong>Hora:</strong> {{ resultado.hora_registro }}<br>
                  <strong>Estado:</strong> {{ resultado.estado }}
                </p>
              </div>

              <div v-if="error" class="alert alert-danger mt-4">
                {{ error }}
              </div>

              <div class="mt-3 text-muted">
                <small>Coloca el código QR frente a la cámara</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { qrService } from '@/services/qrService'
import jsQR from 'jsqr'

const videoElement = ref(null)
const canvasElement = ref(null)
const scanning = ref(false)
const resultado = ref(null)
const error = ref('')
let stream = null
let scanInterval = null

const resultadoClass = computed(() => {
  if (!resultado.value) return ''
  return resultado.value.tipo_registro === 'entrada' ? 'alert-success' : 'alert-info'
})

const startScanning = async () => {
  resultado.value = null
  error.value = ''
  
  try {
    const constraints = {
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    }
    
    stream = await navigator.mediaDevices.getUserMedia(constraints)
    videoElement.value.srcObject = stream
    scanning.value = true
    
    // Esperar a que el video esté listo
    videoElement.value.onloadedmetadata = () => {
      videoElement.value.play()
      scanInterval = setInterval(scanQR, 500)
    }
  } catch (err) {
    console.error('Error al acceder a la cámara:', err)
    
    if (err.name === 'NotAllowedError') {
      error.value = 'Permiso de cámara denegado. Por favor, permite el acceso a la cámara en la configuración del navegador.'
    } else if (err.name === 'NotFoundError') {
      error.value = 'No se encontró ninguna cámara en este dispositivo.'
    } else if (err.name === 'NotReadableError') {
      error.value = 'La cámara está siendo usada por otra aplicación.'
    } else {
      error.value = 'No se pudo acceder a la cámara. Verifica los permisos del navegador.'
    }
  }
}

const stopScanning = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
  if (scanInterval) {
    clearInterval(scanInterval)
  }
  scanning.value = false
}

const scanQR = () => {
  const video = videoElement.value
  const canvas = canvasElement.value
  
  if (!video || !canvas) return
  
  const context = canvas.getContext('2d')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  
  if (canvas.width === 0 || canvas.height === 0) return
  
  context.drawImage(video, 0, 0, canvas.width, canvas.height)
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  
  const code = jsQR(imageData.data, imageData.width, imageData.height)
  
  if (code) {
    validarQR(code.data)
  }
}

const validarQR = async (token) => {
  stopScanning()
  
  try {
    const data = await qrService.validar(token)
    resultado.value = data
    
    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
      resultado.value = null
      startScanning()
    }, 3000)
  } catch (err) {
    error.value = err.response?.data?.detail || 'Error al validar QR'
    setTimeout(() => {
      error.value = ''
      startScanning()
    }, 3000)
  }
}
</script>
