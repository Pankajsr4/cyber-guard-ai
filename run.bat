@echo off
REM Cyber-Guard AI Moderation Engine - Quick Start Script (Windows)

echo.
echo ===========================================
echo   Cyber-Guard AI Moderation Engine
echo ===========================================
echo.

REM Start Backend in a new window
echo Starting Backend (FastAPI) on http://localhost:8000 ...
start "CyberGuard Backend" cmd /k "cd /d %~dp0 && venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

REM Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

REM Start Frontend in a new window
echo Starting Frontend (Next.js) on http://localhost:3000 ...
start "CyberGuard Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"

echo.
echo Both servers are starting...
echo.
echo   Backend  -^>  http://localhost:8000
echo   Frontend -^>  http://localhost:3000
echo   API Docs -^>  http://localhost:8000/docs
echo.
echo Close the opened terminal windows to stop the servers.
echo.
pause
