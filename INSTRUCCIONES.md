# 🚀 INSTRUCCIONES PARA INICIAR EL PROYECTO

## ⚠️ REQUISITOS PREVIOS

1. Node.js instalado (versión 18 o superior)
2. Backend FastAPI corriendo en http://localhost:8000
3. Base de datos PostgreSQL con los usuarios de prueba creados

---

## 📦 INSTALACIÓN DEL FRONTEND

### Paso 1: Abrir terminal en la carpeta del frontend
```bash
cd "c:\Users\Estela\Desktop\TRABAJOS\RESTAURANTE - CESAR PANDO\app_asistencia\frontend_asistencia"
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Iniciar servidor de desarrollo
```bash
npm run dev
```

El frontend se abrirá en: **http://localhost:3000**

---

## 🎯 USUARIOS DE PRUEBA

### 👷 Trabajadores:
- **Usuario:** mlopez  
  **Contraseña:** trabajador123  
  **Horario:** 09:00 - 18:00

- **Usuario:** jramirez  
  **Contraseña:** trabajador123  
  **Horario:** 10:00 - 19:00

### 👨‍💼 Administrador:
- **Usuario:** cpando  
  **Contraseña:** admin123  
  **Rol:** Dueño

---

## 🔄 FLUJO DE PRUEBA COMPLETO

### 1️⃣ Probar Login como Trabajador:
1. Ir a http://localhost:3000/login
2. Ingresar: **mlopez** / **trabajador123**
3. Click en "Iniciar Sesión"
4. Deberías ver el dashboard de trabajador con opciones:
   - Generar QR
   - Ver mis asistencias

### 2️⃣ Generar Código QR:
1. Click en "Generar QR"
2. Se mostrará un código QR con countdown de 3 minutos
3. El código QR contiene un token temporal

### 3️⃣ Escanear QR (en otra pestaña o dispositivo):
1. Ir a http://localhost:3000/escanear
2. Click en "Iniciar Escáner"
3. Permitir acceso a la cámara
4. Mostrar el código QR frente a la cámara
5. Se registrará automáticamente la entrada o salida

### 4️⃣ Ver Historial:
1. En el dashboard, click en "Ver Historial"
2. Se mostrará lista de asistencias con:
   - Fecha
   - Hora entrada (con estado: A TIEMPO o TARDANZA)
   - Hora salida (con estado: SALIDA OK o SALIDA ANTICIPADA)

### 5️⃣ Probar Panel Administrativo:
1. Cerrar sesión
2. Login con: **cpando** / **admin123**
3. Verás el dashboard administrativo con:
   - Estadísticas del día (total trabajadores, presentes, ausentes, tardanzas)
   - Tarjetas de acceso rápido:
     * Ver todos los trabajadores
     * Generar reportes
     * Agregar nuevo trabajador

### 6️⃣ Ver Lista de Trabajadores:
1. Click en "Ver Lista"
2. Se mostrarán todos los trabajadores con:
   - Nombre completo
   - DNI, usuario, teléfono
   - Horario
   - Estado (Activo/Inactivo)
3. Acciones disponibles:
   - Cambiar contraseña
   - Dar de baja
   - Reactivar

### 7️⃣ Crear Nuevo Trabajador:
1. Click en "Agregar Trabajador"
2. Llenar el formulario:
   - Datos personales
   - DNI (8 dígitos)
   - Usuario y contraseña
   - Horario (opcional)
3. Click en "Guardar"

### 8️⃣ Generar Reportes:
1. Click en "Generar Reporte"
2. Seleccionar tipo de reporte:
   - **Semanal:** Última semana
   - **Quincenal:** Primera o segunda quincena del mes
   - **Mensual:** Todo el mes
   - **Personalizado:** Rango de fechas específico
3. Click en "Generar Reporte"
4. Se mostrará tabla con:
   - Nombre del trabajador
   - Total días / Días asistidos / Días faltados
   - Tardanzas / A tiempo
   - Salidas anticipadas
   - % de asistencia

---

## 🎨 CARACTERÍSTICAS DEL FRONTEND

### ✅ Autenticación:
- JWT tokens en localStorage
- Protección de rutas con guards
- Auto-logout en 401 (token expirado)
- Redirección automática según rol

### ✅ Roles y Permisos:
- **TRABAJADOR:** Solo puede generar QR y ver su historial
- **DUENO:** Solo puede ver reportes y gestionar trabajadores
- Los guards impiden acceso no autorizado

### ✅ Estados y Badges:
- **A TIEMPO:** Verde
- **TARDANZA:** Rojo
- **SALIDA OK:** Verde
- **SALIDA ANTICIPADA:** Amarillo
- **SIN SALIDA:** Gris

### ✅ Responsive:
- Funciona en desktop, tablet y móvil
- Bootstrap 5 responsive grid
- Navbar adaptable

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### ❌ Error: "Cannot connect to backend"
**Solución:** Verifica que el backend esté corriendo en http://localhost:8000

```bash
# En la carpeta del backend:
cd ..\back_asistencia
python app.py
```

### ❌ Error: "npm: command not found"
**Solución:** Instala Node.js desde https://nodejs.org/

### ❌ Error: "Module not found"
**Solución:** Reinstala las dependencias:
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ El QR no escanea
**Solución:** 
1. Verifica que tienes permisos de cámara
2. Usa HTTPS o localhost (requerido para getUserMedia)
3. Prueba con otro navegador (Chrome recomendado)

### ❌ Errores de CORS
**Solución:** El backend ya tiene CORS configurado. Si persiste:
1. Verifica que el backend esté corriendo
2. Revisa la consola del navegador
3. Verifica la URL en `src/services/api.js`

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
frontend_asistencia/
├── src/
│   ├── assets/
│   │   └── styles.css          # Estilos personalizados
│   ├── components/
│   │   ├── Navbar.vue          # Barra de navegación
│   │   └── QRCode.vue          # Componente QR
│   ├── services/
│   │   ├── api.js              # Configuración Axios
│   │   ├── authService.js      # Login/Logout
│   │   ├── qrService.js        # Generar/Validar QR
│   │   ├── asistenciaService.js # Historial
│   │   └── adminService.js     # Admin endpoints
│   ├── stores/
│   │   └── authStore.js        # Estado de autenticación
│   ├── views/
│   │   ├── Login.vue           # Pantalla de login
│   │   ├── Home.vue            # Dashboard (trabajador/admin)
│   │   ├── GenerarQR.vue       # Generar código QR
│   │   ├── Historial.vue       # Ver asistencias
│   │   ├── Escanear.vue        # Escanear QR
│   │   └── admin/
│   │       ├── Trabajadores.vue    # Lista trabajadores
│   │       ├── CrearTrabajador.vue # Formulario crear
│   │       └── Reportes.vue        # Generar reportes
│   ├── router/
│   │   └── index.js            # Rutas y guards
│   ├── App.vue                 # Componente raíz
│   └── main.js                 # Entry point
├── package.json                # Dependencias
├── vite.config.js              # Configuración Vite
└── README.md                   # Documentación

```

