@echo off
cd /d %~dp0
setlocal
echo ==========================================
echo    CORE_OS FULL-STACK INITIALIZER
echo ==========================================
echo.

:: 1. Start the Backend (Java/Python Agent)
echo [1/3] Launching Security Bridge in new window...
start "CORE_OS Backend Agent" cmd /c "run.bat"

:: 2. Setup Frontend
echo [2/3] Preparing Frontend Dashboard (NPM)...
cd frontend
call npm install --quiet

:: 3. Start Frontend and Open Browser
echo [3/3] Starting Dashboard UI...
echo.
echo >>> PROJECT IS STARTING! 
echo >>> Your browser will open automatically.
echo.
start "CORE_OS Frontend" cmd /c "npm run dev"

:: Wait a few seconds for Vite to start, then open the URL
timeout /t 5 >nul
start http://localhost:5173/SYSTEM-VULRENABILITIES-/

echo ==========================================
echo    ALL SYSTEMS ONLINE!
echo ==========================================
pause
