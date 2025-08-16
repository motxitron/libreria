@echo off
echo =========================================
echo   Iniciando Frontend (Produccion)
echo =========================================

REM Navegar a la carpeta del frontend
cd "C:\Users\putom\source\repos\biblio-app\libreria-inteligente\frontend"

REM Crear la version de produccion del frontend
echo Creando build de produccion del Frontend...
call npm run build

REM Navegar a la carpeta build y servir los archivos estaticos
echo Sirviendo Frontend en http://localhost:3000 ...
cd build
python -m http.server 3000

echo.
echo Frontend iniciado.
pause
