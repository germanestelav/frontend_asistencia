<template>
    <div class="restaurant-scanner-page min-vh-100 d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card restaurant-scanner-card">
            <div class="card-body p-4 text-center">
              <div class="restaurant-scanner-header mb-4">
                <h2 class="restaurant-scanner-title">
                  <i class="bi bi-camera me-2" style="color: #c62d42;"></i>
                  Escanear Código QR
                </h2>
                <p class="restaurant-scanner-subtitle">Sabor & Gusto - Control de Asistencia</p>
              </div>
              
              <div v-if="!scanning" class="mb-4">
                <button @click="startScanning" class="btn btn-primary btn-lg">
                  INICIAR ESCÁNER
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
                <div style="white-space: pre-line;">{{ error }}</div>
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
import { ref, computed, nextTick } from 'vue'
import { qrService } from '@/services/qrService'
import jsQR from 'jsqr'

const videoElement = ref(null)
const canvasElement = ref(null)
const scanning = ref(false)
const resultado = ref(null)
const error = ref('')
const diagnosticInfo = ref('')
let stream = null
let scanInterval = null

const resultadoClass = computed(() => {
  if (!resultado.value) return ''
  return resultado.value.tipo_registro === 'entrada' ? 'alert-success' : 'alert-info'
})

const startScanning = async () => {
  resultado.value = null
  error.value = ''
  
  console.log('🔍 ================================')
  console.log('🔍 INICIANDO ESCANEO - DEBUG MODE')
  console.log('🔍 ================================')
  console.log('📱 URL actual:', window.location.href)
  console.log('🔒 Protocolo:', window.location.protocol)
  console.log('🏠 Hostname:', window.location.hostname)
  console.log('⚙️  User Agent:', navigator.userAgent)
  
  // LOG DETALLADO: Verificar APIs disponibles
  console.log('🔧 ==> VERIFICANDO APIs DISPONIBLES <==')
  console.log('navigator existe?', typeof navigator !== 'undefined')
  console.log('navigator.mediaDevices existe?', typeof navigator.mediaDevices !== 'undefined')
  console.log('navigator.mediaDevices.getUserMedia existe?', 
    typeof navigator.mediaDevices?.getUserMedia !== 'undefined')
  
  // Si no tenemos HTTPS, seguir con logs pero continuar
  if (!window.location.href.startsWith('https://')) {
    console.warn('⚠️ NO HTTPS - Esto puede causar problemas de cámara')
    console.log('🔧 Pero continuamos para ver qué otros errores aparecen...')
  }
  
  // Verificar soporte de getUserMedia con logs detallados
  if (!navigator.mediaDevices) {
    console.error('❌ navigator.mediaDevices NO EXISTE')
    error.value = '❌ Tu navegador no soporta acceso a cámara (mediaDevices no disponible)'
    return
  }
  
  if (!navigator.mediaDevices.getUserMedia) {
    console.error('❌ getUserMedia NO EXISTE')
    error.value = '❌ Tu navegador no soporta getUserMedia'
    return
  }
  
  console.log('✅ APIs básicas disponibles')
  
  // Esperar a que el DOM esté completamente listo
  await nextTick()
  console.log('⏳ DOM actualizado con nextTick')
  
  // Verificar múltiples veces que el elemento existe
  let attempts = 0
  while (!videoElement.value && attempts < 10) {
    console.log(`🔄 Esperando elemento video... intento ${attempts + 1}/10`)
    await new Promise(resolve => setTimeout(resolve, 200))
    await nextTick()
    attempts++
  }
  
  if (!videoElement.value) {
    console.error('❌ ELEMENTO VIDEO NO ENCONTRADO después de 10 intentos')
    error.value = '❌ Error: No se pudo encontrar el elemento video. Recarga la página.'
    return
  }
  
  console.log('✅ Elemento video encontrado:', videoElement.value)
  
  try {
    console.log('📷 ==> SOLICITANDO ACCESO A CÁMARA <==')
    
    // Probar primero con configuración básica
    let constraints = {
      video: {
        facingMode: 'environment'
      }
    }
    
    console.log('📱 Constraints a usar:', JSON.stringify(constraints, null, 2))
    console.log('⏳ Llamando getUserMedia...')
    
    stream = await navigator.mediaDevices.getUserMedia(constraints)
    
    console.log('🎉 ¡STREAM OBTENIDO EXITOSAMENTE!')
    console.log('📺 Stream details:', stream)
    console.log('📹 Video tracks:', stream.getVideoTracks())
    console.log('🔧 Tracks info:', stream.getVideoTracks().map(track => ({
      id: track.id,
      label: track.label,
      kind: track.kind,
      readyState: track.readyState,
    })))
    
    // Triple verificación del elemento video antes de asignar
    console.log('🔍 Verificando elemento video antes de asignar stream...')
    if (!videoElement.value) {
      console.error('❌ ¡ELEMENTO VIDEO SE PERDIÓ DURANTE EL PROCESO!')
      error.value = 'Error: Elemento video no disponible durante asignación'
      return
    }
    
    console.log('📺 Asignando stream al elemento video...')
    videoElement.value.srcObject = stream
    scanning.value = true
    
    console.log('⚡ Estado actualizado - scanning:', scanning.value)
    
    // Callbacks del elemento video con logs
    videoElement.value.onloadedmetadata = () => {
      console.log('🎬 VIDEO METADATA CARGADO')
      if (videoElement.value) {
        console.log('📐 Dimensiones del video:', 
          videoElement.value.videoWidth, 'x', videoElement.value.videoHeight)
        console.log('▶️  Iniciando reproducción...')
        videoElement.value.play()
        console.log('🔄 Iniciando interval de escaneo...')
        scanInterval = setInterval(scanQR, 500)
        console.log('✅ ¡ESCANEO COMPLETAMENTE INICIADO!')
      } else {
        console.error('❌ Elemento video perdido en callback')
      }
    }
    
    videoElement.value.onerror = (e) => {
      console.error('❌ ERROR EN ELEMENTO VIDEO:', e)
      console.error('Error details:', e.message, e.code, e.target)
      error.value = 'Error al reproducir el video de la cámara: ' + e.message
    }
    
    videoElement.value.onplay = () => {
      console.log('▶️  Video empezó a reproducirse')
    }
    
    videoElement.value.oncanplay = () => {
      console.log('📹 Video puede reproducirse')
    }
    
  } catch (err) {
    console.log('💥 ================================')
    console.log('💥 ERROR AL ACCEDER A LA CÁMARA')
    console.log('💥 ================================')
    console.error('❌ Error completo:', err)
    console.error('📛 Error name:', err.name)
    console.error('💬 Error message:', err.message)
    console.error('📚 Error stack:', err.stack)
    console.error('🔧 Error toString:', err.toString())
    
    if (err.name === 'NotAllowedError') {
      console.log('🚫 PROBLEMA: Permisos denegados')
      error.value = '🚫 Permiso denegado. INSTRUCCIONES:\n\n1. Toca el ícono de candado/escudo en la barra de direcciones\n2. Selecciona "Permitir" para cámara\n3. Recarga la página\n4. O ve a Configuración → Privacidad → Cámara'
    } else if (err.name === 'NotFoundError') {
      console.log('📷 PROBLEMA: Sin dispositivos de cámara')
      error.value = '📷❌ No se encontró cámara en tu dispositivo'
    } else if (err.name === 'NotReadableError') {
      console.log('📱 PROBLEMA: Cámara ocupada')
      error.value = '📷⚠️ Cámara ocupada por otra app. Cierra otras apps de cámara'
    } else if (err.name === 'OverconstrainedError') {
      console.log('⚙️  PROBLEMA: Constraints no soportadas')
      error.value = '📱⚠️ Tu cámara no soporta los requisitos. Probando configuración básica...'
      setTimeout(() => retryBasicCamera(), 1000)
    } else if (err.name === 'SecurityError') {
      console.log('🔒 PROBLEMA: Error de seguridad')
      error.value = '🔒 Error de seguridad. Protocolo actual: ' + window.location.protocol
    } else if (err.name === 'TypeError') {
      console.log('🔧 PROBLEMA: Error de tipo - posiblemente mediaDevices no disponible')
      error.value = '❌ Error de tipo: ' + err.message + '\n\n¿Estas usando un navegador moderno?'
    } else {
      console.log('❓ PROBLEMA: Error desconocido')
      error.value = `❌ Error: ${err.name} - ${err.message}\n\nDetalles técnicos: ${err.stack}`
    }
    
    console.log('🔍 ¿Qué deberías probar?')
    console.log('1. Recarga la página (F5)')
    console.log('2. Permite permisos de cámara')
    console.log('3. Usa otro navegador (Chrome/Firefox)')
    console.log('4. Verifica que la cámara funciona en otras apps')
  }
}

