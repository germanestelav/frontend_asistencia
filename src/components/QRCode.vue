<template>
  <div class="text-center">
    <canvas ref="qrCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 300
  }
})

const qrCanvas = ref(null)

const generateQR = async () => {
  if (qrCanvas.value && props.value) {
    try {
      await QRCode.toCanvas(qrCanvas.value, props.value, {
        width: props.size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    } catch (error) {
      console.error('Error generando QR:', error)
    }
  }
}

onMounted(() => {
  generateQR()
})

watch(() => props.value, () => {
  generateQR()
})
</script>
