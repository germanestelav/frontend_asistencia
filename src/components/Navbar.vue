<template>
  <nav class="navbar navbar-expand-lg navbar-dark sabor-gusto-header">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center" href="#">
        <div class="logo-container">
          <div class="logo-text">
            <span class="sabor">Sabor</span>
            <span class="heart">♡</span>
            <span class="gusto">Gusto</span>
          </div>
          <div class="slogan">COMIDA HECHA CON AMOR</div>
        </div>
        <div class="divider"></div>
        <div class="system-name">
          <strong>Sistema de Asistencia</strong>
        </div>
      </a>
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="navbar-nav">
            <span class="navbar-text text-white me-3">
              {{ authStore.nombreCompleto }} 
              <span class="user-role">({{ authStore.user?.rol === 'ADMINISTRADOR' ? 'Administrador' : 'Trabajador' }})</span>
            </span>
          </li>
          <li class="nav-item">
            <button class="btn btn-outline-light btn-sm logout-btn" @click="handleLogout">
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sabor-gusto-header {
  background: linear-gradient(135deg, #c62d42 0%, #dc3545 50%, #e74c3c 100%);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  padding: 0.8rem 0;
  min-height: 80px;
  position: sticky;
  top: 0;
  z-index: 1030;
}

.navbar-brand {
  font-family: 'Georgia', 'Times New Roman', serif;
  display: flex;
  align-items: center;
  gap: 1rem;
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
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  letter-spacing: 1px;
}

.sabor {
  font-style: italic;
}

.heart {
  font-size: 2rem;
  color: white;
  animation: heartbeat 2s infinite;
  margin: 0 0.2rem;
}

.gusto {
  font-style: italic;
}

.slogan {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  letter-spacing: 2px;
  margin-top: -3px;
  text-align: center;
}

.divider {
  width: 2px;
  height: 45px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 1rem;
}

.system-name {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.user-role {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.logout-btn {
  border: 2px solid white;
  font-weight: 600;
  padding: 0.4rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: white;
  color: #c62d42;
  transform: scale(1.05);
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Responsive design */
@media (max-width: 768px) {
  .logo-text {
    font-size: 1.4rem;
  }
  
  .heart {
    font-size: 1.6rem;
  }
  
  .slogan {
    font-size: 0.55rem;
    letter-spacing: 1px;
  }
  
  .divider {
    display: none;
  }
  
  .system-name {
    font-size: 0.9rem;
    text-align: center;
    margin-top: 0.3rem;
  }
  
  .navbar-brand {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .sabor-gusto-header {
    min-height: auto;
    padding: 0.5rem 0;
  }
  
  .navbar-nav {
    text-align: center;
  }
  
  .navbar-text {
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .logo-text {
    font-size: 1.2rem;
  }
  
  .heart {
    font-size: 1.4rem;
  }
  
  .slogan {
    font-size: 0.5rem;
  }
  
  .system-name {
    font-size: 0.8rem;
  }
  
  .container-fluid {
    padding: 0 0.5rem;
  }
  
  .navbar-text {
    font-size: 0.8rem;
    margin-bottom: 0.5rem !important;
  }
  
  .logout-btn {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>
