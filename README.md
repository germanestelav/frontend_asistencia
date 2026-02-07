# Sistema de Asistencia con QR

Sistema completo de gestión de asistencias para restaurante con código QR.

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 📋 Características

### Para Trabajadores:
- Login con usuario y contraseña
- Generar código QR temporal (3 minutos)
- Ver historial de asistencias
- Estados de entrada (A tiempo / Tardanza)
- Estados de salida (Salida OK / Salida Anticipada)

### Para Administradores (Dueño):
- Dashboard con estadísticas del día
- Listado de todos los trabajadores
- Crear nuevos trabajadores
- Cambiar contraseñas
- Activar/desactivar usuarios
- Reportes de asistencia:
  - Semanal
  - Quincenal
  - Mensual
  - Personalizado (rango de fechas)

### Para Tablet de Registro:
- Escáner de código QR
- Validación automática
- Registro de entrada/salida

## 🔐 Usuarios de Prueba

### Trabajadores:
- Usuario: `mlopez` / Contraseña: `trabajador123`
- Usuario: `jramirez` / Contraseña: `trabajador123`

### Administrador:
- Usuario: `cpando` / Contraseña: `admin123`

## 🛠️ Tecnologías

- **Vue 3** - Framework frontend
- **Vue Router** - Navegación
- **Pinia** - Gestión de estado
- **Bootstrap 5** - Estilos
- **Axios** - Peticiones HTTP
- **QRCode** - Generación de códigos QR
- **jsQR** - Lectura de códigos QR
- **Vite** - Build tool

## 📡 API Backend

El backend debe estar corriendo en `http://localhost:8000`

## 📱 Estructura del Proyecto

```
src/
├── assets/          # Estilos CSS
├── components/      # Componentes reutilizables
│   ├── Navbar.vue
│   └── QRCode.vue
├── services/        # Servicios API
│   ├── api.js
│   ├── authService.js
│   ├── qrService.js
│   ├── asistenciaService.js
│   └── adminService.js
├── stores/          # Stores de Pinia
│   └── authStore.js
├── views/           # Vistas/Páginas
│   ├── Login.vue
│   ├── Home.vue
│   ├── GenerarQR.vue
│   ├── Historial.vue
│   ├── Escanear.vue
│   └── admin/
│       ├── Trabajadores.vue
│       ├── CrearTrabajador.vue
│       └── Reportes.vue
├── router/          # Configuración de rutas
│   └── index.js
├── App.vue
└── main.js
```

## 🎨 Paleta de Colores

- **Primary**: `#FF6B35` (Naranja/Rojo vibrante)
- **Success**: `#4CAF50` (Verde)
- **Warning**: `#FFC107` (Amarillo)
- **Danger**: `#F44336` (Rojo)
- **Info**: `#2196F3` (Azul)

## 📝 Notas Importantes

1. El backend debe estar corriendo antes de iniciar el frontend
2. Los códigos QR expiran en 3 minutos
3. Los tokens de sesión expiran en 30 minutos
4. Los usuarios inactivos no pueden iniciar sesión
5. Solo el rol TRABAJADOR puede generar códigos QR
6. Solo el rol DUENO puede acceder a funciones administrativas

## 🔧 Configuración

Para cambiar la URL del backend, edita `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8000' // Cambiar esta URL
})
```

## 📄 Licencia

Proyecto privado para Restaurante - César Pando
