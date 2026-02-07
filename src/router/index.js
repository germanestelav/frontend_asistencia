import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/authService'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/generar-qr',
    name: 'GenerarQR',
    component: () => import('@/views/GenerarQR.vue'),
    meta: { requiresAuth: true, requiresTrabajador: true }
  },
  {
    path: '/historial',
    name: 'Historial',
    component: () => import('@/views/Historial.vue'),
    meta: { requiresAuth: true, requiresTrabajador: true }
  },
  {
    path: '/escanear',
    name: 'Escanear',
    component: () => import('@/views/Escanear.vue')
  },
  {
    path: '/admin/trabajadores',
    name: 'AdminTrabajadores',
    component: () => import('@/views/admin/Trabajadores.vue'),
    meta: { requiresAuth: true, requiresDueno: true }
  },
  {
    path: '/admin/crear-trabajador',
    name: 'AdminCrearTrabajador',
    component: () => import('@/views/admin/CrearTrabajador.vue'),
    meta: { requiresAuth: true, requiresDueno: true }
  },
  {
    path: '/admin/reportes',
    name: 'AdminReportes',
    component: () => import('@/views/admin/Reportes.vue'),
    meta: { requiresAuth: true, requiresDueno: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const user = authService.getCurrentUser()
  const isAuthenticated = !!authService.getToken()

  // Redirigir a home si ya está autenticado e intenta ir a login
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
    return
  }

  // Verificar autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // Verificar rol de dueño
  if (to.meta.requiresDueno && user?.rol !== 'DUENO') {
    next('/')
    return
  }

  // Verificar rol de trabajador
  if (to.meta.requiresTrabajador && user?.rol !== 'TRABAJADOR') {
    next('/')
    return
  }

  next()
})

export default router
