<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    console.log('🎨 [APP] App.vue montado correctamente')
    console.log('🌐 [APP] Ruta actual:', this.$router.currentRoute.value.path)
    console.log('📱 [APP] User agent:', navigator.userAgent)
  },
  updated() {
    console.log('🔄 [APP] App.vue actualizado')
  }
}
</script>
