<template>
  <div id="app" class="app-wrapper">
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: { Footer }
}
</script>

<style>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-wrapper > .app-footer {
  margin-top: auto;
}
</style>