// Función para reintentar con configuración básica
const retryBasicCamera = async () => {
  console.log('🔄 ================================')
  console.log('🔄 RETRY CON CONFIGURACIÓN BÁSICA')
  console.log('🔄 ================================')
  
  try {
    console.log('⚙️  Intentando con video: true (configuración más básica)')
    
    // Verificar nuevamente que el elemento existe
    if (!videoElement.value) {
      console.error('❌ Elemento video no disponible para retry')
      error.value = 'Error: Elemento video no disponible durante reintentos.'
      return
    }
    
    console.log('✅ Elemento video disponible para retry')
    
    const basicConstraints = {
      video: true
    }
    
    console.log('📱 Basic constraints:', JSON.stringify(basicConstraints, null, 2))
    console.log('⏳ Reintentando getUserMedia con configuración básica...')
    
    stream = await navigator.mediaDevices.getUserMedia(basicConstraints)
    console.log('🎉 ¡RETRY EXITOSO! Stream obtenido:', stream)
    
    if (!videoElement.value) {
      console.error('❌ Elemento video se perdió durante retry')
      error.value = 'Error: Elemento video no disponible.'
      return
    }
    
    console.log('📺 Asignando stream en retry...')
    videoElement.value.srcObject = stream
    scanning.value = true
    error.value = ''
    
    videoElement.value.onloadedmetadata = () => {
      if (videoElement.value) {
        console.log('✅ Retry completado - video iniciado')
        videoElement.value.play()
        scanInterval = setInterval(scanQR, 500)
        console.log('✅ Cámara iniciada con configuración básica')
      }
    }
    
  } catch (err) {
    console.log('💥 ================================')
    console.log('💥 RETRY TAMBIÉN FALLÓ')
    console.log('💥 ================================')
    console.error('❌ Error en retry:', err)
    console.error('📛 Retry error name:', err.name)
    console.error('💬 Retry error message:', err.message)
    error.value = '❌ No se pudo iniciar la cámara ni con configuración básica: ' + err.message
  }
}

