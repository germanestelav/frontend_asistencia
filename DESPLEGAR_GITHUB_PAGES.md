# 🚀 Guía: Desplegar a GitHub Pages

## 📋 Requisitos Previos

1. Cuenta en GitHub (crea una en https://github.com si no tienes)
2. Git instalado en tu PC (descarga de https://git-scm.com/downloads)
3. Tu IP local (ejecútala con `ipconfig` en CMD)

## 🔧 Paso 1: Configurar el Backend

Para que el frontend en GitHub Pages pueda conectarse a tu backend local:

### 1.1 Obtén tu IP local

Abre CMD y ejecuta:
```bash
ipconfig
```

Busca tu **IPv4 Address**, por ejemplo: `192.168.1.10`

### 1.2 Actualiza la URL del backend

Edita el archivo `.env.production` y reemplaza la IP:
```env
VITE_API_URL=http://TU_IP_REAL:8000
```

Ejemplo:
```env
VITE_API_URL=http://192.168.1.10:8000
```

### 1.3 Configura CORS en el backend

Ve a la carpeta del backend y edita `main.py`, asegúrate que tenga:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica tu dominio de GitHub Pages
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 1.4 Inicia el backend para que escuche en todas las interfaces

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📦 Paso 2: Crear Repositorio en GitHub

1. Ve a https://github.com
2. Haz clic en el botón **"+" → "New repository"**
3. Nombre del repositorio: `frontend_asistencia`
4. Deja todo por defecto y haz clic en **"Create repository"**
5. **COPIA** la URL del repositorio (ejemplo: `https://github.com/TU_USUARIO/frontend_asistencia.git`)

## 💻 Paso 3: Subir el Código

Abre **CMD** en la carpeta del proyecto y ejecuta:

```bash
cd "C:\Users\Estela\Desktop\TRABAJOS\RESTAURANTE - CESAR PANDO\app_asistencia\frontend_asistencia"

# Inicializar Git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit"

# Conectar con GitHub (reemplaza TU_USUARIO con tu usuario real)
git remote add origin https://github.com/TU_USUARIO/frontend_asistencia.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

## 🌐 Paso 4: Desplegar a GitHub Pages

### Opción A: Usando el script automatizado

1. Abre CMD en la carpeta del proyecto
2. Ejecuta:
   ```bash
   npm run build
   ```
3. Si todo se construyó correctamente, navega a la carpeta dist:
   ```bash
   cd dist
   git init
   git add -A
   git commit -m "Deploy to GitHub Pages"
   git push -f https://github.com/TU_USUARIO/frontend_asistencia.git main:gh-pages
   cd ..
   ```

### Opción B: Desde la interfaz de GitHub

1. Ve a tu repositorio en GitHub
2. Haz clic en **"Settings"** (Configuración)
3. En el menú lateral, haz clic en **"Pages"**
4. En **"Source"**, selecciona la rama **"gh-pages"**
5. Haz clic en **"Save"**

## ✅ Paso 5: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. **Settings** → **Pages**
3. **Source**: Selecciona `gh-pages` como branch
4. Haz clic en **Save**
5. Espera unos minutos

Tu app estará disponible en:
```
https://TU_USUARIO.github.io/frontend_asistencia/
```

## 📱 Paso 6: Probar desde tu Celular

### 6.1 Asegúrate de que todo esté corriendo:

**En tu PC:**
- ✅ Backend corriendo: `uvicorn main:app --host 0.0.0.0 --port 8000`
- ✅ PC y celular en la misma red WiFi

**Desde tu celular:**
1. Abre el navegador (Chrome, Safari, Firefox, etc.)
2. Ve a: `https://TU_USUARIO.github.io/frontend_asistencia/escanear`
3. Acepta los permisos de cámara
4. ¡Debería funcionar! 🎉

## 🔄 Actualizar el Sitio

Cada vez que hagas cambios:

```bash
# 1. Guardar cambios
git add .
git commit -m "Descripción de cambios"
git push origin main

# 2. Redesplegar
npm run build
cd dist
git init
git add -A
git commit -m "Deploy update"
git push -f https://github.com/TU_USUARIO/frontend_asistencia.git main:gh-pages
cd ..
```

## ⚠️ Problemas Comunes

### La cámara no funciona
- ✅ Verifica que uses HTTPS (GitHub Pages lo hace automáticamente)
- ✅ Acepta los permisos de cámara en el navegador

### Error de conexión al backend
- ✅ Verifica que el backend esté corriendo
- ✅ Verifica que la IP en `.env.production` sea correcta
- ✅ Verifica que CORS esté configurado en el backend
- ✅ Verifica que celular y PC estén en la misma WiFi

### La página no carga
- ✅ Espera 5-10 minutos después de desplegar
- ✅ Verifica que la rama `gh-pages` exista en GitHub
- ✅ Verifica la configuración en Settings → Pages

### Error 404 en rutas
- ✅ Esto es normal con Vue Router en GitHub Pages
- ✅ Siempre accede desde la URL completa (incluye `/escanear` al final)

## 📝 Notas Importantes

1. **GitHub Pages es GRATIS** para repositorios públicos
2. **HTTPS automático** - La cámara funcionará sin problemas
3. **Tu backend debe estar corriendo** mientras uses la app desde el celular
4. **Mismo WiFi** - PC y celular deben estar en la misma red
5. **IP puede cambiar** - Si reinicias el router, tu IP puede cambiar y tendrás que actualizar `.env.production`

## 🎯 Resumen Rápido

```bash
# 1. Configura IP en .env.production
# 2. Sube a GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/frontend_asistencia.git
git push -u origin main

# 3. Despliega a GitHub Pages
npm run build
cd dist
git init
git add -A
git commit -m "Deploy"
git push -f https://github.com/TU_USUARIO/frontend_asistencia.git main:gh-pages
cd ..

# 4. Abre en tu celular
# https://TU_USUARIO.github.io/frontend_asistencia/escanear
```

¡Listo! 🚀
