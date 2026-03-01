@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0set-cors-with-local-credentials.ps1"
pause
