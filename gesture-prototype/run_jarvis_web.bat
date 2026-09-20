@echo off
title JARVIS Voice & Vision Controller
echo ==========================================================
echo Starting JARVIS Local Server (Speech & Vision Enabled)...
echo ==========================================================
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
pause
