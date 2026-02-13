@echo off
echo ===================================
echo      🚀 DESARROLLO LOCAL - DEBUG  
echo ===================================
echo.
echo 🔧 Este script inicia la app en desarrollo local
echo 📡 Conecta directamente a tu backend en puerto 8000
echo 🐛 MODO DEBUG: Con logs detallados para diagnosticar problemas de cámara
echo.
echo ⚠️  ASEGURATE DE QUE TU BACKEND ESTE CORRIENDO ⚠️
echo    Backend URL: http://localhost:8000
echo.
echo 🌐 URLs HTTP (para debugging):
echo    En tu PC: http://localhost:3000/
echo    En tu telefono: http://192.168.1.10:3000/
echo.
echo 📝 IMPORTANTE: Los logs se mostrarán en la consola del navegador
echo    Presiona F12 para abrir DevTools y ver los logs detallados
echo.
pause

cd /d "%~dp0"
echo 🏃 Iniciando servidor de desarrollo con logging extendido...
npm run dev

pause