@echo off
title WEBCAM por Internet (si la IP local no carga)
cd /d "%~dp0"

echo.
echo ====================================================
echo   OPCION FACIL: mismo enlace en PC y movil
echo   (no hace falta abrir puerto 8443 en el router)
echo ====================================================
echo.

where cloudflared >nul 2>&1
if errorlevel 1 (
  echo cloudflared no esta instalado.
  echo Instalando con winget...
  winget install -e --id Cloudflare.cloudflared --accept-package-agreements --accept-source-agreements
  echo.
  if errorlevel 1 (
    echo No se pudo instalar automaticamente.
    echo Descarga manual: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
    pause
    exit /b 1
  )
)

echo Cerrando servidores viejos en 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

echo Iniciando servidor del juego en puerto 8080...
start "PPT-HTTP" /MIN python -m http.server 8080
timeout /t 2 >nul

echo.
echo Abriendo tunel HTTPS (Cloudflare)...
echo.
echo  COPIA el enlace https://....trycloudflare.com que salga abajo
echo  y abrelo en el PC y en el MOVIL (el mismo en los dos).
echo.
echo  Modo Webcam - Crear sala - Unirse con el codigo
echo.
echo  NO CIERRES ESTA VENTANA
echo ====================================================
echo.

cloudflared tunnel --url http://127.0.0.1:8080

pause
