@echo off
title ENLACE MOVIL - NO CERRAR esta ventana
cd /d "%~dp0"
color 0E

echo.
echo  ============================================================
echo   IMPORTANTE
echo  ============================================================
echo   - Cada vez que abres esto sale un enlace NUEVO
echo   - Los enlaces viejos (trycloudflare) DEJAN de funcionar
echo   - NO CIERRES esta ventana mientras juegues
echo  ============================================================
echo.

set "PATH=%PATH%;%ProgramFiles%\cloudflared;%LOCALAPPDATA%\Microsoft\WinGet\Links"

taskkill /F /IM cloudflared.exe >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8765" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

python abrir-movil.py

echo.
echo  El tunel se cerro. Vuelve a ejecutar ABRIR-EN-MOVIL.bat para un enlace nuevo.
pause
