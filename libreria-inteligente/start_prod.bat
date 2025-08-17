@echo off
echo =================================================
echo   Iniciando Servidores de Produccion (Minimizados)
echo =================================================

echo Iniciando Backend...
start /min "Backend Prod" cmd /c "cd backend && start_prod_backend.bat"

echo Iniciando Frontend...
start /min "Frontend Prod" cmd /c "cd frontend && start_prod_frontend.bat"

echo.
echo Servidores de produccion iniciados.
echo Abriendo el navegador en 5 segundos...
timeout /t 5 >nul
start http://localhost:3000
