@echo off
echo ========================================
echo Sistema de Asistencia con QR
echo ========================================
echo.
echo Iniciando frontend Vue.js...
echo.
echo Frontend Local: http://localhost:3000
echo Backend debe estar en: http://localhost:8000
echo.
echo Para acceder desde tu telefono:
echo   1. Ejecuta: ipconfig
echo   2. Busca tu IPv4 Address (ej: 192.168.1.10)
echo   3. En tu telefono abre: http://TU_IP:3000/escanear
echo.
echo Presiona Ctrl+C para detener
echo.
npm run dev