// Función para diagnosticar cámaras disponibles
const diagnoseCameras = async () => {
  error.value = ''
  
  let info = '📱 DIAGNÓSTICO DEL SISTEMA\n\n'
  info += `🌐 URL: ${window.location.href}\n`
  info += `🔒 Protocolo: ${window.location.protocol}\n`
  info += `🔧 User Agent: ${navigator.userAgent}\n\n`
  
  // Verificar soporte de getUserMedia
  if (!navigator.mediaDevices) {
    info += '❌ navigator.mediaDevices NO disponible\n'
  } else {
    info += '✅ navigator.mediaDevices disponible\n'
    
    if (!navigator.mediaDevices.getUserMedia) {
      info += '❌ getUserMedia NO disponible\n'
    } else {
      info += '✅ getUserMedia disponible\n'
    }
  }
  
  // Intentar enumerar dispositivos
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter(device => device.kind === 'videoinput')
    
    info += `\n📷 Cámaras encontradas: ${videoDevices.length}\n`
    
    if (videoDevices.length === 0) {
      info += '❌ No se encontraron dispositivos de video\n'
    } else {
      videoDevices.forEach((device, index) => {
        info += `  ${index + 1}. ${device.label || 'Cámara ' + (index + 1)}\n`
        info += `     ID: ${device.deviceId || 'N/A'}\n`
      })
    }
  } catch (err) {
    info += `❌ Error al enumerar dispositivos: ${err.message}\n`
  }
  
  // Probar acceso básico a cámara
  try {
    info += '\n🧪 PROBANDO ACCESO A CÁMARA...\n'
    
    const testStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment'
      }
    })
    
    info += '✅ Acceso a cámara trasera: OK\n'
    
    const tracks = testStream.getVideoTracks()
    if (tracks.length > 0) {
      const track = tracks[0]
      const settings = track.getSettings()
      info += `📐 Resolución: ${settings.width}x${settings.height}\n`
      info += `🎥 Frame rate: ${settings.frameRate}\n`
      info += `📱 Facing mode: ${settings.facingMode}\n`
    }
    
    // Cerrar el stream de prueba
    testStream.getTracks().forEach(track => track.stop())
    
  } catch (err) {
    info += `❌ Error de acceso: ${err.name} - ${err.message}\n`
    
    if (err.name === 'NotAllowedError') {
      info += '➡️ SOLUCIÓN: Permitir permisos de cámara\n'
    } else if (err.name === 'NotFoundError') {
      info += '➡️ PROBLEMA: No hay cámara disponible\n'
    } else if (err.name === 'SecurityError') {
      info += '➡️ PROBLEMA: Error de seguridad (¿HTTP en lugar de HTTPS?)\n'
    }
  }
  
  // Verificar HTTPS
  if (window.location.protocol === 'https:') {
    info += '\n✅ HTTPS: Correcto\n'
  } else {
    info += '\n❌ HTTPS: NO - La cámara requiere HTTPS\n'
    info += '➡️ USA: https://germanestelav.github.io/frontend_asistencia/#/escanear\n'
  }
  
  diagnosticInfo.value = info
  console.log('🔧 Diagnóstico completo:', info)
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

