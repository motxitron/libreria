@echo off
echo =========================================
echo   Iniciando Backend (Produccion)
echo =========================================

REM Activar el entorno virtual
call .venv\Scripts\activate.bat

REM Iniciar el servidor del Backend con Uvicorn
echo Iniciando Backend en http://localhost:8001 ...
uvicorn main:app --host 0.0.0.0 --port 8001

echo.
echo Backend iniciado.
