@echo off
echo ========================================
echo Desplegando a GitHub Pages
echo ========================================
echo.
echo IMPORTANTE:
echo 1. Asegurate de haber creado el repositorio en GitHub
echo 2. Ya debes haber ejecutado: git init, git add, git commit
echo 3. Ya debes haber conectado con: git remote add origin TU_URL
echo.
echo Presiona cualquier tecla para continuar o Ctrl+C para cancelar...
pause

echo.
echo Construyendo la aplicacion...
call npm run build

echo.
echo Navegando a la carpeta dist...
cd dist

echo.
echo Inicializando Git en dist...
git init
git add -A
git commit -m "Deploy to GitHub Pages"

echo.
echo Subiendo a GitHub Pages...
echo NOTA: Reemplaza USUARIO y REPOSITORIO con tus datos reales
git push -f https://github.com/USUARIO/REPOSITORIO.git main:gh-pages

cd ..

echo.
echo ========================================
echo Desplegado!
echo ========================================
echo.
echo Tu app estara disponible en:
echo https://USUARIO.github.io/frontend_asistencia/
echo.
pause