---

## 🎯 COMANDOS ÚTILES

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build
npm run preview

# Limpiar caché
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 NOTAS IMPORTANTES

1. **Códigos QR:** Expiran en 3 minutos y son de un solo uso
2. **Sesiones:** Los tokens JWT expiran en 30 minutos
3. **Usuarios inactivos:** No pueden iniciar sesión
4. **Horarios:** Si un trabajador no tiene horario configurado, el estado será "SIN_HORARIO"
5. **Cámara:** Para escanear QR se requiere HTTPS o localhost
6. **Bootstrap Icons:** Ya incluido para los iconos de la interfaz

---

## ✅ VERIFICACIÓN FINAL

Checklist antes de entregar:

- [ ] Backend corriendo en http://localhost:8000
- [ ] Frontend corriendo en http://localhost:3000
- [ ] Usuarios de prueba creados en la BD
- [ ] Login funciona para trabajador y admin
- [ ] Generar QR funciona
- [ ] Escanear QR registra asistencia
- [ ] Historial muestra registros
- [ ] Panel admin muestra estadísticas
- [ ] Crear trabajador funciona
- [ ] Reportes se generan correctamente

---

## 🆘 CONTACTO

Para soporte o consultas sobre el sistema:
- Revisar el código en los archivos fuente
- Verificar la consola del navegador para errores
- Verificar la consola del backend para logs

---

**¡Todo listo para usar! 🎉**
