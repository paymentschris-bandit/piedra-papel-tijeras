@echo off
:: Ejecutar SIEMPRE como administrador (clic derecho)
cd /d "%~dp0"

net session >nul 2>&1
if %errorlevel% neq 0 (
  echo.
  echo *** NECESITAS CLIC DERECHO - Ejecutar como administrador ***
  echo.
  pause
  exit /b 1
)

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do set IP=%%a
set IP=%IP: =%

echo Abriendo puertos y Python en el firewall...

netsh advfirewall firewall delete rule name="PPT Webcam HTTPS" >nul 2>&1
netsh advfirewall firewall delete rule name="PPT Juego HTTP" >nul 2>&1
netsh advfirewall firewall delete rule name="PPT Python" >nul 2>&1

netsh advfirewall firewall add rule name="PPT Webcam HTTPS" dir=in action=allow protocol=TCP localport=8443 profile=any
netsh advfirewall firewall add rule name="PPT Juego HTTP" dir=in action=allow protocol=TCP localport=8080 profile=any

for /f "delims=" %%p in ('where python 2^>nul') do (
  netsh advfirewall firewall add rule name="PPT Python" dir=in action=allow program="%%p" enable=yes profile=any
  goto :pydone
)
:pydone

echo.
echo ========================================
echo   FIREWALL LISTO
echo ========================================
echo.
echo Prueba en el MOVIL (misma WiFi, sin 4G):
echo.
echo   1) http://%IP%:8080/test-movil.html
echo      ^(si NO carga, el router bloquea - usa WEBCAM-INTERNET.bat^)
echo.
echo   2) https://%IP%:8443
echo      ^(webcam - acepta certificado^)
echo.
pause
