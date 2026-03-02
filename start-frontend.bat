@echo off
echo ========================================
echo   Cyber-Guard AI - Frontend Startup
echo ========================================
echo.

cd frontend

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies
        echo Please run PowerShell as Administrator and execute:
        echo Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed.
)

echo.
echo Starting development server...
echo Frontend will be available at: http://localhost:3000
echo Backend should be running at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
