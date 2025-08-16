@echo off
setlocal enabledelayedexpansion
echo =========================================
echo    Deteniendo Frontend (Produccion)
echo =========================================

echo.
echo Buscando y deteniendo el servidor del Frontend (en puerto 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Cerrando proceso con PID %%a y sus subprocesos...
    taskkill /F /PID %%a /T
)

echo.
echo Proceso del Frontend detenido.
pause
