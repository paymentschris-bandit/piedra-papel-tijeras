@echo off
title Piedra Papel Tijeras - Servidor WEBCAM (HTTPS)
cd /d "%~dp0"

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do set IP=%%a
set IP=%IP: =%

echo.
echo Cerrando servidor anterior en puerto 8443 (si existe)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8443" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

echo.
echo ========================================
echo   Servidor WEBCAM - NO CIERRES ESTA VENTANA
echo ========================================
echo.
echo   PC:     https://localhost:8443
echo   MOVIL:  https://%IP%:8443
echo.
echo   Si el movil NO carga:
echo   1) Misma WiFi (no datos 4G/5G)
echo   2) Ejecuta ABRIR-FIREWALL.bat (clic derecho - admin)
echo   3) En el movil: Avanzado - Continuar (certificado)
echo.
python serve-https.py
pause
