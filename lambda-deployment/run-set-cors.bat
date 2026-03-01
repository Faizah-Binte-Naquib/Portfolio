@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0set-cors.ps1"
pause
