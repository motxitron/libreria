@echo off
setlocal enabledelayedexpansion
echo =========================================
echo    Deteniendo Backend (Produccion)
echo =========================================

echo.
echo Buscando y deteniendo el servidor del Backend (en puerto 8001)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8001" ^| findstr "LISTENING"') do (
    set "backend_pid=%%a"
    if defined backend_pid (
        echo Cerrando proceso del backend con PID !backend_pid! y sus subprocesos...
        taskkill /F /PID !backend_pid! /T
    )
)

echo.
echo Proceso del Backend detenido.
pause
