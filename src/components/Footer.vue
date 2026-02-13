<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-brand">
        <span class="footer-logo">Sabor <span class="footer-heart">♡</span> Gusto</span>
        <span class="footer-separator">|</span>
        <span class="footer-system">Sistema de Asistencia</span>
      </div>
      <div class="footer-credits">
        <span class="footer-dev">
          <i class="bi bi-code-slash"></i> Desarrollado por 
          <strong class="dev-name">German Estela V.</strong>
        </span>
        <span class="footer-dot">·</span>
        <span class="footer-year">
          <i class="bi bi-calendar3"></i> {{ currentYear }}
        </span>
      </div>
      <div class="footer-tagline">
        Soluciones digitales a la medida de tu negocio
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #a0a8b8;
  padding: 1.5rem 0;
  margin-top: auto;
  border-top: 3px solid #c62d42;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
}

.footer-logo {
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 700;
  font-style: italic;
  color: #fff;
  font-size: 1.1rem;
}

.footer-heart {
  color: #c62d42;
  display: inline-block;
  animation: heartPulseFooter 1.5s ease-in-out infinite;
}

.footer-separator {
  color: #c62d42;
  font-weight: 300;
  font-size: 1.2rem;
}

.footer-system {
  color: #d1d5db;
  font-weight: 500;
  font-size: 0.9rem;
  letter-spacing: 0.3px;
}

.footer-credits {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
}

.footer-dev i,
.footer-year i {
  color: #c62d42;
  margin-right: 0.25rem;
}

.dev-name {
  color: #fff;
  font-weight: 700;
  background: linear-gradient(135deg, #c62d42, #e74c3c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-dot {
  color: #4a5568;
  font-size: 1rem;
}

.footer-tagline {
  font-size: 0.75rem;
  color: #5a6577;
  font-style: italic;
  letter-spacing: 0.5px;
}

@keyframes heartPulseFooter {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

/* Responsive */
@media (max-width: 576px) {
  .app-footer {
    padding: 1.2rem 0;
  }

  .footer-brand {
    flex-direction: column;
    gap: 0.2rem;
  }

  .footer-separator {
    display: none;
  }

  .footer-credits {
    flex-direction: column;
    gap: 0.3rem;
  }

  .footer-dot {
    display: none;
  }
}
</style>
