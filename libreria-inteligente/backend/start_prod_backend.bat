@echo off
echo =========================================
echo   Iniciando Backend (Produccion)
echo =========================================

REM Activar el entorno virtual
call "C:\Users\putom\source\repos\biblio-app\libreria-inteligente\backend\.venv\Scripts\activate.bat"

REM Iniciar el servidor del Backend con Gunicorn
echo Iniciando Backend en http://localhost:8001 ...
gunicorn main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001

echo.
echo Backend iniciado.
pause