<style scoped>
.restaurant-scanner-page {
  background: linear-gradient(135deg, #c62d42 0%, #dc3545 30%, #e74c3c 70%, #f8f9fa 100%);
}

.restaurant-scanner-card {
  border: none;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  background: white;
  overflow: hidden;
}

.restaurant-scanner-header {
  font-family: 'Georgia', 'Times New Roman', serif;
}

.restaurant-scanner-title {
  color: #c62d42;
  font-weight: bold;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.restaurant-scanner-subtitle {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0;
  font-style: italic;
}

video {
  border: 3px solid #c62d42;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(198, 45, 66, 0.2);
  max-width: 100%;
  height: auto;
}

.btn-primary {
  background: linear-gradient(135deg, #c62d42 0%, #dc3545 100%);
  border: none;
  border-radius: 25px;
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(198, 45, 66, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(198, 45, 66, 0.4);
  background: linear-gradient(135deg, #a02332 0%, #b02a37 100%);
}

.btn-danger {
  background: #dc3545;
  border: none;
  border-radius: 25px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.btn-info {
  background: #6c757d;
  border: none;
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  font-weight: 500;
  font-size: 0.85rem;
}

.btn-info:hover {
  background: #5c6268;
  transform: translateY(-1px);
}

.alert {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.alert-success {
  background-color: #d4edda;
  border-left: 4px solid #28a745;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  border-left: 4px solid #dc3545;
  color: #721c24;
}

.alert-info {
  background-color: #d1ecf1;
  border-left: 4px solid #17a2b8;
  color: #0c5460;
}

/* Responsive design for mobile devices */
@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem !important;
  }
  
  .restaurant-scanner-title {
    font-size: 1.5rem;
  }
  
  .restaurant-scanner-subtitle {
    font-size: 0.8rem;
  }
  
  .btn-primary {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
  
  .btn-lg {
    padding: 0.7rem 1.3rem;
    font-size: 1rem;
  }
  
  video {
    border-width: 2px;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .card-body {
    padding: 1rem !important;
  }
  
  .restaurant-scanner-title {
    font-size: 1.3rem;
  }
  
  .restaurant-scanner-subtitle {
    font-size: 0.75rem;
  }
  
  .btn-primary {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }
  
  .btn-lg {
    padding: 0.6rem 1.1rem;
    font-size: 0.9rem;
  }
  
  .btn-info {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .alert {
    font-size: 0.9rem;
    padding: 1rem;
  }
  
  .alert h4 {
    font-size: 1.1rem;
  }
  
  video {
    border-width: 2px;
    border-radius: 10px;
  }
  
  .me-3 {
    margin-right: 0 !important;
  }
}

/* Fix for iOS Safari video */
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  video {
    object-fit: cover;
  }
}

/* High contrast mode accessibility */
@media (prefers-contrast: high) {
  .restaurant-scanner-title {
    color: #000;
  }
  
  .btn-primary {
    background: #000;
    color: #fff;
  }
}
</style>
