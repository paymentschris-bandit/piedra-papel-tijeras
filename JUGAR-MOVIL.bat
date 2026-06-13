@echo off
title JUEGO EN MOVIL - NO CERRAR
cd /d "%~dp0"
color 0A

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do set IP=%%a
set IP=%IP: =%

echo.
echo  ============================================================
echo   JUEGO EN EL MOVIL (misma WiFi que el PC)
echo  ============================================================
echo.
echo   1. En el movil desactiva datos 4G/5G (solo WiFi).
echo   2. Abre Chrome y escribe:
echo.
echo      http://%IP%:8080
echo.
echo   Prueba primero:
echo      http://%IP%:8080/test-movil.html
echo.
echo   Modo Webcam (camara): usa INICIAR-WEBCAM.bat
echo      https://%IP%:8443
echo      (ejecuta ABRIR-FIREWALL.bat como admin si no carga)
echo.
echo   Si la WiFi no funciona: ABRIR-EN-MOVIL.bat (enlace internet)
echo  ============================================================
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

start "" "http://localhost:8080/test-movil.html"
python -m http.server 8080
